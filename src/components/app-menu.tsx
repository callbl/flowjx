import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "./ui/dropdown-menu";
import { MenuIcon, DownloadIcon, UploadIcon, CheckIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  serializeCircuitFile,
  parseCircuitFile,
  CircuitFileParseError,
} from "@/persistence/circuit-file";
import { downloadTextFile } from "@/persistence/download";
import { useReactFlow } from "@xyflow/react";
import { useRef, useState, useEffect } from "react";
import {
  useCircuitActions,
  useSetEdges,
  useSetNodes,
} from "@/hooks/use-circuit";
import { useTheme } from "./providers/theme-provider";

const AppMenu = () => {
  const setNodes = useSetNodes();
  const setEdges = useSetEdges();
  const { logConnections, runSimulation } = useCircuitActions();
  const { theme, setTheme } = useTheme();
  // React Flow instance for toObject() and setViewport()
  const { toObject, setViewport } = useReactFlow();

  // File input ref for import
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Import error state
  const [importError, setImportError] = useState<string | null>(null);

  // Auto-log connections every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      logConnections();
    }, 10000);

    return () => clearInterval(interval);
  }, [logConnections]);

  // Clear import error after 5 seconds
  useEffect(() => {
    if (importError) {
      const timeout = setTimeout(() => setImportError(null), 5000);
      return () => clearTimeout(timeout);
    }
  }, [importError]);

  // Export handler
  const handleExport = () => {
    const flow = toObject();
    const circuitFile = serializeCircuitFile(flow);
    const json = JSON.stringify(circuitFile, null, 2);
    const filename = `diagram-${Date.now()}.flowjx`;

    downloadTextFile({
      filename,
      text: json,
      mimeType: "application/json",
    });
  };

  // Import handler
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const circuitFile = parseCircuitFile(text);

      // Restore nodes and edges
      setNodes(circuitFile.flow.nodes || []);
      setEdges(circuitFile.flow.edges || []);

      // Restore viewport with defaults if missing
      const viewport = circuitFile.flow.viewport || { x: 0, y: 0, zoom: 1 };
      setViewport(viewport);

      // Run simulation to update LED states
      runSimulation();

      setImportError(null);
    } catch (error) {
      if (error instanceof CircuitFileParseError) {
        setImportError(error.message);
      } else {
        setImportError("Failed to load circuit file");
      }
    } finally {
      // Reset file input so the same file can be imported again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Trigger file input click
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="shadow-lg"
            size="icon"
            variant="secondary"
            title="Menu"
          >
            <MenuIcon />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            {/* Theme */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <span className="flex-1">Light</span>
                    {theme === "light" && <CheckIcon />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <span className="flex-1">Dark</span>
                    {theme === "dark" && <CheckIcon />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    <span className="flex-1">System</span>
                    {theme === "system" && <CheckIcon />}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleExport}>
              <DownloadIcon />
              Export
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleImportClick}>
              <UploadIcon />
              Import
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".flowjx,application/json"
        onChange={handleImport}
        style={{ display: "none" }}
      />

      {/* Import Error Message */}
      {importError && (
        <div className="bg-red-500 text-white text-xs p-2 rounded shadow-lg max-w-[200px]">
          {importError}
        </div>
      )}
    </div>
  );
};

AppMenu.displayName = "AppMenu";
export default AppMenu;
