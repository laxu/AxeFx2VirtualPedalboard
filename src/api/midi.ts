import { SYSEX_ENABLED } from './constants';
const WebMidi = require('webmidi');

export interface MIDIInput {
    name: string;
    addListener: (type: string, channel: number | 'all', listener: any) => MIDIInput;
    removeListener: (type: string, channel: number | 'all', listener: any) => MIDIInput;
}

export interface MIDIOutput {
    name: string;
    sendControlChange: (controlChange: number, value?: number, channel?: number | 'all', options?: any) => MIDIOutput;
    sendSysex: (header: number[], message: number[], options?: any) => MIDIOutput;
}

export enum MIDIControllerType {
    AxeFx = 'Axe-Fx',
    Controller = 'MIDI controller'
}

export enum MIDIListenerType {
    CC = 'controlchange',
    SysEx = 'sysex'
}

export interface MIDIController {
    id: number | string;
    name: string,
    type: MIDIControllerType;
    input: MIDIInput;
    output: MIDIOutput;
    channel?: number | 'all';
}

export class WebMidiWrapper {
    static webMidi = WebMidi;

    static init(callback: any) {
        this.webMidi.enable((err: any) => {
            if (err) {
                console.log('WebMidi could not be enabled.', err);
            } else {
                console.log('WebMidi enabled!');
                console.log('inputs', this.webMidi.inputs);
                console.log('outputs', this.webMidi.outputs);
            }
            callback();
        }, SYSEX_ENABLED);
    }
}
