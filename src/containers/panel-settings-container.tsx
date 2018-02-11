import { connect } from "react-redux";
import { editPanelAction, setPanelAction, deletePanelAction } from "../store/actions";
import PanelSettingsComponent from "../components/panel-settings/panel-settings";

const mapStateToProps = state => ({
    panel: state.app.editedPanel
});

const mergeProps = (stateProps, dispatchProps) => {
    const { panel } = stateProps;
    const { dispatch } = dispatchProps;
    return {
        ...stateProps,
        ...dispatchProps,
        saveSettings(formValues) {
            const updatedPanel = {
                ...panel,
                ...formValues,
                cc: formValues.cc.trim() !== '' ? Number(formValues.cc) : null
            };
            dispatch(setPanelAction(updatedPanel));
            dispatch(editPanelAction(null));
        },

        deletePanel() {
            dispatch(deletePanelAction(panel.id));
            dispatch(editPanelAction(null));
        },
    
        close() {
            dispatch(editPanelAction(null));
        }
    };
    
};

export default connect(mapStateToProps, null, mergeProps)(PanelSettingsComponent);