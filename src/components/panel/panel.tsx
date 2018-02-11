import * as React from 'react';
import * as Dragula from 'dragula';
import 'dragula/dist/dragula.css';
import Modal from 'react-modal/lib/components/Modal';
import { FxBlock, FxParam } from '../../api/fx-block';
import { ControlType, ControlObject } from '../../api/control-object';
import { PanelObject } from '../../api/panel-object';
import ControlComponent from '../control/control';

import './_panel.scss';
import ControlEditorContainer from '../../containers/control-editor-container';
import { reorder, getIndexInParent } from '../../util/util';
import { AxeFxState } from '../../api/axefx';
import { ControllerState } from '../../api/generic-midi-controller';

interface Props {
    match: any,
    axeFx: AxeFxState,
    controller: ControllerState,
    panel: PanelObject;
    init: () => void;
    updateControlValues: () => void;
    attachControllerListener: () => void;
    savePanelChanges: () => void;
    addPanelControl: (controlType: ControlType) => void;
    removePanelControl: (control: ControlObject) => void;
}

interface State {
    editMode: boolean;
    editedControl: ControlObject;
    hasChanges: boolean;
    drake: Dragula
}

export default class PanelComponent extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            editMode: false,
            editedControl: null,
            hasChanges: false,
            drake: null,
        };

        this.closeModal = this.closeModal.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);

        if (!this.props.panel) {
            this.props.init();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.panelId !== this.props.match.params.panelId) {
            nextProps.init();
            return;
        }
        if (!this.props.panel || nextProps.panel.id !== this.props.panel.id) {
            nextProps.updateControlValues();
            this.setState({
                editMode: false, 
                hasChanges: false
            });
        }

        if (nextProps.axeFx !== this.props.axeFx) {
            nextProps.updateControlValues();
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
        const { hasChanges } = this.state;
        if (!hasChanges) return;
        savePanelChanges();
        this.setState({ editMode: false, hasChanges: false });
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

    onDragEnd(el, target, source, sibling) {
        const { panel } = this.props;

        const startIndex = panel.controls.findIndex(ctrl => ctrl.id === el.getAttribute('data-control-id'));
        const endIndex = getIndexInParent(document.querySelector('.gu-transit')); // Find ghost element index

        this.state.drake.cancel(true); // Cancel to prevent reordering DOM

        panel.controls = reorder(
            panel.controls,
            startIndex,
            endIndex
        );
        
        this.setState({
            hasChanges: true
        });
    }

    dragulaDecorator = (componentBackingInstance) => {
        if (componentBackingInstance) {
            const dragulaOptions = {
                moves: () => this.state.editMode !== false
            }
            const drake = Dragula([componentBackingInstance], dragulaOptions);
            drake.on('drop', this.onDragEnd);
            this.setState({ drake });
        }
    };

    render() {
        const { panel } = this.props;
        const { editMode, editedControl, hasChanges } = this.state;

        if (!panel) return null;

        return (
            <div className="panel">
                <div className="panel__header">
                    <button className="btn toggle-edit" onClick={() => this.toggleEdit()}>{editMode ? 'Cancel' : 'Edit'}</button>
                    {hasChanges && <button className="btn btn--primary save-changes" onClick={() => this.saveChanges()}>Save</button>}
                    <h3 className="panel__label">{panel.label}</h3>
                    <div className="panel__edit">
                        {editMode && (
                            <div className="panel__edit-actions">
                                <button className="btn" onClick={() => this.addControl(ControlType.Control)}>Add control</button>
                                <button className="btn" onClick={() => this.addControl(ControlType.Switch)}>Add switch</button>
                            </div>)}
                    </div>
                </div>
                <div className="panel__controls" ref={this.dragulaDecorator}>
                    {panel.controls.length > 0 && panel.controls.map((control, i) => (
                        <div className="control-container" key={`control-${i}`}
                            data-control-id={control.id}
                            onClick={() => this.editControl(control)}>
                            {editMode && <button className="btn remove-control" onClick={event => this.removeControl(event, control)}>X</button>}
                            <ControlComponent {...control}></ControlComponent>
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