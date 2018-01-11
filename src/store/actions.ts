import { Action } from "redux";
import { AxeFx } from "../api/axefx";
import { MIDIController } from "../api/midi";
import { PanelObject } from "../api/panel-object";

export enum TypeKeys {
    getFirmwareVersion = 'Get firmware version',
    getPresetName = 'Get preset name',
    getPresetNumber = 'Get preset number',
    getPanel = 'Get single panel',
    setPanel = 'Set panel',
    setAxeFx = 'Set Axe-Fx',
    setMIDIController = 'Set MIDI controller',
};

export interface FirmwareVersionAction extends Action {
    payload: string
}
export const firmwareVersionAction = (payload): FirmwareVersionAction => ({
    type: TypeKeys.getFirmwareVersion,
    payload
}); 

export interface PresetNameAction extends Action {
    payload: string
}
export const presetNameAction = (payload): PresetNameAction => ({
    type: TypeKeys.getPresetName,
    payload
});

export interface PresetNumberAction extends Action {
    payload: number
}
export const presetNumberAction = (payload): PresetNameAction => ({
    type: TypeKeys.getPresetNumber,
    payload
});

export interface SetAxeFxAction extends Action {
    payload: AxeFx
}
export const setAxeFxAction = (payload): SetAxeFxAction => ({
    type: TypeKeys.setAxeFx,
    payload
});

export interface SetMidiControllerAction extends Action {
    payload: MIDIController
}
export const setMIDIControllerAction = (payload): SetMidiControllerAction => ({
    type: TypeKeys.setMIDIController,
    payload
});

export interface GetPanelAction extends Action {
    payload: number;
}
export const getPanelAction = (payload): GetPanelAction => ({
    type: TypeKeys.getPanel,
    payload
})

export interface SetPanelAction extends Action {
    payload: PanelObject
}
export const setPanelAction = (payload): SetPanelAction => ({
    type: TypeKeys.setPanel,
    payload
});

export type ActionTypes = 
    | FirmwareVersionAction 
    | PresetNameAction
    | PresetNumberAction
    | SetAxeFxAction
    | SetMidiControllerAction
    | SetPanelAction
    | GetPanelAction;
