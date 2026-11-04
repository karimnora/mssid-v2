import React, { useId } from 'react';
import { motion } from 'motion/react';

/**
 * « Quest » look of the Didou missions (V2, maquette B + C): the mission is an island whose stops
 * are the scenes, Didou walks from stop to stop, a treasure chest waits at the end; inside a stop a
 * coach keeps the streak, offers a three-rung help ladder and celebrates with a burst of stars.
 * Pure SVG + motion: crisp on any phone, offline, and reduced-motion friendly (see mission.css).
 */

const sid = (raw: string) => raw.replace(/[^a-zA-Z0-9_-]/g, '');

export type StopState = 'done' | 'now' | 'todo';
export interface IslandStop {
  id: string;
  state: StopState;
  challenge: boolean;
  /** Solved at the first try (gold) or with help (silver). */
  clean?: boolean;
}

const W = 360;
const H = 150;

/** Stops along a winding path, right to left (the child reads from the right). */
function stopPoint(i: number, count: number) {
  const span = W - 76;
  const x = W - 38 - (count <= 1 ? 0 : (i * span) / (count - 1));
  const y = 82 + Math.sin(i * 1.15 + 0.4) * 30;
  return { x, y };
}

function pathThrough(points: { x: number; y: number }[]) {
  if (points.length === 0) return '';
  let d = `M${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const mx = (a.x + b.x) / 2;
    d += ` C${mx} ${a.y} ${mx} ${b.y} ${b.x} ${b.y}`;
  }
  return d;
}

export function DidouHead({ size = 44, mood = 'happy' }: { size?: number; mood?: 'happy' | 'think' | 'talk' }) {
  const g = sid(useId());
  return (
    <svg width={size} height={size} viewBox="0 0 88 88" aria-hidden="true">
      <defs>
        <radialGradient id={`${g}f`} cx=".35" cy=".3" r=".9">
          <stop offset="0" stopColor="#ffd08a" />
          <stop offset=".55" stopColor="#f59a3c" />
          <stop offset="1" stopColor="#b85e12" />
        </radialGradient>
      </defs>
      <path d="M20 50 L10 8 L40 32Z" fill={`url(#${g}f)`} />
      <path d="M22 44 L15 15 L36 32Z" fill="#ffc7a8" />
      <path d="M68 50 L78 8 L48 32Z" fill={`url(#${g}f)`} />
      <path d="M66 44 L73 15 L52 32Z" fill="#ffc7a8" />
      <ellipse cx="44" cy="54" rx="28" ry="25" fill={`url(#${g}f)`} />
      <path d="M25 61 Q44 86 63 61 Q55 53 44 55 Q33 53 25 61Z" fill="#fff3df" />
      {mood === 'happy' ? (
        <>
          <path d="M29 51 q4.5 -5.5 9 0" stroke="#1b1440" strokeWidth="2.8" fill="none" strokeLinecap="round" />
          <path d="M50 51 q4.5 -5.5 9 0" stroke="#1b1440" strokeWidth="2.8" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="34" cy="50" rx="4" ry="5.2" fill="#1b1440" />
          <ellipse cx="54" cy="50" rx="4" ry="5.2" fill="#1b1440" />
          <circle cx="35.5" cy="48" r="1.5" fill="#fff" />
          <circle cx="55.5" cy="48" r="1.5" fill="#fff" />
        </>
      )}
      <ellipse cx="44" cy="62" rx="4" ry="2.9" fill="#1b1440" />
      {mood === 'think' ? (
        <path d="M38 70 H50" stroke="#1b1440" strokeWidth="2.4" strokeLinecap="round" />
      ) : (
        <path d="M37 68 Q44 76 51 68" stroke="#1b1440" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      )}
      <ellipse cx="32" cy="38" rx="7" ry="4" fill="#fff" opacity=".35" transform="rotate(-25 32 38)" />
    </svg>
  );
}

