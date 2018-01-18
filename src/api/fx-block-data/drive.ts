import { PARAM_TYPE } from "./fx-param-common";
import { driveType, inputSelect, bypassModeLimited, clipType } from "./fx-param-Select";

const drive = [
    { id: 0, label: 'Type', type: PARAM_TYPE.Select, values: driveType },
    { id: 1, label: 'Gain', type: PARAM_TYPE.Knob },
    { id: 2, label: 'Tone', type: PARAM_TYPE.Knob },
    { id: 3, label: 'Volume', type: PARAM_TYPE.Knob },
    { id: 4, label: 'Mix', type: PARAM_TYPE.Knob },
    { id: 5, label: 'Bypass mode', type: PARAM_TYPE.Select, values: bypassModeLimited },
    { id: 6, label: 'Slew limit', type: PARAM_TYPE.Knob },
    { id: 8, label: 'Lo cut', type: PARAM_TYPE.Knob },
    { id: 9, label: 'Hi cut', type: PARAM_TYPE.Knob },
    { id: 10, label: 'Clip type', type: PARAM_TYPE.Select, values: clipType },
    { id: 11, label: 'Bias', type: PARAM_TYPE.Knob },
    { id: 12, label: 'Bass', type: PARAM_TYPE.Knob },
    { id: 13, label: 'Middle', type: PARAM_TYPE.Knob },
    { id: 14, label: 'Mid freq', type: PARAM_TYPE.Knob },
    { id: 15, label: 'Treble', type: PARAM_TYPE.Knob },
    { id: 16, label: 'Bit reduce', type: PARAM_TYPE.Knob, range: [0, 24], step: 1, precision: 1 },
    { id: 17, label: 'Input', type: PARAM_TYPE.Select, values: inputSelect },
    { id: 18, label: 'Balance', type: PARAM_TYPE.Knob },
    { id: 19, label: 'Sample rate', type: PARAM_TYPE.Knob }
];

export default drive;