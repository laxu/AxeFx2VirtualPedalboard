import { SYSEX_ENABLED } from './constants';
import { AxeFx } from './axefx';
import { GenericMIDIController } from './generic-midi-controller';
const WebMidi = require('webmidi');

let axeFxInstance, controllerInstance;

export interface MIDIInput {
    name: string;
    addListener: (type: string, channel: number | 'all', listener: any) => MIDIInput;
    removeListener: (type?: string, channel?: number | 'all', listener?: any) => MIDIInput;
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
    type?: MIDIControllerType;
    input: MIDIInput;
    output: MIDIOutput;
    channel?: number | 'all';
}

export interface MIDIDeviceData {
    id: string;
    type: MIDIControllerType;
    inputName: string;
    outputName: string;
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

export function isAxeFx(device: MIDIInput | MIDIOutput) {
    return device.name.indexOf('AXE-FX') !== -1 || device.name.indexOf('AX8') !== -1;
}

export function updateDevices(devices: MIDIDeviceData[], dispatch: any): void {
    return devices.forEach(device => {
        if (device.type === MIDIControllerType.AxeFx) {
            if (axeFxInstance) {
                // Update existing
                axeFxInstance.updateSettings({
                    input: WebMidiWrapper.webMidi.getInputByName(device.inputName),
                    output: WebMidiWrapper.webMidi.getOutputByName(device.outputName),
                    channel: device.channel
                });
            } else {
                axeFxInstance = new AxeFx({
                    input: WebMidiWrapper.webMidi.getInputByName(device.inputName),
                    output: WebMidiWrapper.webMidi.getOutputByName(device.outputName),
                    channel: device.channel,
                }, dispatch);
            }
        } else {
            if (controllerInstance) {
                controllerInstance.updateSettings({
                    input: WebMidiWrapper.webMidi.getInputByName(device.inputName),
                    output: WebMidiWrapper.webMidi.getOutputByName(device.outputName),
                    channel: device.channel
                });
            } else {
                controllerInstance = new GenericMIDIController({
                    input: WebMidiWrapper.webMidi.getInputByName(device.inputName),
                    output: WebMidiWrapper.webMidi.getOutputByName(device.outputName),
                    channel: device.channel
                });
            }
           
        }
    });
}

export function getAxeFxInstance() {
    return axeFxInstance;
}

export function getControllerInstance() {
    return controllerInstance;
}