import * as React from 'react';
import * as classNames from 'classnames';
import { ControlObject, ControlType } from '../../api/control-object';
import ControlComponent from '../control/control';
import { GroupObject, GroupSizeType } from '../../api/group-object';
import './_group.scss';
import { CONTROL_WIDTH } from '../../api/constants';

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
            group: { id, label, bgColor, textColor, size, showBlockNames, showKnobs, knobStyle, knobColor },
            controls,
            editMode,
            addControl,
            editGroup,
            editControl,
            removeControl
        } = this.props;

        let groupWidth = 'auto';
        if (size.type !== GroupSizeType.Auto) {
            groupWidth = size.controlsPerRow * CONTROL_WIDTH + 'px';
        }

        const groupStyle = {
            backgroundColor: bgColor,
            color: textColor,
            width: groupWidth
        };

        const groupClass = classNames('group', { 'group--editmode': editMode });
        
        return (
            <div className={groupClass} style={groupStyle} data-group-id={id}>
                <label className="group__label" onClick={() => editGroup(this.props.group)} title="Edit group">
                    <div className="edit-icon"><i className="fa fa-pencil"></i></div>
                    <span>{label}</span>
                </label>
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
                    </div>
                )}
                <div className="group__controls">
                    {controls.length > 0 && controls.map((control, i) => (
                        <div className="control-container" key={`control-${i}`}
                            data-control-id={control.id}
                            onClick={() => !editMode && editControl(control)}
                            title={editMode ? 'Move control' : 'Edit control'}>
                            {editMode && <button className="btn remove-control" 
                                onClick={event => removeControl(event, control)}
                                title="Remove control">X</button>}
                            <ControlComponent 
                                {...control} 
                                showBlockName={showBlockNames}
                                knobMode={showKnobs}
                                knobStyle={knobStyle}
                                knobColor={knobColor}></ControlComponent>
                        </div>
                    ))}
                    {controls.length === 0 && <p className="no-controls">No controls, how about adding some?</p>}
                </div>
            </div>
        )
    }
}