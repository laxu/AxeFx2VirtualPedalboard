import * as React from 'react';
import * as classNames from 'classnames';
import { FxBlock, FxParam, getBlockById, getBlockAndParam } from '../../api/fx-block';
import { ControlType } from '../../api/control-object';
import './_control.scss';

interface Props {
    blockId: number;
    paramId: number;
    paramValue: number;
    controlType: ControlType
    cc: number;
}

interface State {
    block: FxBlock,
    param: FxParam
}

export default class ControlComponent extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        const { blockId, paramId } = this.props;
        const { block, param } = getBlockAndParam(blockId, paramId);
        this.state = {
            block,
            param,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.blockId !== this.props.blockId || nextProps.paramId !== this.props.paramId) {
            const { block, param } = getBlockAndParam(nextProps.blockId, nextProps.paramId);
            this.setState({
                block,
                param
            });
        }
    }

    render() {
        const { block, param } = this.state;
        const { paramValue, cc, controlType = ControlType.Control } = this.props;
        const isEmpty = !block && !param;
        if (controlType === ControlType.Control) {
            return (
                <div className="control">
                    <div className="block__label">{block && block.label}</div>
                    <div className="param__label">{param && param.label}</div>
                    <div className="param__cc">{cc !== null && `CC ${cc}`}</div>
                    <div className="param__value">{paramValue}</div>
                    {isEmpty && <div className="control__empty">Control not configured</div>}
                </div>
            );
        } else {
            return (
                <div className={classNames('switch', {'switch--on': paramValue, 'switch--off': !paramValue})}>
                    <div className="block__label">{block && block.label}</div>
                    <div className="param__label">{param && param.label}</div>
                    <div className="param__cc">{cc !== null && `CC ${cc}`}</div>
                    {isEmpty && <div className="control__empty">Switch not configured</div>}
                    <div className="switch-status"></div>
                </div>
            );
        }
        
    }
}