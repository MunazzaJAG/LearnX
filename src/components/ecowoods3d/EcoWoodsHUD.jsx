import React from "react";
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Code2,
  CheckCircle2,
  Lock,
  Gamepad2,
  Trees,
  Compass,
  Sparkles,
  HelpCircle
} from "lucide-react";
import { ECO_WOODS_MISSIONS } from "../../data/ecoWoodsCurriculum";

// Handcrafted SVG artwork for each of the 6 Eco Woods missions
function ForestMissionIcon({ num, className = "w-4 h-4" }) {
  switch (num) {
    case 1:
      // The Forest Gate
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 22V7a5 5 0 0 1 16 0v15M2 22h20" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 22v-8a3 3 0 0 1 6 0v8" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.25" />
          <circle cx="12" cy="10" r="1.5" fill="currentColor" />
        </svg>
      );
    case 2:
      // The Polluted Stream / Filtration
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="currentColor" fillOpacity="0.25" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 14a3 3 0 0 0 6 0" strokeLinecap="round" />
        </svg>
      );
    case 3:
      // The Wildlife Rescue
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="6" r="2.5" fill="currentColor" fillOpacity="0.3" />
          <circle cx="15" cy="6" r="2.5" fill="currentColor" fillOpacity="0.3" />
          <ellipse cx="12" cy="14" rx="6" ry="5" fill="currentColor" fillOpacity="0.2" strokeLinejoin="round" />
          <circle cx="9.5" cy="13" r="1" fill="currentColor" />
          <circle cx="14.5" cy="13" r="1" fill="currentColor" />
        </svg>
      );
    case 4:
      // The Seedling Nursery
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22v-9" strokeLinecap="round" />
          <path d="M12 13a6 6 0 0 1 6-6c0 4-3 6-6 6z" fill="currentColor" fillOpacity="0.35" strokeLinejoin="round" />
          <path d="M12 10A6 6 0 0 0 6 4c0 4 3 6 6 6z" fill="currentColor" fillOpacity="0.35" strokeLinejoin="round" />
        </svg>
      );
    case 5:
      // The Forest Inventory / Botanical Scanner
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="16" rx="3" fill="currentColor" fillOpacity="0.15" />
          <path d="M7 8h10M7 12h6M7 16h8" strokeLinecap="round" />
          <circle cx="17" cy="14" r="3" fill="currentColor" fillOpacity="0.3" />
          <path d="M19 16l2.5 2.5" strokeLinecap="round" />
        </svg>
      );
    case 6:
      // The Eco Guardian / Heart Tree
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22v-7m0 0a6 6 0 0 1-6-6c0-3.3 2.7-6 6-6s6 2.7 6 6a6 6 0 0 1-6 6z" fill="currentColor" fillOpacity="0.25" strokeLinejoin="round" />
          <circle cx="12" cy="8" r="2.2" fill="currentColor" />
          <path d="M9 19l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return <Trees className={className} />;
  }
}

