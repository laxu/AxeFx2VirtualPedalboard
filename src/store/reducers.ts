import { Action } from 'redux';
import { ActionTypes, TypeKeys } from './actions';

interface State {
    firmwareVersion: string,
    presetName: string,
    axeFx: null,
    controller: null
}

const initialState: State = {
    firmwareVersion: null,
    presetName: null,
    axeFx: null,
    controller: null
};

export function reducers(state = initialState, action: Action & { payload: any }) {
    switch(action.type) {
        case TypeKeys.getFirmwareVersion:
            return {...state, firmwareVersion: action.payload};
        case TypeKeys.getPresetName:
            return {...state, presetName: action.payload};
            case TypeKeys.getPresetName:
            return {...state, presetNumber: action.payload};
        case TypeKeys.setAxeFx:
            return {...state, axeFx: action.payload};
        case TypeKeys.setMIDIController:
            return {...state, controller: action.payload}
        default:
            return state;
    }
}