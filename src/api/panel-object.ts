import { ControlObject } from "./control-object";
import { MIDIController } from "./midi";
import { GroupObject } from "./group-object";

export interface PanelObject {
    id: string;
    label: string;
    controllerId: string;
    controls: ControlObject[];
    groups: GroupObject[];
    cc?: number;
}