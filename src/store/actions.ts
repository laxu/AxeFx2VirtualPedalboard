import { Action } from "redux";
import { AxeFx } from "../api/axefx";
import { MIDIController, MIDIDeviceData } from "../api/midi";
import { PanelObject } from "../api/panel-object";
import { GenericMIDIController } from "../api/generic-midi-controller";
import { FxBlock } from "../api/fx-block";

export enum TypeKeys {
    loading = 'Loading data',
    getCurrentPanel = 'Get current panel',
    setPanel = 'Set panel data',
    setMIDIDeviceData = 'Set MIDI device data',
    setBlocks = 'Set effects blocks',
    editPanel = 'Edit panel',
    deletePanel = 'Delete panel',
    refreshCurrentPanel = 'Refresh current panel values',
    updateControlValue = 'Update control value',
    resetControlValues = 'Reset control values',
    updateAxeFx = 'Update Axe-Fx',
    resetAxeFx = 'Reset Axe-Fx',
    updateController = 'Update MIDI controller'
};

export interface ActionWithPayload extends Action { payload: any }

export const loadingAction = (payload: boolean) : ActionWithPayload => ({
    type: TypeKeys.loading,
    payload
});

export const setMIDIDeviceDataAction = (payload) => ({
    type: TypeKeys.setMIDIDeviceData,
    payload
});

export const updateAxeFxAction = (payload): ActionWithPayload => ({
    type: TypeKeys.updateAxeFx,
    payload: payload
});

export const resetAxeFxAction = (): Action => ({
    type: TypeKeys.resetAxeFx,
});

export const refreshCurrentPanelAction = (payload): ActionWithPayload => ({
    type: TypeKeys.refreshCurrentPanel,
    payload
});

export const updateControlValueAction = (payload: {
    blockId: number,
    paramId: number,
    paramValue: number
}): ActionWithPayload => ({
    type: TypeKeys.updateControlValue,
    payload
});

export const resetControlValuesAction = (): Action => ({
    type: TypeKeys.resetControlValues
});

export const getCurrentPanelAction = (payload: number): ActionWithPayload => ({
    type: TypeKeys.getCurrentPanel,
    payload
});

export const editPanelAction  = (payload: PanelObject): ActionWithPayload => ({
    type: TypeKeys.editPanel,
    payload
});

export const deletePanelAction  = (payload: string): ActionWithPayload => ({
    type: TypeKeys.deletePanel,
    payload
});

export const setPanelAction = (payload: PanelObject): ActionWithPayload => ({
    type: TypeKeys.setPanel,
    payload
});

export const updateControllerAction = (payload): ActionWithPayload => ({
    type: TypeKeys.updateController,
    payload
});

export type ActionTypes = Action | ActionWithPayload;