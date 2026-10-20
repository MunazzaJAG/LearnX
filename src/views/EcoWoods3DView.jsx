import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { useGameState } from "../context/GameStateContext";
import { ECO_WOODS_MISSIONS, getEcoWoodsMissionByNum } from "../data/ecoWoodsCurriculum";
import { EcoWoodsScene } from "../components/ecowoods3d/EcoWoodsScene";
import { EcoWoodsHUD } from "../components/ecowoods3d/EcoWoodsHUD";
import { EcoWoodsMissionConsole } from "../components/ecowoods3d/EcoWoodsMissionConsole";
import { runPythonCode, extractPythonScope } from "../utils/pythonRunner";
import { ecoWoodsAudio } from "../utils/ecoWoodsAudio";
import { soundEngine } from "../utils/audio";
import {
  Sparkles,
  Award,
  ArrowRight,
  CheckCircle2,
  Lock,
  Trees,
  Gamepad2
} from "lucide-react";

export function EcoWoods3DView() {
  const {
    ecoWoodsProgress,
    completeEcoWoodsMission,
    completeMission,
    completedMissions,
    navigateTo,
    xp,
    soundEnabled,
    toggleSound
  } = useGameState();

  const progress = ecoWoodsProgress || {
    completedMissions: [],
    currentMission: 1,
    restorationPercent: 0,
    unlockedTools: [],
    collectibles: []
  };

  const [selectedMissionNum, setSelectedMissionNum] = useState(null);
  const completedMissionNums = progress.completedMissions || [];
  const currentMissionNum = selectedMissionNum || progress.currentMission || 1;
  const activeMission = getEcoWoodsMissionByNum(currentMissionNum);

  // UI state
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [proximityLandmark, setProximityLandmark] = useState(null);
  const [teleportTarget, setTeleportTarget] = useState(null);

  // Code editor state
  const [code, setCode] = useState(activeMission.starterCode || "");
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [lastExecutionSuccess, setLastExecutionSuccess] = useState(null);

  // Victory Celebration Modal
  const [celebrationData, setCelebrationData] = useState(null);

  // Update starter code when mission changes
  useEffect(() => {
    if (activeMission?.starterCode) {
      setCode(activeMission.starterCode);
    }
    setExecutionResult(null);
    setValidationResult(null);
  }, [activeMission?.num]);

  // Keep audio context synced with global sound
  useEffect(() => {
    ecoWoodsAudio.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // Execute and validate Python code
  const handleRunCode = async () => {
    setIsRunning(true);
    setValidationResult(null);
    ecoWoodsAudio.playClick();

    try {
      const result = await runPythonCode(code);
      const scope = result.scope || extractPythonScope(code);
      setExecutionResult(result);

      const validation = await activeMission.validate(result, scope);
      setValidationResult(validation);

      if (validation.passed) {
        ecoWoodsAudio.playSuccess();

        // 1. Record progress in GameStateContext
        completeEcoWoodsMission({
          missionNum: activeMission.num,
          rewardXP: activeMission.rewardXP,
          toolUnlock: activeMission.toolUnlock,
          badgeUnlock: activeMission.badgeUnlock,
          restorationDelta: activeMission.restorationDelta
        });

        // 2. Trigger in-world 3D reactions
        setLastExecutionSuccess({
          missionNum: activeMission.num,
          timestamp: Date.now(),
          payload: validation.actionPayload
        });

        // 3. Confetti burst
        confetti({
          particleCount: 85,
          spread: 75,
          origin: { y: 0.6 },
          colors: ["#52b788", "#2d6a4f", "#fbbf24", "#38bdf8"]
        });

        // 4. Celebration Modal
        setCelebrationData({
          title: activeMission.title,
          landmark: activeMission.landmark,
          message: validation.message,
          xp: activeMission.rewardXP,
          tool: activeMission.toolUnlock,
          badge: activeMission.badgeUnlock
        });
      } else {
        ecoWoodsAudio.playError();
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
      ecoWoodsAudio.playError();
    } finally {
      setIsRunning(false);
    }
  };

  const handleOpenTerminal = (targetNum = null) => {
    if (typeof targetNum === "number") {
      setSelectedMissionNum(targetNum);
    } else if (proximityLandmark?.num && !completedMissionNums.includes(proximityLandmark.num)) {
      setSelectedMissionNum(proximityLandmark.num);
    }
    setIsConsoleOpen(true);
  };

  const handleSelectMissionFromHUD = (num) => {
    setSelectedMissionNum(num);
    setTeleportTarget(num);
    setIsConsoleOpen(false);
  };

  const handleNextMission = () => {
    setCelebrationData(null);
    setIsConsoleOpen(false);
    const nextNum = Math.min(6, currentMissionNum + 1);
    setSelectedMissionNum(nextNum);
    setTeleportTarget(nextNum);
  };

  const isLevel2Mastered = currentMissionNum >= 6 && celebrationData;

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden bg-[#07160f]">
      {/* 3D Living Forest World Scene */}
      <EcoWoodsScene
        currentMission={activeMission}
        completedMissionNums={completedMissionNums}
        restorationPercent={progress.restorationPercent || 0}
        onProximityChange={setProximityLandmark}
        onOpenTerminal={() => handleOpenTerminal(proximityLandmark?.num)}
        lastExecutionSuccess={lastExecutionSuccess}
        isCodeOpen={isConsoleOpen}
        targetMissionNum={teleportTarget}
      />

      {/* Floating Forest HUD */}
      <EcoWoodsHUD
        activeMission={activeMission}
        completedMissionNums={completedMissionNums}
        restorationPercent={progress.restorationPercent || 0}
        proximityLandmark={proximityLandmark}
        onOpenTerminal={() => handleOpenTerminal()}
        onReturnToMap={() => navigateTo("quest_map")}
        onReturnToLevel1={() => navigateTo("eco_woods")}
        onSelectMission={handleSelectMissionFromHUD}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
      />

      {/* Python Coding Terminal & Mission Console */}
      <EcoWoodsMissionConsole
        mission={activeMission}
        code={code}
        setCode={setCode}
        onRunCode={handleRunCode}
        isRunning={isRunning}
        executionResult={executionResult}
        validationResult={validationResult}
        isOpen={isConsoleOpen}
        onClose={() => setIsConsoleOpen(false)}
      />

      {/* Victory Celebration Modal */}
      {celebrationData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0b2017] border border-[#52b788]/60 rounded-3xl p-7 max-w-md w-full shadow-2xl text-center space-y-5 animate-scaleUp">
            <div className="w-16 h-16 rounded-3xl bg-[#143a29] border border-[#52b788]/40 flex items-center justify-center text-[#52b788] mx-auto shadow-lg shadow-emerald-950/50">
              <Sparkles className="w-8 h-8 animate-spin" />
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#52b788] uppercase bg-[#143a29] px-3 py-1 rounded-full border border-[#2d6a4f]">
                {isLevel2Mastered ? "Continental Biome Mastered" : "Forest Sector Restored"}
              </span>
              <h2 className="text-xl font-black text-white tracking-tight mt-2">
                {celebrationData.title}
              </h2>
              <p className="text-xs text-[#74c69d] mt-1">{celebrationData.landmark}</p>
            </div>

            <p className="text-xs text-[#d8f3dc] bg-[#143a29]/60 p-3.5 rounded-2xl border border-[#2d6a4f]/50 leading-relaxed font-medium">
              {celebrationData.message}
            </p>

            {/* Rewards Grid */}
            <div className="grid grid-cols-2 gap-2.5 text-left">
              <div className="p-3 rounded-2xl bg-[#07160f] border border-[#1b4332] flex items-center gap-2.5">
                <span className="text-xl">⚡</span>
                <div>
                  <div className="text-[10px] font-bold text-[#74c69d] uppercase">XP Earned</div>
                  <div className="text-sm font-black text-[#fbbf24]">+{celebrationData.xp} XP</div>
                </div>
              </div>

              {celebrationData.tool && (
                <div className="p-3 rounded-2xl bg-[#07160f] border border-[#1b4332] flex items-center gap-2.5">
                  <span className="text-xl">{celebrationData.tool.icon}</span>
                  <div>
                    <div className="text-[10px] font-bold text-[#52b788] uppercase">New Ranger Gear</div>
                    <div className="text-xs font-black text-white truncate max-w-[100px]">
                      {celebrationData.tool.name}
                    </div>
                  </div>
                </div>
              )}

              {celebrationData.badge && (
                <div className="p-3 rounded-2xl bg-[#07160f] border border-[#1b4332] col-span-2 flex items-center gap-2.5">
                  <span className="text-xl">{celebrationData.badge.icon}</span>
                  <div>
                    <div className="text-[10px] font-bold text-[#fbbf24] uppercase">Badge Unlocked</div>
                    <div className="text-xs font-black text-white">{celebrationData.badge.name}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {isLevel2Mastered ? (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    completeMission(4, 200, {
                      id: "eco_guardian",
                      name: "Eco Guardian",
                      icon: "🌳",
                      description: "Mastered Level 2: 3D Living Forest Experience",
                    });
                    navigateTo("quest_map");
                  }}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#2d6a4f] to-[#52b788] hover:from-[#1b4332] hover:to-[#40916c] text-[#081c14] font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
                >
                  <span>Return to Quest Map (Level 2 Complete)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCelebrationData(null)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#07160f] hover:bg-[#112d1f] text-[#74c69d] hover:text-white font-medium text-xs transition-all cursor-pointer"
                >
                  Free Roam Living Forest
                </button>
              </div>
            ) : (
              <button
                onClick={handleNextMission}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#2d6a4f] to-[#52b788] hover:from-[#1b4332] hover:to-[#40916c] text-[#081c14] font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <span>Advance to Mission {Math.min(6, currentMissionNum + 1)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
