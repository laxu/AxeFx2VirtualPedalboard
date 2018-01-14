import * as React from 'react';
import { ControlType, ControlObject } from '../../api/control-object';
import './_control-editor.scss';
import { FxBlock, getAllBlocks, getBlockById } from '../../api/fx-block';

interface Props {
    controlId: number;
    blockId: number;
    paramId: number;
    controlType: ControlType;
    cc: number;
    saveChanges: (ControlObject) => void;
    closeModal: (hasChanges: boolean) => void;
}

interface State {
    blocks: FxBlock[];
    blockId: number;
    paramId: number;
    controlType: ControlType;
    cc: number;
    [key: string]: any
}

export default class ControlEditorComponent extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        console.log('params', this.props);
        this.state = {
            blocks: getAllBlocks(),
            blockId: this.props.blockId,
            paramId: this.props.paramId,
            controlType: this.props.controlType || ControlType.Control,
            cc: this.props.cc
        };

        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(event) {
        event.preventDefault();
        const { blockId, paramId, cc, controlType } = this.state;
        const { controlId, closeModal, saveChanges } = this.props;
        if (!blockId || !paramId) return false;
        saveChanges({
            controlId,
            blockId,
            paramId,
            controlType,
            cc
        })
        closeModal(true);
        return true;
    }

    onCancel() {
        this.props.closeModal(false);
    }

    setValue(prop: string, value: string) {
        this.setState({
            [prop]: prop === 'controlType' ? value : Number(value)
        });
    }

    render() {
        const { controlId } = this.props;
        const { blocks, blockId, paramId, cc, controlType } = this.state;

        console.log('all blocks', blocks);
        const selectedBlock: FxBlock = blockId ? getBlockById(blockId) : null;
        
        return (
            <form className="form control-editor" autoComplete="off" onSubmit={this.onSubmit}>
                <h2>Settings for control {controlId}</h2>
                <div className="form-group">
                    <label>Effects block</label>
                    <select defaultValue={blockId && blockId.toString()} onChange={event => this.setValue('blockId', event.target.value)}>
                        <option disabled value="-1">Select effects block</option>
                        {blocks.map((block, i) => (
                            <option key={`block-${i}`} value={block.id}>{block.label}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Parameter to control</label>
                    <select defaultValue={paramId && paramId.toString()} disabled={!selectedBlock} onChange={event => this.setValue('paramId', event.target.value)}>
                        <option disabled value="-1">Select effects param</option>
                        {selectedBlock && selectedBlock.parameters.map((param, i) => (
                            <option key={`param-${i}`} value={param.id}>{param.label}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Control type</label>
                    <div className="form-group--inline">
                        <label className="label-radio">
                            <input type="radio" name="controlType" id="controltype--control"
                                checked={controlType === ControlType.Control} value={ControlType.Control} 
                                onChange={event => this.setValue('controlType', event.target.value)} />
                            <span>Control</span>
                        </label>
                        <label className="label-radio">
                            <input type="radio" name="controlType" id="controltype--switch"
                                checked={controlType === ControlType.Switch} 
                                value={ControlType.Switch}
                                onChange={event => this.setValue('controlType', event.target.value)} />
                            <span>Switch</span>
                        </label>
                    </div>
                </div>
                <div className="form-group">
                    <label>CC that controls parameter</label>
                    <input type="number" name="controlChange" defaultValue={cc !== null && cc.toString()} onChange={event => this.setValue('cc', event.target.value)} />
                </div>
                
                <div className="control-editor__actions">
                    <button className="btn" onClick={() => this.onCancel()}>Cancel</button>
                    <input type="submit" value="Done" className="btn btn--primary" />
                </div>
            </form>
        );
    }
}