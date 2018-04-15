import { withRouter } from 'react-router';
import { connect } from "react-redux";
import Modal from 'react-modal/lib/components/Modal';

import { setPanelAction, resetControlValuesAction, resetAxeFxAction, getCurrentPanelAction, editPanelAction } from "../store/actions";
import { WebMidiWrapper, MIDIController, MIDIListenerType, updateDevices, getAxeFxInstance, getControllerInstance, MIDIDeviceStateChange, MIDIDeviceType, MIDIControllerType, buildInstances } from "../api/midi";
import { MODEL_IDS, PARAM_VALUE_MULTIPLIER } from "../api/constants";
import { AxeFx } from "../api/axefx";
import { GenericMIDIController } from "../api/generic-midi-controller";
import { PanelObject } from "../api/panel-object";
import { AppComponent } from "../components/app";
import { FX_BLOCK_IDS, FX_PARAMS } from '../api/fx-block-data';
import { parameterValueBytesToInt, generateId, midiValueToAxeFx } from '../util/util';
import { getAllBlocks } from '../api/fx-block';
import { getStoreStateSlice } from '../store/store';

const mapStateToProps = state => ({
    axeFx: state.app.axeFx,
    controller: state.app.controller,
    devices: state.app.devices,
    panels: state.app.panels,
    currentPanel: state.app.currentPanel,
    editedPanel: state.app.editedPanel,
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

            buildInstances(dispatch, history);

            dispatch(resetAxeFxAction());
            dispatch(resetControlValuesAction());

            WebMidiWrapper.webMidi.addListener(MIDIDeviceStateChange.Connected, event => {
                console.log('connected device', event);
                const device = event.port;
                const devices = getStoreStateSlice('devices');
                updateDevices(devices);
            });

            WebMidiWrapper.webMidi.addListener(MIDIDeviceStateChange.Disconnected, event => {
                console.log('disconnected device', event);
                const device = event.port;
                const axeFx = getAxeFxInstance();
                const controller = getControllerInstance();
                if (device.type === MIDIDeviceType.Input) {
                    if (axeFx.input.name === device.name) {
                        axeFx.disconnect();
                    } else if (controller.input.name === device.name) {
                        controller.disconnect();
                    }
                }
            });

            if (currentPanel && history.location !== `/panels/${currentPanel.id}`) {
                history.push(`/panels/${currentPanel.id}`);
            }
        },
        addNewPanel() {
            const panel: PanelObject = {
                id: generateId(),
                label: `Panel ${panels.length + 1}`,
                controllerId: controller ? controller.id : null,
                controls: [],
                groups: []
            };
            dispatch(setPanelAction(panel));
            history.push(`/panels/${panel.id}`);
        },
        editPanel(panel) {
            dispatch(editPanelAction(panel));
        }
    }
};

export default withRouter(connect(mapStateToProps, null, mergeProps)(AppComponent));
