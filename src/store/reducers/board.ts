import { Action } from 'redux';
import { ActionTypes, TypeKeys } from '../actions';
import { BoardObject } from '../../api/board-object';

interface State {
    currentBoard: BoardObject;
    editedBoard: BoardObject;
    shouldRefreshCurrentBoard: boolean;
    boards: BoardObject[];
}

const initialState: State = {
    currentBoard: null,
    editedBoard: null,
    shouldRefreshCurrentBoard: false,
    boards: []
};

export default function boardReducers(state = initialState, action: Action & { payload: any }) {
    const payload = action.payload;
    switch(action.type) {
        case TypeKeys.updateControlValue:
            const { blockId, paramId, paramValue, rawValue } = payload;
            const { currentBoard } = state;
            const controlIdx = currentBoard.controls.findIndex(ctrl => ctrl.blockId === blockId && ctrl.paramId === paramId);
            const updatedBoard: BoardObject = {
                ...currentBoard,
                controls: currentBoard.controls.map((ctrl, i) => (i === controlIdx) ? {...ctrl, paramValue, rawValue} : ctrl)
            };
            return {...state, currentBoard: updatedBoard };

        case TypeKeys.resetControlValues:
            return {
                ...state,
                currentBoard: state.currentBoard ? {
                    ...state.currentBoard, 
                    controls: state.currentBoard.controls.map(ctrl => ({...ctrl, paramValue: null}))
                } : null,
                boards: state.boards.map(board => ({
                    ...board,
                    controls: board.controls.map(ctrl => ({...ctrl, paramValue: null}))
                }))
            };

        case TypeKeys.getCurrentBoard:
            const board = state.boards.find(p => p.id === payload);
            if (!board) return {...state, currentBoard: null};
            return {...state, currentBoard: {...board}};

        case TypeKeys.setBoard:
            const existingBoardIdx = state.boards.findIndex(board => board.id === payload.id);
            if (existingBoardIdx !== -1) {
                // Update existing board
                return {...state, boards: state.boards.map((board, i) => i === existingBoardIdx ? {...board, ...payload} : board)};
            } else {
                // Add new board
                return {...state, boards: [...state.boards, payload]};
            }
        case TypeKeys.editBoard:
            return {...state, editedBoard: action.payload};

        case TypeKeys.deleteBoard:
            const boardId = action.payload;
            let curBoard = state.currentBoard;
            if (curBoard.id === boardId) {
                curBoard = state.boards.length ? state.boards[0] : null
            }
            return {...state, currentBoard: curBoard, boards: state.boards.filter(board => board.id !== boardId)}

        case TypeKeys.refreshCurrentBoard:
            return {...state, shouldRefreshCurrentBoard: payload};

        default:
            return state;
    }
}