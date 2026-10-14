import React from "react";
import { Award, Check, Lock, ArrowRight } from "lucide-react";
import { useGameState } from "../context/GameStateContext";
import { BADGES_DATA } from "../data/achievements";

export function AchievementsView() {
  const { badges, badgeDates, navigateTo } = useGameState();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header section */}
      <div>
        <div className="text-[11px] font-bold tracking-widest text-[#7E9387] uppercase mb-1">
          Little wins. Big milestones.
        </div>
        <h1 className="text-3xl font-extrabold text-[#172E26] tracking-tight mb-1">
          Your achievement collection
        </h1>
        <p className="text-sm text-[#5D7267]">
          {badges.length} of 6 badges unlocked. Every medal tells a piece of your story.
        </p>
      </div>

      {/* Badges Grid (3 columns on desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BADGES_DATA.filter((b) => !b.hidden).map((badge) => {
          const isUnlocked = badges.includes(badge.id) || (badge.id === "identity_found" && badges.includes("identity_created"));
          const unlockDate = badgeDates[badge.id] || badgeDates["identity_created"] || "2026-09-09";

          return (
            <div
              key={badge.id}
              className={`bg-[#FFFFFF] border rounded-3xl p-7 flex flex-col justify-between items-center text-center shadow-soft transition-all ${
                isUnlocked
                  ? "border-[#E4ECE4] hover:shadow-soft-md"
                  : "border-[#ECEFEA] opacity-85"
              }`}
            >
              {/* Badge Icon Container */}
              <div
                className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl mb-5 shadow-soft transition-transform ${
                  isUnlocked
                    ? "bg-[#EAF5F2] hover:scale-105"
                    : "bg-[#F3F5F2] grayscale opacity-60"
                }`}
              >
                <span>{badge.icon}</span>
              </div>

              {/* Title & Description */}
              <div className="space-y-1 mb-5">
                <h3 className="text-lg font-black text-[#172E26] tracking-tight">
                  {badge.name}
                </h3>
                <p className="text-xs text-[#526B5F] leading-snug">
                  {badge.description.split(".")[0]}.
                </p>
                <p className="text-[11px] text-[#7E9387]">
                  {badge.description.split(".")[1] || `Mission ${badge.missionId}`}.
                </p>
              </div>

              {/* Status Pill & Action */}
              <div className="w-full space-y-3 pt-4 border-t border-[#F0F4F0]">
                <div
                  className={`text-[11px] font-bold py-1.5 px-3 rounded-full inline-block ${
                    isUnlocked
                      ? "bg-[#EBF5EE] text-[#2A6B53]"
                      : "bg-[#F4F6F4] text-[#86998E]"
                  }`}
                >
                  {isUnlocked ? `✓ Unlocked ${unlockDate}` : "⚑ Not yet discovered"}
                </div>

                <button
                  onClick={() => navigateTo("mission_lab", badge.missionId)}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 ${
                    isUnlocked
                      ? "bg-[#F2F7F4] hover:bg-[#E5EFE8] text-[#2A6B53]"
                      : "bg-[#F4F6F4] hover:bg-[#E9EDE9] text-[#55695F]"
                  }`}
                >
                  <span>{isUnlocked ? "Revisit mission" : "Go to mission"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
