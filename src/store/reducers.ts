import { Action } from 'redux';
import { ActionTypes, TypeKeys } from './actions';
import { PanelObject } from '../api/panel-object';
import { AxeFx, AxeFxState } from '../api/axefx';
import { MIDIController, MIDIDeviceData, MIDIControllerType } from '../api/midi';

interface State {
    axeFx: AxeFxState,
    devices: MIDIDeviceData[];
    currentPanel: PanelObject;
    panels: PanelObject[];
}

const initialState: State = {
    axeFx: {
        name: null,
        firmwareVersion: null,
        connected: false,
        presetEdited: false,
        currentPresetName: null,
        currentPresetNumber: null
    },
    devices: [],
    currentPanel: null,
    panels: []
};

export default function reducers(state = initialState, action: Action & { payload: any }) {
    switch(action.type) {
        case TypeKeys.updateAxeFx:
            return {...state, axeFx: {...state.axeFx, ...action.payload}}
        case TypeKeys.resetAxeFx:
            return {...state, axeFx: initialState.axeFx}
        case TypeKeys.setMIDIDeviceData:
            const existingDeviceIdx = state.devices.findIndex(device => device.id === action.payload.id);
            if (existingDeviceIdx !== -1) {
                // Update existing device
                state.devices[existingDeviceIdx] = action.payload;
                return {...state, devices: [...state.devices]}
            } else {
                // Add new device
                return {...state, devices: [...state.devices, action.payload]}
            }
        case TypeKeys.getPanel:
            const panel = state.panels.find(panel => panel.id === action.payload);
            if (!panel) return {...state, currentPanel: null};
            return {...state, currentPanel: Object.assign({}, panel)}
        case TypeKeys.setPanel:
            const existingPanelIdx = state.panels.findIndex(panel => panel.id === action.payload.id);
            if (existingPanelIdx !== -1) {
                // Update existing panel
                state.panels[existingPanelIdx] = action.payload;
                return {...state, panels: [...state.panels]}
            } else {
                // Add new panel
                return {...state, panels: [...state.panels, action.payload]}
            }
        default:
            return state;
    }
}