import {
  ShapeUtil,
  HTMLContainer,
  Rectangle2d,
  Vec,
  type HandleSnapGeometry,
  type TLBaseShape,
} from "tldraw";

const BATTERY_TYPE = "battery";
const BATTERY_WIDTH = 100;
const BATTERY_HEIGHT = 60;

declare module "tldraw" {
  export interface TLGlobalShapePropsMap {
    [BATTERY_TYPE]: Record<string, never>;
  }
}

export type BatteryShape = TLBaseShape<
  typeof BATTERY_TYPE,
  Record<string, never>
>;

export class BatteryShapeUtil extends ShapeUtil<BatteryShape> {
  static override type = BATTERY_TYPE;

  override getDefaultProps(): BatteryShape["props"] {
    return {};
  }

  override getGeometry(_shape: BatteryShape) {
    return new Rectangle2d({
      width: BATTERY_WIDTH,
      height: BATTERY_HEIGHT,
      isFilled: true,
    });
  }

  override canResize() {
    return false;
  }

  // Define anchor points for positive and negative terminals
  override getHandleSnapGeometry(_shape: BatteryShape): HandleSnapGeometry {
    const geometry = this.getGeometry(_shape);
    const w = BATTERY_WIDTH;
    const h = BATTERY_HEIGHT;

    const points = [
      new Vec(0, h / 2), // negative terminal (left)
      new Vec(w, h / 2), // positive terminal (right)
    ];

    return {
      outline: geometry,
      points,
    };
  }

  override component(_shape: BatteryShape) {
    const w = BATTERY_WIDTH;
    const h = BATTERY_HEIGHT;

    return (
      <HTMLContainer>
        <svg width={w} height={h} xmlns="http://www.w3.org/2000/svg">
          {/* Main battery body */}
          <rect
            x={15}
            y={10}
            width={w - 25}
            height={h - 20}
            fill="#2C3E50"
            stroke="#1A252F"
            strokeWidth={2}
            rx={4}
          />

          {/* Positive terminal (right bump) */}
          <rect
            x={w - 10}
            y={h / 2 - 6}
            width={10}
            height={12}
            fill="#C0392B"
            stroke="#922B21"
            strokeWidth={1}
            rx={2}
          />

          {/* Negative terminal (left flat) */}
          <rect
            x={0}
            y={h / 2 - 8}
            width={15}
            height={16}
            fill="#34495E"
            stroke="#1A252F"
            strokeWidth={1}
            rx={2}
          />

          {/* Plus symbol */}
          <text
            x={w - 20}
            y={h / 2 + 5}
            fontSize="16"
            fill="#E74C3C"
            fontFamily="sans-serif"
            textAnchor="middle"
            fontWeight="bold"
          >
            +
          </text>

          {/* Minus symbol */}
          <text
            x={20}
            y={h / 2 + 5}
            fontSize="16"
            fill="#95A5A6"
            fontFamily="sans-serif"
            textAnchor="middle"
            fontWeight="bold"
          >
            -
          </text>

          {/* Voltage indicator bars */}
          <line
            x1={35}
            y1={15}
            x2={35}
            y2={h - 15}
            stroke="#7F8C8D"
            strokeWidth={3}
          />
          <line
            x1={45}
            y1={20}
            x2={45}
            y2={h - 20}
            stroke="#7F8C8D"
            strokeWidth={3}
          />

          {/* Battery label */}
          <text
            x={w / 2 + 5}
            y={h / 2 + 5}
            fontSize="10"
            fill="#ECF0F1"
            fontFamily="sans-serif"
            textAnchor="middle"
            fontWeight="bold"
          >
            9V
          </text>
        </svg>
      </HTMLContainer>
    );
  }

  override indicator(_shape: BatteryShape) {
    return <rect width={BATTERY_WIDTH} height={BATTERY_HEIGHT} />;
  }
}
