import * as React from 'react';
import classNames from 'classnames';
import { FxBlock, FxParam } from '../../api/fx-block';
import { ControlType } from '../../api/control-object';

interface ControlProps {
    block: FxBlock;
    param: FxParam;
    editMode: boolean;
    controlType: ControlType
}

export default class ControlComponent extends React.Component<ControlProps> {
    showEditDialog() {
        if (!this.props.editMode) return;
        // TODO show modal
    }

    render() {
        const { block, param, editMode, controlType = ControlType.Control } = this.props;
        if (controlType === ControlType.Control) {
            return (
                <div className="control" onClick={() => this.showEditDialog()}>
                    <div className="block__label">{block.label}</div>
                    <div className="param__label">{param.label}</div>
                    <div className="param__value">{param.value}</div>
                    <div className="param__cc">{param.cc}</div>
                </div>
            );
        } else {
            return (
                <div className={classNames('switch', {'switch--on': param.value, 'switch--off': !param.value})} 
                     onClick={() => this.showEditDialog()}>
                    <div className="block__label">{block.label}</div>
                    <div className="param__label">{param.label}</div>
                    <div className="param__cc">{param.cc}</div>
                </div>
            );
        }
        
    }
}