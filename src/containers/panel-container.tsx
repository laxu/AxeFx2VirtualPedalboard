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
import { GroupObject, KnobMode, KnobColor, KnobStyle, GroupSizeType } from '../api/group-object';

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
        savePanelChanges() {
            dispatch(setPanelAction({...panel}));
            dispatch(getCurrentPanelAction(panel.id));
        },
        addPanelGroup() {
            const group: GroupObject = {
                id: generateId(),
                label: '',
                bgColor: '#ccc',
                textColor: '#222',
                showBlockNames: true,
                showKnobs: KnobMode.NumericOnly,
                knobColor: KnobColor.Black,
                knobStyle: KnobStyle.Simple,
                size: {
                    type: GroupSizeType.Auto,
                    width: 250,
                    height: 250
                }
            }
            panel.groups.push(group);
        },
        removePanelGroup(group: GroupObject) {
            const idx = panel.groups.findIndex(g => g.id === group.id);
            if (idx === -1) throw new Error('Trying to remove group that does not exist!');
            panel.groups.splice(idx, 1);
        },
        addPanelControl(group: GroupObject, controlType: ControlType) {
            const control: ControlObject = {
                id: generateId(),
                blockId: null,
                paramId: null,
                paramValue: null,
                rawValue: null,
                controlType,
                isRelative: true,
                cc: null,
                groupId: group.id
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
