import * as React from 'react';
import { ControlType, ControlObject } from '../../api/control-object';
import './_control-editor.scss';
import { FxBlock, getAllBlocks, getBlockById, FxParam } from '../../api/fx-block';

interface Props {
    id: string;
    block: FxBlock;
    param: FxParam;
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
    hasChanges: boolean;
    [key: string]: any;
}

export default class ControlEditorComponent extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        
        const { block, param, controlType, cc } = this.props;
        this.state = {
            blocks: getAllBlocks(),
            blockId: block && block.id,
            paramId: param && param.id,
            controlType: controlType || ControlType.Control,
            cc: cc,
            hasChanges: false
        };

        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(event) {
        event.preventDefault();
        const { blockId, paramId, cc, controlType } = this.state;
        const { id, closeModal, saveChanges } = this.props;
        if (!blockId || !paramId) return false;
        saveChanges({
            id,
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
            [prop]: prop === 'controlType' ? value : Number(value),
            hasChanges: true
        });
    }

    render() {
        const { hasChanges, blocks, blockId, paramId, cc, controlType } = this.state;

        const selectedBlock: FxBlock = blockId ? getBlockById(blockId) : null;
        
        return (
            <form className="form control-editor" autoComplete="off" onSubmit={this.onSubmit}>
                <h2>Settings for control</h2>
                <div className="form-group">
                    <label>Effects block</label>
                    <select value={blockId && blockId.toString() || ''} onChange={event => this.setValue('blockId', event.target.value)}>
                        <option disabled value="">Select effects block</option>
                        {blocks.map((block, i) => (
                            <option key={`block-${i}`} value={block.id}>{block.label}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Parameter to control</label>
                    <select value={paramId && paramId.toString() || ''} disabled={!selectedBlock} onChange={event => this.setValue('paramId', event.target.value)}>
                        <option disabled value="">Select effects param</option>
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
                    <input type="number" 
                        name="controlChange"
                        min="0"
                        max="127"
                        defaultValue={cc !== null && cc.toString()}
                        onChange={event => this.setValue('cc', event.target.value)} />
                </div>
                
                <div className="control-editor__actions">
                    <button className="btn" onClick={() => this.onCancel()}>Cancel</button>
                    <input type="submit" value="Done" disabled={!hasChanges} className="btn btn--primary" />
                </div>
            </form>
        );
    }
}