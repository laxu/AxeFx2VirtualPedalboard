export const SYSEX_START = 0xF0;
export const SYSEX_END = 0x7F;
export const SYSEX_ENABLED = true;

export const HEADER = [0x00, 0x01, 0x74];

export const MODEL_IDS = {
    'Axe-Fx Standard': 0x00,
    'Axe-Fx Ultra': 0x01,
    'Axe-Fx II': 0x03,
    'Axe-Fx II XL': 0x06,
    'Axe-Fx II XL+': 0x07,
    'AX8': 0x08
};

export const TUNER_CC = 15;
export const METRONOME_CC = 122;

export const AXE_FUNCTIONS = {
    getFirmwareVersion: 0x08,
    getPresetNumber: 0x14,
    getPresetName: 0x0F,
    getPresetEditedStatus: 0x2A,
    getMIDIChannel: 0x17,
    getBlockParametersList: 0x01,
    setTargetBlock: 0x37,
    setBlockBypass: 0x02,
    multiResponse: 0x64,
    batchRequestStart: 0x32,
    batchRequestComplete: 0x33
}
