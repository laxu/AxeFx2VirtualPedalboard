import { withRouter } from 'react-router';
import { connect } from "react-redux";
import Modal from 'react-modal/lib/components/Modal';

import { setAxeFxAction, firmwareVersionAction, presetNameAction, setMIDIControllerAction, setPanelAction } from "../store/actions";
import { WebMidiWrapper, MIDIController, MIDIListenerType } from "../api/midi";
import { MODEL_IDS } from "../api/constants";
import { AxeFx } from "../api/axefx";
import { GenericMIDIController } from "../api/generic-midi-controller";
import { PanelObject } from "../api/panel-object";
import { AppComponent } from "../components/app";

const mapStateToProps = state => ({
    axeFx: state.app.axeFx,
    controller: state.app.controller,
    firmwareVersion: state.app.firmwareVersion,
    presetName: state.app.presetName,
    panels: state.app.panels,
    currentPanel: state.app.currentPanel
});

const mapDispatchToProps = dispatch => ({
    dispatch,
    async init() {
        Modal.setAppElement(document.getElementById('app-container'));
        const axeFxDevice = new AxeFx({
            id: MODEL_IDS['Axe-Fx II'],
            name: 'My Axe-Fx II',
            input: WebMidiWrapper.webMidi.getInputByName('AXE-FX'),
            output: WebMidiWrapper.webMidi.getOutputByName('AXE-FX')
        } as MIDIController);

        dispatch(setAxeFxAction(axeFxDevice));
        const controller = new GenericMIDIController({
            id: 1,
            name: 'Arturia BeatStep',
            input: WebMidiWrapper.webMidi.getInputByName('Arturia BeatStep'),
            output: WebMidiWrapper.webMidi.getOutputByName('Arturia BeatStep') 
        } as MIDIController);
        dispatch(setMIDIControllerAction(controller));

        const firmwareVersion = await axeFxDevice.getFirmwareVersion();
        dispatch(firmwareVersionAction(firmwareVersion));
        const presetName = await axeFxDevice.getPresetName();
        dispatch(presetNameAction(presetName));

        controller.input.addListener(MIDIListenerType.CC, 'all', event => {
            if (event.data[1] === 20) {
                axeFxDevice.getBlockParametersList(106);
            }
        })
    }
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    addNewPanel() {
        const { dispatch } = dispatchProps;
        const { history } = ownProps;
        const panelId = stateProps.panels.length + 1;
        const panel: PanelObject = {
            id: panelId,
            label: `Panel ${panelId}`,
            controller: stateProps.controller,
            controls: []
        };
        dispatch(setPanelAction(panel));
        history.push(`/panels/${panel.id}`);
    }
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(AppComponent));