/** The island strip on top of the mission: where we are, what is done, the chest at the end. */
export function MissionIsland({ stops, finished, didouMood }: { stops: IslandStop[]; finished: boolean; didouMood: 'happy' | 'think' | 'talk' }) {
  const g = sid(useId());
  const count = stops.length + 1; // + the chest
  const points = Array.from({ length: count }, (_, i) => stopPoint(i, count));
  const nowIndex = finished ? count - 1 : Math.max(0, stops.findIndex((s) => s.state === 'now'));
  const here = points[nowIndex];
  const chest = points[count - 1];
  const done = stops.filter((s) => s.state === 'done').length;
  return (
    <div className="mission-island" data-mission-island={`${done}/${stops.length}`}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={`جزيرة المهمة: ${done} محطة من ${stops.length}`}>
        <defs>
          <linearGradient id={`${g}sea`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#38bdf8" />
            <stop offset="1" stopColor="#1d4ed8" />
          </linearGradient>
          <radialGradient id={`${g}isle`} cx=".45" cy=".3" r=".8">
            <stop offset="0" stopColor="#a3e86f" />
            <stop offset=".6" stopColor="#4fb544" />
            <stop offset="1" stopColor="#2c7a2b" />
          </radialGradient>
          <linearGradient id={`${g}cliff`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e9c27e" />
            <stop offset="1" stopColor="#9a6a2e" />
          </linearGradient>
          <linearGradient id={`${g}road`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff0c4" />
            <stop offset="1" stopColor="#f3cc7f" />
          </linearGradient>
          <radialGradient id={`${g}gold`} cx=".35" cy=".3" r=".8">
            <stop offset="0" stopColor="#fff6b8" />
            <stop offset=".55" stopColor="#ffc21a" />
            <stop offset="1" stopColor="#a86a00" />
          </radialGradient>
          <radialGradient id={`${g}silver`} cx=".35" cy=".3" r=".8">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset=".6" stopColor="#cbd5e1" />
            <stop offset="1" stopColor="#64748b" />
          </radialGradient>
          <radialGradient id={`${g}stone`} cx=".35" cy=".3" r=".8">
            <stop offset="0" stopColor="#f1f5f9" />
            <stop offset="1" stopColor="#94a3b8" />
          </radialGradient>
          <radialGradient id={`${g}glow`} cx=".5" cy=".5" r=".5">
            <stop offset="0" stopColor="#fff7b0" stopOpacity=".95" />
            <stop offset="1" stopColor="#fff7b0" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${g}chest`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c97c36" />
            <stop offset="1" stopColor="#6b3a10" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} rx="26" fill={`url(#${g}sea)`} />
        <g className="mission-waves" fill="none" stroke="#ffffff" strokeOpacity=".45" strokeWidth="2.4" strokeLinecap="round">
          <path d="M16 24 q8 -5 16 0 t16 0" />
          <path d="M300 18 q8 -5 16 0 t16 0" />
          <path d="M150 136 q8 -5 16 0 t16 0" />
        </g>
        <path d="M14 84 Q10 34 80 30 Q180 20 290 30 Q352 36 348 86 Q346 132 270 134 Q180 140 80 136 Q18 132 14 84Z" fill={`url(#${g}cliff)`} />
        <path d="M18 80 Q14 36 82 32 Q180 22 288 32 Q346 38 343 82 Q340 124 268 126 Q180 132 82 128 Q22 124 18 80Z" fill={`url(#${g}isle)`} />
        <g transform="translate(44 50)" aria-hidden="true">
          <rect x="-2.5" y="-24" width="5" height="26" rx="2.5" fill="#7a4a1e" />
          <path d="M0 -24 q-14 -5 -20 5 M0 -24 q14 -5 20 5 M0 -24 q-8 -12 -17 -11 M0 -24 q8 -12 17 -11" stroke="#2c7a2b" strokeWidth="5.5" strokeLinecap="round" fill="none" />
        </g>
        <path d={pathThrough(points)} fill="none" stroke="#c9963f" strokeWidth="15" strokeLinecap="round" />
        <path d={pathThrough(points)} fill="none" stroke={`url(#${g}road)`} strokeWidth="10" strokeLinecap="round" />
        <path d={pathThrough(points.slice(0, nowIndex + 1))} fill="none" stroke="#ffffff" strokeWidth="2.6" strokeDasharray="2 7" strokeLinecap="round" />

        {stops.map((stop, i) => {
          const p = points[i];
          const fill = stop.state === 'done' ? (stop.clean === false ? `url(#${g}silver)` : `url(#${g}gold)`) : stop.state === 'now' ? `url(#${g}gold)` : `url(#${g}stone)`;
          return (
            <g key={stop.id} transform={`translate(${p.x} ${p.y})`} data-stop={stop.state}>
              {stop.state === 'now' && <circle className="mission-stop-glow" r="22" fill={`url(#${g}glow)`} />}
              <ellipse cy="7" rx="13" ry="5" fill="#1d4d1c" opacity=".35" />
              <ellipse cy="3" rx="12" ry="5" fill={stop.state === 'todo' ? '#64748b' : '#a86a00'} />
              <ellipse cy="0" rx="12" ry="5" fill={fill} />
              {stop.state === 'done' && <path d="M-4.5 -0.5 l3 3 6 -6" stroke="#ffffff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />}
              {stop.challenge && stop.state !== 'done' && (
                <path d="M0 -15 l2.4 4.9 5.4 .8 -3.9 3.8 .9 5.4 -4.8 -2.5 -4.8 2.5 .9 -5.4 -3.9 -3.8 5.4 -.8z" fill="#ffd23f" stroke="#a86a00" strokeWidth=".9" />
              )}
            </g>
          );
        })}

        <g transform={`translate(${chest.x} ${chest.y - 4})`} data-mission-chest={finished ? 'open' : 'closed'}>
          {finished && <circle className="mission-stop-glow" r="26" fill={`url(#${g}glow)`} />}
          <ellipse cy="12" rx="16" ry="5" fill="#1d4d1c" opacity=".35" />
          <path d="M-14 -2 H14 V11 H-14Z" fill={`url(#${g}chest)`} />
          <motion.g initial={false} animate={finished ? { rotate: -38, y: -4 } : { rotate: 0, y: 0 }} style={{ transformOrigin: '14px -2px', transformBox: 'view-box' }}>
            <path d="M-14 -2 Q0 -16 14 -2Z" fill="#9a5520" />
            <rect x="-14" y="-4" width="28" height="3.5" fill="#ffc21a" />
          </motion.g>
          <rect x="-3" y="-2" width="6" height="7" rx="1.5" fill="#ffc21a" />
          {finished && (
            <g className="mission-chest-sparkles" fill="#fff7b0">
              <circle cx="-8" cy="-14" r="2" />
              <circle cx="7" cy="-18" r="1.6" />
              <circle cx="0" cy="-22" r="2.4" />
            </g>
          )}
        </g>

        <motion.g initial={false} animate={{ x: here.x, y: here.y - 30 }} transition={{ type: 'spring', stiffness: 120, damping: 14 }}>
          <g transform="translate(-19 -19)">
            <g className="mission-didou-token">
              <DidouHead size={38} mood={didouMood} />
            </g>
          </g>
        </motion.g>
      </svg>
    </div>
  );
}

/** Coach strip: right answers in a row (first try, no help) and the stars of the final challenge. */
export function CoachStrip({ streak, stars }: { streak: number; stars: number }) {
  return (
    <div className="mission-coach" aria-live="polite">
      <motion.span key={streak} initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="mission-streak" data-mission-streak={streak} role="img" aria-label={`${streak} إجابات صحيحة متتالية`}>
        <svg width="20" height="24" viewBox="0 0 22 26" aria-hidden="true">
          <path d="M11 1c2 5 8 7 8 14a8 8 0 0 1-16 0c0-4 2-6 4-8 0 3 1 4 3 5-1-4 0-8 1-11z" fill={streak > 0 ? '#ff8800' : '#94a3b8'} />
          <path d="M11 13c1 3 4 4 4 7a4 4 0 0 1-8 0c0-2 1-3 2-4 0 1 1 2 2 2 0-2 0-3 0-5z" fill={streak > 0 ? '#ffd23f' : '#e2e8f0'} />
        </svg>
        <span>× {streak}</span>
      </motion.span>
      <span className="mission-coach-stars" role="img" aria-label={`${stars} نجوم من 3`}>
        {[0, 1, 2].map((i) => (
          <svg key={i} width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2l3 6.5 7 .8-5.2 4.8 1.4 7L12 17.6 5.8 21l1.4-7L2 9.3l7-.8z" fill={i < stars ? '#ffc21a' : 'rgba(255,255,255,.25)'} stroke={i < stars ? '#a86a00' : 'rgba(255,255,255,.4)'} strokeWidth="1.2" />
          </svg>
        ))}
      </span>
    </div>
  );
}

/** Three rungs: an idea, a worked example, the steps. Each rung opened counts as help (notebook). */
export function HintLadder({ rungs, opened, onOpen }: { rungs: { label: string; text: string }[]; opened: number; onOpen: (rung: number) => void }) {
  if (rungs.length === 0) return null;
  return (
    <div className="mission-ladder" data-mission-ladder={opened}>
      <p className="mission-ladder-title">
        <svg width="16" height="18" viewBox="0 0 20 22" aria-hidden="true">
          <path d="M10 1a7 7 0 0 0-4 12.7V16h8v-2.3A7 7 0 0 0 10 1z" fill="#ffd23f" />
          <rect x="6" y="17" width="8" height="3" rx="1.5" fill="#94a3b8" />
        </svg>
        سُلَّمُ المُسَاعَدَةِ
      </p>
      <div className="mission-ladder-rungs">
        {rungs.map((rung, i) => (
          <button
            key={rung.label}
            type="button"
            data-mission-rung={i + 1}
            disabled={i > opened}
            aria-pressed={i < opened}
            onClick={() => onOpen(i + 1)}
            className={`mission-rung ${i < opened ? 'open' : ''}`}
          >
            {i + 1} · {rung.label}
          </button>
        ))}
      </div>
      {opened > 0 && (
        <motion.p key={opened} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mission-ladder-text">
          {rungs[opened - 1].text}
        </motion.p>
      )}
    </div>
  );
}

/** A 3D cardboard box (group items). */
export function Box3d({ label }: { label: number }) {
  const g = sid(useId());
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">
      <defs>
        <linearGradient id={`${g}t`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff3d6" />
          <stop offset="1" stopColor="#f0cf93" />
        </linearGradient>
        <linearGradient id={`${g}f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e9b25f" />
          <stop offset="1" stopColor="#b9782a" />
        </linearGradient>
      </defs>
      <path d="M4 14 L14 6 H40 L30 14Z" fill={`url(#${g}t)`} />
      <path d="M4 14 H30 V40 H4Z" fill={`url(#${g}f)`} />
      <path d="M30 14 L40 6 V32 L30 40Z" fill="#a1621f" />
      <path d="M13 6 L5 14 M22 6 L16 14" stroke="#d9a65a" strokeWidth="1.2" />
      <text x="17" y="32" textAnchor="middle" fontFamily="Cairo, sans-serif" fontWeight="900" fontSize="13" fill="#ffffff">{label}</text>
    </svg>
  );
}

/** A Deglet Nour date, glossy brown (heap of the division mission). */
export function Date3d() {
  const g = sid(useId());
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true" className="mission-date">
      <defs>
        <radialGradient id={`${g}d`} cx=".35" cy=".3" r=".8">
          <stop offset="0" stopColor="#d08a4e" />
          <stop offset=".6" stopColor="#7a3414" />
          <stop offset="1" stopColor="#3f1806" />
        </radialGradient>
      </defs>
      <ellipse cx="10" cy="7" rx="9" ry="5.6" fill={`url(#${g}d)`} />
      <ellipse cx="6.5" cy="4.6" rx="3" ry="1.4" fill="#fff" opacity=".45" />
      <path d="M18.4 6.4 q1.4 -.6 1.2 -2" stroke="#e9c27e" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** Stars and sparkles flying out of a right answer. */
export function StarBurst({ burst }: { burst: number }) {
  if (!burst) return null;
  return (
    <span key={burst} className="mission-burst" aria-hidden="true">
      {Array.from({ length: 10 }).map((_, i) => {
        const angle = (i / 10) * Math.PI * 2;
        const distance = 70 + (i % 3) * 22;
        return (
          <motion.svg
            key={i}
            width={i % 2 ? 16 : 22}
            height={i % 2 ? 16 : 22}
            viewBox="0 0 24 24"
            className="mission-burst-piece"
            initial={{ opacity: 1, x: 0, y: 0, scale: 0.3, rotate: 0 }}
            animate={{ opacity: 0, x: Math.cos(angle) * distance, y: Math.sin(angle) * distance - 20, scale: 1.1, rotate: i % 2 ? 160 : -160 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          >
            {i % 2 ? (
              <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10Z" fill="#ffffff" />
            ) : (
              <path d="M12 2l3 6.5 7 .8-5.2 4.8 1.4 7L12 17.6 5.8 21l1.4-7L2 9.3l7-.8z" fill={i % 4 === 0 ? '#ffc21a' : '#4ade80'} />
            )}
          </motion.svg>
        );
      })}
    </span>
  );
}

/** The end of the mission: the chest opens, the stars land one by one, the XP and the gold. */
export function TreasureEnd({ stars, xp }: { stars: number; xp: number }) {
  const g = sid(useId());
  return (
    <div className="mission-treasure">
      <svg width="150" height="120" viewBox="0 0 150 120" role="img" aria-label="صندوق الكنز مفتوح">
        <defs>
          <radialGradient id={`${g}glow`} cx=".5" cy=".5" r=".5">
            <stop offset="0" stopColor="#fff7b0" stopOpacity=".95" />
            <stop offset="1" stopColor="#fff7b0" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${g}wood`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c97c36" />
            <stop offset="1" stopColor="#6b3a10" />
          </linearGradient>
          <radialGradient id={`${g}coin`} cx=".35" cy=".3" r=".8">
            <stop offset="0" stopColor="#fff6b8" />
            <stop offset=".6" stopColor="#ffc21a" />
            <stop offset="1" stopColor="#a86a00" />
          </radialGradient>
        </defs>
        <circle cx="75" cy="58" r="56" fill={`url(#${g}glow)`} className="mission-stop-glow" />
        <ellipse cx="75" cy="108" rx="46" ry="8" fill="#0b1240" opacity=".3" />
        <path d="M33 62 H117 V102 H33Z" fill={`url(#${g}wood)`} />
        <rect x="33" y="74" width="84" height="6" fill="#ffc21a" />
        <rect x="68" y="66" width="14" height="18" rx="3" fill="#ffc21a" />
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.circle
            key={i}
            cx={52 + i * 11}
            cy={62}
            r="7"
            fill={`url(#${g}coin)`}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: [-2, -34 - (i % 2) * 10, -14], opacity: [0, 1, 1] }}
            transition={{ delay: 0.35 + i * 0.08, duration: 0.8, ease: 'easeOut' }}
          />
        ))}
        <motion.g initial={{ rotate: 0 }} animate={{ rotate: -32 }} transition={{ delay: 0.15, type: 'spring', stiffness: 90, damping: 9 }} style={{ transformOrigin: '117px 62px', transformBox: 'view-box' }}>
          <path d="M33 62 Q75 26 117 62Z" fill="#9a5520" />
          <rect x="33" y="58" width="84" height="6" fill="#ffc21a" />
        </motion.g>
      </svg>
      <div className="flex justify-center gap-2" role="img" aria-label={`${stars} / 3`}>
        {[0, 1, 2].map((i) => (
          <motion.svg key={i} width="54" height="54" viewBox="0 0 24 24" initial={{ scale: 0, rotate: -60 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.8 + i * 0.25, type: 'spring', stiffness: 220, damping: 12 }} aria-hidden="true">
            <path d="M12 2l3 6.5 7 .8-5.2 4.8 1.4 7L12 17.6 5.8 21l1.4-7L2 9.3l7-.8z" fill={i < stars ? '#ffc21a' : '#e2e8f0'} stroke={i < stars ? '#a86a00' : '#cbd5e1'} strokeWidth="1" />
          </motion.svg>
        ))}
      </div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} className="text-lg font-black text-slate-900">+{xp} XP</motion.p>
    </div>
  );
}
