import * as React from 'react';
import { MIDIController, WebMidiWrapper, isAxeFx, MIDIInput, MIDIOutput, MIDIControllerType, MIDIDeviceData } from '../../api/midi';
import { handleSubmit, numRange } from '../../util/util';
import './_app-settings.scss';

interface Props {
    devices: MIDIDeviceData[],
    saveChanges: (formData: any) => void;
    onCancel: () => void;
}

interface State {
    inputs: MIDIInput[];
    outputs: MIDIOutput[];
    midiChannels: number[]
}

export default class AppSettingsComponent extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            inputs: WebMidiWrapper.webMidi.inputs,
            outputs: WebMidiWrapper.webMidi.outputs,
            midiChannels: numRange(1, 16)
        };

        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(formData) {
        const { saveChanges, onCancel } = this.props;
        if (!formData.axeFxInput || !formData.axeFxOutput || !formData.controllerOutput) return false;
        saveChanges(formData);
        onCancel();
        return true;
    }

    onCancel(event) {
        event.preventDefault();
        this.props.onCancel();
    }

    render() {
        const { devices } = this.props;
        const { inputs, outputs, midiChannels } = this.state;

        const axeFx = devices.find(device => device.type === MIDIControllerType.AxeFx);
        const controller = devices.find(device => device.type === MIDIControllerType.Controller);

        return (
            <form className="form form--inline app-settings" name="appSettingsForm" onSubmit={handleSubmit(this.onSubmit)}>
                <h1>App settings</h1>
                <div className="settings__axefx">
                    <h4>Axe-Fx</h4>
                    <div className="form-group">
                        <label>MIDI input</label>
                        <select name="axeFxInput" defaultValue={axeFx && axeFx.inputName}>
                            <option disabled value="">Select Axe-Fx 2 / AX8 MIDI input</option>
                            {inputs.map((input, i) => (
                                <option key={`midi-input-${i}`} value={input.name}>{i + 1}: {input.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>MIDI output</label>
                        <select name="axeFxOutput" defaultValue={axeFx && axeFx.outputName}>
                            <option disabled value="">Select Axe-Fx 2 / AX8 MIDI output</option>
                            {outputs.map((output, i) => (
                                <option key={`midi-output-${i}`} value={output.name}>{i + 1}: {output.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>MIDI channel</label>
                        <select name="axeFxChannel" defaultValue={axeFx && axeFx.channel as string}>
                            <option disabled value="">Select Axe-Fx 2 / AX8 MIDI channel</option>
                            <option value="all">Global</option>
                            {midiChannels.map((channelNum, i) => (
                                <option key={`midi-channel-${i}`} value={channelNum}>{channelNum}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="settings__controller">
                    <h4>MIDI controller</h4>
                    <div className="form-group">
                        <label>MIDI input</label>
                        <select name="controllerInput" defaultValue={controller && controller.inputName}>
                            <option disabled value="">Select MIDI controller input</option>
                            {inputs.map((input, i) => (
                                <option key={`midi-input-${i}`} value={input.name}>{i + 1}: {input.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>MIDI output</label>
                        <select name="controllerOutput" defaultValue={controller && controller.outputName}>
                            <option disabled value="">Select MIDI controller output</option>
                            {outputs.map((output, i) => (
                                <option key={`midi-output-${i}`} value={output.name}>{i + 1}: {output.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>MIDI channel</label>
                        <select name="controllerChannel" defaultValue={controller && controller.channel as string}>
                            <option disabled value="">Select MIDI controller channel</option>
                            <option value="all">Global</option>
                            {midiChannels.map((channelNum, i) => (
                                <option key={`midi-channel-${i}`} value={channelNum}>{channelNum}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="actions">
                    <button className="btn" onClick={(event) => this.onCancel(event)}>Cancel</button>
                    <input type="submit" value="Save" className="btn btn--primary" />
                </div>
            </form>
        );

    }
}