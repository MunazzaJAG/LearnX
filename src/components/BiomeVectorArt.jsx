import React, { useState } from "react";

// NOVA Friendly Robot Companion Mascot
export function NovaMascot({ size = 48, className = "", mood = "happy" }) {
  return (
    <div
      className={"relative inline-flex items-center justify-center rounded-2xl bg-[#EAF4EE] p-2 select-none " + className}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Antenna */}
        <line x1="32" y1="12" x2="32" y2="4" stroke="#2A6B53" strokeWidth="3" strokeLinecap="round" />
        <circle cx="32" cy="4" r="3.5" fill="#52B788" className="animate-pulse" />

        {/* Side ears */}
        <rect x="8" y="24" width="5" height="16" rx="2.5" fill="#2A6B53" />
        <rect x="51" y="24" width="5" height="16" rx="2.5" fill="#2A6B53" />

        {/* Outer head */}
        <rect x="12" y="14" width="40" height="34" rx="14" fill="#FFFFFF" stroke="#2A6B53" strokeWidth="3" />

        {/* Screen visor */}
        <rect x="18" y="20" width="28" height="20" rx="8" fill="#E8F5E9" stroke="#B7E4C7" strokeWidth="1" />

        {/* Eyes based on mood */}
        {mood === "curious" ? (
          <>
            <circle cx="26" cy="30" r="3.5" fill="#2D6A4F" />
            <circle cx="38" cy="29" r="4.5" fill="#2D6A4F" />
          </>
        ) : mood === "celebrate" ? (
          <>
            <path d="M23 31 Q26 27 29 31" stroke="#2D6A4F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M35 31 Q38 27 41 31" stroke="#2D6A4F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            <circle cx="26" cy="30" r="3.5" fill="#2D6A4F" />
            <circle cx="38" cy="30" r="3.5" fill="#2D6A4F" />
            <circle cx="27" cy="29" r="1" fill="#FFFFFF" />
            <circle cx="39" cy="29" r="1" fill="#FFFFFF" />
          </>
        )}

        {/* Smile */}
        <path d="M28 35 Q32 39 36 35" stroke="#2D6A4F" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Neck collar */}
        <rect x="28" y="48" width="8" height="4" rx="2" fill="#52B788" />

        {/* Shoulders */}
        <path d="M20 54 Q32 50 44 54" stroke="#2A6B53" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// Ocean Reef Hero Card Illustration for Biome Overview and Mission Headers
