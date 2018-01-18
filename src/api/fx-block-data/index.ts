import amp from './amp';
import cab from './cab';
import delay from './delay';
import drive from './drive';
import reverb from './reverb';
import { PARAM_TYPE } from './fx-param-common';
import FX_PARAM_SELECT_VALUES from './fx-param-select';
import { FX_BLOCK_IDS, FX_BLOCK_LABELS, FX_BLOCK_TYPES } from './fx-block-data';

const FX_PARAMS = {
    amp,
    delay,
    drive,
    cab,
    reverb
};

export {
    FX_PARAMS,
    FX_PARAM_SELECT_VALUES,
    PARAM_TYPE,
    FX_BLOCK_IDS,
    FX_BLOCK_LABELS,
    FX_BLOCK_TYPES
};
