import * as React from 'react';
import * as classNames from 'classnames';
  
import { BoardObject } from '../../api/board-object';
import './_sidebar.scss';

interface Props {
    boards: BoardObject[];
    currentBoardId: string;
    isOpen: boolean;
    addNewBoard: () => void;
    editBoard: (board: BoardObject) => void;
    selectBoard: (board: BoardObject) => void;
    toggleSidebar: () => void;
}

const Sidebar: React.SFC<Props> = (props) => {
    const { isOpen, addNewBoard, boards, currentBoardId, editBoard, selectBoard, toggleSidebar } = props;

    return (
        <div className={classNames('sidebar', { 'sidebar--open': isOpen })}>
            <ul className="boards">
                <li>
                    <button className="btn toggle-sidebar"
                        title="Toggle sidebar"
                        onClick={() => toggleSidebar()}>
                        <i className="fa fa-bars" aria-hidden="true"></i>
                        <span className="toggle-sidebar--label">Toggle sidebar</span>
                    </button>
                </li>
                <li>
                    <button className="btn btn--primary add-board" onClick={() => addNewBoard()}>
                        <i className="fa fa-plus" aria-hidden="true"></i>
                        <span className="add-board--label">Add pedalboard</span>
                    </button>
                </li>
                {boards && boards.length > 0 && boards.map((board, i) => (
                    <li key={`board-${i}`} className={classNames('board', {'active': board.id === currentBoardId})}>
                        <div className="board-action" onClick={() => editBoard(board)} title="Edit pedalboard">
                            <i className="fa fa-pencil" aria-hidden="true"></i>
                        </div>
                        <div className="board-select" onClick={() => selectBoard(board)}>
                            <span className="board-select--number">{i + 1}</span>
                            <span className="board-select--label">{board.label || `Board ${board.id}`}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
        
    );
}

export default Sidebar;