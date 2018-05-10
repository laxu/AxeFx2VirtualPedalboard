import { GroupObject, KnobMode, KnobColor, KnobStyle, GroupSizeType } from "../api/group-object";
import { generateId } from "./util";
import { BoardObject } from "../api/board-object";
import { ControlObject, ControlType } from "../api/control-object";

export function createGroup(controlProps = {}): GroupObject {
    return {
        id: generateId(),
        label: 'Group',
        bgColor: '#ccc',
        textColor: '#222',
        showBlockNames: true,
        showKnobs: KnobMode.NumericOnly,
        knobColor: KnobColor.Dark,
        knobStyle: KnobStyle.RoundOutline,
        size: {
            type: GroupSizeType.Auto,
            controlsPerRow: 3
        },
        ...controlProps
    };
}

export function createBoard(boardProps = {}): BoardObject {
    return {
        id: generateId(),
        label: 'Pedalboard',
        controllerId: null,
        controls: [],
        groups: [createGroup()],
        ccMap: {},
        ...boardProps
    };
}

export function createControl(controlProps = {}): ControlObject {
    return {
        id: generateId(),
        blockId: null,
        paramId: null,
        formattedValue: null,
        paramValue: null,
        controlType: ControlType.Control,
        isRelative: true,
        cc: null,
        groupId: null,
        ...controlProps
    };
}