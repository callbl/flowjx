import { Handle, Position, type NodeProps } from "@xyflow/react";
import { NodeToolbarContent } from "../node-toolbar-content";
import { type NodeConfig } from "./config";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BlueprintNodeProps extends NodeProps {
  config: NodeConfig;
  children?: React.ReactNode;
}

/**
 * Base Blueprint-style Node Component
 * Implements the visual design from Unreal Engine's Blueprint system
 */
export function BlueprintNode({
  id,
  selected,
  config,
  children,
}: BlueprintNodeProps) {
  const {
    title,
    subtitle,
    icon: Icon,
    handles,
    width = 200,
    height = 256,
  } = config;

  return (
    <>
      {selected && <NodeToolbarContent nodeId={id} />}
      <TooltipProvider>
        <div
          className={cn(
            "bg-card rounded-lg overflow-hidden transition-all border border-accent relative",
            selected && "border-primary/25",
          )}
          style={{
            width: `${width}px`,
            minHeight: `${height}px`,
            borderWidth: 2,
          }}
        >
          {/* Header */}
          <div className="px-3 py-2 flex items-center gap-4 bg-accent text-accent-foreground">
            <Icon className="size-4 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-xs truncate">{title}</div>
              {subtitle && (
                <div className="text-xs opacity-50 truncate">{subtitle}</div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="px-3 py-3 relative">{children}</div>

          {/* Handles with Labels */}
          {handles.map((handle, index) => {
            const topPosition = handle.offsetPercentage
              ? `${handle.offsetPercentage}%`
              : "50%";

            const isLeft = handle.position === Position.Left;
            const isRight = handle.position === Position.Right;

            const handleElement = (
              <div
                key={`${handle.type}-${handle.id}-${index}`}
                className="absolute pointer-events-none"
                style={{
                  top: topPosition,
                  transform: "translateY(-50%)",
                  left: isLeft ? "0" : undefined,
                  right: isRight ? "0" : undefined,
                }}
              >
                <div
                  className={cn(
                    "flex items-center gap-1",
                    isLeft && "flex-row",
                    isRight && "flex-row-reverse",
                  )}
                >
                  <Handle
                    type={handle.type}
                    position={handle.position}
                    id={handle.id}
                    style={{
                      position: "relative",
                      top: "auto",
                      left: "auto",
                      right: "auto",
                      transform: "none",
                    }}
                    className="bg-primary w-4 h-4 pointer-events-auto"
                  />
                  <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap px-1">
                    {handle.label}
                  </span>
                </div>
              </div>
            );

            if (handle.description) {
              return (
                <Tooltip key={`${handle.type}-${handle.id}-${index}`}>
                  <TooltipTrigger asChild>{handleElement}</TooltipTrigger>
                  <TooltipContent side={handle.position}>
                    <p>{handle.description}</p>
                  </TooltipContent>
                </Tooltip>
              );
            }

            return handleElement;
          })}
        </div>
      </TooltipProvider>
    </>
  );
}
