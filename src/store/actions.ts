import { Action } from "redux";
import { AxeFx } from "../api/axefx";
import { MIDIController, MIDIDeviceData } from "../api/midi";
import { PanelObject } from "../api/panel-object";
import { GenericMIDIController } from "../api/generic-midi-controller";

export enum TypeKeys {
    getPanel = 'Get single panel',
    setPanel = 'Set panel',
    setMIDIDeviceData = 'Set MIDI device data',
    updateAxeFx = 'Update Axe-Fx',
    resetAxeFx = 'Reset Axe-Fx'
};

export interface SetMIDIDeviceData extends Action {
    payload: MIDIDeviceData
}
export const setMIDIDeviceData = (payload): SetMIDIDeviceData => ({
    type: TypeKeys.setMIDIDeviceData,
    payload
});

export interface AxeFxUpdateAction extends Action {
    payload: [string, any]
}
export const axeFxUpdateAction = (payload): AxeFxUpdateAction => ({
    type: TypeKeys.updateAxeFx,
    payload: payload
});

export const axeFxResetAction = (): Action => ({
    type: TypeKeys.resetAxeFx,
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
    | AxeFxUpdateAction
    | SetMIDIDeviceData
    | SetPanelAction
    | GetPanelAction;
