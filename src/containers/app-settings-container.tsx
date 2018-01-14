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
    saveChanges(formValues) {
        const { dispatch } = dispatchProps;
        const axeFxInput: MIDIInput = WebMidiWrapper.webMidi.getInputByName(formValues.axeFxInput.input);
        const axeFxOutput: MIDIOutput = WebMidiWrapper.webMidi.getOutputByName(formValues.axeFxOutput.output);
        const axeFx = new AxeFx({
            id: 1,
            name: 'AxeFx',
            type: MIDIControllerType.AxeFx,
            input: axeFxInput,
            output: axeFxOutput,
            channel: formValues.axeFxChannel === 'all' ? 'all': Number(formValues.axeFxChannel)
        });

        const controllerInput: MIDIInput = WebMidiWrapper.webMidi.getInputByName(formValues.controllerInput.input);
        const controllerOutput: MIDIOutput = WebMidiWrapper.webMidi.getOutputByName(formValues.controllerOutput.output);
        const controller = new GenericMIDIController({
            id: 'genericMidiController',
            name: 'MIDI controller',
            type: MIDIControllerType.Controller,
            input: controllerInput,
            output: controllerOutput,
            channel: formValues.controllerChannel === 'all' ? 'all': Number(formValues.controllerChannel)
        });

        dispatch(setAxeFxAction(axeFx));
        dispatch(setMIDIControllerAction(controller));
    }
});

export default connect(mapStateToProps, null, mergeProps)(AppSettingsComponent);