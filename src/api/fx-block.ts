import { clampValue, getObjKeyByValue } from "../util/util";
import { FX_PARAM_IDS, FX_PARAM_LABELS } from "./fx-block-data";

export interface IFxBlock {
    id: number;
    engaged: boolean;
    isX: boolean;
    parameters: IFxParam[];
}

export interface IFxParam {
    blockGroup: string;
    id: number;
    value: number;
    step?: number;
    cc?: number;
    range?: [number, number];
    label?: string;
}

export class FxBlock implements IFxBlock {
    id: number;
    engaged: boolean;
    isX: boolean;
    parameters: FxParam[];
    label: string;

    constructor(fxBlockSettings: IFxBlock) {
        this.id = fxBlockSettings.id;
        this.engaged = fxBlockSettings.engaged || true;
        this.isX = fxBlockSettings.engaged || true;
        this.parameters = fxBlockSettings.parameters || [];
    }

    getParamValue(paramId: number) {
        const param = this.parameters.find(param => param.id === paramId);
        if (!param) return null;
        return param.value;
    }

    setParamValue(paramId: number, paramValue: number) {
        const param = this.parameters.find(param => param.id === paramId);
        if (!param) throw new Error('Cannot set value of non-existent param!');
        param.value = paramValue;
    }
}

export class FxParam implements IFxParam {
    blockGroup: string;
    id: number;
    step?: number;
    cc?: number;
    range?: [number, number];
    label?: string;

    constructor(paramSettings: IFxParam) {
        this.id = paramSettings.id;
        this.step = paramSettings.step || 0.1;
        this.range = paramSettings.range || [0,10];
        this.label = FX_PARAM_LABELS[this.blockGroup + this.id];
    }

    set value(val: number) {
        if (!isFinite(val)) throw new Error('Trying to set non-numeric param value!');
        this.value = clampValue(val, this.range, this.step);
    }
}