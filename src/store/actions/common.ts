import { Action } from "redux";

export enum TypeKeys {
    loading = 'Loading data',
    toggleSidebar = 'Toggle sidebar',
    setCurrentBoard = 'Get current board',
    setBoard = 'Set board data',
    setMIDIDeviceData = 'Set MIDI device data',
    setBlocks = 'Set effects blocks',
    editBoard = 'Edit board',
    deleteBoard = 'Delete board',
    refreshCurrentBoard = 'Refresh current board values',
    updateControlValue = 'Update control value',
    resetControlValues = 'Reset control values',
    updateAxeFx = 'Update Axe-Fx',
    resetAxeFx = 'Reset Axe-Fx',
    updateController = 'Update MIDI controller',
    resetController = 'Reset MIDI controller'
};

export interface ActionWithPayload extends Action { payload: any }

export const loadingAction = (payload: boolean): ActionWithPayload => ({
    type: TypeKeys.loading,
    payload
});

export const toggleSidebarAction = (): Action => ({
    type: TypeKeys.toggleSidebar
});

export type ActionTypes = Action | ActionWithPayload;