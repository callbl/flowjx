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
      <div className="flex flex-col gap-2 p-3">
        {/* Arduino Board Visual - Realistic Design */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Main PCB board */}
            <div className="w-48 h-64 bg-gradient-to-br from-[#0a6b8f] via-[#0c7fa6] to-[#0a6b8f] rounded-md border-2 border-[#084a61] shadow-2xl relative overflow-visible">

              {/* USB Port */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-5 bg-gradient-to-b from-gray-200 to-gray-300 rounded-sm border border-gray-400 shadow-md">
                <div className="absolute inset-x-1 bottom-1 h-2 bg-gray-800 rounded-[1px]" />
              </div>

              {/* Power Jack */}
              <div className="absolute -top-2 left-3 w-8 h-4 bg-gray-900 rounded-sm border border-gray-700" />

              {/* Reset Button */}
              <div className="absolute top-4 right-3 w-4 h-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-sm border border-blue-800 shadow-inner" />

              {/* ATmega328P Chip */}
              <div className="absolute top-20 left-1/2 -translate-x-1/2 w-20 h-24 bg-gray-950 rounded-sm border border-gray-800 flex items-center justify-center shadow-lg">
                <div className="text-[7px] text-gray-400 font-mono text-center leading-tight">
                  ATMEL
                  <br />
                  ATmega328P
                  <br />
                  <span className="text-[6px]">PDIP-28</span>
                </div>
                {/* Chip notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-1 bg-gray-800 rounded-b-sm" />
              </div>

              {/* Voltage Regulator */}
              <div className="absolute top-6 left-6 w-6 h-8 bg-gray-900 rounded-sm border border-gray-700">
                <div className="absolute inset-x-0.5 top-0.5 h-1 bg-gray-700" />
              </div>

              {/* Crystal Oscillator */}
              <div className="absolute top-32 right-8 w-3 h-6 bg-gradient-to-br from-gray-300 to-gray-400 rounded-sm border border-gray-500 shadow-sm" />

              {/* Capacitors */}
              <div className="absolute top-28 right-12 w-2 h-3 bg-yellow-600 rounded-full border border-yellow-800" />
              <div className="absolute top-32 right-12 w-2 h-3 bg-yellow-600 rounded-full border border-yellow-800" />

              {/* Status LEDs with Labels */}
              <div className="absolute top-8 left-3 flex flex-col gap-1">
                {/* ON LED - Power */}
                <div className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      isPowered || isRunning
                        ? "bg-green-400 shadow-[0_0_10px_#4ade80,0_0_20px_#4ade80]"
                        : "bg-green-900 shadow-none"
                    }`}
                  />
                  <span className="text-[6px] text-white font-bold">ON</span>
                </div>

                {/* L LED - Pin 13 */}
                <div className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full transition-all duration-100 ${
                      pin13High
                        ? "bg-orange-400 shadow-[0_0_10px_#fb923c,0_0_18px_#fb923c]"
                        : "bg-orange-900 shadow-none"
                    }`}
                  />
                  <span className="text-[6px] text-white font-bold">L</span>
                </div>

                {/* TX LED */}
                <div className="flex items-center gap-1">
                  <div
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-75 ${
                      txBlink && isRunning
                        ? "bg-yellow-300 shadow-[0_0_8px_#fbbf24]"
                        : "bg-yellow-900 shadow-none"
                    }`}
                  />
                  <span className="text-[6px] text-white font-bold">TX</span>
                </div>

                {/* RX LED */}
                <div className="flex items-center gap-1">
                  <div
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-75 ${
                      rxBlink && isRunning
                        ? "bg-yellow-300 shadow-[0_0_8px_#fbbf24]"
                        : "bg-yellow-900 shadow-none"
                    }`}
                  />
                  <span className="text-[6px] text-white font-bold">RX</span>
                </div>
              </div>

              {/* Pin Headers - Power (Left Side) */}
              <div className="absolute left-0 top-12 flex flex-col gap-[3px] -translate-x-[3px]">
                {[...Array(8)].map((_, i) => (
                  <div key={`power-${i}`} className="w-2.5 h-2 bg-gray-950 border border-gray-800 shadow-sm" />
                ))}
              </div>

              {/* Pin Headers - Digital (Right Side) */}
              <div className="absolute right-0 top-4 flex flex-col gap-[3px] translate-x-[3px]">
                {[...Array(14)].map((_, i) => (
                  <div key={`digital-${i}`} className="w-2.5 h-2 bg-gray-950 border border-gray-800 shadow-sm" />
                ))}
              </div>

              {/* Pin Headers - Analog (Bottom) */}
              <div className="absolute bottom-0 left-8 flex gap-[3px] translate-y-[3px]">
                {[...Array(6)].map((_, i) => (
                  <div key={`analog-${i}`} className="w-2 h-2.5 bg-gray-950 border border-gray-800 shadow-sm" />
                ))}
              </div>

              {/* ICSP Header */}
              <div className="absolute top-14 right-4 grid grid-cols-2 gap-[2px]">
                {[...Array(6)].map((_, i) => (
                  <div key={`icsp-${i}`} className="w-1.5 h-1.5 bg-gray-950 border border-gray-800" />
                ))}
              </div>

              {/* Arduino Logo & Text */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-center">
                <div className="text-[11px] text-white font-extrabold tracking-wider drop-shadow-md">
                  ARDUINO
                </div>
                <div className="text-[14px] text-white font-extrabold tracking-wide drop-shadow-lg">
                  UNO
                </div>
              </div>

              {/* Board traces (decorative) */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <svg width="100%" height="100%" className="absolute inset-0">
                  <line x1="20" y1="80" x2="60" y2="80" stroke="#a0d8ff" strokeWidth="0.5" />
                  <line x1="40" y1="80" x2="40" y2="120" stroke="#a0d8ff" strokeWidth="0.5" />
                  <line x1="80" y1="100" x2="120" y2="100" stroke="#a0d8ff" strokeWidth="0.5" />
                </svg>
              </div>

              {/* PCB mounting holes */}
              <div className="absolute top-2 left-2 w-3 h-3 rounded-full border-2 border-gray-800 bg-gray-900" />
              <div className="absolute top-2 right-2 w-3 h-3 rounded-full border-2 border-gray-800 bg-gray-900" />
              <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full border-2 border-gray-800 bg-gray-900" />
              <div className="absolute bottom-2 right-16 w-3 h-3 rounded-full border-2 border-gray-800 bg-gray-900" />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="text-center">
          <div className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">
            ATmega328P | 16MHz | 5V
          </div>
        </div>
      </div>
    </BlueprintNode>
  );
}
