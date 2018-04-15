import * as React from 'react';
import * as classNames from 'classnames';
import { Samy, SvgProxy } from 'react-samy-svg';
import { KnobStyle, KnobColor } from '../../api/group-object';
import { convertToRange } from '../../util/util';
import './_knob.scss';
const KnobRoundOutline = require('../../assets/images/knob-round-outline.svg');
const KnobHexagon = require('../../assets/images/knob-hexagon.svg');

interface Props {
    type: KnobStyle;
    color: KnobColor;
    value: number;
}

const iconMap = {
    [KnobStyle.RoundOutline]: KnobRoundOutline,
    [KnobStyle.Hexagon]: KnobHexagon
};

const KnobComponent: React.SFC<Props> = function (props) {
    const { type, color, value } = props;
    const knobClasses = classNames('knob', {
        'knob--outline': type === KnobStyle.RoundOutline,
        'knob--round': type === KnobStyle.Round,
        'knob--chickenhead': type === KnobStyle.ChickenHead,
        'knob--hexagon': type === KnobStyle.Hexagon,
        'knob-color--dark': color === KnobColor.Dark,
        'knob-color--bright': color === KnobColor.Bright,
        'knob-color--ivory': color === KnobColor.Ivory
    });
    const rotation = convertToRange(value, [-145, 145]);
    const knobStyle = {
        transform: `rotate(${rotation}deg)`
    }
    const icon = iconMap[type];
    return (
        <div className={knobClasses} style={knobStyle}>
            <Samy path={icon} key={icon}></Samy>
        </div>
    );
}

export default KnobComponent;