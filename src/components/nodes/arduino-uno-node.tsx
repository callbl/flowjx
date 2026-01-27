import React from "react";
import { type NodeProps } from "@xyflow/react";
import type { ArduinoUnoData } from "@/circuit/catalog";
import { BlueprintNode } from "./blueprint-node";
import { arduinoUnoNodeConfig } from "./config";
import { useArduinoStore } from "@/arduino/store";

export function ArduinoUnoNode(props: NodeProps) {
  const data = props.data as unknown as ArduinoUnoData;
  const isPowered = data?.isPowered || false;

  // Get Arduino runtime state to show TX/RX and pin 13 LED
  const isRunning = useArduinoStore?.((state) => state.isRunning) || false;
  const pinStates = useArduinoStore?.((state) => state.pinStates) || new Map();

  // Check if pin 13 is HIGH
  const pin13State = pinStates.get('d13');
  const pin13High = pin13State?.value === 1 || pin13State?.value === 255;

  // TX/RX blink simulation when running
  const [txBlink, setTxBlink] = React.useState(false);
  const [rxBlink, setRxBlink] = React.useState(false);

  React.useEffect(() => {
    if (!isRunning) return;

    // Simulate TX/RX activity when running
    const interval = setInterval(() => {
      setTxBlink(Math.random() > 0.7);
      setRxBlink(Math.random() > 0.8);
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <BlueprintNode {...props} config={arduinoUnoNodeConfig}>
      <div className="flex flex-col gap-2 p-2">
        {/* Arduino Board - Exact replica of Arduino Uno R3 */}
        <div className="flex justify-center">
          <div className="relative" style={{ width: '53mm', height: '68mm', transform: 'scale(0.7)' }}>
            {/* Main PCB - Authentic Arduino blue */}
            <div
              className="absolute inset-0 rounded-sm shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #00979C 0%, #008B96 100%)',
                border: '1px solid #006D74'
              }}
            >
              {/* Mounting holes */}
              <div className="absolute w-3 h-3 rounded-full bg-gray-900 border border-gray-700" style={{ top: '3mm', left: '3mm' }} />
              <div className="absolute w-3 h-3 rounded-full bg-gray-900 border border-gray-700" style={{ top: '3mm', right: '3mm' }} />
              <div className="absolute w-3 h-3 rounded-full bg-gray-900 border border-gray-700" style={{ bottom: '3mm', left: '3mm' }} />
              <div className="absolute w-3 h-3 rounded-full bg-gray-900 border border-gray-700" style={{ bottom: '3mm', right: '33mm' }} />

              {/* USB Port - Silver metallic */}
              <div
                className="absolute rounded-sm shadow-md"
                style={{
                  top: '-2mm',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '12mm',
                  height: '5mm',
                  background: 'linear-gradient(to bottom, #D4D4D8 0%, #A1A1AA 100%)',
                  border: '0.5px solid #71717A'
                }}
              >
                <div
                  className="absolute inset-x-1 bottom-0.5 rounded-sm"
                  style={{
                    height: '2mm',
                    background: '#18181B'
                  }}
                />
              </div>

              {/* Power Jack - Black */}
              <div
                className="absolute rounded-sm"
                style={{
                  top: '-1.5mm',
                  left: '4mm',
                  width: '9mm',
                  height: '5mm',
                  background: '#18181B',
                  border: '0.5px solid #3F3F46'
                }}
              />

              {/* Reset button - Blue */}
              <div
                className="absolute rounded-sm shadow-inner"
                style={{
                  top: '5mm',
                  right: '4mm',
                  width: '4mm',
                  height: '4mm',
                  background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                  border: '0.5px solid #1E40AF'
                }}
              />

              {/* ATmega328P - Main chip */}
              <div
                className="absolute flex items-center justify-center font-mono text-center"
                style={{
                  top: '22mm',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '20mm',
                  height: '28mm',
                  background: '#0A0A0A',
                  border: '0.5px solid #27272A',
                  borderRadius: '1mm'
                }}
              >
                <div style={{ fontSize: '5px', color: '#71717A', lineHeight: '1.2' }}>
                  ATMEL
                  <br />
                  ATmega328P
                  <br />
                  <span style={{ fontSize: '4px' }}>AU1722</span>
                </div>
                {/* Chip notch */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 rounded-b-sm"
                  style={{
                    width: '2mm',
                    height: '1mm',
                    background: '#18181B'
                  }}
                />
              </div>

              {/* 16MHz Crystal */}
              <div
                className="absolute rounded-sm shadow-sm"
                style={{
                  top: '32mm',
                  right: '9mm',
                  width: '4mm',
                  height: '8mm',
                  background: 'linear-gradient(to bottom, #E4E4E7 0%, #D4D4D8 100%)',
                  border: '0.5px solid #A1A1AA'
                }}
              />

              {/* Voltage Regulator */}
              <div
                className="absolute"
                style={{
                  top: '8mm',
                  left: '7mm',
                  width: '7mm',
                  height: '10mm',
                  background: '#0A0A0A',
                  border: '0.5px solid #27272A',
                  borderRadius: '0.5mm'
                }}
              >
                <div
                  className="absolute inset-x-0.5 top-0.5"
                  style={{
                    height: '1mm',
                    background: '#3F3F46'
                  }}
                />
              </div>

              {/* Capacitors - Yellow */}
              <div
                className="absolute rounded-full"
                style={{
                  top: '27mm',
                  right: '13mm',
                  width: '2.5mm',
                  height: '4mm',
                  background: 'linear-gradient(to bottom, #FDE047 0%, #FACC15 100%)',
                  border: '0.5px solid #CA8A04'
                }}
              />
              <div
                className="absolute rounded-full"
                style={{
                  top: '32mm',
                  right: '13mm',
                  width: '2.5mm',
                  height: '4mm',
                  background: 'linear-gradient(to bottom, #FDE047 0%, #FACC15 100%)',
                  border: '0.5px solid #CA8A04'
                }}
              />

              {/* ATmega16U2 - USB chip */}
              <div
                className="absolute flex items-center justify-center font-mono"
                style={{
                  top: '8mm',
                  right: '7mm',
                  width: '11mm',
                  height: '11mm',
                  background: '#0A0A0A',
                  border: '0.5px solid #27272A',
                  borderRadius: '0.5mm',
                  fontSize: '4px',
                  color: '#52525B'
                }}
              >
                16U2
              </div>

              {/* Status LEDs - Top left area */}
              <div
                className="absolute flex flex-col"
                style={{
                  top: '10mm',
                  left: '4mm',
                  gap: '1.5mm'
                }}
              >
                {/* ON - Power LED (Green) */}
                <div className="flex items-center" style={{ gap: '1mm' }}>
                  <div
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: '2mm',
                      height: '2mm',
                      background: isPowered || isRunning ? '#4ADE80' : '#166534',
                      boxShadow: isPowered || isRunning
                        ? '0 0 4px #4ADE80, 0 0 8px #4ADE80'
                        : 'none'
                    }}
                  />
                  <span style={{ fontSize: '5px', color: '#FAFAFA', fontWeight: 'bold' }}>ON</span>
                </div>

                {/* L - Pin 13 LED (Orange) */}
                <div className="flex items-center" style={{ gap: '1mm' }}>
                  <div
                    className="rounded-full transition-all duration-100"
                    style={{
                      width: '2mm',
                      height: '2mm',
                      background: pin13High ? '#FB923C' : '#7C2D12',
                      boxShadow: pin13High
                        ? '0 0 4px #FB923C, 0 0 8px #FB923C'
                        : 'none'
                    }}
                  />
                  <span style={{ fontSize: '5px', color: '#FAFAFA', fontWeight: 'bold' }}>L</span>
                </div>

                {/* TX - Serial transmit (Yellow) */}
                <div className="flex items-center" style={{ gap: '1mm' }}>
                  <div
                    className="rounded-full transition-all duration-75"
                    style={{
                      width: '1.5mm',
                      height: '1.5mm',
                      background: txBlink && isRunning ? '#FDE047' : '#713F12',
                      boxShadow: txBlink && isRunning
                        ? '0 0 3px #FDE047'
                        : 'none'
                    }}
                  />
                  <span style={{ fontSize: '5px', color: '#FAFAFA', fontWeight: 'bold' }}>TX</span>
                </div>

                {/* RX - Serial receive (Yellow) */}
                <div className="flex items-center" style={{ gap: '1mm' }}>
                  <div
                    className="rounded-full transition-all duration-75"
                    style={{
                      width: '1.5mm',
                      height: '1.5mm',
                      background: rxBlink && isRunning ? '#FDE047' : '#713F12',
                      boxShadow: rxBlink && isRunning
                        ? '0 0 3px #FDE047'
                        : 'none'
                    }}
                  />
                  <span style={{ fontSize: '5px', color: '#FAFAFA', fontWeight: 'bold' }}>RX</span>
                </div>
              </div>

              {/* Pin Headers - Left Side (Power) */}
              <div
                className="absolute flex flex-col"
                style={{
                  left: '-1mm',
                  top: '13mm',
                  gap: '2.54mm' // Standard 2.54mm pitch
                }}
              >
                {[...Array(8)].map((_, i) => (
                  <div
                    key={`power-${i}`}
                    style={{
                      width: '2.5mm',
                      height: '2.5mm',
                      background: '#0A0A0A',
                      border: '0.3px solid #3F3F46'
                    }}
                  />
                ))}
              </div>

              {/* Pin Headers - Right Side (Digital) */}
              <div
                className="absolute flex flex-col"
                style={{
                  right: '-1mm',
                  top: '5mm',
                  gap: '2.54mm'
                }}
              >
                {[...Array(14)].map((_, i) => (
                  <div
                    key={`digital-${i}`}
                    style={{
                      width: '2.5mm',
                      height: '2.5mm',
                      background: '#0A0A0A',
                      border: '0.3px solid #3F3F46'
                    }}
                  />
                ))}
              </div>

              {/* Pin Headers - Bottom (Analog) */}
              <div
                className="absolute flex"
                style={{
                  bottom: '-1mm',
                  left: '9mm',
                  gap: '2.54mm'
                }}
              >
                {[...Array(6)].map((_, i) => (
                  <div
                    key={`analog-${i}`}
                    style={{
                      width: '2.5mm',
                      height: '2.5mm',
                      background: '#0A0A0A',
                      border: '0.3px solid #3F3F46'
                    }}
                  />
                ))}
              </div>

              {/* ICSP Header */}
              <div
                className="absolute grid grid-cols-2"
                style={{
                  top: '15mm',
                  right: '5mm',
                  gap: '1mm'
                }}
              >
                {[...Array(6)].map((_, i) => (
                  <div
                    key={`icsp-${i}`}
                    style={{
                      width: '1.5mm',
                      height: '1.5mm',
                      background: '#0A0A0A',
                      border: '0.3px solid #3F3F46'
                    }}
                  />
                ))}
              </div>

              {/* Arduino Logo & Text */}
              <div
                className="absolute text-center"
                style={{
                  bottom: '4mm',
                  left: '50%',
                  transform: 'translateX(-50%)'
                }}
              >
                <div style={{
                  fontSize: '9px',
                  color: '#FAFAFA',
                  fontWeight: '800',
                  letterSpacing: '0.5px',
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                }}>
                  ARDUINO
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#FAFAFA',
                  fontWeight: '900',
                  letterSpacing: '1px',
                  textShadow: '0 1px 3px rgba(0,0,0,0.5)'
                }}>
                  UNO
                </div>
                <div style={{
                  fontSize: '6px',
                  color: '#E4E4E7',
                  marginTop: '-1px'
                }}>
                  www.arduino.cc
                </div>
              </div>

              {/* Made in Italy */}
              <div
                className="absolute"
                style={{
                  bottom: '4mm',
                  left: '4mm',
                  fontSize: '4px',
                  color: '#E4E4E7'
                }}
              >
                MADE IN ITALY
              </div>

              {/* PCB traces */}
              <svg className="absolute inset-0 opacity-10 pointer-events-none" style={{ mixBlendMode: 'overlay' }}>
                <line x1="20" y1="60" x2="50" y2="60" stroke="#FFFFFF" strokeWidth="0.5" />
                <line x1="35" y1="60" x2="35" y2="90" stroke="#FFFFFF" strokeWidth="0.5" />
                <line x1="60" y1="80" x2="90" y2="80" stroke="#FFFFFF" strokeWidth="0.5" />
                <line x1="100" y1="40" x2="120" y2="40" stroke="#FFFFFF" strokeWidth="0.5" />
              </svg>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="text-center">
          <div className="text-[9px] text-gray-500 dark:text-gray-400 font-mono">
            ATmega328P | 16MHz | 5V | 32KB Flash
          </div>
        </div>
      </div>
    </BlueprintNode>
  );
}
