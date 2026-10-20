import React from "react";

/**
 * Handcrafted vector SVG illustrations for Wildwood Sanctuary woodland animals
 * High quality, warm forest palette, expressive and distinct.
 */

// 1. Rusty the Red Fox
export function FoxArt({ className = "w-16 h-16", mood = "happy" }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Bushy Tail */}
      <path
        d="M68 62 C82 52, 94 65, 88 80 C82 92, 65 88, 55 78 Z"
        fill="#D9531E"
      />
      <path
        d="M80 72 C88 78, 86 86, 78 86 C72 86, 68 82, 66 76 Z"
        fill="#FFF6EB"
      />

      {/* Body */}
      <ellipse cx="48" cy="65" rx="22" ry="18" fill="#E85D26" />
      <path d="M40 54 Q48 70 56 54 Q48 78 40 54 Z" fill="#FFF6EB" />

      {/* Back Paws */}
      <circle cx="34" cy="78" r="6" fill="#8C330D" />
      <circle cx="62" cy="78" r="6" fill="#8C330D" />

      {/* Head */}
      <path
        d="M26 36 L36 12 L48 26 L60 12 L70 36 C74 48, 68 58, 48 60 C28 58, 22 48, 26 36 Z"
        fill="#E85D26"
      />

      {/* Ear Interiors */}
      <polygon points="34,18 38,30 46,26" fill="#FFF6EB" />
      <polygon points="62,18 58,30 50,26" fill="#FFF6EB" />

      {/* White Cheeks & Muzzle */}
      <path
        d="M28 42 C32 46, 38 52, 48 54 C58 52, 64 46, 68 42 C64 54, 56 58, 48 58 C40 58, 32 54, 28 42 Z"
        fill="#FFF6EB"
      />

      {/* Eyes */}
      {mood === "sleepy" ? (
        <>
          <path d="M36 40 Q40 43 44 40" stroke="#2B1E16" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M52 40 Q56 43 60 40" stroke="#2B1E16" strokeWidth="2.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="40" cy="39" rx="3.5" ry="4" fill="#2B1E16" />
          <circle cx="39" cy="38" r="1.2" fill="#FFFFFF" />
          <ellipse cx="56" cy="39" rx="3.5" ry="4" fill="#2B1E16" />
          <circle cx="55" cy="38" r="1.2" fill="#FFFFFF" />
        </>
      )}

      {/* Nose */}
      <polygon points="46,47 50,47 48,50" fill="#2B1E16" />
    </svg>
  );
}

// 2. Pip the Forest Rabbit / Hare
export function RabbitArt({ className = "w-16 h-16", mood = "happy" }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Tall Ears */}
      <ellipse cx="38" cy="22" rx="7" ry="18" fill="#D3C5B4" transform="rotate(-10 38 22)" />
      <ellipse cx="38" cy="22" rx="4" ry="14" fill="#F4B8B8" transform="rotate(-10 38 22)" />

      <ellipse cx="60" cy="22" rx="7" ry="18" fill="#D3C5B4" transform="rotate(10 60 22)" />
      <ellipse cx="60" cy="22" rx="4" ry="14" fill="#F4B8B8" transform="rotate(10 60 22)" />

      {/* Fluffy Round Tail */}
      <circle cx="24" cy="74" r="8" fill="#FFFFFF" />

      {/* Body */}
      <ellipse cx="48" cy="68" rx="22" ry="18" fill="#C5B5A1" />
      <ellipse cx="48" cy="68" rx="14" ry="12" fill="#FFF9F2" />

      {/* Head */}
      <ellipse cx="48" cy="44" rx="18" ry="16" fill="#D3C5B4" />

      {/* Cheeks */}
      <circle cx="36" cy="48" r="3.5" fill="#F4B8B8" opacity="0.6" />
      <circle cx="60" cy="48" r="3.5" fill="#F4B8B8" opacity="0.6" />

      {/* Eyes */}
      <circle cx="41" cy="42" r="3.5" fill="#3D2D20" />
      <circle cx="40" cy="41" r="1.2" fill="#FFFFFF" />
      <circle cx="55" cy="42" r="3.5" fill="#3D2D20" />
      <circle cx="54" cy="41" r="1.2" fill="#FFFFFF" />

      {/* Nose and mouth */}
      <ellipse cx="48" cy="48" rx="2.5" ry="2" fill="#F49E9E" />
      <path d="M46 51 Q48 53 50 51" stroke="#5C4533" strokeWidth="1.5" strokeLinecap="round" />

      {/* Whiskers */}
      <line x1="32" y1="47" x2="22" y2="45" stroke="#8C7764" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="32" y1="50" x2="22" y2="52" stroke="#8C7764" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="64" y1="47" x2="74" y2="45" stroke="#8C7764" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="64" y1="50" x2="74" y2="52" stroke="#8C7764" strokeWidth="1.2" strokeLinecap="round" />

      {/* Paws */}
      <ellipse cx="38" cy="82" rx="7" ry="4" fill="#D3C5B4" />
      <ellipse cx="58" cy="82" rx="7" ry="4" fill="#D3C5B4" />
    </svg>
  );
}

