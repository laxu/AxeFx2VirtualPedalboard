import * as React from 'react';
import * as classNames from 'classnames';
import { FxBlock, FxParam, getBlockById, getBlockAndParam } from '../../api/fx-block';
import { ControlType } from '../../api/control-object';
import './_control.scss';
import { KnobStyle, KnobMode, KnobColor } from '../../api/group-object';
import KnobComponent from '../knob/knob';
import { PARAM_TYPE } from '../../api/fx-block-data/fx-block-data';

interface Props {
    blockId: number;
    paramId: number;
    formattedValue: string | number;
    paramValue: number;
    controlType: ControlType;
    showBlockName: boolean;
    knobMode: KnobMode;
    knobStyle: KnobStyle;
    knobColor: KnobColor;
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

    UNSAFE_componentWillReceiveProps(nextProps) {
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
        const { paramValue, formattedValue, cc, controlType = ControlType.Control, showBlockName, knobMode, knobStyle, knobColor } = this.props;
        const isEmpty = !block && !param;
        if (controlType === ControlType.Control) {
            return (
                <div className={classNames('control', `control--${param && param.type}`)}>
                    <div className="edit-icon"><i className="fa fa-pencil"></i></div>
                    {block && block.label && showBlockName && <div className="block__label">{block.label}</div>}
                    <div className="param__label">{param && param.label}</div>
                    <div className="param__cc">{cc !== null &&cc}</div>
                    {isEmpty && <div className="control__empty">Control not configured</div>}
                    {knobMode !== KnobMode.NumericOnly && (
                        <KnobComponent
                            type={knobStyle} 
                            color={knobColor} 
                            value={paramValue}></KnobComponent>
                    )}
                    {(knobMode !== KnobMode.KnobOnly || (!isEmpty && param.type === PARAM_TYPE.Select)) && 
                        <div className="param__value">{formattedValue}</div>}
                </div>
            );
        } else {
            return (
                <div className={classNames('switch', {'switch--on': formattedValue, 'switch--off': !formattedValue})}>
                    <div className="edit-icon"><i className="fa fa-pencil"></i></div>
                    {block && block.label && <div className="block__label">{block.label}</div>}
                    <div className="param__label">{param && param.label}</div>
                    <div className="param__cc">{cc !== null && `CC ${cc}`}</div>
                    {isEmpty && <div className="switch__empty">Switch not configured</div>}
                    <div className="switch__status"></div>
                </div>
            );
        }
        
    }
}