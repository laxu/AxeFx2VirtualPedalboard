import { MIDIController, MIDIControllerType, MIDIInput, MIDIOutput, MIDIListenerType, getAxeFxInstance } from "./midi";
import { updateControllerAction, setBoardAction } from "../store/actions";
import { DEBOUNCE_TIME } from "./constants";
import { resolveRelativeValue, debounce, generateId } from "../util/util";
import { getBlockAndParam, FxBlock, FxParam } from "./fx-block";
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

    constructor(dispatch) {
        this.id = generateId();
        this.dispatch = dispatch;
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

    attachParamListener(): void {
        this.input.removeListener().addListener(MIDIListenerType.CC, this.channel, this.eventHandler.bind(this));
    }

    eventHandler(event) {
        const cc = event.controller.number;
        let value = event.value;
        const boardActivatedByCC = getStoreStateSlice('board', 'boards').find(p => p.cc === cc);
        if (boardActivatedByCC) {
            // Switch to board
            this.dispatch(setBoardAction(boardActivatedByCC));
            return;
        }
        // Change control
        const currentBoard = getStoreStateSlice('board', 'currentBoard');
        const control = currentBoard.ccMap[cc];
        if (!control) return;
        const { param } = getBlockAndParam(control.blockId, control.paramId);
        
        if (control && param) {
            let useFloatValue = false;
            if (control.isRelative) {
                useFloatValue = true;
                if (param.type === PARAM_TYPE.Select) {
                    const range: [number, number] = param.getRange();
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
}