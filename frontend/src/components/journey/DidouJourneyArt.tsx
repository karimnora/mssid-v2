import React from 'react';

/** Didou the fennec (big ears, green scarf) as drawn for the journey map and planet hub. */
function HeadShapes() {
  return (
    <>
      <path d="M-22 -52 L-122 -150 Q-128 -64 -74 -24 Z" fill="#f0b36b" />
      <path d="M-36 -54 L-108 -128 Q-110 -70 -74 -38 Z" fill="#ffc9b0" />
      <path d="M22 -52 L122 -150 Q128 -64 74 -24 Z" fill="#f0b36b" />
      <path d="M36 -54 L108 -128 Q110 -70 74 -38 Z" fill="#ffc9b0" />
      <ellipse cx="0" cy="0" rx="84" ry="70" fill="#f0b36b" />
      <path d="M-62 12 Q-42 -20 0 -18 Q42 -20 62 12 Q52 64 0 68 Q-52 64 -62 12Z" fill="#fff3df" />
      <g className="journey-eye">
        <ellipse cx="-32" cy="-12" rx="18" ry="22" fill="#fff" stroke="#3a2418" strokeWidth="2.5" />
        <circle cx="-29" cy="-8" r="12" fill="#2b1a12" />
        <circle cx="-25" cy="-13" r="4.5" fill="#fff" />
      </g>
      <g className="journey-eye">
        <ellipse cx="32" cy="-12" rx="18" ry="22" fill="#fff" stroke="#3a2418" strokeWidth="2.5" />
        <circle cx="35" cy="-8" r="12" fill="#2b1a12" />
        <circle cx="39" cy="-13" r="4.5" fill="#fff" />
      </g>
      <ellipse cx="-54" cy="22" rx="12" ry="7" fill="#ff9e8a" opacity=".65" />
      <ellipse cx="54" cy="22" rx="12" ry="7" fill="#ff9e8a" opacity=".65" />
      <ellipse cx="0" cy="18" rx="13" ry="9" fill="#3a2418" />
      <path d="M-18 33 Q0 52 18 33" stroke="#3a2418" strokeWidth="5" fill="#7a2e2a" strokeLinecap="round" />
    </>
  );
}

type SvgProps = Omit<React.SVGProps<SVGSVGElement>, 'viewBox'>;

export function DidouHead(props: SvgProps) {
  return (
    <svg viewBox="-135 -160 270 235" aria-hidden="true" {...props}>
      <HeadShapes />
    </svg>
  );
}

export function DidouFull(props: SvgProps) {
  return (
    <svg viewBox="-140 -380 300 395" aria-hidden="true" {...props}>
      <ellipse cx="0" cy="2" rx="70" ry="12" fill="rgba(0,0,30,.3)" />
      <g className="journey-tail">
        <path d="M34 -72 C 90 -82 140 -122 150 -176 C 158 -216 130 -232 112 -206 C 100 -160 70 -122 28 -102 Z" fill="#e7a160" />
        <path d="M150 -176 C 158 -216 130 -232 112 -206 C 120 -190 136 -182 150 -176Z" fill="#fff3df" />
      </g>
      <rect x="-44" y="-62" width="32" height="60" rx="16" fill="#e7a160" />
      <rect x="12" y="-62" width="32" height="60" rx="16" fill="#e7a160" />
      <ellipse cx="-28" cy="-4" rx="25" ry="12" fill="#fff3df" />
      <ellipse cx="28" cy="-4" rx="25" ry="12" fill="#fff3df" />
      <ellipse cx="0" cy="-106" rx="60" ry="62" fill="#f0b36b" />
      <ellipse cx="0" cy="-96" rx="38" ry="44" fill="#fff3df" />
      <ellipse cx="-58" cy="-110" rx="16" ry="34" fill="#e7a160" transform="rotate(18 -58 -110)" />
      <ellipse cx="70" cy="-150" rx="16" ry="34" fill="#e7a160" transform="rotate(-140 70 -150)" />
      <path d="M-54 -160 Q0 -132 54 -160 L52 -140 Q0 -112 -52 -140Z" fill="#0f8a4b" />
      <path d="M16 -140 L30 -94 L48 -100 L36 -144Z" fill="#0f8a4b" />
      <path d="M28 -104 L46 -110" stroke="#fbf6ee" strokeWidth="6" />
      <circle cx="40" cy="-94" r="7" fill="#d6283b" />
      <g transform="translate(0 -218)">
        <HeadShapes />
      </g>
    </svg>
  );
}

export function MedalArt({ color, ...props }: SvgProps & { color: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" {...props}>
      <path d="M30 4 L50 40 L70 4Z" fill="#d6283b" />
      <path d="M40 4 L50 24 L60 4Z" fill="#0f8a4b" />
      <circle cx="50" cy="62" r="32" fill={color} stroke="#fff" strokeWidth="6" />
      <path d="M50 42l6 13 14 2-10 10 2 14-12-7-12 7 2-14-10-10 14-2z" fill="#fff" />
    </svg>
  );
}

export function StarIcon({ on = true, ...props }: SvgProps & { on?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M12 2.2l2.95 6.1 6.7.85-4.95 4.6 1.3 6.6L12 17.1l-6 3.25 1.3-6.6-4.95-4.6 6.7-.85z"
        fill={on ? '#ffd23f' : 'rgba(255,255,255,.25)'}
        stroke={on ? '#c48a00' : 'rgba(255,255,255,.6)'}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
