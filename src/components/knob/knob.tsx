import * as React from 'react';
import * as classNames from 'classnames';
import { SvgLoader, SvgProxy } from 'react-svgmt';
import { KnobStyle, KnobColor } from '../../api/group-object';
import { convertToRange } from '../../util/util';
import './_knob.scss';
import KnobRoundOutline from '../../assets/images/knob-round-outline.svg';
import KnobHexagon from '../../assets/images/knob-hexagon.svg';

interface Props {
    type: KnobStyle;
    color: KnobColor;
    value: number;
}

const iconMap = {
    [KnobStyle.RoundOutline]: KnobRoundOutline,
    [KnobStyle.Hexagon]: KnobHexagon
};

const rotationRange: [number, number] = [-145, 145];

const KnobComponent: React.FunctionComponent<Props> = function (props) {
    const { type, color, value } = props;
    const knobClasses = classNames('knob', `knob--${type}`, `knob-color--${color}`);
    const rotation = convertToRange(value, rotationRange);
    const knobStyle = {
        transform: `rotate(${rotation}deg)`
    }
    const icon = iconMap[type];
    return (
        <div className={knobClasses} style={knobStyle}>
            <SvgLoader path={icon}>
                <SvgProxy selector="rect" key={icon} />
            </SvgLoader>
        </div>
    );
}

export default KnobComponent;