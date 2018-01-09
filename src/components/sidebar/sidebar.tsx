import * as React from 'react';
import { Link } from 'react-router-dom'
  
import { PanelObject } from '../../api/panel-object';
import './_sidebar.scss';

interface SidebarProps {
    panels: PanelObject[]
    addNewPanel: () => void;
}

const Sidebar: React.SFC<SidebarProps> = (props) => {
    const { addNewPanel, panels } = props;

    return (
        <div className="sidebar">
            <ul className="panels">
                <li><button className="btn" onClick={() => addNewPanel()}>Add new panel</button></li>
                {panels.length > 0 && panels.map((panel, i) => (
                    <li key={`panel-${i}`}><Link to={`/panel/${panel.id}`}>{panel.label || `Panel ${panel.id}`}</Link></li>
                ))}
            </ul>
        </div>
        
    );
}

export default Sidebar;