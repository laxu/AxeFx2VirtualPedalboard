import { AXE_FUNCTIONS, SYSEX_START, HEADER, TUNER_CC, METRONOME_CC, PARAM_VALUE_MULTIPLIER, MODEL_IDS } from './constants';
import { MIDIController, MIDIInput, MIDIOutput, MIDIControllerType, MIDIListenerType } from './midi';
import { getObjKeyByValue, textDecoder, intTo2Byte, bytes2ToInt, parameterValueIntToBytes, parameterValueBytesToInt, midiValueToAxeFx, axeFxValueToFloat, bytesToPresetNumber, floatValueToAxeFx } from '../util/util';
import { FxBlock, getBlockById, getBlockAndParam } from './fx-block';
import { resetAxeFxAction, updateAxeFxAction, updateControlValueAction, refreshCurrentBoardAction } from '../store/actions';
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
    currentScene: number,
    presetEdited: boolean;
}

interface FirmwareVersionEvent {
    modelId: number,
    version: string
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
    public cabNames: string[] = [];

    private dispatch: any;
    private tunerEnabled: boolean = false;
    private metronomeEnabled: boolean = false;
    private connectionPromise = {
        promise: null,
        resolve: null,
        reject: null
    };

    constructor(dispatch) {
        this.dispatch = dispatch;
        this.inputListener = this.inputListener.bind(this);
    }

    private createConnectionPromise() {
        this.connectionPromise.promise = new Promise((resolve, reject) => {
            this.connectionPromise.resolve = resolve;
            this.connectionPromise.reject = reject;
        }).then(({ modelId, version }) => {
            this.connected = true;
            this.firmwareVersion = version;
            this.id = modelId;
            this.name = getObjKeyByValue(modelId, MODEL_IDS);
            this.getPresetNumber();
            this.getSceneNumber();
            this.cabNames = [];
            this.getAllCabNames();
            this.dispatch(updateAxeFxAction({
                firmwareVersion: this.firmwareVersion,
                connected: this.connected,
                name: this.name
            }));
            this.clearConnectionPromise();
        });
    }

    private clearConnectionPromise() {
        this.connectionPromise = {
            promise: null,
            resolve: null,
            reject: null
        }
    }

    private getChecksum(message: number[]): number {
        const part: number = [
            SYSEX_START,
            ...HEADER,
            this.id,
            ...message
        ].reduce((checksum: number, val: number) => checksum ^ val, 0);
        return part & 0x7F;
    }

    updateSettings(axeFxDevice: MIDIController): void {
        const prevInput = this.input;
        const prevOutput = this.output;
        const prevChannel = this.channel;

        this.input = axeFxDevice.input;
        this.output = axeFxDevice.output;
        this.channel = axeFxDevice.channel || 'all';

        if (this.input !== prevInput || this.output !== prevOutput || this.channel !== prevChannel) {
            prevInput && prevInput.removeListener(MIDIListenerType.SysEx, prevChannel, this.inputListener);
            this.connected = false;
            this.connect();
        }
    }

    connect(): void {
        if (!this.input || !this.output) {
            this.connected = false;
            return;
        }

        this.createConnectionPromise();

        this.input.removeListener().addListener(MIDIListenerType.SysEx, this.channel, this.inputListener);
        
        this.dispatch(resetAxeFxAction());
        
        this.queryAxeFxModel();
    }

    disconnect(): void {
        this.sendMessage([AXE_FUNCTIONS.disconnect]);
        this.connected = false;
        this.dispatch(updateAxeFxAction({ connected: this.connected }));
        this.clearConnectionPromise();
    }

    inputListener(event: AxeFxResponse) {
        return this.processEvent(
            event.data[5], 
            event.data.slice(6, event.data.length - 2),
            event.data
        );
    }

    queryAxeFxModel(): void {
        for (const name in MODEL_IDS) {
            if (MODEL_IDS.hasOwnProperty(name)) {
                this.id = MODEL_IDS[name];
                this.getFirmwareVersion();
            }
        }
    }

    sendMessage(message: number[]): MIDIOutput {
        if (!this.output) return;
        const value: number[] = [this.id, ...message, this.getChecksum(message)];
        const command = getObjKeyByValue(message[0], AXE_FUNCTIONS)
        console.log(`sending SysEx command: ${command}`, value);
        return this.output.sendSysex(HEADER, value);
    }

    sendCC(cc: number, value: number): MIDIOutput {
        console.log('sending CC', cc, value);
        return this.output.sendControlChange(cc, value);
    }

    getPresetName(): void {
        this.sendMessage([AXE_FUNCTIONS.getPresetName]);
    }

    getPresetNumber(): void {
        this.sendMessage([AXE_FUNCTIONS.getPresetNumber]);
    }

