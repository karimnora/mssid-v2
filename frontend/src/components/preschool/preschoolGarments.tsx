import React from 'react';

/** Clothing kinds a 3–5 yo must see as different objects, not one reused emoji. */
export type GarmentKind =
  | 'casquette'
  | 'bonnet'
  | 'strawHat'
  | 'raincoat'
  | 'winterCoat'
  | 'tee'
  | 'pajama'
  | 'rainBoots'
  | 'boots'
  | 'sneakers'
  | 'sandals'
  | 'socks'
  | 'scarf'
  | 'shorts'
  | 'swimsuit'
  | 'glasses'
  | 'umbrella'
  | 'water'
  | 'bag';

const EMOJI: Partial<Record<GarmentKind, string>> = {
  casquette: '🧢',
  strawHat: '👒',
  winterCoat: '🧥',
  tee: '👕',
  boots: '👢',
  sneakers: '👟',
  sandals: '🩴',
  socks: '🧦',
  scarf: '🧣',
  shorts: '🩳',
  swimsuit: '🩱',
  glasses: '😎',
  umbrella: '☔',
  water: '💧',
  bag: '🎒',
};

function Svg({ children, size, label }: { children: React.ReactNode; size: number; label: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden
      focusable="false"
      data-garment-svg={label}
    >
      {children}
    </svg>
  );
}

function BonnetSvg({ size }: { size: number }) {
  return (
    <Svg size={size} label="bonnet">
      <circle cx="32" cy="10" r="6" fill="#F8FAFC" />
      <path d="M16 34c0-12 8-20 16-20s16 8 16 20v8H16z" fill="#1D4ED8" />
      <path d="M14 40c0-4 8-6 18-6s18 2 18 6v8c0 3-8 5-18 5s-18-2-18-5z" fill="#DBEAFE" />
      <path d="M18 42h28" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function RaincoatSvg({ size }: { size: number }) {
  return (
    <Svg size={size} label="raincoat">
      <path d="M18 18c4-8 24-8 28 0l6 8-8 4v22H20V30l-8-4z" fill="#EAB308" />
      <path d="M20 18c4-6 20-6 24 0v6H20z" fill="#CA8A04" />
      <rect x="30" y="32" width="4" height="14" rx="2" fill="#A16207" />
    </Svg>
  );
}

function PajamaSvg({ size }: { size: number }) {
  return (
    <Svg size={size} label="pajama">
      <path d="M18 16h10l4 8 4-8h10v22H18z" fill="#6366F1" />
      <path d="M20 38h24v16H20z" fill="#818CF8" />
      <circle cx="28" cy="24" r="2" fill="#FDE68A" />
      <circle cx="36" cy="28" r="1.5" fill="#FDE68A" />
      <path d="M40 20c2 0 3 2 3 3" fill="none" stroke="#FDE68A" strokeWidth="1.6" strokeLinecap="round" />
    </Svg>
  );
}

function RainBootsSvg({ size }: { size: number }) {
  return (
    <Svg size={size} label="rain-boots">
      <path d="M18 16h10v24c0 6-2 10-8 10H14c-3 0-4-3-4-6 0-4 4-6 8-6z" fill="#EAB308" />
      <path d="M36 16h10v24c0 6-2 10-8 10H32c-3 0-4-3-4-6 0-4 4-6 8-6z" fill="#EAB308" />
      <rect x="10" y="50" width="18" height="5" rx="2" fill="#854D0E" />
      <rect x="28" y="50" width="18" height="5" rx="2" fill="#854D0E" />
    </Svg>
  );
}

export function GarmentGlyph({ kind, size = 44 }: { kind: GarmentKind; size?: number }) {
  if (kind === 'bonnet') return <BonnetSvg size={size} />;
  if (kind === 'raincoat') return <RaincoatSvg size={size} />;
  if (kind === 'pajama') return <PajamaSvg size={size} />;
  if (kind === 'rainBoots') return <RainBootsSvg size={size} />;
  return (
    <span className="leading-none select-none" aria-hidden>
      {EMOJI[kind] ?? '👕'}
    </span>
  );
}

export function garmentEmoji(kind: GarmentKind): string | undefined {
  return EMOJI[kind];
}
