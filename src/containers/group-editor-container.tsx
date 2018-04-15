import { connect } from 'react-redux';
import GroupEditorComponent from '../components/group-editor/group-editor';
import { GroupObject } from '../api/group-object';

const mapStateToProps = state => ({
    panel: state.app.currentPanel
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    saveGroup(formData) {
        const { panel } = stateProps;
        const { id, label, bgColor, textColor, size, showBlockNames, showKnobs, knobStyle, knobColor } = formData;
        const groupIdx = panel.groups.findIndex(group => group.id === id);
        if (groupIdx === -1) throw new Error(`Could not find group for ID "${id}"`);
        const updatedGroup: GroupObject = {
            id: id,
            label,
            bgColor: bgColor || '#ccc',
            textColor: textColor || '#222',
            size,
            showBlockNames,
            showKnobs,
            knobStyle,
            knobColor
        };
        panel.groups.splice(groupIdx, 1, updatedGroup);
    }
});

export default connect(mapStateToProps, null, mergeProps)(GroupEditorComponent);
