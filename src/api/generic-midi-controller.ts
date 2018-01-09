import { MIDIController, MIDIControllerType, MIDIInput, MIDIOutput, MIDIListenerType } from "./midi";

export class GenericMIDIController implements MIDIController {
    id: string;
    type: MIDIControllerType = MIDIControllerType.Controller;
    name: string;
    input: MIDIInput;
    output: MIDIOutput;
    channel: number | 'all' = 'all';

    private inputListener: any;

    constructor(genericDevice: MIDIController) {
        this.id = <string>genericDevice.id;
        this.name = genericDevice.name;
        this.input = genericDevice.input;
        this.output = genericDevice.output;

        this.inputListener = this.input.addListener(MIDIListenerType.CC, this.channel, event => {
            console.log('controller event', event.data);
        });
    }

    setMIDIChannel(channel: number | 'all') {
        this.channel = channel;
    }

    disconnect() {
        this.input.removeListener('controlchange', 'all', this.inputListener);
    }
}