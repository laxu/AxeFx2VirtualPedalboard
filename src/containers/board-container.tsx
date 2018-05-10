import { connect } from 'react-redux';

import { setCurrentBoardAction, setBoardAction, updateControlValueAction } from "../store/actions";
import { getAxeFxInstance } from "../api/midi";
import { MODEL_IDS, DEBOUNCE_TIME } from "../api/constants";
import { GenericMIDIController } from "../api/generic-midi-controller";
import { BoardObject } from "../api/board-object";
import { ControlType, ControlObject } from '../api/control-object';
import { generateId } from '../util/util';
import BoardComponent from '../components/board/board';
import { GroupObject, KnobMode, KnobColor, KnobStyle, GroupSizeType } from '../api/group-object';
import { createGroup, createControl } from '../util/object-helper';

const mapStateToProps = state => ({
    axeFx: state.app.devices.axeFx,
    controller: state.app.devices.controller,
    board: state.app.board.currentBoard,
    boards: state.app.board.boards
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const { board } = stateProps;
    const { dispatch } = dispatchProps;
    return {
        ...stateProps,
        ...dispatchProps,
        ...ownProps,
        init() {
        },
        updateControlValues() {
            const { board, axeFx } = stateProps;
            const axeFxInstance = getAxeFxInstance();
            if (board) {
                board.controls.forEach(control => {
                    const { blockId, paramId } = control;
                    if (blockId && paramId >= 0) {
                        dispatch(updateControlValueAction({blockId, paramId, formattedValue: null, paramValue: null }));
                        if (axeFxInstance && axeFx.connected) {
                            axeFxInstance.getBlockParamValue(blockId, paramId);
                        }
                    }
                });
            }
        },
        saveBoardChanges() {
            dispatch(setBoardAction({...board}));
            dispatch(setCurrentBoardAction(board.id));
        },
        addBoardGroup() {
            board.groups.push(createGroup());
        },
        removeBoardGroup(group: GroupObject) {
            const idx = board.groups.findIndex(g => g.id === group.id);
            if (idx === -1) throw new Error('Trying to remove group that does not exist!');
            board.groups.splice(idx, 1);
        },
        addBoardControl(group: GroupObject, controlType: ControlType) {
            const control = createControl({ groupId: group.id, controlType });
            board.controls.push(control);
        },
        removeBoardControl(control: ControlObject) {
            const controlIdx = board.controls.findIndex(ctrl => ctrl.id === control.id);
            if (controlIdx === -1) throw new Error('Trying to remove control that does not exist!');
            board.controls.splice(controlIdx, 1);
        }
    };
};

export default connect(mapStateToProps, null, mergeProps)(BoardComponent);
