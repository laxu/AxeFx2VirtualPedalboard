import { connect } from "react-redux";
import { editBoardAction, setBoardAction, deleteBoardAction } from "../store/actions";
import BoardSettingsComponent from "../components/board-settings/board-settings";

const mapStateToProps = state => ({
    board: state.app.board.editedBoard
});

const mergeProps = (stateProps, dispatchProps) => {
    const { board } = stateProps;
    const { dispatch } = dispatchProps;
    return {
        ...stateProps,
        ...dispatchProps,
        saveSettings(formValues) {
            const updatedBoard = {
                ...board,
                ...formValues,
                cc: formValues.cc.trim() !== '' ? Number(formValues.cc) : null
            };
            dispatch(setBoardAction(updatedBoard));
            dispatch(editBoardAction(null));
        },

        deleteBoard() {
            dispatch(deleteBoardAction(board.id));
            dispatch(editBoardAction(null));
        },
    
        close() {
            dispatch(editBoardAction(null));
        }
    };
    
};

export default connect(mapStateToProps, null, mergeProps)(BoardSettingsComponent);