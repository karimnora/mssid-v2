import React, { useId } from 'react';
import { DidouPortrait } from '../world/DidouPortrait';

/**
 * Didou on the journey map and planet hub: the V2 portrait (components/world/DidouPortrait.tsx),
 * so the child meets the same Didou everywhere (docs/v2-design-monde.md).
 */
type SvgProps = Omit<React.SVGProps<SVGSVGElement>, 'viewBox' | 'ref'>;

export function DidouHead(props: SvgProps) {
  return <DidouPortrait eyesClassName="journey-eye" {...props} />;
}

/** Standing Didou: legs, wagging tail and body under the portrait bust. */
export function DidouFull(props: SvgProps) {
  const fur = `didou-full-fur${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <svg viewBox="-140 -380 300 395" aria-hidden="true" {...props}>
      <defs>
        <linearGradient id={fur} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7923a" />
          <stop offset="1" stopColor="#b44d0d" />
        </linearGradient>
      </defs>
      <ellipse cx="0" cy="2" rx="70" ry="12" fill="rgba(0,0,30,.3)" />
      <g className="journey-tail">
        <path d="M34 -72 C 90 -82 140 -122 150 -176 C 158 -216 130 -232 112 -206 C 100 -160 70 -122 28 -102 Z" fill={`url(#${fur})`} />
        <path d="M150 -176 C 158 -216 130 -232 112 -206 C 120 -190 136 -182 150 -176Z" fill="#fffaf2" />
      </g>
      <rect x="-44" y="-62" width="32" height="60" rx="16" fill="#c9631a" />
      <rect x="12" y="-62" width="32" height="60" rx="16" fill="#c9631a" />
      <ellipse cx="-28" cy="-4" rx="25" ry="12" fill="#fffaf2" />
      <ellipse cx="28" cy="-4" rx="25" ry="12" fill="#fffaf2" />
      <ellipse cx="0" cy="-104" rx="60" ry="62" fill={`url(#${fur})`} />
      <ellipse cx="0" cy="-94" rx="36" ry="44" fill="#f6e3cb" />
      <ellipse cx="-58" cy="-108" rx="16" ry="34" fill="#d86f1f" transform="rotate(18 -58 -108)" />
      <ellipse cx="62" cy="-108" rx="16" ry="34" fill="#d86f1f" transform="rotate(-18 62 -108)" />
      <DidouPortrait x={-100} y={-366} width={200} height={200} eyesClassName="journey-eye" />
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
