import { Action } from 'redux';
import { TypeKeys, ActionWithPayload } from './common';
import { BoardObject } from '../../api/board-object';

export const getCurrentBoardAction = (payload: number): ActionWithPayload => ({
    type: TypeKeys.getCurrentBoard,
    payload
});

export const editBoardAction  = (payload: BoardObject): ActionWithPayload => ({
    type: TypeKeys.editBoard,
    payload
});

export const deleteBoardAction  = (payload: string): ActionWithPayload => ({
    type: TypeKeys.deleteBoard,
    payload
});

export const setBoardAction = (payload: BoardObject): ActionWithPayload => ({
    type: TypeKeys.setBoard,
    payload
});

export const refreshCurrentBoardAction = (payload): ActionWithPayload => ({
    type: TypeKeys.refreshCurrentBoard,
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