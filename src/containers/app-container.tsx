import { withRouter } from 'react-router';
import { connect } from "react-redux";
import Modal from 'react-modal/lib/components/Modal';

import { setPanelAction, resetControlValuesAction, resetAxeFxAction } from "../store/actions";
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

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const { controller, devices, panels, currentPanel } = stateProps;
    const { dispatch } = dispatchProps;
    const { match, history } = ownProps;
    return {
        ...stateProps,
        ...dispatchProps,
        ...ownProps,
        init() {
            Modal.setAppElement(document.getElementById('app-container'));

            dispatch(resetAxeFxAction());
            dispatch(resetControlValuesAction());
            updateDevices(devices, dispatch);
        },
        addNewPanel() {
            const panel: PanelObject = {
                id: generateId(),
                label: `Panel ${panels.length + 1}`,
                controllerId: controller ? controller.id : null,
                controls: []
            };
            dispatch(setPanelAction(panel));
            history.push(`/panels/${panel.id}`);
        }
    }
};

export default withRouter(connect(mapStateToProps, null, mergeProps)(AppComponent));
