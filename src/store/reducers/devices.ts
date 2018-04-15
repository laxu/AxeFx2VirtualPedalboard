import { Action } from 'redux';
import { ActionTypes, TypeKeys } from '../actions';
import { AxeFx, AxeFxState } from '../../api/axefx';
import { MIDIController, MIDIDeviceData, MIDIControllerType } from '../../api/midi';
import { ControllerState } from '../../api/generic-midi-controller';

interface State {
    axeFx: AxeFxState,
    controller: ControllerState,
    devices: MIDIDeviceData[];
}

const initialState: State = {
    axeFx: {
        name: null,
        firmwareVersion: null,
        connected: false,
        presetEdited: false,
        currentPresetName: null,
        currentPresetNumber: null,
        currentScene: null
    },
    controller: {
        name: null,
        connected: false
    },
    devices: []
};

export default function deviceReducers(state = initialState, action: Action & { payload: any }) {
    const payload = action.payload;
    switch(action.type) {
        case TypeKeys.updateAxeFx:
            return {...state, axeFx: {...state.axeFx, ...payload}};

        case TypeKeys.resetAxeFx:
            return {...state, axeFx: initialState.axeFx};

        case TypeKeys.setMIDIDeviceData:
            const existingDeviceIdx = state.devices.findIndex(device => device.id === payload.id);
            if (existingDeviceIdx !== -1) {
                // Update existing device
                return {...state, devices: state.devices.map((device, i) => i === existingDeviceIdx ? {...device, ...payload} : device)};
            } else {
                // Add new device
                return {...state, devices: [...state.devices, payload]};
            }

        case TypeKeys.updateController:
            return {...state, controller: {...state.controller, ...payload}};

        default:
            return state;
    }
}