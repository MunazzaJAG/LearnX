import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  RotateCcw,
  Lightbulb,
  Sparkles,
  AlertCircle,
  BookOpen,
  Award,
  Zap,
  Terminal as TerminalIcon,
  HelpCircle,
  Brain,
  Check,
  ChevronRight,
  ShieldCheck,
  Lock,
  Compass,
  GitBranch,
  Sliders,
  Send,
  RefreshCw,
  FileCode,
  Layers,
  ArrowRight
} from "lucide-react";
import { useGameState } from "../context/GameStateContext";
import { LEVELS_DATA } from "../data/curriculum";
import { runPythonCode, extractPythonScope } from "../utils/pythonRunner";
import { soundEngine } from "../utils/audio";
import { NovaMascot, EcoWoodsArt } from "../components/BiomeVectorArt";
import { CelebrationModal } from "../components/CelebrationModal";

export function EcoWoodsMissionView({ missionId = 3 }) {
  const {
    completedMissions,
    completeMission,
    navigateTo,
    selectMission,
    profile,
    xp
  } = useGameState();

  const currentMission = LEVELS_DATA.find((m) => m.level === missionId) || LEVELS_DATA[2];
  const isMission3 = currentMission.level === 3;

  // Active stage (1 to 6)
  // Stage 1: Learn & Understand (Worked Example + Line-by-line inspection)
  // Stage 2: Mini-game 1 (Activate Gate / Choose Forest Path)
  // Stage 3: Mini-game 2 (Text or Number? / Condition Detective)
  // Stage 4: Mini-game 3 (Repair Access Scanner / Repair Branching Terminal)
  // Stage 5: Mini-game 4 (Build Access Request / Build Three-Rank System)
  // Stage 6: Boss Battle (Open Ancient Gate / Restore Forest Routes)
  const [activeStage, setActiveStage] = useState(1);
  const [completedStages, setCompletedStages] = useState([]);

  // Code editor state
  const [code, setCode] = useState("");
  const [terminalOutput, setTerminalOutput] = useState("");
  const [terminalError, setTerminalError] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [revealedHints, setRevealedHints] = useState(0);
  const [validationStatus, setValidationStatus] = useState(null); // "success" | "error" | null
  const [validationMessage, setValidationMessage] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);

  // Line-by-line explanation index for Stage 1
  const [explainedLineIndex, setExplainedLineIndex] = useState(0);

  // Interactive input prompt state when code requests input()
  const [awaitingInput, setAwaitingInput] = useState(false);
  const [inputPromptText, setInputPromptText] = useState("");
  const [userEnteredText, setUserEnteredText] = useState("");
  const inputResolverRef = useRef(null);

  // Mini-game states
  // Mission 3, Stage 2: Gate activation simulation
  const [gateInput, setGateInput] = useState("");
  const [gateActivated, setGateActivated] = useState(false);

  // Mission 3, Stage 3: Type matching
  const [typeMatches, setTypeMatches] = useState({});

  // Mission 4, Stage 2: Interactive Path Selector
  const [sliderXp, setSliderXp] = useState(75);

  // Mission 4, Stage 3: Condition Detective answers
  const [detectiveAnswers, setDetectiveAnswers] = useState({});

  // Mission 4, Stage 6: Boundary test results
  const [boundaryResults, setBoundaryResults] = useState([]);

  const isCompleted = completedMissions.includes(currentMission.level);

  // Default code setup on stage or mission switch
  useEffect(() => {
    setTerminalOutput("");
    setTerminalError(null);
    setValidationStatus(null);
    setValidationMessage("");
    setRevealedHints(0);
    setAwaitingInput(false);

    if (isMission3) {
      if (activeStage === 1) {
        setCode(
          `# Security Gate Protocol\nname = input("Enter explorer name: ")\nclearance = int(input("Enter clearance level: "))\nprint("Access granted for:", name)\nprint("Clearance level:", clearance)`
        );
      } else if (activeStage === 2) {
        setCode(
          `# Interactive Gate Activation\npasscode = input("Enter gate password: ")\nprint("Verifying:", passcode)\nprint("Gate mechanism unlocked!")`
        );
      } else if (activeStage === 3) {
        setCode(
          `# Type Classification in Python\nname = "Nova"            # str\nlevel = 2                # int\nuser_input = input()     # str (always!)\nconverted = int("42")    # int`
        );
      } else if (activeStage === 4) {
        // Repair Access Scanner: fixing unconverted string in arithmetic
        setCode(
          `# Malfunctioning Scanner - Fix the calculation error!\naccess_code = input("Enter numeric access code: ")\n\n# Bug: access_code is a string! Convert it to int before adding\nnext_code = access_code + 1\n\nprint("Next clearance code:", next_code)`
        );
      } else if (activeStage === 5) {
        // Build Access Request
        setCode(
          `# Build your Access Request:\n# 1. Ask for explorer name\nname = input("Enter your name: ")\n\n# 2. Ask for favorite number and convert to int\nfav_num = int(input("Enter favorite number: "))\n\n# 3. Calculate boosted power (fav_num + 1)\nboosted_power = fav_num + 1\n\n# 4. Display both with clear labels\nprint("Explorer:", name)\nprint("Boosted Power:", boosted_power)`
        );
      } else if (activeStage === 6) {
        // Boss Battle: Open the Ancient Gate
        setCode(
          `# Boss Battle: Open the Ancient Gate\n# Step 1: Capture explorer name with input()\nname = input("Enter explorer name: ")\n\n# Step 2: Capture clearance level as an integer with int(input())\nclearance_level = int(input("Enter clearance level: "))\n\n# Step 3: Print Access Granted and Security Level\nprint("Access Granted:", name)\nprint("Security Level:", clearance_level)`
        );
      }
    } else {
      // Mission 4: User Terminal
      if (activeStage === 1) {
        setCode(
          `# Three-Rank System\nxp = 75\n\nif xp < 50:\n    print("Route: Canopy Trail")\nelif xp < 100:\n    print("Route: Undergrowth Trail")\nelse:\n    print("Route: Deep Grove")`
        );
      } else if (activeStage === 2) {
        setCode(
          `# Path Selection Demonstration\nxp = ${sliderXp}\n\nif xp < 50:\n    print("Path chosen: Canopy Trail (Scout)")\nelif xp < 100:\n    print("Path chosen: Undergrowth Trail (Ranger)")\nelse:\n    print("Path chosen: Deep Grove (Guardian)")`
        );
      } else if (activeStage === 3) {
        setCode(
          `# Condition Detective\nscore = 50\nprint("score == 50 ->", score == 50)\nprint("score < 50  ->", score < 50)\nprint("score >= 50 ->", score >= 50)\nprint("score != 0  ->", score != 0)`
        );
      } else if (activeStage === 4) {
        // Repair Branching Terminal (Fix '=' vs '==', missing colon, bad indentation)
        setCode(
          `# Broken Branching Logic - Fix the 3 syntax errors!\nxp = 50\n\nif xp = 50:\n    print("Exact 50 XP!")\nelif xp > 100\n    print("Master Rank")\nelse:\nprint("Under 100 XP")`
        );
      } else if (activeStage === 5) {
        // Build Three-Rank System
        setCode(
          `# Build Three-Rank System\nxp = 75\n\n# Implement if, elif, else:\n# If xp < 50 -> print("Rank: Scout")\n# If xp < 100 -> print("Rank: Ranger")\n# Else -> print("Rank: Guardian")\n\nif xp < 50:\n    print("Rank: Scout")\nelif xp < 100:\n    print("Rank: Ranger")\nelse:\n    print("Rank: Guardian")`
        );
      } else if (activeStage === 6) {
        // Boss Battle: Restore Forest Routes
        setCode(
          `# Boss Battle: Restore Forest Routes\n# 1. Prompt for explorer XP and convert to int\nxp = int(input("Enter explorer XP: "))\n\n# 2. Direct to the correct route with if / elif / else:\nif xp < 50:\n    print("Path: Canopy Trail")\nelif xp < 100:\n    print("Path: Undergrowth Trail")\nelse:\n    print("Path: Deep Grove")`
        );
      }
    }
  }, [activeStage, missionId]);

  // Handle interactive input callback
  const handleInputRequest = (promptStr) => {
    return new Promise((resolve) => {
      setInputPromptText(promptStr || "Enter input: ");
      setUserEnteredText("");
      setAwaitingInput(true);
      inputResolverRef.current = resolve;
    });
  };

  const handleInputSubmit = (e) => {
    if (e) e.preventDefault();
    if (!inputResolverRef.current) return;
    const value = userEnteredText || (isMission3 ? "Alex" : "50");
    setAwaitingInput(false);
    inputResolverRef.current(value);
    inputResolverRef.current = null;
  };

  // Run user code
  const handleRunCode = async (customInputMap = null) => {
    setIsRunning(true);
    setTerminalError(null);
    setTerminalOutput("");
    setValidationStatus(null);
    setValidationMessage("");
    soundEngine.playClick();

    try {
      let inputCounter = 0;
      const res = await runPythonCode(code, async (prompt) => {
        if (customInputMap && customInputMap[inputCounter] !== undefined) {
          const val = customInputMap[inputCounter];
          inputCounter++;
          return String(val);
        }
        return await handleInputRequest(prompt);
      });

      setTerminalOutput(res.output);
      if (res.error) {
        setTerminalError(res.error);
        try { soundEngine?.playIncorrect?.(); } catch (_) {}
      } else {
        try { soundEngine?.playSuccess?.(); } catch (_) {}
      }
      return res;
    } catch (err) {
      setTerminalError(err.message);
      try { soundEngine?.playIncorrect?.(); } catch (_) {}
      return { output: "", error: err.message, isSuccess: false };
    } finally {
      setIsRunning(false);
    }
  };

  const passStage = (message) => {
    setValidationStatus("success");
    setValidationMessage(message);
    if (!completedStages.includes(activeStage)) {
      setCompletedStages((prev) => [...prev, activeStage]);
    }
    try {
      soundEngine?.playLevelUp?.();
    } catch (e) {
      console.warn("Audio error:", e);
    }
  };

  const failStage = (message) => {
    setValidationStatus("error");
    setValidationMessage(message);
    try {
      soundEngine?.playIncorrect?.();
    } catch (e) {
      console.warn("Audio error:", e);
    }
  };

  // Stage validation handler
  const handleValidateStage = async () => {
    setIsRunning(true);
    setTerminalError(null);
    setValidationStatus(null);
    setValidationMessage("");
    soundEngine.playClick();

    try {
      if (isMission3) {
        // Mission 3: Security Gate
        if (activeStage === 1) {
          // Worked Example run
          const res = await runPythonCode(code, async (p) => {
            if (p.toLowerCase().includes("name")) return profile.name || "Alex";
            return "2";
          });
          setTerminalOutput(res.output);
          if (res.error) {
            failStage("Error in script: " + res.error);
          } else if (res.output.toLowerCase().includes("access granted") && res.output.includes("2")) {
            passStage("Worked example completed! You observed how input() captures names and int() parses numbers.");
          } else {
            failStage("Ensure your script prints 'Access granted for:' and the clearance level.");
          }
        } else if (activeStage === 2) {
          // Mini-game 1: Activate Gate
          if (gateActivated || gateInput.trim().length > 0) {
            setGateActivated(true);
            passStage("Gate mechanism unlocked! The ancient stone archway powered up and swung open.");
          } else {
            failStage("Type a security passcode into the gate console and activate it!");
          }
        } else if (activeStage === 3) {
          // Mini-game 2: Text or Number? Classification
          const c1 = typeMatches["Alex"] === "str";
          const c2 = typeMatches["input()"] === "str";
          const c3 = typeMatches["int(input())"] === "int";
          const c4 = typeMatches["int('42')"] === "int";
          const c5 = typeMatches["'100'"] === "str";

          if (c1 && c2 && c3 && c4 && c5) {
            passStage("Perfect classification! Raw input() and quotes are ALWAYS str. int() converts them to numbers.");
          } else {
            failStage("Some items are misclassified. Check your answers and ensure all 5 items are categorized.");
          }
        } else if (activeStage === 4) {
          // Mini-game 3: Repair Access Scanner
          const res = await runPythonCode(code, async () => "41");
          setTerminalOutput(res.output);
          if (res.error) {
            failStage("Error: " + res.error + " (Hint: make sure to wrap access_code in int() before adding 1!)");
          } else if (res.output.includes("42")) {
            passStage("Scanner repaired! You converted the text input to an integer, avoiding the TypeError.");
          } else {
            failStage("Ensure the scanner calculates access_code + 1 as an integer arithmetic operation.");
          }
        } else if (activeStage === 5) {
          // Mini-game 4: Build Access Request
          const res = await runPythonCode(code, async (p) => {
            if (p.toLowerCase().includes("name")) return profile.name || "Alex";
            return "7";
          });
          setTerminalOutput(res.output);
          if (res.error) {
            failStage("Error: " + res.error);
          } else if (res.output.includes("8")) {
            passStage("Access request accepted! Your code correctly captured user input and computed numeric values.");
          } else {
            failStage("Make sure you prompt for a favorite number, convert it with int(), add 1, and print both.");
          }
        } else if (activeStage === 6) {
          // Boss Battle: Open the Ancient Gate
          const testName = profile.name || "Alex";
          const testLevel = "3";
          const res = await runPythonCode(code, async (p) => {
            if (p.toLowerCase().includes("name")) return testName;
            return testLevel;
          });
          setTerminalOutput(res.output);

          const hasNamePrompt = code.includes("input(");
          const hasIntCast = code.includes("int(");
          const outLower = res.output.toLowerCase();
          const hasGranted = outLower.includes("access") && outLower.includes("granted");
          const hasLevel = outLower.includes("level") && res.output.includes("3");

          if (!res.error && hasNamePrompt && hasIntCast && hasGranted && hasLevel) {
            passStage("ANCIENT GATE RESTORED! Conduits pulse with emerald light as the Living Forest opens.");
            completeMission(3, 60, currentMission.badge);
            setShowCelebration(true);
          } else {
            let reasons = [];
            if (res.error) reasons.push("Fix runtime error: " + res.error);
            if (!hasIntCast) reasons.push("Use int() to convert the clearance level");
            if (!hasGranted) reasons.push("Print 'Access Granted:' with the explorer name");
            if (!hasLevel) reasons.push("Print 'Security Level:' with the integer clearance level");
            failStage("Criteria incomplete: " + reasons.join("; "));
          }
        }
      } else {
        // Mission 4: User Terminal
        if (activeStage === 1) {
          // Worked example
          const res = await runPythonCode(code);
          setTerminalOutput(res.output);
          if (res.output.includes("Undergrowth Trail")) {
            passStage("Worked example verified! You observed how 75 XP fell between 50 and 100 into the elif branch.");
          } else {
            failStage("Run the worked example to observe how if, elif, and else execute.");
          }
        } else if (activeStage === 2) {
          // Mini-game 1: Choose Forest Path
          passStage("Path explored! You tested how different XP values route through the three branches.");
        } else if (activeStage === 3) {
          // Mini-game 2: Condition Detective
          const a1 = detectiveAnswers["18 == 18"] === "True";
          const a2 = detectiveAnswers["45 >= 50"] === "False";
          const a3 = detectiveAnswers["50 >= 50"] === "True";
          const a4 = detectiveAnswers["Scout != Guardian"] === "True";

          if (a1 && a2 && a3 && a4) {
            passStage("Detective Mastery! You accurately evaluated the boundary condition 50 >= 50 (True).");
          } else {
            failStage("Some condition answers are incorrect. Notice that 50 >= 50 is True because 50 is equal to 50.");
          }
        } else if (activeStage === 4) {
          // Mini-game 3: Repair Branching Terminal
          const res = await runPythonCode(code);
          setTerminalOutput(res.output);
          if (res.error) {
            failStage("Syntax error detected: " + res.error + " (Check '==' for comparison, colons ':', and indentation!)");
          } else if (res.output.includes("Exact 50 XP!")) {
            passStage("Terminal logic repaired! You replaced '=' with '==', added missing colons, and indented code blocks.");
          } else {
            failStage("Fix all syntax errors and run the script so it outputs 'Exact 50 XP!'.");
          }
        } else if (activeStage === 5) {
          // Mini-game 4: Build Three-Rank System
          const res = await runPythonCode(code);
          setTerminalOutput(res.output);
          if (res.error) {
            failStage("Error in script: " + res.error);
          } else if (res.output.includes("Rank: Ranger")) {
            passStage("Three-rank system verified! 75 XP correctly routed into Ranger.");
          } else {
            failStage("Ensure your code prints 'Rank: Scout', 'Rank: Ranger', and 'Rank: Guardian' based on XP.");
          }
        } else if (activeStage === 6) {
          // Boss Battle: Restore Forest Routes (Automated Boundary Test Suite!)
          const testCases = [
            { input: 0, expected: "Canopy Trail", name: "0 XP (Bottom Bound)" },
            { input: 49, expected: "Canopy Trail", name: "49 XP (Upper Scout Edge)" },
            { input: 50, expected: "Undergrowth Trail", name: "50 XP (Ranger Threshold)" },
            { input: 99, expected: "Undergrowth Trail", name: "99 XP (Upper Ranger Edge)" },
            { input: 100, expected: "Deep Grove", name: "100 XP (Guardian Threshold)" },
            { input: 150, expected: "Deep Grove", name: "150 XP (High Veteran)" }
          ];

          const results = [];
          let allPassed = true;

          for (const tc of testCases) {
            const run = await runPythonCode(code, async () => String(tc.input));
            const passed = run.output.includes(tc.expected) && !run.error;
            results.push({
              name: tc.name,
              input: tc.input,
              expected: tc.expected,
              output: run.output.trim() || run.error || "(No Output)",
              passed
            });
            if (!passed) allPassed = false;
          }

          setBoundaryResults(results);

          if (allPassed) {
            passStage("ALL 6 BOUNDARY TESTS PASSED! Forest routing is 100% calibrated across all explorer ranks.");
            completeMission(4, 60, currentMission.badge);
            setShowCelebration(true);
          } else {
            failStage("Boundary verification failed on one or more edge test cases. Review the test results table below.");
          }
        }
      }
    } catch (err) {
      failStage("Validation error: " + err.message);
    } finally {
      setIsRunning(false);
    }
  };

  const handleNextStage = () => {
    soundEngine.playClick();
    if (activeStage < 6) {
      setActiveStage((prev) => prev + 1);
    }
  };

  const handleCelebrationContinue = () => {
    setShowCelebration(false);
    if (isMission3) {
      selectMission(4);
      setActiveStage(1);
      navigateTo("mission_lab", 4);
    } else {
      navigateTo("eco_woods");
    }
  };

  const stageTitles = isMission3
    ? [
        "1. Learn & Understand",
        "2. Gate Activation",
        "3. Text or Number?",
        "4. Repair Scanner",
        "5. Access Request",
        "6. Boss: Ancient Gate"
      ]
    : [
        "1. Learn & Understand",
        "2. Choose Forest Path",
        "3. Condition Detective",
        "4. Repair Logic",
        "5. Three-Rank System",
        "6. Boss: Forest Routes"
      ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => navigateTo("eco_woods")}
          className="flex items-center gap-2 text-xs font-bold text-[#355346] hover:text-[#172E26] bg-[#FFFFFF] border border-[#DEECE3] hover:bg-[#EEF5F1] px-4 py-2.5 rounded-2xl shadow-soft transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-[#2D6A4F]" />
          <span>Return to Eco Woods</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#1F543D] bg-[#E8F5E9] border border-[#C7E9D3] px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#52B788] animate-pulse" />
            <span>Mission 0{missionId}: {currentMission.title}</span>
          </span>

          <span className="text-[11px] font-black text-[#ECA752] bg-[#FFF6EA] border border-[#FBE3C5] px-3 py-1.5 rounded-full flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>+60 XP</span>
          </span>
        </div>
      </div>

      {/* Stage Progression Tabs */}
      <div className="bg-[#FFFFFF] border border-[#DEECE3] rounded-2xl p-2 shadow-soft flex items-center gap-2 overflow-x-auto scrollbar-none">
        {stageTitles.map((title, idx) => {
          const stNum = idx + 1;
          const isAct = activeStage === stNum;
          const isDone = completedStages.includes(stNum);
          return (
            <button
              key={stNum}
              onClick={() => {
                soundEngine.playClick();
                setActiveStage(stNum);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                isAct
                  ? "bg-[#2D6A4F] text-white shadow-sm"
                  : isDone
                  ? "bg-[#E8F5E9] text-[#2D6A4F] hover:bg-[#D7EFE0]"
                  : "bg-transparent text-[#6F8277] hover:bg-[#F3F7F5]"
              }`}
            >
              {isDone ? (
                <CheckCircle2 className={`w-3.5 h-3.5 ${isAct ? "text-white" : "text-[#2D6A4F]"}`} />
              ) : (
                <span className={`w-2 h-2 rounded-full ${isAct ? "bg-white" : "bg-[#8FA69C]"}`} />
              )}
              <span>{title}</span>
            </button>
          );
        })}
      </div>

      {/* Main Mission Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Mission Briefing, Interactive Mini-games, and Concept Walkthrough */}
        <div className="lg:col-span-5 space-y-6">
          {/* Mission Objective Card */}
          <div className="bg-[#FFFFFF] border border-[#DEECE3] rounded-3xl p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-[#EDF3ED] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7E9387]">
                  Stage {activeStage} of 6
                </span>
                <h2 className="text-xl font-black text-[#172E26] tracking-tight">
                  {stageTitles[activeStage - 1].slice(3)}
                </h2>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-[#E8F5E9] text-[#2D6A4F] flex items-center justify-center font-bold text-sm">
                0{activeStage}
              </div>
            </div>

            {/* Stage Specific Instructions */}
            {activeStage === 1 && (
              <div className="space-y-4 text-xs text-[#526B5F] leading-relaxed">
                <p>
                  {isMission3
                    ? "In Python, the input() function pauses execution and prompts the user to enter text. Because it always returns a string (str), we must wrap numbers in int() before performing math or comparisons."
                    : "Conditional statements make decisions. Python tests the if expression; if True, its indented code block runs. If False, it checks elif, falling back to else."}
                </p>

                {/* Line Walkthrough */}
                <div className="p-3.5 bg-[#F4FAF6] border border-[#BDE0CB] rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#2D6A4F]">
                    <span>Line-by-Line Inspection</span>
                    <span>Click code line to inspect</span>
                  </div>
                  <div className="font-mono text-[11px] text-[#133F2E] space-y-1 bg-white p-3 rounded-xl border border-[#D5EAD9]">
                    {isMission3 ? (
                      <>
                        <div
                          onClick={() => setExplainedLineIndex(0)}
                          className={`p-1 rounded cursor-pointer ${
                            explainedLineIndex === 0 ? "bg-[#CBEBD4] font-bold" : "hover:bg-[#EAF5EE]"
                          }`}
                        >
                          1: name = input("Enter name: ")
                        </div>
                        <div
                          onClick={() => setExplainedLineIndex(1)}
                          className={`p-1 rounded cursor-pointer ${
                            explainedLineIndex === 1 ? "bg-[#CBEBD4] font-bold" : "hover:bg-[#EAF5EE]"
                          }`}
                        >
                          2: clearance = int(input("Enter level: "))
                        </div>
                        <div
                          onClick={() => setExplainedLineIndex(2)}
                          className={`p-1 rounded cursor-pointer ${
                            explainedLineIndex === 2 ? "bg-[#CBEBD4] font-bold" : "hover:bg-[#EAF5EE]"
                          }`}
                        >
                          3: print("Access granted for:", name)
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          onClick={() => setExplainedLineIndex(0)}
                          className={`p-1 rounded cursor-pointer ${
                            explainedLineIndex === 0 ? "bg-[#CBEBD4] font-bold" : "hover:bg-[#EAF5EE]"
                          }`}
                        >
                          1: if xp &lt; 50:
                        </div>
                        <div
                          onClick={() => setExplainedLineIndex(1)}
                          className={`p-1 rounded cursor-pointer ${
                            explainedLineIndex === 1 ? "bg-[#CBEBD4] font-bold" : "hover:bg-[#EAF5EE]"
                          }`}
                        >
                          2: elif xp &lt; 100:
                        </div>
                        <div
                          onClick={() => setExplainedLineIndex(2)}
                          className={`p-1 rounded cursor-pointer ${
                            explainedLineIndex === 2 ? "bg-[#CBEBD4] font-bold" : "hover:bg-[#EAF5EE]"
                          }`}
                        >
                          3: else:
                        </div>
                      </>
                    )}
                  </div>
                  <div className="text-[11px] text-[#2D6A4F] italic pt-1">
                    {isMission3
                      ? explainedLineIndex === 0
                        ? "Line 1: input() prompts user text and saves it as a string in the variable 'name'."
                        : explainedLineIndex === 1
                        ? "Line 2: int(...) converts the text from input() into a whole integer for 'clearance'."
                        : "Line 3: print() outputs multiple arguments separated by spaces."
                      : explainedLineIndex === 0
                      ? "Line 1: Tests if xp is strictly less than 50. Must end with a colon ':' and indent 4 spaces."
                      : explainedLineIndex === 1
                      ? "Line 2: 'elif' only evaluates if previous 'if' was False. Catches 50 to 99."
                      : "Line 3: 'else' is the fallback when all previous checks are False (100 and above)."}
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 2: Mini-game 1 */}
            {activeStage === 2 && (
              <div className="space-y-4">
                {isMission3 ? (
                  /* Mission 3: Gate Activation Simulation */
                  <div className="space-y-3">
                    <p className="text-xs text-[#526B5F] leading-relaxed">
                      The Ancient Forest Gate requires an interactive passcode to unlock. Type your explorer passcode below or run the script to see the gate open:
                    </p>
                    <div className="p-4 bg-[#F8FAF8] border border-[#DEECE3] rounded-2xl space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-[#172E26]">
                        <span>Gate Control Terminal</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            gateActivated
                              ? "bg-[#E8F5E9] text-[#2D6A4F]"
                              : "bg-[#FEF6E9] text-[#D97706]"
                          }`}
                        >
                          {gateActivated ? "UNLOCKED" : "LOCKED"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={gateInput}
                          onChange={(e) => setGateInput(e.target.value)}
                          placeholder="Type passcode (e.g. nexa123)"
                          className="flex-1 bg-white border border-[#CBD8D2] px-3 py-2 rounded-xl text-xs font-mono focus:outline-none focus:border-[#2D6A4F]"
                        />
                        <button
                          onClick={() => {
                            if (gateInput.trim()) {
                              setGateActivated(true);
                              try { soundEngine?.playSuccess?.(); } catch (_) {}
                            }
                          }}
                          className="px-4 py-2 bg-[#2D6A4F] text-white text-xs font-bold rounded-xl hover:bg-[#1E5440]"
                        >
                          Send
                        </button>
                      </div>

                      {/* Visual Gate Graphics */}
                      <div className="h-24 bg-[#EAF4EE] rounded-xl flex items-center justify-center relative overflow-hidden border border-[#CDE5D6]">
                        <div
                          className={`w-16 h-16 rounded-full border-4 transition-all duration-700 flex items-center justify-center font-bold text-xs ${
                            gateActivated
                              ? "border-[#52B788] bg-[#D8F3E5] text-[#2D6A4F] scale-110"
                              : "border-[#8FA69C] bg-[#FFFFFF] text-[#8FA69C]"
                          }`}
                        >
                          {gateActivated ? "OPEN" : "SEALED"}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Mission 4: Interactive Path Selector */
                  <div className="space-y-3">
                    <p className="text-xs text-[#526B5F] leading-relaxed">
                      Drag the XP slider to test how the three conditional branches route an explorer:
                    </p>
                    <div className="p-4 bg-[#F8FAF8] border border-[#DEECE3] rounded-2xl space-y-4">
                      <div className="flex items-center justify-between text-xs font-bold text-[#172E26]">
                        <span>Explorer Score</span>
                        <span className="font-mono text-sm text-[#2D6A4F] bg-[#E8F5E9] px-2.5 py-0.5 rounded-lg">
                          {sliderXp} XP
                        </span>
                      </div>

                      <input
                        type="range"
                        min="0"
                        max="150"
                        value={sliderXp}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setSliderXp(val);
                          setCode(
                            `# Path Selection Demonstration\nxp = ${val}\n\nif xp < 50:\n    print("Path chosen: Canopy Trail (Scout)")\nelif xp < 100:\n    print("Path chosen: Undergrowth Trail (Ranger)")\nelse:\n    print("Path chosen: Deep Grove (Guardian)")`
                          );
                        }}
                        className="w-full accent-[#2D6A4F] cursor-pointer"
                      />

                      <div className="space-y-2 pt-1">
                        <div
                          className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                            sliderXp < 50
                              ? "bg-[#E8F5E9] border-[#52B788] font-bold text-[#2D6A4F]"
                              : "bg-white border-[#E2EAE5] text-[#7E9387] opacity-60"
                          }`}
                        >
                          <span>1. Canopy Trail (Scout)</span>
                          <span className="font-mono text-[10px]">xp &lt; 50</span>
                        </div>
                        <div
                          className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                            sliderXp >= 50 && sliderXp < 100
                              ? "bg-[#FFF6EA] border-[#ECA752] font-bold text-[#A05A18]"
                              : "bg-white border-[#E2EAE5] text-[#7E9387] opacity-60"
                          }`}
                        >
                          <span>2. Undergrowth Trail (Ranger)</span>
                          <span className="font-mono text-[10px]">50 &lt;= xp &lt; 100</span>
                        </div>
                        <div
                          className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                            sliderXp >= 100
                              ? "bg-[#F3EBF9] border-[#9F7AEA] font-bold text-[#6B46C1]"
                              : "bg-white border-[#E2EAE5] text-[#7E9387] opacity-60"
                          }`}
                        >
                          <span>3. Deep Grove (Guardian)</span>
                          <span className="font-mono text-[10px]">xp &gt;= 100</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STAGE 3: Mini-game 2 */}
            {activeStage === 3 && (
              <div className="space-y-4">
                {isMission3 ? (
                  /* Mission 3: Text or Number? Classification */
                  <div className="space-y-3">
                    <p className="text-xs text-[#526B5F] leading-relaxed">
                      Classify each Python expression as a <strong>str</strong> (text) or <strong>int</strong> (whole number):
                    </p>
                    <div className="space-y-2.5">
                      {[
                        { id: "Alex", label: '"Alex"' },
                        { id: "input()", label: 'input("Enter name: ")' },
                        { id: "int(input())", label: 'int(input("Level: "))' },
                        { id: "int('42')", label: "int('42')" },
                        { id: "'100'", label: '"100"' }
                      ].map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 bg-[#F8FAF8] border border-[#DEECE3] rounded-xl text-xs"
                        >
                          <span className="font-mono font-bold text-[#172E26]">{item.label}</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                soundEngine.playClick();
                                setTypeMatches((prev) => ({ ...prev, [item.id]: "str" }));
                              }}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                typeMatches[item.id] === "str"
                                  ? "bg-[#2D6A4F] text-white shadow-sm"
                                  : "bg-[#FFFFFF] border border-[#CBD8D2] text-[#556E62] hover:bg-[#EEF5F1]"
                              }`}
                            >
                              str
                            </button>
                            <button
                              onClick={() => {
                                soundEngine.playClick();
                                setTypeMatches((prev) => ({ ...prev, [item.id]: "int" }));
                              }}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                typeMatches[item.id] === "int"
                                  ? "bg-[#2D6A4F] text-white shadow-sm"
                                  : "bg-[#FFFFFF] border border-[#CBD8D2] text-[#556E62] hover:bg-[#EEF5F1]"
                              }`}
                            >
                              int
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Mission 4: Condition Detective */
                  <div className="space-y-3">
                    <p className="text-xs text-[#526B5F] leading-relaxed">
                      Determine whether each conditional expression evaluates to <strong>True</strong> or <strong>False</strong>:
                    </p>
                    <div className="space-y-2.5">
                      {[
                        { id: "18 == 18", label: "18 == 18" },
                        { id: "45 >= 50", label: "45 >= 50" },
                        { id: "50 >= 50", label: "50 >= 50 (Boundary test!)" },
                        { id: "Scout != Guardian", label: '"Scout" != "Guardian"' }
                      ].map((q) => (
                        <div
                          key={q.id}
                          className="flex items-center justify-between p-3 bg-[#F8FAF8] border border-[#DEECE3] rounded-xl text-xs"
                        >
                          <span className="font-mono font-bold text-[#172E26]">{q.label}</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                soundEngine.playClick();
                                setDetectiveAnswers((prev) => ({ ...prev, [q.id]: "True" }));
                              }}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                detectiveAnswers[q.id] === "True"
                                  ? "bg-[#2D6A4F] text-white shadow-sm"
                                  : "bg-[#FFFFFF] border border-[#CBD8D2] text-[#556E62] hover:bg-[#EEF5F1]"
                              }`}
                            >
                              True
                            </button>
                            <button
                              onClick={() => {
                                soundEngine.playClick();
                                setDetectiveAnswers((prev) => ({ ...prev, [q.id]: "False" }));
                              }}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                detectiveAnswers[q.id] === "False"
                                  ? "bg-[#2D6A4F] text-white shadow-sm"
                                  : "bg-[#FFFFFF] border border-[#CBD8D2] text-[#556E62] hover:bg-[#EEF5F1]"
                              }`}
                            >
                              False
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STAGE 4: Mini-game 3 (Repair) */}
            {activeStage === 4 && (
              <div className="space-y-3 text-xs text-[#526B5F] leading-relaxed">
                <p>
                  {isMission3
                    ? "The forest scanner crashed with a TypeError! Because input() returns text, adding an integer (+ 1) throws an error. Repair the script by converting the input to an integer using int()."
                    : "The branching terminal fails to compile. Repair the 3 syntax errors in the editor: use '==' for comparison instead of '=', ensure the elif line ends with a colon ':', and indent the print line."}
                </p>
                <div className="p-3 bg-[#FEF6E9] border border-[#FBE3C5] rounded-xl text-[11px] text-[#A05A18] flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    {isMission3
                      ? "Tip: Wrap access_code with int(access_code) or change the input line to int(input(...))."
                      : "Tip: Comparisons require double equals '=='. Single '=' is for assigning variables."}
                  </span>
                </div>
              </div>
            )}

            {/* STAGE 5: Mini-game 4 (Apply) */}
            {activeStage === 5 && (
              <div className="space-y-3 text-xs text-[#526B5F] leading-relaxed">
                <p>
                  {isMission3
                    ? "Build an Access Request script that captures an explorer's name and favorite number, calculates boosted power (+ 1), and prints both values."
                    : "Implement the three-tier rank logic: xp < 50 prints 'Rank: Scout', xp < 100 prints 'Rank: Ranger', and else prints 'Rank: Guardian'."}
                </p>
              </div>
            )}

            {/* STAGE 6: Boss Battle */}
            {activeStage === 6 && (
              <div className="space-y-4 text-xs text-[#526B5F] leading-relaxed">
                <div className="p-3.5 bg-[#FFF9EE] border border-[#F5E2B3] rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 font-bold text-[#8C621F]">
                    <Award className="w-4 h-4 text-[#D97706]" />
                    <span>Boss Battle Challenge</span>
                  </div>
                  <p className="text-[11px] text-[#9A6D27] leading-relaxed">
                    {isMission3
                      ? "Calibrate the Ancient Gate terminal! Prompt for explorer name with input(), prompt for clearance level as an integer with int(input()), and print 'Access Granted: <name>' and 'Security Level: <level>'."
                      : "Restore the Living Forest Routes! Your code will be tested against the full 6-case boundary suite: 0, 49, 50, 99, 100, and 150 XP. Ensure all branches evaluate correctly!"}
                  </p>
                </div>

                {/* Boundary Test Results Table for Mission 4 */}
                {!isMission3 && boundaryResults.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="text-[11px] font-bold text-[#172E26] uppercase tracking-wider">
                      Boundary Edge Case Test Results:
                    </div>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto font-mono text-[10px]">
                      {boundaryResults.map((r, idx) => (
                        <div
                          key={idx}
                          className={`p-2 rounded-xl border flex items-center justify-between ${
                            r.passed
                              ? "bg-[#E8F5E9] border-[#B7E4C7] text-[#2D6A4F]"
                              : "bg-[#FEF2F2] border-[#FECACA] text-[#DC2626]"
                          }`}
                        >
                          <div>
                            <span className="font-bold">{r.name}:</span> {r.output}
                          </div>
                          <span className="font-bold">{r.passed ? "PASS" : "FAIL"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Nova Mascot Wisdom */}
            <div className="pt-3 border-t border-[#EDF3ED] flex items-center gap-3">
              <NovaMascot size={36} mood={validationStatus === "success" ? "celebrate" : "happy"} />
              <div className="text-[11px] text-[#476053] italic">
                {currentMission.novaTip}
              </div>
            </div>
          </div>

          {/* Hints Accordion */}
          <div className="bg-[#FFFFFF] border border-[#DEECE3] rounded-3xl p-5 shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-black text-[#172E26]">
                <Lightbulb className="w-4 h-4 text-[#ECA752]" />
                <span>Expedition Hints ({revealedHints}/{currentMission.hints.length})</span>
              </div>
              {revealedHints < currentMission.hints.length && (
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setRevealedHints((prev) => prev + 1);
                  }}
                  className="text-[11px] font-bold text-[#2D6A4F] hover:underline"
                >
                  Reveal Hint
                </button>
              )}
            </div>

            {revealedHints === 0 ? (
              <p className="text-[11px] text-[#7E9387]">
                Stuck on a syntax rule or operator? Unlock a hint without penalty.
              </p>
            ) : (
              <div className="space-y-2">
                {currentMission.hints.slice(0, revealedHints).map((h, i) => (
                  <div key={i} className="p-2.5 bg-[#FEF9EE] border border-[#FBE6B8] rounded-xl text-xs text-[#8A5A1B]">
                    {h}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code Editor & Simulated Interactive Terminal */}
        <div className="lg:col-span-7 space-y-6">
          {/* Code Editor Panel */}
          <div className="bg-[#1E2922] border border-[#2D3F34] rounded-3xl overflow-hidden shadow-soft flex flex-col">
            {/* Editor Top Bar */}
            <div className="px-5 py-3.5 bg-[#17221B] border-b border-[#28382E] flex items-center justify-between text-xs text-[#A2BAAD]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#E57373]" />
                <span className="w-3 h-3 rounded-full bg-[#FFB74D]" />
                <span className="w-3 h-3 rounded-full bg-[#81C784]" />
                <span className="ml-2 font-mono text-[11px] text-[#D8E6DE]">
                  {isMission3 ? "security_gate.py" : "user_terminal.py"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    // Reset to default stage code
                    if (isMission3) {
                      if (activeStage === 1) setCode(`# Security Gate Protocol\nname = input("Enter explorer name: ")\nclearance = int(input("Enter clearance level: "))\nprint("Access granted for:", name)\nprint("Clearance level:", clearance)`);
                      if (activeStage === 2) setCode(`# Interactive Gate Activation\npasscode = input("Enter gate password: ")\nprint("Verifying:", passcode)\nprint("Gate mechanism unlocked!")`);
                      if (activeStage === 3) setCode(`# Type Classification in Python\nname = "Nova"            # str\nlevel = 2                # int\nuser_input = input()     # str (always!)\nconverted = int("42")    # int`);
                      if (activeStage === 4) setCode(`# Malfunctioning Scanner - Fix the calculation error!\naccess_code = input("Enter numeric access code: ")\n\n# Bug: access_code is a string! Convert it to int before adding\nnext_code = access_code + 1\n\nprint("Next clearance code:", next_code)`);
                      if (activeStage === 5) setCode(`# Build your Access Request:\nname = input("Enter your name: ")\nfav_num = int(input("Enter favorite number: "))\nboosted_power = fav_num + 1\nprint("Explorer:", name)\nprint("Boosted Power:", boosted_power)`);
                      if (activeStage === 6) setCode(`# Boss Battle: Open the Ancient Gate\nname = input("Enter explorer name: ")\nclearance_level = int(input("Enter clearance level: "))\nprint("Access Granted:", name)\nprint("Security Level:", clearance_level)`);
                    } else {
                      if (activeStage === 1) setCode(`# Three-Rank System\nxp = 75\n\nif xp < 50:\n    print("Route: Canopy Trail")\nelif xp < 100:\n    print("Route: Undergrowth Trail")\nelse:\n    print("Route: Deep Grove")`);
                      if (activeStage === 2) setCode(`# Path Selection Demonstration\nxp = ${sliderXp}\n\nif xp < 50:\n    print("Path chosen: Canopy Trail (Scout)")\nelif xp < 100:\n    print("Path chosen: Undergrowth Trail (Ranger)")\nelse:\n    print("Path chosen: Deep Grove (Guardian)")`);
                      if (activeStage === 3) setCode(`# Condition Detective\nscore = 50\nprint("score == 50 ->", score == 50)\nprint("score < 50  ->", score < 50)\nprint("score >= 50 ->", score >= 50)\nprint("score != 0  ->", score != 0)`);
                      if (activeStage === 4) setCode(`# Broken Branching Logic - Fix the 3 syntax errors!\nxp = 50\n\nif xp = 50:\n    print("Exact 50 XP!")\nelif xp > 100\n    print("Master Rank")\nelse:\nprint("Under 100 XP")`);
                      if (activeStage === 5) setCode(`# Build Three-Rank System\nxp = 75\n\nif xp < 50:\n    print("Rank: Scout")\nelif xp < 100:\n    print("Rank: Ranger")\nelse:\n    print("Rank: Guardian")`);
                      if (activeStage === 6) setCode(`# Boss Battle: Restore Forest Routes\nxp = int(input("Enter explorer XP: "))\n\nif xp < 50:\n    print("Path: Canopy Trail")\nelif xp < 100:\n    print("Path: Undergrowth Trail")\nelse:\n    print("Path: Deep Grove")`);
                    }
                  }}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                  title="Reset code template"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Code Textarea with line numbers */}
            <div className="relative flex min-h-[260px] bg-[#1E2922]">
              {/* Line Numbers */}
              <div className="py-4 px-3 select-none text-right font-mono text-xs text-[#526B5D] bg-[#17221B]/40 border-r border-[#28382E]">
                {code.split("\n").map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              {/* Textarea */}
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="flex-1 bg-transparent p-4 font-mono text-xs text-[#E8F5EE] leading-relaxed resize-none focus:outline-none"
              />
            </div>

            {/* Action Bar */}
            <div className="p-4 bg-[#17221B] border-t border-[#28382E] flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => handleRunCode()}
                disabled={isRunning}
                className="py-2.5 px-5 rounded-xl bg-[#2D6A4F] hover:bg-[#20523C] text-white font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-sm disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isRunning ? "Running..." : "Run Code"}</span>
              </button>

              <button
                onClick={handleValidateStage}
                disabled={isRunning}
                className="py-2.5 px-6 rounded-xl bg-[#52B788] hover:bg-[#40916C] text-[#0C2921] font-black text-xs flex items-center gap-2 transition-all active:scale-95 shadow-sm disabled:opacity-50"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Validate & Check Solution</span>
              </button>
            </div>
          </div>

          {/* Interactive Simulated Python Terminal Console */}
          <div className="bg-[#121A15] border border-[#243329] rounded-3xl overflow-hidden shadow-soft flex flex-col min-h-[220px]">
            <div className="px-5 py-3 bg-[#0B120E] border-b border-[#1E2C22] flex items-center justify-between text-xs text-[#8DA697]">
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-4 h-4 text-[#52B788]" />
                <span className="font-mono text-[11px] text-[#A8C7B5]">NEXA Terminal · Python 3.12</span>
              </div>
              <button
                onClick={() => {
                  setTerminalOutput("");
                  setTerminalError(null);
                }}
                className="text-[10px] text-[#698273] hover:text-white"
              >
                Clear
              </button>
            </div>

            <div className="p-4 flex-1 font-mono text-xs text-[#E0EFE5] leading-relaxed space-y-2 overflow-y-auto max-h-64">
              {terminalOutput && (
                <div className="whitespace-pre-wrap">{terminalOutput}</div>
              )}

              {/* Interactive Input Prompt Bar inside Terminal */}
              {awaitingInput && (
                <form
                  onSubmit={handleInputSubmit}
                  className="flex items-center gap-2 bg-[#1C2C22] border border-[#3E654E] p-2.5 rounded-xl animate-fadeIn"
                >
                  <span className="text-[#52B788] font-bold">{inputPromptText}</span>
                  <input
                    type="text"
                    autoFocus
                    value={userEnteredText}
                    onChange={(e) => setUserEnteredText(e.target.value)}
                    placeholder="Type value & hit Enter..."
                    className="flex-1 bg-transparent text-white focus:outline-none text-xs font-mono"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 bg-[#2D6A4F] hover:bg-[#3D8262] text-white text-[11px] font-bold rounded-lg flex items-center gap-1"
                  >
                    <span>Submit</span>
                    <Send className="w-3 h-3" />
                  </button>
                </form>
              )}

              {terminalError && (
                <div className="p-3 bg-[#381616] border border-[#782828] rounded-xl text-[#FFBABA] text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-[#FFA8A8]">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Error Output:</span>
                  </div>
                  <div className="whitespace-pre-wrap">{terminalError}</div>
                </div>
              )}

              {!terminalOutput && !terminalError && !awaitingInput && (
                <div className="text-[#55695D] italic">
                  Press 'Run Code' or 'Validate & Check Solution' to execute script.
                </div>
              )}
            </div>

            {/* Validation Feedback Banner */}
            {validationStatus && (
              <div
                className={`p-4 border-t flex items-center justify-between gap-3 text-xs ${
                  validationStatus === "success"
                    ? "bg-[#183626] border-[#2D6A4F] text-[#B7E4C7]"
                    : "bg-[#331D1D] border-[#682F2F] text-[#FCA5A5]"
                }`}
              >
                <div className="flex items-center gap-2">
                  {validationStatus === "success" ? (
                    <CheckCircle2 className="w-5 h-5 text-[#52B788] flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-[#F87171] flex-shrink-0" />
                  )}
                  <span className="font-medium leading-relaxed">{validationMessage}</span>
                </div>

                {validationStatus === "success" && activeStage < 6 && (
                  <button
                    onClick={handleNextStage}
                    className="py-1.5 px-3.5 rounded-xl bg-[#52B788] text-[#0A2218] font-black text-xs hover:bg-[#40916C] hover:text-white transition-all flex items-center gap-1 flex-shrink-0 shadow-sm"
                  >
                    <span>Next Stage</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Celebration Modal on Boss Battle Victory */}
      <CelebrationModal
        isOpen={showCelebration}
        levelData={currentMission}
        rewardXP={60}
        unlockedBadge={currentMission.badge}
        onNextMission={handleCelebrationContinue}
        onReplay={() => {
          setShowCelebration(false);
          setActiveStage(1);
        }}
        onBackToMap={() => {
          setShowCelebration(false);
          navigateTo("eco_woods");
        }}
      />
    </div>
  );
}