export function EcoWoodsHUD({
  activeMission,
  completedMissionNums = [],
  restorationPercent = 0,
  proximityLandmark,
  onOpenTerminal,
  onReturnToMap,
  onReturnToLevel1,
  onSelectMission,
  soundEnabled,
  onToggleSound
}) {
  const currentNum = activeMission?.num || 1;

  // Maximum unlocked mission
  const maxUnlockedNum = Math.max(
    currentNum,
    ...(completedMissionNums || []).map((n) => Number(n) + 1),
    1
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-3 sm:p-5 md:p-6 select-none font-sans">
      {/* ============================================================ */}
      {/* TOP HEADER: Map Nav, Level 1 Shortcut, Title, Restoration */}
      {/* ============================================================ */}
      <div className="flex flex-col gap-3 pointer-events-auto">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* 1. Left Nav: World Map & Level 1 Shortcuts */}
          <div className="flex items-center gap-2">
            <button
              onClick={onReturnToMap}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0e271d]/90 hover:bg-[#163a2b] border border-[#2a5943] hover:border-[#52b788]/60 text-white text-xs font-semibold backdrop-blur-md shadow-md transition-all active:scale-95 cursor-pointer"
              title="Return to World Quest Map"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#52b788]" />
              <span className="font-bold tracking-wide">World Map</span>
            </button>

            {onReturnToLevel1 && (
              <button
                onClick={onReturnToLevel1}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0e271d]/90 hover:bg-[#163a2b] border border-[#2a5943] hover:border-[#52b788]/60 text-[#b7e4c7] hover:text-white text-xs font-semibold backdrop-blur-md shadow-md transition-all active:scale-95 cursor-pointer"
                title="Return to Eco Woods Level 1 (Jumping Game)"
              >
                <Gamepad2 className="w-3.5 h-3.5 text-[#52b788]" />
                <span>Level 1: Jumping Game</span>
              </button>
            )}
          </div>

          {/* 2. Biome Title Banner */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0b2017]/85 border border-[#1b4332] text-xs">
            <span className="w-2 h-2 rounded-full bg-[#52b788] animate-pulse" />
            <span className="font-mono uppercase tracking-wider text-[11px] font-bold text-[#b7e4c7]">
              Eco Woods
            </span>
            <span className="text-[#3a7055]">·</span>
            <span className="text-[#d8f3dc] font-medium text-xs">
              Level 2 · The Living Forest
            </span>
          </div>

          {/* 3. Right Stats: Restoration Meter & Sound Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Restoration Progress */}
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-[#0b2017]/90 border border-[#204e3b] backdrop-blur-md shadow-sm">
              <Sparkles className="w-4 h-4 text-[#fbbf24]" />
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-mono tracking-wider text-[#95d5b2] leading-none">
                  Restoration
                </span>
                <span className="text-xs font-black text-[#52b788] leading-tight">
                  {Math.min(100, Math.round(restorationPercent))}%
                </span>
              </div>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={onToggleSound}
              className={`p-2 rounded-xl border backdrop-blur-md transition-all cursor-pointer ${
                soundEnabled
                  ? "bg-[#0b2017]/90 border-[#2d6a4f] text-[#52b788] hover:bg-[#163a2b]"
                  : "bg-[#181f1b]/90 border-[#384a40] text-[#788a80] hover:text-white"
              }`}
              title={soundEnabled ? "Mute Forest Audio" : "Unmute Forest Audio"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 6-MISSION SELECTOR NAVIGATOR BAR */}
        {/* ============================================================ */}
        <div className="bg-[#0b2017]/90 border border-[#214d3a] rounded-2xl p-1.5 backdrop-blur-md shadow-lg flex items-center justify-between gap-1 overflow-x-auto scrollbar-none">
          {ECO_WOODS_MISSIONS.map((m) => {
            const isCompleted = completedMissionNums.includes(m.num);
            const isCurrent = currentNum === m.num;
            const isUnlocked = m.num <= maxUnlockedNum;

            return (
              <button
                key={m.id}
                onClick={() => {
                  if (isUnlocked) onSelectMission(m.num);
                }}
                disabled={!isUnlocked}
                className={`flex-1 min-w-[100px] sm:min-w-0 py-1.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-left ${
                  isCurrent
                    ? "bg-[#1b4332] border border-[#52b788] text-white shadow-sm"
                    : isCompleted
                    ? "bg-[#0f2d21]/60 hover:bg-[#153a2b] border border-[#2d6a4f]/40 text-[#b7e4c7]"
                    : isUnlocked
                    ? "bg-transparent hover:bg-[#133326] border border-transparent text-[#95d5b2]"
                    : "opacity-40 cursor-not-allowed text-[#4f6d5e]"
                }`}
                title={`Mission ${m.num}: ${m.title} (${m.concept})`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isCurrent
                      ? "bg-[#52b788] text-[#081c14]"
                      : isCompleted
                      ? "bg-[#2d6a4f] text-[#d8f3dc]"
                      : isUnlocked
                      ? "bg-[#16392a] text-[#74c69d]"
                      : "bg-[#11221a] text-[#3f574b]"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : !isUnlocked ? (
                    <Lock className="w-3 h-3" />
                  ) : (
                    <ForestMissionIcon num={m.num} className="w-3.5 h-3.5" />
                  )}
                </div>

                <div className="min-w-0 hidden sm:block">
                  <div className="text-[10px] font-bold leading-none truncate">
                    M{m.num} · {m.title}
                  </div>
                  <div className="text-[9px] text-[#74c69d] leading-none truncate mt-0.5 opacity-80">
                    {m.landmark}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* BOTTOM PROXIMITY NOTIFICATION & CONTROLS GUIDE */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-3 pointer-events-auto">
        {/* Controls Guide */}
        <div className="hidden lg:flex items-center gap-3 px-3.5 py-2 rounded-xl bg-[#0b2017]/85 border border-[#1b4332] text-[11px] text-[#95d5b2] backdrop-blur-md shadow-md">
          <div className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 rounded bg-[#163a2b] border border-[#2d6a4f] font-mono text-[10px] text-white">WASD</span>
            <span>Move</span>
          </div>
          <span className="text-[#325a45]">·</span>
          <div className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 rounded bg-[#163a2b] border border-[#2d6a4f] font-mono text-[10px] text-white">Shift</span>
            <span>Sprint</span>
          </div>
          <span className="text-[#325a45]">·</span>
          <div className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 rounded bg-[#163a2b] border border-[#2d6a4f] font-mono text-[10px] text-white">Drag</span>
            <span>Orbit Cam</span>
          </div>
          <span className="text-[#325a45]">·</span>
          <div className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 rounded bg-[#163a2b] border border-[#2d6a4f] font-mono text-[10px] text-white">E</span>
            <span>Console</span>
          </div>
        </div>

        {/* Proximity Action Prompt or Floating Console Trigger */}
        {proximityLandmark ? (
          <div className="flex items-center gap-3 p-2 pr-3 rounded-2xl bg-[#0c241a]/95 border-2 border-[#52b788] shadow-2xl backdrop-blur-md animate-scaleUp">
            <div className="w-10 h-10 rounded-xl bg-[#52b788] text-[#081c14] flex items-center justify-center font-black">
              <Code2 className="w-5 h-5" />
            </div>

            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-[#74c69d]">
                Landmark In Range
              </div>
              <div className="text-xs font-black text-white">
                {proximityLandmark.label}
              </div>
            </div>

            <button
              onClick={onOpenTerminal}
              className="ml-2 py-2 px-4 rounded-xl bg-[#52b788] hover:bg-[#40916c] text-[#081c14] font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>Open Console</span>
              <span className="hidden sm:inline font-mono text-[10px] opacity-75">(E)</span>
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenTerminal}
            className="flex items-center gap-2 py-2.5 px-4 rounded-2xl bg-[#0e271d]/90 hover:bg-[#163a2b] border border-[#2d6a4f] text-[#d8f3dc] font-bold text-xs shadow-lg backdrop-blur-md transition-all active:scale-95 cursor-pointer"
          >
            <Code2 className="w-4 h-4 text-[#52b788]" />
            <span>Mission Console</span>
          </button>
        )}
      </div>
    </div>
  );
}
