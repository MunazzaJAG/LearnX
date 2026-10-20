import React from "react";
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Code2,
  Shield,
  ChevronRight,
  BookOpen,
  Lock,
  CheckCircle2,
  Waves,
  Gamepad2
} from "lucide-react";
import { ALL_UNDERSEA_SUBLEVELS } from "../../data/underseaCurriculum";

// Handcrafted SVG artwork for each of the 6 Undersea Reef stages
function StageIcon({ num, className = "w-4 h-4" }) {
  switch (num) {
    case 1:
      // Current Control: Thruster propulsion & directional current vector
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.25" />
          <path d="M12 2v4m0 12v4M2 12h4m12 0h4" strokeLinecap="round" />
          <path d="M4.9 4.9l2.8 2.8m8.6 8.6l2.8 2.8M4.9 19.1l2.8-2.8m8.6-8.6l2.8-2.8" strokeLinecap="round" opacity="0.6" />
        </svg>
      );
    case 2:
      // Coral Rescue: Branching reef polyp colony
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22v-8m0 0a4 4 0 0 1-4-4V6a2 2 0 1 1 4 0v2m0 2a4 4 0 0 0 4-4V8a2 2 0 1 1 4 0v3a4 4 0 0 1-4 3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="8" cy="4" r="1.5" fill="currentColor" />
          <circle cx="18" cy="6" r="1.5" fill="currentColor" />
        </svg>
      );
    case 3:
      // The Abyss Gate: Submerged ancient basalt arch portal
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 22V9a8 8 0 0 1 16 0v13M2 22h20" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 22v-7a3 3 0 0 1 6 0v7" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.2" />
        </svg>
      );
    case 4:
      // Jellyfish Herding: Bioluminescent bell with trailing tentacles
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 12C6 7.6 8.7 4 12 4s6 3.6 6 8c-2-1-4 0-6-1-2 1-4 0-6 1z" fill="currentColor" fillOpacity="0.2" strokeLinejoin="round" />
          <path d="M8 13v6m4-5v7m4-6v6" strokeLinecap="round" />
        </svg>
      );
    case 5:
      // Pearl Scanner: Scalloped pearl oyster shell
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 21a9 9 0 0 0 9-9c0-3.5-3-7-9-9-6 2-9 5.5-9 9a9 9 0 0 0 9 9z" fill="currentColor" fillOpacity="0.15" />
          <circle cx="12" cy="13" r="3.2" fill="currentColor" fillOpacity="0.85" />
        </svg>
      );
    case 6:
      // Reef Guardian: Monolithic guardian crest with core visor
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L4 6v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V6l-8-4z" fill="currentColor" fillOpacity="0.18" />
          <circle cx="9" cy="11" r="1.5" fill="currentColor" />
          <circle cx="15" cy="11" r="1.5" fill="currentColor" />
          <path d="M9 16h6" strokeLinecap="round" />
        </svg>
      );
    default:
      return <Waves className={className} />;
  }
}