export function OceanReefArt({ className = "w-full h-auto" }) {
  return (
    <svg
      viewBox="0 0 540 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="reef-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E6F7F5" />
          <stop offset="100%" stopColor="#BCE8E2" />
        </linearGradient>
        <linearGradient id="deep-water" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3AA99F" stopOpacity="0.85" />
          <stop offset="60%" stopColor="#1B6F68" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#0E423E" />
        </linearGradient>
        <linearGradient id="coral-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF7A70" />
          <stop offset="100%" stopColor="#D94E43" />
        </linearGradient>
        <linearGradient id="hub-glass" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A8EAE2" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#52B8AC" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* Underwater Background */}
      <rect width="540" height="280" rx="24" fill="url(#reef-sky)" />

      {/* Sun rays through water */}
      <g opacity="0.35">
        <polygon points="120,0 160,0 230,280 170,280" fill="#FFFFFF" />
        <polygon points="260,0 310,0 410,280 340,280" fill="#FFFFFF" />
        <polygon points="400,0 435,0 520,280 470,280" fill="#FFFFFF" />
      </g>

      {/* Floating Bubbles */}
      <g fill="#FFFFFF" opacity="0.6">
        <circle cx="80" cy="180" r="5" />
        <circle cx="95" cy="140" r="3.5" />
        <circle cx="75" cy="100" r="2.5" />
        <circle cx="460" cy="190" r="6" />
        <circle cx="475" cy="145" r="4" />
        <circle cx="450" cy="110" r="3" />
        <circle cx="270" cy="90" r="3" />
        <circle cx="285" cy="65" r="2" />
      </g>

      {/* Distant Sea Floor Ridges */}
      <path
        d="M0 165 C90 145 170 180 260 160 C360 140 450 175 540 155 L540 280 L0 280 Z"
        fill="#5EA89E"
        opacity="0.5"
      />

      {/* Midground Reef Shelf */}
      <path
        d="M0 185 C110 170 200 200 310 185 C410 170 480 195 540 180 L540 280 L0 280 Z"
        fill="url(#deep-water)"
      />

      {/* Swaying Kelp Forests (Left) */}
      <g stroke="#1F5F53" strokeWidth="6" strokeLinecap="round" opacity="0.85">
        <path d="M40 280 Q30 220 50 170 Q65 130 55 90" fill="none" />
        <path d="M60 280 Q75 230 65 180 Q55 140 70 105" fill="none" />
        <path d="M85 280 Q75 240 90 200 Q105 160 95 125" fill="none" />
      </g>
      {/* Kelp Leaves */}
      <g fill="#2A7B6C" opacity="0.85">
        <ellipse cx="40" cy="180" rx="9" ry="5" transform="rotate(-30 40 180)" />
        <ellipse cx="60" cy="140" rx="10" ry="5" transform="rotate(25 60 140)" />
        <ellipse cx="70" cy="200" rx="10" ry="5" transform="rotate(30 70 200)" />
        <ellipse cx="90" cy="170" rx="9" ry="4.5" transform="rotate(-20 90 170)" />
      </g>

      {/* Swaying Kelp Forests (Right) */}
      <g stroke="#1F5F53" strokeWidth="6" strokeLinecap="round" opacity="0.85">
        <path d="M490 280 Q475 230 495 180 Q510 140 495 100" fill="none" />
        <path d="M515 280 Q530 230 515 180 Q500 135 520 95" fill="none" />
      </g>
      <g fill="#2A7B6C" opacity="0.85">
        <ellipse cx="485" cy="190" rx="10" ry="5" transform="rotate(-25 485 190)" />
        <ellipse cx="510" cy="150" rx="10" ry="5" transform="rotate(30 510 150)" />
      </g>

      {/* Coral Formations */}
      <g transform="translate(110, 215)">
        <path d="M0 65 C-10 40 -25 35 -30 20 C-35 5 -15 0 -10 15 C-5 5 15 5 15 20 C20 10 35 15 30 30 C35 45 15 50 15 65 Z" fill="url(#coral-gradient)" />
        <circle cx="-15" cy="15" r="5" fill="#FFA59E" />
        <circle cx="10" cy="18" r="6" fill="#FFA59E" />
        <circle cx="0" cy="35" r="4.5" fill="#FFA59E" />
      </g>
      <g transform="translate(420, 220)">
        <path d="M0 60 C10 35 25 30 30 15 C35 2 15 -2 10 12 C5 2 -15 2 -15 18 C-20 8 -35 12 -30 28 C-35 42 -15 48 -15 60 Z" fill="#E88A43" />
        <circle cx="12" cy="14" r="5" fill="#FFC499" />
        <circle cx="-10" cy="18" r="5.5" fill="#FFC499" />
      </g>

      {/* Submerged Central NEXA Ocean Research Hub */}
      <g transform="translate(270, 165)">
        {/* Foundation platform */}
        <ellipse cx="0" cy="50" rx="95" ry="24" fill="#0E3D38" />
        <path d="M -95 50 L -95 62 C -95 75, 95 75, 95 62 L 95 50 Z" fill="#082A26" />

        {/* Central Observation Dome */}
        <ellipse cx="0" cy="42" rx="65" ry="16" fill="#1C5E57" />
        <path d="M -65 42 C -65 -15, 65 -15, 65 42 Z" fill="url(#hub-glass)" stroke="#7BE0D4" strokeWidth="2.5" />

        {/* Interior glow / research levels */}
        <path d="M -50 35 C -50 5, 50 5, 50 35 Z" fill="#C2F7EE" opacity="0.6" />
        <ellipse cx="0" cy="35" rx="50" ry="10" fill="#2A7B70" />

        {/* Airlock side modules */}
        <g transform="translate(-75, 32)">
          <rect x="-18" y="-12" width="36" height="24" rx="10" fill="#FFFFFF" stroke="#68C5B9" strokeWidth="2" />
          <circle cx="0" cy="0" r="6" fill="#52B788" />
          <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
        </g>
        <g transform="translate(75, 32)">
          <rect x="-18" y="-12" width="36" height="24" rx="10" fill="#FFFFFF" stroke="#68C5B9" strokeWidth="2" />
          <circle cx="0" cy="0" r="6" fill="#52B788" />
          <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
        </g>

        {/* Windows inside main dome */}
        <rect x="-42" y="16" width="10" height="15" rx="4" fill="#FFFFFF" opacity="0.9" />
        <rect x="-24" y="13" width="10" height="18" rx="4" fill="#FFFFFF" opacity="0.9" />
        <rect x="-6" y="11" width="12" height="20" rx="4" fill="#FFFFFF" opacity="0.95" />
        <rect x="14" y="13" width="10" height="18" rx="4" fill="#FFFFFF" opacity="0.9" />
        <rect x="32" y="16" width="10" height="15" rx="4" fill="#FFFFFF" opacity="0.9" />

        {/* Antenna Mast & Lighthouse Beacon (Mission 1 Landmark) */}
        <line x1="0" y1="-15" x2="0" y2="-45" stroke="#E5BA6E" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="0" cy="-48" r="8" fill="#F4A261" className="animate-pulse" />
        <circle cx="0" cy="-48" r="4" fill="#FFFFFF" />
        <polygon points="-5,-48 -15,-60 15,-60 5,-48" fill="#FFD166" opacity="0.75" />
      </g>

      {/* Swimming Tropical Fish */}
      <g fill="#F4A261">
        <path d="M170 120 Q180 115 190 120 Q180 125 170 120 Z" />
        <polygon points="166,116 166,124 172,120" />
      </g>
      <g fill="#F4A261">
        <path d="M195 108 Q203 104 211 108 Q203 112 195 108 Z" />
        <polygon points="192,105 192,111 197,108" />
      </g>
      <g fill="#52B788">
        <path d="M370 115 Q382 110 394 115 Q382 120 370 115 Z" />
        <polygon points="366,111 366,119 373,115" />
      </g>
      <g fill="#52B788">
        <path d="M395 125 Q405 121 415 125 Q405 129 395 125 Z" />
        <polygon points="392,122 392,128 397,125" />
      </g>

      {/* Foreground Coral Crest (Bottom) */}
      <path
        d="M0 245 C80 230 160 250 240 235 C320 220 420 245 540 230 L540 280 L0 280 Z"
        fill="#082A26"
      />
      <circle cx="160" cy="260" r="12" fill="#D94E43" />
      <circle cx="178" cy="262" r="9" fill="#F4A261" />
      <circle cx="360" cy="255" r="14" fill="#3D9970" />
      <circle cx="380" cy="258" r="10" fill="#2ECC40" />
    </svg>
  );
}

