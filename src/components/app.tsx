import * as React from 'react';
import Header from './header';
import { AxeFx } from '../api/axefx';
import { GenericMIDIController } from '../api/generic-midi-controller';
import { PanelObject } from '../api/panel-object';
import Sidebar from './sidebar/sidebar';

interface AppProps {
    init: () => void;
    axeFx: AxeFx;
    controller: GenericMIDIController;
    firmwareVersion: string;
    presetName: string;
    panels: PanelObject[];
}

export class AppComponent extends React.Component<AppProps> {
    constructor(props) {
        super(props);
        this.props.init();
    }
    render() {
        const { axeFx, controller, firmwareVersion, presetName, panels } = this.props;
        return <div className="app">
                <Header firmwareVersion={firmwareVersion} presetName={presetName} axeFx={axeFx} controller={controller}></Header>
                <Sidebar panels={panels}></Sidebar>
                <div className="main-container">
                </div>
            </div>;
    }
}