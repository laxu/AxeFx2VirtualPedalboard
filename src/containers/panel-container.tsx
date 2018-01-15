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
import { generateId } from '../util/util';

const mapStateToProps = state => ({
    panel: state.app.currentPanel
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const { dispatch } = dispatchProps;
    const { panel } = stateProps;
    return {
        ...stateProps,
        ...dispatchProps,
        ...ownProps,
        init(panelId) {
            dispatch(getPanelAction(panelId));
        },
        savePanelChanges(formValues) {
            const updatedPanel = Object.assign({}, panel, formValues);
            dispatch(setPanelAction(updatedPanel));
            dispatch(getPanelAction(updatedPanel.id));
        },
        addPanelControl(controlType: ControlType) {
            const control: ControlObject = {
                id: generateId(),
                block: null,
                param: null,
                controlType,
                cc: null
            };
            panel.controls.push(control);
        },
        removePanelControl(control: ControlObject) {
            const controlIdx = panel.controls.findIndex(ctrl => ctrl.id === control.id);
            if (controlIdx === -1) throw new Error('Trying to remove control that does not exist!');
            panel.controls.splice(controlIdx, 1);
        }
    };
};

export default withRouter(connect(mapStateToProps, null, mergeProps)(PanelComponent));
