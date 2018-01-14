import * as React from 'react';
import * as classNames from 'classnames';
import { FxBlock, FxParam } from '../../api/fx-block';
import { ControlType } from '../../api/control-object';
import './_control.scss';

interface Props {
    block: FxBlock;
    param: FxParam;
    controlType: ControlType
    cc: number;
}

export default class ControlComponent extends React.Component<Props> {
    render() {
        const { cc, block, param, controlType = ControlType.Control } = this.props;
        if (controlType === ControlType.Control) {
            return (
                <div className="control">
                    <div className="block__label">{block && block.label}</div>
                    <div className="param__label">{param && param.label}</div>
                    <div className="param__value">{param && param.value}</div>
                    <div className="param__cc">{cc}</div>
                </div>
            );
        } else {
            return (
                <div className={classNames('switch', {'switch--on': param && param.value, 'switch--off': param && !param.value})}>
                    <div className="block__label">{block && block.label}</div>
                    <div className="param__label">{param && param.label}</div>
                    <div className="param__cc">{cc}</div>
                </div>
            );
        }
        
    }
}