import React, { useState } from "react";
import {
  Map,
  CheckCircle2,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  Zap,
  Award,
  BookOpen,
  Brain,
  X,
  Target,
  Lock,
  Compass,
  Play,
  Layers,
  Info,
  Waves
} from "lucide-react";
import { useGameState } from "../context/GameStateContext";
import { LEVELS_DATA, BIOMES } from "../data/curriculum";
import { WorldMapArt, OceanReefArt, NovaMascot } from "../components/BiomeVectorArt";
import { soundEngine } from "../utils/audio";

export function QuestMapView() {
  const {
    completedMissions,
    currentMissionId,
    selectMission,
    navigateTo,
    filterBiome,
    setFilterBiome
  } = useGameState();

  const [zoomLevel, setZoomLevel] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedBiomePreview, setSelectedBiomePreview] = useState(null);
  const [hoveredMissionId, setHoveredMissionId] = useState(null);

  // Selected mission for drawer
  const activeMission = LEVELS_DATA.find((m) => m.level === currentMissionId) || LEVELS_DATA[0];
  const isCompleted = completedMissions.includes(activeMission.level);

  // Hovered mission details
  const hoveredMission = LEVELS_DATA.find((m) => m.level === hoveredMissionId);

  const handleZoom = (delta) => {
    soundEngine.playClick();
    setZoomLevel((prev) => Math.min(1.4, Math.max(0.8, Number((prev + delta).toFixed(1)))));
  };

  const resetZoom = () => {
    soundEngine.playClick();
    setZoomLevel(1);
  };

  const handleNodeClick = (missionId) => {
    soundEngine.playClick();
    selectMission(missionId);

    // If mission is 1 or 2 (Undersea Reef)
    if (missionId === 1 || missionId === 2) {
      const isLocked = missionId === 2 && !completedMissions.includes(1);
      if (!isLocked) {
        navigateTo("mission_lab", missionId);
        return;
      }
    }

    setDrawerOpen(true);
  };

  const handleBiomeClick = (biomeKey) => {
    soundEngine.playClick();
    setFilterBiome(biomeKey);

    if (biomeKey === "ocean") {
      // Direct navigation to dedicated Undersea Reef Biome Overview!
      navigateTo("undersea_reef");
    } else {
      const bObj = BIOMES.find((b) => b.key === biomeKey);
      if (bObj) {
        setSelectedBiomePreview(bObj);
      }
    }
  };

  const getMissionStatus = (lvl) => {
    if (completedMissions.includes(lvl)) return "completed";
    if (lvl === 1) return "available";
    if (lvl === 2 && completedMissions.includes(1)) return "available";
    if (lvl === currentMissionId) return "current";
    return "locked";
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Header Section with Expedition Title and Progress Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold tracking-widest text-[#7E9387] uppercase mb-1">
            Explore. Learn. Restore.
          </div>
          <h1 className="text-3xl font-extrabold text-[#172E26] tracking-tight mb-1">
            The Python expedition
          </h1>
          <p className="text-sm text-[#5D7267]">
            Six biomes. One continuous journey. Begin at Undersea Reef to revive the continent.
          </p>
        </div>

        {/* Missions Progress Badge */}
        <div className="flex items-center gap-3">
          <div className="bg-[#FFFFFF] border border-[#DEECE3] rounded-2xl p-4 shadow-soft flex items-center gap-3.5 self-start">
            <div className="w-10 h-10 rounded-xl bg-[#EAF5EE] text-[#2A6B53] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-black text-[#172E26]">
                {completedMissions.length} / 12 missions
              </div>
              <div className="text-[11px] text-[#6E8076] font-medium">
                {Math.round((completedMissions.length / 12) * 100)}% Continental Restoration
              </div>
            </div>
          </div>

          {/* Undersea Reef Shortcut Button */}
          <button
            onClick={() => {
              soundEngine.playClick();
              navigateTo("undersea_reef");
            }}
            className="py-3 px-5 rounded-2xl bg-[#1E7268] hover:bg-[#15564E] text-white font-extrabold text-xs shadow-soft transition-all flex items-center gap-2"
          >
            <Waves className="w-4 h-4 text-[#A8EAE2]" />
            <span>Enter Undersea Reef</span>
          </button>
        </div>
      </div>

      {/* Biome Filter Bar */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
        {BIOMES.map((b) => {
          const isSelected = filterBiome === b.key;
          const isOcean = b.key === "ocean";
          return (
            <button
              key={b.key}
              onClick={() => {
                if (b.key === "ocean") {
                  handleBiomeClick("ocean");
                } else {
                  setFilterBiome(b.key);
                  if (b.key !== "all") {
                    setSelectedBiomePreview(b);
                  }
                }
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                isSelected
                  ? "bg-[#FFFFFF] border-2 border-[#2A6B53] text-[#2A6B53] shadow-soft"
                  : "bg-[#F0F4F1] border border-transparent text-[#55695E] hover:bg-[#E6EDE8]"
              }`}
            >
              {b.key === "all" ? (
                <BookOpen className="w-3.5 h-3.5 text-[#2A6B53]" />
              ) : (
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: b.color }}
                />
              )}
              <span>{b.title || b.name}</span>
              {isOcean && (
                <span className="text-[10px] bg-[#E6F5F4] text-[#1E7268] px-2 py-0.5 rounded-full font-black">
                  PLAYABLE
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Master Quest Map Card with Illustrated SVG World */}
      <div className="bg-[#EDF5F0] border border-[#DEECE3] rounded-[32px] p-6 md:p-8 shadow-soft relative overflow-hidden flex flex-col justify-between min-h-[620px]">
        {/* Top Header Inside Map */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 z-10 mb-2">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-[#7E9E8C] mb-1">
              Continental Map · 6 Biomes
            </div>
            <h2 className="text-2xl font-extrabold text-[#183329] tracking-tight">
              Six biomes. One big adventure.
            </h2>
            <p className="text-xs text-[#658273] mt-0.5">
              Click <strong className="text-[#1E7268]">Undersea Reef</strong> to explore the playable ocean research hub and complete your first Python missions.
            </p>
          </div>

          {/* Undersea Reef Badge */}
          <div
            onClick={() => navigateTo("undersea_reef")}
            className="cursor-pointer bg-[#FFFFFF] border border-[#BCE4DD] hover:border-[#1E7268] px-4 py-2 rounded-2xl shadow-sm flex items-center gap-2.5 transition-all group"
          >
            <div className="w-7 h-7 rounded-xl bg-[#E6F5F4] text-[#1E7268] flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
              01
            </div>
            <div>
              <div className="text-[10px] font-bold text-[#7E9387] uppercase tracking-wider">
                Active Biome
              </div>
              <div className="text-xs font-black text-[#172E26] group-hover:text-[#1E7268] flex items-center gap-1">
                <span>Undersea Reef</span>
                <ArrowRight className="w-3 h-3 text-[#1E7268]" />
              </div>
            </div>
          </div>
        </div>

        {/* Hover Information Floating HUD Card */}
        {hoveredMission && (
          <div className="absolute top-20 right-8 z-20 w-72 bg-[#FFFFFF]/95 backdrop-blur-md border border-[#DEECE3] rounded-2xl p-4 shadow-lg animate-fadeIn pointer-events-none">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#7E9387] mb-1">
              <span>Mission {hoveredMission.level}</span>
              <span
                className={`px-2 py-0.5 rounded-full ${
                  getMissionStatus(hoveredMission.level) === "completed"
                    ? "bg-[#EBF5EE] text-[#2A6B53]"
                    : getMissionStatus(hoveredMission.level) === "available"
                    ? "bg-[#E6F5F4] text-[#1E7268]"
                    : "bg-[#F3F5F4] text-[#7E9387]"
                }`}
              >
                {getMissionStatus(hoveredMission.level).toUpperCase()}
              </span>
            </div>
            <div className="text-sm font-black text-[#172E26]">
              {hoveredMission.title}
            </div>
            <div className="text-xs text-[#526B5F] font-medium mt-0.5">
              {hoveredMission.subtitle}
            </div>
            <div className="mt-2 pt-2 border-t border-[#EDF3ED] flex items-center justify-between text-[11px] font-bold text-[#2A6B53]">
              <span>+{hoveredMission.rewardXP} XP</span>
              <span className="text-[#7E57C2]">{hoveredMission.badge?.name}</span>
            </div>
          </div>
        )}

        {/* Interactive World Map SVG Graphic */}
        <div
          className="w-full flex-1 flex items-center justify-center transition-transform duration-300 origin-center my-2"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <WorldMapArt
            activeBiome={filterBiome}
            currentMission={currentMissionId}
            completedMissions={completedMissions}
            onSelectMission={handleNodeClick}
            onSelectBiome={handleBiomeClick}
            onHoverMission={setHoveredMissionId}
          />
        </div>

        {/* Bottom Bar Inside Map: Legend & Zoom Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#DFECE3] z-10">
          {/* Legend */}
          <div className="flex items-center gap-5 text-xs font-semibold text-[#5D7769]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2A6B53]" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ECA752]" />
              <span>Current</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFFFFF] border border-[#2A6B53]" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8FA69C]" />
              <span>Locked</span>
            </div>
          </div>

          {/* Zoom Buttons Pill */}
          <div className="flex items-center gap-1.5 bg-[#FFFFFF] border border-[#DEECE3] p-1.5 rounded-2xl shadow-sm">
            <button
              onClick={() => handleZoom(-0.1)}
              className="w-8 h-8 rounded-xl hover:bg-[#F2F6F3] text-[#52665B] flex items-center justify-center transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={resetZoom}
              className="w-8 h-8 rounded-xl hover:bg-[#F2F6F3] text-[#52665B] flex items-center justify-center transition-colors"
              title="Reset Zoom"
            >
              <Target className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleZoom(0.1)}
              className="w-8 h-8 rounded-xl hover:bg-[#F2F6F3] text-[#52665B] flex items-center justify-center transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Cognitive Framework Progression Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-2 text-xs text-[#5D7769]">
        <div className="flex items-center gap-2.5 font-bold text-[#1E3F35]">
          <Brain className="w-4 h-4 text-[#7A9C8D]" />
          <span>Growing how you think (Bloom's Taxonomy)</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-bold overflow-x-auto">
          <span className="px-3 py-1.5 rounded-xl bg-[#E2EFE7] text-[#2A6B53]">Remember</span>
          <span className="text-[#A2BAAD]">›</span>
          <span className="px-3 py-1.5 rounded-xl bg-[#E2EFE7] text-[#2A6B53]">Understand</span>
          <span className="text-[#A2BAAD]">›</span>
          <span className="px-3 py-1.5 rounded-xl bg-[#EEF4F0] text-[#7A9386]">Apply</span>
          <span className="text-[#A2BAAD]">›</span>
          <span className="px-3 py-1.5 rounded-xl bg-[#EEF4F0] text-[#7A9386]">Analyze</span>
          <span className="text-[#A2BAAD]">›</span>
          <span className="px-3 py-1.5 rounded-xl bg-[#EEF4F0] text-[#7A9386]">Evaluate</span>
          <span className="text-[#A2BAAD]">›</span>
          <span className="px-3 py-1.5 rounded-xl bg-[#EEF4F0] text-[#7A9386]">Create</span>
        </div>
      </div>

      {/* Biome Preview Drawer when a preview biome is clicked */}
      {selectedBiomePreview && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/25 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#FFFFFF] h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto space-y-5 animate-slideLeft">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#EDF3ED] pb-3">
                <span
                  className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full"
                  style={{ backgroundColor: selectedBiomePreview.tagBg || "#EDF4F1", color: selectedBiomePreview.color }}
                >
                  {selectedBiomePreview.title || selectedBiomePreview.name}
                </span>
                <button
                  onClick={() => setSelectedBiomePreview(null)}
                  className="w-8 h-8 rounded-full hover:bg-[#F0F5F2] flex items-center justify-center text-[#7E9387]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Locked Warning */}
              <div className="bg-[#FFF9EE] border border-[#F6E5B8] rounded-2xl p-4 flex items-start gap-3">
                <Lock className="w-5 h-5 text-[#D97706] flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-xs font-bold text-[#8C621F]">
                    Expedition Chapter Locked
                  </div>
                  <p className="text-[11px] text-[#A07026] leading-relaxed">
                    This biome unlocks after completing previous expedition worlds. To begin your journey, play <strong>Undersea Reef</strong>.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-[#172E26]">
                  {selectedBiomePreview.title}
                </h3>
                <p className="text-xs text-[#526B5F] leading-relaxed">
                  {selectedBiomePreview.description}
                </p>
              </div>

              {/* Upcoming Missions */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-[#172E26]">Upcoming Missions in this Biome:</div>
                {selectedBiomePreview.missions?.map((mId) => {
                  const m = LEVELS_DATA.find((l) => l.level === mId);
                  if (!m) return null;
                  return (
                    <div
                      key={mId}
                      className="p-3 bg-[#F8FAF8] border border-[#E4ECE4] rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-[#172E26]">Mission {m.level}: {m.title}</div>
                        <div className="text-[11px] text-[#7E9387]">{m.subtitle}</div>
                      </div>
                      <span className="text-[11px] text-[#8C9C92] font-mono flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>Locked</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-[#EDF3ED]">
              <button
                onClick={() => {
                  setSelectedBiomePreview(null);
                  navigateTo("undersea_reef");
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#1E7268] hover:bg-[#15564E] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Play Active World: Undersea Reef</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setSelectedBiomePreview(null)}
                className="w-full py-2 text-xs font-bold text-[#647C70] hover:text-[#172E26]"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slide-over Mission Briefing Drawer for Undersea Reef nodes */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/25 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#FFFFFF] h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto space-y-5 animate-slideLeft">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#EDF3ED] pb-3">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#2A9D8F] bg-[#E6F5F4] px-3 py-1 rounded-full">
                  {activeMission.biomeName.toUpperCase()}
                </span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-[#F0F5F2] flex items-center justify-center text-[#7E9387]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Illustration */}
              <div className="rounded-2xl bg-[#E8F4F2] p-4 flex items-center justify-center overflow-hidden h-36 relative border border-[#D5E9E3]">
                <OceanReefArt className="w-52 h-auto" />
              </div>

              {/* Title & Info */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-[#EBF5EE] text-[#2A6B53] font-bold text-xs flex items-center justify-center">
                    {activeMission.level}
                  </span>
                  <span className="text-[11px] font-bold text-[#7E9186] tracking-wider uppercase">
                    {activeMission.chapter}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-[#172E26] tracking-tight">
                  {activeMission.title}
                </h3>
                <div className="text-xs font-semibold text-[#547063]">
                  {activeMission.subtitle}
                </div>
              </div>

              {/* Story */}
              <p className="text-xs text-[#526B5F] leading-relaxed">
                {activeMission.story}
              </p>

              {/* Thinking level badge */}
              <div className="flex items-center gap-2 bg-[#F6FAF7] border border-[#E4EFE7] rounded-xl p-2.5 text-[11px]">
                <Brain className="w-3.5 h-3.5 text-[#2A6B53]" />
                <span className="text-[#6D8276] font-medium">Thinking level:</span>
                <span className="font-bold text-[#172E26]">{activeMission.bloomsTaxonomy}</span>
              </div>

              {/* Rewards */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-[#EDF3ED]">
                <div className="flex items-center gap-1.5 font-bold text-[#2A6B53]">
                  <Zap className="w-3.5 h-3.5 fill-[#2A6B53]" />
                  <span>+{activeMission.rewardXP} XP</span>
                </div>
                {activeMission.badge && (
                  <div className="flex items-center gap-1.5 font-semibold text-[#7E57C2]">
                    <Award className="w-3.5 h-3.5" />
                    <span>{activeMission.badge.name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 pt-4 border-t border-[#EDF3ED]">
              {activeMission.level === 2 && !completedMissions.includes(1) ? (
                <div className="space-y-2">
                  <div className="p-3 bg-[#FFF9EE] border border-[#F6E5B8] rounded-xl text-xs text-[#8C621F] flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#D97706] flex-shrink-0" />
                    <span>Locked: Complete Mission 1 (First Day) first to unlock Identity.</span>
                  </div>
                  <button
                    onClick={() => {
                      setDrawerOpen(false);
                      navigateTo("mission_lab", 1);
                    }}
                    className="w-full py-3.5 px-6 rounded-2xl bg-[#2A6B53] hover:bg-[#205541] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Play Mission 1: First Day</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : activeMission.level > 2 ? (
                <div className="space-y-2">
                  <div className="p-3 bg-[#FFF9EE] border border-[#F6E5B8] rounded-xl text-xs text-[#8C621F] flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#D97706] flex-shrink-0" />
                    <span>Locked: Complete Undersea Reef to unlock this expedition chapter.</span>
                  </div>
                  <button
                    onClick={() => {
                      setDrawerOpen(false);
                      navigateTo("undersea_reef");
                    }}
                    className="w-full py-3.5 px-6 rounded-2xl bg-[#1E7268] hover:bg-[#15564E] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Go to Undersea Reef</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    navigateTo("mission_lab", activeMission.level);
                  }}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#2A6B53] hover:bg-[#205541] active:scale-[0.98] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>{isCompleted ? "Revisit mission" : "Begin mission"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => setDrawerOpen(false)}
                className="w-full py-2.5 text-xs font-bold text-[#647C70] hover:text-[#172E26] transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
