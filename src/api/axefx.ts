import { AXE_FUNCTIONS, SYSEX_START, HEADER, TUNER_CC, METRONOME_CC, PARAM_VALUE_MULTIPLIER, MODEL_IDS } from './constants';
import { MIDIController, MIDIInput, MIDIOutput, MIDIControllerType, MIDIListenerType } from './midi';
import { getObjKeyByValue, textDecoder, intTo2Byte, bytes2ToInt, parameterValueIntToBytes, parameterValueBytesToInt, midiValueToAxeFx, axeFxValueToFloat, bytesToPresetNumber } from '../util/util';
import { IFxBlock, FxBlock, getBlockById, getBlockAndParam } from './fx-block';
import { resetAxeFxAction, updateAxeFxAction, updateControlValueAction, refreshCurrentPanelAction } from '../store/actions';
import { PARAM_TYPE } from './fx-block-data/index';

export enum PARAM_MODE {
    Set = 0x01,
    Get = 0x00
}

export interface AxeFxResponse {
    data: Uint8Array
}

export interface AxeFxState {
    connected: boolean;
    name: string;
    firmwareVersion: string;
    currentPresetName: string;
    currentPresetNumber: number;
    presetEdited: boolean;
}

export class AxeFx implements MIDIController {
    id: number;
    name: string;
    type?: MIDIControllerType = MIDIControllerType.AxeFx;
    input: MIDIInput;
    output: MIDIOutput;
    channel: number | 'all';

    public connected: boolean = false;
    public firmwareVersion: string;
    public presetEdited: boolean = false;
    public currentPresetName: string;
    public currentPresetNumber: number;

    private dispatch: any;
    private inputListener: (event: AxeFxResponse) => void;
    private resolvers: any = {};
    private tunerEnabled: boolean = false;
    private metronomeEnabled: boolean = false;

    constructor(axeFxDevice: MIDIController, dispatch) {
        this.dispatch = dispatch;
        this.updateSettings(axeFxDevice);
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

    async updateSettings(axeFxDevice: MIDIController) {
        this.input = axeFxDevice.input;
        this.output = axeFxDevice.output;
        this.channel = axeFxDevice.channel || 'all';

        if (!this.input) {
            this.connected = false;
            return;
        }

        this.inputListener = (event: AxeFxResponse) => this.processEvent(
            event.data[5], 
            event.data.slice(6, event.data.length - 2),
            event.data
        );

        this.input.removeListener().addListener(MIDIListenerType.SysEx, this.channel, this.inputListener);

        this.findModel().then(() => {
            this.dispatch(resetAxeFxAction());
            this.getPresetNumber();
            this.dispatch(updateAxeFxAction({
                firmwareVersion: this.firmwareVersion,
                connected: this.connected,
                name: this.name
            }));
        });
    }

    findModel() {
        let fwVersion;
        return new Promise(async (resolve, reject) => {
            for (const name in MODEL_IDS) {
                if (MODEL_IDS.hasOwnProperty(name)) {
                    this.id = MODEL_IDS[name];
                    this.name = name;
                    try {
                        fwVersion = await this.getFirmwareVersion();
                        if (fwVersion) {
                            this.id = MODEL_IDS[name]
                            this.name = name;
                            resolve();
                            break;
                        }
                    } catch(e) {
                        if (!fwVersion && name === 'AX8') {
                            reject('Could not connect to Axe-Fx hardware');
                        }
                    }
                }
            }
        });
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
    }

    getPresetNumber() {
        this.sendMessage([AXE_FUNCTIONS.getPresetNumber]);
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

    async getFirmwareVersion() {
        this.sendMessage([AXE_FUNCTIONS.getFirmwareVersion]);
        return new Promise((resolve, reject) => {
            this.resolvers.getFirmwareVersion = resolve;
            setTimeout(() => reject('Could not get firmware'), 300);
        });
    }

    getMIDIChannel() {
        this.sendMessage([AXE_FUNCTIONS.getMIDIChannel]);
    }

    setTargetBlock(blockId: number) {
        this.sendMessage([AXE_FUNCTIONS.setTargetBlock, ...intTo2Byte(blockId)]);
    }

    setBlockBypass(blockId: number, isBypassed: boolean) {
        this.setBlockParamValue(blockId, 255, Number(isBypassed));
    }

    setBlockParamValue(blockId: number, paramId: number, paramValue: number, useRawValue: boolean = false) {
        const { block, param } = getBlockAndParam(blockId, paramId);
        const convertedParamValue = useRawValue ? paramValue : midiValueToAxeFx(paramValue);
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
        this.connected = false;
        this.dispatch(updateAxeFxAction({ connected: this.connected }));
    }

    resolveParamValue(blockId: number, paramId: number, paramValue: Uint8Array) {
        const { block, param } = getBlockAndParam(blockId, paramId);
        if (block && param) {
            let value = parameterValueBytesToInt(paramValue);
            if (param.type === PARAM_TYPE.Knob) {
                value = axeFxValueToFloat(parameterValueBytesToInt(paramValue));
            }
            return param.formatValue(value);
        }
        return null;
    }

    processEvent(func: number, data: Uint8Array, rawData: Uint8Array): void {
        let value, paramValueObj;
        switch (func) {
            case AXE_FUNCTIONS.getFirmwareVersion:
                value = data[0] + '.' + data[1];
                this.firmwareVersion = value;
                if (value) this.connected = true;
                this.resolvers.getFirmwareVersion(value);
                break;
                
            case AXE_FUNCTIONS.getPresetName:
                value = textDecoder.decode(data.slice(0, -2)).trim();
                this.currentPresetName = value;
                this.dispatch(updateAxeFxAction({ currentPresetName: value }))
                break;

            case AXE_FUNCTIONS.getPresetNumber:
                value = bytesToPresetNumber(data, this.id);
                this.currentPresetNumber = value;
                this.getPresetName();
                this.dispatch(updateAxeFxAction({ currentPresetNumber: value }))
                break;

            case AXE_FUNCTIONS.getPresetEditedStatus:
                value = !!data[0];
                this.presetEdited = value;
                this.dispatch(updateAxeFxAction({ presetEdited: value }))
                break;

            case AXE_FUNCTIONS.frontPanelChange:
                this.dispatch(refreshCurrentPanelAction(true));
                break;

            case AXE_FUNCTIONS.getMIDIChannel:
                value = data[0];
                this.channel = value;
                break;

            case AXE_FUNCTIONS.getBlockParametersList:
                value = {
                    blockId: bytes2ToInt(data.slice(0, 2)),
                    paramId:  bytes2ToInt(data.slice(2, 4)),
                }
                value.paramValue = this.resolveParamValue(value.blockId, value.paramId, data.slice(4, 7));
                break;

            case AXE_FUNCTIONS.blockParamValue:
                value = {
                    blockId: bytes2ToInt(data.slice(0, 2)),
                    paramId:  bytes2ToInt(data.slice(2, 4)),
                }
                value.paramValue = this.resolveParamValue(value.blockId, value.paramId, data.slice(4, 7));
                console.log('received param value', value);
                this.dispatch(updateControlValueAction(value));
                break;

            default:
                value = data;
        }
        const funcName = getObjKeyByValue(func, AXE_FUNCTIONS);
        if (funcName && data.length) {
            console.log('Axe-Fx sent:', funcName, value);
        }
    } 
}
