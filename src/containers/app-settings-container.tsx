import { connect } from 'react-redux';
import { setAxeFxAction, setMIDIControllerAction } from '../store/actions';
import { WebMidiWrapper, MIDIInput, MIDIOutput, MIDIControllerType } from '../api/midi';
import { AxeFx } from '../api/axefx';
import { GenericMIDIController } from '../api/generic-midi-controller';
import AppSettingsComponent from '../components/app-settings/app-settings';

const mapStateToProps = state => ({
    axeFx: state.app.axeFx,
    controller: state.app.controller
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    saveChanges(formData) {
        const { dispatch } = dispatchProps;
        const axeFxInput: MIDIInput = WebMidiWrapper.webMidi.getInputByName(formData.axeFxInput);
        const axeFxOutput: MIDIOutput = WebMidiWrapper.webMidi.getOutputByName(formData.axeFxOutput);
        const axeFx = new AxeFx({
            id: 1,
            name: 'AxeFx',
            type: MIDIControllerType.AxeFx,
            input: axeFxInput,
            output: axeFxOutput,
            channel: formData.axeFxChannel === 'all' ? 'all': Number(formData.axeFxChannel)
        });

        const controllerInput: MIDIInput = WebMidiWrapper.webMidi.getInputByName(formData.controllerInput);
        const controllerOutput: MIDIOutput = WebMidiWrapper.webMidi.getOutputByName(formData.controllerOutput);
        const controller = new GenericMIDIController({
            id: 'genericMidiController',
            name: 'MIDI controller',
            type: MIDIControllerType.Controller,
            input: controllerInput,
            output: controllerOutput,
            channel: formData.controllerChannel === 'all' ? 'all': Number(formData.controllerChannel)
        });

        dispatch(setAxeFxAction(axeFx));
        dispatch(setMIDIControllerAction(controller));
    }
});

export default connect(mapStateToProps, null, mergeProps)(AppSettingsComponent);