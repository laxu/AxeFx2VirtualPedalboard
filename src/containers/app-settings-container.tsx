import { connect } from 'react-redux';
import { setMIDIDeviceDataAction } from '../store/actions';
import { WebMidiWrapper, MIDIInput, MIDIOutput, MIDIControllerType, MIDIDeviceData, updateDevices, getAxeFxInstance, getControllerInstance } from '../api/midi';
import { AxeFx } from '../api/axefx';
import { GenericMIDIController } from '../api/generic-midi-controller';
import AppSettingsComponent from '../components/app-settings/app-settings';
import { MODEL_IDS } from '../api/constants';
import { generateId } from '../util/util';

const mapStateToProps = state => ({
    devices: state.app.devices.devices
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    saveChanges(formData) {
        const { dispatch } = dispatchProps;
        const axeFx = getAxeFxInstance();
        const controller = getControllerInstance();
        const devices: MIDIDeviceData[] = [
            {
                id: axeFx.id,
                type: MIDIControllerType.AxeFx,
                inputName: formData.axeFxInput,
                outputName: formData.axeFxOutput,
                channel: formData.axeFxChannel === 'all' ? 'all': Number(formData.axeFxChannel)
            },
            {
                id: controller.id,
                type: MIDIControllerType.Controller,
                inputName: formData.controllerInput,
                outputName: formData.controllerOutput,
                channel: formData.controllerChannel === 'all' ? 'all': Number(formData.axeFxChannel)
            },
        ]

        devices.map(device => dispatch(setMIDIDeviceDataAction(device)));
        updateDevices(devices);
    }
});

export default connect(mapStateToProps, null, mergeProps)(AppSettingsComponent);