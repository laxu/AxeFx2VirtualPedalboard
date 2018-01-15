import { connect } from 'react-redux';
import { ControlType, ControlObject } from '../api/control-object';
import ControlEditorComponent from '../components/control-editor/control-editor';

const mapStateToProps = state => ({
    panel: state.app.currentPanel
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    saveChanges(formData) {
        const { panel } = stateProps;
        const { id, controlType, blockId, paramId, cc } = formData;
        const controlIdx = panel.controls.findIndex(ctrl => ctrl.id === id);
        if (controlIdx === -1) throw new Error(`Could not find control for ID "${id}"`);
        const updatedControl: ControlObject = {
            id: id,
            blockId,
            paramId,
            paramValue: null,
            controlType,
            cc
        };
        panel.controls[controlIdx] = updatedControl;
    },
});

export default connect(mapStateToProps, null, mergeProps)(ControlEditorComponent);
