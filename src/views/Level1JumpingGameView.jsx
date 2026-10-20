import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  ArrowRight,
  Zap,
  Award,
  Sparkles,
  CheckCircle2,
  Gamepad2,
  RotateCcw,
  BookOpen,
  Waves,
  Lock
} from "lucide-react";
import { useGameState } from "../context/GameStateContext";
import { PlayableWorld } from "../components/game/PlayableWorld";
import { soundEngine } from "../utils/audio";

export function Level1JumpingGameView() {
  const {
    completedMissions,
    completeMission,
    navigateTo,
    xp
  } = useGameState();

  const [isCompleted, setIsCompleted] = useState(completedMissions.includes(1));
  const [showCelebration, setShowCelebration] = useState(false);

  const handleGameComplete = () => {
    // Record completion in global game state
    completeMission(1, 100, {
      id: "first_line",
      name: "First Line",
      icon: "🌊",
      description: "Mastered Level 1: Undersea Reef Python Jumping Game",
    });

    setIsCompleted(true);
    setShowCelebration(true);

    try {
      soundEngine.playVictory();
    } catch {
      // Audio fallback
    }

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#2a6b53", "#52b788", "#f4c95d", "#a78bfa"]
      });
    } catch {
      // Confetti fallback
    }
  };

  const handleEnterLevel2 = () => {
    soundEngine.playClick();
    navigateTo("undersea_reef");
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Header Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#FFFFFF] border border-[#DEECE3] rounded-3xl px-6 py-4 shadow-soft">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateTo("quest_map")}
            className="flex items-center gap-1.5 text-xs font-bold text-[#355346] hover:text-[#172E26] bg-[#F4F7F4] hover:bg-[#EAEFEA] px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#2A6B53]" />
            <span>Quest Map</span>
          </button>

          <div className="h-6 w-px bg-[#E4ECE4]" />

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#1E7268] bg-[#E6F5F4] px-2.5 py-0.5 rounded-full">
                Undersea Reef · Level 1
              </span>
              <span className="text-xs font-semibold text-[#8C9C92]">
                Python Jumping Game
              </span>
            </div>
            <h1 className="text-lg font-black text-[#172E26] tracking-tight">
              Reef Shallows: The Python Platformer
            </h1>
          </div>
        </div>

        {/* Right Badges & XP */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#2A6B53] bg-[#EBF5EE] px-3 py-1.5 rounded-xl">
            <Zap className="w-3.5 h-3.5 fill-[#2A6B53]" />
            <span>+100 XP</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#7E57C2] bg-[#F5EFFB] px-3 py-1.5 rounded-xl border border-[#E9DDF5]">
            <Award className="w-3.5 h-3.5" />
            <span>First Line Badge</span>
          </div>

          {(isCompleted || completedMissions.includes(1)) && (
            <span className="text-xs font-bold text-[#2A6B53] bg-[#E6F5EC] px-3 py-1.5 rounded-xl flex items-center gap-1 border border-[#BEE4CE]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Level 1 Complete</span>
            </span>
          )}
        </div>
      </div>

      {/* Level Briefing Pill Card */}
      <div className="bg-[#FFFFFF] border border-[#DEECE3] rounded-3xl p-5 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F5EE] border border-[#CDE9D7] flex items-center justify-center text-[#2A6B53]">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-[#2A6B53]">
              Level 1 Objective
            </div>
            <h3 className="text-sm font-black text-[#172E26]">
              Jump between platforms, answer the 6 Python questions, collect all stars, and enter the portal!
            </h3>
            <p className="text-xs text-[#5D7267] mt-0.5">
              Completing this level awakens the portal and unlocks <strong>Level 2: 3D Undersea Reef Experience</strong>.
            </p>
          </div>
        </div>

        {completedMissions.includes(1) ? (
          <button
            onClick={handleEnterLevel2}
            className="py-3 px-5 rounded-2xl bg-[#1E7268] hover:bg-[#15564E] text-white font-black text-xs shadow-md transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer active:scale-95"
          >
            <Waves className="w-4 h-4 text-[#A8EAE2]" />
            <span>Go to Level 2 (3D Experience)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#F6F8F6] border border-[#DEECE3] text-xs font-bold text-[#6D8275] flex-shrink-0">
            <Lock className="w-4 h-4 text-[#D97706]" />
            <span>Level 2 Unlocks on Level 1 Portal Entry</span>
          </div>
        )}
      </div>

      {/* The Actual Jumping-Platform Game Component */}
      <PlayableWorld
        biomeKey="ocean"
        levelTitle="Undersea Reef: Python Jumping Game 🌊"
        levelSubtitle="Jump between platforms, solve Python challenges to gather stars, and reach the portal!"
        onComplete={handleGameComplete}
      />

      {/* Celebration & Level 2 Unlock Modal */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FFFFFF] border-2 border-[#10b981] rounded-[32px] p-8 max-w-lg w-full shadow-2xl text-center space-y-6 animate-scaleUp">
            <div className="w-20 h-20 rounded-3xl bg-[#E8F5EE] border-2 border-[#10b981]/50 flex items-center justify-center text-[#10b981] mx-auto shadow-lg">
              <Sparkles className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono font-black uppercase tracking-widest text-[#10b981] bg-[#E8F5EE] px-4 py-1.5 rounded-full border border-[#10b981]/30">
                Level 1 Complete! 🎉
              </span>
              <h2 className="text-2xl font-black text-[#172E26] tracking-tight mt-2">
                Undersea Reef Restored!
              </h2>
              <p className="text-xs text-[#5D7267] max-w-sm mx-auto leading-relaxed">
                You collected all 6 Python stars, solved every challenge, and stepped through the portal.
              </p>
            </div>

            {/* Unlocked Reward Box */}
            <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#86EFAC] text-left space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-[#166534]">
                  Rewards Unlocked
                </span>
                <span className="text-xs font-black text-[#15803D] bg-white px-2 py-0.5 rounded-lg border border-[#BBF7D0]">
                  +100 XP
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-2xl">🌊</div>
                <div>
                  <div className="text-xs font-black text-[#14532D]">First Line Badge Unlocked</div>
                  <div className="text-[11px] text-[#166534]">Master of print, variables, and conditions</div>
                </div>
              </div>
            </div>

            {/* Level 2 Unlock Announcement */}
            <div className="p-4 rounded-2xl bg-[#E6F5F4] border border-[#99F6E4] text-left flex items-start gap-3">
              <Waves className="w-6 h-6 text-[#0D9488] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-black text-[#115E59]">
                  Level 2: 3D Undersea Reef Experience Unlocked!
                </div>
                <div className="text-[11px] text-[#134E4A] mt-0.5 leading-relaxed">
                  Dive into the full 3D interactive underwater ocean, explore marine life, pilot submarines, and solve coding stations.
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleEnterLevel2}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#0D9488] to-[#10B981] hover:from-[#0F766E] hover:to-[#059669] text-white font-black text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
              >
                <span>Enter Level 2: 3D Undersea Reef</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowCelebration(false)}
                  className="py-3 px-4 rounded-xl bg-[#F4F7F4] hover:bg-[#EAEFEA] text-[#355346] font-bold text-xs transition-colors cursor-pointer"
                >
                  Stay on Level 1
                </button>

                <button
                  onClick={() => navigateTo("quest_map")}
                  className="py-3 px-4 rounded-xl bg-[#F4F7F4] hover:bg-[#EAEFEA] text-[#355346] font-bold text-xs transition-colors cursor-pointer"
                >
                  Return to Quest Map
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