export function UnderseaHUD({
  activeSublevel,
  completedSublevelNums = [],
  restorationPercent = 0,
  proximityLandmark,
  onOpenTerminal,
  onTriggerSonar,
  onTriggerBoost,
  onOpenCustomizer,
  onReturnToMap,
  onOpenLearningLab,
  onSelectSublevel,
  soundEnabled,
  onToggleSound
}) {
  const currentNum = activeSublevel?.num || 1;
  const isNearStation = !!proximityLandmark;

  // Maximum unlocked stage based on actual user progression
  const maxUnlockedNum = Math.max(
    currentNum,
    ...(completedSublevelNums || []).map((n) => Number(n) + 1),
    1
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-3 sm:p-5 md:p-6 select-none font-sans">
      {/* ============================================================ */}
      {/* TOP HEADER: Separate Map Nav, 6-Stage Navigator, Restoration */}
      {/* ============================================================ */}
      <div className="flex flex-col gap-3 pointer-events-auto">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* 1. Left Nav: World Map & Learning Lab Shortcuts */}
          <div className="flex items-center gap-2">
            <button
              onClick={onReturnToMap}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#04121f]/90 hover:bg-[#08223a] border border-[#163857] hover:border-[#38bdf8]/50 text-white text-xs font-semibold backdrop-blur-md shadow-md transition-all active:scale-95"
              title="Return to World Quest Map"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span className="font-bold tracking-wide">World Map</span>
            </button>

            {onOpenLearningLab && (
              <button
                onClick={onOpenLearningLab}
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#04121f]/90 hover:bg-[#08223a] border border-[#163857] hover:border-[#38bdf8]/50 text-[#94a3b8] hover:text-[#38bdf8] text-xs font-semibold backdrop-blur-md shadow-md transition-all active:scale-95 cursor-pointer"
                title="Replay Level 1: Python Jumping Game"
              >
                <Gamepad2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Level 1: Jumping Game</span>
              </button>
            )}
          </div>

          {/* 2. Biome Journey Title Banner (Centered on larger screens) */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#030e1a]/80 border border-[#13304c] text-xs">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span className="font-mono uppercase tracking-wider text-[11px] font-bold text-[#38bdf8]">
              Undersea Reef
            </span>
            <span className="text-[#475569]">·</span>
            <span className="text-[#94a3b8] font-medium text-xs">
              Level 2 · 3D Experience
            </span>
          </div>

          {/* 3. Right: Single Restoration Metric & Sound Toggle */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-[#04121f]/90 border border-[#163857] rounded-xl px-3 py-1.5 backdrop-blur-md text-xs font-semibold shadow-md">
              <span className="text-emerald-400">🌊</span>
              <span className="text-[#94a3b8] hidden sm:inline text-[11px]">Reef Restored:</span>
              <span className="text-[#34d399] font-mono font-bold text-xs">{restorationPercent}%</span>
            </div>

            <button
              onClick={onToggleSound}
              className="p-2 rounded-xl bg-[#04121f]/90 hover:bg-[#08223a] border border-[#163857] text-[#94a3b8] hover:text-white backdrop-blur-md transition-all active:scale-95 shadow-md"
              title={soundEnabled ? "Mute Ambient Sound" : "Enable Sound"}
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-[#38bdf8]" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-[#64748b]" />
              )}
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 6-SUBLEVEL PROGRESSION NAVIGATOR (Handcrafted Adventure Bar) */}
        {/* ============================================================ */}
        <div className="w-full overflow-x-auto scrollbar-none pb-1">
          <nav
            aria-label="Undersea Reef Sublevel Progression"
            className="flex items-stretch gap-1.5 sm:gap-2 p-1.5 bg-[#030d18]/90 border border-[#122e47] rounded-2xl backdrop-blur-md shadow-xl min-w-max"
          >
            {ALL_UNDERSEA_SUBLEVELS.map((sub) => {
              const isCompleted = completedSublevelNums.includes(sub.num);
              const isActive = sub.num === currentNum;
              const isUnlocked = sub.num <= maxUnlockedNum;

              // Visual styling hierarchy
              let cardStyles = "border-[#152e45] bg-[#061423]/60 text-[#94a3b8]";
              let badgeStyles = "bg-[#0b2136] text-[#64748b]";
              let iconColor = "text-[#64748b]";

              if (isActive) {
                cardStyles =
                  "border-[#38bdf8] bg-gradient-to-b from-[#0a2744] to-[#06182c] text-white shadow-md shadow-sky-950/60 ring-1 ring-[#38bdf8]/40";
                badgeStyles = "bg-[#0284c7] text-white font-extrabold";
                iconColor = "text-[#38bdf8]";
              } else if (isCompleted) {
                cardStyles =
                  "border-[#059669]/60 bg-[#061e1f]/70 text-[#cbd5e1] hover:border-[#10b981] hover:bg-[#09292a]";
                badgeStyles = "bg-[#059669]/30 text-[#34d399] font-bold";
                iconColor = "text-[#34d399]";
              } else if (!isUnlocked) {
                cardStyles = "border-[#0e2133] bg-[#030911]/60 text-[#475569] opacity-55 cursor-not-allowed";
                badgeStyles = "bg-[#081522] text-[#475569]";
                iconColor = "text-[#334155]";
              }

              return (
                <button
                  key={sub.id}
                  onClick={() => isUnlocked && onSelectSublevel && onSelectSublevel(sub.num)}
                  disabled={!isUnlocked}
                  tabIndex={isUnlocked ? 0 : -1}
                  onKeyDown={(e) => {
                    if ((e.key === "Enter" || e.key === " ") && isUnlocked && onSelectSublevel) {
                      e.preventDefault();
                      onSelectSublevel(sub.num);
                    }
                  }}
                  title={
                    isCompleted
                      ? `Sublevel ${sub.num}: ${sub.title} (Restored — Click to replay)`
                      : isActive
                      ? `Sublevel ${sub.num}: ${sub.title} (Active Objective)`
                      : isUnlocked
                      ? `Sublevel ${sub.num}: ${sub.title} (Available)`
                      : `Sublevel ${sub.num}: ${sub.title} (Locked — Complete Sublevel ${sub.num - 1} to unlock)`
                  }
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-left transition-all ${cardStyles} ${
                    isUnlocked ? "hover:scale-[1.02] active:scale-95 cursor-pointer" : ""
                  }`}
                >
                  {/* Thumbnail Artwork & Number */}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border border-white/5 ${
                      isActive ? "bg-[#0369a1]/30" : isCompleted ? "bg-[#064e3b]/30" : "bg-[#02070e]"
                    }`}
                  >
                    <StageIcon num={sub.num} className={`w-4 h-4 ${iconColor}`} />
                  </div>

                  {/* Sublevel Details */}
                  <div className="flex flex-col min-w-0 pr-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded ${badgeStyles}`}>
                        0{sub.num}
                      </span>
                      {isCompleted && (
                        <CheckCircle2 className="w-3 h-3 text-[#10b981] flex-shrink-0" />
                      )}
                      {!isUnlocked && (
                        <Lock className="w-2.5 h-2.5 text-[#64748b] flex-shrink-0" />
                      )}
                    </div>
                    <span
                      className={`text-xs font-bold truncate max-w-[110px] sm:max-w-[130px] leading-tight mt-0.5 ${
                        isActive ? "text-white" : isCompleted ? "text-[#e2e8f0]" : "text-[#64748b]"
                      }`}
                    >
                      {sub.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. RESTRAINED ACTIVE OBJECTIVE DRAWER (Top-Left Focus)        */}
      {/* ============================================================ */}
      <div className="self-start mt-2 max-w-sm pointer-events-auto">
        <div className="bg-[#030f1d]/90 border border-[#163857] rounded-xl p-3 backdrop-blur-md shadow-lg space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#38bdf8] font-bold">
              Target: {activeSublevel?.landmark}
            </span>
            <span className="text-[10px] text-[#64748b] font-mono">
              Stage {currentNum} of 6
            </span>
          </div>
          <p className="text-[11px] text-[#cbd5e1] leading-relaxed font-medium">
            {activeSublevel?.objective}
          </p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. CONTEXTUAL INTERACTION PROMPT (Near Interactive Landmark) */}
      {/* ============================================================ */}
      {isNearStation && (
        <div className="self-center mb-6 pointer-events-auto animate-fadeIn">
          <button
            onClick={onOpenTerminal}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0369a1] to-[#0284c7] hover:from-[#0284c7] hover:to-[#38bdf8] border border-[#38bdf8]/60 text-white text-xs font-bold backdrop-blur-md shadow-xl shadow-cyan-950/60 transition-all active:scale-95"
          >
            <span className="px-1.5 py-0.5 rounded bg-black/40 text-white font-mono text-[10px] font-bold border border-white/20">
              E
            </span>
            <span>Access {proximityLandmark?.sublevel?.landmark || "Station Terminal"}</span>
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. REFINED BOTTOM ACTION BAR                                 */}
      {/* ============================================================ */}
      <div className="flex items-end justify-between pointer-events-auto">
        {/* Understated Controls Legend */}
        <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-[#64748b] bg-[#030e1a]/80 border border-[#122e47] px-3.5 py-1.5 rounded-xl backdrop-blur-sm">
          <span>WASD: Swim</span>
          <span>·</span>
          <span>Space/C: Ascend/Descend</span>
          <span>·</span>
          <span>Shift: Thrusters</span>
        </div>

        {/* Refined Action Controls */}
        <div className="flex items-center gap-2">
          {/* Diver Customizer */}
          <button
            onClick={onOpenCustomizer}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#04121f]/90 hover:bg-[#08223a] border border-[#163857] hover:border-[#10b981]/50 text-white text-xs font-medium backdrop-blur-md transition-all active:scale-95 shadow-md"
            title="Diver Equipment Bay [G]"
          >
            <Shield className="w-3.5 h-3.5 text-[#10b981]" />
            <span className="hidden sm:inline font-semibold">Diver Gear</span>
          </button>

          {/* Open Python Terminal Button */}
          <button
            onClick={onOpenTerminal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#0369a1] hover:from-[#0369a1] hover:to-[#0284c7] text-white text-xs font-bold shadow-lg shadow-sky-950/50 border border-[#38bdf8]/50 transition-all active:scale-95"
            title="Open Python Datapad [E]"
          >
            <Code2 className="w-4 h-4" />
            <span>Python Terminal</span>
            <span className="hidden sm:inline font-mono text-[10px] bg-black/30 px-1 py-0.5 rounded border border-white/10">
              E
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
