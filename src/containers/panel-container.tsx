import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { getCurrentPanelAction, setPanelAction, updateControlValueAction } from "../store/actions";
import { WebMidiWrapper, MIDIController, MIDIListenerType, getAxeFxInstance, getControllerInstance } from "../api/midi";
import { MODEL_IDS, DEBOUNCE_TIME } from "../api/constants";
import { AxeFx } from "../api/axefx";
import { GenericMIDIController } from "../api/generic-midi-controller";
import { PanelObject } from "../api/panel-object";
import { ControlType, ControlObject } from '../api/control-object';
import PanelComponent from '../components/panel/panel';
import { generateId, resolveRelativeValue, debounce } from '../util/util';

const mapStateToProps = state => ({
    axeFx: state.app.axeFx,
    controller: state.app.controller,
    panel: state.app.currentPanel,
    panels: state.app.panels
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const { panel } = stateProps;
    const { dispatch } = dispatchProps;
    const { match, history } = ownProps;
    return {
        ...stateProps,
        ...dispatchProps,
        ...ownProps,
        init() {
            console.log('initializing', panel, match.params.panelId);
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
        attachControllerListener() {
            const { panel, panels } = stateProps;
            const axeFx = getAxeFxInstance();
            const controller = getControllerInstance();
            if (controller && controller.input) {
                controller.input.removeListener().addListener(MIDIListenerType.CC, controller.channel, debounce(event => {
                    console.log('controller event data', event.data);
                    const cc = event.data[1];
                    let value = event.data[2];
                    const panelActivatedByCC = panels.find(p => p.cc === cc);
                    if (panelActivatedByCC) {
                        // Switch to panel
                        history.push(`/panels/${panelActivatedByCC.id}`);
                    } else {
                        // Change control
                        const control: ControlObject = panel.controls.find(ctrl => ctrl.cc === cc);
                        if (control) {
                            let useRawValue = false;
                            if (control.isRelative) {
                                console.log('fuu', control.paramValue);
                                value = resolveRelativeValue(value, control.paramValue);
                                useRawValue = true;
                            }
                            axeFx.setBlockParamValue(control.blockId, control.paramId, value, useRawValue);
                        }
                    }
                }, DEBOUNCE_TIME));
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
