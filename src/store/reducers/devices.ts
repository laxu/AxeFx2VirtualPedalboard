import { Action } from "redux";
import { ActionTypes, TypeKeys } from "../actions";
import { AxeFx, AxeFxState } from "../../api/axefx";
import {
  MIDIController,
  MIDIDeviceData,
  MIDIControllerType
} from "../../api/midi";
import { ControllerState } from "../../api/generic-midi-controller";

interface State {
  axeFx: AxeFxState;
  controller: ControllerState;
  devices: MIDIDeviceData[];
}

const initialState: State = {
  axeFx: {
    name: "Axe-Fx 2",
    firmwareVersion: "10.00",
    connected: true,
    presetEdited: false,
    currentPresetName: "Fake preset",
    currentPresetNumber: 1,
    currentScene: 2
  },
  controller: {
    name: "Test controller",
    connected: true
  },
  devices: [
    {
      id: 1,
      type: MIDIControllerType.AxeFx,
      inputName: "Axe-Fx 2 input 1",
      outputName: "Axe-Fx 2 output 1",
      channel: "all"
    },
    {
      id: 1,
      type: MIDIControllerType.Controller,
      inputName: "MIDI input 1",
      outputName: "MIDI output 1",
      channel: "all"
    }
  ]
};

export default function deviceReducers(
  state = initialState,
  action: Action & { payload: any }
) {
  const payload = action.payload;
  switch (action.type) {
    case TypeKeys.updateAxeFx:
      return { ...state, axeFx: { ...state.axeFx, ...payload } };

    case TypeKeys.resetAxeFx:
      return { ...state, axeFx: initialState.axeFx };

    case TypeKeys.resetController:
      return { ...state, controller: initialState.controller };

    case TypeKeys.setMIDIDeviceData:
      const nextDevices = payload.map(device => {
        const existingDevice = state.devices.find(d => d.id === device.id);
        if (existingDevice) {
          // Update existing device
          return { ...existingDevice, ...device };
        } else {
          // Add new device
          return { ...device };
        }
      });
      return { ...state, devices: nextDevices };

    case TypeKeys.updateController:
      return { ...state, controller: { ...state.controller, ...payload } };

    default:
      return state;
  }
}
