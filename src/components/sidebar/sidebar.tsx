import * as React from 'react';
import { PanelObject } from '../../api/panel-object';

interface SidebarProps {
    panels: PanelObject[]
}

const Sidebar: React.SFC<SidebarProps> = (props) => {
    const { panels } = props;

    return (
        <div className="sidebar">
            <div className="logo">Axe-Fx MIDI</div>
            <ul className="panels">
                {panels.length > 0 && panels.map(panel => (
                    <li><a href={`panel/{panel.id}`}>{panel.label || `Panel ${panel.id}`}</a></li>
                ))}
            </ul>
        </div>
    )
}

export default Sidebar;