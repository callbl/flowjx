import {
  ShapeUtil,
  HTMLContainer,
  Rectangle2d,
  Vec,
  type HandleSnapGeometry,
  type TLBaseShape,
} from "tldraw";

const ARDUINO_TYPE = "arduino";
const ARDUINO_WIDTH = 160;
const ARDUINO_HEIGHT = 100;

declare module "tldraw" {
  export interface TLGlobalShapePropsMap {
    [ARDUINO_TYPE]: Record<string, never>;
  }
}

export type ArduinoShape = TLBaseShape<
  typeof ARDUINO_TYPE,
  Record<string, never>
>;

export class ArduinoShapeUtil extends ShapeUtil<ArduinoShape> {
  static override type = ARDUINO_TYPE;

  override getDefaultProps(): ArduinoShape["props"] {
    return {};
  }

  override getGeometry(_shape: ArduinoShape) {
    return new Rectangle2d({
      width: ARDUINO_WIDTH,
      height: ARDUINO_HEIGHT,
      isFilled: true,
    });
  }

  override canResize() {
    return false;
  }

  // Define anchor points for connections (4 corners + 4 mid-sides)
  override getHandleSnapGeometry(_shape: ArduinoShape): HandleSnapGeometry {
    const geometry = this.getGeometry(_shape);
    const w = ARDUINO_WIDTH;
    const h = ARDUINO_HEIGHT;

    const points = [
      new Vec(0, 0), // top-left
      new Vec(w / 2, 0), // top-center
      new Vec(w, 0), // top-right
      new Vec(w, h / 2), // right-center
      new Vec(w, h), // bottom-right
      new Vec(w / 2, h), // bottom-center
      new Vec(0, h), // bottom-left
      new Vec(0, h / 2), // left-center
    ];

    return {
      outline: geometry,
      points,
    };
  }

  override component(_shape: ArduinoShape) {
    const w = ARDUINO_WIDTH;
    const h = ARDUINO_HEIGHT;

    return (
      <HTMLContainer>
        <svg width={w} height={h} xmlns="http://www.w3.org/2000/svg">
          {/* Main board */}
          <rect
            x={0}
            y={0}
            width={w}
            height={h}
            fill="#00979D"
            stroke="#006064"
            strokeWidth={2}
            rx={4}
          />

          {/* USB port */}
          <rect x={5} y={h / 2 - 8} width={12} height={16} fill="#C0C0C0" rx={2} />

          {/* Power jack */}
          <rect x={5} y={15} width={10} height={10} fill="#000" rx={1} />

          {/* Digital pins header (top) */}
          {Array.from({ length: 14 }).map((_, i) => (
            <rect
              key={`d${i}`}
              x={30 + i * 8}
              y={8}
              width={3}
              height={8}
              fill="#1A1A1A"
            />
          ))}

          {/* Analog pins header (bottom) */}
          {Array.from({ length: 6 }).map((_, i) => (
            <rect
              key={`a${i}`}
              x={30 + i * 8}
              y={h - 16}
              width={3}
              height={8}
              fill="#1A1A1A"
            />
          ))}

          {/* ATmega chip */}
          <rect
            x={w / 2 - 15}
            y={h / 2 - 10}
            width={30}
            height={20}
            fill="#1A1A1A"
            stroke="#000"
            strokeWidth={1}
            rx={2}
          />

          {/* Label */}
          <text
            x={w / 2}
            y={h / 2 + 18}
            fontSize="12"
            fill="#FFF"
            fontFamily="sans-serif"
            textAnchor="middle"
            fontWeight="bold"
          >
            ARDUINO
          </text>
        </svg>
      </HTMLContainer>
    );
  }

  override indicator(_shape: ArduinoShape) {
    return <rect width={ARDUINO_WIDTH} height={ARDUINO_HEIGHT} />;
  }
}
