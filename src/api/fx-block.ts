import { clampValue, getObjKeyByValue, convertToRange, toFixedNumber } from "../util/util";
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
    step?: number;
    precision?: number;
    range?: [number, number];
    label?: string;
    labelGroup?: string;
    values?: string[];
    formatValue: (value: number) => number | string;
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
}

export class FxParam implements IFxParam {
    blockGroup: string;
    id: number;
    type: PARAM_TYPE;
    step?: number;
    precision?: number;
    range?: [number, number];
    label?: string;
    labelGroup?: string;
    values?: string[];

    constructor(paramSettings: IFxParam) {
        this.blockGroup = paramSettings.blockGroup;
        this.type = paramSettings.type;
        this.id = paramSettings.id;
        this.step = paramSettings.step || 0.1;
        this.precision = paramSettings.precision !== undefined ? paramSettings.precision : 2;
        this.range = paramSettings.range || [0,10];
        this.label = paramSettings.label;
        this.labelGroup = paramSettings.labelGroup;
        this.values = paramSettings.values || [];
    }

    formatValue(val: number): number | string {
        if (!isFinite(val)) throw new Error('Trying to set non-numeric param value!');
        if (this.type === PARAM_TYPE.Switch) {
            return val;
        } else if (this.type === PARAM_TYPE.Select && this.values.length) {
            return this.values[val];
        }
        let formattedValue = convertToRange(val, this.range);
        return toFixedNumber(clampValue(formattedValue, this.range, this.step), this.precision);
    }
}

// Build blocks
const blocks = [];

for (const blockType of FX_BLOCK_TYPES) {
    let counter = 1;
    let blockName = blockType + counter;
    while(FX_BLOCK_IDS[blockName]) {
        const id = FX_BLOCK_IDS[blockName];
        const label = FX_BLOCK_LABELS[blockName];
        let parameters = [];
        if (FX_PARAMS[blockType]) {
            let labelGroup;
            parameters = FX_PARAMS[blockType].map(param => {
                if (param.labelGroup) labelGroup = param.labelGroup;
                return new FxParam({ blockGroup: blockType, ...param, labelGroup });
            });
        }
        blocks.push(new FxBlock({ id, label, parameters }));
        counter++;
        blockName = blockType + counter;
    }
}

export function getBlockById(blockId: number): FxBlock {
    if (!blockId) return null;
    return blocks.find(block => block.id === blockId) || null;
}

export function getBlockAndParam(blockId: number, paramId: number): { block: FxBlock, param: FxParam } {
    const block = getBlockById(blockId);
    const param = block ? block.getParam(paramId) : null;
    return { block, param };
}

export function getAllBlocks() {
    return blocks;
}