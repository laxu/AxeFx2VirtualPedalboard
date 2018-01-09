import * as React from 'react';
import { GenericMIDIController } from '../../api/generic-midi-controller';
import { AxeFx } from '../../api/axefx';
import './_header.scss';

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
        
        return (
            <div className="header">
                <div className="logo">Axe-Fx MIDI</div>
                <div className="info">
                    <div className="axe-fx-info">
                        <h4>Axe-Fx</h4>
                        <div className="device-name">Device name: <span>{axeFxName}</span></div>
                        <div className="firmware-version">Firmware version: <span>{firmwareVersion}</span></div>
                        <div className="presetName">Preset: <span>{presetName}</span></div>
                    </div>
                    <div className="controller-info">
                        <h4>MIDI Controller</h4>
                        <div className="device-name">Device name: <span>{controllerName}</span></div>
                    </div>
                </div>
                <div className="actions">
                    <button className="btn settings" onClick={this.openSettings}>Settings</button>
                </div>
                
                
            </div>
        );
    }
}
