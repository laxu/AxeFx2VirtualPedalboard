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
import { GroupComponent } from '../group/group';
import { GroupObject } from '../../api/group-object';
import GroupEditorContainer from '../../containers/group-editor-container';

interface Props {
    match: any,
    axeFx: AxeFxState,
    controller: ControllerState,
    panel: PanelObject;
    init: () => void;
    updateControlValues: () => void;
    attachControllerListener: () => void;
    savePanelChanges: () => void;
    addPanelGroup: () => void;
    removePanelGroup: (group: GroupObject) => void;
    editGroup: (group: GroupObject) => void;
    addPanelControl: (group: GroupObject, controlType: ControlType) => void;
    removePanelControl: (control: ControlObject) => void;
}

interface State {
    editMode: boolean;
    editedControl: ControlObject;
    editedGroup: GroupObject;
    hasChanges: boolean;
    drake: Dragula
}

export default class PanelComponent extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            editMode: false,
            editedControl: null,
            editedGroup: null,
            hasChanges: false,
            drake: null,
        };

        this.closeModal = this.closeModal.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.editGroup = this.editGroup.bind(this);
        this.editControl = this.editControl.bind(this);
        this.removeGroup = this.removeGroup.bind(this);
        this.addControl = this.addControl.bind(this);
        this.removeControl = this.removeControl.bind(this);

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
            editedControl: null,
            editedGroup: null
        });
    }

    saveChanges() {
        const { savePanelChanges } = this.props;
        const { hasChanges } = this.state;
        if (!hasChanges) return;
        savePanelChanges();
        this.setState({ editMode: false, hasChanges: false });
    }

    addGroup() {
        const { addPanelGroup } = this.props;
        addPanelGroup();
        this.setState({ hasChanges: true });
    }

    removeGroup() {
        const { removePanelGroup } = this.props;
        const { editedGroup } = this.state;
        removePanelGroup(editedGroup);
        this.closeModal(true);
    }

    editGroup(group: GroupObject) {
        this.setState({ editedGroup: group });
    }

    addControl(group: GroupObject, controlType: ControlType) {
        const { addPanelControl } = this.props;
        addPanelControl(group, controlType);
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
        const { editMode, editedControl, editedGroup, hasChanges } = this.state;

        if (!panel) return null;

        return (
            <div className="panel">
                <div className="panel__header">
                    <button className="btn toggle-edit" onClick={() => this.toggleEdit()}>
                        <i className={editMode ? 'fa fa-undo' : 'fa fa-pencil'}></i>
                        <span>{editMode ? 'Cancel' : 'Edit'}</span>
                    </button>
                    {hasChanges && <button className="btn btn--primary save-changes" onClick={() => this.saveChanges()}>
                        <i className="fa fa-check"></i>
                        <span>Save</span>
                    </button>}
                    <h3 className="panel__label">{panel.label}</h3>
                    <div className="panel__edit">
                        {editMode && (
                            <div className="panel__edit-actions">
                                <button className="btn" onClick={() => this.addGroup()}>
                                    <i className="fa fa-plus"></i>
                                    <span>Add group</span>
                                </button>
                            </div>)}
                    </div>
                </div>
                <div className="panel__groups" ref={this.dragulaDecorator}>
                    {panel.groups.length > 0 && panel.groups.map((group, i) => (
                        <GroupComponent
                            key={`group-${i}`}
                            group={group}
                            controls={panel.controls.filter(ctrl => ctrl.groupId === group.id)}
                            editMode={editMode} 
                            editGroup={this.editGroup}
                            editControl={this.editControl}
                            addControl={this.addControl}
                            removeControl={this.removeControl}></GroupComponent>
                    ))}
                    {panel.groups.length === 0 && <p>No groups, how about <a onClick={() => this.addGroup()}>adding</a> some?</p>}
                </div>
                <Modal isOpen={!!editedControl} contentLabel="Control editor">
                    <ControlEditorContainer {...editedControl} closeModal={this.closeModal}></ControlEditorContainer>
                </Modal>
                <Modal isOpen={!!editedGroup} contentLabel="Control editor">
                    <GroupEditorContainer group={editedGroup} closeModal={this.closeModal} deleteGroup={this.removeGroup}></GroupEditorContainer>
                </Modal>
            </div>
        );
    }
}