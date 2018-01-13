import * as React from 'react';
import { AxeFx } from '../../api/axefx';
import { MIDIController, WebMidiWrapper, isAxeFx, MIDIInput, MIDIOutput } from '../../api/midi';
import { range } from '../../util/util';

interface Props {
    axeFx: AxeFx;
    controller: MIDIController;
    saveChanges: (formValues: any) => void;
    onCancel: () => void;
}

interface State {
    axeFxInputs: MIDIInput[];
    axeFxOutputs: MIDIOutput[];
    controllerInputs: MIDIInput[];
    controllerOutputs: MIDIOutput[];
    midiChannels: number[]
}

export default class AppSettingsComponent extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            axeFxInputs: WebMidiWrapper.webMidi.inputs.filter(inputDevice => isAxeFx(inputDevice)),
            axeFxOutputs: WebMidiWrapper.webMidi.outputs.filter(outputDevice => isAxeFx(outputDevice)),
            controllerInputs: WebMidiWrapper.webMidi.inputs.filter(inputDevice => !isAxeFx(inputDevice)),
            controllerOutputs: WebMidiWrapper.webMidi.outputs.filter(outputDevice => !isAxeFx(outputDevice)),
            midiChannels: range(1, 12)
        };
    }

    onSubmit(event) {
        const { saveChanges } = this.props;
        const formValues: any = new FormData(event.target);
        if (!formValues.axeFxInput || !formValues.axeFxOutput || !formValues.controllerOutput) return false;
        saveChanges(formValues);
        return true;
    }

    render() {
        const { axeFx, controller, onCancel } = this.props;
        const { axeFxInputs, axeFxOutputs, controllerInputs, controllerOutputs, midiChannels } = this.state;

        return (
            <form className="app-settings" onSubmit={this.onSubmit}>
                <h1>App settings</h1>
                <div className="settings__axefx">
                    <h4>Axe-Fx</h4>
                    <div>
                        <label>MIDI input</label>
                        <select name="axeFxInput" defaultValue={axeFx && axeFx.input.name}>
                            <option disabled value="">Select Axe-Fx 2 / AX8 MIDI input</option>
                            {axeFxInputs.map((input, i) => (
                                <option key={`midi-input-${i}`} value={input.name}>{input.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>MIDI output</label>
                        <select name="axeFxOutput" defaultValue={axeFx && axeFx.output.name}>
                            <option disabled value="">Select Axe-Fx 2 / AX8 MIDI output</option>
                            {axeFxOutputs.map((output, i) => (
                                <option key={`midi-output-${i}`} value={output.name}>{output.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
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
                    <div>
                        <label>MIDI input</label>
                        <select name="controllerInput" defaultValue={controller && controller.input.name}>
                            <option disabled value="">Select MIDI controller input</option>
                            {controllerInputs.map((input, i) => (
                                <option key={`midi-input-${i}`} value="input.name">{input.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>MIDI output</label>
                        <select name="controllerOutput" defaultValue={controller && controller.output.name}>
                            <option disabled value="">Select MIDI controller output</option>
                            {controllerOutputs.map((output, i) => (
                                <option key={`midi-output-${i}`} value="output.name">{output.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
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
                    <input type="submit" value="Save" className="btn" />
                    <button className="btn" onClick={() => onCancel()}>Cancel</button>
                </div>
            </form>
        );

    }
}