import React, { useState } from "react";
import { X, Check, Shield, Sparkles, Award, Zap } from "lucide-react";
import { soundEngine } from "../../utils/audio";
import { underseaAudio } from "../../utils/underseaAudio";

export const DIVER_SKINS = [
  { id: "aquamarine", name: "Aquamarine Scout", color: "#1b8a7a", accent: "#52e3c2", unlocked: true },
  { id: "lumina", name: "Lumina-Weave Cyan", color: "#0891b2", accent: "#38bdf8", unlockSublevel: 5 },
  { id: "abyssal", name: "Abyssal Navy Exosuit", color: "#1e3a8a", accent: "#60a5fa", unlockSublevel: 9 },
  { id: "cybergold", name: "Guardian Solar Gold", color: "#b45309", accent: "#fbbf24", unlockSublevel: 12 }
];

export const DIVER_VISORS = [
  { id: "default_visor", name: "Standard Blue Visor", color: "#20d3d3", unlocked: true },
  { id: "explorer_visor", name: "Explorer Telemetry Visor", color: "#38bdf8", unlockSublevel: 1 },
  { id: "emerald_visor", name: "Bio-Spectrum Emerald", color: "#10b981", unlockSublevel: 6 },
  { id: "crown_visor", name: "Guardian Crest Gold", color: "#f59e0b", unlockSublevel: 11 }
];

export const DIVER_FINS = [
  { id: "standard_fins", name: "Standard Flex Fins", color: "#0f766e", unlocked: true },
  { id: "hydro_thrusters", name: "Hydro-Jet Boosters", color: "#0284c7", unlockSublevel: 3 },
  { id: "geothermal_fins", name: "Geothermal Vented Fins", color: "#e11d48", unlockSublevel: 8 },
  { id: "quantum_fins", name: "Quantum Heart Propulsion", color: "#8b5cf6", unlockSublevel: 12 }
];

export function DiverCustomizerModal({
  isOpen,
  onClose,
  customization,
  onUpdateCustomization,
  completedSublevels = []
}) {
  const [activeTab, setActiveTab] = useState("suits"); // "suits" | "visors" | "fins"

  if (!isOpen) return null;

  const handleSelectSkin = (skin) => {
    onUpdateCustomization({
      suitColor: skin.color,
      accentColor: skin.accent
    });
    underseaAudio.playBubble();
  };

  const handleSelectVisor = (visor) => {
    onUpdateCustomization({
      visorColor: visor.color
    });
    underseaAudio.playBubble();
  };

  const handleSelectFins = (fin) => {
    onUpdateCustomization({
      finsColor: fin.color
    });
    underseaAudio.playBubble();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0b1726] border border-[#1e3a5f] rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1e3a5f]/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0284c7]/20 border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">Diver Equipment Bay</h2>
              <p className="text-xs text-[#94a3b8]">Customize suit suits, diving visors, and propulsion fins</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#94a3b8] hover:text-white hover:bg-[#1e3a5f]/40 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center bg-[#071322] p-1 rounded-2xl border border-[#1e3a5f]">
          <button
            onClick={() => setActiveTab("suits")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === "suits" ? "bg-[#0284c7] text-white shadow-sm" : "text-[#94a3b8] hover:text-white"
            }`}
          >
            Diving Suits
          </button>
          <button
            onClick={() => setActiveTab("visors")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === "visors" ? "bg-[#0284c7] text-white shadow-sm" : "text-[#94a3b8] hover:text-white"
            }`}
          >
            Helmets & Visors
          </button>
          <button
            onClick={() => setActiveTab("fins")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === "fins" ? "bg-[#0284c7] text-white shadow-sm" : "text-[#94a3b8] hover:text-white"
            }`}
          >
            Propulsion Fins
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-3">
          {activeTab === "suits" &&
            DIVER_SKINS.map((skin) => {
              const isUnlocked = skin.unlocked || completedSublevels.includes(skin.unlockSublevel);
              const isSelected = customization.suitColor === skin.color;
              return (
                <div
                  key={skin.id}
                  onClick={() => isUnlocked && handleSelectSkin(skin)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                    !isUnlocked
                      ? "opacity-40 bg-[#071322] border-[#1e293b] cursor-not-allowed"
                      : isSelected
                      ? "bg-[#0f243a] border-[#38bdf8] shadow-md cursor-pointer"
                      : "bg-[#071322] hover:bg-[#0d1d2e] border-[#1e3a5f] cursor-pointer"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-xl border border-white/20 shadow-sm"
                      style={{ backgroundColor: skin.color }}
                    />
                    <div>
                      <div className="text-xs font-bold text-white">{skin.name}</div>
                      {!isUnlocked && (
                        <div className="text-[10px] text-[#f87171]">
                          Unlocks at Sublevel {skin.unlockSublevel}
                        </div>
                      )}
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#38bdf8]" />}
                </div>
              );
            })}

          {activeTab === "visors" &&
            DIVER_VISORS.map((visor) => {
              const isUnlocked = visor.unlocked || completedSublevels.includes(visor.unlockSublevel);
              const isSelected = customization.visorColor === visor.color;
              return (
                <div
                  key={visor.id}
                  onClick={() => isUnlocked && handleSelectVisor(visor)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                    !isUnlocked
                      ? "opacity-40 bg-[#071322] border-[#1e293b] cursor-not-allowed"
                      : isSelected
                      ? "bg-[#0f243a] border-[#38bdf8] shadow-md cursor-pointer"
                      : "bg-[#071322] hover:bg-[#0d1d2e] border-[#1e3a5f] cursor-pointer"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-xl border border-white/20 shadow-sm"
                      style={{ backgroundColor: visor.color }}
                    />
                    <div>
                      <div className="text-xs font-bold text-white">{visor.name}</div>
                      {!isUnlocked && (
                        <div className="text-[10px] text-[#f87171]">
                          Unlocks at Sublevel {visor.unlockSublevel}
                        </div>
                      )}
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#38bdf8]" />}
                </div>
              );
            })}

          {activeTab === "fins" &&
            DIVER_FINS.map((fin) => {
              const isUnlocked = fin.unlocked || completedSublevels.includes(fin.unlockSublevel);
              const isSelected = customization.finsColor === fin.color;
              return (
                <div
                  key={fin.id}
                  onClick={() => isUnlocked && handleSelectFins(fin)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                    !isUnlocked
                      ? "opacity-40 bg-[#071322] border-[#1e293b] cursor-not-allowed"
                      : isSelected
                      ? "bg-[#0f243a] border-[#38bdf8] shadow-md cursor-pointer"
                      : "bg-[#071322] hover:bg-[#0d1d2e] border-[#1e3a5f] cursor-pointer"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-xl border border-white/20 shadow-sm"
                      style={{ backgroundColor: fin.color }}
                    />
                    <div>
                      <div className="text-xs font-bold text-white">{fin.name}</div>
                      {!isUnlocked && (
                        <div className="text-[10px] text-[#f87171]">
                          Unlocks at Sublevel {fin.unlockSublevel}
                        </div>
                      )}
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#38bdf8]" />}
                </div>
              );
            })}
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold transition-all shadow-md"
          >
            Equip & Return to Dive
          </button>
        </div>
      </div>
    </div>
  );
}
