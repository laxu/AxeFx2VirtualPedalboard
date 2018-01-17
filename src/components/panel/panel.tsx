import * as React from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Modal from 'react-modal/lib/components/Modal';
import { FxBlock, FxParam } from '../../api/fx-block';
import { ControlType, ControlObject } from '../../api/control-object';
import { PanelObject } from '../../api/panel-object';
import ControlComponent from '../control/control';

import './_panel.scss';
import ControlEditorContainer from '../../containers/control-editor-container';
import { reorder } from '../../util/util';

interface Props {
    match: any,
    panel: PanelObject;
    init: () => void;
    updateControlValues: () => void;
    attachControllerListener: () => void;
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
        cc: string
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
                label: '',
                cc: ''
            }
        };

        this.closeModal = this.closeModal.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    componentDidMount() {
        this.props.init();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.panelId !== this.props.match.params.panelId) {
            nextProps.init();
        }
        if (nextProps.panel.id !== this.props.panel.id) {
            nextProps.updateControlValues();
            nextProps.attachControllerListener();
            this.setState({
                editMode: false, 
                hasChanges: false,
                form: {
                    label: nextProps.panel.label,
                    cc: nextProps.panel.cc
                }
            });
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

    setFormValue(prop: string, value: string) {
        this.setState({
            hasChanges: true,
            form: {
                ...this.state.form, 
                [prop]: value 
            }
        });
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

    onDragEnd(result) {
        const { panel } = this.props;
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        panel.controls = reorder(
            panel.controls,
            result.source.index,
            result.destination.index
        );

        this.setState({
            hasChanges: true
        });
    }

    render() {
        const { panel } = this.props;
        const { editMode, editedControl, hasChanges, form } = this.state;

        if (!panel) return null;

        return (
            <div className="panel">
                <div className="panel__header">
                    <button className="btn toggle-edit" onClick={() => this.toggleEdit()}>{editMode ? 'Cancel' : 'Edit'}</button>
                    {hasChanges && <button className="btn btn--primary save-changes" onClick={() => this.saveChanges()}>Save</button>}
                    <div className="panel__label">
                        {!editMode && <span>{panel.label}</span>}
                    </div>
                    <div className="panel__edit">
                        {editMode && (
                        <div className="form">
                            <div className="form-group">
                                <label>Panel name</label>
                                <input type="text" 
                                    className="panel__label--input"
                                    name="label"
                                    value={form.label} 
                                    onChange={event => this.setFormValue('label', event.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Activate panel using CC</label>
                                <input type="number"
                                    name="controlChange"
                                    value={form.cc} 
                                    min="0"
                                    max="127"
                                    onChange={event => this.setFormValue('cc', event.target.value)} />
                            </div>
                            <div className="panel__edit-actions">
                                <button className="btn" onClick={() => this.addControl(ControlType.Control)}>Add control</button>
                                <button className="btn" onClick={() => this.addControl(ControlType.Switch)}>Add switch</button>
                            </div>
                        </div>)}
                    </div>
                </div>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable droppableId="droppable" direction="horizontal">
                        {(provided, snapshot) => (
                            <div className="panel__controls" ref={provided.innerRef}>
                                {panel.controls.length > 0 && panel.controls.map((control, i) => (
                                    <Draggable key={control.id} draggableId={control.id} isDragDisabled={editMode === false} index={i}>
                                        {(provided, snapshot) => (
                                            <div className="drag-wrapper"
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}>
                                                <div className="control-container" 
                                                    onClick={() => this.editControl(control)}>
                                                    {editMode && <button className="btn remove-control" onClick={event => this.removeControl(event, control)}>X</button>}
                                                    <ControlComponent {...control}></ControlComponent>
                                                </div>
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {panel.controls.length === 0 && <p>No controls, how about <a onClick={() => this.addControl(ControlType.Control)}>adding</a> some?</p>}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                <Modal isOpen={!!editedControl} contentLabel="Control editor">
                    <ControlEditorContainer {...editedControl} closeModal={this.closeModal}></ControlEditorContainer>
                </Modal>
            </div>
        );
    }
}