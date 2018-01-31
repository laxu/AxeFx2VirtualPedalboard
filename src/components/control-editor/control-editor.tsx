import * as React from 'react';
import { ControlType, ControlObject } from '../../api/control-object';
import './_control-editor.scss';
import { FxBlock, getAllBlocks, getBlockById, FxParam } from '../../api/fx-block';
import { PARAM_TYPE } from '../../api/fx-block-data/index';

interface Props {
    id: string;
    blockId: number;
    paramId: number;
    controlType: ControlType;
    cc: number;
    isRelative: boolean;
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
    isValid: boolean;
    isRelative: boolean;
    [key: string]: any;
}

const NO_VALUE = 99999;

export default class ControlEditorComponent extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        
        const { blockId, paramId, controlType, cc, isRelative } = this.props;
        this.state = {
            blocks: getAllBlocks(),
            blockId: blockId,
            paramId: paramId,
            controlType: controlType || ControlType.Control,
            cc: cc,
            isRelative: isRelative || false,
            hasChanges: false,
            isValid: false
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    onSubmit(event) {
        event.preventDefault();
        const { id, closeModal, saveChanges } = this.props;
        const { blockId, paramId, cc, controlType, isRelative } = this.state;
        if (!blockId && !paramId) return false;
        saveChanges({
            id,
            blockId,
            paramId,
            controlType,
            isRelative,
            cc
        })
        closeModal(true);
        return true;
    }

    onCancel(event) {
        event.preventDefault();
        this.props.closeModal(false);
    }

    checkValidity() {
        const { blockId, paramId } = this.state;
        this.setState({ isValid: blockId > 0 && blockId < NO_VALUE && paramId >= 0 && paramId < NO_VALUE });
    }

    setValue(prop: string, value: string) {
        this.setState({
            [prop]: prop === 'controlType' ? value : Number(value),
            hasChanges: true
        });
        this.checkValidity();
    }

    buildParameterOptions(selectedBlock: FxBlock) {
        const { controlType } = this.state;
        const parameterOptions = [];
        if (selectedBlock) {
            let currentOptGroup;
            const parameters = selectedBlock.parameters.filter(param => {
                if (controlType === ControlType.Switch) {
                    return param.type === PARAM_TYPE.Switch;
                } else {
                    return param.type !== PARAM_TYPE.Switch;
                }
            })
            parameters.map((param, i) => {
                if (!currentOptGroup || param.labelGroup !== currentOptGroup.label) {
                    parameterOptions.push({ label: param.labelGroup, parameters: [] });
                    currentOptGroup = parameterOptions[parameterOptions.length - 1];
                }
                currentOptGroup.parameters.push(param);
            });
        }
        return parameterOptions;
    }

    render() {
        const { isValid, hasChanges, blocks, blockId, paramId, cc, controlType, isRelative } = this.state;

        const selectedBlock: FxBlock = blockId ? getBlockById(blockId) : null;

        const parameterOptions = this.buildParameterOptions(selectedBlock);

        return (
            <form className="form control-editor" autoComplete="off" onSubmit={this.onSubmit}>
                <h2>Settings for control</h2>
                <div className="form-group">
                    <label>Effects block</label>
                    <select value={blockId && blockId.toString() || NO_VALUE} onChange={event => this.setValue('blockId', event.target.value)}>
                        <option disabled value={NO_VALUE}>Select effects block</option>
                        {blocks.map((block, i) => (
                            <option key={`block-${i}`} value={block.id}>{block.label}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Parameter to control</label>
                    <select value={paramId && paramId.toString() || NO_VALUE} disabled={!selectedBlock} onChange={event => this.setValue('paramId', event.target.value)}>
                        <option disabled value={NO_VALUE}>{selectedBlock && selectedBlock.parameters.length === 0 ? 'Block is not yet supported' : 'Select effects param'}</option>
                        {parameterOptions.map((group, i) => (
                            <optgroup label={group.label} key={`group-${i}`}>
                                {group.parameters.map((param, j) => (
                                    <option key={`param-${j}`} value={param.id}>{param.label}</option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Control type</label>
                    <div className="form-group--inline">
                        <label className="label-radio">
                            <input type="radio" name="controlType" id="controltype--control"
                                checked={controlType === ControlType.Control}
                                value={ControlType.Control} 
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
                <div className="form-group">
                    <label>
                    <input type="checkbox" 
                        name="isRelative"
                        value="1"
                        checked={isRelative}
                        onChange={event => this.setValue('isRelative', isRelative ? '' : '1')} />
                        <span>CC output value is relative</span>
                    </label>
                    
                </div>
                
                <div className="control-editor__actions">
                    <button className="btn" onClick={this.onCancel}>Cancel</button>
                    <input type="submit" value="Done" disabled={!hasChanges || !isValid} className="btn btn--primary" />
                </div>
            </form>
        );
    }
}