import { Action } from 'redux';
import { ActionTypes, TypeKeys } from './actions';
import { PanelObject } from '../api/panel-object';
import { AxeFx, AxeFxState } from '../api/axefx';
import { MIDIController, MIDIDeviceData, MIDIControllerType } from '../api/midi';
import { ControllerState } from '../api/generic-midi-controller';

interface State {
    axeFx: AxeFxState,
    controller: ControllerState,
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
    controller: {
        name: null
    },
    devices: [],
    currentPanel: null,
    panels: []
};

export default function reducers(state = initialState, action: Action & { payload: any }) {
    switch(action.type) {
        case TypeKeys.loading:
            return {...state, loading: action.payload};
        case TypeKeys.updateAxeFx:
            return {...state, axeFx: {...state.axeFx, ...action.payload}};
        case TypeKeys.resetAxeFx:
            return {...state, axeFx: initialState.axeFx};
        case TypeKeys.updateControlValue:
            const { blockId, paramId, paramValue } = action.payload;
            const { currentPanel } = state;
            const controlIdx = currentPanel.controls.findIndex(ctrl => ctrl.blockId === blockId && ctrl.paramId === paramId);
            const updatedPanel = {
                ...currentPanel,
                controls: currentPanel.controls.map((ctrl, i) => (i === controlIdx) ? {...ctrl, paramValue} : ctrl)
            };
            return {...state, currentPanel: updatedPanel };
        case TypeKeys.setMIDIDeviceData:
            const existingDeviceIdx = state.devices.findIndex(device => device.id === action.payload.id);
            if (existingDeviceIdx !== -1) {
                // Update existing device
                return {...state, devices: state.devices.map((device, i) => i === existingDeviceIdx ? action.payload : device)};
            } else {
                // Add new device
                return {...state, devices: [...state.devices, action.payload]};
            }
        case TypeKeys.getCurrentPanel:
            const panel = state.panels.find(panel => panel.id === action.payload);
            if (!panel) return {...state, currentPanel: null};
            return {...state, currentPanel: {...panel}};
        case TypeKeys.setPanel:
            const existingPanelIdx = state.panels.findIndex(panel => panel.id === action.payload.id);
            if (existingPanelIdx !== -1) {
                // Update existing panel
                return {...state, panels: state.panels.map((panel, i) => i === existingPanelIdx ? action.payload : panel)};
            } else {
                // Add new panel
                return {...state, panels: [...state.panels, action.payload]};
            }
        case TypeKeys.updateController:
            return {...state, controller: {...state.controller, ...action.payload}};
        default:
            return state;
    }
}