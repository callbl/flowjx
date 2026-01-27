// Arduino C/C++ to JavaScript transpiler

import type { TranspileResult, BoardConfig } from "./types";

export class ArduinoInterpreter {
  private boardConfig: BoardConfig;
  private warnings: string[] = [];

  constructor(boardConfig: BoardConfig) {
    this.boardConfig = boardConfig;
  }

  /**
   * Transpile Arduino C/C++ code to executable JavaScript
   */
  transpile(code: string): TranspileResult {
    this.warnings = [];

    try {
      // Multi-pass transpilation pipeline
      let processed = code;

      // 1. Remove comments
      processed = this.removeComments(processed);

      // 2. Process preprocessor directives
      processed = this.processPreprocessor(processed);

      // 3. Convert types
      processed = this.convertTypes(processed);

      // 4. Convert functions
      processed = this.convertFunctions(processed);

      // 5. Convert control structures
      processed = this.convertControlStructures(processed);

      // 6. Convert Arduino-specific syntax
      processed = this.convertArduinoSyntax(processed);

      // 7. Parse program structure (setup, loop, globals)
      const program = this.parseProgram(processed);

      // 8. Generate executable JavaScript
      const jsCode = this.generateJavaScript(program);

      return {
        success: true,
        code: jsCode,
        warnings: this.warnings.length > 0 ? this.warnings : undefined,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown transpilation error",
      };
    }
  }

  /**
   * Remove single-line and multi-line comments
   */
  private removeComments(code: string): string {
    // Remove multi-line comments /* ... */
    code = code.replace(/\/\*[\s\S]*?\*\//g, "");
    // Remove single-line comments //
    code = code.replace(/\/\/.*/g, "");
    return code;
  }

  /**
   * Process preprocessor directives (#define, #include, etc.)
   */
  private processPreprocessor(code: string): string {
    const lines = code.split("\n");
    const processed: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();

      // Handle #define
      if (trimmed.startsWith("#define")) {
        const match = trimmed.match(/#define\s+(\w+)\s+(.+)/);
        if (match) {
          const [, name, value] = match;
          processed.push(`const ${name} = ${value};`);
          continue;
        }
      }

      // Handle #include - remove (Arduino API is built-in)
      if (trimmed.startsWith("#include")) {
        this.warnings.push(`Ignoring ${trimmed} - Arduino API is built-in`);
        continue;
      }

      // Handle #ifdef, #ifndef, #endif - remove and warn
      if (
        trimmed.startsWith("#ifdef") ||
        trimmed.startsWith("#ifndef") ||
        trimmed.startsWith("#endif") ||
        trimmed.startsWith("#else")
      ) {
        this.warnings.push(`Ignoring conditional compilation directive: ${trimmed}`);
        continue;
      }

      processed.push(line);
    }

    return processed.join("\n");
  }

  /**
   * Convert Arduino types to JavaScript
   */
  private convertTypes(code: string): string {
    // Type mappings
    const typeReplacements: [RegExp, string][] = [
      // Variable declarations with initialization
      [/\bint\s+(\w+)\s*=\s*([^;]+);/g, "let $1 = $2;"],
      [/\blong\s+(\w+)\s*=\s*([^;]+);/g, "let $1 = $2;"],
      [/\bbyte\s+(\w+)\s*=\s*([^;]+);/g, "let $1 = $2;"],
      [/\bboolean\s+(\w+)\s*=\s*([^;]+);/g, "let $1 = $2;"],
      [/\bfloat\s+(\w+)\s*=\s*([^;]+);/g, "let $1 = $2;"],
      [/\bdouble\s+(\w+)\s*=\s*([^;]+);/g, "let $1 = $2;"],
      [/\bString\s+(\w+)\s*=\s*([^;]+);/g, "let $1 = $2;"],

      // Variable declarations without initialization
      [/\bint\s+(\w+);/g, "let $1;"],
      [/\blong\s+(\w+);/g, "let $1;"],
      [/\bbyte\s+(\w+);/g, "let $1;"],
      [/\bboolean\s+(\w+);/g, "let $1;"],
      [/\bfloat\s+(\w+);/g, "let $1;"],
      [/\bdouble\s+(\w+);/g, "let $1;"],
      [/\bString\s+(\w+);/g, "let $1;"],

      // Const declarations
      [/\bconst\s+int\s+/g, "const "],
      [/\bconst\s+long\s+/g, "const "],
      [/\bconst\s+byte\s+/g, "const "],
      [/\bconst\s+float\s+/g, "const "],

      // Array declarations with initialization
      [/\bint\s+(\w+)\[\]\s*=\s*\{([^}]+)\};/g, "let $1 = [$2];"],
      [/\bbyte\s+(\w+)\[\]\s*=\s*\{([^}]+)\};/g, "let $1 = [$2];"],

      // Array declarations with size
      [/\bint\s+(\w+)\[(\d+)\];/g, "let $1 = new Array($2).fill(0);"],
      [/\bbyte\s+(\w+)\[(\d+)\];/g, "let $1 = new Array($2).fill(0);"],

      // unsigned types (treat as regular for JS)
      [/\bunsigned\s+int\s+/g, "let "],
      [/\bunsigned\s+long\s+/g, "let "],
    ];

