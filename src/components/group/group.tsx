import * as React from 'react';
import { ControlObject, ControlType } from '../../api/control-object';
import ControlComponent from '../control/control';
import { GroupObject, GroupSizeType } from '../../api/group-object';
import './_group.scss';

interface Props {
    group: GroupObject;
    controls: ControlObject[];
    editMode: boolean;
    editGroup: (group: GroupObject) => void;
    addControl: (group: GroupObject, type: ControlType) => void;
    editControl: (control: ControlObject) => void;
    removeControl: (event: any, control: ControlObject) => void;
}

export class GroupComponent extends React.Component<Props> {

    render() {
        const { 
            group: { label, bgColor, textColor, size, showBlockNames },
            controls,
            editMode,
            addControl,
            editGroup,
            editControl,
            removeControl
        } = this.props;

        const groupStyle = {
            backgroundColor: bgColor,
            color: textColor,
            width: size.type === GroupSizeType.Auto ? 'auto' : size.width + 'px',
            height: size.type === GroupSizeType.Auto ? 'auto' : size.height + 'px'
        };
        return (
            <div className="group" style={groupStyle}>
                {editMode && (
                    <div className="group__actions">
                        <button className="btn" onClick={() => addControl(this.props.group, ControlType.Control)}>
                            <i className="fa fa-plus"></i>
                            <span>Add control</span>
                        </button>
                        <button className="btn" onClick={() => addControl(this.props.group, ControlType.Switch)}>
                            <i className="fa fa-plus"></i>
                            <span>Add switch</span>
                        </button>
                        <button className="btn btn--small" onClick={() => editGroup(this.props.group)}>
                            <i className="fa fa-pencil"></i>
                            <span>Edit group</span>
                        </button>
                    </div>
                )}
                <label className="group__label" onClick={() => editGroup(this.props.group)} title="Edit group">
                    <div className="edit-icon"><i className="fa fa-pencil"></i></div>
                    <span>{label}</span>
                </label>
                <div className="group__controls">
                    {controls.length > 0 && controls.map((control, i) => (
                        <div className="control-container" key={`control-${i}`}
                            data-control-id={control.id}
                            onClick={() => editControl(control)}
                            title="Edit control">
                            {editMode && <button className="btn remove-control" onClick={event => removeControl(event, control)}>X</button>}
                            <ControlComponent {...control} showBlockName={showBlockNames}></ControlComponent>
                        </div>
                    ))}
                    {controls.length === 0 && <p className="no-controls">No controls, how about adding some?</p>}
                </div>
            </div>
        )
    }
}