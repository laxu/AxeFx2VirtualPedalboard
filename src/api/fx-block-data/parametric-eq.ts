import { PARAM_TYPE } from "./fx-param-common";
import { bypassModeLimited } from "./fx-param-select";

const eqType = [
    '10 band const Q',
    '8 band const Q',
    '7 band const Q',
    '5 band const Q',
    '10 band var Q',
    '8 band var Q',
    '7 band var Q',
    '5 band var Q',
    '5 band passive',
    '4 band passive',
    '3 band passive',
    '3 band console'
];

const parametricEQ = [
    { id: 0, label: 'Freq 1', type: PARAM_TYPE.Knob, range: [20, 2000], step: 1, unit: 'Hz' },
    { id: 1, label: 'Freq 2', type: PARAM_TYPE.Knob, range: [100, 10000], step: 1, unit: 'Hz' },
    { id: 2, label: 'Freq 3', type: PARAM_TYPE.Knob, range: [100, 10000], step: 1, unit: 'Hz' },
    { id: 3, label: 'Freq 4', type: PARAM_TYPE.Knob, range: [100, 10000], step: 1, unit: 'Hz' },
    { id: 4, label: 'Freq 5', type: PARAM_TYPE.Knob, range: [200, 20000], step: 1, unit: 'Hz' },
    { id: 5, label: 'Q 1', type: PARAM_TYPE.Knob, range: [0.1, 10], step: 0.001 },
    { id: 6, label: 'Q 2', type: PARAM_TYPE.Knob, range: [0.1, 10], step: 0.001 },
    { id: 7, label: 'Q 3', type: PARAM_TYPE.Knob, range: [0.1, 10], step: 0.001 },
    { id: 8, label: 'Q 4', type: PARAM_TYPE.Knob, range: [0.1, 10], step: 0.001 },
    { id: 9, label: 'Q 5', type: PARAM_TYPE.Knob, range: [0.1, 10], step: 0.001 },
    { id: 5, label: 'Gain 1', type: PARAM_TYPE.Knob, range: [-12, 12], unit: 'dB' },
    { id: 6, label: 'Gain 2', type: PARAM_TYPE.Knob, range: [-12, 12], unit: 'dB' },
    { id: 7, label: 'Gain 3', type: PARAM_TYPE.Knob, range: [-12, 12], unit: 'dB' },
    { id: 8, label: 'Gain 4', type: PARAM_TYPE.Knob, range: [-12, 12], unit: 'dB' },
    { id: 9, label: 'Gain 5', type: PARAM_TYPE.Knob, range: [-12, 12], unit: 'dB' },
    { id: 1, label: 'Level', type: PARAM_TYPE.Knob, step: 1, range: [-20, 20], unit: 'dB' },
    { id: 2, label: 'Balance', type: PARAM_TYPE.Knob, range: [-100, 100], step: 1 },
    { id: 3, label: 'Bypass mode', type: PARAM_TYPE.Select, step: 1, values: bypassModeLimited },
    { id: 5, label: 'Effect type', type: PARAM_TYPE.Select, stpe: 1, values: eqType },
    { id: 6, label: 'Master Q', type: PARAM_TYPE.Knob, range: [0.10, 10] },
];

export default parametricEQ;