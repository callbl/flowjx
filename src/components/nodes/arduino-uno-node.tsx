import React from "react";
import { type NodeProps } from "@xyflow/react";
import type { ArduinoUnoData } from "@/circuit/catalog";
import { BlueprintNode } from "./blueprint-node";
import { arduinoUnoNodeConfig } from "./config";
import { useArduinoStore } from "@/arduino/store";

export function ArduinoUnoNode(props: NodeProps) {
  const data = props.data as unknown as ArduinoUnoData;
  const isPowered = data?.isPowered || false;

  // Get Arduino runtime state
  const isRunning = useArduinoStore?.((state) => state.isRunning) || false;
  const pinStates = useArduinoStore?.((state) => state.pinStates) || new Map();

  // Check if pin 13 is HIGH
  const pin13State = pinStates.get('d13');
  const pin13High = pin13State?.value === 1 || pin13State?.value === 255;

  // TX/RX blink when running
  const [txBlink, setTxBlink] = React.useState(false);
  const [rxBlink, setRxBlink] = React.useState(false);

  React.useEffect(() => {
    if (!isRunning) {
      setTxBlink(false);
      setRxBlink(false);
      return;
    }

    const interval = setInterval(() => {
      setTxBlink(Math.random() > 0.7);
      setRxBlink(Math.random() > 0.8);
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <BlueprintNode {...props} config={arduinoUnoNodeConfig}>
      <div className="flex flex-col gap-3 p-4">
        {/* Arduino Board */}
        <div className="flex justify-center">
          <div className="relative w-44 h-60">
            {/* Main PCB */}
            <div className="absolute inset-0 rounded-md shadow-2xl" style={{ background: 'linear-gradient(135deg, #00979C 0%, #008B96 100%)' }}>

              {/* USB Port */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-11 h-4 bg-gradient-to-b from-gray-200 to-gray-400 rounded-sm border border-gray-500 shadow-md">
                <div className="absolute inset-x-1 bottom-0.5 h-1.5 bg-gray-900 rounded-sm" />
              </div>

              {/* Power Jack */}
              <div className="absolute -top-1.5 left-3 w-8 h-4 bg-gray-900 rounded-sm border border-gray-700" />

              {/* Reset Button */}
              <div className="absolute top-4 right-3 w-4 h-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-sm border border-blue-800 shadow-inner" />

              {/* ATmega328P Chip */}
              <div className="absolute top-20 left-1/2 -translate-x-1/2 w-20 h-24 bg-gray-950 rounded border border-gray-800 flex items-center justify-center shadow-lg">
                <div className="text-[7px] text-gray-400 font-mono text-center leading-tight">
                  ATMEL<br />ATmega328P<br /><span className="text-[6px]">PDIP</span>
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-1 bg-gray-800 rounded-b-sm" />
              </div>

              {/* 16MHz Crystal */}
              <div className="absolute top-32 right-8 w-3 h-7 bg-gradient-to-b from-gray-200 to-gray-300 rounded-sm border border-gray-400 shadow-sm" />

              {/* Voltage Regulator */}
              <div className="absolute top-6 left-6 w-6 h-8 bg-gray-950 rounded-sm border border-gray-800">
                <div className="absolute inset-x-0.5 top-0.5 h-1 bg-gray-700" />
              </div>

              {/* Capacitors */}
              <div className="absolute top-28 right-12 w-2 h-3 rounded-full bg-gradient-to-b from-yellow-300 to-yellow-500 border border-yellow-700" />
              <div className="absolute top-32 right-12 w-2 h-3 rounded-full bg-gradient-to-b from-yellow-300 to-yellow-500 border border-yellow-700" />

              {/* ATmega16U2 USB Chip */}
              <div className="absolute top-8 right-7 w-11 h-11 bg-gray-950 rounded border border-gray-800 flex items-center justify-center font-mono text-[5px] text-gray-500">
                16U2
              </div>

              {/* Status LEDs */}
              <div className="absolute top-10 left-3 flex flex-col gap-1.5">
                {/* ON LED */}
                <div className="flex items-center gap-1">
                  <div
                    className="w-2 h-2 rounded-full transition-all"
                    style={{
                      background: isPowered || isRunning ? '#4ADE80' : '#166534',
                      boxShadow: isPowered || isRunning ? '0 0 8px #4ADE80' : 'none'
                    }}
                  />
                  <span className="text-[6px] text-white font-bold">ON</span>
                </div>

                {/* L LED (Pin 13) */}
                <div className="flex items-center gap-1">
                  <div
                    className="w-2 h-2 rounded-full transition-all duration-100"
                    style={{
                      background: pin13High ? '#FB923C' : '#7C2D12',
                      boxShadow: pin13High ? '0 0 8px #FB923C' : 'none'
                    }}
                  />
                  <span className="text-[6px] text-white font-bold">L</span>
                </div>

                {/* TX LED */}
                <div className="flex items-center gap-1">
                  <div
                    className="w-1.5 h-1.5 rounded-full transition-all"
                    style={{
                      background: txBlink && isRunning ? '#FDE047' : '#713F12',
                      boxShadow: txBlink && isRunning ? '0 0 6px #FDE047' : 'none'
                    }}
                  />
                  <span className="text-[6px] text-white font-bold">TX</span>
                </div>

                {/* RX LED */}
                <div className="flex items-center gap-1">
                  <div
                    className="w-1.5 h-1.5 rounded-full transition-all"
                    style={{
                      background: rxBlink && isRunning ? '#FDE047' : '#713F12',
                      boxShadow: rxBlink && isRunning ? '0 0 6px #FDE047' : 'none'
                    }}
                  />
                  <span className="text-[6px] text-white font-bold">RX</span>
                </div>
              </div>

              {/* Pin Headers - Left */}
              <div className="absolute left-0 top-12 flex flex-col gap-[3px] -translate-x-[3px]">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="w-2.5 h-2 bg-gray-950 border border-gray-800" />
                ))}
              </div>

              {/* Pin Headers - Right */}
              <div className="absolute right-0 top-4 flex flex-col gap-[3px] translate-x-[3px]">
                {[...Array(14)].map((_, i) => (
                  <div key={i} className="w-2.5 h-2 bg-gray-950 border border-gray-800" />
                ))}
              </div>

              {/* Pin Headers - Bottom */}
              <div className="absolute bottom-0 left-8 flex gap-[3px] translate-y-[3px]">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-2 h-2.5 bg-gray-950 border border-gray-800" />
                ))}
              </div>

              {/* ICSP Header */}
              <div className="absolute top-14 right-4 grid grid-cols-2 gap-[2px]">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 bg-gray-950 border border-gray-800" />
                ))}
              </div>

              {/* Mounting Holes */}
              <div className="absolute top-2 left-2 w-3 h-3 rounded-full border-2 border-gray-800 bg-gray-900" />
              <div className="absolute top-2 right-2 w-3 h-3 rounded-full border-2 border-gray-800 bg-gray-900" />
              <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full border-2 border-gray-800 bg-gray-900" />
              <div className="absolute bottom-2 right-28 w-3 h-3 rounded-full border-2 border-gray-800 bg-gray-900" />

              {/* Arduino Logo */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-center">
                <div className="text-[10px] text-white font-extrabold tracking-wide" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                  ARDUINO
                </div>
                <div className="text-[16px] text-white font-extrabold tracking-wider -mt-0.5" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                  UNO
                </div>
              </div>
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
