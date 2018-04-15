import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { getCurrentBoardAction, setBoardAction, updateControlValueAction } from "../store/actions";
import { getAxeFxInstance } from "../api/midi";
import { MODEL_IDS, DEBOUNCE_TIME } from "../api/constants";
import { GenericMIDIController } from "../api/generic-midi-controller";
import { BoardObject } from "../api/board-object";
import { ControlType, ControlObject } from '../api/control-object';
import { generateId } from '../util/util';
import BoardComponent from '../components/board/board';
import { GroupObject, KnobMode, KnobColor, KnobStyle, GroupSizeType } from '../api/group-object';

const mapStateToProps = state => ({
    axeFx: state.app.devices.axeFx,
    controller: state.app.devices.controller,
    board: state.app.board.currentBoard,
    boards: state.app.board.boards
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const { board } = stateProps;
    const { dispatch } = dispatchProps;
    const { match } = ownProps;
    return {
        ...stateProps,
        ...dispatchProps,
        ...ownProps,
        init() {
            dispatch(getCurrentBoardAction(match.params.boardId));
        },
        updateControlValues() {
            const { board } = stateProps;
            const axeFx = getAxeFxInstance();
            if (board) {
                board.controls.forEach(control => {
                    const { blockId, paramId } = control;
                    if (blockId && paramId >= 0) {
                        dispatch(updateControlValueAction({blockId, paramId, paramValue: null}));
                        if (axeFx && axeFx.output) {
                            axeFx.getBlockParamValue(blockId, paramId);
                        }
                    }
                });
            }
        },
        saveBoardChanges() {
            dispatch(setBoardAction({...board}));
            dispatch(getCurrentBoardAction(board.id));
        },
        addBoardGroup() {
            const group: GroupObject = {
                id: generateId(),
                label: '',
                bgColor: '#ccc',
                textColor: '#222',
                showBlockNames: true,
                showKnobs: KnobMode.NumericOnly,
                knobColor: KnobColor.Black,
                knobStyle: KnobStyle.Simple,
                size: {
                    type: GroupSizeType.Auto,
                    width: 250,
                    height: 250
                }
            }
            board.groups.push(group);
        },
        removeBoardGroup(group: GroupObject) {
            const idx = board.groups.findIndex(g => g.id === group.id);
            if (idx === -1) throw new Error('Trying to remove group that does not exist!');
            board.groups.splice(idx, 1);
        },
        addBoardControl(group: GroupObject, controlType: ControlType) {
            const control: ControlObject = {
                id: generateId(),
                blockId: null,
                paramId: null,
                paramValue: null,
                rawValue: null,
                controlType,
                isRelative: true,
                cc: null,
                groupId: group.id
            };
            board.controls.push(control);
        },
        removeBoardControl(control: ControlObject) {
            const controlIdx = board.controls.findIndex(ctrl => ctrl.id === control.id);
            if (controlIdx === -1) throw new Error('Trying to remove control that does not exist!');
            board.controls.splice(controlIdx, 1);
        }
    };
};

export default withRouter(connect(mapStateToProps, null, mergeProps)(BoardComponent));
