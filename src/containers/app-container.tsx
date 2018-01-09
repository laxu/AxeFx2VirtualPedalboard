import { AppComponent } from "../components/app";
import { connect } from "react-redux";
import { Dispatch } from 'redux';
import { setAxeFxAction, firmwareVersionAction, presetNameAction, setMIDIControllerAction, getPanelsAction } from "../store/actions";
import { WebMidiWrapper, MIDIController, MIDIListenerType } from "../api/midi";
import { MODEL_IDS } from "../api/constants";
import { AxeFx } from "../api/axefx";
import { GenericMIDIController } from "../api/generic-midi-controller";

const mapStateToProps = state => ({
    axeFx: state.axeFx,
    controller: state.controller,
    firmwareVersion: state.firmwareVersion,
    presetName: state.presetName,
    panels: state.panels
});

const mapDispatchToProps = dispatch => ({
    async init() {
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

        dispatch(getPanelsAction());

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
})
export default connect(mapStateToProps, mapDispatchToProps)(AppComponent);
