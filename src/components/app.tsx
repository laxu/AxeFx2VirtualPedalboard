import * as React from 'react';
import { Route } from 'react-router-dom'

import Header from './header/header';
import { AxeFx } from '../api/axefx';
import { GenericMIDIController } from '../api/generic-midi-controller';
import { PanelObject } from '../api/panel-object';
import Sidebar from './sidebar/sidebar';
import PanelContainer from '../containers/panel-container';

interface Props {
    init: () => void;
    addNewPanel: () => void;
    axeFx: AxeFx;
    controller: GenericMIDIController;
    firmwareVersion: string;
    presetName: string;
    panels: PanelObject[];
    currentPanel: PanelObject;
}

export class AppComponent extends React.Component<Props> {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.init();
    }

    render() {
        const { addNewPanel, axeFx, controller, firmwareVersion, presetName, panels, currentPanel } = this.props;
        return <div id="app">
                <Header firmwareVersion={firmwareVersion} presetName={presetName} axeFx={axeFx} controller={controller}></Header>
                <Sidebar addNewPanel={addNewPanel} panels={panels} currentPanelId={currentPanel.id}></Sidebar>
                <div className="main-container">
                    <Route path="/panels/:panelId" component={PanelContainer} />
                </div>
            </div>;
    }
}