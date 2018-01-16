import { withRouter } from 'react-router';
import { connect } from "react-redux";
import Modal from 'react-modal/lib/components/Modal';

import { setPanelAction } from "../store/actions";
import { WebMidiWrapper, MIDIController, MIDIListenerType, updateDevices, getAxeFxInstance, getControllerInstance } from "../api/midi";
import { MODEL_IDS, PARAM_VALUE_MULTIPLIER } from "../api/constants";
import { AxeFx } from "../api/axefx";
import { GenericMIDIController } from "../api/generic-midi-controller";
import { PanelObject } from "../api/panel-object";
import { AppComponent } from "../components/app";
import { FX_BLOCK_IDS, FX_PARAMS } from '../api/fx-block-data';
import { parameterValueBytesToInt, generateId, midiValueToAxeFx } from '../util/util';
import { getAllBlocks } from '../api/fx-block';

const mapStateToProps = state => ({
    axeFx: state.app.axeFx,
    controller: state.app.controller,
    devices: state.app.devices,
    panels: state.app.panels,
    currentPanel: state.app.currentPanel,
    loading: state.app.loading
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    init() {
        const { devices, panels, currentPanel } = stateProps;
        const { dispatch } = dispatchProps;
        const { history } = ownProps;
        Modal.setAppElement(document.getElementById('app-container'));

        updateDevices(devices, dispatch);

        if(panels.length) {
            history.push(`/panels/${panels[0].id}`);
        }
    },
    addNewPanel() {
        const { panels, controller } = stateProps;
        const { dispatch } = dispatchProps;
        const { history } = ownProps;
        const panel: PanelObject = {
            id: generateId(),
            label: `Panel ${panels.length + 1}`,
            controllerId: controller ? controller.id : null,
            controls: []
        };
        dispatch(setPanelAction(panel));
        history.push(`/panels/${panel.id}`);
    }
});

export default withRouter(connect(mapStateToProps, null, mergeProps)(AppComponent));
