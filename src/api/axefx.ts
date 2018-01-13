import { AXE_FUNCTIONS, SYSEX_START, HEADER, TUNER_CC, METRONOME_CC, PARAM_VALUE_MULTIPLIER } from './constants';
import { MIDIController, MIDIInput, MIDIOutput, MIDIControllerType, MIDIListenerType } from './midi';
import { getObjKeyByValue, textDecoder, intTo2Byte, bytes2ToInt, parameterValueIntToBytes, parameterValueBytesToInt, midiValueToAxeFx, intValueToAxeFx, axeFxValueToInt } from '../util/util';
import { IFxBlock, FxBlock, getBlockById } from './fx-block';

export enum PARAM_MODE {
    Set = 0x01,
    Get = 0x00
}

export interface AxeFxResponse {
    data: Uint8Array
}

export class AxeFx implements MIDIController {
    id: number;
    name: string;
    type: MIDIControllerType = MIDIControllerType.AxeFx;
    input: MIDIInput;
    output: MIDIOutput;
    channel: number | 'all';

    private inputListener: any;
    private blocks: FxBlock[] = [];
    private resolvers: any = {};
    private tunerEnabled: boolean = false;
    private metronomeEnabled: boolean = false;

    constructor(axeFxDevice: MIDIController) {
        this.id = <number>axeFxDevice.id;
        this.name = axeFxDevice.name;
        this.input = axeFxDevice.input;
        this.output = axeFxDevice.output;
        this.channel = axeFxDevice.channel || 'all';

        console.log('device', axeFxDevice);

        this.inputListener = (event: AxeFxResponse) => this.processEvent(
            event.data[5], 
            event.data.slice(6, event.data.length - 2)
        );

        this.input.addListener(MIDIListenerType.SysEx, this.channel, this.inputListener);
    }

    private getChecksum(message: number[]): number {
        const part: number = [
            SYSEX_START,
            ...HEADER,
            this.id,
            ...message
        ].reduce((checksum: number, val: number) => checksum ^ val);
        return part & 0x7F;
    }

    sendMessage(message: number[]): MIDIOutput {
        const value: number[] = [this.id, ...message, this.getChecksum(message)];
        console.log('sending SysEx message', value);
        return this.output.sendSysex(HEADER, value);
    }

    sendCC(cc: number, value: number): MIDIOutput {
        console.log('sending CC', cc, value);
        return this.output.sendControlChange(cc, value);
    }

    getPresetName() {
        this.sendMessage([AXE_FUNCTIONS.getPresetName]);
        this.disconnect();
        return new Promise(resolve => {
            this.resolvers.getPresetName = resolve;
        });
    }

    getPresetNumber() {
        this.sendMessage([AXE_FUNCTIONS.getPresetNumber]);
        this.disconnect();
        return new Promise(resolve => {
            this.resolvers.getPresetNumber = resolve;
        });
    }

    getBlockParametersList(blockId: number) {
        this.sendMessage([
            AXE_FUNCTIONS.getBlockParametersList,
            ...intTo2Byte(blockId)
        ]);
    }

    getBlockParamValue(blockId: number, paramId: number) {
        this.sendMessage([
            AXE_FUNCTIONS.blockParamValue,
            ...intTo2Byte(blockId),
            ...intTo2Byte(paramId),
            ...parameterValueIntToBytes(0),
            PARAM_MODE.Get
        ]);
    }

    getFirmwareVersion() {
        this.sendMessage([AXE_FUNCTIONS.getFirmwareVersion]);
        this.disconnect();
        return new Promise(resolve => {
            this.resolvers.getFirmwareVersion = resolve;
        });
    }

    getMIDIChannel() {
        this.sendMessage([AXE_FUNCTIONS.getMIDIChannel]);
        this.disconnect();
    }

    setTargetBlock(blockId: number) {
        this.sendMessage([AXE_FUNCTIONS.setTargetBlock, ...intTo2Byte(blockId)]);
        this.disconnect();
    }

    setBlockBypass(blockId: number, isBypassed: boolean) {
        this.setBlockParamValue(blockId, 255, Number(isBypassed));
    }

    setBlockParamValue(blockId: number, paramId: number, paramValue: number) {
        const convertedParamValue = intValueToAxeFx(paramValue);
        this.sendMessage([
            AXE_FUNCTIONS.blockParamValue, 
            ...intTo2Byte(blockId),
            ...intTo2Byte(paramId),
            ...parameterValueIntToBytes(convertedParamValue),
            PARAM_MODE.Set
        ]);
    }

    toggleTuner() {
        this.tunerEnabled = !this.tunerEnabled;
        this.sendCC(TUNER_CC, this.tunerEnabled ? 127 : 0);
    }

    toggleMetronome() {
        this.metronomeEnabled = !this.metronomeEnabled;
        this.sendCC(METRONOME_CC, this.metronomeEnabled ? 127 : 0);
    }

    disconnect(): void {
        this.sendMessage([0x42]);
    }

    processEvent(func: number, data: Uint8Array) {
        let value;
        switch (func) {
            case AXE_FUNCTIONS.getFirmwareVersion:
                value = data[0] + '.' + data[1];
                this.resolvers.getFirmwareVersion(value);
                break;
            case AXE_FUNCTIONS.getPresetName:
                value = textDecoder.decode(data).trim();
                this.resolvers.getPresetName(value);
                break;
            case AXE_FUNCTIONS.getPresetNumber:
                value = bytes2ToInt(data);
                this.resolvers.getPresetNumber(value);
                break;
            case AXE_FUNCTIONS.getPresetEditedStatus:
                value = !!data[0];
                break;
            case AXE_FUNCTIONS.getMIDIChannel:
                value = data[0];
                break;
            case AXE_FUNCTIONS.getBlockParametersList:
                const blockId = bytes2ToInt(data.slice(0, 2));
                const paramId = bytes2ToInt(data.slice(2, 4));
                const paramValues = axeFxValueToInt(parameterValueBytesToInt(data.slice(4, 7)));
                value = {blockId, paramId, paramValues};
                break;
            case AXE_FUNCTIONS.blockParamValue:
                value = data;
                console.log('param value', (parameterValueBytesToInt(data.slice(4,7)) / PARAM_VALUE_MULTIPLIER).toFixed(2));
                break;
            default:
                value = data;
        }
        console.log('event data', getObjKeyByValue(func, AXE_FUNCTIONS), value);
        return value;
    } 
}
