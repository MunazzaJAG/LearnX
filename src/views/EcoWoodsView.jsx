import React from "react";
import {
  ArrowLeft,
  Sparkles,
  Zap,
  Award,
  CheckCircle2,
  Lock,
  Play,
  ArrowRight,
  BookOpen,
  Trees,
  ShieldCheck,
  RotateCcw,
  Compass,
  Terminal,
  GitBranch
} from "lucide-react";
import { useGameState } from "../context/GameStateContext";
import { LEVELS_DATA } from "../data/curriculum";
import { EcoWoodsArt, NovaMascot } from "../components/BiomeVectorArt";
import { soundEngine } from "../utils/audio";

export function EcoWoodsView() {
  const {
    completedMissions,
    currentMissionId,
    navigateTo,
    selectMission,
    xp
  } = useGameState();

  const mission3 = LEVELS_DATA.find((m) => m.level === 3) || LEVELS_DATA[2];
  const mission4 = LEVELS_DATA.find((m) => m.level === 4) || LEVELS_DATA[3];

  const isM3Completed = completedMissions.includes(3);
  const isM4Completed = completedMissions.includes(4);

  const completedCount = (isM3Completed ? 1 : 0) + (isM4Completed ? 1 : 0);
  const biomeXpEarned = (isM3Completed ? 60 : 0) + (isM4Completed ? 60 : 0);
  const isBiomeCompleted = isM3Completed && isM4Completed;

  const nextMissionId = !isM3Completed ? 3 : !isM4Completed ? 4 : 3;

  const handleLaunchMission = (missionId) => {
    soundEngine.playClick();
    selectMission(missionId);
    navigateTo("mission_lab", missionId);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Navigation & Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo("quest_map")}
          className="flex items-center gap-2 text-xs font-bold text-[#355346] hover:text-[#172E26] bg-[#FFFFFF] border border-[#DEECE3] hover:bg-[#EEF5F1] px-4 py-2.5 rounded-2xl shadow-soft transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-[#2A6B53]" />
          <span>Return to World Map</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#1F543D] bg-[#E8F5E9] border border-[#C7E9D3] px-3.5 py-1.5 rounded-full">
            World 02 · Playable Chapter
          </span>
        </div>
      </div>

      {/* Hero Overview Banner */}
      <div className="bg-gradient-to-r from-[#173F2E] via-[#215740] to-[#2D7355] rounded-[32px] p-7 md:p-9 text-white shadow-soft relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 border border-[#3A8565]">
        {/* Subtle Foliage Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#A7F3D0_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="space-y-4 z-10 max-w-xl">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#52B788] animate-pulse" />
            <span className="text-[11px] font-mono tracking-widest text-[#B7E4C7] uppercase font-bold">
              NEXA Living Forest · Sector 02
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Eco Woods
          </h1>

          <p className="text-sm md:text-base font-medium text-[#D1F2DE] italic leading-relaxed">
            “The Living Forest — Use input and decisions to open paths through the ancient woods.”
          </p>

          <p className="text-xs text-[#E8F8EE] leading-relaxed opacity-90">
            Beyond the ocean shelf lies the ancient living forest of Eco Woods. Conduits run dark across towering roots and mossy stone gates. To restore the canopy telemetry and direct travelers safely along the branches, your Python programs must capture live interactive input and evaluate conditional logic.
          </p>

          {/* Quick CTA */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleLaunchMission(nextMissionId)}
              className="py-3 px-6 rounded-2xl bg-[#52B788] hover:bg-[#40916C] text-[#0C2921] hover:text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>
                {isBiomeCompleted
                  ? "Replay Mission 3: Security Gate"
                  : isM3Completed
                  ? "Continue to Mission 4: User Terminal"
                  : "Begin Mission 3: Security Gate"}
              </span>
            </button>

            {isBiomeCompleted && (
              <span className="text-xs font-bold text-[#B7E4C7] flex items-center gap-1.5 bg-[#143B2B] px-3.5 py-2 rounded-xl border border-[#27634A]">
                <CheckCircle2 className="w-4 h-4 text-[#52B788]" />
                <span>Forest Restored (100% Complete)</span>
              </span>
            )}
          </div>
        </div>

        {/* Hero Artwork */}
        <div className="w-full lg:w-96 flex-shrink-0 z-10 flex items-center justify-center">
          <div className="rounded-2xl overflow-hidden border-2 border-[#52B788]/60 shadow-lg bg-[#0F3526]/50 backdrop-blur-sm">
            <EcoWoodsArt className="w-full h-auto drop-shadow-md" />
          </div>
        </div>
      </div>

      {/* Biome Progress Tracker Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Missions Progress */}
        <div className="bg-[#FFFFFF] border border-[#DEECE3] rounded-3xl p-5 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#2D6A4F] flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6E8076]">Biome Progress</span>
              <span className="text-xs font-extrabold text-[#172E26]">{completedCount} / 2 missions</span>
            </div>
            <div className="w-full h-2.5 bg-[#EDF3EF] rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-[#2D6A4F] rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / 2) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Biome XP */}
        <div className="bg-[#FFFFFF] border border-[#DEECE3] rounded-3xl p-5 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF6EA] text-[#ECA752] flex items-center justify-center flex-shrink-0">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#6E8076]">Expedition XP Earned</div>
            <div className="text-xl font-black text-[#172E26] tracking-tight mt-0.5">
              {biomeXpEarned} <span className="text-xs font-semibold text-[#8C9C92]">/ 120 XP</span>
            </div>
          </div>
        </div>

        {/* Collectible Badges */}
        <div className="bg-[#FFFFFF] border border-[#DEECE3] rounded-3xl p-5 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F4EBFB] text-[#7E57C2] flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#6E8076]">Chapter Badges</div>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`text-xs px-2.5 py-1 rounded-xl font-bold flex items-center gap-1.5 ${
                  isM3Completed
                    ? "bg-[#E8F5E9] text-[#2D6A4F] border border-[#B7E4C7]"
                    : "bg-[#F3F5F4] text-[#8C9C92]"
                }`}
                title="Gate Opener Badge (Mission 3)"
              >
                <span>🚪</span>
                <span>Gate Opener</span>
              </span>

              <span
                className={`text-xs px-2.5 py-1 rounded-xl font-bold flex items-center gap-1.5 ${
                  isM4Completed
                    ? "bg-[#E8F5E9] text-[#2D6A4F] border border-[#B7E4C7]"
                    : "bg-[#F3F5F4] text-[#8C9C92]"
                }`}
                title="Logic Navigator Badge (Mission 4)"
              >
                <span>🧭</span>
                <span>Logic Navigator</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Expedition Route & Mission Nodes */}
      <div className="bg-[#FFFFFF] border border-[#DEECE3] rounded-[32px] p-6 md:p-8 shadow-soft space-y-6">
        <div>
          <div className="text-[11px] font-bold tracking-widest text-[#7E9387] uppercase mb-1">
            Sector Route · Eco Woods
          </div>
          <h2 className="text-2xl font-black text-[#172E26] tracking-tight">
            Playable Forest Missions
          </h2>
          <p className="text-xs text-[#5D7267] mt-0.5">
            Step through the ancient stone security gate, then configure branching routes at the central terminal.
          </p>
        </div>

        {/* Mission Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mission 3: Security Gate */}
          <div
            className={`border rounded-3xl p-6 transition-all flex flex-col justify-between space-y-5 ${
              isM3Completed
                ? "bg-[#F4FAF6] border-[#BDE0CB]"
                : "bg-[#FFFFFF] border-[#DEECE3] shadow-soft hover:border-[#2D6A4F]"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#2D6A4F] bg-[#E8F5E9] px-3 py-1 rounded-full">
                  Location 01 · Entrance
                </span>
                {isM3Completed ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-[#2D6A4F] bg-[#E8F5E9] px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Completed</span>
                  </span>
                ) : (
                  <span className="text-xs font-black text-[#2D6A4F]">
                    Ready to Play
                  </span>
                )}
              </div>

              <div>
                <div className="text-xs font-bold text-[#7E9387]">Mission 03</div>
                <h3 className="text-xl font-black text-[#172E26] tracking-tight">
                  Security Gate
                </h3>
                <div className="text-xs text-[#2D6A4F] font-semibold mt-0.5">
                  input() and int() type conversion
                </div>
              </div>

              <p className="text-xs text-[#526B5F] leading-relaxed">
                Learn how Python pauses to ask the user questions with <code className="text-[#2D6A4F] bg-[#E8F5E9] px-1 py-0.5 rounded font-mono font-bold">input()</code> and converts string input to integers with <code className="text-[#2D6A4F] bg-[#E8F5E9] px-1 py-0.5 rounded font-mono font-bold">int()</code>.
              </p>

              <div className="pt-2 flex items-center justify-between text-xs font-bold border-t border-[#EDF3ED]">
                <div className="flex items-center gap-1.5 text-[#2D6A4F]">
                  <Zap className="w-4 h-4 fill-current text-[#ECA752]" />
                  <span>+60 XP</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#7E57C2]">
                  <Award className="w-4 h-4" />
                  <span>Badge: Gate Opener</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleLaunchMission(3)}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#2D6A4F] hover:bg-[#1F4F39] text-white font-extrabold text-xs shadow-soft transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              {isM3Completed ? (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>Replay Mission 3</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Launch Security Gate</span>
                </>
              )}
            </button>
          </div>

          {/* Mission 4: User Terminal */}
          <div
            className={`border rounded-3xl p-6 transition-all flex flex-col justify-between space-y-5 ${
              isM4Completed
                ? "bg-[#F4FAF6] border-[#BDE0CB]"
                : !isM3Completed
                ? "bg-[#F9FAF9] border-[#E5EAE6] opacity-80"
                : "bg-[#FFFFFF] border-[#DEECE3] shadow-soft hover:border-[#2D6A4F]"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#2D6A4F] bg-[#E8F5E9] px-3 py-1 rounded-full">
                  Location 02 · Deep Woods
                </span>
                {isM4Completed ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-[#2D6A4F] bg-[#E8F5E9] px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Completed</span>
                  </span>
                ) : !isM3Completed ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-[#8C9C92] bg-[#EEF2F0] px-2.5 py-1 rounded-full">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Locked (Complete M3 First)</span>
                  </span>
                ) : (
                  <span className="text-xs font-black text-[#2D6A4F]">
                    Unlocked & Ready
                  </span>
                )}
              </div>

              <div>
                <div className="text-xs font-bold text-[#7E9387]">Mission 04</div>
                <h3 className="text-xl font-black text-[#172E26] tracking-tight">
                  User Terminal
                </h3>
                <div className="text-xs text-[#2D6A4F] font-semibold mt-0.5">
                  Branching logic with if, elif, and else
                </div>
              </div>

              <p className="text-xs text-[#526B5F] leading-relaxed">
                Teach the terminal to make decisions using <code className="text-[#2D6A4F] bg-[#E8F5E9] px-1 py-0.5 rounded font-mono font-bold">if</code>, <code className="text-[#2D6A4F] bg-[#E8F5E9] px-1 py-0.5 rounded font-mono font-bold">elif</code>, and <code className="text-[#2D6A4F] bg-[#E8F5E9] px-1 py-0.5 rounded font-mono font-bold">else</code> with comparison operators like <code className="text-[#2D6A4F] bg-[#E8F5E9] px-1 py-0.5 rounded font-mono font-bold">==</code>, <code className="text-[#2D6A4F] bg-[#E8F5E9] px-1 py-0.5 rounded font-mono font-bold">&lt;</code>, and <code className="text-[#2D6A4F] bg-[#E8F5E9] px-1 py-0.5 rounded font-mono font-bold">&gt;=</code>.
              </p>

              <div className="pt-2 flex items-center justify-between text-xs font-bold border-t border-[#EDF3ED]">
                <div className="flex items-center gap-1.5 text-[#2D6A4F]">
                  <Zap className="w-4 h-4 fill-current text-[#ECA752]" />
                  <span>+60 XP</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#7E57C2]">
                  <Award className="w-4 h-4" />
                  <span>Badge: Logic Navigator</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleLaunchMission(4)}
              disabled={!isM3Completed}
              className={`w-full py-3.5 px-6 rounded-2xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 ${
                !isM3Completed
                  ? "bg-[#D9E2DC] text-[#7E9387] cursor-not-allowed"
                  : "bg-[#2D6A4F] hover:bg-[#1F4F39] text-white shadow-soft active:scale-95"
              }`}
            >
              {!isM3Completed ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Complete Mission 3 to Unlock</span>
                </>
              ) : isM4Completed ? (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>Replay Mission 4</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Launch User Terminal</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Curriculum & Concept Summary */}
      <div className="bg-[#FFFFFF] border border-[#DEECE3] rounded-[32px] p-6 md:p-8 shadow-soft space-y-4">
        <div className="flex items-center gap-2 text-xs font-extrabold text-[#1F543D] uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-[#52B788]" />
          <span>Core Python Competencies in Eco Woods</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
          <div className="p-4 bg-[#F8FAF8] border border-[#E3EDE5] rounded-2xl space-y-1.5">
            <div className="font-mono text-xs font-bold text-[#2D6A4F]">input()</div>
            <div className="text-xs font-extrabold text-[#172E26]">Interactive Input</div>
            <p className="text-[11px] text-[#55695E] leading-relaxed">
              Pauses code execution to prompt the user. Returns typed data as a string (str).
            </p>
          </div>

          <div className="p-4 bg-[#F8FAF8] border border-[#E3EDE5] rounded-2xl space-y-1.5">
            <div className="font-mono text-xs font-bold text-[#2D6A4F]">int()</div>
            <div className="text-xs font-extrabold text-[#172E26]">Type Casting</div>
            <p className="text-[11px] text-[#55695E] leading-relaxed">
              Converts numeric string input into integers for mathematical addition and numeric checks.
            </p>
          </div>

          <div className="p-4 bg-[#F8FAF8] border border-[#E3EDE5] rounded-2xl space-y-1.5">
            <div className="font-mono text-xs font-bold text-[#2D6A4F]">if / elif / else</div>
            <div className="text-xs font-extrabold text-[#172E26]">Branching Decisions</div>
            <p className="text-[11px] text-[#55695E] leading-relaxed">
              Evaluates boolean expressions top-to-bottom. Runs indented code block for the first True match.
            </p>
          </div>

          <div className="p-4 bg-[#F8FAF8] border border-[#E3EDE5] rounded-2xl space-y-1.5">
            <div className="font-mono text-xs font-bold text-[#2D6A4F]">==, &lt;, &gt;=, !=</div>
            <div className="text-xs font-extrabold text-[#172E26]">Comparison Logic</div>
            <p className="text-[11px] text-[#55695E] leading-relaxed">
              Tests values for equality and order, evaluating strictly to True or False.
            </p>
          </div>
        </div>

        {/* Mascot Tip */}
        <div className="mt-4 pt-4 border-t border-[#EDF3ED] flex items-center gap-4 bg-[#F4FAF6] p-4 rounded-2xl">
          <NovaMascot size={44} mood="curious" />
          <div className="text-xs text-[#2D5643] leading-relaxed">
            <strong className="text-[#133F2E]">NOVA's Expedition Log:</strong> "The forest gates are smart, Explorer. When asking for a clearance number, remember that <code className="bg-[#FFFFFF] px-1 py-0.5 rounded font-mono font-bold text-[#2D6A4F]">input()</code> always delivers words! Wrapping it with <code className="bg-[#FFFFFF] px-1 py-0.5 rounded font-mono font-bold text-[#2D6A4F]">int()</code> is how we turn words into numbers."
          </div>
        </div>
      </div>
    </div>
  );
}
