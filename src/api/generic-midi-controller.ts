import { MIDIController, MIDIControllerType, MIDIInput, MIDIOutput, MIDIListenerType, getAxeFxInstance } from "./midi";
import { updateControllerAction } from "../store/actions";
import { DEBOUNCE_TIME } from "./constants";
import { resolveRelativeValue, debounce, generateId } from "../util/util";
import { getBlockAndParam } from "./fx-block";
import { ControlObject } from "./control-object";
import { getStoreStateSlice } from "../store/store";
import { PARAM_TYPE } from "./fx-block-data/fx-block-data";

export interface ControllerState {
    name: string;
    connected: boolean;
};

export class GenericMIDIController implements MIDIController {
    id: string;
    type?: MIDIControllerType = MIDIControllerType.Controller;
    connected: boolean = false;
    name: string;
    input: MIDIInput;
    output: MIDIOutput;
    channel: number | 'all' = 'all';

    private inputListener: any;
    private dispatch: any;
    private history: any;

    private velocities = {};

    constructor(dispatch, history) {
        this.id = generateId();
        this.dispatch = dispatch;
        this.history = history;
    }

    updateSettings(genericDevice: MIDIController) {
        this.id = <string>genericDevice.id || this.id;
        this.name = genericDevice.input && genericDevice.input.name;
        this.input = genericDevice.input;
        this.output = genericDevice.output;
        this.channel = genericDevice.channel || 'all';
        this.connect();
    }

    connect(): boolean {
        if (this.input) {
            this.connected = true;
            this.attachParamListener();
            this.dispatch(updateControllerAction({
                name: this.name,
                connected: this.connected
            }));
        } else {
            this.connected = false;
        }
        return this.connected;
    }

    disconnect(): void {
        this.connected = false;
        this.name = null;
        this.dispatch(updateControllerAction({
            connected: this.connected
        }));
    }

    getVelocity(cc: number, value: number, isRelative: boolean): number {
        if (!this.velocities[cc]) {
            this.velocities[cc] = { velocity: 1, eventCount: 1, previousValue: value, previousDirection: 0 };
            return 1;
        }

        const obj = this.velocities[cc];
        clearTimeout(obj.timer);
        // const currentEventTime = Date.now().valueOf();
        obj.eventCount++;
        obj.velocity += Math.pow(0.01, obj.eventCount);
        
        obj.timer = setTimeout(() => {
            console.log('clearing', cc);
            clearTimeout(obj.timer);
            this.velocities[cc] = null;
        }, 500);

        let direction: number;
        if (isRelative) {
            direction = value > 64 ? 1 : -1;
        } else {
            direction = value > obj.previousValue ? 1 : -1;
        }
        if (direction !== obj.previousDirection) {
            obj.velocity = 1;
            obj.eventCount = 1;
        }
        obj.previousDirection = 1;
        obj.previousValue = value;
        return obj.velocity * direction;
    }

    attachParamListener(): void {
        this.input.removeListener().addListener(MIDIListenerType.CC, this.channel, event => {
            console.log('controller event data', event.data);
            const cc = event.data[1];
            let value = event.data[2];
            const boardActivatedByCC = getStoreStateSlice('board', 'boards').find(p => p.cc === cc);
            if (boardActivatedByCC) {
                // Switch to board
                this.history.push(`/boards/${boardActivatedByCC.id}`);
            } else {
                // Change control
                const currentBoard = getStoreStateSlice('board', 'currentBoard');
                const control: ControlObject = currentBoard.controls.find(ctrl => ctrl.cc === cc);
                if (!control) return;
                const { param } = getBlockAndParam(control.blockId, control.paramId);
                if (control && param) {
                    let useFloatValue = false;
                    if (param.type === PARAM_TYPE.Knob) {
                        const velocity = this.getVelocity(cc, value, control.isRelative);
                        value *= velocity;
                        console.log('fuu', value, velocity);
                    }
                    if (control.isRelative) {
                        useFloatValue = true;
                        if (param.type === PARAM_TYPE.Select) {
                            const range: [number, number] = Array.isArray(param.values) ? [0, param.values.length - 1] : param.range;
                            value = resolveRelativeValue(value, control.rawValue, param.step, range);
                        } else {
                            value = resolveRelativeValue(value, control.rawValue, param.step);
                        }
                    }
                    if (value === control.rawValue) return;
                    const axeFx = getAxeFxInstance();
                    axeFx.setBlockParamValue(control.blockId, control.paramId, value, useFloatValue);
                }
            }
        });
    }
}