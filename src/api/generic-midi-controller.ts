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

    attachParamListener() {
        this.input.removeListener().addListener(MIDIListenerType.CC, this.channel, debounce(event => {
            console.log('controller event data', event.data);
            const cc = event.data[1];
            let value = event.data[2];
            const panelActivatedByCC = getStoreStateSlice('panels').find(p => p.cc === cc);
            if (panelActivatedByCC) {
                // Switch to panel
                this.history.push(`/panels/${panelActivatedByCC.id}`);
            } else {
                // Change control
                const currentPanel = getStoreStateSlice('currentPanel');
                const control: ControlObject = currentPanel.controls.find(ctrl => ctrl.cc === cc);
                if (!control) return;
                const { param } = getBlockAndParam(control.blockId, control.paramId);
                if (control && param) {
                    let useFloatValue = false;
                    if (control.isRelative) {
                        useFloatValue = true;
                        if (param.type === PARAM_TYPE.Select) {
                            value = resolveRelativeValue(value, control.rawValue, param.step, param.range);
                        } else {
                            value = resolveRelativeValue(value, control.rawValue, param.step);
                        }
                    }
                    const axeFx = getAxeFxInstance();
                    axeFx.setBlockParamValue(control.blockId, control.paramId, value, useFloatValue);
                }
            }
        }, DEBOUNCE_TIME));
    }
}