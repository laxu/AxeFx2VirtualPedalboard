import { MIDIController, MIDIControllerType, MIDIInput, MIDIOutput, MIDIListenerType } from "./midi";
import { updateControllerAction } from "../store/actions";

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

    constructor(genericDevice: MIDIController, dispatch) {
        this.dispatch = dispatch;
        this.updateSettings(genericDevice);
    }

    updateSettings(genericDevice: MIDIController) {
        this.id = <string>genericDevice.id || this.id;
        this.name = genericDevice.input && genericDevice.input.name;
        this.input = genericDevice.input;
        this.output = genericDevice.output;
        this.channel = genericDevice.channel || 'all';

        if (this.input) {
            this.connected = true;
        }

        this.dispatch(updateControllerAction({
            name: this.name,
            connected: this.connected
        }));
    }

    disconnect() {
        this.connected = false;
        this.name = null;
        this.dispatch(updateControllerAction({
            name: this.name,
            connected: this.connected
        }));
    }
}