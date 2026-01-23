import {
  ShapeUtil,
  HTMLContainer,
  Rectangle2d,
  Vec,
  type HandleSnapGeometry,
  type TLBaseShape,
} from "tldraw";

// Define the servo motor shape type
const SERVO_MOTOR_TYPE = "servo-motor";

// Fixed dimensions for servo motor
const SERVO_WIDTH = 120;
const SERVO_HEIGHT = 80;

// Extend tldraw's shape type system
declare module "tldraw" {
  export interface TLGlobalShapePropsMap {
    [SERVO_MOTOR_TYPE]: Record<string, never>;
  }
}

// Define the servo motor shape type
export type ServoMotorShape = TLBaseShape<
  typeof SERVO_MOTOR_TYPE,
  Record<string, never>
>;

export class ServoMotorShapeUtil extends ShapeUtil<ServoMotorShape> {
  static override type = SERVO_MOTOR_TYPE;

  override getDefaultProps(): ServoMotorShape["props"] {
    return {};
  }

  override getGeometry(_shape: ServoMotorShape) {
    return new Rectangle2d({
      width: SERVO_WIDTH,
      height: SERVO_HEIGHT,
      isFilled: true,
    });
  }

  override canResize() {
    return false;
  }

  // Define snap points for arrow connections (VCC, Signal, GND pins)
  override getHandleSnapGeometry(_shape: ServoMotorShape): HandleSnapGeometry {
    const geometry = this.getGeometry(_shape);
    const pinSpacing = SERVO_HEIGHT / 4;

    // Define the three pin positions as snap points
    const points = [
      new Vec(SERVO_WIDTH, pinSpacing), // VCC pin
      new Vec(SERVO_WIDTH, SERVO_HEIGHT / 2), // Signal pin
      new Vec(SERVO_WIDTH, SERVO_HEIGHT - pinSpacing), // GND pin
    ];

    return {
      outline: geometry,
      points,
    };
  }

  // Render the servo motor shape
  override component(_shape: ServoMotorShape) {
    const w = SERVO_WIDTH;
    const h = SERVO_HEIGHT;
    const pinSpacing = h / 4;
    const pinRadius = 4;

    return (
      <HTMLContainer>
        <svg width={w} height={h} xmlns="http://www.w3.org/2000/svg">
          {/* Main body */}
          <rect
            x={0}
            y={0}
            width={w - 20}
            height={h}
            fill="#4A5568"
            stroke="#2D3748"
            strokeWidth={2}
            rx={4}
          />

          {/* Motor shaft */}
          <circle
            cx={(w - 20) / 2}
            cy={h / 2}
            r={12}
            fill="#718096"
            stroke="#2D3748"
            strokeWidth={2}
          />
          <circle
            cx={(w - 20) / 2}
            cy={h / 2}
            r={4}
            fill="#2D3748"
          />

          {/* Pin connector base */}
          <rect
            x={w - 20}
            y={h / 4 - 5}
            width={15}
            height={h / 2 + 10}
            fill="#2D3748"
            stroke="#1A202C"
            strokeWidth={1}
            rx={2}
          />

          {/* VCC Pin (red) */}
          <circle
            cx={w}
            cy={pinSpacing}
            r={pinRadius}
            fill="#FC8181"
            stroke="#C53030"
            strokeWidth={2}
          />
          <text
            x={w - 35}
            y={pinSpacing + 4}
            fontSize="10"
            fill="#E2E8F0"
            fontFamily="monospace"
          >
            VCC
          </text>

          {/* Signal Pin (orange) */}
          <circle
            cx={w}
            cy={h / 2}
            r={pinRadius}
            fill="#F6AD55"
            stroke="#DD6B20"
            strokeWidth={2}
          />
          <text
            x={w - 35}
            y={h / 2 + 4}
            fontSize="10"
            fill="#E2E8F0"
            fontFamily="monospace"
          >
            SIG
          </text>

          {/* GND Pin (black/dark gray) */}
          <circle
            cx={w}
            cy={h - pinSpacing}
            r={pinRadius}
            fill="#4A5568"
            stroke="#1A202C"
            strokeWidth={2}
          />
          <text
            x={w - 35}
            y={h - pinSpacing + 4}
            fontSize="10"
            fill="#E2E8F0"
            fontFamily="monospace"
          >
            GND
          </text>

          {/* Title */}
          <text
            x={(w - 20) / 2}
            y={h - 10}
            fontSize="12"
            fill="#E2E8F0"
            fontFamily="sans-serif"
            textAnchor="middle"
            fontWeight="bold"
          >
            SERVO
          </text>
        </svg>
      </HTMLContainer>
    );
  }

  // Render the selection indicator
  override indicator(_shape: ServoMotorShape) {
    return <rect width={SERVO_WIDTH} height={SERVO_HEIGHT} />;
  }
}
