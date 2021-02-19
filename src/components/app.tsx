import * as React from "react";
import Modal from "react-modal/lib/components/Modal";

import Header from "./header/header";
import { AxeFxState } from "../api/axefx";
import { ControllerState } from "../api/generic-midi-controller";
import { BoardObject } from "../api/board-object";
import Sidebar from "./sidebar/sidebar";
import BoardContainer from "../containers/board-container";
import BoardSettingsContainer from "../containers/board-settings-container";

interface Props {
  init: () => void;
  addNewBoard: () => void;
  editBoard: (board: BoardObject) => void;
  selectBoard: (board: BoardObject) => void;
  toggleSidebar: () => void;
  sidebarOpen: boolean;
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

  componentDidMount() {
    this.props.init();
  }

  render() {
    const {
      addNewBoard,
      editBoard,
      selectBoard,
      editedBoard,
      axeFx,
      controller,
      firmwareVersion,
      presetName,
      boards,
      currentBoard,
      loading,
      sidebarOpen,
      toggleSidebar,
    } = this.props;
    if (loading) return null;
    return (
      <div id="app">
        <Header axeFx={axeFx} controller={controller}></Header>
        <div id="body">
          <Sidebar
            isOpen={sidebarOpen}
            addNewBoard={addNewBoard}
            editBoard={editBoard}
            selectBoard={selectBoard}
            boards={boards}
            currentBoardId={currentBoard && currentBoard.id}
            toggleSidebar={toggleSidebar}
          ></Sidebar>
          <div className="main-container">
            <BoardContainer></BoardContainer>
          </div>
        </div>
        <Modal isOpen={!!editedBoard} shouldCloseOnOverlayClick={false}>
          <BoardSettingsContainer></BoardSettingsContainer>
        </Modal>
      </div>
    );
  }
}
