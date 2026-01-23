import { StateNode, type TLStateNodeConstructor } from "tldraw";
import { Idle } from "./toolStates/Idle";
import { Pointing } from "./toolStates/LedPointing";

export class LedShapeTool extends StateNode {
  static override id = "led";
  static override initial = "idle";
  static override children(): TLStateNodeConstructor[] {
    return [Idle, Pointing];
  }
  override shapeType = "led";
}
