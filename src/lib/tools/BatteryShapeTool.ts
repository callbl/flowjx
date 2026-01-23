import { StateNode, type TLStateNodeConstructor } from "tldraw";
import { Idle } from "./toolStates/Idle";
import { Pointing } from "./toolStates/BatteryPointing";

export class BatteryShapeTool extends StateNode {
  static override id = "battery";
  static override initial = "idle";
  static override children(): TLStateNodeConstructor[] {
    return [Idle, Pointing];
  }
  override shapeType = "battery";
}