// Interactive Map Node with hover events and state styling
export function LevelNode({
  x,
  y,
  level,
  name,
  topic,
  status = "locked", // "completed" | "current" | "available" | "locked"
  showStartBadge = false,
  onClick,
  onMouseEnter,
  onMouseLeave
}) {
  const isCompleted = status === "completed";
  const isCurrent = status === "current";
  const isAvailable = status === "available" || status === "current";
  const isLocked = status === "locked";

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="cursor-pointer group select-none"
    >
      {/* START HERE Badge */}
      {showStartBadge && !isCompleted && (
        <g transform="translate(0, -32)" className="animate-bounce">
          <rect
            x="-34"
            y="-14"
            width="68"
            height="20"
            rx="10"
            fill="#FFFFFF"
            stroke="#2A6B53"
            strokeWidth="1.6"
            filter="url(#map-shadow)"
          />
          <text
            x="0"
            y="-0.5"
            textAnchor="middle"
            fill="#1D4A3A"
            fontSize="8.5"
            fontWeight="900"
            letterSpacing="0.06em"
          >
            START HERE
          </text>
          {/* Arrow pointing down */}
          <polygon points="-4,6 4,6 0,10.5" fill="#2A6B53" />
        </g>
      )}

      {/* Pulsing ring for current level */}
      {isCurrent && (
        <circle
          cx="0"
          cy="0"
          r="23"
          fill="#ECA752"
          opacity="0.25"
          className="animate-ping origin-center"
        />
      )}

      {/* Outer interactive halo */}
      <circle
        cx="0"
        cy="0"
        r="18"
        fill="transparent"
        className="transition-all group-hover:scale-125"
      />

      {/* Main Node Circle */}
      <circle
        cx="0"
        cy="0"
        r="16"
        fill={
          isCompleted
            ? "#2A6B53"
            : isCurrent
            ? "#ECA752"
            : isAvailable
            ? "#FFFFFF"
            : "#F3F7F5"
        }
        stroke={
          isCompleted
            ? "#1E5440"
            : isCurrent
            ? "#FFFFFF"
            : isAvailable
            ? "#2A6B53"
            : "#CBD8D2"
        }
        strokeWidth={isCurrent ? "3" : isAvailable ? "2.2" : "1.6"}
        filter="url(#map-shadow)"
        className="transition-transform duration-200 group-hover:scale-115"
      />

      {/* Node Content / Icon */}
      {isCompleted ? (
        <path
          d="M-5 0.5 L-1.5 4.5 L5.5 -3.5"
          stroke="#FFFFFF"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : isCurrent ? (
        <text
          x="0"
          y="4.5"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="12"
          fontWeight="900"
        >
          {level}
        </text>
      ) : isAvailable ? (
        <text
          x="0"
          y="4.5"
          textAnchor="middle"
          fill="#2A6B53"
          fontSize="12"
          fontWeight="900"
        >
          {level}
        </text>
      ) : (
        /* Minimal Padlock for locked state */
        <g transform="translate(-4.5, -5)">
          <rect x="1" y="4" width="7" height="5.5" rx="1.5" fill="#8FA69C" />
          <path
            d="M2.5 4 V2.8 C2.5 1.5 6.5 1.5 6.5 2.8 V4"
            stroke="#8FA69C"
            strokeWidth="1.3"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      )}

      {/* Title Label under Node */}
      {name && (
        <g transform="translate(0, 27)">
          <rect
            x="-38"
            y="-1"
            width="76"
            height="16"
            rx="8"
            fill="#FFFFFF"
            fillOpacity="0.9"
            stroke={isCurrent ? "#ECA752" : isCompleted ? "#C5DEC9" : "#E2EAE5"}
            strokeWidth="1"
            className="transition-colors group-hover:fill-[#F0F7F3]"
          />
          <text
            x="0"
            y="10.5"
            textAnchor="middle"
            fill={isCurrent ? "#A05A18" : isCompleted ? "#1E5440" : "#556E62"}
            fontSize="8.5"
            fontWeight="800"
            letterSpacing="0.02em"
          >
            {name}
          </text>
        </g>
      )}
    </g>
  );
}

