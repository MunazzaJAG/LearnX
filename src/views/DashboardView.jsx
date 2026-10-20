import React from "react";
import { Zap, Flame, Award, ArrowRight, Brain, Sparkles, CheckCircle2, Lock } from "lucide-react";
import { useGameState } from "../context/GameStateContext";
import { LEVELS_DATA, BLOOM_LEVELS } from "../data/curriculum";
import { BADGES_DATA } from "../data/achievements";
import { OceanReefArt, NovaMascot } from "../components/BiomeVectorArt";

export function DashboardView() {
  const { profile, xp, streakDays, badges, badgeDates, currentMissionId, navigateTo, completedMissions } = useGameState();

  const currentMission = LEVELS_DATA.find((m) => m.level === currentMissionId) || LEVELS_DATA[0];

  const handleContinueJourney = () => {
    if (!completedMissions?.includes(1)) {
      navigateTo("mission_lab", 1);
    } else if (!completedMissions?.includes(2)) {
      navigateTo("undersea_reef");
    } else {
      navigateTo("mission_lab", currentMissionId || 3);
    }
  };

  // Most recent unlocked badge
  const recentBadgeId = badges[badges.length - 1];
  const recentBadge = BADGES_DATA.find((b) => b.id === recentBadgeId) || BADGES_DATA[0];
  const recentDate = badgeDates[recentBadge?.id] || "2026-09-09";

  const nextMissionText = !completedMissions?.includes(1)
    ? "Level 1: Python Jumping Game"
    : !completedMissions?.includes(2)
    ? "Level 2: 3D Undersea Reef Experience"
    : currentMission.subtitle.toLowerCase();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Base Camp Greeting Header */}
      <div>
        <div className="text-[11px] font-bold tracking-widest text-[#7E9387] uppercase mb-1">
          Your base camp
        </div>
        <h1 className="text-3xl font-extrabold text-[#172E26] tracking-tight mb-1">
          Welcome back, {profile.name}.
        </h1>
        <p className="text-sm text-[#5D7267]">
          Every small step is a little more progress. Let's keep exploring.
        </p>
      </div>

      {/* Main Grid: Left Hero & Stats / Right Achievements & NOVA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Story Continues Banner */}
          <div className="bg-[#E4EFE8] border border-[#D0E2D6] rounded-3xl p-7 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative shadow-soft">
            <div className="space-y-3 z-10 max-w-md">
              <div className="text-[11px] font-bold tracking-widest text-[#2A6B53] uppercase">
                Your story continues
              </div>
              <h2 className="text-2xl font-black text-[#172E26] tracking-tight leading-snug">
                A world worth bringing back to life.
              </h2>
              <p className="text-xs text-[#4F685B] leading-relaxed">
                NOVA is waiting at {currentMission.biomeName}. Your next mission: {nextMissionText}.
              </p>
              <button
                onClick={handleContinueJourney}
                className="mt-2 py-3 px-6 rounded-2xl bg-[#2A6B53] hover:bg-[#205541] active:scale-[0.98] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Continue journey</span>
              </button>
            </div>

            {/* Illustration */}
            <div className="w-full md:w-64 flex-shrink-0 flex items-center justify-center">
              <OceanReefArt className="w-full h-auto max-w-[240px] drop-shadow-sm" />
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            {/* Total XP */}
            <div className="bg-[#FFFFFF] border border-[#E4ECE4] rounded-2xl p-5 shadow-soft">
              <div className="w-7 h-7 rounded-xl bg-[#EAF4EE] flex items-center justify-center text-[#2A6B53] mb-3">
                <Zap className="w-4 h-4 fill-[#2A6B53]" />
              </div>
              <div className="text-3xl font-black text-[#172E26] tracking-tight">{xp}</div>
              <div className="text-xs font-semibold text-[#6E8076] mt-0.5">Total XP earned</div>
            </div>

            {/* Streak */}
            <div className="bg-[#FFFFFF] border border-[#E4ECE4] rounded-2xl p-5 shadow-soft">
              <div className="w-7 h-7 rounded-xl bg-[#FDF0E6] flex items-center justify-center text-[#D96B27] mb-3">
                <Flame className="w-4 h-4 fill-[#D96B27]" />
              </div>
              <div className="text-3xl font-black text-[#172E26] tracking-tight">{streakDays} <span className="text-lg font-bold text-[#6E8076]">days</span></div>
              <div className="text-xs font-semibold text-[#6E8076] mt-0.5">Learning streak</div>
            </div>

            {/* Badges */}
            <div className="bg-[#FFFFFF] border border-[#E4ECE4] rounded-2xl p-5 shadow-soft">
              <div className="w-7 h-7 rounded-xl bg-[#F4EFFB] flex items-center justify-center text-[#7E57C2] mb-3">
                <Award className="w-4 h-4" />
              </div>
              <div className="text-3xl font-black text-[#172E26] tracking-tight">
                {badges.length} <span className="text-lg font-bold text-[#6E8076]">/ {BADGES_DATA.length}</span>
              </div>
              <div className="text-xs font-semibold text-[#6E8076] mt-0.5">Badges collected</div>
            </div>
          </div>
        </div>

        {/* Right 1 Column */}
        <div className="space-y-6">
          {/* Recent achievements card */}
          <div className="bg-[#FFFFFF] border border-[#E4ECE4] rounded-2xl p-5 shadow-soft space-y-4">
            <h3 className="text-sm font-bold text-[#172E26]">Recent achievements</h3>

            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[#F8FAF8] border border-[#E9F0EA]">
              <div className="w-12 h-12 rounded-xl bg-[#E3F4F1] flex items-center justify-center text-2xl flex-shrink-0">
                {recentBadge?.icon}
              </div>
              <div>
                <div className="text-sm font-bold text-[#172E26]">{recentBadge?.name}</div>
                <div className="text-[11px] text-[#7A8E83]">Unlocked {recentDate}</div>
              </div>
            </div>

            <button
              onClick={() => navigateTo("achievements")}
              className="w-full py-2.5 px-4 rounded-xl bg-[#EFF4F0] hover:bg-[#E4ECE6] text-[#2A6B53] font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View all achievements</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* NOVA Companion Encouragement Card */}
          <div className="bg-[#EFF7F2] border border-[#D5EADB] rounded-2xl p-5 shadow-soft flex items-start gap-4">
            <NovaMascot size={46} className="flex-shrink-0" />
            <div className="space-y-1">
              <div className="text-[10px] font-bold tracking-widest text-[#2A6B53] uppercase">
                A little encouragement
              </div>
              <p className="text-xs text-[#3E5C4E] italic leading-relaxed">
                “You don't need to know everything. You just need to be curious about the next thing.”
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bloom's Taxonomy Learning Journey Section (from Image 2) */}
      <div className="bg-[#FFFFFF] border border-[#E4ECE4] rounded-2xl p-6 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-[#EBF5EE] text-[#2A6B53] flex items-center justify-center">
              <Brain className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#172E26]">Your learning journey</h3>
          </div>
          <span className="text-xs font-semibold text-[#6F8278]">Bloom's Taxonomy Framework</span>
        </div>

        <div className="divide-y divide-[#EDF3ED]">
          {BLOOM_LEVELS.map((bloom) => {
            const isUnlocked = !bloom.locked;
            return (
              <div key={bloom.key} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isUnlocked ? "bg-[#EBF5EE] text-[#2A6B53]" : "bg-[#F1F3F1] text-[#97A59D]"
                    }`}
                  >
                    {isUnlocked ? (
                      <Brain className="w-3.5 h-3.5" />
                    ) : (
                      <Lock className="w-3 h-3" />
                    )}
                  </div>
                  <span
                    className={`font-semibold ${
                      isUnlocked ? "text-[#172E26]" : "text-[#85968E]"
                    }`}
                  >
                    {bloom.label}
                  </span>
                </div>
                <span className="text-[#6D8076] font-medium">{bloom.missions}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
