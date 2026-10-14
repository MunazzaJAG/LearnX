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
  Waves,
  ShieldCheck,
  RotateCcw
} from "lucide-react";
import { useGameState } from "../context/GameStateContext";
import { LEVELS_DATA } from "../data/curriculum";
import { OceanReefArt, NovaMascot } from "../components/BiomeVectorArt";
import { soundEngine } from "../utils/audio";

export function UnderseaReefView() {
  const {
    completedMissions,
    currentMissionId,
    navigateTo,
    selectMission,
    xp
  } = useGameState();

  const mission1 = LEVELS_DATA.find((m) => m.level === 1) || LEVELS_DATA[0];
  const mission2 = LEVELS_DATA.find((m) => m.level === 2) || LEVELS_DATA[1];

  const isM1Completed = completedMissions.includes(1);
  const isM2Completed = completedMissions.includes(2);

  const completedCount = (isM1Completed ? 1 : 0) + (isM2Completed ? 1 : 0);
  const biomeXpEarned = (isM1Completed ? 50 : 0) + (isM2Completed ? 50 : 0);
  const isBiomeCompleted = isM1Completed && isM2Completed;

  const nextMissionId = !isM1Completed ? 1 : !isM2Completed ? 2 : 1;

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
          <span className="text-[11px] font-black uppercase tracking-wider text-[#1E7268] bg-[#E6F5F4] border border-[#C5EAE5] px-3.5 py-1.5 rounded-full">
            World 01 · Playable Chapter
          </span>
        </div>
      </div>

      {/* Hero Overview Banner */}
      <div className="bg-gradient-to-r from-[#173F3A] via-[#1E564F] to-[#256F66] rounded-[32px] p-7 md:p-9 text-white shadow-soft relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 border border-[#317970]">
        {/* Subtle Water Caustic Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C4F7F0_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="space-y-4 z-10 max-w-xl">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#52B788] animate-pulse" />
            <span className="text-[11px] font-mono tracking-widest text-[#A2E2D7] uppercase font-bold">
              NEXA Ocean Research Hub · Depth 80m
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Undersea Reef
          </h1>

          <p className="text-sm md:text-base font-medium text-[#C4EDE7] italic leading-relaxed">
            “The Shallows of Code — Learn how to make the terminal speak and remember who you are.”
          </p>

          <p className="text-xs text-[#E0F8F4] leading-relaxed opacity-90">
            Located 80 meters beneath the Azure Shelf, the NEXA Ocean Research Hub was the first facility to fall silent during the Continental Disconnection. Submerged conduits still hum with residual power, but the main terminal needs Python code to wake up.
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
                  ? "Replay First Mission"
                  : isM1Completed
                  ? "Continue to Mission 2: Identity"
                  : "Begin Mission 1: First Day"}
              </span>
            </button>

            {isBiomeCompleted && (
              <span className="text-xs font-bold text-[#A2E2D7] flex items-center gap-1.5 bg-[#143B35] px-3.5 py-2 rounded-xl border border-[#2A655C]">
                <CheckCircle2 className="w-4 h-4 text-[#52B788]" />
                <span>Reef Restored (100% Complete)</span>
              </span>
            )}
          </div>
        </div>

        {/* Hero Artwork */}
        <div className="w-full lg:w-96 flex-shrink-0 z-10 flex items-center justify-center">
          <div className="rounded-2xl overflow-hidden border-2 border-[#549E94] shadow-lg bg-[#0F3530]/50 backdrop-blur-sm">
            <OceanReefArt className="w-full h-auto drop-shadow-md" />
          </div>
        </div>
      </div>

      {/* Biome Progress Tracker Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Missions Progress */}
        <div className="bg-[#FFFFFF] border border-[#DEECE3] rounded-3xl p-5 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E6F5F4] text-[#1E7268] flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6E8076]">Biome Progress</span>
              <span className="text-xs font-extrabold text-[#172E26]">{completedCount} / 2 missions</span>
            </div>
            <div className="w-full h-2.5 bg-[#EDF3EF] rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-[#2A6B53] rounded-full transition-all duration-500"
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
              {biomeXpEarned} <span className="text-xs font-semibold text-[#8C9C92]">/ 100 XP</span>
            </div>
          </div>
        </div>

        {/* Collectible Badges */}
        <div className="bg-[#FFFFFF] border border-[#DEECE3] rounded-3xl p-5 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F3EBF9] text-[#7E57C2] flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#6E8076]">Biome Badges</div>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  isM1Completed
                    ? "bg-[#E6F5F4] text-[#1E7268] border border-[#C5EAE5]"
                    : "bg-[#F0F2F1] text-[#9EAFA6]"
                }`}
              >
                🌊 First Line {isM1Completed && "✓"}
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  isM2Completed
                    ? "bg-[#EBF3FB] text-[#2C6CB0] border border-[#CCE2F8]"
                    : "bg-[#F0F2F1] text-[#9EAFA6]"
                }`}
              >
                🆔 Identity Found {isM2Completed && "✓"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Journey: Two Mission Locations Connected by Underwater Pathway */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#172E26] tracking-tight">
            Expedition Route: Undersea Reef
          </h2>
          <p className="text-xs text-[#5D7267]">
            Complete both mission locations in sequence to restore communication with the terminal and register your identity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {/* LOCATION 1: First Day */}
          <div
            className={`bg-[#FFFFFF] border-2 rounded-[28px] p-6 shadow-soft flex flex-col justify-between transition-all relative ${
              isM1Completed
                ? "border-[#BDE3D5] hover:border-[#2A6B53]"
                : "border-[#2A6B53] ring-4 ring-[#2A6B53]/10"
            }`}
          >
            {/* Top Tag & Location Badge */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-[#E6F5F4] text-[#1E7268] font-black text-xs flex items-center justify-center">
                    01
                  </span>
                  <span className="text-[11px] font-bold tracking-widest text-[#7E9186] uppercase">
                    Location: The Sunken Terminal
                  </span>
                </div>

                {isM1Completed ? (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-[#2A6B53] bg-[#EBF5EE] px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Completed</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-extrabold text-[#D97706] bg-[#FEF3C7] px-3 py-1 rounded-full animate-pulse">
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                    <span>Next Up</span>
                  </span>
                )}
              </div>

              {/* Title & Topic */}
              <div className="space-y-1">
                <h3 className="text-xl font-black text-[#172E26] tracking-tight">
                  First Day
                </h3>
                <div className="text-xs font-bold text-[#2A9D8F]">
                  Topic: print(), strings, and comments (#)
                </div>
              </div>

              {/* Lore & Story snippet */}
              <p className="text-xs text-[#526B5F] leading-relaxed">
                You arrive at the NEXA Ocean Research Hub. The main terminal screen is completely blank. NOVA, your companion, asks you to send the first message to the system.
              </p>

              {/* Mini-Games Included in this Mission */}
              <div className="p-3 bg-[#F4FAF7] border border-[#DCEEE5] rounded-2xl space-y-1.5">
                <div className="text-[10px] font-bold text-[#6D8276] uppercase tracking-wider">
                  Included Activities & Challenges:
                </div>
                <ul className="text-xs text-[#355143] space-y-1 font-medium">
                  <li className="flex items-center gap-1.5">
                    <span className="text-[#2A6B53]">●</span>
                    <span>Predict the Transmission (Trace & Predict)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-[#2A6B53]">●</span>
                    <span>Repair the Broken Terminal (Fix Syntax Error)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-[#2A6B53]">●</span>
                    <span>Write Your First Transmission</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-[#2A6B53]">●</span>
                    <span className="font-bold">Boss Battle: Restore NEXA</span>
                  </li>
                </ul>
              </div>

              {/* Rewards */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-[#EDF3ED]">
                <div className="flex items-center gap-1.5 font-bold text-[#2A6B53]">
                  <Zap className="w-3.5 h-3.5 fill-[#2A6B53]" />
                  <span>+50 XP</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold text-[#1E7268]">
                  <span>🌊 Badge: First Line</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-5">
              <button
                onClick={() => handleLaunchMission(1)}
                className="w-full py-3 px-5 rounded-2xl bg-[#2A6B53] hover:bg-[#1E5440] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{isM1Completed ? "Replay Mission 1: First Day" : "Play Mission 1: First Day"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>


          {/* LOCATION 2: Identity */}
          <div
            className={`bg-[#FFFFFF] border-2 rounded-[28px] p-6 shadow-soft flex flex-col justify-between transition-all relative ${
              isM2Completed
                ? "border-[#BDE3D5] hover:border-[#2A6B53]"
                : isM1Completed
                ? "border-[#3A86C8] ring-4 ring-[#3A86C8]/10"
                : "border-[#E2EAE5] opacity-85"
            }`}
          >
            {/* Top Tag & Location Badge */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-[#EBF3FB] text-[#2C6CB0] font-black text-xs flex items-center justify-center">
                    02
                  </span>
                  <span className="text-[11px] font-bold tracking-widest text-[#7E9186] uppercase">
                    Location: Explorer Registry
                  </span>
                </div>

                {isM2Completed ? (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-[#2A6B53] bg-[#EBF5EE] px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Completed</span>
                  </span>
                ) : isM1Completed ? (
                  <span className="flex items-center gap-1.5 text-xs font-extrabold text-[#2C6CB0] bg-[#EBF3FB] px-3 py-1 rounded-full animate-pulse">
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                    <span>Ready to Play</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-bold text-[#7E9387] bg-[#F2F5F3] px-3 py-1 rounded-full">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Locked (Requires Mission 1)</span>
                  </span>
                )}
              </div>

              {/* Title & Topic */}
              <div className="space-y-1">
                <h3 className="text-xl font-black text-[#172E26] tracking-tight">
                  Identity
                </h3>
                <div className="text-xs font-bold text-[#3A86C8]">
                  Topic: Variables and basic data types (str, int, float, bool)
                </div>
              </div>

              {/* Lore & Story snippet */}
              <p className="text-xs text-[#526B5F] leading-relaxed">
                The terminal is online, but NEXA cannot identify its explorer. Save your player details in variables to create an identity card.
              </p>

              {/* Mini-Games Included in this Mission */}
              <div className="p-3 bg-[#F4F8FC] border border-[#DCE7F4] rounded-2xl space-y-1.5">
                <div className="text-[10px] font-bold text-[#6D8276] uppercase tracking-wider">
                  Included Activities & Challenges:
                </div>
                <ul className="text-xs text-[#284964] space-y-1 font-medium">
                  <li className="flex items-center gap-1.5">
                    <span className="text-[#3A86C8]">●</span>
                    <span>Recover the Explorer Data (Variable assignments)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-[#3A86C8]">●</span>
                    <span>Match the Data Type (str, int, float, bool)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-[#3A86C8]">●</span>
                    <span>Build Your Identity Card (Live rendered ID card)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-[#3A86C8]">●</span>
                    <span className="font-bold">Boss Battle: Identity Found</span>
                  </li>
                </ul>
              </div>

              {/* Rewards */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-[#EDF3ED]">
                <div className="flex items-center gap-1.5 font-bold text-[#2A6B53]">
                  <Zap className="w-3.5 h-3.5 fill-[#2A6B53]" />
                  <span>+50 XP</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold text-[#3A86C8]">
                  <span>🆔 Badge: Identity Found</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-5">
              {isM1Completed ? (
                <button
                  onClick={() => handleLaunchMission(2)}
                  className="w-full py-3 px-5 rounded-2xl bg-[#3A86C8] hover:bg-[#2B6EA9] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>{isM2Completed ? "Replay Mission 2: Identity" : "Play Mission 2: Identity"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-3 px-5 rounded-2xl bg-[#EEF2F0] text-[#86998E] font-bold text-xs cursor-not-allowed flex items-center justify-center gap-2 border border-[#DFE7E2]"
                >
                  <Lock className="w-4 h-4" />
                  <span>Complete Mission 1 to Unlock</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Completion Banner if both missions done */}
      {isBiomeCompleted && (
        <div className="bg-[#EBF5EE] border-2 border-[#A3D9B8] rounded-[28px] p-6 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-5 animate-fadeIn">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#2A6B53] text-white flex items-center justify-center text-2xl flex-shrink-0">
              🎉
            </div>
            <div>
              <h3 className="text-base font-black text-[#172E26]">
                Undersea Reef Fully Restored!
              </h3>
              <p className="text-xs text-[#3E6553]">
                You've mastered print(), strings, comments, and variables. World 02: Eco Woods awaits in the next chapter of the Python expedition!
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo("quest_map")}
            className="py-2.5 px-5 rounded-xl bg-[#2A6B53] hover:bg-[#1E5440] text-white font-bold text-xs shadow-soft transition-all whitespace-nowrap"
          >
            Back to World Map
          </button>
        </div>
      )}
    </div>
  );
}
