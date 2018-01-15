import { ControlObject } from "./control-object";
import { MIDIController } from "./midi";

export interface PanelObject {
    id: string;
    label: string;
    controllerId: string;
    controls: ControlObject[];
    cc?: number;
}