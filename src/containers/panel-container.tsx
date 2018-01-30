import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { getCurrentPanelAction, setPanelAction, updateControlValueAction } from "../store/actions";
import { getAxeFxInstance } from "../api/midi";
import { MODEL_IDS, DEBOUNCE_TIME } from "../api/constants";
import { GenericMIDIController } from "../api/generic-midi-controller";
import { PanelObject } from "../api/panel-object";
import { ControlType, ControlObject } from '../api/control-object';
import { generateId } from '../util/util';
import PanelComponent from '../components/panel/panel';

const mapStateToProps = state => ({
    axeFx: state.app.axeFx,
    controller: state.app.controller,
    panel: state.app.currentPanel,
    panels: state.app.panels
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const { panel } = stateProps;
    const { dispatch } = dispatchProps;
    const { match } = ownProps;
    return {
        ...stateProps,
        ...dispatchProps,
        ...ownProps,
        init() {
            dispatch(getCurrentPanelAction(match.params.panelId));
        },
        updateControlValues() {
            const { panel } = stateProps;
            const axeFx = getAxeFxInstance();
            if (panel) {
                panel.controls.forEach(control => {
                    const { blockId, paramId } = control;
                    if (blockId && paramId >= 0) {
                        dispatch(updateControlValueAction({blockId, paramId, paramValue: null}));
                        if (axeFx && axeFx.output) {
                            axeFx.getBlockParamValue(blockId, paramId);
                        }
                    }
                });
            }
        },
        savePanelChanges(formValues) {
            const updatedPanel = {
                ...panel,
                ...formValues,
                cc: formValues.cc !== 'all' ? Number(formValues.cc) : formValues.cc
            };
            dispatch(setPanelAction(updatedPanel));
            dispatch(getCurrentPanelAction(updatedPanel.id));
        },
        addPanelControl(controlType: ControlType) {
            const control: ControlObject = {
                id: generateId(),
                blockId: null,
                paramId: null,
                paramValue: null,
                rawValue: null,
                controlType,
                cc: null
            };
            panel.controls.push(control);
        },
        removePanelControl(control: ControlObject) {
            const controlIdx = panel.controls.findIndex(ctrl => ctrl.id === control.id);
            if (controlIdx === -1) throw new Error('Trying to remove control that does not exist!');
            panel.controls.splice(controlIdx, 1);
        }
    };
};

export default withRouter(connect(mapStateToProps, null, mergeProps)(PanelComponent));
