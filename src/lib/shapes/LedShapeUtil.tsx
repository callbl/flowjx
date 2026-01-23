import {
  ShapeUtil,
  HTMLContainer,
  Rectangle2d,
  Vec,
  type HandleSnapGeometry,
  type TLBaseShape,
} from "tldraw";

const LED_TYPE = "led";
const LED_WIDTH = 60;
const LED_HEIGHT = 60;

declare module "tldraw" {
  export interface TLGlobalShapePropsMap {
    [LED_TYPE]: Record<string, never>;
  }
}

export type LedShape = TLBaseShape<typeof LED_TYPE, Record<string, never>>;

export class LedShapeUtil extends ShapeUtil<LedShape> {
  static override type = LED_TYPE;

  override getDefaultProps(): LedShape["props"] {
    return {};
  }

  override getGeometry(_shape: LedShape) {
    return new Rectangle2d({
      width: LED_WIDTH,
      height: LED_HEIGHT,
      isFilled: true,
    });
  }

  override canResize() {
    return false;
  }

  // Define anchor points for anode (top) and cathode (bottom)
  override getHandleSnapGeometry(_shape: LedShape): HandleSnapGeometry {
    const geometry = this.getGeometry(_shape);
    const w = LED_WIDTH;
    const h = LED_HEIGHT;

    const points = [
      new Vec(w / 2, 0), // anode (top)
      new Vec(w / 2, h), // cathode (bottom)
    ];

    return {
      outline: geometry,
      points,
    };
  }

  override component(_shape: LedShape) {
    const w = LED_WIDTH;
    const h = LED_HEIGHT;
    const centerX = w / 2;
    const centerY = h / 2;
    const radius = 18;

    return (
      <HTMLContainer>
        <svg width={w} height={h} xmlns="http://www.w3.org/2000/svg">
          {/* LED body (circle) */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="#FF4444"
            stroke="#CC0000"
            strokeWidth={2}
            opacity={0.8}
          />

          {/* Anode (positive terminal - longer leg) */}
          <line
            x1={centerX}
            y1={centerY - radius}
            x2={centerX}
            y2={0}
            stroke="#888"
            strokeWidth={3}
          />
          <circle cx={centerX} cy={0} r={3} fill="#666" />

          {/* Cathode (negative terminal - shorter leg with flat side) */}
          <line
            x1={centerX}
            y1={centerY + radius}
            x2={centerX}
            y2={h}
            stroke="#888"
            strokeWidth={3}
          />
          <circle cx={centerX} cy={h} r={3} fill="#666" />

          {/* Flat side indicator on LED body (cathode side) */}
          <path
            d={`M ${centerX - radius * 0.5} ${centerY + radius * 0.7} L ${centerX + radius * 0.5} ${centerY + radius * 0.7}`}
            stroke="#CC0000"
            strokeWidth={2}
          />

          {/* + and - labels */}
          <text
            x={centerX + radius + 5}
            y={centerY - radius / 2}
            fontSize="10"
            fill="#000"
            fontFamily="monospace"
            fontWeight="bold"
          >
            +
          </text>
          <text
            x={centerX + radius + 5}
            y={centerY + radius / 2}
            fontSize="10"
            fill="#000"
            fontFamily="monospace"
            fontWeight="bold"
          >
            -
          </text>

          {/* LED label */}
          <text
            x={centerX}
            y={centerY + 5}
            fontSize="10"
            fill="#FFF"
            fontFamily="sans-serif"
            textAnchor="middle"
            fontWeight="bold"
          >
            LED
          </text>
        </svg>
      </HTMLContainer>
    );
  }

  override indicator(_shape: LedShape) {
    return <rect width={LED_WIDTH} height={LED_HEIGHT} />;
  }
}
