import * as React from 'react';
import { FxBlock, FxParam } from '../../api/fx-block';
import { ControlType } from '../../api/control-object';
import { PanelObject } from '../../api/panel-object';
import ControlComponent from '../control/control'

interface PanelProps {
    panel: PanelObject;
    addPanelControl: (controlType: ControlType) => void;
}

interface PanelState {
    editMode: boolean;
}

export default class PanelComponent extends React.Component<PanelProps, PanelState> {
    constructor(props) {
        super(props);
        this.state = {
            editMode: false
        };
    }

    toggleEdit() {
        this.setState({ editMode: !this.state.editMode });
    }

    addControl(controlType: ControlType) {
        const { addPanelControl } = this.props;
        addPanelControl(controlType)
    }

    render() {
        const { panel } = this.props;
        const { editMode } = this.state;

        return (
            <div className="panel">
                <div className="panel__header">
                    <div className="panel__label">
                        {!editMode && <span>{panel.label}</span>}
                        {editMode && <input type="text" value={panel.label} className="panel__label--input" />}
                    </div>
                    <div className="panel__actions">
                        <button className="btn" onClick={() => this.toggleEdit()}>Edit</button>
                        {editMode && <button className="btn" onClick={() => this.addControl(ControlType.Control)}>Add control</button>}
                        {editMode && <button className="btn" onClick={() => this.addControl(ControlType.Switch)}>Add switch</button>}
                    </div>
                </div>
                <div className="panel__controls">
                    {panel.controls.length > 0 && panel.controls.map(control => (
                        <ControlComponent
                            controlType={control.controlType}
                            block={control.block}
                            param={control.param}
                            editMode={editMode}
                        ></ControlComponent>
                    ))}
                </div>
            </div>
        );
    }
}