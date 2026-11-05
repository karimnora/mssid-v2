import React from 'react';
import type { JourneyWorldId } from '../../data/journey/journeyWorlds';
import { WORLD_DECOR } from '../world/worldArt';

/*
 * Vector backdrops of the journey worlds. Each world is drawn in its own 1600 × 900 box; the map
 * translates it into place. Everything is original artwork, kept flat and light so a mid-range
 * Android phone can scroll the whole map; the worlds listed in WORLD_DECOR use their painted decor.
 */

function seeded(seed: number) {
  let s = seed;
  return () => (s = (s * 9301 + 49297) % 233280) / 233280;
}

const SPACE_STARS = (() => {
  const rnd = seeded(5);
  return Array.from({ length: 130 }, () => ({ x: rnd() * 1600, y: rnd() * 900, r: 1.5 + rnd() * 3, warm: rnd() < 0.2 }));
})();

/* ---------- gradients shared by the backdrops and the seams ---------- */

export const WORLD_SKY: Record<JourneyWorldId, { id: string; height: number }> = {
  sahara: { id: 'jw-sky-sahara', height: 560 },
  casbah: { id: 'jw-sky-casbah', height: 560 },
  sea: { id: 'jw-sky-sea', height: 470 },
  constantine: { id: 'jw-sky-constantine', height: 540 },
  djurdjura: { id: 'jw-sky-djurdjura', height: 560 },
  timgad: { id: 'jw-sky-timgad', height: 560 },
  tassili: { id: 'jw-sky-tassili', height: 600 },
  space: { id: 'jw-sky-space', height: 900 },
};

function vGrad(id: string, stops: Array<[number, string]>) {
  return (
    <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
      {stops.map(([o, c]) => (
        <stop key={o} offset={o} stopColor={c} />
      ))}
    </linearGradient>
  );
}

export function JourneySceneryDefs() {
  return (
    <>
      {vGrad('jw-sky-sahara', [[0, '#9fbde0'], [0.6, '#f6d2a6']])}
      {vGrad('jw-sky-casbah', [[0, '#5fa9f0'], [1, '#d6ebfd']])}
      {vGrad('jw-sky-sea', [[0, '#8ec5f0'], [1, '#e4f3fc']])}
      {vGrad('jw-sky-constantine', [[0, '#7fc4f0'], [1, '#f3fbff']])}
      {vGrad('jw-sky-djurdjura', [[0, '#5d97d8'], [0.6, '#d3e6f4']])}
      {vGrad('jw-sky-timgad', [[0, '#86aed4'], [0.7, '#f3cf9f']])}
      {vGrad('jw-sky-tassili', [[0, '#26236e'], [0.55, '#8b4f8e'], [1, '#f0955e']])}
      {vGrad('jw-sky-space', [[0, '#070a30'], [1, '#2b1466']])}
      <linearGradient id="jw-comet" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset="1" stopColor="#fff" />
      </linearGradient>
      {/* Painted decors fade out on their left and right edges, so two worlds never meet on a hard line. */}
      <linearGradient id="jw-paint-edge" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#000" />
        <stop offset=".1" stopColor="#fff" />
        <stop offset=".9" stopColor="#fff" />
        <stop offset="1" stopColor="#000" />
      </linearGradient>
      <mask id="jw-paint-fade" maskContentUnits="objectBoundingBox">
        <rect width="1" height="1" fill="url(#jw-paint-edge)" />
      </mask>
      <linearGradient id="jw-hfade" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff" />
        <stop offset="1" stopColor="#000" />
      </linearGradient>
    </>
  );
}

/* ---------- worlds ---------- */

function Space() {
  return (
    <g>
      <rect width="1600" height="900" fill="url(#jw-sky-space)" />
      <circle cx="380" cy="640" r="260" fill="#8a3bd6" opacity=".18" />
      <circle cx="1200" cy="300" r="220" fill="#ec2e86" opacity=".14" />
      {SPACE_STARS.map((s, i) => (
        <circle key={i} className={i % 4 ? undefined : 'journey-twinkle'} style={i % 4 ? undefined : { animationDelay: `-${(i % 7) * 0.4}s` }} cx={s.x} cy={s.y} r={s.r} fill={s.warm ? '#ffe9a8' : '#fff'} />
      ))}
      <g transform="translate(1150 200)">
        <ellipse rx="150" ry="34" fill="none" stroke="#ffd9a0" strokeWidth="12" transform="rotate(-14)" />
        <circle r="86" fill="#f2a65a" />
        <path d="M-80 -20 Q0 -6 82 -30 M-84 16 Q0 30 84 6" stroke="#d9823c" strokeWidth="10" fill="none" />
      </g>
      <g transform="translate(330 170)">
        <circle r="70" fill="#e8e6f5" />
        <circle cx="-22" cy="-16" r="14" fill="#c9c5e0" />
        <circle cx="24" cy="12" r="18" fill="#c9c5e0" />
        <circle cx="-10" cy="34" r="9" fill="#c9c5e0" />
      </g>
      <g transform="translate(760 790)">
        <circle r="54" fill="#2f8cff" />
        <path d="M-40 -20 Q-10 -40 10 -20 Q20 0 0 10 Q-30 14 -40 -20Z M14 20 Q34 10 44 24 Q30 44 14 36Z" fill="#59c26a" />
      </g>
      <path d="M1450 640 L1300 720" stroke="url(#jw-comet)" strokeWidth="16" strokeLinecap="round" />
      <circle cx="1450" cy="640" r="14" fill="#fff" />
    </g>
  );
}

/** Vector backdrops of the worlds without a painted decor yet. */
const BACKDROPS: Partial<Record<JourneyWorldId, () => React.ReactElement>> = {
  space: Space,
};

/** A painted world (components/world/worldArt.ts), over its sky gradient so the seams still blend. */
function PaintedBackdrop({ id }: { id: JourneyWorldId }) {
  const decor = WORLD_DECOR[id]!;
  return (
    <g>
      <rect width="1600" height="900" fill={`url(#${WORLD_SKY[id].id})`} />
      <image href={decor.landscape} x="0" y={decor.mapOffsetY ?? 0} width="1600" height="893" preserveAspectRatio="none" mask="url(#jw-paint-fade)" />
    </g>
  );
}

export const WorldBackdrop = React.memo(function WorldBackdrop({ id }: { id: JourneyWorldId }) {
  if (WORLD_DECOR[id]) return <PaintedBackdrop id={id} />;
  const Backdrop = BACKDROPS[id]!;
  return <Backdrop />;
});
