import { PARAM_TYPE } from "./fx-param-common";
import { inputSelect, bypassModeLimited } from "./fx-param-select";

const driveType = [
    'RAT DIST',
    'PI FUZZ',
    'TUBE DRV 3-KNOB',
    'SUPER OD',
    'TREBLE BOOST',
    'MID BOOST',
    'T808 OD',
    'FAT RAT',
    'T808 MOD',
    'OCTAVE DIST',
    'PLUS DIST',
    'HARD FUZZ',
    'FET BOOST',
    'TAPE DIST',
    'FULL OD',
    'BLUES OD',
    'SHRED DIST',
    'M-ZONE DIST',
    'BENDER FUZZ',
    'BB PRE',
    'MASTER FUZZ',
    'FACE FUZZ',
    'BIT CRUSHER',
    'ETERNAL LOVE',
    'ESOTERIC ACB',
    'ESOTERIC RCB',
    'ZEN MASTER',
    'TUBE DRV 4-KNOB',
    'FAS LED-DRIVE',
    'SDD PREAMP',
    'FET PREAMP',
    'RUCKUS',
    'MICRO BOOST',
    'FAS BOOST',
    'TIMOTHY',
    'SHIMMER DRIVE'
];

const clipType = [
    'LV TUBE',
    'HARD',
    'SOFT',
    'GERMANIUM',
    'FW RECT',
    'HV TUBE',
    'SILICON',
    '4558/DIODE',
    'LED',
    'FET',
    'OP-AMP',
    'VARIABLE',
    'NULL'
];

const drive = [
    { id: 0, label: 'Type', type: PARAM_TYPE.Select, values: driveType, step: 1, range: [0, driveType.length - 1], labelGroup: 'Basic' },
    { id: 1, label: 'Gain', type: PARAM_TYPE.Knob },
    { id: 2, label: 'Tone', type: PARAM_TYPE.Knob },
    { id: 3, label: 'Volume', type: PARAM_TYPE.Knob },
    { id: 4, label: 'Mix', type: PARAM_TYPE.Knob },
    { id: 8, label: 'Lo cut', type: PARAM_TYPE.Knob },
    { id: 9, label: 'Hi cut', type: PARAM_TYPE.Knob },
    { id: 10, label: 'Clip type', type: PARAM_TYPE.Select, values: clipType },
    { id: 12, label: 'Bass', type: PARAM_TYPE.Knob, labelGroup: 'EQ' },
    { id: 13, label: 'Middle', type: PARAM_TYPE.Knob },
    { id: 14, label: 'Mid freq', type: PARAM_TYPE.Knob },
    { id: 15, label: 'Treble', type: PARAM_TYPE.Knob },
    { id: 6, label: 'Slew limit', type: PARAM_TYPE.Knob },
    { id: 11, label: 'Bias', type: PARAM_TYPE.Knob },
    { id: 16, label: 'Bit reduce', type: PARAM_TYPE.Knob, range: [0, 24], step: 1, precision: 1 },
    { id: 5, label: 'Bypass mode', type: PARAM_TYPE.Select, values: bypassModeLimited, labelGroup: 'Advanced' },
    { id: 17, label: 'Input', type: PARAM_TYPE.Select, values: inputSelect },
    { id: 18, label: 'Balance', type: PARAM_TYPE.Knob },
    { id: 19, label: 'Sample rate', type: PARAM_TYPE.Knob }
];

export default drive;