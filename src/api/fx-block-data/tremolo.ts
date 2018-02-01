import { PARAM_TYPE } from "./fx-param-common";
import { lfoType, tempo, bypassModeLimited } from "./fx-param-select";

const effectType = [
    'Tremolo',
    'Panner'
];

const tremolo = [
    { id: 0, label: 'Effect type', type: PARAM_TYPE.Select, step: 1, values: effectType },
    { id: 1, label: 'LFO type', type: PARAM_TYPE.Select, step: 1, values: lfoType },
    { id: 2, label: 'Rate', type: PARAM_TYPE.Knob, step: 0.01, range: [0, 20], precision: 0.01 },
    { id: 3, label: 'Depth', type: PARAM_TYPE.Knob, step: 1, range: [0, 100], unit: '%' },
    { id: 4, label: 'Duty', type: PARAM_TYPE.Knob, step: 1, range: [1, 99], unit: '%' },
    { id: 5, label: 'Tempo', type: PARAM_TYPE.Select, step: 1, values: tempo },
    { id: 7, label: 'Level', type: PARAM_TYPE.Knob, step: 1, range: [-20, 20], unit: 'dB' },
    { id: 8, label: 'Balance', type: PARAM_TYPE.Knob, step: 1, range: [-100, 100] },
    { id: 9, label: 'Bypass mode', type: PARAM_TYPE.Select, step: 1, values: bypassModeLimited },
    { id: 11, label: 'LFO phase', type: PARAM_TYPE.Knob, step: 1, range: [0, 180], unit: 'deg' },
    { id: 12, label: 'Width', type: PARAM_TYPE.Knob, step: 1, range: [0, 400], unit: '%' },
    { id: 13, label: 'Pan center', type: PARAM_TYPE.Knob, step: 1, range: [-100, 100] },
    { id: 15, label: 'Start phase', type: PARAM_TYPE.Knob, step: 1, range: [0, 360], unit: 'deg' }
];

export default tremolo;