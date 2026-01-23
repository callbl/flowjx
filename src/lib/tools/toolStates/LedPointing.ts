import {
  StateNode,
  Vec,
  createShapeId,
  maybeSnapToGrid,
  type TLPointerEventInfo,
} from "tldraw";

const LED_WIDTH = 60;
const LED_HEIGHT = 60;

export class Pointing extends StateNode {
  static override id = "pointing";

  override onPointerUp() {
    this.complete();
  }

  override onPointerMove(_info: TLPointerEventInfo) {
    // Fixed size, no dragging resize
  }

  override onCancel() {
    this.cancel();
  }

  override onComplete() {
    this.complete();
  }

  override onInterrupt() {
    this.cancel();
  }

  private complete() {
    const originPagePoint = this.editor.inputs.getOriginPagePoint();
    const id = createShapeId();

    this.editor.markHistoryStoppingPoint(`creating_led:${id}`);

    const w = LED_WIDTH;
    const h = LED_HEIGHT;
    const delta = new Vec(w / 2, h / 2);

    const newPoint = maybeSnapToGrid(
      new Vec(originPagePoint.x - delta.x, originPagePoint.y - delta.y),
      this.editor
    );

    this.editor.createShapes([
      {
        id,
        type: "led",
        x: newPoint.x,
        y: newPoint.y,
        props: {},
      },
    ]);

    const shape = this.editor.getShape(id);
    if (!shape) {
      this.cancel();
      return;
    }

    this.editor.select(id);

    if (this.editor.getInstanceState().isToolLocked) {
      this.parent.transition("idle");
    } else {
      this.editor.setCurrentTool("select");
    }
  }

  private cancel() {
    this.parent.transition("idle");
  }
}
