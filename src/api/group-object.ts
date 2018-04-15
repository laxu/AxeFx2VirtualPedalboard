import { ControlObject } from "./control-object";

export enum GroupSizeType {
    Auto,
    Custom
}

export enum KnobMode {
    NumericOnly,
    KnobOnly,
    Both
}

export enum KnobStyle {
    Simple,
    ChickenHead,
    Octagon
}

export enum KnobColor {
    Black,
    White,
    Ivory
}

export interface GroupSize {
    type: GroupSizeType;
    width: number;
    height: number;
}

export interface GroupObject {
    id: string;
    label: string;
    bgColor: string;
    textColor: string;
    size: GroupSize,
    showBlockNames: boolean;
    showKnobs: KnobMode;
    knobStyle: KnobStyle;
    knobColor: KnobColor;
}
