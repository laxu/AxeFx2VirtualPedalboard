import * as React from 'react';
import { GenericMIDIController } from '../api/generic-midi-controller';
import { AxeFx } from '../api/axefx';

interface HeaderProps {
    axeFx: AxeFx,
    controller: GenericMIDIController,
    firmwareVersion: string;
    presetName: string;
}

export default class HeaderComponent extends React.Component<HeaderProps> {
    openSettings() {}
    render() {
        const { axeFx, controller, firmwareVersion, presetName } = this.props;
        const axeFxName = axeFx ? axeFx.name : null;
        const controllerName = controller ? controller.name : null;
        
        return <div className="header">
                <button className="btn settings" onClick={this.openSettings}>Settings</button>
                <div className="axe-fx-info">
                    <h3>Axe-Fx</h3>
                    <div className="device-name">Device name: <span>{axeFxName}</span></div>
                    <div className="firmware-version">Firmware version: <span>{firmwareVersion}</span></div>
                    <div className="presetName">Preset: <span>{presetName}</span></div>
                </div>
                <hr />
                <div className="controller-info">
                    <h3>MIDI Controller</h3>
                    <div className="device-name">Device name: <span>{controllerName}</span></div>
                </div>
            </div>;
    }
}
