import React, { useState } from "react";
import {
  Trees,
  Sparkles,
  Heart,
  CheckCircle2,
  Utensils,
  Package,
  X,
  ArrowRight
} from "lucide-react";
import {
  FoxArt,
  RabbitArt,
  DeerArt,
  HedgehogArt,
  OwlArt
} from "./WildwoodAnimalArt";

export function WildwoodSanctuaryMap({
  completedMissionNums = [],
  activeMissionNum = 1,
  onSelectMission,
  lastExecutionSuccess = null
}) {
  const [inspectedAnimal, setInspectedAnimal] = useState(null);

  const isM1Done = completedMissionNums.includes(1);
  const isM2Done = completedMissionNums.includes(2);
  const isM3Done = completedMissionNums.includes(3);
  const isM4Done = completedMissionNums.includes(4);
  const isM5Done = completedMissionNums.includes(5);
  const isM6Done = completedMissionNums.includes(6);

  // Sanctuary restoration percentage
  const restorationPercent = Math.min(
    100,
    Math.round((completedMissionNums.length / 6) * 100)
  );

  // Animals data state
  const animals = [
    {
      id: "fox",
      name: "Rusty the Fox",
      habitat: isM1Done ? "Ancient Woodland" : "Intake Clinic",
      status: isM1Done ? "Healed & Exploring" : "Needs Care (Vitals: 42)",
      isResolved: isM1Done,
      missionNum: 1,
      ArtComponent: FoxArt,
      notes: "Found shivering by the brambles. Responds well to herbal salve."
    },
    {
      id: "rabbit",
      name: "Pip the Hare",
      habitat: isM2Done ? "Mossy Burrow" : "Sanctuary Gates",
      status: isM2Done ? "Settled in Burrow" : "Awaiting Habitat",
      isResolved: isM2Done,
      missionNum: 2,
      ArtComponent: RabbitArt,
      notes: "Enjoys sweet clover bedding inside the underground burrow."
    },
    {
      id: "deer",
      name: "Fern the Fawn",
      habitat: isM3Done ? "Sunlit Meadow" : "Admissions Gate",
      status: isM3Done ? "Grazing with Herd" : "Awaiting Admittance",
      isResolved: isM3Done,
      missionNum: 3,
      ArtComponent: DeerArt,
      notes: "Needs vaccination and open meadow capacity before entering."
    },
    {
      id: "hedgehog",
      name: "Bramble the Hedgehog",
      habitat: "Mossy Burrow Glade",
      status: isM4Done ? "Fed & Content" : "Hungry for Dinner",
      isResolved: isM4Done,
      missionNum: 4,
      ArtComponent: HedgehogArt,
      notes: "Waits eagerly for his evening portion of berries and seeds."
    },
    {
      id: "owl",
      name: "Hoot the Barn Owl",
      habitat: "Willow Pond & Roost",
      status: isM5Done ? "Stockpile Guarded" : "Auditing Pantries",
      isResolved: isM5Done,
      missionNum: 5,
      ArtComponent: OwlArt,
      notes: "Surveys the winter berry crates from the high willow roost."
    }
  ];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border-2 border-[#C8DFD0] bg-[#1E4330] shadow-md select-none min-h-[500px] lg:min-h-[620px] flex flex-col justify-between">
      {/* ------------------------------------------------------------ */}
      {/* ORGANIC SVG WORLD MAP WITH DEPTH & HABITATS */}
      {/* ------------------------------------------------------------ */}
      <svg
        viewBox="0 0 1000 680"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Woodland Gradient */}
          <radialGradient id="woodlandGrad" cx="20%" cy="20%" r="45%">
            <stop offset="0%" stopColor="#255338" />
            <stop offset="100%" stopColor="#183624" />
          </radialGradient>

          {/* Burrow Gradient */}
          <radialGradient id="burrowGrad" cx="80%" cy="20%" r="40%">
            <stop offset="0%" stopColor="#3E6B4A" />
            <stop offset="100%" stopColor="#224730" />
          </radialGradient>

          {/* Meadow Gradient */}
          <radialGradient id="meadowGrad" cx="20%" cy="80%" r="45%">
            <stop offset="0%" stopColor="#548C5E" />
            <stop offset="100%" stopColor="#295537" />
          </radialGradient>

          {/* Pond Water Gradient */}
          <linearGradient id="pondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isM6Done ? "#38BDF8" : "#2E8088"} />
            <stop offset="100%" stopColor={isM6Done ? "#0284C7" : "#1B525B"} />
          </linearGradient>

          {/* Lantern Glow Filter */}
          <filter id="lanternGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Base Forest Earth Ground */}
        <rect width="1000" height="680" fill="#1C3F2B" />

        {/* 1. Ancient Woodland Region (Top-Left) */}
        <path
          d="M 10,10 Q 280,5 340,180 Q 320,330 170,350 Q 10,350 10,10 Z"
          fill="url(#woodlandGrad)"
        />

        {/* 2. Mossy Burrow Mound (Top-Right) */}
        <path
          d="M 660,10 Q 990,10 990,290 Q 820,340 670,270 Q 630,130 660,10 Z"
          fill="url(#burrowGrad)"
        />

        {/* 3. Sunlit Meadow (Bottom-Left) */}
        <path
          d="M 10,370 Q 300,370 320,520 Q 270,670 10,670 Z"
          fill="url(#meadowGrad)"
        />

        {/* 4. Willow Pond & Stream (Bottom-Right) */}
        <path
          d="M 660,370 Q 990,350 990,670 Q 700,670 630,540 Q 620,430 660,370 Z"
          fill="#1C4533"
        />
        {/* Pond Basin Water */}
        <path
          d="M 700,430 Q 930,390 950,550 Q 910,630 740,610 Q 660,540 700,430 Z"
          fill="url(#pondGrad)"
          opacity="0.92"
        />

        {/* Water Lilies & Lotus */}
        <circle cx="760" cy="480" r="14" fill="#52B788" opacity="0.85" />
        <circle cx="830" cy="530" r="18" fill="#52B788" opacity="0.85" />
        <circle cx="880" cy="460" r="12" fill="#52B788" opacity="0.85" />
        <circle cx="834" cy="528" r="4" fill="#FDE047" opacity="0.9" />

        {/* Winding Dirt Paths Connecting Habitats */}
        <path
          d="M 500,290 Q 320,240 220,170"
          stroke="#997858"
          strokeWidth="24"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />
        <path
          d="M 500,350 Q 720,250 800,180"
          stroke="#997858"
          strokeWidth="24"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />
        <path
          d="M 500,370 Q 320,450 190,500"
          stroke="#997858"
          strokeWidth="24"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />
        <path
          d="M 500,390 Q 640,460 720,490"
          stroke="#997858"
          strokeWidth="24"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />

        {/* Stepping Stones Along Paths */}
        {[
          [410, 275], [330, 235], [260, 195],
          [590, 285], [690, 230], [750, 195],
          [410, 410], [310, 460], [240, 485],
          [590, 425], [660, 460]
        ].map(([sx, sy], idx) => (
          <ellipse
            key={idx}
            cx={sx}
            cy={sy}
            rx={6 + (idx % 2) * 2}
            ry={4 + (idx % 2)}
            fill="#DDD3C7"
            opacity="0.75"
          />
        ))}

        {/* Lush Tree Clusters & Foliage */}
        {[
          [60, 60, 36], [160, 50, 42], [80, 170, 38], [240, 80, 44],
          [730, 70, 40], [860, 80, 46], [930, 170, 38],
          [60, 510, 38], [130, 590, 44], [230, 580, 36],
          [650, 610, 40], [940, 350, 42]
        ].map(([tx, ty, tr], idx) => (
          <g key={idx}>
            <circle cx={tx + 3} cy={ty + 4} r={tr} fill="#0E2317" opacity="0.4" />
            <circle cx={tx} cy={ty} r={tr} fill="#143621" opacity="0.85" />
            <circle cx={tx - 6} cy={ty - 6} r={tr * 0.7} fill="#1F4D30" opacity="0.7" />
          </g>
        ))}

        {/* Wildflower Blooms in Sunlit Meadow (Expands after M3) */}
        {[
          [100, 420], [140, 470], [180, 420], [220, 480], [90, 490],
          [150, 530], [200, 540], [260, 460], [120, 450]
        ].map(([fx, fy], idx) => (
          <circle
            key={idx}
            cx={fx}
            cy={fy}
            r={isM3Done ? 5 : 3.5}
            fill={idx % 2 === 0 ? "#FCD34D" : "#F472B6"}
            opacity={isM3Done ? 0.95 : 0.65}
          />
        ))}

        {/* Evening Food Bowls near Keeper Lodge (Visibly appears after M4) */}
        {isM4Done && (
          <g>
            <ellipse cx="430" cy="390" rx="9" ry="5" fill="#78350F" />
            <circle cx="430" cy="388" r="4" fill="#F59E0B" />
            <ellipse cx="460" cy="405" rx="9" ry="5" fill="#78350F" />
            <circle cx="460" cy="403" r="4" fill="#F59E0B" />
            <ellipse cx="540" cy="405" rx="9" ry="5" fill="#78350F" />
            <circle cx="540" cy="403" r="4" fill="#F59E0B" />
            <ellipse cx="570" cy="390" rx="9" ry="5" fill="#78350F" />
            <circle cx="570" cy="388" r="4" fill="#F59E0B" />
          </g>
        )}

        {/* Winter Supply Crates at Pond Barn (Visibly appears after M5) */}
        {isM5Done && (
          <g>
            <rect x="710" y="375" width="22" height="18" rx="3" fill="#B45309" />
            <rect x="714" y="379" width="14" height="10" fill="#78350F" />
            <circle cx="721" cy="384" r="3" fill="#EF4444" />
            <rect x="736" y="370" width="20" height="23" rx="3" fill="#D97706" />
            <circle cx="746" cy="380" r="4" fill="#EF4444" />
          </g>
        )}

        {/* Restored Golden Lantern Lights along trails (Glows when M6 done) */}
        {isM6Done && (
          <g filter="url(#lanternGlow)">
            {[
              [310, 240], [690, 240], [320, 450], [680, 460], [500, 230]
            ].map(([lx, ly], idx) => (
              <circle key={idx} cx={lx} cy={ly} r="8" fill="#FDE047" opacity="0.8" />
            ))}
          </g>
        )}
      </svg>

      {/* ------------------------------------------------------------ */}
      {/* HABITAT REGION TITLE PILLS (DISCREET & CLEAR) */}
      {/* ------------------------------------------------------------ */}
      <div className="relative z-10 p-4 sm:p-5 flex items-start justify-between pointer-events-none">
        {/* Ancient Woodland (Top-Left) */}
        <div className="bg-[#0C1E14]/85 border border-[#2D6A4F] text-[#E8F8EE] px-3 py-1 rounded-xl text-[11px] font-bold shadow-sm backdrop-blur-xs flex items-center gap-1.5">
          <Trees className="w-3.5 h-3.5 text-[#52B788]" />
          <span>Ancient Woodland</span>
          {isM1Done && <CheckCircle2 className="w-3 h-3 text-[#52B788]" />}
        </div>

        {/* Mossy Burrow (Top-Right) */}
        <div className="bg-[#0C1E14]/85 border border-[#2D6A4F] text-[#E8F8EE] px-3 py-1 rounded-xl text-[11px] font-bold shadow-sm backdrop-blur-xs flex items-center gap-1.5">
          <span>Mossy Burrow</span>
          {isM2Done && <CheckCircle2 className="w-3 h-3 text-[#52B788]" />}
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* CENTRAL KEEPER LODGE & CLINIC */}
      {/* ------------------------------------------------------------ */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none">
        <div className="bg-[#0E281C]/92 border-2 border-[#387C57] rounded-2xl px-4 py-2.5 text-center shadow-xl backdrop-blur-sm max-w-[190px]">
          <div className="text-[9px] font-mono uppercase tracking-widest text-[#A7F3D0] font-bold">
            Keeper Lodge
          </div>
          <div className="text-xs font-black text-white mt-0.5">
            Wildwood Clinic
          </div>
          <div className="text-[10px] text-[#86EFAC] mt-0.5 flex items-center justify-center gap-1 font-semibold">
            <span>{restorationPercent}% Restored</span>
            {isM6Done && <Sparkles className="w-3 h-3 text-[#FDE047]" />}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* INTERACTIVE ANIMAL TOKENS (CLICKABLE INDIE TOKENS) */}
      {/* ------------------------------------------------------------ */}

      {/* 1. Rusty the Fox */}
      <div
        onClick={() => setInspectedAnimal(animals[0])}
        className={`absolute transition-all duration-700 cursor-pointer group z-30 ${
          isM1Done
            ? "top-[25%] left-[16%] sm:top-[24%] sm:left-[17%]"
            : "top-[40%] left-[32%] sm:top-[38%] sm:left-[34%]"
        }`}
        title="Click to inspect Rusty the Fox"
      >
        <div className="flex flex-col items-center">
          <div className="p-1.5 rounded-2xl bg-[#FFFFFF] border-2 border-[#E85D26] shadow-lg group-hover:scale-110 transition-transform">
            <FoxArt className="w-11 h-11 sm:w-13 sm:h-13" />
          </div>
          <span className="mt-1 px-2 py-0.5 rounded-full bg-[#0D2217]/90 border border-[#406850] text-[10px] font-bold text-white shadow-xs flex items-center gap-1 whitespace-nowrap">
            <span>Rusty</span>
            {isM1Done && <CheckCircle2 className="w-3 h-3 text-[#52B788]" />}
          </span>
        </div>
      </div>

      {/* 2. Pip the Hare */}
      <div
        onClick={() => setInspectedAnimal(animals[1])}
        className={`absolute transition-all duration-700 cursor-pointer group z-30 ${
          isM2Done
            ? "top-[23%] right-[16%] sm:top-[22%] sm:right-[18%]"
            : "top-[40%] right-[30%] sm:top-[38%] sm:right-[32%]"
        }`}
        title="Click to inspect Pip the Hare"
      >
        <div className="flex flex-col items-center">
          <div className="p-1.5 rounded-2xl bg-[#FFFFFF] border-2 border-[#D3C5B4] shadow-lg group-hover:scale-110 transition-transform">
            <RabbitArt className="w-11 h-11 sm:w-13 sm:h-13" />
          </div>
          <span className="mt-1 px-2 py-0.5 rounded-full bg-[#0D2217]/90 border border-[#406850] text-[10px] font-bold text-white shadow-xs flex items-center gap-1 whitespace-nowrap">
            <span>Pip</span>
            {isM2Done && <CheckCircle2 className="w-3 h-3 text-[#52B788]" />}
          </span>
        </div>
      </div>

      {/* 3. Fern the Fawn */}
      <div
        onClick={() => setInspectedAnimal(animals[2])}
        className={`absolute transition-all duration-700 cursor-pointer group z-30 ${
          isM3Done
            ? "bottom-[18%] left-[18%] sm:bottom-[19%] sm:left-[20%]"
            : "bottom-[32%] left-[30%] sm:bottom-[30%] sm:left-[32%]"
        }`}
        title="Click to inspect Fern the Fawn"
      >
        <div className="flex flex-col items-center">
          <div className="p-1.5 rounded-2xl bg-[#FFFFFF] border-2 border-[#A86F3E] shadow-lg group-hover:scale-110 transition-transform">
            <DeerArt className="w-11 h-11 sm:w-13 sm:h-13" />
          </div>
          <span className="mt-1 px-2 py-0.5 rounded-full bg-[#0D2217]/90 border border-[#406850] text-[10px] font-bold text-white shadow-xs flex items-center gap-1 whitespace-nowrap">
            <span>Fern</span>
            {isM3Done && <CheckCircle2 className="w-3 h-3 text-[#52B788]" />}
          </span>
        </div>
      </div>

      {/* 4. Bramble the Hedgehog */}
      <div
        onClick={() => setInspectedAnimal(animals[3])}
        className="absolute bottom-[40%] right-[16%] sm:bottom-[38%] sm:right-[18%] z-30 cursor-pointer group"
        title="Click to inspect Bramble the Hedgehog"
      >
        <div className="flex flex-col items-center">
          <div className="p-1.5 rounded-2xl bg-[#FFFFFF] border-2 border-[#7A604D] shadow-lg group-hover:scale-110 transition-transform">
            <HedgehogArt className="w-11 h-11 sm:w-13 sm:h-13" />
          </div>
          <span className="mt-1 px-2 py-0.5 rounded-full bg-[#0D2217]/90 border border-[#406850] text-[10px] font-bold text-white shadow-xs flex items-center gap-1 whitespace-nowrap">
            <span>Bramble</span>
            {isM4Done && <CheckCircle2 className="w-3 h-3 text-[#52B788]" />}
          </span>
        </div>
      </div>

      {/* 5. Hoot the Barn Owl */}
      <div
        onClick={() => setInspectedAnimal(animals[4])}
        className="absolute bottom-[18%] right-[20%] sm:bottom-[20%] sm:right-[22%] z-30 cursor-pointer group"
        title="Click to inspect Hoot the Barn Owl"
      >
        <div className="flex flex-col items-center">
          <div className="p-1.5 rounded-2xl bg-[#FFFFFF] border-2 border-[#F59E0B] shadow-lg group-hover:scale-110 transition-transform">
            <OwlArt className="w-11 h-11 sm:w-13 sm:h-13" />
          </div>
          <span className="mt-1 px-2 py-0.5 rounded-full bg-[#0D2217]/90 border border-[#406850] text-[10px] font-bold text-white shadow-xs flex items-center gap-1 whitespace-nowrap">
            <span>Hoot</span>
            {isM5Done && <CheckCircle2 className="w-3 h-3 text-[#52B788]" />}
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* BOTTOM HABITAT LABELS */}
      {/* ------------------------------------------------------------ */}
      <div className="relative z-10 p-4 sm:p-5 flex items-end justify-between pointer-events-none">
        {/* Sunlit Meadow (Bottom-Left) */}
        <div className="bg-[#0C1E14]/85 border border-[#2D6A4F] text-[#E8F8EE] px-3 py-1 rounded-xl text-[11px] font-bold shadow-sm backdrop-blur-xs flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" />
          <span>Sunlit Meadow</span>
          {isM3Done && <CheckCircle2 className="w-3 h-3 text-[#52B788]" />}
        </div>

        {/* Willow Pond (Bottom-Right) */}
        <div className="bg-[#0C1E14]/85 border border-[#2D6A4F] text-[#E8F8EE] px-3 py-1 rounded-xl text-[11px] font-bold shadow-sm backdrop-blur-xs flex items-center gap-1.5">
          <span>Willow Pond</span>
          {isM5Done && <CheckCircle2 className="w-3 h-3 text-[#52B788]" />}
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* CONTEXTUAL ANIMAL INSPECTION OVERLAY */}
      {/* ------------------------------------------------------------ */}
      {inspectedAnimal && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 z-40 bg-[#0A1D13]/95 border border-[#52B788]/60 rounded-2xl p-4 shadow-2xl backdrop-blur-md flex items-center justify-between gap-4 animate-scaleUp text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#FFFFFF] p-1 flex items-center justify-center flex-shrink-0 shadow-sm">
              <inspectedAnimal.ArtComponent className="w-10 h-10" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white">
                  {inspectedAnimal.name}
                </span>
                <span className="text-[10px] font-mono text-[#86EFAC] bg-[#0E341E] px-2 py-0.5 rounded-full border border-[#2D6A4F]">
                  Mission {inspectedAnimal.missionNum}
                </span>
              </div>
              <div className="text-[11px] text-[#A7F3D0] mt-0.5">
                Location: <strong>{inspectedAnimal.habitat}</strong> · {inspectedAnimal.status}
              </div>
              <p className="text-[11px] text-[#D1FAE5]/80 mt-0.5 hidden sm:block">
                {inspectedAnimal.notes}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => {
                onSelectMission(inspectedAnimal.missionNum);
                setInspectedAnimal(null);
              }}
              className="py-2 px-3.5 rounded-xl bg-[#2D6A4F] hover:bg-[#1E4D37] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Focus Mission {inspectedAnimal.missionNum}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setInspectedAnimal(null)}
              className="p-2 rounded-xl bg-[#143323] hover:bg-[#1D4A33] text-[#A7F3D0] cursor-pointer"
              title="Close inspection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
