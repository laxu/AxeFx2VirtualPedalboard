import { Action } from 'redux';
import { ActionTypes, TypeKeys } from './actions';
import { PanelObject } from '../api/panel-object';
import { AxeFx } from '../api/axefx';
import { MIDIController } from '../api/midi';

interface State {
    firmwareVersion: string,
    presetName: string,
    axeFx: AxeFx,
    controller: MIDIController,
    panels: PanelObject[]
}

const initialState: State = {
    firmwareVersion: null,
    presetName: null,
    axeFx: null,
    controller: null,
    panels: []
};

export function reducers(state = initialState, action: Action & { payload: any }) {
    switch(action.type) {
        case TypeKeys.getFirmwareVersion:
            return {...state, firmwareVersion: action.payload};
        case TypeKeys.getPresetName:
            return {...state, presetName: action.payload};
        case TypeKeys.getPresetNumber:
            return {...state, presetNumber: action.payload};
        case TypeKeys.getPanel:
            return {...state, currentPanel: state.panels.find(panel => panel.id === action.payload)}
        case TypeKeys.setAxeFx:
            return {...state, axeFx: action.payload};
        case TypeKeys.setMIDIController:
            return {...state, controller: action.payload}
        case TypeKeys.setPanel:
            return {...state, panels: [...state.panels, action.payload]}
        default:
            return state;
    }
}