import { ControlObject } from "./control-object";

export enum GroupSizeType {
    Auto = 'auto',
    ControlsPerRow = 'controlsPerRow'
}

export enum KnobMode {
    NumericOnly = 'numericOnly',
    KnobOnly = 'knobOnly',
    Both = 'both'
}

export enum KnobStyle {
    RoundOutline = 'roundOutline',
    Round = 'round',
    ChickenHead = 'chickenhead',
    Hexagon = 'hexagon'
}

export enum KnobColor {
    Dark = 'dark',
    Bright = 'bright',
    Ivory = 'ivory'
}

export interface GroupSize {
    type: GroupSizeType;
    controlsPerRow: number;
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
