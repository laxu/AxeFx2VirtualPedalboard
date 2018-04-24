import { connect } from 'react-redux';
import { ControlType, ControlObject } from '../api/control-object';
import ControlEditorComponent from '../components/control-editor/control-editor';
import { getAxeFxInstance } from '../api/midi';
import { createControl } from '../util/object-helper';

const mapStateToProps = state => ({
    board: state.app.board.currentBoard
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    saveChanges(formData) {
        const { board } = stateProps;
        const { id, controlType, blockId, paramId, cc, isRelative, groupId } = formData;
        
        let controlIdx = -1;
        let originalControl;
        for(let i = 0, len = board.controls.length; i < len; i++) {
            const ctrl = board.controls[i];
            if (ctrl.id === id) {
                controlIdx = i;
                originalControl = ctrl;
                break;
            }
        }
        if (controlIdx === -1) throw new Error(`Could not find control for ID "${id}"`);
        const updatedControl: ControlObject = createControl({
            id: id,
            blockId,
            paramId,
            paramValue: null,
            rawValue: null,
            controlType,
            isRelative: !!isRelative,
            cc,
            groupId
        });
        board.controls.splice(controlIdx, 1, updatedControl);
        if (originalControl.cc && cc !== originalControl.cc && board.ccMap.hasOwnProperty(originalControl.cc)) {
            delete board.ccMap[originalControl.cc];
        }
        board.ccMap[cc] = updatedControl;

        const axeFx = getAxeFxInstance();
        if (blockId && paramId >= 0 && axeFx) {
            axeFx.getBlockParamValue(blockId, paramId);
        }
    },
});

export default connect(mapStateToProps, null, mergeProps)(ControlEditorComponent);
