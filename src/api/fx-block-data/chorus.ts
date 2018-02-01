import { PARAM_TYPE } from "./fx-block-data";
import { tempo, bypassMode, lfoType, phaseReverse } from "./fx-param-select";

const chorusType = [
    'Digital mono',
    'Digital stereo',
    'Analog mono',
    'Analog stereo',
    'Japan CE-2',
    'Warm stereo',
    '80\'s style',
    'Triangle chorus',
    '8-voice stereo',
    'Vintage tape',
    'Dimension 1',
    'Dimension 2',
    '4-voice analog',
];

const autoDepth = [
    'Off',
    'Low',
    'High'
];

const dimension = [
    'Off',
    'Low',
    'Med',
    'High'
];

const chorus = [
    { id: 0, label: 'Effect type', type: PARAM_TYPE.Select, step: 1, values: chorusType },
    { id: 1, label: 'Voices', type: PARAM_TYPE.Knob, step: 1, range: [1,4] },
    { id: 2, label: 'Rate', type: PARAM_TYPE.Knob, step: 0.01, range: [0, 10], precision: 0.01 },
    { id: 3, label: 'Tempo', type: PARAM_TYPE.Select, step: 1, values: tempo },
    { id: 4, label: 'Depth', type: PARAM_TYPE.Knob, step: 1, range: [0, 100], precision: 0, unit: '%' },
    { id: 5, label: 'High cut', type: PARAM_TYPE.Knob, step: 1, range: [200, 20000], unit: 'Hz' },
    { id: 6, label: 'Delay time', type: PARAM_TYPE.Knob, step: 1, range: [0.10, 10], unit: 'ms' },
    { id: 7, label: 'LFO phase', type: PARAM_TYPE.Knob, step: 1, range: [0, 180], precision: 0, unit: 'deg' },
    { id: 8, label: 'LFO type', type: PARAM_TYPE.Select, step: 1, values: lfoType },
    { id: 9, label: 'Auto depth', type: PARAM_TYPE.Select, step: 1, values: autoDepth },
    { id: 10, label: 'Mix', type: PARAM_TYPE.Knob, step: 1, range: [0, 100], precision: 0, unit: '%' },
    { id: 11, label: 'Level', type: PARAM_TYPE.Knob, step: 1, range: [-20, 20], precision: 0, unit: 'dB' },
    { id: 12, label: 'Balance', type: PARAM_TYPE.Knob, step: 1, range: [-100, 100], precision: 0 },
    { id: 13, label: 'Bypass mode', type: PARAM_TYPE.Select, values: bypassMode.slice(0, 3) },
    { id: 14, label: 'Global', type: PARAM_TYPE.Switch },
    { id: 16, label: 'Phase reverse', type: PARAM_TYPE.Select, step: 1, values: phaseReverse },
    { id: 17, label: 'Width', type: PARAM_TYPE.Knob, step: 1, range: [0, 100], precision: 0, unit: '%' },
    { id: 18, label: 'LFO 2 rate', type: PARAM_TYPE.Knob },
    { id: 19, label: 'LFO 2 depth', type: PARAM_TYPE.Knob, step: 1, range: [0, 100], precision: 0, unit: '%' },
    { id: 20, label: 'Drive', type: PARAM_TYPE.Knob },
    { id: 21, label: 'Low cut', type: PARAM_TYPE.Knob, step: 1, range: [20, 2000], unit: 'Hz' },
    { id: 22, label: 'Spread', type: PARAM_TYPE.Knob, step: 1, range: [0, 100], precision: 0, unit: '%' },
    { id: 23, label: 'Dimension', type: PARAM_TYPE.Select, step: 1, values: dimension }
];

export default chorus;