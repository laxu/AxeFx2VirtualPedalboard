import { PARAM_TYPE } from "./fx-param-common";
import { bypassModeLimited } from "./fx-param-select";

export const eqType = [
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

const graphicEQ = [
    { id: 0, label: '31', type: PARAM_TYPE.Knob, range: [-12, 12], unit: 'dB' },
    { id: 1, label: '63', type: PARAM_TYPE.Knob, range: [-12, 12], unit: 'dB' },
    { id: 2, label: '125', type: PARAM_TYPE.Knob, range: [-12, 12], unit: 'dB' },
    { id: 3, label: '250', type: PARAM_TYPE.Knob, range: [-12, 12], unit: 'dB' },
    { id: 4, label: '500', type: PARAM_TYPE.Knob, range: [-12, 12], unit: 'dB' },
    { id: 5, label: '1K', type: PARAM_TYPE.Knob, range: [-12, 12], unit: 'dB' },
    { id: 6, label: '2K', type: PARAM_TYPE.Knob, range: [-12, 12], unit: 'dB' },
    { id: 7, label: '4K', type: PARAM_TYPE.Knob, range: [-12, 12], unit: 'dB' },
    { id: 8, label: '8K', type: PARAM_TYPE.Knob, range: [-12, 12], unit: 'dB' },
    { id: 9, label: '16K', type: PARAM_TYPE.Knob, range: [-12, 12], unit: 'dB' },
    { id: 11, label: 'Level', type: PARAM_TYPE.Knob, step: 1, range: [-20, 20], unit: 'dB' },
    { id: 12, label: 'Balance', type: PARAM_TYPE.Knob, range: [-100, 100], step: 1 },
    { id: 13, label: 'Bypass mode', type: PARAM_TYPE.Select, step: 1, values: bypassModeLimited },
    { id: 15, label: 'Effect type', type: PARAM_TYPE.Select, stpe: 1, values: eqType },
    { id: 16, label: 'Master Q', type: PARAM_TYPE.Knob, range: [0.10, 10] },
];

export default graphicEQ;