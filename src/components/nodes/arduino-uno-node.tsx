import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import type { ArduinoUnoData } from "../circuit-flow";
import { NodeToolbarContent } from "../node-toolbar-content";

// Pin definitions
const digitalPins = [
  { id: "D0", label: "0", pwm: false, special: "RX" },
  { id: "D1", label: "1", pwm: false, special: "TX" },
  { id: "D2", label: "2", pwm: false },
  { id: "D3", label: "3", pwm: true },
  { id: "D4", label: "4", pwm: false },
  { id: "D5", label: "5", pwm: true },
  { id: "D6", label: "6", pwm: true },
  { id: "D7", label: "7", pwm: false },
  { id: "D8", label: "8", pwm: false },
  { id: "D9", label: "9", pwm: true },
  { id: "D10", label: "10", pwm: true },
  { id: "D11", label: "11", pwm: true },
  { id: "D12", label: "12", pwm: false },
  { id: "D13", label: "13", pwm: false },
  { id: "GND_D", label: "GND", pwm: false },
  { id: "AREF", label: "AREF", pwm: false },
];

const powerPins = [
  { id: "RESET", label: "RST", color: "#DAA520" },
  { id: "3V3", label: "3.3V", color: "#FF8800" },
  { id: "5V", label: "5V", color: "#ef4444" },
  { id: "GND1", label: "GND", color: "#333333" },
  { id: "GND2", label: "GND", color: "#333333" },
  { id: "VIN", label: "Vin", color: "#DAA520" },
];

const analogPins = [
  { id: "A0", label: "A0" },
  { id: "A1", label: "A1" },
  { id: "A2", label: "A2" },
  { id: "A3", label: "A3" },
  { id: "A4", label: "A4" },
  { id: "A5", label: "A5" },
];

// Board dimensions
const BOARD_WIDTH = 280;
const BOARD_HEIGHT = 220;

