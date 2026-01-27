import { type NodeProps } from "@xyflow/react";
import type { SevenSegmentData } from "@/circuit/catalog";
import { BlueprintNode } from "./blueprint-node";
import { sevenSegmentNodeConfig } from "./config";

export function SevenSegmentNode(props: NodeProps) {
  const data = props.data as unknown as SevenSegmentData;
  const isPowered = data?.isPowered || false;
  const digit = data?.digit ?? -1;
  const segments = data?.segments || {
    a: false,
    b: false,
    c: false,
    d: false,
    e: false,
    f: false,
    g: false,
    dp: false,
  };

  // Digit patterns for 0-9
  const digitPatterns: Record<number, Record<string, boolean>> = {
    0: { a: true, b: true, c: true, d: true, e: true, f: true, g: false, dp: false },
    1: { a: false, b: true, c: true, d: false, e: false, f: false, g: false, dp: false },
    2: { a: true, b: true, c: false, d: true, e: true, f: false, g: true, dp: false },
    3: { a: true, b: true, c: true, d: true, e: false, f: false, g: true, dp: false },
    4: { a: false, b: true, c: true, d: false, e: false, f: true, g: true, dp: false },
    5: { a: true, b: false, c: true, d: true, e: false, f: true, g: true, dp: false },
    6: { a: true, b: false, c: true, d: true, e: true, f: true, g: true, dp: false },
    7: { a: true, b: true, c: true, d: false, e: false, f: false, g: false, dp: false },
    8: { a: true, b: true, c: true, d: true, e: true, f: true, g: true, dp: false },
    9: { a: true, b: true, c: true, d: true, e: false, f: true, g: true, dp: false },
  };

  const activeSegments = digit >= 0 && digit <= 9 ? digitPatterns[digit] : segments;
  const isLit = isPowered && digit >= 0;

  const segmentClass = (active: boolean) =>
    `absolute transition-all ${
      isLit && active
        ? "bg-red-500 shadow-[0_0_8px_#ef4444]"
        : "bg-gray-800 dark:bg-gray-700"
    }`;

  return (
    <BlueprintNode {...props} config={sevenSegmentNodeConfig}>
      <div className="flex flex-col items-center gap-2 p-4">
        {/* 7-Segment Display */}
        <div className="relative w-24 h-32 bg-gray-950 rounded-lg border-2 border-gray-800 shadow-lg flex items-center justify-center">
          <div className="relative w-16 h-24">
            {/* Segment A (top) */}
            <div
              className={`${segmentClass(activeSegments.a)} left-2 top-0 w-12 h-2`}
              style={{ clipPath: "polygon(10% 0%, 90% 0%, 80% 100%, 20% 100%)" }}
            />

            {/* Segment B (top right) */}
            <div
              className={`${segmentClass(activeSegments.b)} right-0 top-2 w-2 h-9`}
              style={{ clipPath: "polygon(0% 10%, 100% 20%, 100% 80%, 0% 90%)" }}
            />

            {/* Segment C (bottom right) */}
            <div
              className={`${segmentClass(activeSegments.c)} right-0 bottom-2 w-2 h-9`}
              style={{ clipPath: "polygon(0% 10%, 100% 20%, 100% 80%, 0% 90%)" }}
            />

            {/* Segment D (bottom) */}
            <div
              className={`${segmentClass(activeSegments.d)} left-2 bottom-0 w-12 h-2`}
              style={{ clipPath: "polygon(20% 0%, 80% 0%, 90% 100%, 10% 100%)" }}
            />

            {/* Segment E (bottom left) */}
            <div
              className={`${segmentClass(activeSegments.e)} left-0 bottom-2 w-2 h-9`}
              style={{ clipPath: "polygon(100% 10%, 0% 20%, 0% 80%, 100% 90%)" }}
            />

            {/* Segment F (top left) */}
            <div
              className={`${segmentClass(activeSegments.f)} left-0 top-2 w-2 h-9`}
              style={{ clipPath: "polygon(100% 10%, 0% 20%, 0% 80%, 100% 90%)" }}
            />

            {/* Segment G (middle) */}
            <div
              className={`${segmentClass(activeSegments.g)} left-2 top-1/2 -translate-y-1/2 w-12 h-2`}
              style={{ clipPath: "polygon(15% 0%, 85% 0%, 75% 100%, 25% 100%)" }}
            />

            {/* Decimal Point */}
            <div
              className={`${segmentClass(activeSegments.dp)} -right-2 bottom-0 w-2 h-2 rounded-full`}
            />
          </div>
        </div>

        {/* Info */}
        <div className="text-center">
          <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {data.label}
          </div>
          {isPowered && digit >= 0 && (
            <div className="text-[10px] text-gray-500 dark:text-gray-400 font-mono mt-1">
              Digit: {digit}
            </div>
          )}
        </div>
      </div>
    </BlueprintNode>
  );
}
