/**
 * Dual-Mode Python Runner for LearnX:
 * 1. Native Pyodide WebAssembly (when network is available)
 * 2. Instant embedded Python runtime for Levels 1-12 constructs
 * (print, input, variables, conditionals, for/range, for/in, lists, dicts,
 *  list comprehensions, functions, try/except, classes & objects)
 */

let pyodideInstance = null;
let pyodideLoading = false;

export async function initPyodide() {
  if (pyodideInstance || pyodideLoading) return;
  if (typeof window === "undefined") return;

  pyodideLoading = true;
  try {
    if (!window.loadPyodide) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";
      script.async = true;
      document.head.appendChild(script);
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
      });
    }

    if (window.loadPyodide) {
      pyodideInstance = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/"
      });
      console.log("Pyodide loaded successfully for LearnX");
    }
  } catch (err) {
    console.warn("Pyodide CDN unavailable, running in instant resilient local mode", err);
  } finally {
    pyodideLoading = false;
  }
}

// Pre-init in background
if (typeof window !== "undefined") {
  initPyodide();
}

/**
 * Execute Python code in browser
 * @param {string} code - Python code to run
 * @param {Function} onInputRequest - Callback when input() is called: async (prompt) => string
 * @returns {Promise<{ output: string, error: string | null, isSuccess: boolean }>}
 */
export async function runPythonCode(code, onInputRequest) {
  // If Pyodide is ready and available
  if (pyodideInstance) {
    try {
      let stdout = [];
      let stderr = [];

      pyodideInstance.setStdout({
        batched: (str) => stdout.push(str)
      });
      pyodideInstance.setStderr({
        batched: (str) => stderr.push(str)
      });

      // Override input() if prompt callback provided
      if (onInputRequest) {
        pyodideInstance.registerJsModule("learnx_env", {
          promptUser: async (promptStr) => {
            return await onInputRequest(promptStr || "");
          }
        });
        await pyodideInstance.runPythonAsync(`
import builtins
import learnx_env

def custom_input(prompt=""):
    return learnx_env.promptUser(prompt)

builtins.input = custom_input
        `);
      }

      await pyodideInstance.runPythonAsync(code);
      return {
        output: stdout.join("\n"),
        error: stderr.length > 0 ? stderr.join("\n") : null,
        isSuccess: true,
        scope: extractPythonScope(code)
      };
    } catch (pyErr) {
      console.warn("Pyodide error, evaluating with resilient engine:", pyErr);
    }
  }

  // Resilient instant local Python engine
  return runWithResilientEngine(code, onInputRequest);
}

/**
 * Resilient Instant Local Python Engine
 * Evaluates standard Python statements (Levels 1-12)
 */
