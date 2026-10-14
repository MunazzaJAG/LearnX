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
  User,
  Hash,
  Send,
  RefreshCw
} from "lucide-react";
import { useGameState } from "../context/GameStateContext";
import { LEVELS_DATA } from "../data/curriculum";
import { runPythonCode, extractPythonScope } from "../utils/pythonRunner";
import { soundEngine } from "../utils/audio";
import { NovaMascot, OceanReefArt } from "../components/BiomeVectorArt";
import { CelebrationModal } from "../components/CelebrationModal";

export function UnderseaMissionView({ missionId = 1 }) {
  const {
    completedMissions,
    completeMission,
    navigateTo,
    profile,
    xp
  } = useGameState();

  // Active mission level (1 or 2)
  const currentMission = LEVELS_DATA.find((m) => m.level === missionId) || LEVELS_DATA[0];
  const isMission1 = currentMission.level === 1;

  // Active stage (1 to 5)
  // Stage 1: Learn & Understand (Interactive Worked Example)
  // Stage 2: Mini-game 1 (Predict the Transmission / Recover Explorer Data)
  // Stage 3: Mini-game 2 (Repair Broken Terminal / Match Data Types)
  // Stage 4: Mini-game 3 (Write First Transmission / Build Identity Card)
  // Stage 5: Mini-game 4 / Boss Battle (Final Challenge & Certification)
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

  // Stage 2: Prediction game state
  const [predictSelected, setPredictSelected] = useState(null);
  const [predictResult, setPredictResult] = useState(null);

  // Stage 3: Type matching game state (Mission 2)
  const [typeMatches, setTypeMatches] = useState({});
  const [typeMatchFeedback, setTypeMatchFeedback] = useState(null);

  // Stage 4 / Mission 2: Parsed explorer card attributes
  const [parsedCard, setParsedCard] = useState({
    name: profile.name || "Alex",
    language: "Python",
    xp: 50
  });

  const isCompleted = completedMissions.includes(currentMission.level);

  // Reset & load default code when stage or mission changes
  useEffect(() => {
    setTerminalOutput("");
    setTerminalError(null);
    setValidationStatus(null);
    setValidationMessage("");
    setRevealedHints(0);

    if (isMission1) {
      if (activeStage === 1) {
        setCode(
          `# First message to NEXA\nprint("Welcome to NEXA")\nprint("System Status: Online")\n# This is a comment`
        );
      } else if (activeStage === 2) {
        // Predict
        setCode(
          `# Transmission packet preview\nprint("NEXA Terminal")\n# print("Offline")\nprint("Status: Active")`
        );
      } else if (activeStage === 3) {
        // Repair broken terminal
        setCode(
          `# Broken Terminal Script - Fix the errors!\nprin("Welcome to NEXA")\nprint("Terminal connected)`
        );
      } else if (activeStage === 4) {
        // Write transmission
        setCode(
          `# Write your own message to NEXA below\n# Include a comment, your explorer name, and "Mission started"\n\n`
        );
      } else if (activeStage === 5) {
        // Boss Battle
        setCode(
          `# Boss Battle: Restore NEXA\n# Write 3 print statements: hub name, system status, mission status\n\n`
        );
      }
    } else {
      // Mission 2: Identity
      if (activeStage === 1) {
        setCode(
          `name = "${profile.name || "Alex"}"\nage = 18\nxp = 50\nis_explorer = True\n\nprint("Name:", name)\nprint("Age:", age)\nprint("XP:", xp)\nprint("Explorer:", is_explorer)`
        );
      } else if (activeStage === 2) {
        // Recover data
        setCode(
          `# Recover Explorer Registry\nname = "${profile.name || "Alex"}"\nage = 18\nxp = 50\nstatus = True\n\nprint("Explorer:", name)\nprint("XP:", xp)`
        );
      } else if (activeStage === 3) {
        // Match types
        setCode(
          `# Python Built-in Data Types\nstr_data = "Alex"       # String\nint_data = 18           # Integer\nfloat_data = 3.14       # Float\nbool_data = True        # Boolean`
        );
      } else if (activeStage === 4) {
        // Build identity card
        setCode(
          `# Create your Explorer Identity Card variables:\nname = "${profile.name || "Alex"}"\nlanguage = "Python"\nxp = 50\n\n# Print with clear labels:\nprint("Name:", name)\nprint("Language:", language)\nprint("XP:", xp)`
        );
      } else if (activeStage === 5) {
        // Boss Battle: Identity Found
        setCode(
          `# Boss Battle: Identity Found\n# Store at least 3 variables and print them with clear labels\nname = "${profile.name || "Alex"}"\nrole = "Explorer"\nstatus = "Authorized"\n\nprint("Name:", name)\nprint("Role:", role)\nprint("Status:", status)`
        );
      }
    }
  }, [activeStage, missionId]);

  // Execute Python Code in Live Runner
  const handleRunCode = async () => {
    setIsRunning(true);
    setTerminalError(null);
    setTerminalOutput("");
    setValidationStatus(null);
    setValidationMessage("");
    soundEngine.playClick();

    try {
      const res = await runPythonCode(code);
      setTerminalOutput(res.output);
      if (res.error) {
        setTerminalError(res.error);
        soundEngine.playIncorrect();
      } else {
        // Update parsedCard if variables available
        if (res.scope) {
          setParsedCard((prev) => ({
            ...prev,
            ...res.scope
          }));
        }
      }
    } catch (err) {
      setTerminalError(err.message);
      soundEngine.playIncorrect();
    } finally {
      setIsRunning(false);
    }
  };

  // Stage Validation Logic
  const handleValidateStage = async () => {
    setIsRunning(true);
    setTerminalError(null);
    setValidationStatus(null);
    setValidationMessage("");
    soundEngine.playClick();

    try {
      const res = await runPythonCode(code);
      setTerminalOutput(res.output);

      if (res.error) {
        setTerminalError(res.error);
        setValidationStatus("error");
        setValidationMessage(
          "Your code encountered an error when executing. Review the error details below."
        );
        soundEngine.playIncorrect();
        setIsRunning(false);
        return;
      }

      const out = res.output.trim();
      const scope = res.scope || extractPythonScope(code);

      // Validate based on mission & stage
      if (isMission1) {
        if (activeStage === 1) {
          // Worked example run
          if (out.includes("Welcome to NEXA") && out.includes("Online")) {
            passStage("Great job! You executed your first Python statements successfully.");
          } else {
            failStage("Ensure your code prints both 'Welcome to NEXA' and 'System Status: Online'.");
          }
        } else if (activeStage === 2) {
          // Predict
          if (predictSelected === 1) {
            passStage(
              "Correct! Lines starting with # are comments and are ignored by Python. The terminal printed 'NEXA Terminal' and 'Status: Active'."
            );
          } else {
            failStage("Not quite! Remember that Python completely skips lines that start with '#'. Try again.");
          }
        } else if (activeStage === 3) {
          // Repair broken terminal
          const hasPrin = code.includes("prin(");
          const hasUnclosed = code.includes('print("Terminal connected)') || code.includes('("Terminal connected)');
          if (!hasPrin && !hasUnclosed && out.includes("Welcome to NEXA") && out.includes("Terminal connected")) {
            passStage("Terminal repaired! You fixed the spelling of print() and added the closing quotation mark.");
          } else {
            failStage("The terminal still has syntax issues. Check for misspelled 'prin' and missing closing quotes.");
          }
        } else if (activeStage === 4) {
          // Write transmission
          const hasComment = code.split("\n").some((l) => l.trim().startsWith("#"));
          const hasMissionStarted = out.toLowerCase().includes("mission started");
          const hasName = out.length > 15;

          if (hasComment && hasMissionStarted && hasName) {
            passStage("Transmission verified! Your custom Python program communicated with the ocean hub.");
          } else {
            failStage(
              "Ensure your code includes: 1) a comment starting with #, 2) your explorer name, 3) the phrase 'Mission started'."
            );
          }
        } else if (activeStage === 5) {
          // Boss Battle: Restore NEXA
          // Requirements:
          // 1. Contains three valid print statements
          // 2. Output includes hub name
          // 3. Output includes system status
          // 4. Output includes mission status
          const printStatements = (code.match(/print\s*\(/g) || []).length;
          const outLower = out.toLowerCase();
          const hasHub = outLower.includes("nexa") || outLower.includes("ocean") || outLower.includes("hub");
          const hasStatus = outLower.includes("status") || outLower.includes("online") || outLower.includes("active");
          const hasMission = outLower.includes("mission") || outLower.includes("started") || outLower.includes("restored");

          if (printStatements >= 3 && hasHub && hasStatus && hasMission) {
            passStage("NEXA Ocean Research Hub Fully Restored! All 3 communication lines are live.");
            // Complete Mission 1
            completeMission(1, 50, currentMission.badge);
            setShowCelebration(true);
          } else {
            let reasons = [];
            if (printStatements < 3) reasons.push("Write at least 3 print() statements (currently found: " + printStatements + ")");
            if (!hasHub) reasons.push("Include the hub name (e.g. 'NEXA Ocean Research Hub') in one output");
            if (!hasStatus) reasons.push("Include the system status (e.g. 'Status: Online') in one output");
            if (!hasMission) reasons.push("Include the mission status (e.g. 'Mission: Active') in one output");
            failStage("Criteria not yet met: " + reasons.join("; "));
          }
        }
      } else {
        // Mission 2: Identity
        if (activeStage === 1) {
          if (out.includes("Name:") && out.includes("Age:")) {
            passStage("Worked example run successfully! Variables stored and displayed.");
          } else {
            failStage("Run the worked example to observe how variables are assigned and printed.");
          }
        } else if (activeStage === 2) {
          // Recover data
          if (scope.name && scope.xp !== undefined && out.includes("Explorer:") && out.includes("XP:")) {
            passStage("Explorer data recovered! Memory registers assigned successfully.");
          } else {
            failStage("Assign values to name and xp, then print both with labels.");
          }
        } else if (activeStage === 3) {
          // Match data types
          const correct =
            typeMatches["Alex"] === "str" &&
            typeMatches["18"] === "int" &&
            typeMatches["3.14"] === "float" &&
            typeMatches["True"] === "bool";

          if (correct) {
            passStage("All data types matched correctly! str (text), int (whole number), float (decimal), and bool (True/False).");
          } else {
            failStage("Some classifications need adjustment. Match each value to its exact Python type.");
          }
        } else if (activeStage === 4) {
          // Build identity card
          const hasName = !!scope.name;
          const hasLang = !!scope.language;
          const hasXp = scope.xp !== undefined;
          const hasLabels = out.toLowerCase().includes("name") && out.toLowerCase().includes("xp");

          if (hasName && hasLang && hasXp && hasLabels) {
            passStage("Identity Card Generated! Your variables successfully populated the visual badge.");
          } else {
            failStage(
              "Store variables for name, language, and xp, then print all three with clear labels."
            );
          }
        } else if (activeStage === 5) {
          // Boss Battle: Identity Found
          const varCount = Object.keys(scope).length;
          const lines = out.split("\n").filter((l) => l.trim().length > 0);

          if (varCount >= 3 && lines.length >= 3) {
            passStage("Identity Found! Your explorer credentials have been permanently verified in NEXA memory.");
            // Complete Mission 2
            completeMission(2, 50, currentMission.badge);
            setShowCelebration(true);
          } else {
            failStage(
              "Ensure you define at least 3 variables (currently found: " +
                varCount +
                ") and print all 3 with clear labels."
            );
          }
        }
      }
    } catch (err) {
      setTerminalError(err.message);
      failStage("Error running code: " + err.message);
    } finally {
      setIsRunning(false);
    }
  };

  const passStage = (message) => {
    setValidationStatus("success");
    setValidationMessage(message);
    soundEngine.playVictory();
    if (!completedStages.includes(activeStage)) {
      setCompletedStages((prev) => [...prev, activeStage]);
    }
  };

  const failStage = (message) => {
    setValidationStatus("error");
    setValidationMessage(message);
    soundEngine.playIncorrect();
  };

  const handleNextStage = () => {
    soundEngine.playClick();
    if (activeStage < 5) {
      setActiveStage((prev) => prev + 1);
    }
  };

  const handleRevealNextHint = () => {
    soundEngine.playHint();
    setRevealedHints((prev) => Math.min(currentMission.hints.length, prev + 1));
  };

  // Stage 1 Walkthrough Lines
  const mission1Lines = [
    { code: '# First message to NEXA', note: "Comment: Starts with '#'. Python ignores this completely. Used to document code for humans." },
    { code: 'print("Welcome to NEXA")', note: "print() Function: Displays text inside quotes to the terminal screen." },
    { code: 'print("System Status: Online")', note: "Second print statement: Displays a second line of status text." },
    { code: '# This is a comment', note: "Final comment: Clarifies the end of the initialization block." }
  ];

  const mission2Lines = [
    { code: 'name = "Alex"', note: "String (str): Text surrounded by quotes stored in the variable 'name'." },
    { code: 'age = 18', note: "Integer (int): Whole number without decimals stored in 'age'." },
    { code: 'xp = 50', note: "Integer (int): Numeric points stored in variable 'xp'." },
    { code: 'is_explorer = True', note: "Boolean (bool): A logical True or False value stored in 'is_explorer'." },
    { code: 'print("Name:", name)', note: "Multiple arguments: print() displays both the label and the variable value separated by a space." }
  ];

  const walkthroughLines = isMission1 ? mission1Lines : mission2Lines;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Header Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#FFFFFF] border border-[#DEECE3] rounded-3xl px-6 py-4 shadow-soft">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateTo("undersea_reef")}
            className="flex items-center gap-1.5 text-xs font-bold text-[#355346] hover:text-[#172E26] bg-[#F4F7F4] hover:bg-[#EAEFEA] px-3.5 py-2 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#2A6B53]" />
            <span>Undersea Reef</span>
          </button>

          <div className="h-6 w-px bg-[#E4ECE4]" />

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#1E7268] bg-[#E6F5F4] px-2.5 py-0.5 rounded-full">
                Undersea Reef · Mission {currentMission.level}
              </span>
              <span className="text-xs font-semibold text-[#8C9C92]">
                {isMission1 ? "Stage " + activeStage + " of 5" : "Stage " + activeStage + " of 5"}
              </span>
            </div>
            <h1 className="text-lg font-black text-[#172E26] tracking-tight">
              {currentMission.title}: {currentMission.subtitle}
            </h1>
          </div>
        </div>

        {/* Right Badges & Stats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#2A6B53] bg-[#EBF5EE] px-3 py-1.5 rounded-xl">
            <Zap className="w-3.5 h-3.5 fill-[#2A6B53]" />
            <span>+50 XP</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#7E57C2] bg-[#F5EFFB] px-3 py-1.5 rounded-xl border border-[#E9DDF5]">
            <Award className="w-3.5 h-3.5" />
            <span>{currentMission.badge.name}</span>
          </div>

          {isCompleted && (
            <span className="text-xs font-bold text-[#2A6B53] bg-[#E6F5EC] px-3 py-1.5 rounded-xl flex items-center gap-1 border border-[#BEE4CE]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Completed</span>
            </span>
          )}
        </div>
      </div>

      {/* 5-Stage Cognitive Learning Journey Navigation Bar */}
      <div className="bg-[#FFFFFF] border border-[#DEECE3] rounded-2xl p-2.5 shadow-soft flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {[
            { id: 1, label: "1. Learn Concept", bloom: "Remember & Understand" },
            { id: 2, label: isMission1 ? "2. Predict Transmission" : "2. Recover Data", bloom: "Analyze" },
            { id: 3, label: isMission1 ? "3. Repair Terminal" : "3. Match Data Types", bloom: "Apply / Analyze" },
            { id: 4, label: isMission1 ? "4. Write Message" : "4. Identity Card", bloom: "Apply" },
            { id: 5, label: "5. Boss Battle", bloom: "Create" }
          ].map((stg) => {
            const isActive = activeStage === stg.id;
            const isDone = completedStages.includes(stg.id);
            return (
              <button
                key={stg.id}
                onClick={() => {
                  soundEngine.playClick();
                  setActiveStage(stg.id);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#2A6B53] text-white shadow-soft"
                    : isDone
                    ? "bg-[#EBF5EE] text-[#1E5440] hover:bg-[#DFEDE3]"
                    : "bg-[#F7FAF8] text-[#556F61] hover:bg-[#EDF5F0]"
                }`}
              >
                {isDone ? (
                  <Check className="w-3.5 h-3.5 stroke-[3] text-current" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-current opacity-60" />
                )}
                <span>{stg.label}</span>
              </button>
            );
          })}
        </div>

        <span className="text-[11px] font-semibold text-[#7E9387] hidden lg:block pr-2">
          Bloom's Taxonomy Framework
        </span>
      </div>

      {/* STAGE 1: LEARN & UNDERSTAND ZONE (Interactive Line-by-Line Walkthrough) */}
      {activeStage === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
          {/* Left Briefing Card */}
          <div className="lg:col-span-5 space-y-4">
            {/* Story & Lore */}
            <div className="bg-[#FFFFFF] border border-[#DEECE3] rounded-3xl p-6 shadow-soft space-y-4">
              <div className="flex items-start gap-3.5">
                <NovaMascot size={46} mood="happy" className="flex-shrink-0" />
                <div>
                  <div className="text-[10px] font-black tracking-widest text-[#2A6B53] uppercase mb-0.5">
                    NOVA · Expedition Transmission
                  </div>
                  <p className="text-xs text-[#355143] leading-relaxed italic">
                    “{currentMission.story}”
                  </p>
                </div>
              </div>
            </div>

            {/* Core Learning Concepts Card */}
            <div className="bg-[#FFFFFF] border border-[#DEECE3] rounded-3xl p-6 shadow-soft space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#172E26]">
                <BookOpen className="w-4 h-4 text-[#2A6B53]" />
                <span>Python Fundamentals: {currentMission.pythonDocTopic}</span>
              </div>
              <p className="text-xs text-[#526B5F] leading-relaxed">
                {currentMission.teach}
              </p>

              <div className="p-3 bg-[#F0F7F4] border border-[#D5EADB] rounded-2xl text-xs space-y-1.5 text-[#2A5A48]">
                <div className="font-bold">Key Rules to Remember:</div>
                <ul className="space-y-1 list-disc list-inside text-[11px]">
                  {isMission1 ? (
                    <>
                      <li><code>print()</code> outputs text to the screen.</li>
                      <li>Text must be surrounded by quotation marks: <code>"..."</code>.</li>
                      <li>Comments start with <code>#</code> and are ignored by Python.</li>
                    </>
                  ) : (
                    <>
                      <li>Variables store data values using <code>=</code> assignment.</li>
                      <li>Python detects types: <code>str</code>, <code>int</code>, <code>float</code>, <code>bool</code>.</li>
                      <li>Print multiple values separated by commas: <code>print("Name:", name)</code>.</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* Line-by-Line Progressive Walkthrough Controller */}
            <div className="bg-[#FFFFFF] border border-[#DEECE3] rounded-3xl p-6 shadow-soft space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-[#172E26]">
                <span>Line-by-Line Breakdown</span>
                <span className="text-[11px] text-[#7E9387]">
                  Line {explainedLineIndex + 1} of {walkthroughLines.length}
                </span>
              </div>

              <div className="p-3 bg-[#F7FAF8] border border-[#E2EBE5] rounded-2xl space-y-2">
                <code className="text-xs font-mono font-bold text-[#1E7268] block">
                  {walkthroughLines[explainedLineIndex].code}
                </code>
                <p className="text-xs text-[#526B5F] leading-relaxed">
                  {walkthroughLines[explainedLineIndex].note}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => setExplainedLineIndex((prev) => Math.max(0, prev - 1))}
                  disabled={explainedLineIndex === 0}
                  className="px-3 py-1.5 text-xs font-bold text-[#526B5F] bg-[#F0F4F1] hover:bg-[#E5ECE7] rounded-xl disabled:opacity-40 transition-colors"
                >
                  Previous Line
                </button>
                <button
                  onClick={() =>
                    setExplainedLineIndex((prev) =>
                      Math.min(walkthroughLines.length - 1, prev + 1)
                    )
                  }
                  disabled={explainedLineIndex === walkthroughLines.length - 1}
                  className="px-3 py-1.5 text-xs font-bold text-[#2A6B53] bg-[#EBF5EE] hover:bg-[#DDEEE2] rounded-xl disabled:opacity-40 transition-colors"
                >
                  Next Line
                </button>
              </div>
            </div>
          </div>

          {/* Right Live Runner */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#FFFFFF] border border-[#DEECE3] rounded-3xl p-5 shadow-soft space-y-3">
              <div className="flex items-center justify-between border-b border-[#EDF3ED] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#FF8080]" />
                  <span className="w-3 h-3 rounded-full bg-[#FFD166]" />
                  <span className="w-3 h-3 rounded-full bg-[#06D6A0]" />
                  <span className="text-xs font-mono font-bold text-[#5A7063] ml-2">
                    worked_example.py
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#86998E]">Python 3.12</span>
              </div>

              <div className="flex bg-[#FBFDFB] border border-[#E2EAE2] rounded-2xl overflow-hidden font-mono text-xs">
                <div className="w-10 py-3 bg-[#F4F7F4] border-r border-[#E2EAE2] text-[#9FB3A6] text-right pr-2.5 select-none leading-relaxed">
                  {code.split("\n").map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  spellCheck="false"
                  rows={8}
                  className="w-full p-3 bg-transparent text-[#172E26] focus:outline-none resize-y leading-relaxed font-mono"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="py-2.5 px-5 rounded-2xl bg-[#E8F3ED] hover:bg-[#D8EADB] text-[#2A6B53] font-bold text-xs transition-all flex items-center gap-2 shadow-soft disabled:opacity-60"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isRunning ? "Running..." : "Run Example"}</span>
                </button>

                <button
                  onClick={handleValidateStage}
                  disabled={isRunning}
                  className="py-2.5 px-6 rounded-2xl bg-[#2A6B53] hover:bg-[#205541] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-60"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify Example</span>
                </button>
              </div>
            </div>

            {/* Terminal Console */}
            <div className="bg-[#192B23] border border-[#263D33] rounded-3xl p-5 text-white shadow-soft font-mono text-xs space-y-3">
              <div className="flex items-center justify-between text-[#88A696] text-[11px] border-b border-[#253D32] pb-2.5">
                <div className="flex items-center gap-2">
                  <TerminalIcon className="w-3.5 h-3.5 text-[#52B788]" />
                  <span>NEXA Ocean Hub Terminal</span>
                </div>
                <span className="text-[10px] text-[#597566]">stdout</span>
              </div>
              <div className="min-h-[100px] max-h-[180px] overflow-y-auto">
                {terminalOutput ? (
                  <pre className="text-[#D8EFE3] whitespace-pre-wrap leading-relaxed">
                    {terminalOutput}
                  </pre>
                ) : (
                  <div className="text-[#597566] italic">
                    Click 'Run Example' to execute the code and see terminal output...
                  </div>
                )}
                {terminalError && (
                  <div className="text-[#FFA494] bg-[#3B1E1A] p-2 rounded-xl border border-[#6B2E24] mt-2">
                    {terminalError}
                  </div>
                )}
              </div>
            </div>

            {/* Success Feedback Card */}
            {validationStatus === "success" && (
              <div className="bg-[#EAF7EE] border border-[#BDE3C8] rounded-2xl p-4 flex items-center justify-between text-xs animate-fadeIn">
                <div className="flex items-center gap-2.5 text-[#1B5738]">
                  <CheckCircle2 className="w-5 h-5 text-[#2A6B53] flex-shrink-0" />
                  <span className="font-semibold">{validationMessage}</span>
                </div>
                <button
                  onClick={handleNextStage}
                  className="py-2 px-4 rounded-xl bg-[#2A6B53] hover:bg-[#1E5440] text-white font-bold text-xs shadow-soft transition-all flex items-center gap-1.5 ml-3"
                >
                  <span>Next Activity</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}


      {/* STAGE 2: PREDICT THE TRANSMISSION (Mission 1) / RECOVER DATA (Mission 2) */}
      {activeStage === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-[#FFFFFF] border border-[#DEECE3] rounded-3xl p-6 shadow-soft space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1E7268] bg-[#E6F5F4] px-3 py-1.5 rounded-full w-max">
                <Brain className="w-4 h-4 text-[#2A9D8F]" />
                <span>Cognitive Tier: Analyze & Trace</span>
              </div>

              <h2 className="text-xl font-black text-[#172E26] tracking-tight">
                {isMission1 ? "Mini-game 1: Predict the Transmission" : "Mini-game 1: Recover the Explorer Data"}
              </h2>

              <p className="text-xs text-[#526B5F] leading-relaxed">
                {isMission1
                  ? "Before running code on the terminal, developers learn to trace execution line by line. Inspect the snippet and predict what output will appear."
                  : "NEXA's memory registers have missing values. Inspect the variables, determine the output, and assign the proper data types."}
              </p>

              {/* Code Snippet to Analyze */}
              <div className="bg-[#192B23] border border-[#2B4439] rounded-2xl p-4 text-white font-mono text-xs">
                <div className="text-[10px] text-[#52B788] mb-2 font-bold uppercase tracking-wider">
                  # Transmission Packet to Trace
                </div>
                <pre className="text-[#D8EFE3] leading-relaxed whitespace-pre-wrap">
                  {code}
                </pre>
              </div>
            </div>

            {/* Mission 1 Predict Options */}
            {isMission1 ? (
              <div className="bg-[#FFFFFF] border border-[#DEECE3] rounded-3xl p-6 shadow-soft space-y-3">
                <div className="text-xs font-bold text-[#172E26]">
                  Select the exact terminal output:
                </div>

                {[
                  { id: 0, text: "NEXA Terminal\nOffline\nStatus: Active" },
                  { id: 1, text: "NEXA Terminal\nStatus: Active" },
                  { id: 2, text: "Transmission packet preview\nNEXA Terminal" }
                ].map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => {
                      soundEngine.playClick();
                      setPredictSelected(opt.id);
                    }}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all font-mono text-xs flex items-center justify-between ${
                      predictSelected === opt.id
                        ? "border-[#2A6B53] bg-[#EBF5EE] text-[#1E5440] font-bold shadow-sm"
                        : "border-[#E4ECE4] bg-[#FFFFFF] text-[#4F685B] hover:bg-[#F9FAF9]"
                    }`}
                  >
                    <pre className="whitespace-pre-wrap">{opt.text}</pre>
                    <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">
                      {predictSelected === opt.id ? "✓" : ""}
                    </span>
                  </div>
                ))}

                <button
                  onClick={handleValidateStage}
                  disabled={predictSelected === null}
                  className="w-full py-3 rounded-2xl bg-[#2A6B53] hover:bg-[#205541] text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 mt-2"
                >
                  Verify Prediction
                </button>
              </div>
            ) : (
              /* Mission 2 Recover Data Tasks */
              <div className="bg-[#FFFFFF] border border-[#DEECE3] rounded-3xl p-6 shadow-soft space-y-3">
                <div className="text-xs font-bold text-[#172E26]">
                  Assign explorer variables in the editor to the right:
                </div>
                <ul className="text-xs text-[#526B5F] space-y-1 list-disc list-inside">
                  <li><code>name</code> (str): Your explorer name</li>
                  <li><code>xp</code> (int): Starting explorer XP (e.g. 50)</li>
                </ul>
                <button
                  onClick={handleValidateStage}
                  className="w-full py-3 rounded-2xl bg-[#3A86C8] hover:bg-[#2B6EA9] text-white font-bold text-xs shadow-md transition-all mt-2"
                >
                  Verify Explorer Data
                </button>
              </div>
            )}
          </div>

          {/* Right Editor & Terminal */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-[#FFFFFF] border border-[#DEECE3] rounded-3xl p-5 shadow-soft space-y-3">
              <div className="flex items-center justify-between border-b border-[#EDF3ED] pb-3">
                <span className="text-xs font-mono font-bold text-[#5A7063]">
                  {isMission1 ? "terminal_trace.py" : "explorer_recovery.py"}
                </span>
                <button
                  onClick={handleRunCode}
                  className="py-1.5 px-3 rounded-xl bg-[#E8F3ED] hover:bg-[#D8EADB] text-[#2A6B53] font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Test Run</span>
                </button>
              </div>

              <div className="flex bg-[#FBFDFB] border border-[#E2EAE2] rounded-2xl overflow-hidden font-mono text-xs">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  spellCheck="false"
                  rows={8}
                  className="w-full p-3 bg-transparent text-[#172E26] focus:outline-none resize-y leading-relaxed font-mono"
                />
              </div>
            </div>

            <div className="bg-[#192B23] border border-[#263D33] rounded-3xl p-5 text-white font-mono text-xs space-y-2">
              <div className="text-[11px] text-[#88A696] border-b border-[#253D32] pb-2">
                Actual Terminal Output
              </div>
              <pre className="text-[#D8EFE3] min-h-[80px] whitespace-pre-wrap leading-relaxed">
                {terminalOutput || "(Run or verify to see output)"}
              </pre>
            </div>

            {/* Validation Banner */}
            {validationStatus && (
              <div
                className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between ${
                  validationStatus === "success"
                    ? "bg-[#EAF7EE] border-[#BDE3C8] text-[#1B5738]"
                    : "bg-[#FDF2F0] border-[#F7C6BF] text-[#8C2E21]"
                }`}
              >
                <span>{validationMessage}</span>
                {validationStatus === "success" && (
                  <button
                    onClick={handleNextStage}
                    className="py-1.5 px-3 rounded-xl bg-[#2A6B53] text-white font-bold text-xs ml-3"
                  >
                    Continue
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}


      {/* STAGE 3: REPAIR BROKEN TERMINAL (Mission 1) / MATCH DATA TYPES (Mission 2) */}
      {activeStage === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-[#FFFFFF] border border-[#DEECE3] rounded-3xl p-6 shadow-soft space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#E76F51] bg-[#FDF0EC] px-3 py-1.5 rounded-full w-max">
                <AlertCircle className="w-4 h-4 text-[#E76F51]" />
                <span>Cognitive Tier: Apply & Diagnose</span>
              </div>

              <h2 className="text-xl font-black text-[#172E26] tracking-tight">
                {isMission1 ? "Mini-game 2: Repair the Broken Terminal" : "Mini-game 2: Match the Data Type"}
              </h2>

              <p className="text-xs text-[#526B5F] leading-relaxed">
                {isMission1
                  ? "The hydro-terminal is throwing syntax errors. Diagnose the error in the code, repair the syntax in the editor, and verify the output."
                  : "Python uses different data types for text, whole numbers, decimals, and logic flags. Match each sample value with its correct Python type."}
              </p>

              {isMission1 ? (
                <div className="p-3 bg-[#FFF9EE] border border-[#F6E5B8] rounded-2xl text-xs space-y-1.5 text-[#8C621F]">
                  <div className="font-bold">Malfunction Diagnostics:</div>
                  <ul className="space-y-1 list-disc list-inside text-[11px]">
                    <li>Line 2: <code>prin("Welcome to NEXA")</code> is misspelled.</li>
                    <li>Line 3: <code>print("Terminal connected)</code> is missing the closing quote.</li>
                  </ul>
                </div>
              ) : (
                /* Matching Activity */
                <div className="space-y-3 pt-2">
                  <div className="text-xs font-bold text-[#172E26]">
                    Select the matching type for each value:
                  </div>

                  {[
                    { val: '"Alex"', type: "str", desc: "Text enclosed in quotes (String)" },
                    { val: "18", type: "int", desc: "Whole number without decimals (Integer)" },
                    { val: "3.14", type: "float", desc: "Decimal number (Floating point)" },
                    { val: "True", type: "bool", desc: "Logical flag (Boolean)" }
                  ].map((item) => (
                    <div
                      key={item.val}
                      className="p-3 bg-[#F8FAF8] border border-[#E2EBE5] rounded-2xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-mono font-bold text-[#172E26] text-sm">
                          {item.val}
                        </span>
                        <div className="text-[10px] text-[#7E9387]">{item.desc}</div>
                      </div>

                      <div className="flex gap-1.5">
                        {["str", "int", "float", "bool"].map((t) => (
                          <button
                            key={t}
                            onClick={() => {
                              soundEngine.playClick();
                              setTypeMatches((prev) => ({ ...prev, [item.val.replace(/"/g, "")]: t }));
                            }}
                            className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                              typeMatches[item.val.replace(/"/g, "")] === t
                                ? "bg-[#3A86C8] text-white shadow-sm"
                                : "bg-[#FFFFFF] border border-[#D5E1DC] text-[#4F685B] hover:bg-[#EAF2EE]"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={handleValidateStage}
                    className="w-full py-3 rounded-2xl bg-[#3A86C8] hover:bg-[#2B6EA9] text-white font-bold text-xs shadow-md transition-all mt-2"
                  >
                    Validate Type Classifications
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Editor & Terminal for Repair */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-[#FFFFFF] border border-[#DEECE3] rounded-3xl p-5 shadow-soft space-y-3">
              <div className="flex items-center justify-between border-b border-[#EDF3ED] pb-3">
                <span className="text-xs font-mono font-bold text-[#5A7063]">
                  {isMission1 ? "repair_terminal.py" : "data_types.py"}
                </span>
                <button
                  onClick={handleRunCode}
                  className="py-1.5 px-3 rounded-xl bg-[#E8F3ED] hover:bg-[#D8EADB] text-[#2A6B53] font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Run Code</span>
                </button>
              </div>

              <div className="flex bg-[#FBFDFB] border border-[#E2EAE2] rounded-2xl overflow-hidden font-mono text-xs">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  spellCheck="false"
                  rows={8}
                  className="w-full p-3 bg-transparent text-[#172E26] focus:outline-none resize-y leading-relaxed font-mono"
                />
              </div>

              {isMission1 && (
                <button
                  onClick={handleValidateStage}
                  className="w-full py-3 rounded-2xl bg-[#2A6B53] hover:bg-[#205541] text-white font-bold text-xs shadow-md transition-all"
                >
                  Test Terminal Repair
                </button>
              )}
            </div>

            <div className="bg-[#192B23] border border-[#263D33] rounded-3xl p-5 text-white font-mono text-xs space-y-2">
              <div className="text-[11px] text-[#88A696] border-b border-[#253D32] pb-2">
                Terminal Output & Diagnostics
              </div>
              <pre className="text-[#D8EFE3] min-h-[80px] whitespace-pre-wrap leading-relaxed">
                {terminalOutput || "(Run or test repair to see output)"}
              </pre>
              {terminalError && (
                <div className="text-[#FFA494] bg-[#3B1E1A] p-2.5 rounded-xl border border-[#6B2E24] mt-2 font-mono">
                  {terminalError}
                </div>
              )}
            </div>

            {/* Validation Banner */}
            {validationStatus && (
              <div
                className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between ${
                  validationStatus === "success"
                    ? "bg-[#EAF7EE] border-[#BDE3C8] text-[#1B5738]"
                    : "bg-[#FDF2F0] border-[#F7C6BF] text-[#8C2E21]"
                }`}
              >
                <span>{validationMessage}</span>
                {validationStatus === "success" && (
                  <button
                    onClick={handleNextStage}
                    className="py-1.5 px-3 rounded-xl bg-[#2A6B53] text-white font-bold text-xs ml-3"
                  >
                    Continue
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}


      {/* STAGE 4: WRITE YOUR FIRST TRANSMISSION / BUILD YOUR IDENTITY CARD */}
      {activeStage === 4 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#FFFFFF] border border-[#DEECE3] rounded-3xl p-6 shadow-soft space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#2A6B53] bg-[#EBF5EE] px-3 py-1.5 rounded-full w-max">
                <Sparkles className="w-4 h-4 text-[#2A6B53]" />
                <span>Cognitive Tier: Apply & Construct</span>
              </div>

              <h2 className="text-xl font-black text-[#172E26] tracking-tight">
                {isMission1 ? "Mini-game 3: Write Your First Transmission" : "Mini-game 3: Build Your Identity Card"}
              </h2>

              <p className="text-xs text-[#526B5F] leading-relaxed">
                {isMission1
                  ? "Now it's your turn to author Python code from scratch! Write Python statements that send your explorer transmission to the NEXA ocean hub."
                  : "Create your official Explorer Identity Card using Python variables. When your code runs, NEXA generates your interactive explorer badge."}
              </p>

              <div className="p-3 bg-[#F0F7F4] border border-[#D5EADB] rounded-2xl text-xs space-y-1.5 text-[#2A5A48]">
                <div className="font-bold">Required Criteria:</div>
                <ul className="space-y-1 list-disc list-inside text-[11px]">
                  {isMission1 ? (
                    <>
                      <li>A comment line starting with <code>#</code> explaining your code</li>
                      <li>Print statement with your chosen explorer name</li>
                      <li>Print statement outputting: <code>"Mission started"</code></li>
                    </>
                  ) : (
                    <>
                      <li>Store your name in variable: <code>name = "..."</code></li>
                      <li>Store favorite language: <code>language = "Python"</code></li>
                      <li>Store starting XP: <code>xp = 50</code></li>
                      <li>Print all 3 with clear labels</li>
                    </>
                  )}
                </ul>
              </div>

              {/* Progressive Hint Button */}
              <div className="pt-2 flex items-center justify-between text-xs">
                <button
                  onClick={handleRevealNextHint}
                  className="text-xs font-bold text-[#2A6B53] hover:underline flex items-center gap-1.5"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-[#ECA752]" />
                  <span>
                    Need a hint? ({revealedHints}/{currentMission.hints.length})
                  </span>
                </button>
              </div>

              {revealedHints > 0 && (
                <div className="space-y-1.5 pt-1">
                  {currentMission.hints.slice(0, revealedHints).map((h, i) => (
                    <div key={i} className="p-2.5 bg-[#FFF9EE] border border-[#F6E5B8] rounded-xl text-xs text-[#8C621F]">
                      💡 {h}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mission 2: Live Dynamic Explorer Identity Card Rendered Directly from Code */}
            {!isMission1 && (
              <div className="bg-gradient-to-br from-[#1E564F] to-[#123833] text-white p-6 rounded-3xl shadow-soft border border-[#317970] space-y-4">
                <div className="flex items-center justify-between border-b border-[#2D6E64] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#52B788] animate-pulse" />
                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#A7E7DD] font-bold">
                      NEXA Explorer Identity Card
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#7BE0D4]">NEXA-001</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#E8DDD1] text-[#7A5B3D] flex items-center justify-center font-black text-xl shadow-md">
                    {(parsedCard.name || "Alex").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-lg font-black tracking-tight text-white">
                      {parsedCard.name || "Alex"}
                    </div>
                    <div className="text-xs text-[#A2E4DA] font-mono">
                      Specialty: {parsedCard.language || "Python"}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-[#2D6E64]">
                  <div>
                    <span className="text-[#89CCC1] text-[10px]">Expedition XP:</span>
                    <div className="font-bold text-white">{parsedCard.xp || 50} XP</div>
                  </div>
                  <div>
                    <span className="text-[#89CCC1] text-[10px]">Verification:</span>
                    <div className="font-bold text-[#52B788]">Active Explorer ✓</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Editor & Action */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#FFFFFF] border border-[#DEECE3] rounded-3xl p-5 shadow-soft space-y-3">
              <div className="flex items-center justify-between border-b border-[#EDF3ED] pb-3">
                <span className="text-xs font-mono font-bold text-[#5A7063]">
                  {isMission1 ? "first_transmission.py" : "identity_card.py"}
                </span>
                <span className="text-[11px] font-mono text-[#86998E]">Python 3.12</span>
              </div>

              <div className="flex bg-[#FBFDFB] border border-[#E2EAE2] rounded-2xl overflow-hidden font-mono text-xs">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  spellCheck="false"
                  rows={9}
                  className="w-full p-3 bg-transparent text-[#172E26] focus:outline-none resize-y leading-relaxed font-mono"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="py-2.5 px-5 rounded-2xl bg-[#E8F3ED] hover:bg-[#D8EADB] text-[#2A6B53] font-bold text-xs transition-all flex items-center gap-2 shadow-soft disabled:opacity-60"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Code</span>
                </button>

                <button
                  onClick={handleValidateStage}
                  disabled={isRunning}
                  className="py-2.5 px-6 rounded-2xl bg-[#2A6B53] hover:bg-[#205541] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-60"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify Transmission</span>
                </button>
              </div>
            </div>

            <div className="bg-[#192B23] border border-[#263D33] rounded-3xl p-5 text-white font-mono text-xs space-y-2">
              <div className="text-[11px] text-[#88A696] border-b border-[#253D32] pb-2">
                NEXA Terminal Output
              </div>
              <pre className="text-[#D8EFE3] min-h-[90px] whitespace-pre-wrap leading-relaxed">
                {terminalOutput || "(Click 'Run Code' or 'Verify Transmission' to see output)"}
              </pre>
              {terminalError && (
                <div className="text-[#FFA494] bg-[#3B1E1A] p-2.5 rounded-xl border border-[#6B2E24] mt-2">
                  {terminalError}
                </div>
              )}
            </div>

            {/* Validation Banner */}
            {validationStatus && (
              <div
                className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between ${
                  validationStatus === "success"
                    ? "bg-[#EAF7EE] border-[#BDE3C8] text-[#1B5738]"
                    : "bg-[#FDF2F0] border-[#F7C6BF] text-[#8C2E21]"
                }`}
              >
                <span>{validationMessage}</span>
                {validationStatus === "success" && (
                  <button
                    onClick={handleNextStage}
                    className="py-1.5 px-3 rounded-xl bg-[#2A6B53] text-white font-bold text-xs ml-3"
                  >
                    Boss Battle ⚔️
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}


      {/* STAGE 5: BOSS BATTLE (Mini-game 4) */}
      {activeStage === 5 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#FFFFFF] border-2 border-[#ECA752] rounded-3xl p-6 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#A05A18] bg-[#FEF3C7] px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>Final Boss Challenge · Bloom: Create</span>
                </span>
                <span className="text-xs font-bold text-[#2A6B53]">+50 XP Reward</span>
              </div>

              <h2 className="text-2xl font-black text-[#172E26] tracking-tight">
                {isMission1 ? "Boss Battle: Restore NEXA" : "Boss Battle: Identity Found"}
              </h2>

              <p className="text-xs text-[#526B5F] leading-relaxed">
                {isMission1
                  ? "NEXA is completely offline. Write three print() statements: hub name, system status, and mission status to permanently restore terminal communication!"
                  : "Final test of identity! Create an Explorer Identity Card using at least three variables, format them with clear labels, and execute your restoration credential."}
              </p>

              <div className="p-4 bg-[#F8FAF8] border border-[#DEECE3] rounded-2xl text-xs space-y-2">
                <div className="font-bold text-[#172E26]">Success Criteria:</div>
                <ul className="space-y-1.5 text-[#355143]">
                  {isMission1 ? (
                    <>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#2A6B53] stroke-[3]" />
                        <span>The program contains 3 valid print() statements</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#2A6B53] stroke-[3]" />
                        <span>Output includes the hub name</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#2A6B53] stroke-[3]" />
                        <span>Output includes the system status (e.g. Online)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#2A6B53] stroke-[3]" />
                        <span>Output includes the mission status</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#2A6B53] stroke-[3]" />
                        <span>The program runs successfully</span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#2A6B53] stroke-[3]" />
                        <span>Values are stored in at least 3 variables</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#2A6B53] stroke-[3]" />
                        <span>Values are displayed with clear labels using print()</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#2A6B53] stroke-[3]" />
                        <span>The program runs successfully</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* Badge to Unlock */}
              <div className="flex items-center gap-3 p-3 bg-[#FAF5FE] border border-[#E9DDF5] rounded-2xl">
                <div className="text-2xl">{currentMission.badge.icon}</div>
                <div>
                  <div className="text-xs font-black text-[#172E26]">
                    Unlock: {currentMission.badge.name}
                  </div>
                  <div className="text-[11px] text-[#7E57C2]">
                    {currentMission.badge.description}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Boss Code Editor & Console */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#FFFFFF] border border-[#DEECE3] rounded-3xl p-5 shadow-soft space-y-3">
              <div className="flex items-center justify-between border-b border-[#EDF3ED] pb-3">
                <span className="text-xs font-mono font-bold text-[#5A7063]">
                  boss_battle.py
                </span>
                <span className="text-[11px] font-mono text-[#ECA752] font-bold">
                  ⚔️ Final Certification
                </span>
              </div>

              <div className="flex bg-[#FBFDFB] border border-[#E2EAE2] rounded-2xl overflow-hidden font-mono text-xs">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  spellCheck="false"
                  rows={9}
                  className="w-full p-3 bg-transparent text-[#172E26] focus:outline-none resize-y leading-relaxed font-mono"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="py-2.5 px-5 rounded-2xl bg-[#E8F3ED] hover:bg-[#D8EADB] text-[#2A6B53] font-bold text-xs transition-all flex items-center gap-2 shadow-soft disabled:opacity-60"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Test Run</span>
                </button>

                <button
                  onClick={handleValidateStage}
                  disabled={isRunning}
                  className="py-2.5 px-6 rounded-2xl bg-[#2A6B53] hover:bg-[#205541] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-60"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Submit Boss Battle</span>
                </button>
              </div>
            </div>

            <div className="bg-[#192B23] border border-[#263D33] rounded-3xl p-5 text-white font-mono text-xs space-y-2">
              <div className="text-[11px] text-[#88A696] border-b border-[#253D32] pb-2">
                NEXA Ocean Terminal Output
              </div>
              <pre className="text-[#D8EFE3] min-h-[90px] whitespace-pre-wrap leading-relaxed">
                {terminalOutput || "(Submit or test run to see live output)"}
              </pre>
              {terminalError && (
                <div className="text-[#FFA494] bg-[#3B1E1A] p-2.5 rounded-xl border border-[#6B2E24] mt-2">
                  {terminalError}
                </div>
              )}
            </div>

            {/* Validation Banner */}
            {validationStatus && (
              <div
                className={`p-4 rounded-2xl border text-xs font-semibold ${
                  validationStatus === "success"
                    ? "bg-[#EAF7EE] border-[#BDE3C8] text-[#1B5738]"
                    : "bg-[#FDF2F0] border-[#F7C6BF] text-[#8C2E21]"
                }`}
              >
                {validationMessage}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Celebratory Victory Modal */}
      <CelebrationModal
        isOpen={showCelebration}
        levelData={currentMission}
        rewardXP={50}
        unlockedBadge={currentMission.badge}
        onNextMission={() => {
          setShowCelebration(false);
          if (isMission1) {
            // Navigate to Mission 2
            navigateTo("mission_lab", 2);
          } else {
            // Finished Undersea Reef! Go to Undersea Reef Overview
            navigateTo("undersea_reef");
          }
        }}
        onReplay={() => {
          setShowCelebration(false);
        }}
        onBackToMap={() => {
          setShowCelebration(false);
          navigateTo("quest_map");
        }}
      />
    </div>
  );
}
