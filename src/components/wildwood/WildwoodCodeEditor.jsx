import React, { useState, useEffect } from "react";
import {
  Play,
  RotateCcw,
  Lightbulb,
  Terminal as TerminalIcon,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Code2
} from "lucide-react";
import { soundEngine } from "../../utils/audio";

export function WildwoodCodeEditor({
  mission,
  code,
  setCode,
  onRunCode,
  isRunning,
  executionResult,
  validationResult,
  onNextMission,
  hasNextMission,
  isMissionCompleted
}) {
  const [revealedHints, setRevealedHints] = useState(0);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Reset hints and reset confirm state when mission changes
  useEffect(() => {
    setRevealedHints(0);
    setShowResetConfirm(false);
  }, [mission?.id]);

  const handleRevealHint = () => {
    if (revealedHints < (mission?.hints?.length || 0)) {
      setRevealedHints((prev) => prev + 1);
      soundEngine.playHint();
    }
  };

  const handleResetCode = () => {
    if (mission?.starterCode) {
      setCode(mission.starterCode);
    }
    setShowResetConfirm(false);
    soundEngine.playClick();
  };

  // Handle Tab key insertion (4 spaces for Python) and Ctrl+Enter to run
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
    } else if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (!isRunning) {
        onRunCode();
      }
    }
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#DEECE3] rounded-3xl p-5 shadow-soft flex flex-col space-y-4">
      {/* 1. Header: Mission Title & Compact Action Controls */}
      <div className="flex items-center justify-between gap-3 border-b border-[#EDF4EE] pb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2D6A4F] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full border border-[#C7E9D3]">
            Mission {mission.num} / 6
          </span>
          <h3 className="text-base font-black text-[#172E26] tracking-tight">
            {mission.title}
          </h3>
        </div>

        {/* Action Controls: Reset & Hint */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {showResetConfirm ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleResetCode}
                className="py-1 px-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] cursor-pointer transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="py-1 px-2 rounded-lg bg-[#F0F4F1] text-[#526B5F] text-[11px] font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-1 py-1.5 px-2.5 rounded-xl bg-[#F8FAF8] hover:bg-[#EEF5F1] border border-[#DEECE3] text-[#526B5F] hover:text-[#172E26] font-bold text-xs transition-colors cursor-pointer"
              title="Reset starter template"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          <button
            onClick={handleRevealHint}
            disabled={revealedHints >= (mission.hints?.length || 0)}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-[#FFFBEB] hover:bg-[#FEF3C7] border border-[#FDE68A] text-[#B45309] font-bold text-xs transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Lightbulb className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Hint ({revealedHints}/{mission.hints?.length || 0})</span>
          </button>
        </div>
      </div>

      {/* 2. Compact Narrative & Task (<= 2 sentences) */}
      <div className="space-y-1.5 text-xs">
        <p className="text-[#3D5B4D] leading-relaxed">
          {mission.story}
        </p>
        <div className="p-2.5 rounded-xl bg-[#F4F9F5] border border-[#D0E6D8] font-mono text-[11px] text-[#1D4A36] leading-snug">
          <strong className="text-[#133F2B] font-bold">Task:</strong> {mission.task}
        </div>
      </div>

      {/* 3. Progressive Hints Drawer (Only when hint requested) */}
      {revealedHints > 0 && (
        <div className="space-y-1.5 animate-fadeIn">
          {mission.hints.slice(0, revealedHints).map((hint, hIdx) => (
            <div
              key={hIdx}
              className="p-2.5 rounded-xl bg-[#FFFDF5] border border-[#FDE68A] text-xs text-[#92400E] flex items-start gap-2"
            >
              <Lightbulb className="w-3.5 h-3.5 text-[#D97706] flex-shrink-0 mt-0.5" />
              <span className="font-medium">{hint}</span>
            </div>
          ))}
        </div>
      )}

      {/* 4. Interactive Python Code Editor */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-[#1E4330] bg-[#07140D] shadow-sm flex flex-col">
        {/* Editor Top Bar */}
        <div className="px-3.5 py-2 bg-[#040C08] border-b border-[#143021] flex items-center justify-between text-[11px] font-mono text-[#74C69D]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#EF4444]/80" />
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]/80" />
            <span className="w-2 h-2 rounded-full bg-[#10B981]/80" />
            <span className="ml-1.5 font-bold text-white">wildwood_m{mission.num}.py</span>
          </div>
          <span className="text-[#52B788] text-[10px]">Python 3.11</span>
        </div>

        {/* Text Area */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck="false"
          rows={10}
          className="w-full p-3.5 font-mono text-xs sm:text-sm bg-transparent text-[#EAF6EE] focus:outline-none resize-none leading-relaxed"
          placeholder="# Write your Python solution here..."
        />
      </div>

      {/* 5. Run Solution Action Bar */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onRunCode}
          disabled={isRunning}
          className="py-2.5 px-6 rounded-2xl bg-[#2D6A4F] hover:bg-[#1F4F39] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isRunning ? "Running Solution..." : "Run Solution"}</span>
        </button>

        <span className="text-[11px] text-[#7A8E82] font-mono hidden sm:inline">
          Ctrl + Enter to run
        </span>
      </div>

      {/* 6. Execution Results & Validation Feedback */}
      {executionResult && (
        <div className="space-y-2.5 pt-1 animate-fadeIn">
          {/* Terminal Standard Output */}
          <div className="rounded-xl overflow-hidden border border-[#DEECE3] bg-[#07130D]">
            <div className="px-3 py-1.5 bg-[#050E09] border-b border-[#183626] flex items-center gap-1.5 text-[10px] font-mono text-[#74C69D]">
              <TerminalIcon className="w-3 h-3" />
              <span>Output</span>
            </div>

            <pre className="p-3 font-mono text-xs text-[#B7E4C7] whitespace-pre-wrap max-h-28 overflow-y-auto">
              {executionResult.output || "(Code ran with no printed output)"}
            </pre>

            {executionResult.error && (
              <div className="p-2.5 bg-red-950/70 border-t border-red-500/40 text-xs text-red-200 font-mono">
                {executionResult.error}
              </div>
            )}
          </div>

          {/* Validation Result Banner */}
          {validationResult && (
            <div
              className={`p-3.5 rounded-2xl border text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                validationResult.passed
                  ? "bg-[#EAF7EE] border-[#86EFAC] text-[#166534]"
                  : "bg-[#FEF2F2] border-[#FCA5A5] text-[#991B1B]"
              }`}
            >
              <div className="flex items-start gap-2.5">
                {validationResult.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-extrabold text-xs">
                    {validationResult.passed ? "Challenge Solved!" : "Needs Adjustment"}
                  </div>
                  <p className="mt-0.5 leading-relaxed font-medium">
                    {validationResult.message}
                  </p>
                </div>
              </div>

              {/* Advance Button (Only on passing) */}
              {validationResult.passed && hasNextMission && (
                <button
                  onClick={onNextMission}
                  className="py-2 px-3.5 rounded-xl bg-[#2D6A4F] hover:bg-[#1F4F39] text-white font-extrabold text-xs shadow-soft transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer self-end sm:self-auto"
                >
                  <span>Mission {mission.num + 1}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
