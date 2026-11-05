import React from 'react';
import type { JourneyWorldId } from '../../data/journey/journeyWorlds';
import './worldAmbience.css';

/*
 * Life over a painted world decor (components/world/worldArt.ts): drifting clouds, birds, glints
 * on the water, twinkling stars, blowing sand and slow light rays. Drawn in the decor's 1600 × 900
 * box, so the same layer sits on the journey map and behind a journey lesson. CSS transforms and
 * opacity only (cheap on mid-range Android phones); everything stops with prefers-reduced-motion.
 */

type Cloud = [x: number, y: number, size: number];
interface Ambience {
  clouds?: Cloud[];
  /** Height of each bird's flight line. */
  birds?: number[];
  /** Water area [top, bottom] that sparkles. */
  glints?: [number, number];
  /** Night sky area [top, bottom] with twinkling stars. */
  stars?: [number, number];
  /** Ground height where sand blows. */
  dust?: number;
  rays?: boolean;
}

const AMBIENCE: Partial<Record<JourneyWorldId, Ambience>> = {
  sahara: { clouds: [[260, 120, 1], [1000, 80, 0.8], [1380, 150, 0.9]], dust: 800, rays: true },
  casbah: { clouds: [[300, 110, 0.9], [900, 70, 0.7], [1350, 130, 1]], birds: [190, 250] },
  sea: { clouds: [[220, 120, 1], [820, 90, 0.8], [1300, 140, 0.9]], birds: [160, 220, 280], glints: [580, 880] },
  constantine: { clouds: [[300, 100, 0.9], [1200, 130, 1]], birds: [170, 230], rays: true },
  djurdjura: { clouds: [[200, 90, 0.9], [760, 60, 0.8], [1350, 110, 1]], birds: [200, 260] },
  timgad: { clouds: [[320, 110, 0.9], [1150, 90, 0.8]], dust: 820, rays: true },
  tassili: { stars: [30, 300], dust: 800 },
  space: { stars: [40, 860] },
};

function seeded(seed: number) {
  let s = seed;
  return () => (s = (s * 9301 + 49297) % 233280) / 233280;
}

/** Shared gradients; render once per <svg> that shows an ambience. */
export function WorldAmbienceDefs() {
  return (
    <>
      <radialGradient id="wa-cloud">
        <stop offset="0" stopColor="#fff" stopOpacity=".85" />
        <stop offset=".6" stopColor="#fff" stopOpacity=".45" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="wa-ray" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff6dc" stopOpacity=".7" />
        <stop offset="1" stopColor="#fff6dc" stopOpacity="0" />
      </linearGradient>
    </>
  );
}

export const WorldAmbience = React.memo(function WorldAmbience({ id }: { id: JourneyWorldId }) {
  const a = AMBIENCE[id];
  if (!a) return null;
  const rnd = seeded(id.length * 97 + id.charCodeAt(0));
  return (
    <g className="wa" aria-hidden="true" pointerEvents="none">
      {a.rays && (
        <g className="wa-rays">
          <path d="M0 0 L520 0 L1100 900 L760 900Z" fill="url(#wa-ray)" />
          <path d="M260 0 L460 0 L1300 900 L1150 900Z" fill="url(#wa-ray)" className="wa-ray2" />
        </g>
      )}
      {a.stars &&
        Array.from({ length: 22 }, (_, i) => {
          const [top, bottom] = a.stars!;
          return (
            <circle
              key={i}
              className="wa-star"
              cx={rnd() * 1600}
              cy={top + rnd() * (bottom - top)}
              r={1.6 + rnd() * 2.6}
              fill="#fff"
              style={{ animationDelay: `${-rnd() * 4}s`, animationDuration: `${2.4 + rnd() * 2.4}s` }}
            />
          );
        })}
      {a.clouds?.map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
          <g className="wa-cloud" style={{ animationDuration: `${70 + i * 17}s`, animationDelay: `${-i * 23}s` }}>
            <ellipse cx="0" cy="0" rx="150" ry="46" fill="url(#wa-cloud)" />
            <ellipse cx="-70" cy="10" rx="90" ry="34" fill="url(#wa-cloud)" />
            <ellipse cx="80" cy="8" rx="100" ry="36" fill="url(#wa-cloud)" />
          </g>
        </g>
      ))}
      {a.birds?.map((y, i) => (
        <g key={i} transform={`translate(0 ${y})`}>
          <g className="wa-bird" style={{ animationDuration: `${26 + i * 7}s`, animationDelay: `${-i * 9}s` }}>
            <path className="wa-wing" d="M-22 0 Q-11 -10 0 0 Q11 -10 22 0" stroke="#3b4a5a" strokeWidth="3.4" fill="none" strokeLinecap="round" />
          </g>
        </g>
      ))}
      {a.glints &&
        Array.from({ length: 16 }, (_, i) => {
          const [top, bottom] = a.glints!;
          const w = 18 + rnd() * 34;
          return (
            <rect
              key={i}
              className="wa-glint"
              x={rnd() * 1560}
              y={top + rnd() * (bottom - top)}
              width={w}
              height="3"
              rx="1.5"
              fill="#fff"
              style={{ animationDelay: `${-rnd() * 3.2}s` }}
            />
          );
        })}
      {a.dust !== undefined &&
        Array.from({ length: 14 }, (_, i) => (
          <circle
            key={i}
            className="wa-dust"
            cx={rnd() * 1500}
            cy={a.dust! + rnd() * 70}
            r={2 + rnd() * 2.5}
            fill="#fff3d6"
            style={{ animationDelay: `${-rnd() * 7}s`, animationDuration: `${6 + rnd() * 4}s` }}
          />
        ))}
    </g>
  );
});
