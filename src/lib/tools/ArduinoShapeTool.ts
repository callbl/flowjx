import { StateNode, type TLStateNodeConstructor } from "tldraw";
import { Idle } from "./toolStates/Idle";
import { Pointing } from "./toolStates/ArduinoPointing";

export class ArduinoShapeTool extends StateNode {
  static override id = "arduino";
  static override initial = "idle";
  static override children(): TLStateNodeConstructor[] {
    return [Idle, Pointing];
  }
  override shapeType = "arduino";
}
