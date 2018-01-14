import { connect } from 'react-redux';
import { ControlType, ControlObject } from '../api/control-object';
import ControlEditorComponent from '../components/control-editor/control-editor';
import { getBlockById } from '../api/fx-block';

const mapStateToProps = state => ({
    panel: state.app.currentPanel
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    saveChanges(formValues) {
        const { panel } = stateProps;
        const { controlId, controlType, blockId, paramId, cc } = formValues;
        const controlIdx = panel.controls.findIndex(ctrl => ctrl.id === formValues.controlId);
        const block = getBlockById(blockId);
        const param = block.getParam(paramId);
        const updatedControl: ControlObject = {
            id: controlId,
            block,
            param,
            controlType,
            cc
        };
        panel.controls[controlIdx] = updatedControl;
    },
});

export default connect(mapStateToProps, null, mergeProps)(ControlEditorComponent);
