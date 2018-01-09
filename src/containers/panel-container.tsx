import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { getPanelAction } from "../store/actions";
import { WebMidiWrapper, MIDIController, MIDIListenerType } from "../api/midi";
import { MODEL_IDS } from "../api/constants";
import { AxeFx } from "../api/axefx";
import { GenericMIDIController } from "../api/generic-midi-controller";
import { PanelObject } from "../api/panel-object";
import { ControlType, ControlObject } from '../api/control-object';
import PanelComponent from '../components/panel/panel';

const mapStateToProps = state => ({
    panel: state.currentPanel
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    ...dispatchProps,
    init() {
        const { dispatch } = dispatchProps;
        const { match } = ownProps;
        dispatch(getPanelAction(match.params.panelId));
    },
    addPanelControl(controlType: ControlType) {
        const control: ControlObject = {
            block: null,
            param: null,
            controlType
        }
        stateProps.panel.controls.push(control);
    }
});

export default withRouter(connect(mapStateToProps, null, mergeProps)(PanelComponent));
