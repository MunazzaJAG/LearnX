import React, { useState, useEffect } from "react";
import {
  Play,
  RotateCcw,
  Lightbulb,
  Terminal as TerminalIcon,
  CheckCircle2,
  AlertCircle,
  Code2,
  Boxes,
  Maximize2,
  Minimize2,
  X,
  Puzzle,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Check
} from "lucide-react";
import { soundEngine } from "../../utils/audio";
import { underseaAudio } from "../../utils/underseaAudio";

export function PythonCodePanel({
  sublevel,
  code,
  setCode,
  onRunCode,
  isRunning,
  executionResult,
  validationResult,
  isOpen,
  onClose
}) {
  const hasMiniGame = !!sublevel?.miniGame;
  const [activeTab, setActiveTab] = useState(hasMiniGame ? "puzzle" : "code"); // "puzzle" | "predict" | "code"
  const [editorMode, setEditorMode] = useState("code"); // "code" | "blocks"
  const [revealedHints, setRevealedHints] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Mini-Game: Matching Puzzle State
  const [selectedVarId, setSelectedVarId] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState({}); // { [pairId]: true }
  const [puzzleError, setPuzzleError] = useState(null);

  // Mini-Game: Prediction State
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [predictionFeedback, setPredictionFeedback] = useState(null);

  // Shuffled right-side value tokens for the matching puzzle
  const [shuffledValues, setShuffledValues] = useState([]);

  // Reset states when sublevel changes
  useEffect(() => {
    setRevealedHints(0);
    setShowResetConfirm(false);
    setSelectedVarId(null);
    setMatchedPairs({});
    setPuzzleError(null);
    setSelectedPrediction(null);
    setPredictionFeedback(null);

    if (sublevel?.miniGame?.matchingPuzzle?.pairs) {
      setActiveTab("puzzle");
      const pairs = sublevel.miniGame.matchingPuzzle.pairs;
      // Stable pseudo-random shuffle for values
      const shuffled = [...pairs].sort((a, b) => (a.id > b.id ? -1 : 1));
      setShuffledValues(shuffled);
    } else {
      setActiveTab("code");
    }
  }, [sublevel?.id]);

  if (!isOpen) return null;

  const pairsList = sublevel?.miniGame?.matchingPuzzle?.pairs || [];
  const allPairsMatched = pairsList.length > 0 && pairsList.every((p) => matchedPairs[p.id]);

  // Handle matching interaction
  const handleSelectVar = (pairId) => {
    if (matchedPairs[pairId]) return;
    soundEngine.playClick();
    setSelectedVarId(pairId);
    setPuzzleError(null);
  };

  const handleSelectValue = (pairId) => {
    if (!selectedVarId) return;
    if (matchedPairs[pairId]) return;

    if (selectedVarId === pairId) {
      // Correct Match!
      soundEngine.playSuccess();
      underseaAudio.playBubble();
      setMatchedPairs((prev) => ({ ...prev, [pairId]: true }));
      setSelectedVarId(null);
      setPuzzleError(null);
    } else {
      // Incorrect Match
      underseaAudio.playError();
      setPuzzleError("Variable and value types don't match. Look at the type hints!");
    }
  };

  // Handle prediction choice
  const handleSelectPredictionOption = (option) => {
    soundEngine.playClick();
    setSelectedPrediction(option.id);
    if (option.correct) {
      soundEngine.playVictory();
      setPredictionFeedback({ isCorrect: true, text: option.feedback });
    } else {
      underseaAudio.playError();
      setPredictionFeedback({ isCorrect: false, text: option.feedback });
    }
  };

  const handleResetCode = () => {
    if (sublevel?.starterCode) {
      setCode(sublevel.starterCode);
    }
    setShowResetConfirm(false);
    underseaAudio.playBubble();
  };

  const handleRevealHint = () => {
    if (revealedHints < (sublevel?.hints?.length || 0)) {
      setRevealedHints((prev) => prev + 1);
      soundEngine.playHint();
    }
  };

  const handleAppendBlock = (blockCode) => {
    setCode((prev) => {
      const trimmed = prev.trimEnd();
      return trimmed.length > 0 ? `${trimmed}\n${blockCode}` : blockCode;
    });
    underseaAudio.playBubble();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + "    " + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4;
      }, 0);
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (!isRunning) {
        onRunCode();
      }
    }
  };

  return (
    <div
      className={`fixed z-30 transition-all duration-300 flex flex-col bg-[#06121f]/95 backdrop-blur-xl border border-[#1e3a5f]/80 rounded-3xl shadow-[0_16px_50px_rgba(2,132,199,0.3)] overflow-hidden ${
        isExpanded
          ? "inset-3 md:inset-8"
          : "bottom-4 right-3 sm:right-6 top-16 md:top-20 w-[94vw] sm:w-[500px] md:w-[540px] max-h-[calc(100vh-5.5rem)]"
      }`}
    >
      {/* Top Holographic Cyan Line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#38bdf8] to-transparent" />

      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 bg-[#08182b] border-b border-[#163857]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#0284c7]/20 border border-[#38bdf8]/40 flex items-center justify-center text-[#38bdf8] shadow-sm">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono tracking-wider font-bold text-[#38bdf8] uppercase bg-[#0284c7]/20 px-2 py-0.5 rounded-full">
                Sublevel 0{sublevel?.num} · {sublevel?.landmark}
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-white tracking-tight leading-tight mt-0.5">
              {sublevel?.title}
            </h3>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-[#94a3b8] hover:text-white hover:bg-[#163857] rounded-xl transition-all"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-[#94a3b8] hover:text-white hover:bg-[#163857] rounded-xl transition-all"
            title="Minimize Datapad"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Mission Stepper (If mini-game defined) */}
      {hasMiniGame && (
        <div className="flex items-center bg-[#040e1a] border-b border-[#163857] px-3 py-1.5 gap-1.5 text-xs font-semibold overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("puzzle")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              activeTab === "puzzle"
                ? "bg-[#0284c7] text-white shadow-sm"
                : allPairsMatched
                ? "text-[#34d399] hover:bg-[#08223a]"
                : "text-[#94a3b8] hover:text-white hover:bg-[#08223a]"
            }`}
          >
            <Puzzle className="w-3.5 h-3.5" />
            <span>1. Match Variables</span>
            {allPairsMatched && <Check className="w-3 h-3 text-[#34d399]" />}
          </button>

          <button
            onClick={() => setActiveTab("predict")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              activeTab === "predict"
                ? "bg-[#0284c7] text-white shadow-sm"
                : predictionFeedback?.isCorrect
                ? "text-[#34d399] hover:bg-[#08223a]"
                : "text-[#94a3b8] hover:text-white hover:bg-[#08223a]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>2. Predict Output</span>
            {predictionFeedback?.isCorrect && <Check className="w-3 h-3 text-[#34d399]" />}
          </button>

          <button
            onClick={() => setActiveTab("code")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              activeTab === "code"
                ? "bg-[#0284c7] text-white shadow-sm"
                : "text-[#94a3b8] hover:text-white hover:bg-[#08223a]"
            }`}
          >
            <TerminalIcon className="w-3.5 h-3.5" />
            <span>3. Station Terminal</span>
          </button>
        </div>
      )}

      {/* Main Body */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* ============================================================ */}
        {/* TAB 1: VARIABLE-AND-VALUE MATCHING PUZZLE                    */}
        {/* ============================================================ */}
        {activeTab === "puzzle" && sublevel?.miniGame?.matchingPuzzle && (
          <div className="p-4 sm:p-5 space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#38bdf8] font-bold">
                Phase 1: Memory Registers
              </span>
              <h4 className="text-sm font-extrabold text-white">
                {sublevel.miniGame.matchingPuzzle.title}
              </h4>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                {sublevel.miniGame.matchingPuzzle.instructions}
              </p>
            </div>

            {puzzleError && (
              <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{puzzleError}</span>
              </div>
            )}

            {/* Split Column Matching Grid */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* Left Column: Variable Names */}
              <div className="space-y-2">
                <div className="text-[10px] font-mono uppercase text-[#38bdf8] font-bold pb-0.5">
                  Variable Name
                </div>
                {pairsList.map((pair) => {
                  const isDone = !!matchedPairs[pair.id];
                  const isSelected = selectedVarId === pair.id;

                  return (
                    <button
                      key={pair.id}
                      onClick={() => handleSelectVar(pair.id)}
                      disabled={isDone}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all ${
                        isDone
                          ? "bg-[#06241e] border-[#059669]/60 text-[#34d399] opacity-80"
                          : isSelected
                          ? "bg-[#0b2b4d] border-[#38bdf8] text-white ring-2 ring-[#38bdf8]/40 scale-[1.02]"
                          : "bg-[#091d30] border-[#163857] text-[#e2e8f0] hover:border-[#38bdf8]/60 hover:bg-[#0c2742]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold">{pair.varName}</span>
                        {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />}
                      </div>
                      <div className="text-[10px] text-[#94a3b8] mt-0.5">{pair.description}</div>
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Values to Pair */}
              <div className="space-y-2">
                <div className="text-[10px] font-mono uppercase text-[#34d399] font-bold pb-0.5">
                  Stored Value
                </div>
                {shuffledValues.map((pair) => {
                  const isDone = !!matchedPairs[pair.id];

                  return (
                    <button
                      key={`val_${pair.id}`}
                      onClick={() => handleSelectValue(pair.id)}
                      disabled={isDone}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all ${
                        isDone
                          ? "bg-[#06241e] border-[#059669]/60 text-[#34d399] opacity-80"
                          : selectedVarId
                          ? "bg-[#091d30] border-[#0284c7]/50 text-white hover:border-[#34d399] hover:bg-[#0c2e36] animate-pulse"
                          : "bg-[#091d30] border-[#163857] text-[#cbd5e1] opacity-75"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[#fde047]">
                          {pair.valueDisplay}
                        </span>
                        {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />}
                      </div>
                      <div className="text-[10px] text-[#94a3b8] mt-0.5 uppercase tracking-wide">
                        {pair.type}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Victory / Advancement Banner */}
            {allPairsMatched && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#064e3b]/80 to-[#022c22]/80 border border-[#059669] space-y-2 animate-fadeIn">
                <div className="flex items-center gap-2 text-[#34d399] text-xs font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Memory Registers Initialized! All 3 variables paired.</span>
                </div>
                <p className="text-[11px] text-[#a7f3d0]">
                  Variables bind names on the left to values on the right using <code className="font-mono text-[#fde047]">=</code>. Next, test your output prediction.
                </p>
                <button
                  onClick={() => setActiveTab("predict")}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <span>Continue to Step 2: Output Prediction</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: OUTPUT PREDICTION MINI-GAME                           */}
        {/* ============================================================ */}
        {activeTab === "predict" && sublevel?.miniGame?.prediction && (
          <div className="p-4 sm:p-5 space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#38bdf8] font-bold">
                Phase 2: Telemetry Predictor
              </span>
              <h4 className="text-sm font-extrabold text-white">
                {sublevel.miniGame.prediction.title}
              </h4>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                {sublevel.miniGame.prediction.question}
              </p>
            </div>

            {/* Code Snippet Preview */}
            <div className="p-3.5 rounded-xl bg-[#030913] border border-[#163857] font-mono text-xs text-[#38bdf8] leading-5">
              <pre>{sublevel.miniGame.prediction.codeSnippet}</pre>
            </div>

            {/* Choices */}
            <div className="space-y-2">
              {sublevel.miniGame.prediction.options.map((opt) => {
                const isSelected = selectedPrediction === opt.id;
                let optStyle = "bg-[#091d30] border-[#163857] text-[#cbd5e1] hover:border-[#38bdf8]/50";

                if (isSelected) {
                  optStyle = opt.correct
                    ? "bg-[#064e3b] border-[#10b981] text-white ring-2 ring-[#10b981]/40"
                    : "bg-[#450a0a] border-[#ef4444] text-white ring-2 ring-[#ef4444]/40";
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectPredictionOption(opt)}
                    className={`w-full p-3 rounded-xl border text-left font-mono text-xs transition-all flex items-center justify-between ${optStyle}`}
                  >
                    <span>{opt.text}</span>
                    {isSelected && (
                      opt.correct ? (
                        <CheckCircle2 className="w-4 h-4 text-[#34d399]" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-[#f87171]" />
                      )
                    )}
                  </button>
                );
              })}
            </div>

            {/* Prediction Feedback & Continue */}
            {predictionFeedback && (
              <div
                className={`p-3 rounded-xl text-xs space-y-2 animate-fadeIn ${
                  predictionFeedback.isCorrect
                    ? "bg-[#064e3b]/80 border border-[#10b981] text-[#a7f3d0]"
                    : "bg-[#450a0a]/80 border border-[#ef4444] text-[#fca5a5]"
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  {predictionFeedback.isCorrect ? "✓ Correct Telemetry!" : "Not quite:"}
                </div>
                <p className="text-[11px] leading-relaxed">{predictionFeedback.text}</p>

                {predictionFeedback.isCorrect && (
                  <button
                    onClick={() => setActiveTab("code")}
                    className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                  >
                    <span>Proceed to Step 3: Station Terminal & Code</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: LIVE PYTHON CODING TERMINAL                          */}
        {/* ============================================================ */}
        {activeTab === "code" && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Concept Lesson Banner */}
            <div className="px-4 sm:px-5 py-2.5 bg-[#071526] border-b border-[#163857] text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#38bdf8] uppercase tracking-wider text-[10px]">
                  Objective
                </span>
                <span className="text-[10px] text-[#94a3b8] font-mono">
                  Concept: {sublevel?.concept}
                </span>
              </div>
              <p className="text-[#cbd5e1] leading-relaxed font-medium">{sublevel?.objective}</p>
            </div>

            {/* Mode Toggle: Code vs Blocks */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-2 bg-[#06121f] border-b border-[#163857]">
              <span className="text-[10px] font-mono text-[#64748b] uppercase font-bold">
                Editor Mode
              </span>
              <div className="flex items-center bg-[#030913] p-0.5 rounded-xl border border-[#163857] text-xs">
                <button
                  onClick={() => setEditorMode("code")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                    editorMode === "code"
                      ? "bg-[#0284c7] text-white shadow-sm"
                      : "text-[#94a3b8] hover:text-white"
                  }`}
                >
                  <Code2 className="w-3 h-3" />
                  <span>Python</span>
                </button>
                <button
                  onClick={() => setEditorMode("blocks")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                    editorMode === "blocks"
                      ? "bg-[#0284c7] text-white shadow-sm"
                      : "text-[#94a3b8] hover:text-white"
                  }`}
                >
                  <Boxes className="w-3 h-3" />
                  <span>Blocks</span>
                </button>
              </div>
            </div>

            {/* Visual Blocks Drawer */}
            {editorMode === "blocks" && (
              <div className="p-3 bg-[#030913] border-b border-[#163857] space-y-1.5">
                <div className="text-[10px] font-mono text-[#94a3b8] uppercase font-bold">
                  Command Blocks (Click to insert):
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  {sublevel?.visualBlocks?.map((block, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAppendBlock(block.code)}
                      className="flex items-center justify-between p-2 rounded-xl bg-[#091d30] hover:bg-[#122e47] border border-[#163857] text-left transition-all group"
                    >
                      <span className="text-xs font-semibold text-white group-hover:text-[#38bdf8]">
                        {block.label}
                      </span>
                      <span className="text-[10px] text-[#38bdf8] font-mono bg-[#0284c7]/20 px-1.5 py-0.5 rounded">
                        + Insert
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Code Editor Area */}
            <div className="relative flex-1 min-h-[190px] bg-[#030811] flex">
              <div className="w-10 py-3 bg-[#040b17] text-[#475569] font-mono text-xs text-right pr-2 select-none border-r border-[#163857]/40 leading-6">
                {code.split("\n").map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck="false"
                className="flex-1 p-3 bg-transparent font-mono text-xs md:text-sm text-[#e2e8f0] resize-none outline-none leading-6 placeholder:text-[#475569] selection:bg-[#0284c7]/40"
                placeholder="# Enter Python code to control the station..."
              />
            </div>

            {/* Run & Action Toolbar */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 bg-[#08182b] border-t border-b border-[#163857]">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRevealHint}
                  disabled={revealedHints >= (sublevel?.hints?.length || 0)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#e2e8f0] bg-[#163857]/60 hover:bg-[#163857] border border-[#234e7c] disabled:opacity-40 transition-all"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-[#fbbf24]" />
                  <span>
                    Hint ({revealedHints}/{sublevel?.hints?.length || 0})
                  </span>
                </button>

                {showResetConfirm ? (
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-[#f87171] font-bold text-[11px]">Discard?</span>
                    <button
                      onClick={handleResetCode}
                      className="px-2 py-1 bg-[#ef4444] text-white rounded-lg font-bold hover:bg-[#dc2626]"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="px-2 py-1 bg-[#1e293b] text-[#cbd5e1] rounded-lg font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold text-[#94a3b8] hover:text-white bg-[#091d30] hover:bg-[#163857] border border-[#163857] transition-all"
                    title="Reset to starter template"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Run Code Button */}
              <button
                onClick={onRunCode}
                disabled={isRunning}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#059669] to-[#10b981] hover:from-[#047857] hover:to-[#059669] active:scale-95 text-white font-extrabold text-xs shadow-lg shadow-emerald-950/50 transition-all disabled:opacity-50"
              >
                {isRunning ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Executing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Execute Python (Ctrl+Enter)</span>
                  </>
                )}
              </button>
            </div>

            {/* Revealed Hints Drawer */}
            {revealedHints > 0 && (
              <div className="px-4 py-2.5 bg-[#0a1f33] border-b border-[#163857] space-y-1.5 text-xs">
                {sublevel?.hints?.slice(0, revealedHints).map((hint, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[#fde68a]">
                    <span className="font-bold text-[9px] bg-[#fbbf24]/20 text-[#fbbf24] px-1.5 py-0.2 rounded uppercase">
                      Tier {idx + 1}
                    </span>
                    <span className="leading-relaxed text-[11px]">{hint}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Terminal Console Output */}
            <div className="p-3 bg-[#02060d] min-h-[100px] max-h-[140px] overflow-y-auto font-mono text-xs space-y-1">
              <div className="flex items-center justify-between text-[#64748b] text-[10px] uppercase font-bold mb-1 pb-1 border-b border-white/5">
                <div className="flex items-center gap-1.5">
                  <TerminalIcon className="w-3 h-3 text-[#38bdf8]" />
                  <span>Station Console Output</span>
                </div>
                {validationResult?.passed && (
                  <span className="text-[#34d399] font-bold">✓ PASSED</span>
                )}
              </div>

              {executionResult?.output ? (
                <pre className="text-[#38bdf8] whitespace-pre-wrap leading-relaxed">
                  {executionResult.output}
                </pre>
              ) : (
                <div className="text-[#475569] italic">
                  Press "Execute Python" to transmit telemetry...
                </div>
              )}

              {executionResult?.error && (
                <div className="text-[#f87171] bg-red-950/30 p-2 rounded-lg border border-red-500/30">
                  {executionResult.error}
                </div>
              )}

              {validationResult?.message && (
                <div
                  className={`mt-1.5 p-2 rounded-lg text-[11px] font-sans font-medium leading-relaxed ${
                    validationResult.passed
                      ? "bg-[#064e3b]/50 text-[#6ee7b7] border border-[#10b981]/40"
                      : "bg-[#450a0a]/50 text-[#fca5a5] border border-[#ef4444]/40"
                  }`}
                >
                  {validationResult.message}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