export function ArduinoUnoNode({
  id,
  selected,
}: NodeProps<Node<ArduinoUnoData>>) {
  return (
    <>
      {selected && <NodeToolbarContent nodeId={id} />}
      <div
        className="relative select-none"
        style={{
          width: BOARD_WIDTH,
          height: BOARD_HEIGHT,
          fontFamily: "'Roboto Mono', 'Courier New', monospace",
        }}
      >
        {/* Main PCB Board SVG */}
        <svg
          width={BOARD_WIDTH}
          height={BOARD_HEIGHT}
          viewBox={`0 0 ${BOARD_WIDTH} ${BOARD_HEIGHT}`}
          className="absolute top-0 left-0"
        >
          <defs>
            {/* PCB gradient */}
            <linearGradient
              id={`pcbGradient-${id}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#00979D" />
              <stop offset="50%" stopColor="#008C8C" />
              <stop offset="100%" stopColor="#007A7A" />
            </linearGradient>

            {/* Metallic gradient for connectors */}
            <linearGradient
              id={`metalGradient-${id}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#E8E8E8" />
              <stop offset="30%" stopColor="#C0C0C0" />
              <stop offset="70%" stopColor="#A0A0A0" />
              <stop offset="100%" stopColor="#808080" />
            </linearGradient>

            {/* USB connector gradient */}
            <linearGradient
              id={`usbGradient-${id}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#D0D0D0" />
              <stop offset="50%" stopColor="#B0B0B0" />
              <stop offset="100%" stopColor="#909090" />
            </linearGradient>

            {/* Chip gradient */}
            <linearGradient
              id={`chipGradient-${id}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#2D2D2D" />
              <stop offset="50%" stopColor="#1A1A1A" />
              <stop offset="100%" stopColor="#0D0D0D" />
            </linearGradient>

            {/* Gold pin gradient */}
            <linearGradient
              id={`goldGradient-${id}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#DAA520" />
              <stop offset="100%" stopColor="#B8860B" />
            </linearGradient>
          </defs>

          {/* Board outline with characteristic Arduino shape */}
          <path
            d={`
              M 15 0
              L ${BOARD_WIDTH - 15} 0
              Q ${BOARD_WIDTH} 0 ${BOARD_WIDTH} 15
              L ${BOARD_WIDTH} ${BOARD_HEIGHT - 35}
              L ${BOARD_WIDTH - 8} ${BOARD_HEIGHT - 27}
              L ${BOARD_WIDTH - 8} ${BOARD_HEIGHT - 15}
              Q ${BOARD_WIDTH - 8} ${BOARD_HEIGHT} ${BOARD_WIDTH - 23} ${BOARD_HEIGHT}
              L 23 ${BOARD_HEIGHT}
              Q 8 ${BOARD_HEIGHT} 8 ${BOARD_HEIGHT - 15}
              L 8 ${BOARD_HEIGHT - 27}
              L 0 ${BOARD_HEIGHT - 35}
              L 0 15
              Q 0 0 15 0
              Z
            `}
            fill={`url(#pcbGradient-${id})`}
            stroke="#005F5F"
            strokeWidth="1.5"
          />

          {/* PCB trace pattern */}
          <g opacity="0.12">
            {[...Array(12)].map((_, i) => (
              <line
                key={`trace-h-${i}`}
                x1="20"
                y1={20 + i * 16}
                x2={BOARD_WIDTH - 20}
                y2={20 + i * 16}
                stroke="#00FFFF"
                strokeWidth="0.5"
              />
            ))}
            {[...Array(15)].map((_, i) => (
              <line
                key={`trace-v-${i}`}
                x1={20 + i * 18}
                y1="20"
                x2={20 + i * 18}
                y2={BOARD_HEIGHT - 20}
                stroke="#00FFFF"
                strokeWidth="0.5"
              />
            ))}
          </g>

          {/* Mounting holes */}
          {[
            { x: 14, y: 14 },
            { x: BOARD_WIDTH - 14, y: 14 },
            { x: 14, y: BOARD_HEIGHT - 45 },
            { x: BOARD_WIDTH - 14, y: BOARD_HEIGHT - 14 },
          ].map((hole, i) => (
            <g key={`hole-${i}`}>
              <circle cx={hole.x} cy={hole.y} r="6" fill="#1A1A1A" />
              <circle cx={hole.x} cy={hole.y} r="4" fill="#3A3A3A" />
              <circle cx={hole.x} cy={hole.y} r="2.5" fill="#505050" />
            </g>
          ))}

          {/* USB-B Connector */}
          <g transform="translate(85, -6)">
            <rect
              x="0"
              y="0"
              width="45"
              height="16"
              rx="2"
              fill={`url(#usbGradient-${id})`}
              stroke="#707070"
              strokeWidth="1"
            />
            <rect x="5" y="3" width="35" height="10" rx="1" fill="#404040" />
            <rect x="8" y="5" width="29" height="6" fill="#2A2A2A" />
            {[0, 1, 2, 3].map((i) => (
              <rect
                key={i}
                x={12 + i * 6}
                y="6"
                width="3"
                height="4"
                fill="#C0C0C0"
              />
            ))}
          </g>

          {/* DC Power Jack */}
          <g transform="translate(3, 45)">
            <rect
              x="-8"
              y="0"
              width="18"
              height="30"
              rx="2"
              fill="#1A1A1A"
              stroke="#333"
              strokeWidth="1"
            />
            <circle cx="1" cy="15" r="5" fill="#0D0D0D" stroke="#333" />
            <circle cx="1" cy="15" r="2" fill="#333" />
          </g>

          {/* ATmega328P Microcontroller */}
          <g transform="translate(75, 85)">
            <rect
              x="0"
              y="0"
              width="85"
              height="35"
              rx="2"
              fill={`url(#chipGradient-${id})`}
              stroke="#444"
              strokeWidth="0.5"
            />
            <circle cx="8" cy="17.5" r="3" fill="#3A3A3A" />
            <text
              x="42.5"
              y="15"
              textAnchor="middle"
              fill="#AAAAAA"
              fontSize="6"
              fontFamily="monospace"
            >
              ATMEGA328P
            </text>
            <text
              x="42.5"
              y="24"
              textAnchor="middle"
              fill="#888888"
              fontSize="5"
              fontFamily="monospace"
            >
              PU
            </text>
            {/* Chip pins */}
            {[...Array(14)].map((_, i) => (
              <rect
                key={`chip-pin-t-${i}`}
                x={6 + i * 5.5}
                y="-3"
                width="2"
                height="4"
                fill={`url(#metalGradient-${id})`}
              />
            ))}
            {[...Array(14)].map((_, i) => (
              <rect
                key={`chip-pin-b-${i}`}
                x={6 + i * 5.5}
                y="34"
                width="2"
                height="4"
                fill={`url(#metalGradient-${id})`}
              />
            ))}
          </g>

          {/* Crystal Oscillator */}
          <g transform="translate(170, 95)">
            <rect
              x="0"
              y="0"
              width="18"
              height="8"
              rx="1"
              fill="#C0C0C0"
              stroke="#909090"
              strokeWidth="0.5"
            />
            <text
              x="9"
              y="6"
              textAnchor="middle"
              fill="#666"
              fontSize="4"
              fontFamily="monospace"
            >
              16MHz
            </text>
          </g>

          {/* Reset Button */}
          <g transform="translate(20, 140)">
            <rect
              x="0"
              y="0"
              width="16"
              height="10"
              rx="1"
              fill="#2A2A2A"
              stroke="#444"
              strokeWidth="0.5"
            />
            <rect
              x="3"
              y="2"
              width="10"
              height="6"
              rx="1"
              fill="#E8E8E8"
              stroke="#CCC"
              strokeWidth="0.5"
            />
            <text
              x="8"
              y="-3"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="5"
              fontWeight="bold"
            >
              RESET
            </text>
          </g>

          {/* ATmega16U2 (USB controller) */}
          <g transform="translate(95, 30)">
            <rect
              x="0"
              y="0"
              width="28"
              height="28"
              rx="1"
              fill={`url(#chipGradient-${id})`}
              stroke="#444"
              strokeWidth="0.5"
            />
            <circle cx="5" cy="5" r="2" fill="#3A3A3A" />
            <text
              x="14"
              y="16"
              textAnchor="middle"
              fill="#999"
              fontSize="4"
              fontFamily="monospace"
            >
              16U2
            </text>
          </g>

          {/* Voltage Regulator */}
          <g transform="translate(45, 50)">
            <rect
              x="0"
              y="0"
              width="20"
              height="12"
              rx="1"
              fill="#1A1A1A"
              stroke="#444"
              strokeWidth="0.5"
            />
            <rect x="-2" y="8" width="24" height="6" fill="#2A2A2A" />
          </g>

          {/* LEDs */}
          {/* Power LED (Green - animated glow) */}
          <g transform="translate(50, 155)">
            <ellipse cx="4" cy="2.5" rx="4" ry="2.5" fill="#00FF00" opacity="0.9">
              <animate
                attributeName="opacity"
                values="0.9;0.6;0.9"
                dur="2s"
                repeatCount="indefinite"
              />
            </ellipse>
            <text
              x="4"
              y="12"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="5"
              fontWeight="bold"
            >
              ON
            </text>
          </g>

          {/* TX LED */}
          <g transform="translate(75, 155)">
            <ellipse
              cx="4"
              cy="2.5"
              rx="4"
              ry="2.5"
              fill="#FFD700"
              opacity="0.5"
            />
            <text
              x="4"
              y="12"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="5"
              fontWeight="bold"
            >
              TX
            </text>
          </g>

          {/* RX LED */}
          <g transform="translate(90, 155)">
            <ellipse
              cx="4"
              cy="2.5"
              rx="4"
              ry="2.5"
              fill="#FFD700"
              opacity="0.5"
            />
            <text
              x="4"
              y="12"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="5"
              fontWeight="bold"
            >
              RX
            </text>
          </g>

          {/* L LED (Pin 13) */}
          <g transform="translate(105, 155)">
            <ellipse
              cx="4"
              cy="2.5"
              rx="4"
              ry="2.5"
              fill="#FF8C00"
              opacity="0.5"
            />
            <text
              x="4"
              y="12"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="5"
              fontWeight="bold"
            >
              L
            </text>
          </g>

          {/* ICSP Header */}
          <g transform="translate(190, 50)">
            <rect
              x="0"
              y="0"
              width="22"
              height="15"
              fill="#2A2A2A"
              stroke="#444"
              strokeWidth="0.5"
            />
            {[0, 1, 2].map((col) =>
              [0, 1].map((row) => (
                <rect
                  key={`icsp-${col}-${row}`}
                  x={3 + col * 7}
                  y={3 + row * 6}
                  width="4"
                  height="4"
                  fill={`url(#goldGradient-${id})`}
                />
              ))
            )}
            <text x="11" y="-3" textAnchor="middle" fill="#FFFFFF" fontSize="5">
              ICSP
            </text>
          </g>

          {/* Arduino Logo */}
          <text
            x={BOARD_WIDTH / 2 - 20}
            y="75"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="10"
            fontWeight="bold"
            letterSpacing="1"
          >
            ARDUINO
          </text>
          <text
            x={BOARD_WIDTH / 2 - 20}
            y="84"
            textAnchor="middle"
            fill="#CCCCCC"
            fontSize="7"
            letterSpacing="0.5"
          >
            UNO
          </text>

          {/* Pin Header Backgrounds */}
          <rect
            x={BOARD_WIDTH - 30}
            y="15"
            width="22"
            height="140"
            fill="#2A2A2A"
            rx="1"
          />
          <rect x="8" y="85" width="22" height="52" fill="#2A2A2A" rx="1" />
          <rect
            x="130"
            y={BOARD_HEIGHT - 30}
            width="55"
            height="22"
            fill="#2A2A2A"
            rx="1"
          />

          {/* Digital Pin Sockets & Labels */}
          {digitalPins.map((pin, i) => (
            <g key={pin.id}>
              <rect
                x={BOARD_WIDTH - 26}
                y={20 + i * 8.5}
                width="14"
                height="6"
                fill={`url(#goldGradient-${id})`}
                rx="0.5"
              />
              <rect
                x={BOARD_WIDTH - 24}
                y={21.5 + i * 8.5}
                width="10"
                height="3"
                fill="#1A1A1A"
              />
              <text
                x={BOARD_WIDTH - 35}
                y={25 + i * 8.5}
                textAnchor="end"
                fill="#FFFFFF"
                fontSize="5"
                fontWeight="bold"
              >
                {pin.label}
              </text>
              {pin.pwm && (
                <text
                  x={BOARD_WIDTH - 55}
                  y={25 + i * 8.5}
                  textAnchor="end"
                  fill="#FFD700"
                  fontSize="5"
                >
                  ~
                </text>
              )}
              {pin.special && (
                <text
                  x={BOARD_WIDTH - 55}
                  y={25 + i * 8.5}
                  textAnchor="end"
                  fill="#999999"
                  fontSize="4"
                >
                  {pin.special}
                </text>
              )}
            </g>
          ))}

          {/* Power Pin Sockets & Labels */}
          {powerPins.map((pin, i) => (
            <g key={pin.id}>
              <rect
                x={12}
                y={90 + i * 8}
                width="14"
                height="6"
                fill={`url(#goldGradient-${id})`}
                rx="0.5"
              />
              <rect
                x={14}
                y={91.5 + i * 8}
                width="10"
                height="3"
                fill="#1A1A1A"
              />
              <text
                x={32}
                y={95 + i * 8}
                textAnchor="start"
                fill={pin.color}
                fontSize="5"
                fontWeight="bold"
              >
                {pin.label}
              </text>
            </g>
          ))}

          {/* Analog Pin Sockets & Labels */}
          {analogPins.map((pin, i) => (
            <g key={pin.id}>
              <rect
                x={135 + i * 8}
                y={BOARD_HEIGHT - 26}
                width="6"
                height="14"
                fill={`url(#goldGradient-${id})`}
                rx="0.5"
              />
              <rect
                x={136.5 + i * 8}
                y={BOARD_HEIGHT - 24}
                width="3"
                height="10"
                fill="#1A1A1A"
              />
              <text
                x={138 + i * 8}
                y={BOARD_HEIGHT - 32}
                textAnchor="middle"
                fill="#22c55e"
                fontSize="5"
                fontWeight="bold"
              >
                {pin.label}
              </text>
            </g>
          ))}

          {/* Section Labels */}
          <text x="48" y="82" fill="#AAAAAA" fontSize="4">
            POWER
          </text>
          <text x={BOARD_WIDTH - 50} y="12" fill="#AAAAAA" fontSize="4">
            DIGITAL (PWM~)
          </text>
          <text x="155" y={BOARD_HEIGHT - 5} fill="#AAAAAA" fontSize="4">
            ANALOG IN
          </text>
          <text
            x={BOARD_WIDTH / 2}
            y={BOARD_HEIGHT - 50}
            textAnchor="middle"
            fill="#AAAAAA"
            fontSize="4"
            letterSpacing="0.5"
          >
            www.arduino.cc
          </text>
        </svg>

        {/* React Flow Handles - Digital Pins (Right side) */}
        {digitalPins.map((pin, i) => (
          <Handle
            key={`handle-${pin.id}`}
            type="source"
            position={Position.Right}
            id={pin.id}
            style={{
              top: 23 + i * 8.5,
              right: -4,
              width: 8,
              height: 8,
              background: "#DAA520",
              border: "2px solid #B8860B",
              borderRadius: 2,
            }}
          />
        ))}

        {/* React Flow Handles - Power Pins (Left side) */}
        {powerPins.map((pin, i) => (
          <Handle
            key={`handle-${pin.id}`}
            type="source"
            position={Position.Left}
            id={pin.id}
            style={{
              top: 93 + i * 8,
              left: -4,
              width: 8,
              height: 8,
              background: pin.color,
              border: "2px solid #666",
              borderRadius: 2,
            }}
          />
        ))}

        {/* React Flow Handles - Analog Pins (Bottom) */}
        {analogPins.map((pin, i) => (
          <Handle
            key={`handle-${pin.id}`}
            type="source"
            position={Position.Bottom}
            id={pin.id}
            style={{
              bottom: -4,
              left: 138 + i * 8,
              width: 8,
              height: 8,
              background: "#22c55e",
              border: "2px solid #16a34a",
              borderRadius: 2,
            }}
          />
        ))}
      </div>
    </>
  );
}