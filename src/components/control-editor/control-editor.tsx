import * as React from 'react';
import { ControlType } from '../../api/control-object';

interface Props {
    controlId: number;
    blockId: number;
    paramId: number;
    controlType: ControlType;
    cc: number;
}

interface State {
    blockId: number;
    paramId: number;
    controlType: ControlType;
    cc: number;
    [key: string]: any
}

export default class ControlEditorComponent extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            blockId: this.props.blockId,
            paramId: this.props.paramId,
            cc: this.props.cc
        };
    }

    onSubmit() {
        const { blockId, paramId, cc, controlType } = this.state;
        const { controlId } = this.props;
        if (!blockId || !paramId) return false;
        saveChanges({
            controlId,
            blockId,
            paramId,
            controlType,
            cc
        })
        return true;
    }

    onCancel() {

    }

    setValue(prop: string, value: string) {
        this.setState({
            [prop]: prop === 'controlType' ? value : Number(value)
        });
    }

    render() {
        const { controlId } = this.props;
        const { blockId, paramId, cc, controlType } = this.state;
        
        return (
            <form className="control-editor" onSubmit={() => this.onSubmit()}>
                <div>
                    <h2>Settings for control {controlId}</h2>
                    <label>Effects block</label>
                    <select defaultValue={blockId.toString()} onChange={event => this.setValue('blockId', event.target.value)}>
                        <option disabled value="">Select effects block</option>
                    </select>
                </div>
                <div>
                    <label>Parameter to control</label>
                    <select defaultValue={paramId.toString()} onChange={event => this.setValue('paramId', event.target.value)}>
                        <option disabled value="">Select effects block</option>
                    </select>
                </div>
                <div>
                    <label>Control type</label>
                    <label htmlFor="controltype--control" className="label-controltype">Control</label>
                    <input type="radio" name="controlType" id="controltype--control"
                           defaultValue={controlType} value={ControlType.Control} 
                           onChange={event => this.setValue('controlType', event.target.value)} />
                    
                    <label htmlFor="controltype--switch" className="label-controltype">Switch</label>
                    <input type="radio" name="controlType" id="controltype--switch"
                           defaultValue={controlType} 
                           value={ControlType.Switch} 
                           onChange={event => this.setValue('controlType', event.target.value)} />
                </div>
                <div>
                    <label>CC that controls parameter</label>
                    <input type="number" name="cc" defaultValue={cc.toString()} onChange={event => this.setValue('cc', event.target.value)} />
                </div>
                
                <div className="control-editor__actions">
                    <input type="submit" value="Done" className="btn" />
                    <button className="btn" onClick={() => this.onCancel()}>Cancel</button>
                </div>
            </form>
        );
    }
}