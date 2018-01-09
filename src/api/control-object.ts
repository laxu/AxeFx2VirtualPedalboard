import { FxBlock, FxParam } from "./fx-block";

export enum ControlType {
    Control = 'control',
    Switch = 'switch'
}

export interface ControlObject {
    block: FxBlock;
    param: FxParam;
    controlType: ControlType;
}
