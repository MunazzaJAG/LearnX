import React, { useState, useEffect } from "react";
import {
  Play,
  RotateCcw,
  Lightbulb,
  Terminal as TerminalIcon,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { soundEngine } from "../../utils/audio";

export function WildwoodCodingModal({
  mission,
  isOpen,
  onClose,
  code,
  setCode,
  onRunCode,
  isRunning,
  executionResult,
  validationResult,
  isMissionCompleted,
  onContinueAdventure
}) {
  const [revealedHints, setRevealedHints] = useState(0);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    setRevealedHints(0);
    setShowResetConfirm(false);
  }, [mission?.id]);

  if (!isOpen || !mission) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FFFFFF] border-2 border-[#2D6A4F] rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp">
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 bg-[#0C2217] border-b border-[#1E4D36] flex items-center justify-between text-white flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#86EFAC] bg-[#163E2B] px-2.5 py-0.5 rounded-full border border-[#2D6A4F]">
              Mission {mission.num} / 6
            </span>
            <h3 className="text-sm sm:text-base font-black text-white tracking-tight">
              {mission.title}
            </h3>
            <span className="text-xs text-[#A7F3D0] hidden sm:inline">
              ({mission.habitatArea})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Hint Button */}
            <button
              onClick={handleRevealHint}
              disabled={revealedHints >= (mission.hints?.length || 0)}
              className="flex items-center gap-1.5 py-1 px-2.5 rounded-xl bg-[#FFFBEB] hover:bg-[#FEF3C7] border border-[#FDE68A] text-[#B45309] font-bold text-xs transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Lightbulb className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Hint ({revealedHints}/{mission.hints?.length || 0})</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#A7F3D0] hover:text-white hover:bg-[#1E4D36] transition-colors cursor-pointer"
              title="Return to Game"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto">
          {/* 1. Concise Scenario & Task */}
          <div className="space-y-1.5 text-xs">
            <p className="text-[#325243] leading-relaxed">
              {mission.story}
            </p>
            <div className="p-2.5 rounded-xl bg-[#F4F9F5] border border-[#CDE5D6] font-mono text-[11px] text-[#1B4D36] leading-snug">
              <strong className="text-[#0E3523] font-bold">Task:</strong> {mission.task}
            </div>
          </div>

          {/* 2. Revealed Hints Drawer */}
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

          {/* 3. Python Code Editor */}
          <div className="rounded-2xl overflow-hidden border-2 border-[#1E4330] bg-[#07140D] flex flex-col shadow-sm">
            <div className="px-3.5 py-1.5 bg-[#040C08] border-b border-[#143021] flex items-center justify-between text-[11px] font-mono text-[#74C69D]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#EF4444]/80" />
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]/80" />
                <span className="w-2 h-2 rounded-full bg-[#10B981]/80" />
                <span className="ml-1.5 font-bold text-white">wildwood_m{mission.num}.py</span>
              </div>

              {showResetConfirm ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleResetCode}
                    className="text-[10px] font-bold text-red-400 hover:text-red-300 underline cursor-pointer"
                  >
                    Confirm Reset
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="text-[10px] text-gray-400 hover:text-gray-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="flex items-center gap-1 text-[10px] text-[#A7F3D0] hover:text-white cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Template</span>
                </button>
              )}
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck="false"
              rows={8}
              className="w-full p-3 font-mono text-xs sm:text-sm bg-transparent text-[#EAF6EE] focus:outline-none resize-none leading-relaxed"
              placeholder="# Write your Python solution here..."
            />
          </div>

          {/* 4. Action Bar: Run Code */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={onRunCode}
              disabled={isRunning}
              className="py-2.5 px-6 rounded-xl bg-[#2D6A4F] hover:bg-[#1F4F39] text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunning ? "Executing Python..." : "Run Solution"}</span>
            </button>

            <span className="text-[11px] text-[#7A8E82] font-mono hidden sm:inline">
              Ctrl + Enter to run
            </span>
          </div>

          {/* 5. Terminal & Validation Feedback */}
          {executionResult && (
            <div className="space-y-2 pt-1 animate-fadeIn">
              <div className="rounded-xl overflow-hidden border border-[#DEECE3] bg-[#07130D]">
                <div className="px-3 py-1 bg-[#050E09] border-b border-[#183626] flex items-center gap-1.5 text-[10px] font-mono text-[#74C69D]">
                  <TerminalIcon className="w-3 h-3" />
                  <span>Terminal Output</span>
                </div>
                <pre className="p-2.5 font-mono text-xs text-[#B7E4C7] whitespace-pre-wrap max-h-24 overflow-y-auto">
                  {executionResult.output || "(Code ran with no print output)"}
                </pre>
                {executionResult.error && (
                  <div className="p-2 bg-red-950/70 border-t border-red-500/40 text-xs text-red-200 font-mono">
                    {executionResult.error}
                  </div>
                )}
              </div>

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

                  {validationResult.passed && (
                    <button
                      onClick={onContinueAdventure}
                      className="py-2 px-4 rounded-xl bg-[#2D6A4F] hover:bg-[#1F4F39] text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
                    >
                      <span>Resume Adventure</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
