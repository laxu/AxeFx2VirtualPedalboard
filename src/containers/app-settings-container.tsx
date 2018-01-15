import { connect } from 'react-redux';
import { setMIDIDeviceData } from '../store/actions';
import { WebMidiWrapper, MIDIInput, MIDIOutput, MIDIControllerType, MIDIDeviceData, updateDevices } from '../api/midi';
import { AxeFx } from '../api/axefx';
import { GenericMIDIController } from '../api/generic-midi-controller';
import AppSettingsComponent from '../components/app-settings/app-settings';
import { MODEL_IDS } from '../api/constants';
import { generateId } from '../util/util';

const mapStateToProps = state => ({
    devices: state.app.devices
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    saveChanges(formData) {
        const { dispatch } = dispatchProps;
        const devices: MIDIDeviceData[] = [
            {
                id: 'axeFx',
                type: MIDIControllerType.AxeFx,
                inputName: formData.axeFxInput,
                outputName: formData.axeFxOutput,
                channel: formData.axeFxChannel === 'all' ? 'all': Number(formData.axeFxChannel)
            },
            {
                id: generateId(),
                type: MIDIControllerType.Controller,
                inputName: formData.controllerInput,
                outputName: formData.controllerOutput,
                channel: formData.axeFxChannel === 'all' ? 'all': Number(formData.axeFxChannel)
            },
        ]

        devices.map(device => dispatch(setMIDIDeviceData(device)));
        updateDevices(devices, dispatch);
    }
});

export default connect(mapStateToProps, null, mergeProps)(AppSettingsComponent);