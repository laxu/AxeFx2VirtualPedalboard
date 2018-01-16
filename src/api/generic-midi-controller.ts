import { MIDIController, MIDIControllerType, MIDIInput, MIDIOutput, MIDIListenerType } from "./midi";
import { updateControllerAction } from "../store/actions";

export interface ControllerState {
    name: string
};

export class GenericMIDIController implements MIDIController {
    id: string;
    type?: MIDIControllerType = MIDIControllerType.Controller;
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
            this.inputListener = this.input.removeListener().addListener(MIDIListenerType.CC, this.channel, event => {
                console.log('controller event', event.data);
            });
        }

        this.dispatch(updateControllerAction({
            name: this.name
        }));
    }

    disconnect() {
        this.input.removeListener(MIDIListenerType.CC, this.channel, this.inputListener);
    }
}