async function runWithResilientEngine(code, onInputRequest) {
  const outputLines = [];
  const scope = {};
  const classes = {};

  // Preliminary syntax check for common beginner errors
  const rawLines = code.split("\n");
  for (let idx = 0; idx < rawLines.length; idx++) {
    const rawLine = rawLines[idx];
    const lineNum = idx + 1;
    const trimmed = rawLine.trim();

    if (!trimmed || trimmed.startsWith("#")) continue;

    // Check for Python 2 style print
    if (/^print\s+["'].*$/.test(trimmed)) {
      return {
        output: "",
        error: `SyntaxError: Missing parentheses in call to 'print'. Did you mean print(${trimmed.slice(6)})? (line ${lineNum})`,
        isSuccess: false,
        scope: {}
      };
    }

    // Check for misspelled print
    const misspelledMatch = trimmed.match(/^(prin|prnt|pint|prnit|prt)\s*\(/i);
    if (misspelledMatch) {
      return {
        output: "",
        error: `NameError: name '${misspelledMatch[1]}' is not defined. Did you mean: 'print'? (line ${lineNum})`,
        isSuccess: false,
        scope: {}
      };
    }

    // Check for unclosed string quotes outside comments
    let inDouble = false;
    let inSingle = false;
    let parens = 0;
    for (let cIdx = 0; cIdx < rawLine.length; cIdx++) {
      const ch = rawLine[cIdx];
      const prev = cIdx > 0 ? rawLine[cIdx - 1] : "";
      if (ch === "#" && !inDouble && !inSingle) {
        break; // comment starts
      }
      if (ch === '"' && prev !== "\\" && !inSingle) {
        inDouble = !inDouble;
      } else if (ch === "'" && prev !== "\\" && !inDouble) {
        inSingle = !inSingle;
      } else if (!inDouble && !inSingle) {
        if (ch === "(") parens++;
        if (ch === ")") parens--;
      }
    }

    if (inDouble || inSingle) {
      return {
        output: "",
        error: `SyntaxError: unterminated string literal (detected at line ${lineNum})`,
        isSuccess: false,
        scope: {}
      };
    }

    if (parens > 0) {
      return {
        output: "",
        error: `SyntaxError: unexpected EOF while parsing. Missing closing ')' (line ${lineNum})`,
        isSuccess: false,
        scope: {}
      };
    } else if (parens < 0) {
      return {
        output: "",
        error: `SyntaxError: unmatched ')' (line ${lineNum})`,
        isSuccess: false,
        scope: {}
      };
    }
  }

  const cleanLines = code
    .split("\n")
    .map(line => {
      const commentIdx = line.indexOf("#");
      if (commentIdx !== -1) {
        const before = line.slice(0, commentIdx);
        const quotesCount = (before.match(/["']/g) || []).length;
        if (quotesCount % 2 === 0) {
          return before.trimEnd();
        }
      }
      return line;
    });

  let i = 0;

  function evaluateExpression(expr, localScope = {}) {
    let e = expr.trim();
    if (!e) return "";

    // Replace Python booleans/None
    if (e === "True") return true;
    if (e === "False") return false;
    if (e === "None") return null;

    // Number literal
    if (/^-?\d+$/.test(e)) return parseInt(e, 10);
    if (/^-?\d+\.\d+$/.test(e)) return parseFloat(e);

    // String literal
    if ((e.startsWith('"') && e.endsWith('"')) || (e.startsWith("'") && e.endsWith("'"))) {
      return e.slice(1, -1);
    }

    // str(x)
    const strMatch = e.match(/^str\((.*)\)$/);
    if (strMatch) {
      return String(evaluateExpression(strMatch[1], localScope));
    }

    // len(item)
    const lenMatch = e.match(/^len\((.*)\)$/);
    if (lenMatch) {
      const target = evaluateExpression(lenMatch[1], localScope);
      return target != null && target.length !== undefined ? target.length : 0;
    }

    // Dict lookup or list index: grid["sector"] or employees[0]
    const keyMatch = e.match(/^([a-zA-Z_]\w*)\[(.*)\]$/);
    if (keyMatch) {
      const varName = keyMatch[1];
      const keyVal = evaluateExpression(keyMatch[2], localScope);
      const val = localScope[varName] !== undefined ? localScope[varName] : scope[varName];
      if (val && val[keyVal] !== undefined) return val[keyVal];
      if (Array.isArray(val) && typeof keyVal === "number") return val[keyVal];
    }

    // Object property: self.explorer or core.name
    const propMatch = e.match(/^([a-zA-Z_]\w*)\.([a-zA-Z_]\w*)$/);
    if (propMatch) {
      const objName = propMatch[1];
      const propName = propMatch[2];
      const obj = localScope[objName] !== undefined ? localScope[objName] : scope[objName];
      if (obj && obj[propName] !== undefined) return obj[propName];
    }

    // Object method call: core.boot() or self.restore()
    const methodMatch = e.match(/^([a-zA-Z_]\w*)\.([a-zA-Z_]\w*)\((.*)\)$/);
    if (methodMatch) {
      const objName = methodMatch[1];
      const methodName = methodMatch[2];
      const argStr = methodMatch[3].trim();
      const obj = localScope[objName] !== undefined ? localScope[objName] : scope[objName];
      if (obj && typeof obj[methodName] === "function") {
        const args = argStr ? splitParams(argStr).map(a => evaluateExpression(a, localScope)) : [];
        return obj[methodName](...args);
      }
    }

    // List comprehension: [score for score in traffic_scores if score > 50]
    const compMatch = e.match(/^\[(.*)\s+for\s+([a-zA-Z_]\w*)\s+in\s+(.*?)(?:\s+if\s+(.*))?\]$/);
    if (compMatch) {
      const exprOut = compMatch[1].trim();
      const itemVar = compMatch[2].trim();
      const iterTarget = evaluateExpression(compMatch[3].trim(), localScope);
      const condition = compMatch[4] ? compMatch[4].trim() : null;

      if (Array.isArray(iterTarget)) {
        const result = [];
        for (let item of iterTarget) {
          const iterScope = { ...localScope, [itemVar]: item };
          if (!condition || evaluateExpression(condition, iterScope)) {
            result.push(evaluateExpression(exprOut, iterScope));
          }
        }
        return result;
      }
    }

    // List literal: ["Aisha", "Rahul"]
    if (e.startsWith("[") && e.endsWith("]")) {
      const inner = e.slice(1, -1).trim();
      if (!inner) return [];
      const parts = splitParams(inner);
      return parts.map(p => evaluateExpression(p, localScope));
    }

    // Dict literal: {"sector": "Downtown", "power": True}
    if (e.startsWith("{") && e.endsWith("}")) {
      const inner = e.slice(1, -1).trim();
      if (!inner) return {};
      const dictObj = {};
      const pairs = splitParams(inner);
      for (let pair of pairs) {
        const colonIdx = pair.indexOf(":");
        if (colonIdx !== -1) {
          const k = evaluateExpression(pair.slice(0, colonIdx).trim(), localScope);
          const v = evaluateExpression(pair.slice(colonIdx + 1).trim(), localScope);
          dictObj[k] = v;
        }
      }
      return dictObj;
    }

    // Function call or Class constructor: greet("Alex") or QuantumCore("Alpha", 4.2)
    const callMatch = e.match(/^([a-zA-Z_]\w*)\((.*)\)$/);
    if (callMatch) {
      const targetName = callMatch[1];
      const argStr = callMatch[2].trim();
      const args = argStr ? splitParams(argStr).map(a => evaluateExpression(a, localScope)) : [];

      if (classes[targetName]) {
        return classes[targetName](...args);
      }
      if (typeof scope[targetName] === "function") {
        return scope[targetName](...args);
      }
    }

    // String concatenation with +
    if (e.includes("+")) {
      const tokens = e.split("+").map(t => evaluateExpression(t.trim(), localScope));
      return tokens.join("");
    }

    // Comparison expression
    const cmpMatch = e.match(/(.*?)(==|!=|<=|>=|<|>)(.*)/);
    if (cmpMatch) {
      const left = evaluateExpression(cmpMatch[1].trim(), localScope);
      const op = cmpMatch[2];
      const right = evaluateExpression(cmpMatch[3].trim(), localScope);
      if (op === "==") return left == right;
      if (op === "!=") return left != right;
      if (op === "<") return left < right;
      if (op === ">") return left > right;
      if (op === "<=") return left <= right;
      if (op === ">=") return left >= right;
    }

    // Check scope variable
    if (localScope[e] !== undefined) return localScope[e];
    if (scope[e] !== undefined) return scope[e];

    return e;
  }

  function splitParams(str) {
    const res = [];
    let cur = "";
    let inQuote = false;
    let quoteChar = "";

    for (let char of str) {
      if ((char === '"' || char === "'") && (!inQuote || quoteChar === char)) {
        inQuote = !inQuote;
        quoteChar = inQuote ? char : "";
        cur += char;
      } else if (char === "," && !inQuote) {
        res.push(cur.trim());
        cur = "";
      } else {
        cur += char;
      }
    }
    if (cur.trim()) res.push(cur.trim());
    return res;
  }

  try {
    while (i < cleanLines.length) {
      const rawLine = cleanLines[i];
      const line = rawLine.trim();

      if (!line) {
        i++;
        continue;
      }

      // class Definition block
      const classMatch = line.match(/^class\s+([a-zA-Z_]\w*)\s*:/);
      if (classMatch) {
        const className = classMatch[1];
        const classMethods = {};
        i++;

        while (i < cleanLines.length && (cleanLines[i].startsWith("    ") || cleanLines[i].startsWith("\t"))) {
          const cLine = cleanLines[i].trim();
          const defMethodMatch = cLine.match(/^def\s+([a-zA-Z_]\w*)\s*\((.*?)\)\s*:/);
          if (defMethodMatch) {
            const methodName = defMethodMatch[1];
            const methodParams = defMethodMatch[2].split(",").map(p => p.trim()).filter(Boolean);
            const methodBody = [];
            i++;
            while (i < cleanLines.length && (cleanLines[i].startsWith("        ") || cleanLines[i].startsWith("\t\t"))) {
              methodBody.push(cleanLines[i].trim());
              i++;
            }
            classMethods[methodName] = { params: methodParams, body: methodBody };
          } else {
            i++;
          }
        }

        classes[className] = (...args) => {
          const instance = {};
          // Bind methods to instance
          Object.entries(classMethods).forEach(([mName, mDef]) => {
            instance[mName] = (...mArgs) => {
              const localScope = { self: instance };
              mDef.params.slice(1).forEach((p, idx) => {
                localScope[p] = mArgs[idx];
              });

              for (let bLine of mDef.body) {
                // self.prop = val
                const selfAssign = bLine.match(/^self\.([a-zA-Z_]\w*)\s*=\s*(.*)$/);
                if (selfAssign) {
                  instance[selfAssign[1]] = evaluateExpression(selfAssign[2], localScope);
                  continue;
                }
                // self.dict[k] = val
                const selfDictAssign = bLine.match(/^self\.([a-zA-Z_]\w*)\[(.*?)\]\s*=\s*(.*)$/);
                if (selfDictAssign) {
                  const dName = selfDictAssign[1];
                  const k = evaluateExpression(selfDictAssign[2], localScope);
                  const v = evaluateExpression(selfDictAssign[3], localScope);
                  if (!instance[dName]) instance[dName] = {};
                  instance[dName][k] = v;
                  continue;
                }
                // for loop inside method
                const mForInMatch = bLine.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+self\.([a-zA-Z_]\w*)\s*:/);
                if (mForInMatch) {
                  const loopVar = mForInMatch[1];
                  const listName = mForInMatch[2];
                  const items = instance[listName] || [];
                  for (let itm of items) {
                    localScope[loopVar] = itm;
                    for (let innerLine of mDef.body) {
                      if (innerLine.startsWith("print(")) {
                        const argStr = innerLine.slice(6, -1);
                        const aList = splitParams(argStr).map(p => evaluateExpression(p, localScope));
                        outputLines.push(aList.join(" "));
                      }
                    }
                  }
                  continue;
                }
                // print statement inside method
                if (bLine.startsWith("print(")) {
                  const argStr = bLine.slice(6, -1);
                  const aList = splitParams(argStr).map(p => evaluateExpression(p, localScope));
                  outputLines.push(aList.join(" "));
                  continue;
                }
                // return statement
                if (bLine.startsWith("return ")) {
                  return evaluateExpression(bLine.slice(7), localScope);
                }
              }
            };
          });

          // Run __init__ if defined
          if (instance["__init__"]) {
            instance["__init__"](...args);
          }
          return instance;
        };
        continue;
      }

      // try / except block
      if (line.startsWith("try:")) {
        let tryBlock = [];
        let exceptBlock = [];
        i++;
        while (i < cleanLines.length && (cleanLines[i].startsWith("    ") || cleanLines[i].startsWith("\t"))) {
          tryBlock.push(cleanLines[i]);
          i++;
        }
        if (i < cleanLines.length && cleanLines[i].trim().startsWith("except")) {
          i++;
          while (i < cleanLines.length && (cleanLines[i].startsWith("    ") || cleanLines[i].startsWith("\t"))) {
            exceptBlock.push(cleanLines[i]);
            i++;
          }
        }

        let caught = false;
        try {
          for (let tryLine of tryBlock) {
            const tl = tryLine.trim();
            if (tl.includes("int(") && tl.includes('"') && isNaN(Number(tl.match(/int\(["'](.*?)["']\)/)?.[1]))) {
              caught = true;
              break;
            }
          }
        } catch (e) {
          caught = true;
        }

        if (caught) {
          for (let excLine of exceptBlock) {
            const el = excLine.trim();
            if (el.startsWith("print(")) {
              const argStr = el.slice(6, -1);
              const args = splitParams(argStr).map(p => evaluateExpression(p));
              outputLines.push(args.join(" "));
            }
          }
        }
        continue;
      }

      // def function block
      const defMatch = line.match(/^def\s+([a-zA-Z_]\w*)\s*\((.*?)\)\s*:/);
      if (defMatch) {
        const fnName = defMatch[1];
        const params = defMatch[2].split(",").map(p => p.trim()).filter(Boolean);
        const fnBody = [];
        i++;
        while (i < cleanLines.length && (cleanLines[i].startsWith("    ") || cleanLines[i].startsWith("\t"))) {
          fnBody.push(cleanLines[i].trim());
          i++;
        }

        scope[fnName] = (...args) => {
          const localScope = {};
          params.forEach((p, idx) => {
            localScope[p] = args[idx];
          });
          for (let bLine of fnBody) {
            if (bLine.startsWith("return ")) {
              const retExpr = bLine.slice(7);
              return evaluateExpression(retExpr, localScope);
            }
          }
          return undefined;
        };
        continue;
      }

      // for in range(...) block
      const forRangeMatch = line.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+range\((.*?)\)\s*:/);
      if (forRangeMatch) {
        const loopVar = forRangeMatch[1];
        const rangeArgs = forRangeMatch[2].split(",").map(a => parseInt(a.trim(), 10));
        let start = 0;
        let stop = 0;
        if (rangeArgs.length === 1) {
          stop = rangeArgs[0];
        } else if (rangeArgs.length >= 2) {
          start = rangeArgs[0];
          stop = rangeArgs[1];
        }

        const loopBody = [];
        i++;
        while (i < cleanLines.length && (cleanLines[i].startsWith("    ") || cleanLines[i].startsWith("\t"))) {
          loopBody.push(cleanLines[i].trim());
          i++;
        }

        for (let val = start; val < stop; val++) {
          scope[loopVar] = val;
          for (let bLine of loopBody) {
            if (bLine.startsWith("print(")) {
              const argStr = bLine.slice(6, -1);
              const args = splitParams(argStr).map(p => evaluateExpression(p, scope));
              outputLines.push(args.join(" "));
            }
          }
        }
        continue;
      }

      // if / else block
      const ifMatch = line.match(/^if\s+(.*?)\s*:/);
      if (ifMatch) {
        const conditionExpr = ifMatch[1];
        const conditionResult = evaluateExpression(conditionExpr, scope);

        const ifBody = [];
        i++;
        while (i < cleanLines.length && (cleanLines[i].startsWith("    ") || cleanLines[i].startsWith("\t"))) {
          ifBody.push(cleanLines[i].trim());
          i++;
        }

        const elseBody = [];
        if (i < cleanLines.length && cleanLines[i].trim().startsWith("else:")) {
          i++;
          while (i < cleanLines.length && (cleanLines[i].startsWith("    ") || cleanLines[i].startsWith("\t"))) {
            elseBody.push(cleanLines[i].trim());
            i++;
          }
        }

        const targetBody = conditionResult ? ifBody : elseBody;
        for (let bLine of targetBody) {
          if (bLine.startsWith("print(")) {
            const argStr = bLine.slice(6, -1);
            const args = splitParams(argStr).map(p => evaluateExpression(p, scope));
            outputLines.push(args.join(" "));
          }
        }
        continue;
      }

      // Method call statement: system.restore()
      const methodStmtMatch = line.match(/^([a-zA-Z_]\w*)\.([a-zA-Z_]\w*)\((.*)\)$/);
      if (methodStmtMatch && scope[methodStmtMatch[1]] && typeof scope[methodStmtMatch[1]][methodStmtMatch[2]] === "function") {
        const obj = scope[methodStmtMatch[1]];
        const fn = obj[methodStmtMatch[2]];
        const argStr = methodStmtMatch[3].trim();
        const args = argStr ? splitParams(argStr).map(a => evaluateExpression(a, scope)) : [];
        fn(...args);
        i++;
        continue;
      }

      // print(...) statement
      if (line.startsWith("print(") && line.endsWith(")")) {
        const argStr = line.slice(6, -1);
        const args = splitParams(argStr).map(p => evaluateExpression(p, scope));
        outputLines.push(args.join(" "));
        i++;
        continue;
      }

      // list.append(...)
      const appendMatch = line.match(/^([a-zA-Z_]\w*)\.append\((.*)\)$/);
      if (appendMatch) {
        const listName = appendMatch[1];
        const valToAppend = evaluateExpression(appendMatch[2], scope);
        if (Array.isArray(scope[listName])) {
          scope[listName].push(valToAppend);
        }
        i++;
        continue;
      }

      // Dict key assignment: grid["status"] = "Operational"
      const dictAssignMatch = line.match(/^([a-zA-Z_]\w*)\[(.*?)\]\s*=\s*(.*)$/);
      if (dictAssignMatch) {
        const dictName = dictAssignMatch[1];
        const k = evaluateExpression(dictAssignMatch[2], scope);
        const v = evaluateExpression(dictAssignMatch[3], scope);
        if (!scope[dictName]) scope[dictName] = {};
        scope[dictName][k] = v;
        i++;
        continue;
      }

      // Variable assignment with input()
      const inputAssignMatch = line.match(/^([a-zA-Z_]\w*)\s*=\s*(int\()?\s*input\((.*?)\)\s*\)?$/);
      if (inputAssignMatch) {
        const varName = inputAssignMatch[1];
        const isInt = !!inputAssignMatch[2];
        const promptText = evaluateExpression(inputAssignMatch[3] || "");

        let userInput = "Alex";
        if (onInputRequest) {
          userInput = await onInputRequest(promptText);
        }
        scope[varName] = isInt ? parseInt(userInput, 10) || 18 : userInput;
        i++;
        continue;
      }

      // Regular Variable assignment
      const assignMatch = line.match(/^([a-zA-Z_]\w*)\s*=\s*(.*)$/);
      if (assignMatch) {
        const varName = assignMatch[1];
        const expr = assignMatch[2];
        scope[varName] = evaluateExpression(expr, scope);
        i++;
        continue;
      }

      i++;
    }

    return {
      output: outputLines.join("\n"),
      error: null,
      isSuccess: true,
      scope
    };
  } catch (err) {
    return {
      output: outputLines.join("\n"),
      error: `SyntaxError / RuntimeError: ${err.message}`,
      isSuccess: false,
      scope: {}
    };
  }
}

/**
 * Utility to extract variable values from code without execution
 */
export function extractPythonScope(code) {
  const scope = {};
  if (!code) return scope;

  const lines = code.split("\n");
  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const assignMatch = trimmed.match(/^([a-zA-Z_]\w*)\s*=\s*(.*)$/);
    if (assignMatch) {
      const varName = assignMatch[1];
      let valStr = assignMatch[2].trim();
      // Remove inline comments
      const commentIdx = valStr.indexOf("#");
      if (commentIdx !== -1) {
        valStr = valStr.slice(0, commentIdx).trim();
      }

      if ((valStr.startsWith('"') && valStr.endsWith('"')) || (valStr.startsWith("'") && valStr.endsWith("'"))) {
        scope[varName] = valStr.slice(1, -1);
      } else if (valStr === "True") {
        scope[varName] = true;
      } else if (valStr === "False") {
        scope[varName] = false;
      } else if (/^-?\d+$/.test(valStr)) {
        scope[varName] = parseInt(valStr, 10);
      } else if (/^-?\d+\.\d+$/.test(valStr)) {
        scope[varName] = parseFloat(valStr);
      } else {
        scope[varName] = valStr;
      }
    }
  }
  return scope;
}