    for (const [pattern, replacement] of typeReplacements) {
      code = code.replace(pattern, replacement);
    }

    return code;
  }

  /**
   * Convert function declarations
   */
  private convertFunctions(code: string): string {
    // Convert void functions: void funcName() { → function funcName() {
    code = code.replace(/\bvoid\s+(\w+)\s*\(/g, "function $1(");

    // Convert typed functions: int funcName(int x) { → function funcName(x) {
    code = code.replace(/\b(?:int|long|byte|float|double|boolean|String)\s+(\w+)\s*\(([^)]*)\)/g,
      (match, funcName, params) => {
        // Remove type annotations from parameters
        const cleanParams = params.replace(/\b(?:int|long|byte|float|double|boolean|String)\s+/g, "");
        return `function ${funcName}(${cleanParams})`;
      });

    return code;
  }

  /**
   * Convert control structures
   */
  private convertControlStructures(code: string): string {
    // Convert for loops: for (int i = 0; i < n; i++) → for (let i = 0; i < n; i++)
    code = code.replace(/for\s*\(\s*int\s+/g, "for (let ");
    code = code.replace(/for\s*\(\s*byte\s+/g, "for (let ");

    return code;
  }

  /**
   * Convert Arduino-specific syntax
   */
  private convertArduinoSyntax(code: string): string {
    // Async timing functions
    code = code.replace(/\bdelay\s*\(/g, "await delay(");
    code = code.replace(/\bdelayMicroseconds\s*\(/g, "await delayMicroseconds(");

    // Bit operations
    code = code.replace(/\bbitRead\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/g, "(($1 >> $2) & 1)");
    code = code.replace(/\bbitWrite\s*\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^)]+)\s*\)/g,
      "($1 = $3 ? ($1 | (1 << $2)) : ($1 & ~(1 << $2)))");
    code = code.replace(/\bbitSet\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/g, "($1 |= (1 << $2))");
    code = code.replace(/\bbitClear\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/g, "($1 &= ~(1 << $2))");

    // Byte operations
    code = code.replace(/\blowByte\s*\(/g, "(");
    code = code.replace(/\bhighByte\s*\(/g, "((");
    code = code.replace(/lowByte\s*\(([^)]+)\)/g, "($1 & 0xFF)");
    code = code.replace(/highByte\s*\(([^)]+)\)/g, "(($1 >> 8) & 0xFF)");

    // sizeof → length
    code = code.replace(/\bsizeof\s*\(\s*([^)]+)\s*\)/g, "$1.length");

    // Character literals to char codes
    code = code.replace(/'([^'])'/g, "'$1'.charCodeAt(0)");

    return code;
  }

  /**
   * Parse program structure to extract setup(), loop(), and global code
   */
  private parseProgram(code: string): { globals: string; setup: string; loop: string } {
    const setupMatch = code.match(/function\s+setup\s*\(\s*\)\s*{([^]*?)^}/m);
    const loopMatch = code.match(/function\s+loop\s*\(\s*\)\s*{([^]*?)^}/m);

    if (!setupMatch) {
      throw new Error("setup() function not found");
    }
    if (!loopMatch) {
      throw new Error("loop() function not found");
    }

    const setup = setupMatch[1].trim();
    const loop = loopMatch[1].trim();

    // Extract global code (everything outside setup and loop)
    let globals = code;
    globals = globals.replace(/function\s+setup\s*\(\s*\)\s*{[^]*?^}/m, "");
    globals = globals.replace(/function\s+loop\s*\(\s*\)\s*{[^]*?^}/m, "");
    globals = globals.trim();

    return { globals, setup, loop };
  }

  /**
   * Generate executable JavaScript code
   */
  private generateJavaScript(program: { globals: string; setup: string; loop: string }): string {
    return `
// ===== Global Variables and Functions =====
${program.globals}

// ===== Setup Function =====
function __setup__() {
${program.setup}
}

// ===== Loop Function (async for delay support) =====
async function __loop__() {
${program.loop}
}

// Return execution context
return { setup: __setup__, loop: __loop__ };
`.trim();
  }
}