// 3. Fern the Woodland Fawn / Deer
export function DeerArt({ className = "w-16 h-16", mood = "happy" }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Ears */}
      <ellipse cx="30" cy="26" rx="6" ry="12" fill="#A86F3E" transform="rotate(-35 30 26)" />
      <ellipse cx="30" cy="26" rx="3.5" ry="8" fill="#F0C29E" transform="rotate(-35 30 26)" />

      <ellipse cx="68" cy="26" rx="6" ry="12" fill="#A86F3E" transform="rotate(35 68 26)" />
      <ellipse cx="68" cy="26" rx="3.5" ry="8" fill="#F0C29E" transform="rotate(35 68 26)" />

      {/* Body */}
      <ellipse cx="50" cy="68" rx="24" ry="18" fill="#A86F3E" />
      <ellipse cx="50" cy="72" rx="14" ry="10" fill="#FFF3E8" />

      {/* Fawn Spots */}
      <circle cx="42" cy="62" r="1.8" fill="#FFF9F2" />
      <circle cx="48" cy="60" r="2.0" fill="#FFF9F2" />
      <circle cx="56" cy="63" r="1.8" fill="#FFF9F2" />
      <circle cx="62" cy="68" r="1.8" fill="#FFF9F2" />
      <circle cx="38" cy="68" r="1.6" fill="#FFF9F2" />

      {/* Head */}
      <path
        d="M34 32 Q49 24 64 32 Q68 48 58 56 Q49 60 40 56 Q30 48 34 32 Z"
        fill="#B87B47"
      />

      {/* Muzzle */}
      <ellipse cx="49" cy="52" rx="9" ry="7" fill="#FFF3E8" />
      <ellipse cx="49" cy="48" rx="3" ry="2.2" fill="#2B1E16" />

      {/* Gentle Big Eyes */}
      <circle cx="40" cy="38" r="4" fill="#2B1E16" />
      <circle cx="39" cy="37" r="1.5" fill="#FFFFFF" />
      <circle cx="58" cy="38" r="4" fill="#2B1E16" />
      <circle cx="57" cy="37" r="1.5" fill="#FFFFFF" />

      {/* Legs */}
      <rect x="36" y="80" width="5" height="12" rx="2.5" fill="#8C5728" />
      <rect x="58" y="80" width="5" height="12" rx="2.5" fill="#8C5728" />
    </svg>
  );
}

