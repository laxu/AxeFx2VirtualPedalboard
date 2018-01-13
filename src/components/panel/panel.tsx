import * as React from 'react';
import { FxBlock, FxParam } from '../../api/fx-block';
import { ControlType } from '../../api/control-object';
import { PanelObject } from '../../api/panel-object';
import ControlComponent from '../control/control'

import './_panel.scss';

interface Props {
    match: any,
    panel: PanelObject;
    init: (panelId: number) => void;
    savePanelChanges: (form) => void;
    addPanelControl: (controlType: ControlType) => void;
}

interface State {
    editMode: boolean;
    hasChanges: boolean;
    form: {
        label: string,
        cc: number
    }
}

export default class PanelComponent extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            editMode: false,
            hasChanges: false,
            form: {
                label: null,
                cc: null
            }
        };
    }

    componentDidMount() {
        //this.props.init();
    }

    componentWillReceiveProps(nextProps) {
        const { match } = nextProps;
       if (match.params.panelId !== this.props.match.params.panelId) {
           this.props.init(match.params.panelId);
       }
    }

    toggleEdit() {
        this.setState({ editMode: !this.state.editMode });
    }

    saveChanges() {
        const { savePanelChanges } = this.props;
        const { hasChanges, form } = this.state;
        if (!hasChanges) return;
        savePanelChanges(form);
        this.setState({ editMode: false, hasChanges: false });
    }

    setFormValue(prop: string, value: string | number, toType: string = 'text') {
        const { form } = this.state;
        form[prop] = toType === 'number' ? Number(value) : value;
        this.setState({
            hasChanges: true,
            form
        })
    }

    addControl(controlType: ControlType) {
        const { addPanelControl } = this.props;
        addPanelControl(controlType);
        this.setState({ hasChanges: true });
    }

    render() {
        const { panel } = this.props;
        const { editMode, hasChanges } = this.state;

        if (!panel) return null;

        return (
            <div className="panel">
                <div className="panel__header">
                    <div className="panel__label">
                        {!editMode && <span>{panel.label}</span>}
                        {editMode && <input type="text" 
                                            className="panel__label--input"
                                            defaultValue={panel.label} 
                                            onChange={event => this.setFormValue('label', event.target.value)} />}
                    </div>
                    <div className="panel__actions">
                        <button className="btn toggle-edit" onClick={() => this.toggleEdit()}>{editMode ? 'Cancel' : 'Edit'}</button>
                        {editMode && (
                        <div>
                            <div className="panel__edit-cc">
                                <label>Activate panel using CC:</label>
                                <input type="number" 
                                       defaultValue={panel.cc ? panel.cc.toString() : ''} 
                                       onChange={event => this.setFormValue('cc', event.target.value, 'number')} />
                            </div>
                            <div className="panel__edit-actions">
                                <button className="btn" onClick={() => this.saveChanges()} disabled={!hasChanges}>Save</button>
                                <button className="btn" onClick={() => this.addControl(ControlType.Control)}>Add control</button>
                                <button className="btn" onClick={() => this.addControl(ControlType.Switch)}>Add switch</button>
                            </div>
                        </div>)}
                    </div>
                </div>
                <div className="panel__controls">
                    {panel.controls.length > 0 && panel.controls.map((control, i) => (
                        <ControlComponent key={`control-${i}`}
                            controlType={control.controlType}
                            block={control.block}
                            param={control.param}
                            cc={control.cc}
                            editMode={editMode}
                        ></ControlComponent>
                    ))}
                    {panel.controls.length === 0 && <p>No controls, how about <a onClick={() => this.addControl(ControlType.Control)}>adding</a> some?</p>}
                </div>
            </div>
        );
    }
}