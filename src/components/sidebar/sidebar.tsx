import * as React from 'react';
import { Link } from 'react-router-dom';
const classNames = require('classNames');
  
import { PanelObject } from '../../api/panel-object';
import './_sidebar.scss';

interface Props {
    panels: PanelObject[];
    currentPanelId: number;
    addNewPanel: () => void;
}

const Sidebar: React.SFC<Props> = (props) => {
    const { addNewPanel, panels, currentPanelId } = props;

    console.log('fuu', currentPanelId);

    return (
        <div className="sidebar">
            <ul className="panels">
                <li>
                    <button className="btn btn--primary add-panel" onClick={() => addNewPanel()}>
                        <i className="fa fa-plus" aria-hidden="true"></i>Add panel
                    </button>
                </li>
                {panels && panels.length > 0 && panels.map((panel, i) => (
                    <li key={`panel-${i}`} className={classNames('panel', {'active': panel.id === currentPanelId})}>
                        <Link to={`/panels/${panel.id}`}>{panel.label || `Panel ${panel.id}`}</Link>
                    </li>
                ))}
            </ul>
        </div>
        
    );
}

export default Sidebar;