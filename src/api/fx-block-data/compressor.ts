import { PARAM_TYPE } from './fx-block-data';
import { inputLevel, bypassMode } from './fx-param-select';

const compType = [
    'Studio comp',
    'Pedal comp 1',
    'Pedal comp 2',
    'Dynamics',
    'Optical 1',
    'Optical 2'
];

const sidechain = [
    'Block L+R',
    'Row 1',
    'Row 2',
    'Row 3',
    'Row 4',
    'Input 1',
    'Input 2',
    'Block L',
    'Block R'
];

const detect = [
    'RMS',
    'Peak',
    'RMS  +peak',
    'Fast RMS'
];

const knee = [
    'Hard',
    'Soft',
    'Softer',
    'Softest'
];

const compressor = [
    { id: 12, label: 'Effect type', type: PARAM_TYPE.Select, step: 1, values: compType },
    { id: 0, label: 'Threshold', type: PARAM_TYPE.Knob, step: 1, range: [-80, 0], precision: 0, unit: 'dB' },
    { id: 1, label: 'Ratio', type: PARAM_TYPE.Knob, range: [1, 20] },
    { id: 2, label: 'Attack', type: PARAM_TYPE.Knob, range: [1, 100], step: 0.001, precision: 0.001, unit: 'ms' },
    { id: 3, label: 'Release', type: PARAM_TYPE.Knob, range: [10, 1000], unit: 'ms' },
    { id: 11, label: 'Mix', type: PARAM_TYPE.Knob, step: 1, range: [0, 100], precision: 0, unit: '%' },
    { id: 4, label: 'Level', type: PARAM_TYPE.Knob, step: 1, range: [-20, 20], unit: 'dB' },
    { id: 5, label: 'Knee', type: PARAM_TYPE.Select, step: 1, values: knee },
    { id: 6, label: 'Makeup', type: PARAM_TYPE.Switch },
    { id: 7, label: 'Detect', type: PARAM_TYPE.Select, step: 1, values: detect },
    { id: 8, label: 'Filter', type: PARAM_TYPE.Knob, range: [10, 1000], step: 1, unit: 'Hz' },
    { id: 10, label: 'Sidechain', type: PARAM_TYPE.Select, step: 1, values: sidechain },
    { id: 13, label: 'Comp', type: PARAM_TYPE.Knob },
    { id: 14, label: 'Bypass mode', type: PARAM_TYPE.Select, step: 1, values: bypassMode.slice(0, 3) },
    { id: 15, label: 'Look ahead', type: PARAM_TYPE.Knob, range: [0, 2], step: 0.001, precision: 0.001, unit: 'ms' },
    { id: 16, label: 'Auto', type: PARAM_TYPE.Switch },
    { id: 17, label: 'Emphasis', type: PARAM_TYPE.Knob },
    { id: 18, label: 'Dynamics', type: PARAM_TYPE.Knob, range: [-10, 10] },
    { id: 19, label: 'Input level', type: PARAM_TYPE.Select, step: 1, values: inputLevel }
];
export default compressor;