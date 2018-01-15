import { MIDIController, MIDIControllerType, MIDIInput, MIDIOutput, MIDIListenerType } from "./midi";

export class GenericMIDIController implements MIDIController {
    id: string;
    type?: MIDIControllerType = MIDIControllerType.Controller;
    name: string;
    input: MIDIInput;
    output: MIDIOutput;
    channel: number | 'all' = 'all';

    private inputListener: any;

    constructor(genericDevice: MIDIController) {
        this.updateSettings(genericDevice);
    }

    updateSettings(genericDevice: MIDIController) {
        this.id = <string>genericDevice.id || this.id;
        this.input = genericDevice.input;
        this.output = genericDevice.output;
        this.channel = genericDevice.channel || 'all';

        this.inputListener = this.input.removeListener().addListener(MIDIListenerType.CC, this.channel, event => {
            console.log('controller event', event.data);
        });
    }

    disconnect() {
        this.input.removeListener(MIDIListenerType.CC, this.channel, this.inputListener);
    }
}