// 4. Bramble the Spiny Hedgehog
export function HedgehogArt({ className = "w-16 h-16", mood = "happy" }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Spines / Quills Back */}
      <path
        d="M18 58 Q14 36 34 26 Q54 18 74 30 Q88 42 84 64 Q78 80 48 82 Q22 80 18 58 Z"
        fill="#5A4434"
      />
      {/* Quill texture spikes */}
      <path
        d="M22 42 L16 38 L25 35 L22 28 L32 30 L36 20 L45 27 L52 17 L58 26 L68 18 L71 28 L82 24 L80 34 L90 36 L84 46 L92 52 L82 58 L88 66 L78 70"
        stroke="#7A604D"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Face & Belly */}
      <path
        d="M30 50 Q36 40 48 42 Q60 44 64 54 Q66 66 58 74 Q46 78 36 74 Q26 70 30 50 Z"
        fill="#D6BA9D"
      />

      {/* Pointy Snout */}
      <path d="M30 56 L18 58 L28 64 Z" fill="#D6BA9D" />
      <circle cx="17" cy="58" r="2.5" fill="#2B1E16" />

      {/* Eye */}
      <circle cx="34" cy="52" r="3.2" fill="#2B1E16" />
      <circle cx="33" cy="51" r="1.0" fill="#FFFFFF" />

      {/* Small Ear */}
      <ellipse cx="44" cy="46" rx="3.5" ry="4.5" fill="#B59678" />

      {/* Little Paws */}
      <ellipse cx="34" cy="78" rx="4" ry="2.5" fill="#B59678" />
      <ellipse cx="54" cy="78" rx="4" ry="2.5" fill="#B59678" />
    </svg>
  );
}

// 5. Hoot the Forest Barn Owl
export function OwlArt({ className = "w-16 h-16", mood = "happy" }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Perch Branch */}
      <path d="M12 82 Q48 78 88 84" stroke="#5C3B1E" strokeWidth="6" strokeLinecap="round" />

      {/* Body & Wings */}
      <ellipse cx="50" cy="54" rx="24" ry="28" fill="#7A5636" />
      <ellipse cx="50" cy="58" rx="16" ry="20" fill="#FFF6EB" />

      {/* Feather patterns on chest */}
      <path d="M44 54 Q47 57 50 54 Q53 57 56 54" stroke="#C49B72" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M42 62 Q46 65 50 62 Q54 65 58 62" stroke="#C49B72" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M45 70 Q48 73 51 70 Q54 73 57 70" stroke="#C49B72" strokeWidth="1.8" strokeLinecap="round" fill="none" />

      {/* Heart-Shaped Face Disk */}
      <path
        d="M32 30 C32 20, 48 24, 50 32 C52 24, 68 20, 68 30 C68 44, 58 50, 50 50 C42 50, 32 44, 32 30 Z"
        fill="#FFF9F2"
        stroke="#C49B72"
        strokeWidth="1.5"
      />

      {/* Big Wise Amber Eyes */}
      <circle cx="41" cy="33" r="6" fill="#F59E0B" />
      <circle cx="41" cy="33" r="3.5" fill="#1E1711" />
      <circle cx="40" cy="32" r="1.2" fill="#FFFFFF" />

      <circle cx="59" cy="33" r="6" fill="#F59E0B" />
      <circle cx="59" cy="33" r="3.5" fill="#1E1711" />
      <circle cx="58" cy="32" r="1.2" fill="#FFFFFF" />

      {/* Beak */}
      <polygon points="48,37 52,37 50,44" fill="#D97706" />

      {/* Talons grasping branch */}
      <circle cx="42" cy="80" r="3" fill="#D97706" />
      <circle cx="46" cy="80" r="3" fill="#D97706" />
      <circle cx="54" cy="80" r="3" fill="#D97706" />
      <circle cx="58" cy="80" r="3" fill="#D97706" />
    </svg>
  );
}

// 6. Generic animal icon dispatcher
export function AnimalIcon({ species, className = "w-12 h-12" }) {
  const s = String(species || "").toLowerCase();
  if (s.includes("fox")) return <FoxArt className={className} />;
  if (s.includes("rabbit") || s.includes("hare")) return <RabbitArt className={className} />;
  if (s.includes("deer") || s.includes("fawn")) return <DeerArt className={className} />;
  if (s.includes("hedgehog")) return <HedgehogArt className={className} />;
  if (s.includes("owl") || s.includes("bird")) return <OwlArt className={className} />;
  return <FoxArt className={className} />;
}
