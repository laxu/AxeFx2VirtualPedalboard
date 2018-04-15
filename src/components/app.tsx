import * as React from 'react';
import { Route } from 'react-router-dom'
import Modal from 'react-modal/lib/components/Modal';

import Header from './header/header';
import { AxeFxState } from '../api/axefx';
import { ControllerState } from '../api/generic-midi-controller';
import { BoardObject } from '../api/board-object';
import Sidebar from './sidebar/sidebar';
import BoardContainer from '../containers/board-container';
import BoardSettingsContainer from '../containers/board-settings-container';

interface Props {
    init: () => void;
    addNewBoard: () => void;
    editBoard: (board: BoardObject) => void;
    editedBoard: BoardObject;
    axeFx: AxeFxState;
    controller: ControllerState;
    firmwareVersion: string;
    presetName: string;
    boards: BoardObject[];
    currentBoard: BoardObject;
    loading: boolean;
}

export class AppComponent extends React.Component<Props> {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.init();
    }

    render() {
        const { addNewBoard, editBoard, editedBoard, axeFx, controller, firmwareVersion, presetName, boards, currentBoard, loading } = this.props;
        if (loading) return null;
        return (
            <div id="app">
                <Header axeFx={axeFx} controller={controller}></Header>
                <Sidebar addNewBoard={addNewBoard}
                         editBoard={editBoard}
                         boards={boards} 
                         currentBoardId={currentBoard && currentBoard.id}></Sidebar>
                <div className="main-container">
                    <Route path="/boards/:boardId" component={BoardContainer} />
                </div>
                <Modal isOpen={!!editedBoard} shouldCloseOnOverlayClick={false}>
                    <BoardSettingsContainer></BoardSettingsContainer>
                </Modal>
            </div>
        );
            
    }
}