// Master Redesigned 6-Biome Interactive World Map
export function WorldMapArt({
  activeBiome = "all",
  currentMission = 1,
  completedMissions = [],
  onSelectMission = () => {},
  onSelectBiome = () => {},
  onHoverMission = () => {}
}) {
  const getNodeStatus = (lvl) => {
    if (completedMissions.includes(lvl)) return "completed";
    if (lvl === currentMission) return "current";
    if (lvl === 1) return "available";
    if (lvl === 2 && completedMissions.includes(1)) return "available";
    return "locked";
  };

  return (
    <div className="relative w-full h-full min-h-[580px] flex items-center justify-center select-none overflow-hidden">
      <svg
        viewBox="0 0 1020 720"
        className="w-full h-full max-h-[85vh]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Shadow Filter */}
          <filter id="map-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#0D2E24" floodOpacity="0.12" />
          </filter>
          <filter id="island-3d-shadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#0A241C" floodOpacity="0.16" />
          </filter>

          {/* Undersea Reef Water Gradient */}
          <linearGradient id="ocean-shelf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#248277" />
            <stop offset="50%" stopColor="#1E6B62" />
            <stop offset="100%" stopColor="#134B44" />
          </linearGradient>
          <linearGradient id="ocean-surface-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#88D4C8" />
            <stop offset="50%" stopColor="#5EBEB0" />
            <stop offset="100%" stopColor="#3DA495" />
          </linearGradient>

          {/* Forest Gradient */}
          <linearGradient id="forest-island-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B4DEBA" />
            <stop offset="60%" stopColor="#8EC298" />
            <stop offset="100%" stopColor="#6DA879" />
          </linearGradient>

          {/* Canyon Gradient */}
          <linearGradient id="canyon-island-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F9DFBF" />
            <stop offset="50%" stopColor="#EABF8C" />
            <stop offset="100%" stopColor="#D49E64" />
          </linearGradient>

          {/* Alpine Gradient */}
          <linearGradient id="alpine-island-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D5E4EC" />
            <stop offset="60%" stopColor="#ACC2CE" />
            <stop offset="100%" stopColor="#85A1AF" />
          </linearGradient>

          {/* Metro Grid Gradient */}
          <linearGradient id="metro-island-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBDCD1" />
            <stop offset="50%" stopColor="#EEB29F" />
            <stop offset="100%" stopColor="#DC8B72" />
          </linearGradient>

          {/* Frost Core Gradient */}
          <linearGradient id="frost-island-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4F3EE" />
            <stop offset="50%" stopColor="#A7E4DB" />
            <stop offset="100%" stopColor="#7AC5BC" />
          </linearGradient>
        </defs>

        {/* Ambient Map Topography & Sea Coordinates */}
        <g opacity="0.3" stroke="#8CB2A1" strokeWidth="1">
          <circle cx="150" cy="120" r="4" fill="none" />
          <path d="M140 120 h20 M150 110 v20" />
          <circle cx="500" cy="80" r="4" fill="none" />
          <path d="M490 80 h20 M500 70 v20" />
          <circle cx="890" cy="140" r="4" fill="none" />
          <path d="M880 140 h20 M890 130 v20" />
          <circle cx="480" cy="400" r="4" fill="none" />
          <path d="M470 400 h20 M480 390 v20" />
        </g>

        {/* Ocean Waves and Sea Currents */}
        <g stroke="#97BDB0" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5">
          <path d="M 120 480 C 140 475, 160 485, 180 480" />
          <path d="M 320 630 C 340 625, 360 635, 380 630" />
          <path d="M 370 240 C 390 235, 410 245, 430 240" />
          <path d="M 640 450 C 660 445, 680 455, 700 450" />
          <path d="M 880 610 C 900 605, 920 615, 940 610" />
        </g>

        {/* Connecting Expedition Path Lines between all Biomes */}
        <g stroke="#789E8E" strokeWidth="2.5" strokeDasharray="6 6" strokeLinecap="round" opacity="0.75">
          {/* Node 1 (Ocean Reef) -> Node 2 (Ocean Reef) */}
          <path d="M 185 585 C 220 575, 245 565, 275 540" />
          {/* Node 2 (Ocean Reef) -> Node 3 (Eco Woods) */}
          <path d="M 275 540 C 315 470, 290 390, 255 350" />
          {/* Node 3 (Eco Woods) -> Node 4 (Eco Woods) */}
          <path d="M 255 350 C 220 355, 185 345, 155 325" />
          {/* Node 4 (Eco Woods) -> Node 5 (Canyon Vault) */}
          <path d="M 155 325 C 220 315, 330 380, 440 520" />
          {/* Node 5 (Canyon Vault) -> Node 6 (Canyon Vault) */}
          <path d="M 440 520 C 470 510, 495 490, 520 465" />
          {/* Node 6 (Canyon Vault) -> Node 7 (Mountain Pass) */}
          <path d="M 520 465 C 530 395, 510 350, 550 310" />
          {/* Node 7 (Mountain Pass) -> Node 8 (Mountain Pass) */}
          <path d="M 550 310 C 580 300, 605 290, 635 290" />
          {/* Node 8 (Mountain Pass) -> Node 9 (Metro Grid) */}
          <path d="M 635 290 C 685 305, 720 345, 775 410" />
          {/* Node 9 (Metro Grid) -> Frost Core */}
          <path d="M 775 465 C 800 515, 785 565, 755 605" />
        </g>


        {/* ======================================================== */}
        {/* WORLD 01: UNDERSEA REEF (Bottom Left — Fully Playable Biome) */}
        {/* ======================================================== */}
        <g
          className={"transition-all duration-300 cursor-pointer " + (activeBiome === "all" || activeBiome === "ocean" ? "opacity-100" : "opacity-35")}
          onClick={() => onSelectBiome("ocean")}
        >
          {/* Submerged Oceanic Shelf 3D Base */}
          <path
            d="M 90 550 C 110 520, 220 490, 310 510 C 350 520, 370 560, 350 600 C 330 635, 260 655, 180 650 C 110 645, 70 610, 80 570 Z"
            fill="#0F3D37"
            filter="url(#island-3d-shadow)"
          />

          {/* Deep Turquoise Water Rim (Immediate underwater appearance!) */}
          <path
            d="M 95 545 C 115 515, 220 485, 305 505 C 345 515, 365 550, 345 590 C 325 625, 255 645, 175 640 C 105 635, 75 600, 85 565 Z"
            fill="url(#ocean-shelf-grad)"
          />

          {/* Illuminated Coral Reef Surface Lagoon */}
          <path
            d="M 105 540 C 125 512, 215 488, 295 505 C 335 512, 350 545, 335 580 C 315 615, 250 632, 175 630 C 115 625, 88 595, 95 560 Z"
            fill="url(#ocean-surface-grad)"
            stroke="#9CE8DC"
            strokeWidth="1.5"
          />

          {/* Submerged Water Caustics Shimmer */}
          <g stroke="#C6F7F0" strokeWidth="1.2" opacity="0.6" fill="none">
            <path d="M 140 525 Q 165 515 190 525 Q 215 535 240 525" />
            <path d="M 170 550 Q 195 540 220 550 Q 245 560 270 550" />
            <path d="M 130 580 Q 155 570 180 580 Q 205 590 230 580" />
          </g>

          {/* Bioluminescent Coral Formations */}
          <g transform="translate(130, 520)">
            <ellipse cx="0" cy="0" rx="9" ry="6" fill="#FF7066" />
            <circle cx="-5" cy="-3" r="3" fill="#FFA59E" />
            <circle cx="4" cy="-2" r="3.5" fill="#FFA59E" />
            <ellipse cx="14" cy="5" rx="7" ry="5" fill="#F4A261" />
            <ellipse cx="-12" cy="7" rx="8" ry="4" fill="#E76F51" />
          </g>
          <g transform="translate(305, 530)">
            <ellipse cx="0" cy="0" rx="11" ry="7" fill="#E76F51" />
            <circle cx="-4" cy="-3" r="4" fill="#FFA59E" />
            <circle cx="5" cy="-2" r="4.5" fill="#FFA59E" />
            <ellipse cx="-14" cy="6" rx="8" ry="5" fill="#F4A261" />
          </g>

          {/* Sea Plants & Swaying Kelp */}
          <g stroke="#1F695B" strokeWidth="3" strokeLinecap="round" opacity="0.8">
            <path d="M 115 560 Q 110 545 118 535" />
            <path d="M 122 565 Q 128 550 120 540" />
            <path d="M 320 560 Q 325 545 318 535" />
            <path d="M 328 565 Q 320 550 328 540" />
          </g>

          {/* Central NEXA Ocean Research Hub (Submerged Pressurized Dome) */}
          <g transform="translate(225, 515)">
            <ellipse cx="0" cy="14" rx="30" ry="9" fill="#0D352F" />
            <path d="M -28 12 C -28 -14, 28 -14, 28 12 Z" fill="#E8FAF7" stroke="#3DA395" strokeWidth="2" />
            <path d="M -20 10 C -20 -8, 20 -8, 20 10 Z" fill="#8CE0D4" opacity="0.75" />
            {/* Observation portholes */}
            <circle cx="-14" cy="4" r="3.5" fill="#1C5E57" />
            <circle cx="-14" cy="4" r="2" fill="#52B788" />
            <circle cx="0" cy="2" r="4" fill="#1C5E57" />
            <circle cx="0" cy="2" r="2.5" fill="#52B788" />
            <circle cx="14" cy="4" r="3.5" fill="#1C5E57" />
            <circle cx="14" cy="4" r="2" fill="#52B788" />
            {/* Hydro-Antenna Beacon */}
            <line x1="0" y1="-14" x2="0" y2="-26" stroke="#C49B5B" strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="0" cy="-28" r="3.5" fill="#ECA752" />
          </g>

          {/* Floating Underwater Bubbles */}
          <g fill="#FFFFFF" opacity="0.6">
            <circle cx="150" cy="550" r="2.5" />
            <circle cx="154" cy="542" r="1.8" />
            <circle cx="280" cy="510" r="3" />
            <circle cx="283" cy="502" r="2" />
            <circle cx="210" cy="485" r="2.5" />
          </g>

          {/* Little Swimming Reef Fish */}
          <g fill="#FFA07A">
            <path d="M 160 595 Q 166 592 172 595 Q 166 598 160 595 Z" />
            <path d="M 285 575 Q 291 572 297 575 Q 291 578 285 575 Z" />
          </g>

          {/* Node 1: First Day (Playable Mission 1) */}
          <LevelNode
            x={185}
            y={585}
            level={1}
            name="First day"
            status={getNodeStatus(1)}
            showStartBadge={true}
            onClick={(e) => {
              e.stopPropagation();
              onSelectMission(1);
            }}
            onMouseEnter={() => onHoverMission(1)}
            onMouseLeave={() => onHoverMission(null)}
          />

          {/* Node 2: Identity (Playable Mission 2) */}
          <LevelNode
            x={275}
            y={540}
            level={2}
            name="Identity"
            status={getNodeStatus(2)}
            onClick={(e) => {
              e.stopPropagation();
              onSelectMission(2);
            }}
            onMouseEnter={() => onHoverMission(2)}
            onMouseLeave={() => onHoverMission(null)}
          />

          {/* Biome Title & Playable Pill */}
          <g transform="translate(225, 668)">
            <rect
              x="-68"
              y="-12"
              width="136"
              height="24"
              rx="12"
              fill="#FFFFFF"
              stroke="#2A6B53"
              strokeWidth="1.5"
              filter="url(#map-shadow)"
              className="hover:fill-[#F0F7F3]"
            />
            <text x="0" y="3" textAnchor="middle" fill="#134737" fontSize="10" fontWeight="900" letterSpacing="0.06em">
              UNDERSEA REEF
            </text>
            <text x="0" y="24" textAnchor="middle" fill="#2A6B53" fontSize="8" fontWeight="800">
              01 · PLAYABLE NOW
            </text>
          </g>
        </g>


        {/* ======================================================== */}
        {/* WORLD 02: ECO WOODS (Top Left — Preview Biome) */}
        {/* ======================================================== */}
        <g
          className={"transition-all duration-300 cursor-pointer " + (activeBiome === "all" || activeBiome === "forest" ? "opacity-100" : "opacity-35")}
          onClick={() => onSelectBiome("forest")}
        >
          {/* Organic Tiered Terrain 3D Base */}
          <path
            d="M 75 300 C 65 240, 160 200, 240 215 C 310 225, 345 270, 335 320 C 325 365, 250 385, 180 380 C 110 375, 80 345, 75 300 Z"
            fill="#3A6348"
            filter="url(#island-3d-shadow)"
          />

          {/* Shoreline Layer */}
          <path
            d="M 80 295 C 70 238, 160 200, 235 215 C 305 225, 338 265, 330 312 C 320 355, 245 375, 178 370 C 115 365, 85 340, 80 295 Z"
            fill="#B9DFBF"
          />

          {/* Island Surface */}
          <path
            d="M 90 290 C 82 238, 165 205, 230 218 C 295 228, 325 262, 318 305 C 310 345, 240 365, 175 360 C 120 355, 95 330, 90 290 Z"
            fill="url(#forest-island-grad)"
          />

          {/* Winding Cobblestone Forest Path */}
          <path
            d="M 125 315 C 160 345, 230 355, 265 315"
            stroke="#DDEEE0"
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Wooden Arched Stream Bridge */}
          <g transform="translate(195, 335)">
            <path d="M -16 0 Q 0 -6 16 0" stroke="#8E6743" strokeWidth="4" strokeLinecap="round" fill="none" />
            <line x1="-14" y1="0" x2="-14" y2="6" stroke="#684A2E" strokeWidth="2" />
            <line x1="14" y1="0" x2="14" y2="6" stroke="#684A2E" strokeWidth="2" />
          </g>

          {/* Multi-layered Pine and Canopy Trees */}
          <g transform="translate(125, 225)">
            <rect x="-2" y="24" width="4" height="8" fill="#4D382A" />
            <polygon points="0,0 -16,18 16,18" fill="#2D6A4F" />
            <polygon points="0,6 -18,24 18,24" fill="#3D8262" />
            <polygon points="0,12 -20,30 20,30" fill="#275640" />
          </g>
          <g transform="translate(155, 205)">
            <rect x="-2" y="28" width="4" height="10" fill="#4D382A" />
            <polygon points="0,0 -18,20 18,20" fill="#235A42" />
            <polygon points="0,8 -20,28 20,28" fill="#2F7556" />
            <polygon points="0,15 -22,34 22,34" fill="#1E4734" />
          </g>
          <g transform="translate(275, 220)">
            <rect x="-2" y="24" width="4" height="8" fill="#4D382A" />
            <polygon points="0,0 -15,18 15,18" fill="#2D6A4F" />
            <polygon points="0,6 -17,24 17,24" fill="#3D8262" />
          </g>
          <g transform="translate(295, 245)">
            <circle cx="0" cy="15" r="14" fill="#40916C" />
            <circle cx="-6" cy="10" r="10" fill="#52B788" />
            <circle cx="5" cy="8" r="11" fill="#74C69D" />
          </g>

          {/* Modern Botanical Eco-Lab Building */}
          <g transform="translate(225, 240)">
            <polygon points="0,0 -20,12 -20,34 0,22" fill="#FFFFFF" stroke="#CCDED3" strokeWidth="1" />
            <polygon points="0,0 24,14 24,36 0,22" fill="#EAF3EE" stroke="#CCDED3" strokeWidth="1" />
            <polygon points="0,0 24,14 4,26 -20,12" fill="#52B788" />
            {/* Glowing Gate Terminal */}
            <rect x="-14" y="14" width="8" height="12" rx="2" fill="#2D6A4F" />
            <rect x="6" y="16" width="10" height="12" rx="2" fill="#2D6A4F" />
          </g>

          {/* Node 4: Security Gate */}
          <LevelNode
            x={155}
            y={325}
            level={4}
            name="Security Gate"
            status={getNodeStatus(4)}
            onClick={(e) => {
              e.stopPropagation();
              onSelectMission(4);
            }}
            onMouseEnter={() => onHoverMission(4)}
            onMouseLeave={() => onHoverMission(null)}
          />

          {/* Node 3: User Terminal */}
          <LevelNode
            x={255}
            y={350}
            level={3}
            name="User Terminal"
            status={getNodeStatus(3)}
            onClick={(e) => {
              e.stopPropagation();
              onSelectMission(3);
            }}
            onMouseEnter={() => onHoverMission(3)}
            onMouseLeave={() => onHoverMission(null)}
          />

          {/* Biome Title & Preview Pill */}
          <g transform="translate(210, 412)">
            <rect
              x="-62"
              y="-12"
              width="124"
              height="24"
              rx="12"
              fill="#FFFFFF"
              stroke="#D2E4D8"
              strokeWidth="1.2"
              filter="url(#map-shadow)"
              className="hover:fill-[#F0F7F3]"
            />
            <text x="0" y="3" textAnchor="middle" fill="#1C3D2F" fontSize="10" fontWeight="900" letterSpacing="0.06em">
              ECO WOODS
            </text>
            <text x="0" y="24" textAnchor="middle" fill="#597A6C" fontSize="8" fontWeight="800">
              02 · INPUT & LOGIC
            </text>
          </g>
        </g>


        {/* ======================================================== */}
        {/* WORLD 03: CANYON VAULT (Bottom Center — Preview Biome) */}
        {/* ======================================================== */}
        <g
          className={"transition-all duration-300 cursor-pointer " + (activeBiome === "all" || activeBiome === "canyon" ? "opacity-100" : "opacity-35")}
          onClick={() => onSelectBiome("canyon")}
        >
          {/* Layered Desert Strata 3D Base */}
          <path
            d="M 360 480 C 370 420, 470 410, 560 435 C 600 450, 620 495, 600 540 C 580 575, 490 600, 420 585 C 360 570, 350 520, 360 480 Z"
            fill="#8B5B33"
            filter="url(#island-3d-shadow)"
          />

          {/* Sandstone Shoreline */}
          <path
            d="M 365 475 C 375 420, 465 410, 550 432 C 590 445, 610 488, 590 530 C 570 565, 485 590, 420 578 C 365 565, 355 515, 365 475 Z"
            fill="#F6DEBE"
          />

          {/* Canyon Basin Surface */}
          <path
            d="M 375 470 C 385 425, 465 418, 540 436 C 580 450, 598 485, 580 522 C 560 555, 480 578, 422 568 C 375 558, 368 510, 375 470 Z"
            fill="url(#canyon-island-grad)"
          />

          {/* Tiered Sandstone Cliffs & Mesas */}
          <g transform="translate(405, 425)">
            <polygon points="-16,0 6,-22 28,-22 36,0" fill="#E08B5E" />
            <polygon points="6,-22 28,-22 22,0 3,0" fill="#EA9E75" />
            <polygon points="-16,0 3,0 3,28 -16,28" fill="#B36137" />
            <polygon points="3,0 36,0 36,28 3,28" fill="#C97247" />
          </g>
          <g transform="translate(485, 385)">
            <polygon points="-24,0 4,-30 32,-30 42,0" fill="#E59368" />
            <polygon points="4,-30 32,-30 26,0 0,0" fill="#F0A67E" />
            <polygon points="-24,0 0,0 0,44 -24,44" fill="#A8572F" />
            <polygon points="0,0 42,0 42,44 0,44" fill="#C76F42" />
          </g>

          {/* Ancient Mechanical Vault Blast Door into rock face */}
          <g transform="translate(470, 460)">
            <rect x="-14" y="-12" width="28" height="24" rx="4" fill="#3D2918" />
            <circle cx="0" cy="0" r="8" fill="#ECA752" />
            <rect x="-10" y="-10" width="20" height="20" stroke="#8E5B2E" strokeWidth="2" fill="none" />
          </g>

          {/* Desert Cacti & Glowing Data Crystals */}
          <g transform="translate(390, 500)">
            <line x1="0" y1="-14" x2="0" y2="6" stroke="#486D40" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M -5 -6 H 0 V -1 H 5 V -8" stroke="#486D40" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          </g>
          <g transform="translate(545, 490)">
            <polygon points="0,-12 4,0 0,4 -4,0" fill="#64DFDF" className="animate-pulse" />
            <polygon points="8,-8 11,2 8,5 5,2" fill="#48CAE4" />
          </g>

          {/* Node 5: Automation */}
          <LevelNode
            x={440}
            y={520}
            level={5}
            name="Automation"
            status={getNodeStatus(5)}
            onClick={(e) => {
              e.stopPropagation();
              onSelectMission(5);
            }}
            onMouseEnter={() => onHoverMission(5)}
            onMouseLeave={() => onHoverMission(null)}
          />

          {/* Node 6: Data Recovery */}
          <LevelNode
            x={520}
            y={465}
            level={6}
            name="Data Recovery"
            status={getNodeStatus(6)}
            onClick={(e) => {
              e.stopPropagation();
              onSelectMission(6);
            }}
            onMouseEnter={() => onHoverMission(6)}
            onMouseLeave={() => onHoverMission(null)}
          />

          {/* Biome Title & Preview Pill */}
          <g transform="translate(480, 612)">
            <rect
              x="-68"
              y="-12"
              width="136"
              height="24"
              rx="12"
              fill="#FFFFFF"
              stroke="#E8C7A5"
              strokeWidth="1.2"
              filter="url(#map-shadow)"
              className="hover:fill-[#FDF8F3]"
            />
            <text x="0" y="3" textAnchor="middle" fill="#6B3F1D" fontSize="10" fontWeight="900" letterSpacing="0.06em">
              CANYON VAULT
            </text>
            <text x="0" y="24" textAnchor="middle" fill="#9C683F" fontSize="8" fontWeight="800">
              03 · LOOPS & LISTS
            </text>
          </g>
        </g>


        {/* ======================================================== */}
        {/* WORLD 04: MOUNTAIN PASS (Top Center — Preview Biome) */}
        {/* ======================================================== */}
        <g
          className={"transition-all duration-300 cursor-pointer " + (activeBiome === "all" || activeBiome === "alpine" ? "opacity-100" : "opacity-35")}
          onClick={() => onSelectBiome("alpine")}
        >
          {/* Alpine Mountain Peak 3D Base */}
          <path
            d="M 460 280 C 470 200, 580 180, 670 210 C 720 230, 740 285, 720 330 C 690 370, 580 380, 510 365 C 460 350, 450 320, 460 280 Z"
            fill="#415764"
            filter="url(#island-3d-shadow)"
          />

          {/* Alpine Ridge Surface */}
          <path
            d="M 470 275 C 480 205, 575 185, 660 215 C 710 235, 728 280, 710 320 C 680 358, 580 370, 515 355 C 470 342, 462 312, 470 275 Z"
            fill="url(#alpine-island-grad)"
          />

          {/* Snow-Capped Alpine Mountain Peaks */}
          <g transform="translate(520, 195)">
            <polygon points="0,0 -26,55 0,55" fill="#3D5666" />
            <polygon points="0,0 0,55 26,55" fill="#59788A" />
            <polygon points="0,0 -12,24 0,28 12,24" fill="#FFFFFF" />
          </g>
          <g transform="translate(590, 140)">
            <polygon points="0,0 -38,105 0,105" fill="#364E5E" />
            <polygon points="0,0 0,105 42,105" fill="#608398" />
            <polygon points="0,0 -18,45 0,52 18,45" fill="#FFFFFF" />
          </g>
          <g transform="translate(650, 190)">
            <polygon points="0,0 -24,55 0,55" fill="#3D5666" />
            <polygon points="0,0 0,55 24,55" fill="#59788A" />
            <polygon points="0,0 -10,22 0,26 10,22" fill="#FFFFFF" />
          </g>

          {/* Wooden Rope Suspension Bridge across gorge */}
          <g transform="translate(535, 260)">
            <path d="M -15 0 Q 0 8 18 0" stroke="#8E6743" strokeWidth="2.5" fill="none" />
            <path d="M -15 -6 Q 0 2 18 -6" stroke="#8E6743" strokeWidth="2.5" fill="none" />
            <line x1="-12" y1="-5" x2="-12" y2="1" stroke="#8E6743" strokeWidth="1.2" />
            <line x1="-2" y1="-2" x2="-2" y2="4" stroke="#8E6743" strokeWidth="1.2" />
            <line x1="8" y1="-3" x2="8" y2="3" stroke="#8E6743" strokeWidth="1.2" />
          </g>

          {/* High Altitude Observatory & Radio Relay */}
          <g transform="translate(620, 240)">
            <rect x="-10" y="-8" width="20" height="16" rx="3" fill="#FFFFFF" stroke="#ACC2CE" strokeWidth="1" />
            <ellipse cx="0" cy="-8" rx="8" ry="6" fill="#75A6BD" />
            <line x1="0" y1="-14" x2="4" y2="-22" stroke="#ECA752" strokeWidth="2" strokeLinecap="round" />
            <circle cx="4" cy="-23" r="2.5" fill="#ECA752" />
          </g>

          {/* Node 7: Code Builder */}
          <LevelNode
            x={550}
            y={310}
            level={7}
            name="Code Builder"
            status={getNodeStatus(7)}
            onClick={(e) => {
              e.stopPropagation();
              onSelectMission(7);
            }}
            onMouseEnter={() => onHoverMission(7)}
            onMouseLeave={() => onHoverMission(null)}
          />

          {/* Node 8: Error Detector */}
          <LevelNode
            x={635}
            y={290}
            level={8}
            name="Error Detector"
            status={getNodeStatus(8)}
            onClick={(e) => {
              e.stopPropagation();
              onSelectMission(8);
            }}
            onMouseEnter={() => onHoverMission(8)}
            onMouseLeave={() => onHoverMission(null)}
          />

          {/* Biome Title & Preview Pill */}
          <g transform="translate(595, 385)">
            <rect
              x="-72"
              y="-12"
              width="144"
              height="24"
              rx="12"
              fill="#FFFFFF"
              stroke="#CBD8E0"
              strokeWidth="1.2"
              filter="url(#map-shadow)"
              className="hover:fill-[#F2F6F8]"
            />
            <text x="0" y="3" textAnchor="middle" fill="#253D4A" fontSize="10" fontWeight="900" letterSpacing="0.06em">
              MOUNTAIN PASS
            </text>
            <text x="0" y="24" textAnchor="middle" fill="#627E8C" fontSize="8" fontWeight="800">
              04 · FUNCTIONS & ERRORS
            </text>
          </g>
        </g>


        {/* ======================================================== */}
        {/* WORLD 05: METRO GRID (Top Right — Preview Biome) */}
        {/* ======================================================== */}
        <g
          className={"transition-all duration-300 cursor-pointer " + (activeBiome === "all" || activeBiome === "city" ? "opacity-100" : "opacity-35")}
          onClick={() => onSelectBiome("city")}
        >
          {/* Cybernetic Island Base 3D Base */}
          <path
            d="M 685 410 C 690 340, 785 320, 880 345 C 930 365, 950 420, 930 465 C 900 505, 800 520, 730 500 C 685 485, 680 450, 685 410 Z"
            fill="#8F4832"
            filter="url(#island-3d-shadow)"
          />

          {/* Island Surface */}
          <path
            d="M 695 405 C 700 345, 780 328, 870 350 C 918 368, 938 415, 920 455 C 890 495, 795 508, 732 490 C 695 475, 690 445, 695 405 Z"
            fill="url(#metro-island-grad)"
          />

          {/* Futuristic Skyscraper Skylines */}
          <g transform="translate(775, 305)">
            <polygon points="0,0 -14,9 -14,55 0,46" fill="#D86F52" />
            <polygon points="0,0 20,12 20,58 0,46" fill="#EA8569" />
            <polygon points="0,0 20,12 6,21 -14,9" fill="#F49D84" />
            {/* Glowing Window Matrix */}
            <g fill="#FFFFFF" opacity="0.9">
              <rect x="-10" y="14" width="2.5" height="3" />
              <rect x="-5" y="17" width="2.5" height="3" />
              <rect x="-10" y="24" width="2.5" height="3" />
              <rect x="-5" y="27" width="2.5" height="3" />
              <rect x="4" y="20" width="3" height="3" />
              <rect x="12" y="25" width="3" height="3" />
            </g>
          </g>
          <g transform="translate(820, 330)">
            <polygon points="0,0 -12,8 -12,32 0,24" fill="#C5583B" />
            <polygon points="0,0 18,11 18,35 0,24" fill="#E27457" />
            <polygon points="0,0 18,11 6,19 -12,8" fill="#F08F74" />
          </g>
          <g transform="translate(745, 360)">
            <polygon points="0,0 -12,7 -12,24 0,17" fill="#FFFFFF" />
            <polygon points="0,0 16,9 16,26 0,17" fill="#EAEAEA" />
          </g>

          {/* Curved Glowing Monorail Transit Route */}
          <path
            d="M 720 430 C 760 390, 830 400, 880 435"
            stroke="#64DFDF"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.9"
          />

          {/* Level 9-10 Banner on City */}
          <g
            transform="translate(775, 435)"
            onClick={(e) => {
              e.stopPropagation();
              onSelectMission(9);
            }}
          >
            <rect
              x="-44"
              y="-11"
              width="88"
              height="22"
              rx="11"
              fill="#FFFFFF"
              stroke="#EA8569"
              strokeWidth="1.4"
              filter="url(#map-shadow)"
            />
            <text x="0" y="4" textAnchor="middle" fill="#8F341C" fontSize="8.5" fontWeight="900" letterSpacing="0.04em">
              LEVELS 9–10
            </text>
          </g>

          {/* Biome Title & Preview Pill */}
          <g transform="translate(780, 505)">
            <rect
              x="-64"
              y="-12"
              width="128"
              height="24"
              rx="12"
              fill="#FFFFFF"
              stroke="#F0BAAA"
              strokeWidth="1.2"
              filter="url(#map-shadow)"
              className="hover:fill-[#FDF5F2]"
            />
            <text x="0" y="3" textAnchor="middle" fill="#6E2B18" fontSize="10" fontWeight="900" letterSpacing="0.06em">
              METRO GRID
            </text>
            <text x="0" y="24" textAnchor="middle" fill="#A84C32" fontSize="8" fontWeight="800">
              05 · DATA & MODULES
            </text>
          </g>
        </g>


        {/* ======================================================== */}
        {/* WORLD 06: FROST CORE (Bottom Right — Preview Biome) */}
        {/* ======================================================== */}
        <g
          className={"transition-all duration-300 cursor-pointer " + (activeBiome === "all" || activeBiome === "glacier" ? "opacity-100" : "opacity-35")}
          onClick={() => onSelectBiome("glacier")}
        >
          {/* Crystalline Glacier Shelf 3D Base */}
          <path
            d="M 650 610 C 650 540, 750 520, 840 545 C 890 565, 910 615, 890 655 C 860 695, 760 705, 690 690 C 650 675, 645 645, 650 610 Z"
            fill="#275661"
            filter="url(#island-3d-shadow)"
          />

          {/* Translucent Icy Surface */}
          <path
            d="M 660 605 C 660 545, 745 528, 830 550 C 878 568, 898 610, 880 648 C 850 685, 755 695, 692 680 C 655 668, 655 640, 660 605 Z"
            fill="url(#frost-island-grad)"
          />

          {/* Jagged Crystalline Ice Spires */}
          <g transform="translate(710, 550)">
            <polygon points="0,0 -24,50 0,50" fill="#4B7E8C" />
            <polygon points="0,0 0,50 24,50" fill="#75AAB8" />
            <polygon points="0,0 -10,22 0,26 10,22" fill="#EAFDFC" />
          </g>
          <g transform="translate(820, 540)">
            <polygon points="0,0 -28,58 0,58" fill="#4B7E8C" />
            <polygon points="0,0 0,58 28,58" fill="#75AAB8" />
            <polygon points="0,0 -12,25 0,29 12,25" fill="#EAFDFC" />
          </g>

          {/* Subterranean Quantum Energy Core (Glowing Cyan Monolith) */}
          <g transform="translate(755, 555)">
            <polygon points="0,0 -22,14 -22,46 0,32" fill="#3D6B78" />
            <polygon points="0,0 26,16 26,48 0,32" fill="#588B98" />
            <polygon points="0,0 26,16 5,28 -22,14" fill="#78ABB8" />
            {/* Glowing cyan core chamber */}
            <circle cx="0" cy="22" r="7" fill="#64DFDF" className="animate-pulse" />
            <circle cx="0" cy="22" r="3.5" fill="#FFFFFF" />
          </g>

          {/* Levels 11-12 Capstone Banner on Frost Core */}
          <g
            transform="translate(755, 635)"
            onClick={(e) => {
              e.stopPropagation();
              onSelectMission(11);
            }}
          >
            <rect
              x="-46"
              y="-11"
              width="92"
              height="22"
              rx="11"
              fill="#FFFFFF"
              stroke="#75ABB8"
              strokeWidth="1.4"
              filter="url(#map-shadow)"
            />
            <text x="0" y="4" textAnchor="middle" fill="#1C4B54" fontSize="8.5" fontWeight="900" letterSpacing="0.04em">
              LEVELS 11–12
            </text>
          </g>

          {/* Biome Title & Preview Pill */}
          <g transform="translate(755, 705)">
            <rect
              x="-66"
              y="-12"
              width="132"
              height="24"
              rx="12"
              fill="#FFFFFF"
              stroke="#B2DED7"
              strokeWidth="1.2"
              filter="url(#map-shadow)"
              className="hover:fill-[#F0FBF9]"
            />
            <text x="0" y="3" textAnchor="middle" fill="#194850" fontSize="10" fontWeight="900" letterSpacing="0.06em">
              FROST CORE
            </text>
            <text x="0" y="24" textAnchor="middle" fill="#427882" fontSize="8" fontWeight="800">
              06 · BUILD & CREATE
            </text>
          </g>
        </g>


        {/* ======================================================== */}
        {/* COMPASS ROSE (Top Right) */}
        {/* ======================================================== */}
        <g transform="translate(945, 65)" opacity="0.85">
          <text x="0" y="-22" textAnchor="middle" fill="#4B6E5F" fontSize="10.5" fontWeight="900">
            N
          </text>
          <circle cx="0" cy="0" r="16" stroke="#B8D4C8" strokeWidth="1.6" fill="#FFFFFF" filter="url(#map-shadow)" />
          <polygon points="0,-12 4,0 0,0" fill="#2A6B53" />
          <polygon points="0,-12 -4,0 0,0" fill="#40916C" />
          <polygon points="0,12 4,0 0,0" fill="#95D5B2" />
          <polygon points="0,12 -4,0 0,0" fill="#D8F3DC" />
        </g>
      </svg>
    </div>
  );
}
