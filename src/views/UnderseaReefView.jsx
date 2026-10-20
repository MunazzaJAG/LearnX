import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { useGameState } from "../context/GameStateContext";
import { ALL_UNDERSEA_SUBLEVELS, getSublevelByNum } from "../data/underseaCurriculum";
import { UnderseaScene } from "../components/undersea3d/UnderseaScene";
import { UnderseaHUD } from "../components/undersea3d/UnderseaHUD";
import { PythonCodePanel } from "../components/undersea3d/PythonCodePanel";
import { DiverCustomizerModal } from "../components/undersea3d/DiverCustomizerModal";
import { runPythonCode, extractPythonScope } from "../utils/pythonRunner";
import { underseaAudio } from "../utils/underseaAudio";
import { soundEngine } from "../utils/audio";
import {
  Sparkles,
  Award,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Play
} from "lucide-react";

export function UnderseaReefView() {
  const {
    underseaProgress,
    completeUnderseaSublevel,
    updateDiverCustomization,
    navigateTo,
    xp,
    soundEnabled,
    toggleSound
  } = useGameState();

  const progress = underseaProgress || {
    completedSublevels: [],
    currentSublevel: 1,
    restorationPercent: 0,
    diverCustomization: {
      suitColor: "#1b8a7a",
      accentColor: "#52e3c2",
      visorColor: "#20d3d3",
      tankColor: "#e2e8f0",
      finsColor: "#0f766e"
    },
    unlockedEquipment: [],
    collectibles: []
  };

  const [selectedSublevelNum, setSelectedSublevelNum] = useState(null);
  const completedSublevels = progress.completedSublevels || [];
  const currentSublevelNum = selectedSublevelNum || progress.currentSublevel || 1;
  const activeSublevel = getSublevelByNum(currentSublevelNum);

  // UI state
  const [isCodeOpen, setIsCodeOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [proximityLandmark, setProximityLandmark] = useState(null);

  // Code editor state
  const [code, setCode] = useState(activeSublevel.starterCode || "");
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [lastExecutionSuccess, setLastExecutionSuccess] = useState(null);

  // Victory Celebration Modal
  const [celebrationData, setCelebrationData] = useState(null);

  // Update starter code when sublevel changes
  useEffect(() => {
    if (activeSublevel?.starterCode) {
      setCode(activeSublevel.starterCode);
    }
    setExecutionResult(null);
    setValidationResult(null);
  }, [activeSublevel?.num]);

  // Keep audio context synced with global mute
  useEffect(() => {
    underseaAudio.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // Run Python Code & Validate against dynamic scenario
  const handleRunCode = async () => {
    setIsRunning(true);
    setValidationResult(null);
    underseaAudio.playBubble();

    try {
      // 1. Run genuine Python code via WebAssembly CPython (with local fallback)
      const result = await runPythonCode(code);
      const scope = result.scope || extractPythonScope(code);
      setExecutionResult(result);

      // 2. Generate dynamic anti-copy-paste scenario parameters
      const dynamicParams = activeSublevel.generateDynamicScenario
        ? activeSublevel.generateDynamicScenario()
        : {};

      // 3. Perform behavioral validation against the dynamic scenario
      const validation = await activeSublevel.validate(result, scope, dynamicParams);
      setValidationResult(validation);

      if (validation.passed) {
        underseaAudio.playSuccess();

        // 4. Record progression in GameStateContext
        completeUnderseaSublevel({
          sublevelNum: activeSublevel.num,
          rewardXP: activeSublevel.rewardXP,
          equipmentUnlock: activeSublevel.equipmentUnlock,
          badgeUnlock: activeSublevel.badgeUnlock,
          restorationDelta: activeSublevel.restorationDelta
        });

        // 5. Trigger in-world 3D animations and reactions
        setLastExecutionSuccess({
          sublevelNum: activeSublevel.num,
          timestamp: Date.now(),
          payload: validation.actionPayload
        });

        // 6. Burst Confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#38bdf8", "#34d399", "#f59e0b", "#ec4899"]
        });

        // 7. Show celebration modal
        setCelebrationData({
          title: activeSublevel.title,
          landmark: activeSublevel.landmark,
          message: validation.message,
          xp: activeSublevel.rewardXP,
          equipment: activeSublevel.equipmentUnlock,
          badge: activeSublevel.badgeUnlock
        });
      } else {
        underseaAudio.playError();
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
      underseaAudio.playError();
    } finally {
      setIsRunning(false);
    }
  };

  const handleOpenTerminal = (targetNum = null) => {
    if (typeof targetNum === "number") {
      setSelectedSublevelNum(targetNum);
    } else if (proximityLandmark?.num && !completedSublevels.includes(proximityLandmark.num)) {
      setSelectedSublevelNum(proximityLandmark.num);
    }
    setIsCodeOpen(true);
  };

  const handleNextSublevel = () => {
    setCelebrationData(null);
    setIsCodeOpen(false);
    const nextNum = Math.min(6, currentSublevelNum + 1);
    setSelectedSublevelNum(nextNum);
  };

  const isLevel1Mastered = currentSublevelNum >= 6 && celebrationData;

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#031525]">
      {/* 3D Undersea World Viewport */}
      <UnderseaScene
        currentSublevel={activeSublevel}
        completedSublevelNums={completedSublevels}
        restorationPercent={progress.restorationPercent || 0}
        diverCustomization={progress.diverCustomization}
        onProximityChange={setProximityLandmark}
        onOpenTerminal={() => handleOpenTerminal(proximityLandmark?.num)}
        onTriggerSonar={() => {}}
        lastExecutionSuccess={lastExecutionSuccess}
        isCodeOpen={isCodeOpen}
      />

      {/* Floating In-World HUD */}
      <UnderseaHUD
        activeSublevel={activeSublevel}
        completedSublevelNums={completedSublevels}
        restorationPercent={progress.restorationPercent || 0}
        proximityLandmark={proximityLandmark}
        onOpenTerminal={() => handleOpenTerminal()}
        onTriggerSonar={() => {}}
        onTriggerBoost={() => {
          underseaAudio.playThrusterBoost();
        }}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onReturnToMap={() => navigateTo("quest_map")}
        onOpenLearningLab={() => navigateTo("mission_lab", 1)}
        onSelectSublevel={(num) => {
          setSelectedSublevelNum(num);
          setIsCodeOpen(false);
        }}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
      />

      {/* Python Code & Visual Blocks Interaction Panel */}
      <PythonCodePanel
        sublevel={activeSublevel}
        code={code}
        setCode={setCode}
        onRunCode={handleRunCode}
        isRunning={isRunning}
        executionResult={executionResult}
        validationResult={validationResult}
        isOpen={isCodeOpen}
        onClose={() => setIsCodeOpen(false)}
      />

      {/* Diver Customizer Wardrobe Modal */}
      <DiverCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        customization={progress.diverCustomization}
        onUpdateCustomization={updateDiverCustomization}
        completedSublevels={completedSublevels}
      />

      {/* Level / Sublevel Victory Celebration Modal */}
      {celebrationData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0b1726] border border-[#10b981]/50 rounded-3xl p-7 max-w-md w-full shadow-2xl text-center space-y-5 animate-scaleUp">
            <div className="w-16 h-16 rounded-3xl bg-[#064e3b]/80 border border-[#10b981]/40 flex items-center justify-center text-[#34d399] mx-auto shadow-lg shadow-emerald-950/50">
              <Sparkles className="w-8 h-8 animate-spin" />
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#34d399] uppercase bg-[#064e3b]/40 px-3 py-1 rounded-full border border-[#059669]/30">
                {isLevel1Mastered ? "Biome Level 1 Mastered" : "Sublevel Restored"}
              </span>
              <h2 className="text-xl font-black text-white tracking-tight mt-2">
                {celebrationData.title}
              </h2>
              <p className="text-xs text-[#94a3b8] mt-1">{celebrationData.landmark}</p>
            </div>

            <p className="text-xs text-[#a7f3d0] bg-[#064e3b]/40 p-3.5 rounded-2xl border border-[#059669]/30 leading-relaxed font-medium">
              {celebrationData.message}
            </p>

            {/* Rewards Grid */}
            <div className="grid grid-cols-2 gap-2.5 text-left">
              <div className="p-3 rounded-2xl bg-[#071322] border border-[#1e3a5f] flex items-center gap-2.5">
                <span className="text-xl">⚡</span>
                <div>
                  <div className="text-[10px] font-bold text-[#94a3b8] uppercase">XP Earned</div>
                  <div className="text-sm font-black text-[#fbbf24]">+{celebrationData.xp} XP</div>
                </div>
              </div>

              {celebrationData.equipment && (
                <div className="p-3 rounded-2xl bg-[#071322] border border-[#1e3a5f] flex items-center gap-2.5">
                  <span className="text-xl">{celebrationData.equipment.icon}</span>
                  <div>
                    <div className="text-[10px] font-bold text-[#38bdf8] uppercase">New Equipment</div>
                    <div className="text-xs font-black text-white truncate max-w-[100px]">
                      {celebrationData.equipment.name}
                    </div>
                  </div>
                </div>
              )}

              {celebrationData.badge && (
                <div className="p-3 rounded-2xl bg-[#071322] border border-[#1e3a5f] col-span-2 flex items-center gap-2.5">
                  <span className="text-xl">{celebrationData.badge.icon}</span>
                  <div>
                    <div className="text-[10px] font-bold text-[#ec4899] uppercase">Badge Unlocked</div>
                    <div className="text-xs font-black text-white">{celebrationData.badge.name}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Sublevel Action Buttons */}
            {isLevel1Mastered ? (
              <div className="space-y-2">
                <button
                  onClick={() => navigateTo("quest_map")}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#059669] to-[#10b981] hover:from-[#047857] hover:to-[#059669] text-white font-extrabold text-xs shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <span>Return to Quest Map (Level 1 Complete)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCelebrationData(null)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#071322] hover:bg-[#0f243a] text-[#94a3b8] hover:text-white font-medium text-xs transition-all"
                >
                  Free Swim & Explore Reef
                </button>
              </div>
            ) : (
              <button
                onClick={handleNextSublevel}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#059669] to-[#10b981] hover:from-[#047857] hover:to-[#059669] text-white font-extrabold text-xs shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <span>Advance to Sublevel {Math.min(6, currentSublevelNum + 1)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
