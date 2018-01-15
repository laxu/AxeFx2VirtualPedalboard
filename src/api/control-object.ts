import { FxBlock, FxParam } from "./fx-block";

export enum ControlType {
    Control = 'control',
    Switch = 'switch'
}

export interface ControlObject {
    id: string;
    blockId: number,
    paramId: number;
    paramValue: number;
    controlType: ControlType;
    cc: number;
}
