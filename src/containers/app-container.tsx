import { connect } from "react-redux";
import Modal from 'react-modal/lib/components/Modal';

import { setBoardAction, resetControlValuesAction, resetAxeFxAction, setCurrentBoardAction, editBoardAction, toggleSidebarAction } from "../store/actions";
import { WebMidiWrapper, MIDIController, MIDIListenerType, updateDevices, getAxeFxInstance, getControllerInstance, MIDIDeviceStateChange, MIDIDeviceType, MIDIControllerType, buildInstances } from "../api/midi";
import { MODEL_IDS, PARAM_VALUE_MULTIPLIER } from "../api/constants";
import { AxeFx } from "../api/axefx";
import { GenericMIDIController } from "../api/generic-midi-controller";
import { BoardObject } from "../api/board-object";
import { AppComponent } from "../components/app";
import { FX_BLOCK_IDS, FX_PARAMS } from '../api/fx-block-data';
import { parameterValueBytesToInt, generateId, midiValueToAxeFx } from '../util/util';
import { getAllBlocks } from '../api/fx-block';
import { getStoreStateSlice } from '../store/store';
import { createBoard } from '../util/object-helper';

const mapStateToProps = state => ({
    axeFx: state.app.devices.axeFx,
    controller: state.app.devices.controller,
    devices: state.app.devices.devices,
    boards: state.app.board.boards,
    currentBoard: state.app.board.currentBoard,
    editedBoard: state.app.board.editedBoard,
    loading: state.app.common.loading,
    sidebarOpen: state.app.common.sidebarOpen
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const { controller, devices, boards, currentBoard } = stateProps;
    const { dispatch } = dispatchProps;
    return {
        ...stateProps,
        ...dispatchProps,
        ...ownProps,
        init() {
            Modal.setAppElement(document.getElementById('app-container'));

            buildInstances(dispatch);

            dispatch(resetAxeFxAction());
            dispatch(resetControlValuesAction());

            WebMidiWrapper.webMidi.addListener(MIDIDeviceStateChange.Connected, event => {
                console.log('connected device', event);
                const device = event.port;
                const devices = getStoreStateSlice('devices', 'devices');
                updateDevices(devices);
            });

            WebMidiWrapper.webMidi.addListener(MIDIDeviceStateChange.Disconnected, event => {
                console.log('disconnected device', event);
                const device = event.port;
                const axeFx = getAxeFxInstance();
                const controller = getControllerInstance();
                if (device.type === MIDIDeviceType.Input) {
                    if (axeFx.input.name === device.name) {
                        axeFx.disconnect();
                    } else if (controller.input.name === device.name) {
                        controller.disconnect();
                    }
                }
            });
        },
        addNewBoard() {
            const board: BoardObject = createBoard({ controllerId: controller.id });
            dispatch(setBoardAction(board));
        },
        editBoard(board) {
            dispatch(editBoardAction(board));
        },
        selectBoard(board) {
            if (board.id === currentBoard.id) return;
            dispatch(setCurrentBoardAction(board.id));
        },
        toggleSidebar() {
            dispatch(toggleSidebarAction());
        }
    }
};

export default connect(mapStateToProps, null, mergeProps)(AppComponent);
