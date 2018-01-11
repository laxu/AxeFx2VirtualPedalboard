import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { getPanelAction, setPanelAction } from "../store/actions";
import { WebMidiWrapper, MIDIController, MIDIListenerType } from "../api/midi";
import { MODEL_IDS } from "../api/constants";
import { AxeFx } from "../api/axefx";
import { GenericMIDIController } from "../api/generic-midi-controller";
import { PanelObject } from "../api/panel-object";
import { ControlType, ControlObject } from '../api/control-object';
import PanelComponent from '../components/panel/panel';

const mapStateToProps = state => ({
    panel: state.app.currentPanel
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    init(panelId) {
        const { dispatch } = dispatchProps;
        dispatch(getPanelAction(panelId));
    },
    savePanelChanges(formValues) {
        const { panel } = stateProps;
        const { dispatch } = dispatchProps;
        const updatedPanel = Object.assign({}, panel, formValues);
        console.log('fuu', updatedPanel);
        dispatch(setPanelAction(updatedPanel));
        dispatch(getPanelAction(updatedPanel.id));
    },
    addPanelControl(controlType: ControlType) {
        const { panel } = stateProps;
        const control: ControlObject = {
            id: panel.controls.length + 1,
            block: null,
            param: null,
            controlType,
            cc: null
        };
        panel.controls.push(control);
        console.log('fuu', panel.controls);
    },
    removePanelControl(control: ControlObject) {
        const { panel } = stateProps;
        const controlIdx = panel.controls.find(ctrl => ctrl.id === control.id);
        panel.controls.splice(controlIdx, 1);
    }
});

export default withRouter(connect(mapStateToProps, null, mergeProps)(PanelComponent));
