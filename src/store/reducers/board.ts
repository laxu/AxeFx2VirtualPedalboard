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
            const { blockId, paramId, paramValue, formattedValue } = payload;
            const { currentBoard } = state;
            const controlIdx = currentBoard.controls.findIndex(ctrl => ctrl.blockId === blockId && ctrl.paramId === paramId);
            const updatedBoard: BoardObject = {
                ...currentBoard,
                controls: currentBoard.controls.map((ctrl, i) => {
                    if (i === controlIdx) {
                        const controlObj = {...ctrl, paramValue, formattedValue}
                        currentBoard.ccMap[ctrl.cc] = controlObj;
                        return controlObj;
                    }
                    return ctrl;
                })
            };
            return {...state, currentBoard: updatedBoard };

        case TypeKeys.resetControlValues:
            const currBoard = state.currentBoard || null;
            if (currBoard) {
                currBoard.controls = currBoard.controls.map(ctrl => {
                    const controlObj = {...ctrl, paramValue: null, formattedValue: null };
                    currBoard.ccMap[ctrl.cc] = controlObj;
                    return controlObj;
                });
            }
            return {
                ...state,
                currentBoard: currBoard,
                boards: state.boards.map(board => {
                    board.controls = board.controls.map(ctrl => {
                        const controlObj = {...ctrl, paramValue: null, formattedValue: null };
                        board.ccMap[ctrl.cc] = controlObj;
                        return controlObj;
                    });
                    return board;
                })
            };

        case TypeKeys.setCurrentBoard:
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