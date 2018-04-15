import { Action } from 'redux';
import { TypeKeys, ActionWithPayload } from './common';

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

export const updateControllerAction = (payload): ActionWithPayload => ({
    type: TypeKeys.updateController,
    payload
});