import * as React from 'react';
import * as Dragula from 'dragula';
import 'dragula/dist/dragula.css';
import Modal from 'react-modal/lib/components/Modal';
import { FxBlock, FxParam } from '../../api/fx-block';
import { ControlType, ControlObject } from '../../api/control-object';
import { BoardObject } from '../../api/board-object';
import ControlComponent from '../control/control';

import './_board.scss';
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
    board: BoardObject;
    init: () => void;
    updateControlValues: () => void;
    attachControllerListener: () => void;
    saveBoardChanges: () => void;
    addBoardGroup: () => void;
    removeBoardGroup: (group: GroupObject) => void;
    editGroup: (group: GroupObject) => void;
    addBoardControl: (group: GroupObject, controlType: ControlType) => void;
    removeBoardControl: (control: ControlObject) => void;
}

interface State {
    editMode: boolean;
    editedControl: ControlObject;
    editedGroup: GroupObject;
    hasChanges: boolean;
    drake: Dragula
}

export default class BoardComponent extends React.Component<Props, State> {
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
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.board || nextProps.board.id !== this.props.board.id) {
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
        const { saveBoardChanges } = this.props;
        const { hasChanges } = this.state;
        if (!hasChanges) return;
        saveBoardChanges();
        this.setState({ editMode: false, hasChanges: false });
    }

    addGroup() {
        const { addBoardGroup } = this.props;
        addBoardGroup();
        this.setState({ hasChanges: true });
    }

    removeGroup() {
        const { removeBoardGroup } = this.props;
        const { editedGroup } = this.state;
        removeBoardGroup(editedGroup);
        this.closeModal(true);
    }

    editGroup(group: GroupObject) {
        this.setState({ editedGroup: group });
    }

    addControl(group: GroupObject, controlType: ControlType) {
        const { addBoardControl } = this.props;
        addBoardControl(group, controlType);
        this.setState({ hasChanges: true });
    }

    removeControl(event, control: ControlObject) {
        const { removeBoardControl } = this.props;
        event.preventDefault();
        event.stopPropagation();
        removeBoardControl(control);
        this.setState({ hasChanges: true });
    }

    onDragEnd(el, target, source, sibling) {
        const { board } = this.props;

        const isGroup = target.className.includes('board__groups');

        let startIndex;
        const endIndex = getIndexInParent(document.querySelector('.gu-transit')); // Find ghost element index
        if (isGroup) {
            startIndex = board.groups.findIndex(group => group.id === el.getAttribute('data-group-id'));
        } else {
            startIndex = board.controls.findIndex(ctrl => ctrl.id === el.getAttribute('data-control-id'));
        }

        this.state.drake.cancel(true); // Cancel to prevent reordering DOM

        if (isGroup) {
            board.groups = reorder(
                board.groups,
                startIndex,
                endIndex
            );
        } else {
            board.controls = reorder(
                board.controls,
                startIndex,
                endIndex
            );
        }
        
        this.setState({
            hasChanges: true
        });
    }

    dragulaDecorator = (componentBackingInstance) => {
        if (componentBackingInstance) {
            const dragulaOptions = {
                moves: () => this.state.editMode !== false,
                accepts: (el, source, target) => source === target,
                isContainer: el => {
                    if (typeof el.className !== 'string') return false; // SVGs have weird class names
                    return el.className.includes('board__groups') || el.className.includes('group__controls');
                }
            }
            const drake = Dragula([componentBackingInstance], dragulaOptions);
            drake.on('drop', this.onDragEnd);
            this.setState({ drake });
        }
    };

    render() {
        const { board } = this.props;
        const { editMode, editedControl, editedGroup, hasChanges } = this.state;

        if (!board) return null;

        return (
            <div className="board">
                <div className="board__header">
                    <button className="btn toggle-edit" onClick={() => this.toggleEdit()}>
                        <i className={editMode ? 'fa fa-undo' : 'fa fa-pencil'}></i>
                        <span>{editMode ? 'Cancel' : 'Edit'}</span>
                    </button>
                    {hasChanges && <button className="btn btn--primary save-changes" onClick={() => this.saveChanges()}>
                        <i className="fa fa-check"></i>
                        <span>Save</span>
                    </button>}
                    <h3 className="board__label">{board.label}</h3>
                    <div className="board__edit">
                        {editMode && (
                            <div className="board__edit-actions">
                                <button className="btn" onClick={() => this.addGroup()}>
                                    <i className="fa fa-plus"></i>
                                    <span>Add group</span>
                                </button>
                            </div>)}
                    </div>
                </div>
                <div className="board__groups" ref={this.dragulaDecorator}>
                    {board.groups.length > 0 && board.groups.map((group, i) => (
                        <GroupComponent
                            key={`group-${i}`}
                            group={group}
                            controls={board.controls.filter(ctrl => ctrl.groupId === group.id)}
                            editMode={editMode} 
                            editGroup={this.editGroup}
                            editControl={this.editControl}
                            addControl={this.addControl}
                            removeControl={this.removeControl}></GroupComponent>
                    ))}
                    {board.groups.length === 0 && <p>No groups, how about <a onClick={() => this.addGroup()}>adding</a> some?</p>}
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