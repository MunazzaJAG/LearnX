import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  Trees,
  Heart,
  Pause,
  Play,
  RotateCcw,
  Zap,
  Award
} from "lucide-react";
import { useGameState } from "../context/GameStateContext";
import { WILDWOOD_MISSIONS, getWildwoodMissionByNum } from "../data/wildwoodCurriculum";
import { WildwoodPlatformerCanvas } from "../components/wildwood/WildwoodPlatformerCanvas";
import { WildwoodCodingModal } from "../components/wildwood/WildwoodCodingModal";
import { runPythonCode, extractPythonScope } from "../utils/pythonRunner";
import { soundEngine } from "../utils/audio";

const STORAGE_KEY_WILDWOOD = "learnx_wildwood_progress_v1";

export function WildwoodSanctuaryView() {
  const {
    completedMissions,
    completeMission,
    navigateTo,
    xp
  } = useGameState();

  const isLevel1GlobalDone = completedMissions.includes(3);

  // Local mission progression state for Wildwood Sanctuary (Missions 1 to 6)
  const [completedSubmissions, setCompletedSubmissions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WILDWOOD);
      if (saved) return JSON.parse(saved);
    } catch {}
    return isLevel1GlobalDone ? [1, 2, 3, 4, 5, 6] : [];
  });

  const [activeMissionNum, setActiveMissionNum] = useState(() => {
    if (completedSubmissions.length >= 6) return 1;
    for (let i = 1; i <= 6; i++) {
      if (!completedSubmissions.includes(i)) return i;
    }
    return 1;
  });

  const activeMission = getWildwoodMissionByNum(activeMissionNum);

  // Collectibles counter
  const [acornCount, setAcornCount] = useState(0);

  // Game pause state
  const [isPaused, setIsPaused] = useState(false);
  const [restartTrigger, setRestartTrigger] = useState(0);

  // In-Game Coding Modal State
  const [isCodingOpen, setIsCodingOpen] = useState(false);
  const [codingMissionNum, setCodingMissionNum] = useState(1);
  const codingMission = getWildwoodMissionByNum(codingMissionNum);

  // Code editor states (cached per mission)
  const [codePerMission, setCodePerMission] = useState(() => {
    const map = {};
    WILDWOOD_MISSIONS.forEach((m) => {
      map[m.num] = m.starterCode;
    });
    return map;
  });

  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Persist local submissions
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WILDWOOD, JSON.stringify(completedSubmissions));
    } catch {}
  }, [completedSubmissions]);

  // Handle Pause with Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (isCodingOpen) {
          setIsCodingOpen(false);
        } else {
          setIsPaused((prev) => !prev);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCodingOpen]);

  // Open Challenge from in-game station interaction
  const handleOpenChallenge = (missionNum) => {
    setCodingMissionNum(missionNum);
    setActiveMissionNum(missionNum);
    setExecutionResult(null);
    setValidationResult(null);
    setIsCodingOpen(true);
    soundEngine.playClick();
  };

  // Run student's Python code & validate
  const handleRunCode = async () => {
    setIsRunning(true);
    setValidationResult(null);
    soundEngine.playClick();

    const currentCode = codePerMission[codingMissionNum] || codingMission.starterCode;

    try {
      const result = await runPythonCode(currentCode);
      const scope = result.scope || extractPythonScope(currentCode);
      setExecutionResult(result);

      // Validate student's genuine solution against mission requirements
      const validation = await codingMission.validate(result, scope, currentCode);
      setValidationResult(validation);

      if (validation.passed) {
        soundEngine.playVictory();

        // Add to completed missions
        let nextCompleted = [...completedSubmissions];
        if (!nextCompleted.includes(codingMission.num)) {
          nextCompleted.push(codingMission.num);
          nextCompleted.sort((a, b) => a - b);
          setCompletedSubmissions(nextCompleted);
        }

        // Confetti burst
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#2d6a4f", "#52b788", "#fbbf24", "#38bdf8"]
        });

        // If all 6 missions are finished, mark Level 1 complete in global LearnX state!
        if (nextCompleted.length >= 6 || codingMission.num === 6) {
          completeMission(3, 100, {
            id: "gate_opener",
            name: "Gate Opener",
            icon: "🚪",
            description: "Mastered Level 1: Wildwood Sanctuary 2D Platformer",
          });
        }
      } else {
        soundEngine.playIncorrect();
      }
    } catch (err) {
      setExecutionResult({
        isSuccess: false,
        output: "",
        error: String(err?.message || err)
      });
      setValidationResult({
        passed: false,
        message: `Runtime Error: ${err?.message || "Execution failed"}`
      });
      soundEngine.playIncorrect();
    } finally {
      setIsRunning(false);
    }
  };

  // Resume game after solving coding challenge
  const handleContinueAdventure = () => {
    setIsCodingOpen(false);
    setExecutionResult(null);
    setValidationResult(null);
    soundEngine.playClick();

    if (codingMissionNum === 6) {
      setShowCelebration(true);
    } else {
      setActiveMissionNum(Math.min(6, codingMissionNum + 1));
    }
  };

  const handleEnterLevel2 = () => {
    soundEngine.playClick();
    navigateTo("living_forest");
  };

  const healthPercent = Math.min(100, Math.round((completedSubmissions.length / 6) * 100));

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#07160F] select-none">
      {/* ============================================================ */}
      {/* 1. PLAYABLE 2D PLATFORMER CANVAS */}
      {/* ============================================================ */}
      <WildwoodPlatformerCanvas
        completedMissions={completedSubmissions}
        activeMissionNum={activeMissionNum}
        onOpenChallenge={handleOpenChallenge}
        onCollectAcorn={() => setAcornCount((prev) => prev + 1)}
        acornCount={acornCount}
        isPaused={isPaused || isCodingOpen}
        onLevelComplete={() => setShowCelebration(true)}
        restartTrigger={restartTrigger}
      />

      {/* ============================================================ */}
      {/* 2. COMPACT FLOATING TOP HUD (HEADS-UP DISPLAY) */}
      {/* ============================================================ */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between gap-2 pointer-events-none">
        {/* Left: Exit & Pause Buttons */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => navigateTo("quest_map")}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-[#0B2418]/90 hover:bg-[#133F2B] border border-[#2D6A4F] text-white text-xs font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-xs"
            title="Exit to Quest Map"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#52B788]" />
            <span>Exit</span>
          </button>

          <button
            onClick={() => setIsPaused((prev) => !prev)}
            className="p-1.5 rounded-xl bg-[#0B2418]/90 hover:bg-[#133F2B] border border-[#2D6A4F] text-white text-xs font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-xs"
            title={isPaused ? "Resume Game (Esc)" : "Pause Game (Esc)"}
          >
            {isPaused ? <Play className="w-4 h-4 text-[#86EFAC]" /> : <Pause className="w-4 h-4 text-[#A7F3D0]" />}
          </button>

          {/* Level Title Tag */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B2418]/80 border border-[#2D6A4F]/60 text-white text-xs font-bold backdrop-blur-xs">
            <span className="text-[10px] uppercase font-mono text-[#52B788]">Eco Woods 01</span>
            <span className="text-[#DEECE3]">Wildwood Sanctuary</span>
          </div>
        </div>

        {/* Center: Health & Collectibles */}
        <div className="flex items-center gap-2.5 pointer-events-auto">
          {/* Health Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0B2418]/90 border border-[#2D6A4F] text-white text-xs font-bold shadow-lg backdrop-blur-xs">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            <span className="text-[#86EFAC]">Health {healthPercent}%</span>
            <div className="w-14 h-1.5 bg-[#143D27] rounded-full overflow-hidden hidden sm:block">
              <div
                className="h-full bg-[#22C55E] transition-all duration-500"
                style={{ width: `${healthPercent}%` }}
              />
            </div>
          </div>

          {/* Golden Acorns Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0B2418]/90 border border-[#B45309] text-white text-xs font-bold shadow-lg backdrop-blur-xs">
            <span className="text-sm">🌰</span>
            <span className="text-[#FDE047]">{acornCount} / 24</span>
          </div>
        </div>

        {/* Right: Active Mission Objective Tracker */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B2418]/90 border border-[#2D6A4F] text-white text-xs font-bold shadow-lg backdrop-blur-xs">
            <span className="text-[10px] font-mono font-bold text-[#86EFAC] bg-[#14422A] px-2 py-0.5 rounded-full">
              M{activeMissionNum}/6
            </span>
            <span className="text-white hidden sm:inline">{activeMission.title}</span>
            {completedSubmissions.includes(activeMissionNum) && (
              <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
            )}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. PAUSE MODAL OVERLAY */}
      {/* ============================================================ */}
      {isPaused && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#0D261A] border-2 border-[#52B788] rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl text-white animate-scaleUp">
            <h2 className="text-xl font-black text-white tracking-tight">
              Wildwood Sanctuary Paused
            </h2>
            <p className="text-xs text-[#A7F3D0] leading-relaxed">
              Explore the forest to discover animal stations. Approach them and press <strong>E</strong> or tap <strong>CODE</strong> to solve Python challenges that alter the world!
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => setIsPaused(false)}
                className="w-full py-3 px-5 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-[#052E16] font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Resume Game</span>
              </button>

              <button
                onClick={() => {
                  setRestartTrigger((prev) => prev + 1);
                  setIsPaused(false);
                  soundEngine.playClick();
                }}
                className="w-full py-2.5 px-5 rounded-xl bg-[#143D27] hover:bg-[#1B5234] text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#52B788]" />
                <span>Respawn at Zone Checkpoint</span>
              </button>

              <button
                onClick={() => navigateTo("quest_map")}
                className="w-full py-2.5 px-5 rounded-xl bg-[#0B2418] hover:bg-[#143D27] text-[#A7F3D0] hover:text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                Return to Quest Map
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. IN-GAME CODING MODAL (EMBEDDED CHALLENGE TERMINAL) */}
      {/* ============================================================ */}
      <WildwoodCodingModal
        mission={codingMission}
        isOpen={isCodingOpen}
        onClose={() => setIsCodingOpen(false)}
        code={codePerMission[codingMissionNum] || codingMission.starterCode}
        setCode={(newCode) => {
          setCodePerMission((prev) => ({
            ...prev,
            [codingMissionNum]: newCode
          }));
        }}
        onRunCode={handleRunCode}
        isRunning={isRunning}
        executionResult={executionResult}
        validationResult={validationResult}
        isMissionCompleted={completedSubmissions.includes(codingMissionNum)}
        onContinueAdventure={handleContinueAdventure}
      />

      {/* ============================================================ */}
      {/* 5. 100% RECOVERY VICTORY MODAL (DIRECT PORTAL TO LEVEL 2) */}
      {/* ============================================================ */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0C2217] border-2 border-[#52B788] rounded-[32px] p-7 max-w-md w-full shadow-2xl text-center space-y-4 animate-scaleUp text-white">
            <div className="w-16 h-16 rounded-3xl bg-[#14422A] border border-[#52B788] flex items-center justify-center text-[#52B788] mx-auto shadow-md">
              <Sparkles className="w-8 h-8 text-[#86EFAC] animate-spin" />
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#86EFAC] uppercase bg-[#14422A] px-3 py-1 rounded-full border border-[#2D6A4F]">
                Level 1 Mastered · 100% Recovery
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight mt-2">
                Wildwood Sanctuary Restored!
              </h2>
              <p className="text-xs text-[#A7F3D0] mt-1">
                All 6 Keeper Coding Missions Completed in the World
              </p>
            </div>

            <p className="text-xs text-[#DEECE3] bg-[#143D27] p-3.5 rounded-2xl border border-[#2D6A4F] leading-relaxed font-medium">
              You repaired the clinic bridge, settled Pip into the burrow, opened the meadow gate, automated dinner feeding, stocked winter supplies, and passed the sanctuary inspection! The Ancient Portal is active!
            </p>

            {/* Reward Badges */}
            <div className="grid grid-cols-2 gap-2 text-left">
              <div className="p-2.5 rounded-xl bg-[#0F2D1F] border border-[#2D6A4F] flex items-center gap-2">
                <span className="text-xl">⚡</span>
                <div>
                  <div className="text-[9px] font-bold text-[#86EFAC] uppercase">Reward XP</div>
                  <div className="text-xs font-black text-[#FBBF24]">+100 XP</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0F2D1F] border border-[#2D6A4F] flex items-center gap-2">
                <span className="text-xl">🚪</span>
                <div>
                  <div className="text-[9px] font-bold text-[#86EFAC] uppercase">Badge Unlocked</div>
                  <div className="text-xs font-black text-white">Gate Opener</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleEnterLevel2}
                className="w-full py-4 px-6 rounded-2xl bg-[#22C55E] hover:bg-[#16A34A] text-[#052E16] font-black text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
              >
                <Trees className="w-4 h-4 text-[#052E16]" />
                <span>Go to Level 2 — The Living Forest (3D)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowCelebration(false)}
                className="w-full py-2 text-xs font-bold text-[#A7F3D0] hover:text-white cursor-pointer"
              >
                Keep Exploring Wildwood Sanctuary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
