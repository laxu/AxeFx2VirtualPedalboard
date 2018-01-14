import * as React from 'react';
import { GenericMIDIController } from '../../api/generic-midi-controller';
import { AxeFx } from '../../api/axefx';
import Modal from 'react-modal/lib/components/Modal';
import './_header.scss';
import AppSettingsContainer from '../../containers/app-settings-container';

interface Props {
    axeFx: AxeFx,
    controller: GenericMIDIController,
    firmwareVersion: string;
    presetName: string;
}

interface State {
    showSettings: boolean;
}

export default class HeaderComponent extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            showSettings: false
        }
    }

    toggleSettingsModal(showSettings: boolean) {
        this.setState({ showSettings });
    }

    render() {
        const { axeFx, controller, firmwareVersion, presetName } = this.props;
        const { showSettings } = this.state;
        
        return (
            <div className="header">
                <div className="logo">Axe-Fx MIDI Middleman</div>
                <div className="info">
                    <div className="axe-fx-info">
                        <h4>Axe-Fx</h4>
                        <div className="info-container">
                            <div className="device-name">
                                <label>Device name:</label>
                                <span>{axeFx && axeFx.name}</span>
                                
                            </div>
                            <div className="firmware-version">
                                <label>Firmware version:</label>
                                <span>{firmwareVersion}</span>
                            </div>
                            <div className="presetName">
                                <label>Preset:</label>
                                <span>{presetName}</span>
                            </div>
                        </div>
                    </div>
                    <div className="controller-info">
                        <h4>MIDI Controller</h4>
                        <div className="info-container">
                            <div className="device-name">
                                <label>Device name:</label>
                                <span>{controller && controller.name}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="actions">
                    <button className="btn settings" onClick={() => this.toggleSettingsModal(true)}>Settings</button>
                </div>
                <Modal isOpen={showSettings}>
                    <AppSettingsContainer onCancel={() => this.toggleSettingsModal(false)}></AppSettingsContainer>
                </Modal>
                
            </div>
        );
    }
}
