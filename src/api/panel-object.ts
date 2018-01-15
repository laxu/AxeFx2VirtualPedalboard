import { ControlObject } from "./control-object";
import { MIDIController } from "./midi";

export interface PanelObject {
    id: string;
    label: string;
    controller: MIDIController;
    controls: ControlObject[];
    cc?: number;
}