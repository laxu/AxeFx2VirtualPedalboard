import * as React from 'react';
import * as classNames from 'classnames';
import { ControllerState } from '../../api/generic-midi-controller';
import { AxeFxState } from '../../api/axefx';
import Modal from 'react-modal/lib/components/Modal';
import './_header.scss';
import AppSettingsContainer from '../../containers/app-settings-container';
import { MIDIDeviceData } from '../../api/midi';

interface Props {
    axeFx: AxeFxState,
    controller: ControllerState
}

interface State {
    showSettings: boolean;
}

function getStatusClassName(device: AxeFxState | ControllerState): string {
    return classNames(
        'device__status', 
        {
            'device__status--off': !device || !device.connected, 
            'device__status--on': device && device.connected
        }
    )
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
        const { axeFx, controller } = this.props;
        const { showSettings } = this.state;

        const axeFxStatusClassName = getStatusClassName(axeFx);
        const controllerStatusClassName = getStatusClassName(controller);
        
        return (
            <div className="header">
                <div className="logo">Axe-Fx MIDI Middleman</div>
                <div className="info">
                    <div className="axe-fx-info">
                        <h4>Axe-Fx</h4>
                        <div className="info-container">
                            <div className="device-name">
                                <label>Device name:</label>
                                <span>{axeFx.name || 'Not connected'}</span>
                                <div className={axeFxStatusClassName}></div>
                            </div>
                            <div className="presetName">
                                <label>Preset:</label>
                                <span>{axeFx.connected && `${axeFx.currentPresetNumber + 1} (scene ${axeFx.currentScene + 1}): ${axeFx.currentPresetName}`}</span>
                            </div>
                        </div>
                    </div>
                    <div className="controller-info">
                        <h4>MIDI Controller</h4>
                        <div className="info-container">
                            <div className="device-name">
                                <label>Device name:</label>
                                <span>{controller.name || 'Not connected'}</span>
                                <div className={controllerStatusClassName}></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="actions">
                    <button className="btn settings" onClick={() => this.toggleSettingsModal(true)}>
                        <i className="fa fa-gear"></i>
                        <span>Settings</span>
                    </button>
                </div>
                <Modal isOpen={showSettings} shouldCloseOnOverlayClick={false}>
                    <AppSettingsContainer onCancel={() => this.toggleSettingsModal(false)}></AppSettingsContainer>
                </Modal>
                
            </div>
        );
    }
}
