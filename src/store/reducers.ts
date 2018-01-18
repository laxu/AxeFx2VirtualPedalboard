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
    shouldRefreshCurrentPanel: boolean;
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
        name: null,
        connected: false
    },
    devices: [],
    currentPanel: null,
    shouldRefreshCurrentPanel: false,
    panels: []
};

export default function reducers(state = initialState, action: Action & { payload: any }) {
    const payload = action.payload;
    switch(action.type) {
        case TypeKeys.loading:
            return {...state, loading: payload};

        case TypeKeys.updateAxeFx:
            return {...state, axeFx: {...state.axeFx, ...payload}};

        case TypeKeys.resetAxeFx:
            return {...state, axeFx: initialState.axeFx};

        case TypeKeys.updateControlValue:
            const { blockId, paramId, paramValue } = payload;
            const { currentPanel } = state;
            const controlIdx = currentPanel.controls.findIndex(ctrl => ctrl.blockId === blockId && ctrl.paramId === paramId);
            const updatedPanel = {
                ...currentPanel,
                controls: currentPanel.controls.map((ctrl, i) => (i === controlIdx) ? {...ctrl, paramValue} : ctrl)
            };
            return {...state, currentPanel: updatedPanel };

        case TypeKeys.resetControlValues:
            return {
                ...state,
                panels: state.panels.map(panel => ({
                    ...panel,
                    controls: panel.controls.map(ctrl => ({...ctrl, paramValue: null}))
                }))
            };

        case TypeKeys.setMIDIDeviceData:
            const existingDeviceIdx = state.devices.findIndex(device => device.id === payload.id);
            if (existingDeviceIdx !== -1) {
                // Update existing device
                return {...state, devices: state.devices.map((device, i) => i === existingDeviceIdx ? {...device, ...payload} : device)};
            } else {
                // Add new device
                return {...state, devices: [...state.devices, payload]};
            }

        case TypeKeys.getCurrentPanel:
            const panel = state.panels.find(panel => panel.id === payload);
            if (!panel) return {...state, currentPanel: null};
            return {...state, currentPanel: {...panel}};

        case TypeKeys.setPanel:
            const existingPanelIdx = state.panels.findIndex(panel => panel.id === payload.id);
            if (existingPanelIdx !== -1) {
                // Update existing panel
                console.log('updating panel', state.panels.find(panel => panel.id === payload.id), payload);
                return {...state, panels: state.panels.map((panel, i) => i === existingPanelIdx ? {...panel, ...payload} : panel)};
            } else {
                // Add new panel
                return {...state, panels: [...state.panels, payload]};
            }

        case TypeKeys.refreshCurrentPanel:
            return {...state, shouldRefreshCurrentPanel: payload};

        case TypeKeys.updateController:
            return {...state, controller: {...state.controller, ...payload}};

        default:
            return state;
    }
}