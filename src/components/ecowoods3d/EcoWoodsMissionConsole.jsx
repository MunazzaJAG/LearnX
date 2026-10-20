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
  Check,
  Trees
} from "lucide-react";
import { soundEngine } from "../../utils/audio";
import { ecoWoodsAudio } from "../../utils/ecoWoodsAudio";

export function EcoWoodsMissionConsole({
  mission,
  code,
  setCode,
  onRunCode,
  isRunning,
  executionResult,
  validationResult,
  isOpen,
  onClose
}) {
  const hasMiniGame = !!mission?.miniGame;
  const [activeTab, setActiveTab] = useState(hasMiniGame ? "puzzle" : "code"); // "puzzle" | "code" | "blocks"
  const [revealedHints, setRevealedHints] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Matching Puzzle State
  const [selectedVarId, setSelectedVarId] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState({});
  const [puzzleError, setPuzzleError] = useState(null);

  // Prediction State
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [predictionFeedback, setPredictionFeedback] = useState(null);
  const [shuffledValues, setShuffledValues] = useState([]);

  useEffect(() => {
    setRevealedHints(0);
    setShowResetConfirm(false);
    setSelectedVarId(null);
    setMatchedPairs({});
    setPuzzleError(null);
    setSelectedPrediction(null);
    setPredictionFeedback(null);

    if (mission?.miniGame?.matchingPuzzle?.pairs) {
      setActiveTab("puzzle");
      const pairs = mission.miniGame.matchingPuzzle.pairs;
      const shuffled = [...pairs].sort((a, b) => (a.id > b.id ? -1 : 1));
      setShuffledValues(shuffled);
    } else {
      setActiveTab("code");
    }
  }, [mission?.id]);

  if (!isOpen) return null;

  const pairsList = mission?.miniGame?.matchingPuzzle?.pairs || [];
  const allPairsMatched = pairsList.length > 0 && pairsList.every((p) => matchedPairs[p.id]);

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
      soundEngine.playSuccess();
      ecoWoodsAudio.playSeedlingGrow();
      setMatchedPairs((prev) => ({ ...prev, [pairId]: true }));
      setSelectedVarId(null);
      setPuzzleError(null);
    } else {
      ecoWoodsAudio.playError();
      setPuzzleError("Expression and evaluated value do not match. Review the operator rules!");
    }
  };

  const handleSelectPredictionOption = (option) => {
    soundEngine.playClick();
    setSelectedPrediction(option.id);
    if (option.correct) {
      soundEngine.playVictory();
      setPredictionFeedback({ isCorrect: true, text: option.feedback });
    } else {
      ecoWoodsAudio.playError();
      setPredictionFeedback({ isCorrect: false, text: option.feedback });
    }
  };

  const handleResetCode = () => {
    if (mission?.starterCode) {
      setCode(mission.starterCode);
    }
    setShowResetConfirm(false);
    ecoWoodsAudio.playClick();
  };

  const handleRevealHint = () => {
    if (revealedHints < (mission?.hints?.length || 0)) {
      setRevealedHints((prev) => prev + 1);
      soundEngine.playHint();
    }
  };

  const handleAppendBlock = (blockCode) => {
    setCode((prev) => {
      const trimmed = prev.trimEnd();
      return trimmed.length > 0 ? `${trimmed}\n${blockCode}` : blockCode;
    });
    ecoWoodsAudio.playClick();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className={`bg-[#0b1f16] border-2 border-[#2d6a4f] rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 w-full ${
          isExpanded ? "max-w-6xl h-[92vh]" : "max-w-4xl h-[86vh]"
        }`}
      >
        {/* ============================================================ */}
        {/* CONSOLE HEADER */}
        {/* ============================================================ */}
        <div className="p-4 sm:p-5 border-b border-[#1b4d36] bg-[#081811] flex items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#184833] border border-[#52b788]/40 flex items-center justify-center text-[#52b788] flex-shrink-0">
              <Trees className="w-5 h-5" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-wider text-[#52b788] uppercase bg-[#184833]/60 px-2.5 py-0.5 rounded-full border border-[#2d6a4f]">
                  Mission {mission.num} of 6
                </span>
                <span className="text-xs text-[#95d5b2] truncate hidden sm:inline">
                  {mission.landmark}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight truncate mt-0.5">
                {mission.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Window size toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-xl bg-[#0f2d20] hover:bg-[#184833] text-[#95d5b2] hover:text-white border border-[#24593f] transition-colors cursor-pointer hidden md:flex"
              title={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#0f2d20] hover:bg-[#184833] text-[#95d5b2] hover:text-white border border-[#24593f] transition-colors cursor-pointer"
              title="Close Console (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* TAB BAR NAVIGATION */}
        {/* ============================================================ */}
        <div className="px-5 pt-2 bg-[#091a12] border-b border-[#1b4d36] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            {hasMiniGame && (
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setActiveTab("puzzle");
                }}
                className={`py-2 px-3.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === "puzzle"
                    ? "bg-[#0b1f16] text-[#52b788] border-t-2 border-x border-[#2d6a4f]"
                    : "text-[#74c69d] hover:text-white"
                }`}
              >
                <Puzzle className="w-3.5 h-3.5" />
                <span>Concept & Prediction</span>
              </button>
            )}

            <button
              onClick={() => {
                soundEngine.playClick();
                setActiveTab("code");
              }}
              className={`py-2 px-3.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "code"
                  ? "bg-[#0b1f16] text-[#52b788] border-t-2 border-x border-[#2d6a4f]"
                  : "text-[#74c69d] hover:text-white"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Python Code Editor</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                setActiveTab("blocks");
              }}
              className={`py-2 px-3.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "blocks"
                  ? "bg-[#0b1f16] text-[#52b788] border-t-2 border-x border-[#2d6a4f]"
                  : "text-[#74c69d] hover:text-white"
              }`}
            >
              <Boxes className="w-3.5 h-3.5" />
              <span>Visual Code Blocks</span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-[#52b788] hidden sm:block">
            Python 3.12 · Living Forest Engine
          </div>
        </div>

        {/* ============================================================ */}
        {/* MAIN BODY WORKSPACE */}
        {/* ============================================================ */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* TAB 1: MINI-GAME / PUZZLE & PREDICTION */}
          {activeTab === "puzzle" && hasMiniGame && (
            <div className="space-y-6 animate-fadeIn">
              {/* Concept Overview Card */}
              <div className="bg-[#0f2e21] border border-[#2d6a4f] rounded-2xl p-4 sm:p-5 text-xs text-[#d8f3dc] space-y-2">
                <div className="flex items-center gap-2 text-sm font-black text-[#52b788]">
                  <Sparkles className="w-4 h-4 text-[#fbbf24]" />
                  <span>Mission Concept: {mission.concept}</span>
                </div>
                <p className="leading-relaxed opacity-90">{mission.story}</p>
                <div className="p-3 rounded-xl bg-[#081811] border border-[#1b4d36] font-mono text-[11px] text-[#74c69d]">
                  {mission.objective}
                </div>
              </div>

              {/* Matching Puzzle */}
              {mission.miniGame.matchingPuzzle && (
                <div className="bg-[#091a12] border border-[#1b4d36] rounded-2xl p-5 space-y-4">
                  <div>
                    <h3 className="text-sm font-black text-white">
                      {mission.miniGame.matchingPuzzle.title}
                    </h3>
                    <p className="text-xs text-[#74c69d] mt-0.5">
                      {mission.miniGame.matchingPuzzle.instructions}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Left Column: Expressions */}
                    <div className="space-y-2">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-[#52b788] font-bold">
                        Python Expressions
                      </div>
                      {pairsList.map((p) => {
                        const isMatched = matchedPairs[p.id];
                        const isSelected = selectedVarId === p.id;
                        return (
                          <button
                            key={p.id}
                            onClick={() => handleSelectVar(p.id)}
                            disabled={isMatched}
                            className={`w-full p-3 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                              isMatched
                                ? "bg-[#163a2b] border-[#52b788] text-[#52b788] opacity-70"
                                : isSelected
                                ? "bg-[#1f543d] border-[#52b788] text-white ring-2 ring-[#52b788]/40"
                                : "bg-[#0c2419] border-[#20533a] hover:bg-[#143a29] text-[#d8f3dc]"
                            }`}
                          >
                            <span className="font-mono text-xs font-bold">{p.varName}</span>
                            {isMatched && <Check className="w-4 h-4 text-[#52b788]" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Right Column: Values */}
                    <div className="space-y-2">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-[#52b788] font-bold">
                        Evaluated Results
                      </div>
                      {shuffledValues.map((p) => {
                        const isMatched = matchedPairs[p.id];
                        return (
                          <button
                            key={p.id}
                            onClick={() => handleSelectValue(p.id)}
                            disabled={isMatched || !selectedVarId}
                            className={`w-full p-3 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                              isMatched
                                ? "bg-[#163a2b] border-[#52b788] text-[#52b788] opacity-70"
                                : selectedVarId
                                ? "bg-[#0c2419] border-[#2d6a4f] hover:bg-[#1f543d] text-white"
                                : "bg-[#0c2419] border-[#20533a] opacity-50 text-[#74c69d]"
                            }`}
                          >
                            <span className="font-mono text-xs font-bold">{p.valueDisplay}</span>
                            <span className="text-[10px] text-[#74c69d]">{p.description}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {puzzleError && (
                    <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                      <span>{puzzleError}</span>
                    </div>
                  )}

                  {allPairsMatched && (
                    <div className="p-3.5 rounded-xl bg-[#163a2b] border border-[#52b788] text-xs text-[#52b788] font-bold flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>All logic pairings completed successfully!</span>
                      </div>
                      <button
                        onClick={() => setActiveTab("code")}
                        className="py-1 px-3 rounded-lg bg-[#52b788] text-[#081c14] text-xs font-black flex items-center gap-1 cursor-pointer"
                      >
                        <span>Open Code Editor</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Prediction Challenge */}
              {mission.miniGame.prediction && (
                <div className="bg-[#091a12] border border-[#1b4d36] rounded-2xl p-5 space-y-4">
                  <div>
                    <h3 className="text-sm font-black text-white">
                      {mission.miniGame.prediction.title}
                    </h3>
                    <p className="text-xs text-[#74c69d] mt-0.5">
                      {mission.miniGame.prediction.question}
                    </p>
                  </div>

                  <pre className="p-3 rounded-xl bg-[#050e0a] border border-[#1b4d36] font-mono text-xs text-[#52b788]">
                    {mission.miniGame.prediction.codeSnippet}
                  </pre>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {mission.miniGame.prediction.options.map((opt) => {
                      const isSelected = selectedPrediction === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectPredictionOption(opt)}
                          className={`p-3 rounded-xl text-left border text-xs font-mono font-bold transition-all cursor-pointer ${
                            isSelected && opt.correct
                              ? "bg-[#163a2b] border-[#52b788] text-[#52b788]"
                              : isSelected && !opt.correct
                              ? "bg-red-950/40 border-red-500/50 text-red-300"
                              : "bg-[#0c2419] border-[#20533a] hover:bg-[#143a29] text-white"
                          }`}
                        >
                          {opt.text}
                        </button>
                      );
                    })}
                  </div>

                  {predictionFeedback && (
                    <div
                      className={`p-3 rounded-xl border text-xs font-medium ${
                        predictionFeedback.isCorrect
                          ? "bg-[#163a2b] border-[#52b788] text-[#d8f3dc]"
                          : "bg-red-950/40 border-red-500/40 text-red-300"
                      }`}
                    >
                      {predictionFeedback.text}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PYTHON CODE EDITOR */}
          {activeTab === "code" && (
            <div className="space-y-4 animate-fadeIn">
              {/* Mission Objective Banner */}
              <div className="p-3.5 rounded-2xl bg-[#091a12] border border-[#1b4d36] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#52b788]">
                    Mission Objective
                  </span>
                  <div className="font-semibold text-white mt-0.5">
                    {mission.objective}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Reset Code */}
                  {showResetConfirm ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handleResetCode}
                        className="py-1 px-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer"
                      >
                        Confirm Reset
                      </button>
                      <button
                        onClick={() => setShowResetConfirm(false)}
                        className="py-1 px-2.5 rounded-lg bg-[#143a29] text-[#74c69d] text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowResetConfirm(true)}
                      className="flex items-center gap-1 py-1.5 px-3 rounded-xl bg-[#0c2419] hover:bg-[#143a29] border border-[#20533a] text-[#74c69d] hover:text-white font-semibold text-xs transition-colors cursor-pointer"
                      title="Reset starter code"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  )}

                  {/* Progressive Hint */}
                  <button
                    onClick={handleRevealHint}
                    disabled={revealedHints >= (mission.hints?.length || 0)}
                    className="flex items-center gap-1 py-1.5 px-3 rounded-xl bg-[#0c2419] hover:bg-[#143a29] border border-[#20533a] text-[#fbbf24] font-semibold text-xs transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>
                      Hint ({revealedHints}/{mission.hints?.length || 0})
                    </span>
                  </button>
                </div>
              </div>

              {/* Revealed Hints */}
              {revealedHints > 0 && (
                <div className="space-y-2">
                  {mission.hints.slice(0, revealedHints).map((hint, hIdx) => (
                    <div
                      key={hIdx}
                      className="p-3 rounded-xl bg-[#143a29]/80 border border-[#2d6a4f] text-xs text-[#b7e4c7] flex items-start gap-2"
                    >
                      <Lightbulb className="w-4 h-4 text-[#fbbf24] flex-shrink-0 mt-0.5" />
                      <span>{hint}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Python Code Input Box */}
              <div className="relative rounded-2xl overflow-hidden border border-[#2d6a4f] bg-[#050e0a]">
                <div className="px-4 py-2 bg-[#081811] border-b border-[#1b4d36] flex items-center justify-between text-[11px] font-mono text-[#74c69d]">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    <span className="ml-2 font-bold text-white">mission_{mission.num}.py</span>
                  </span>
                  <span>UTF-8</span>
                </div>

                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-56 p-4 font-mono text-xs sm:text-sm bg-transparent text-[#d8f3dc] focus:outline-none resize-none leading-relaxed"
                  spellCheck="false"
                  placeholder="# Enter your Python solution here..."
                />
              </div>

              {/* Run Code & Terminal Output Drawer */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                <button
                  onClick={onRunCode}
                  disabled={isRunning}
                  className="py-3 px-6 rounded-2xl bg-gradient-to-r from-[#2d6a4f] to-[#52b788] hover:from-[#1b4332] hover:to-[#40916c] text-[#081c14] font-black text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{isRunning ? "Executing Python..." : "Run Python Code"}</span>
                </button>

                <div className="text-[11px] text-[#74c69d] text-right">
                  Press <strong>Run Python Code</strong> to test your solution in the 3D world.
                </div>
              </div>

              {/* Execution Feedback / Terminal Output Box */}
              {executionResult && (
                <div className="space-y-3 pt-2">
                  <div className="rounded-2xl overflow-hidden border border-[#1b4d36] bg-[#050e0a]">
                    <div className="px-4 py-2 bg-[#081811] border-b border-[#1b4d36] flex items-center gap-2 text-xs font-mono text-[#74c69d]">
                      <TerminalIcon className="w-3.5 h-3.5" />
                      <span>Console Standard Output:</span>
                    </div>

                    <pre className="p-4 font-mono text-xs text-[#b7e4c7] whitespace-pre-wrap max-h-40 overflow-y-auto">
                      {executionResult.output || "(Code ran with no printed output)"}
                    </pre>

                    {executionResult.error && (
                      <div className="p-3 bg-red-950/50 border-t border-red-500/40 text-xs text-red-300 font-mono">
                        {executionResult.error}
                      </div>
                    )}
                  </div>

                  {/* Validation Feedback Banner */}
                  {validationResult && (
                    <div
                      className={`p-4 rounded-2xl border text-xs flex items-start gap-3 ${
                        validationResult.passed
                          ? "bg-[#163a2b] border-[#52b788] text-[#d8f3dc]"
                          : "bg-red-950/40 border-red-500/50 text-red-200"
                      }`}
                    >
                      {validationResult.passed ? (
                        <CheckCircle2 className="w-5 h-5 text-[#52b788] flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-bold text-sm">
                          {validationResult.passed ? "Mission Passed!" : "Needs Adjustment"}
                        </div>
                        <p className="mt-1 leading-relaxed opacity-95">
                          {validationResult.message}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: VISUAL CODE BLOCKS */}
          {activeTab === "blocks" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-[#091a12] border border-[#1b4d36] text-xs text-[#b7e4c7]">
                Click any snippet block below to append it directly into your Python code editor:
              </div>

              <div className="grid grid-cols-1 gap-3">
                {mission.visualBlocks?.map((block, bIdx) => (
                  <div
                    key={bIdx}
                    className="p-4 rounded-2xl bg-[#0c2419] border border-[#20533a] hover:border-[#52b788] transition-all flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{block.label}</div>
                      <pre className="mt-1 font-mono text-[11px] text-[#74c69d] bg-[#050e0a] p-2 rounded-lg">
                        {block.code}
                      </pre>
                    </div>

                    <button
                      onClick={() => handleAppendBlock(block.code)}
                      className="py-2 px-3.5 rounded-xl bg-[#163a2b] hover:bg-[#1f543d] border border-[#2d6a4f] text-[#52b788] hover:text-white font-bold text-xs flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
                    >
                      <span>Insert Block</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
