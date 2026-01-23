import { StateNode, type TLStateNodeConstructor } from "tldraw";
import { Idle } from "./toolStates/Idle";
import { Pointing } from "./toolStates/ServoPointing";

export class ServoMotorShapeTool extends StateNode {
  static override id = "servo-motor";
  static override initial = "idle";
  static override children(): TLStateNodeConstructor[] {
    return [Idle, Pointing];
  }
  override shapeType = "servo-motor";
}
