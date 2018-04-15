import { combineReducers } from 'redux';
import common from './reducers/common';
import board from './reducers/board';
import devices from './reducers/devices';

export default combineReducers({ 
    board,
    common,
    devices
});
