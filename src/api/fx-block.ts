import { clampValue, getObjKeyByValue } from "../util/util";
import { FX_BLOCK_IDS, FX_BLOCK_TYPES, FX_PARAMS, PARAM_TYPE, FX_BLOCK_LABELS } from "./fx-block-data";

export interface IFxBlock {
    id: number;
    engaged?: boolean;
    isX?: boolean;
    parameters: IFxParam[];
    label: string;
}

export interface IFxParam {
    blockGroup: string;
    id: number;
    type: PARAM_TYPE;
    value: number;
    step?: number;
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
        this.label = fxBlockSettings.label || 'Unknown block';
    }

    getParam(paramId: number): FxParam {
       return this.parameters.find(param => param.id === paramId) || null;
    }

    getParamValue(paramId: number): number {
        const param = this.getParam(paramId);
        if (!param) return null;
        return param.value;
    }

    setParamValue(paramId: number, paramValue: number): void {
        const param = this.parameters.find(param => param.id === paramId);
        if (!param) throw new Error('Cannot set value of non-existent param!');
        param.value = paramValue;
    }
}

export class FxParam implements IFxParam {
    blockGroup: string;
    id: number;
    type: PARAM_TYPE;
    step?: number;
    range?: [number, number];
    label?: string;

    constructor(paramSettings: IFxParam) {
        this.blockGroup = paramSettings.blockGroup;
        this.type = paramSettings.type;
        this.id = paramSettings.id;
        this.step = paramSettings.step || 0.1;
        this.range = paramSettings.range || [0,10];
        this.label = paramSettings.label;
    }

    set value(val: number) {
        if (!isFinite(val)) throw new Error('Trying to set non-numeric param value!');
        this.value = clampValue(val, this.range, this.step);
    }
}

// Build blocks
export const blocks = [];

for (const blockType of FX_BLOCK_TYPES) {
    let counter = 0;
    let blockName = blockType + counter;
    while(FX_BLOCK_IDS[blockName]) {
        const id = FX_BLOCK_IDS[blockName];
        let parameters = [];
        if (FX_PARAMS[blockType]) {
            parameters = FX_PARAMS[blockType].map(param => new FxParam({ blockGroup: blockType, ...param }));
        }
        blocks.push(new FxBlock({ id, parameters }));
        counter++;
        blockName = blockType + counter;
    }
}

export function getBlockById(blockId: number): FxBlock {
    if (!blockId) throw new Error('getBlockById: Block ID is undefined!');
    return blocks.find(block => block.id === blockId) || null;
}