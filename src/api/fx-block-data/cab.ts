import { PARAM_TYPE } from "./fx-param-common";
import { getAxeFxInstance } from "../midi";
import { bypassModeLimited, inputSelect, filterSlope } from "./fx-param-select";

function getCabName(cab: number) {
    const axeFx = getAxeFxInstance();
    return axeFx.cabNames[cab];
}

const micTypes = [
    'None',
    '57 Dyn',
    '58 Dyn',
    '421 Dyn',
    '87A Cond',
    'U87 Cond',
    'E609 Dyn',
    'RE16 Dyn',
    'R121 Rib',
    'D112 Dyn',
    '67 Cond',
    'Null',
    'Invert'
];

const cabQuality = [
    'Hi-/Ultra-res',
    'Normal res',
    'Stereo',
    'Stereo Ultrares'
]

const preampType = [
    'None',
    'Tube',
    'Bipolar',
    'FET I',
    'FET II',
    'Transformer',
    'Tape 70us',
    'Tape 50us',
    'Tape 35us',
    'Vintage',
    'Modern',
    'Exciter',
];

const preampMode = [
    'Economy',
    'High quality'
];

const cab = [
    { id: 0, label: 'Cab L', type: PARAM_TYPE.Select, step: 1, values: getCabName, labelGroup: 'Basic' },
    { id: 1, label: 'Cab L mic', type: PARAM_TYPE.Select, step: 1, values: micTypes },
    { id: 2, label: 'Cab R', type: PARAM_TYPE.Select, values: getCabName, },
    { id: 3, label: 'Cab R mic', type: PARAM_TYPE.Select, step: 1, values: micTypes },
    { id: 4, label: 'Link cabs', type: PARAM_TYPE.Switch },
    { id: 5, label: 'Level L', type: PARAM_TYPE.Knob, range: [-80, 0], precision: 0, unit: 'dB' },
    { id: 6, label: 'Level R', type: PARAM_TYPE.Knob, range: [-80, 0], precision: 0, unit: 'dB' },
    { id: 7, label: 'Pan L', type: PARAM_TYPE.Knob, range: [-100, 100], precision: 0 },
    { id: 8, label: 'Pan R', type: PARAM_TYPE.Knob, range: [-100, 100], precision: 0 },
    { id: 9, label: 'Level', type: PARAM_TYPE.Knob, range: [-80, 20] },
    { id: 10, label: 'Balance', type: PARAM_TYPE.Knob, range: [-100, 100], precision: 0 },
    { id: 11, label: 'Bypass mode', type: PARAM_TYPE.Select, step: 1, values: bypassModeLimited },
    { id: 12, label: 'Mode', type: PARAM_TYPE.Select, step: 1, values: cabQuality },
    { id: 14, label: 'Drive', type: PARAM_TYPE.Knob },
    { id: 15, label: 'Saturation', type: PARAM_TYPE.Knob },
    { id: 16, label: 'Room level', type: PARAM_TYPE.Knob, range: [0, 100], step: 1, precision: 0, unit: '%' },
    { id: 17, label: 'Room size', type: PARAM_TYPE.Knob },
    { id: 18, label: 'Mic spacing', type: PARAM_TYPE.Knob, range: [0, 100], step: 1, precision: 0, unit: '%' },
    { id: 19, label: 'Low cut', type: PARAM_TYPE.Knob, range: [20, 200], step: 1, precision: 0, unit: 'Hz' },
    { id: 20, label: 'High cut', type: PARAM_TYPE.Knob, range: [200, 20000], step: 1, precision: 0, unit: 'Hz' },
    { id: 21, label: 'Speaker size', type: PARAM_TYPE.Knob },
    { id: 22, label: 'Proximity', type: PARAM_TYPE.Knob },
    { id: 23, label: 'Air', type: PARAM_TYPE.Knob, range: [0, 100], step: 1, precision: 0, unit: '%' },
    { id: 24, label: 'Motor drive', type: PARAM_TYPE.Knob },
    { id: 25, label: 'Air freq', type: PARAM_TYPE.Knob, range: [2000, 20000], step: 1, precision: 0, unit: 'Hz' },
    { id: 26, label: 'Delay L', type: PARAM_TYPE.Knob, range: [0, 1], step: 0.001, precision: 0.001 },
    { id: 27, label: 'Delay R', type: PARAM_TYPE.Knob, range: [0, 1], step: 0.001, precision: 0.001 },
    { id: 28, label: 'Promixity R', type: PARAM_TYPE.Knob },
    { id: 29, label: 'Proximity freq', type: PARAM_TYPE.Knob, range: [20, 200], step: 1, precision: 0, unit: 'Hz' },
    { id: 30, label: 'Input select', type: PARAM_TYPE.Select, step: 1, values: inputSelect },
    { id: 31, label: 'Preamp type', type: PARAM_TYPE.Select, step: 1, values: preampType },
    { id: 32, label: 'Bass', type: PARAM_TYPE.Knob, range: [-12, 12], unit: 'dB' },
    { id: 33, label: 'Middle', type: PARAM_TYPE.Knob, range: [-12, 12], unit: 'dB' },
    { id: 34, label: 'Treble', type: PARAM_TYPE.Knob, range: [-12, 12], unit: 'dB' },
    { id: 35, label: 'Preamp mode', type: PARAM_TYPE.Select, step: 1, values: preampMode },
    { id: 36, label: 'Dephase', type: PARAM_TYPE.Knob },
    { id: 37, label: 'Filter slope', type: PARAM_TYPE.Select, step: 1, values: filterSlope.slice(2) },
    { id: 38, label: 'Motor time constant', type: PARAM_TYPE.Knob, range: [20, 2000], step: 0.001, precision: 0, unit: 'ms' }
];

export default cab;