    getBlockParametersList(blockId: number): void {
        this.sendMessage([
            AXE_FUNCTIONS.getBlockParametersList,
            ...intTo2Byte(blockId)
        ]);
    }

    getBlockParamValue(blockId: number, paramId: number): void {
        this.sendMessage([
            AXE_FUNCTIONS.blockParamValue,
            ...intTo2Byte(blockId),
            ...intTo2Byte(paramId),
            ...parameterValueIntToBytes(0),
            PARAM_MODE.Get
        ]);
    }

    getSceneNumber(): void {
        this.sendMessage([AXE_FUNCTIONS.setSceneNumber, 0x7F]);
    }

    getFirmwareVersion(): void {
        this.sendMessage([AXE_FUNCTIONS.getFirmwareVersion]);
    }

    getMIDIChannel(): void {
        this.sendMessage([AXE_FUNCTIONS.getMIDIChannel]);
    }

    getAllCabNames(): void {
        this.sendMessage([AXE_FUNCTIONS.getCabName, 0x7F, 0x7F]);
    }

    setTargetBlock(blockId: number): void {
        this.sendMessage([AXE_FUNCTIONS.setTargetBlock, ...intTo2Byte(blockId)]);
    }

    setBlockBypass(blockId: number, isBypassed: boolean): void {
        this.setBlockParamValue(blockId, 255, Number(isBypassed));
    }

    setBlockParamValue(blockId: number, paramId: number, paramValue: number, useFloatValue: boolean = false) {
        if (!isFinite(paramValue)) return;
        const { block, param } = getBlockAndParam(blockId, paramId);
        let convertedParamValue;
        if (param.type === PARAM_TYPE.Select) {
            convertedParamValue = paramValue;
        } else {
            convertedParamValue = useFloatValue ? floatValueToAxeFx(paramValue) : midiValueToAxeFx(paramValue);
        }
        
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

    resolveParamValue(blockId: number, paramId: number, paramValue: Uint8Array): { paramValue: number, formattedValue: number | string } {
        const { block, param } = getBlockAndParam(blockId, paramId);
        if (block && param) {
            let value = parameterValueBytesToInt(paramValue);
            if (param.type === PARAM_TYPE.Knob) {
                value = axeFxValueToFloat(value);
            }
            return { paramValue: value, formattedValue: param.formatValue(value) };
        }
        return { paramValue: null, formattedValue: null };
    }

    processEvent(func: number, data: Uint8Array, rawData: Uint8Array): void {
        let value, resolvedValues, paramValueObj;
        switch (func) {
            case AXE_FUNCTIONS.getFirmwareVersion:
                value = data[0] + '.' + data[1];
                const modelId = rawData[4];
                this.connectionPromise.resolve({ modelId, version: value });
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
                this.dispatch(refreshCurrentBoardAction(true));
                break;

            case AXE_FUNCTIONS.getMIDIChannel:
                value = data[0];
                this.channel = value;
                break;
            
            case AXE_FUNCTIONS.getBlockParametersList:
                value = {
                    blockId: bytes2ToInt(data.slice(0, 2)),
                    paramId: bytes2ToInt(data.slice(2, 4)),
                }
                resolvedValues = this.resolveParamValue(value.blockId, value.paramId, data.slice(4, 7));
                value.formattedValue = resolvedValues.formattedValue;
                value.paramValue = resolvedValues.paramValue;
                break;

            case AXE_FUNCTIONS.blockParamValue:
                value = {
                    blockId: bytes2ToInt(data.slice(0, 2)),
                    paramId: bytes2ToInt(data.slice(2, 4)),
                }
                resolvedValues = this.resolveParamValue(value.blockId, value.paramId, data.slice(4, 7));
                value.formattedValue = resolvedValues.formattedValue;
                value.paramValue = resolvedValues.paramValue;
                // console.log('received param value', value);
                this.dispatch(updateControlValueAction(value));
                break;

            case AXE_FUNCTIONS.setSceneNumber:
                value = data[0];
                this.dispatch(updateAxeFxAction({ currentScene: value }));
                break;

            case AXE_FUNCTIONS.getCabName:
                const cabChars = data.slice(2).filter(Boolean);
                value = textDecoder.decode(cabChars).trim();
                this.cabNames.push(value);
                return;
            case AXE_FUNCTIONS.multiResponse:
                const command = getObjKeyByValue(data[0], AXE_FUNCTIONS);
                console.log(`FAS responded: Multipurpose for ${command}, code:`, data[1])
                return;
            case AXE_FUNCTIONS.disconnect:
                console.log('Closing connection to Fractal Audio device');
                break;
            default:
                value = data;
        }
        const funcName = getObjKeyByValue(func, AXE_FUNCTIONS);
        if (funcName && data.length) {
            console.log('FAS responded:', funcName, value);
        }
    } 
}
