import * as React from 'react';
import Modal from 'react-modal/lib/components/Modal';
import { FxBlock, FxParam } from '../../api/fx-block';
import { ControlType, ControlObject } from '../../api/control-object';
import { PanelObject } from '../../api/panel-object';
import ControlComponent from '../control/control'

import './_panel.scss';
import ControlEditorContainer from '../../containers/control-editor-container';

interface Props {
    match: any,
    panel: PanelObject;
    init: (panelId: number) => void;
    savePanelChanges: (form) => void;
    addPanelControl: (controlType: ControlType) => void;
    removePanelControl: (control: ControlObject) => void;
}

interface State {
    editMode: boolean;
    editedControl: ControlObject;
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
            editedControl: null,
            hasChanges: false,
            form: {
                label: null,
                cc: null
            }
        };

        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount() {
        const { match } = this.props;
        this.props.init(match.params.panelId);
    }

    componentWillReceiveProps(nextProps) {
        const { match } = nextProps;
       if (match.params.panelId !== this.props.match.params.panelId) {
           this.props.init(match.params.panelId);
           this.setState({ editMode: false });
       }
    }

    toggleEdit() {
        this.setState({ editMode: !this.state.editMode });
    }

    editControl(control: ControlObject) {
        this.setState({ editedControl: control });
    }

    closeModal(hasChanges: boolean) {
        this.setState({ 
            hasChanges: hasChanges || this.state.hasChanges, 
            editedControl: null 
        });
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

    removeControl(event, control: ControlObject) {
        const { removePanelControl } = this.props;
        event.preventDefault();
        event.stopPropagation();
        removePanelControl(control);
        this.setState({ hasChanges: true });
    }

    render() {
        const { panel } = this.props;
        const { editMode, editedControl, hasChanges } = this.state;

        if (!panel) return null;

        return (
            <div className="panel">
                <div className="panel__header">
                    <button className="btn toggle-edit" onClick={() => this.toggleEdit()}>{editMode ? 'Cancel' : 'Edit'}</button>
                    {editMode && <button className="btn btn--primary save-changes" onClick={() => this.saveChanges()} disabled={!hasChanges}>Save</button>}
                    <div className="panel__label">
                        {!editMode && <span>{panel.label}</span>}
                    </div>
                    <div className="panel__edit">
                        {editMode && (
                        <div>
                            <div className="panel__edit-label">
                                <label>Panel name</label>
                                <input type="text" 
                                    className="panel__label--input"
                                    defaultValue={panel.label} 
                                    onChange={event => this.setFormValue('label', event.target.value)} />
                            </div>
                            <div className="panel__edit-cc">
                                <label>Activate panel using CC</label>
                                <input type="number" 
                                    defaultValue={panel.cc >= 0 ? panel.cc.toString() : ''} 
                                    onChange={event => this.setFormValue('cc', event.target.value, 'number')} />
                            </div>
                            <div className="panel__edit-actions">
                                <button className="btn" onClick={() => this.addControl(ControlType.Control)}>Add control</button>
                                <button className="btn" onClick={() => this.addControl(ControlType.Switch)}>Add switch</button>
                            </div>
                        </div>)}
                    </div>
                </div>
                <div className="panel__controls">
                    {panel.controls.length > 0 && panel.controls.map((control, i) => (
                        <div className="control-container" onClick={() => this.editControl(control)} key={`control-${i}`}>
                            {editMode && <button className="btn remove-control" onClick={event => this.removeControl(event, control)}>X</button>}
                            <ControlComponent
                                controlType={control.controlType}
                                block={control.block}
                                param={control.param}
                                cc={control.cc}
                            ></ControlComponent>
                        </div>
                    ))}
                    {panel.controls.length === 0 && <p>No controls, how about <a onClick={() => this.addControl(ControlType.Control)}>adding</a> some?</p>}
                </div>
                <Modal isOpen={!!editedControl} contentLabel="Control editor">
                    <ControlEditorContainer {...editedControl} closeModal={this.closeModal}></ControlEditorContainer>
                </Modal>
            </div>
        );
    }
}