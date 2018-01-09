import { ControlObject } from "./control-object";
import { MIDIController } from "./midi";

export interface PanelObject {
    id: number;
    label: string;
    controller: MIDIController;
    controls: ControlObject[];
}