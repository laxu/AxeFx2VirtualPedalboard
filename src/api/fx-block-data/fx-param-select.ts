export const bypassModeLimited = [
    'THRU',
    'MUTE'
];

export const bypassMode = [
    'THRU',
    'MUTE FX OUT',
    'MUTE OUT',
    'MUTE FX IN',
    'MUTE IN"'
];

export const inputSelect = [
    'L+R',
    'Left',
    'Right'
];

export const lfoType = [
    'SINE',
    'TRIANGLE',
    'SQUARE',
    'SAW UP',
    'SAW DOWN',
    'RANDOM',
    'LOG',
    'EXP',
    'TRAPEZOID'
];

export const lfoTarget = [
    'Both',
    'Left',
    'Right'
];

export const lfoDepthRange = [
    'LOW',
    'HIGH',
];

export const phaseReverse = [
    'None',
    'Right',
    'Left',
    'Both',
];

export const filterSlope = [
    '6 dB/OCT',
    '12 dB/OCT',
    '24 dB/OCT',
    '36 dB/OCT',
    '48 dB/OCT'
];

export const tempo = [
    'NONE',
    '1/64 TRIP',
    '1/64',
    '1/64 DOT',
    '1/32 TRIP',
    '1/32',
    '1/32 DOT',
    '1/16 TRIP',
    '1/16',
    '1/16 DOT',
    '1/8 TRIP',
    '1/8',
    '1/8 DOT',
    '1/4 TRIP',
    '1/4',
    '1/4 DOT',
    '1/2 TRIP',
    '1/2',
    '1/2 DOT',
    '1 TRIP',
    '1',
    '1 DOT',
    '2',
    '3',
    '4',
    '4/3',
    '5/4',
    '5/64',
    '7/64',
    '9/64',
    '10/64 (5/32)',
    '11/64',
    '13/64',
    '14/64 (7/32)',
    '15/64',
    '17/64',
    '18/64 (9/32)',
    '19/64',
    '20/64 (5/16)',
    '21/64',
    '22/64 (11/32)',
    '23/64',
    '25/64',
    '26/64 (13/32)',
    '27/64',
    '28/64 (7/16)',
    '29/64',
    '30/64 (15/32)',
    '31/64',
    '33/64',
    '34/64 (17/32)',
    '35/64',
    '36/64 (9/16)',
    '37/64',
    '38/64 (19/32)',
    '39/64',
    '40/64 (5/8)',
    '41/64',
    '42/64 (21/32)',
    '43/64',
    '44/64 (11/16)',
    '45/64',
    '46/64 (23/32)',
    '47/64',
    '49/64',
    '50/64 (25/32)',
    '51/64',
    '52/64 (13/16)',
    '53/64',
    '54/64 (27/32)',
    '55/64',
    '56/64 (7/8)',
    '57/64',
    '58/64 (29/32)',
    '59/64',
    '60/64 (15/16)',
    '61/64',
    '62/64 (31/32)',
    '63/64',
];

const FX_PARAM_SELECT_VALUES = {
    bypassMode,
    bypassModeLimited,
    inputSelect,
    filterSlope,
    phaseReverse,
    lfoDepthRange,
    lfoTarget,
    lfoType
};

export default FX_PARAM_SELECT_VALUES;

