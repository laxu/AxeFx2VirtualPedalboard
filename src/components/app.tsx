import * as React from 'react';
import { Route } from 'react-router-dom'

import Header from './header/header';
import { AxeFxState } from '../api/axefx';
import { ControllerState } from '../api/generic-midi-controller';
import { PanelObject } from '../api/panel-object';
import Sidebar from './sidebar/sidebar';
import PanelContainer from '../containers/panel-container';

interface Props {
    init: () => void;
    addNewPanel: () => void;
    axeFx: AxeFxState;
    controller: ControllerState;
    firmwareVersion: string;
    presetName: string;
    panels: PanelObject[];
    currentPanel: PanelObject;
    loading: boolean;
}

export class AppComponent extends React.Component<Props> {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.init();
    }

    render() {
        const { addNewPanel, axeFx, controller, firmwareVersion, presetName, panels, currentPanel, loading } = this.props;
        if (loading) return null;
        return <div id="app">
                <Header axeFx={axeFx} controller={controller}></Header>
                <Sidebar addNewPanel={addNewPanel} panels={panels} currentPanelId={currentPanel && currentPanel.id}></Sidebar>
                <div className="main-container">
                    <Route path="/panels/:panelId" component={PanelContainer} />
                </div>
            </div>;
    }
}