import React from 'react';
import type { JourneyWorldId } from '../../data/journey/journeyWorlds';
import { WORLD_DECOR } from '../world/worldArt';

/*
 * Vector backdrops of the journey worlds. Each world is drawn in its own 1600 × 900 box; the map
 * translates it into place. Everything is original artwork, kept flat and light so a mid-range
 * Android phone can scroll the whole map; Constantine uses the pilot's painted decor.
 */

function seeded(seed: number) {
  let s = seed;
  return () => (s = (s * 9301 + 49297) % 233280) / 233280;
}

function Palm({ x, y, h = 160, trunk = '#7a4e2c', leaf = '#2f9a4e' }: { x: number; y: number; h?: number; trunk?: string; leaf?: string }) {
  const tx = x + 12;
  const ty = y - h;
  return (
    <g>
      <path d={`M${x} ${y} C${x - 6} ${y - h * 0.5} ${x + 4} ${y - h * 0.8} ${tx} ${ty}`} stroke={trunk} strokeWidth={h / 12} fill="none" strokeLinecap="round" />
      <g stroke={leaf} strokeWidth={h / 14} fill="none" strokeLinecap="round">
        <path d={`M${tx} ${ty} q-50 -20 -86 18`} />
        <path d={`M${tx} ${ty} q50 -24 90 14`} />
        <path d={`M${tx} ${ty} q-30 -44 -70 -40`} />
        <path d={`M${tx} ${ty} q34 -44 74 -36`} />
        <path d={`M${tx} ${ty} q4 -40 -6 -66`} />
      </g>
      <circle cx={tx - 4} cy={ty + 10} r={h / 22} fill="#8a3b1a" />
      <circle cx={tx + 6} cy={ty + 12} r={h / 22} fill="#8a3b1a" />
    </g>
  );
}

function Cedar({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-6" y="-30" width="12" height="34" fill="#5a3a22" />
      <path d="M-70 -24 H70 L0 -70Z M-56 -60 H56 L0 -104Z M-40 -94 H40 L0 -134Z" fill="#1f6b3a" />
      <path d="M-70 -24 H0 L0 -70Z M-56 -60 H0 L0 -104Z M-40 -94 H0 L0 -134Z" fill="#2a8048" />
    </g>
  );
}

function OliveTree({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-6 0 C-10 -30 4 -50 -2 -80 L8 -80 C12 -50 6 -30 8 0Z" fill="#6b4a2a" />
      <ellipse cx="0" cy="-100" rx="60" ry="36" fill="#7b9b60" />
      <ellipse cx="-30" cy="-112" rx="30" ry="20" fill="#8fae72" />
      <ellipse cx="28" cy="-90" rx="28" ry="18" fill="#6c8c55" />
    </g>
  );
}

function Gull({ x, y }: { x: number; y: number }) {
  return <path d={`M${x} ${y} q12 -12 24 0 q12 -12 24 0`} stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" />;
}

function Clouds({ items }: { items: Array<[number, number, number]> }) {
  return (
    <g fill="#fff" opacity=".9" className="journey-clouds">
      {items.map(([x, y, w], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx={w} ry={w * 0.3} />
          <ellipse cx={x + w * 0.5} cy={y - w * 0.16} rx={w * 0.6} ry={w * 0.3} />
        </g>
      ))}
    </g>
  );
}

/* ---------- pre-computed scenery (deterministic, module-level) ---------- */

const CASBAH_HOUSES = (() => {
  const rnd = seeded(17);
  const hill = (x: number) => 250 + Math.abs(x - 820) * 0.22;
  const out: Array<{ x: number; y: number; w: number; h: number; tone: string; door: boolean; arch: boolean }> = [];
  for (let i = 0; i < 64; i++) {
    const x = 380 + rnd() * 1180;
    const top = hill(x);
    out.push({
      x,
      y: top + rnd() * (580 - top - 40),
      w: 46 + rnd() * 40,
      h: 34 + rnd() * 30,
      tone: ['#fbf6ee', '#f4ede0', '#fffdf8', '#eef3f8'][Math.floor(rnd() * 4)],
      door: rnd() > 0.4,
      arch: rnd() > 0.75,
    });
  }
  return out.sort((a, b) => a.y - b.y);
})();

const SPACE_STARS = (() => {
  const rnd = seeded(5);
  return Array.from({ length: 130 }, () => ({ x: rnd() * 1600, y: rnd() * 900, r: 1.5 + rnd() * 3, warm: rnd() < 0.2 }));
})();

const TASSILI_STARS = (() => {
  const rnd = seeded(23);
  return Array.from({ length: 40 }, () => ({ x: rnd() * 1600, y: rnd() * 300, r: 1 + rnd() * 2 }));
})();

const SEA_WAVES = Array.from({ length: 22 }, (_, i) => ({ x: 60 + ((i * 211) % 1400), y: 520 + ((i * 97) % 340), delay: (i % 5) * 0.6 }));

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
      {vGrad('jw-sky-sahara', [[0, '#ffb85c'], [0.6, '#ffe7b0']])}
      {vGrad('jw-sky-casbah', [[0, '#62b8f0'], [1, '#e3f4ff']])}
      {vGrad('jw-sky-sea', [[0, '#6cc4f0'], [1, '#d9f3ff']])}
      {vGrad('jw-water', [[0, '#38b3e8'], [1, '#0b5da8']])}
      {vGrad('jw-sky-constantine', [[0, '#7fc4f0'], [1, '#f3fbff']])}
      {vGrad('jw-sky-djurdjura', [[0, '#7cc6f5'], [0.6, '#e6f6ff']])}
      {vGrad('jw-sky-timgad', [[0, '#f6b979'], [0.7, '#fff0d6']])}
      {vGrad('jw-sky-tassili', [[0, '#26236e'], [0.55, '#8b4f8e'], [1, '#f0955e']])}
      {vGrad('jw-sky-space', [[0, '#070a30'], [1, '#2b1466']])}
      <linearGradient id="jw-comet" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset="1" stopColor="#fff" />
      </linearGradient>
      <linearGradient id="jw-hfade" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff" />
        <stop offset="1" stopColor="#000" />
      </linearGradient>
    </>
  );
}

/* ---------- worlds ---------- */

function Sahara() {
  return (
    <g>
      <rect width="1600" height="900" fill="url(#jw-sky-sahara)" />
      <circle cx="1250" cy="170" r="140" fill="#fff6c8" opacity=".35" />
      <circle cx="1250" cy="170" r="90" fill="#fff6c8" />
      <g fill="#dc9a66">
        <path d="M0 500 V430 Q40 380 90 400 Q130 330 190 380 Q240 360 280 430 L300 500Z" />
        <path d="M700 500 L716 390 Q690 350 740 344 Q796 340 772 390 L790 500Z" />
        <path d="M1000 500 Q1040 410 1100 430 Q1150 360 1220 420 Q1280 410 1330 500Z" />
      </g>
      <g transform="translate(380 0)">
        <rect x="0" y="420" width="70" height="80" fill="#f6e3c1" />
        <rect x="60" y="400" width="80" height="100" fill="#cfe4f7" />
        <rect x="130" y="430" width="70" height="70" fill="#f8d9e6" />
        <rect x="190" y="410" width="70" height="90" fill="#f3e2b8" />
        <path d="M112 300 L130 300 L142 420 L100 420Z" fill="#f3e2b8" />
        <path d="M106 300 L112 286 L118 300 L124 286 L130 300 L136 286 L136 300Z" fill="#f3e2b8" />
        <g fill="#3b6ea8">
          <rect x="20" y="450" width="12" height="18" rx="6" />
          <rect x="88" y="440" width="12" height="18" rx="6" />
          <rect x="156" y="455" width="12" height="18" rx="6" />
          <rect x="215" y="440" width="12" height="18" rx="6" />
        </g>
      </g>
      <path d="M0 540 Q200 460 420 530 T860 520 T1300 510 T1600 530 V900 H0Z" fill="#f6c46c" />
      <g fill="#b5702e" transform="translate(1090 520)">
        <ellipse cx="0" cy="0" rx="56" ry="26" />
        <ellipse cx="-6" cy="-24" rx="24" ry="20" />
        <path d="M44 -6 Q70 -30 74 -64 L90 -66 Q94 -20 56 10Z" />
        <ellipse cx="88" cy="-66" rx="16" ry="9" />
        <path d="M-40 14 V64 M-24 18 V64 M30 18 V64 M44 14 V64" stroke="#b5702e" strokeWidth="9" strokeLinecap="round" />
      </g>
      <path d="M0 660 Q260 580 560 650 T1160 640 T1600 660 V900 H0Z" fill="#eeac55" />
      <ellipse cx="760" cy="790" rx="160" ry="34" fill="#4fc3e8" />
      <ellipse cx="740" cy="784" rx="100" ry="14" fill="#9fe3ff" />
      <Palm x={630} y={790} h={170} />
      <Palm x={900} y={780} h={140} />
      <Palm x={1480} y={720} h={150} />
      <path d="M0 830 Q300 790 640 830 T1300 820 T1600 830 V900 H0Z" fill="#e39a45" />
    </g>
  );
}

function Casbah() {
  return (
    <g>
      <rect width="1600" height="900" fill="url(#jw-sky-casbah)" />
      <Clouds items={[[300, 120, 90], [1000, 90, 70]]} />
      <Gull x={560} y={170} />
      <Gull x={620} y={200} />
      <rect y="470" width="560" height="120" fill="#3a9fd8" />
      <rect y="470" width="560" height="6" fill="#8fd0f0" />
      <path d="M300 590 Q520 300 820 240 Q1120 300 1600 420 V620 H300Z" fill="#e6dccb" />
      {CASBAH_HOUSES.map((h, i) => (
        <g key={i}>
          <rect x={h.x} y={h.y} width={h.w} height={h.h} fill={h.tone} stroke="#d8cbb4" strokeWidth="1.5" />
          {h.door && <rect x={h.x + h.w / 2 - 5} y={h.y + h.h / 2 - 6} width="10" height="13" rx="5" fill={i % 3 ? '#2f6fe0' : '#0f8a4b'} />}
          {h.arch && <path d={`M${h.x + 6} ${h.y} q${h.w / 2 - 6} -18 ${h.w - 12} 0`} fill="none" stroke="#d8cbb4" strokeWidth="3" />}
        </g>
      ))}
      <g transform="translate(1180 0)">
        <rect x="-60" y="300" width="120" height="120" fill="#fffdf8" stroke="#d8cbb4" strokeWidth="2" />
        <path d="M-50 300 Q0 210 50 300Z" fill="#fffdf8" stroke="#d8cbb4" strokeWidth="2" />
        <rect x="-96" y="230" width="32" height="190" fill="#fffdf8" stroke="#d8cbb4" strokeWidth="2" />
        <rect x="64" y="230" width="32" height="190" fill="#fffdf8" stroke="#d8cbb4" strokeWidth="2" />
        <rect x="-100" y="222" width="40" height="12" fill="#0f8a4b" />
        <rect x="60" y="222" width="40" height="12" fill="#0f8a4b" />
        <path d="M-20 420 V370 A20 20 0 0 1 20 370 V420Z" fill="#2f6fe0" />
      </g>
      <path d="M900 330 L1010 330" stroke="#8a6232" strokeWidth="2" />
      <g fill="#ec2e86" opacity=".8">
        <rect x="920" y="330" width="14" height="18" />
        <rect x="950" y="330" width="14" height="22" fill="#ffd23f" />
        <rect x="980" y="330" width="14" height="16" fill="#2f8cff" />
      </g>
      <path d="M0 600 H1600 V900 H0Z" fill="#d9cbb0" />
      <g stroke="#bfae8e" strokeWidth="4">
        {[640, 690, 740, 790, 840].map((y) => (
          <path key={y} d={`M0 ${y} H1600`} />
        ))}
      </g>
      <g transform="translate(1440 0)">
        <path d="M-70 780 V640 A70 76 0 1 1 70 640 V780Z" fill="#fffdf8" stroke="#d8cbb4" strokeWidth="4" />
        <path d="M-50 780 V650 A50 56 0 1 1 50 650 V780Z" fill="#1f5fa8" />
        <g fill="#f2b33d">
          {[0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => <circle key={`${r}${c}`} cx={-28 + c * 28} cy={660 + r * 30} r="4" />))}
        </g>
      </g>
      <g transform="translate(140 760)">
        <path d="M-30 0 L-22 -40 H22 L30 0Z" fill="#c8693f" />
        <circle cx="-14" cy="-56" r="18" fill="#3db23a" />
        <circle cx="12" cy="-60" r="20" fill="#2f9a4e" />
        <circle cx="-2" cy="-74" r="6" fill="#ec2e86" />
        <circle cx="16" cy="-66" r="5" fill="#ec2e86" />
      </g>
    </g>
  );
}

function Sea() {
  return (
    <g>
      <rect width="1600" height="470" fill="url(#jw-sky-sea)" />
      <rect y="430" width="1600" height="470" fill="url(#jw-water)" />
      <Clouds items={[[420, 140, 100], [1100, 200, 90]]} />
      <Gull x={600} y={220} />
      <Gull x={660} y={250} />
      <Gull x={980} y={150} />
      <path d="M1380 430 Q1470 560 1520 900 H1600 V430Z" fill="#d9cbb0" />
      <path d="M0 260 L110 300 L160 430 L220 900 H0Z" fill="#7b8a99" />
      <path d="M0 260 L110 300 L130 340 L0 320Z" fill="#4caf50" />
      <g transform="translate(70 0)">
        <rect x="-18" y="150" width="36" height="140" fill="#fff" />
        <rect x="-18" y="180" width="36" height="22" fill="#d6283b" />
        <rect x="-18" y="230" width="36" height="22" fill="#d6283b" />
        <rect x="-26" y="130" width="52" height="22" fill="#2b3a55" />
        <path d="M-14 130 L0 110 L14 130Z" fill="#d6283b" />
        <circle cx="0" cy="141" r="7" fill="#ffd23f" />
      </g>
      <g transform="translate(720 446)">
        <ellipse rx="150" ry="22" fill="#e8c27a" />
        <Palm x={10} y={4} h={110} />
      </g>
      <g transform="translate(1150 470)">
        <path d="M-50 0 H50 L36 22 H-36Z" fill="#a0522d" />
        <path d="M0 0 V-80 L44 -8Z" fill="#fff" />
        <path d="M-4 0 V-70 L-36 -8Z" fill="#0f8a4b" />
      </g>
      <g stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" opacity=".55">
        {SEA_WAVES.map((w, i) => (
          <path key={i} className="journey-wave" style={{ animationDelay: `-${w.delay}s` }} d={`M${w.x} ${w.y} q20 -14 40 0 t40 0`} />
        ))}
      </g>
      <g transform="translate(470 780) rotate(-20)">
        <ellipse rx="34" ry="16" fill="#ff8800" />
        <path d="M30 0 L56 -16 L56 16Z" fill="#ff8800" />
        <circle cx="-18" cy="-4" r="4" fill="#13206b" />
      </g>
      <g transform="translate(1010 650) rotate(15)">
        <ellipse rx="26" ry="12" fill="#ffd23f" />
        <path d="M22 0 L42 -12 L42 12Z" fill="#ffd23f" />
        <circle cx="-14" cy="-3" r="3" fill="#13206b" />
      </g>
    </g>
  );
}

/**
 * Constantine is the pilot world with a painted decor (components/world/worldArt.ts). The image is
 * 1376 × 768; drawn 1600 wide, its bridge deck sits at y ≈ 448, so it is moved down 44 units to put
 * the deck under the two stations that stand on the bridge (y = 492, x = 560 and 950).
 */
function Constantine() {
  const decor = WORLD_DECOR.constantine!;
  return (
    <g>
      <rect width="1600" height="900" fill="url(#jw-sky-constantine)" />
      <image href={decor.landscape} x="0" y="44" width="1600" height="893" preserveAspectRatio="none" />
    </g>
  );
}

function Djurdjura() {
  return (
    <g>
      <rect width="1600" height="900" fill="url(#jw-sky-djurdjura)" />
      <path d="M0 520 L160 300 L250 380 L400 200 L560 400 L700 260 L860 430 L1020 230 L1180 410 L1320 280 L1460 420 L1600 330 V900 H0Z" fill="#8aa3c8" />
      <g fill="#fff">
        <path d="M400 200 L360 262 L392 250 L412 270 L446 252Z" />
        <path d="M1020 230 L980 290 L1010 280 L1032 298 L1066 282Z" />
        <path d="M700 260 L670 304 L694 296 L716 310 L740 296Z" />
        <path d="M160 300 L128 346 L154 338 L176 352Z" />
        <path d="M1320 280 L1290 324 L1316 316 L1336 330 L1360 318Z" />
      </g>
      <path d="M0 600 Q200 520 420 580 T860 560 T1300 590 T1600 560 V900 H0Z" fill="#6cc070" />
      <g transform="translate(860 560)">
        <g fill="#f1e3cf">
          <rect x="-90" y="-40" width="60" height="40" />
          <rect x="-20" y="-52" width="70" height="52" />
          <rect x="60" y="-36" width="56" height="36" />
        </g>
        <g fill="#c94a2c">
          <path d="M-96 -40 L-60 -64 L-24 -40Z" />
          <path d="M-26 -52 L15 -80 L56 -52Z" />
          <path d="M54 -36 L88 -58 L122 -36Z" />
        </g>
      </g>
      <Cedar x={300} y={640} s={1.1} />
      <Cedar x={420} y={620} s={0.8} />
      <Cedar x={1180} y={650} s={1} />
      <Cedar x={1290} y={630} s={0.75} />
      <path d="M0 720 Q300 650 640 710 T1300 700 T1600 720 V900 H0Z" fill="#4caf50" />
      <Cedar x={640} y={860} s={1.2} />
      <Cedar x={1500} y={850} s={1} />
      <path d="M1500 200 L260 380" stroke="#33384a" strokeWidth="4" />
      <g>
        <animateMotion dur="16s" repeatCount="indefinite" path="M1500 200 L260 380" keyPoints="0;1;0" keyTimes="0;.5;1" calcMode="linear" />
        <path d="M0 0 V26" stroke="#33384a" strokeWidth="4" />
        <rect x="-30" y="26" width="60" height="44" rx="10" fill="#d6283b" />
        <rect x="-22" y="34" width="44" height="18" rx="4" fill="#bfeaff" />
      </g>
    </g>
  );
}

function Timgad() {
  const columns = [120, 230, 340, 1180, 1290, 1400, 1510];
  return (
    <g>
      <rect width="1600" height="900" fill="url(#jw-sky-timgad)" />
      <circle cx="300" cy="150" r="80" fill="#fff3d0" />
      <path d="M0 470 L180 330 L320 400 L520 280 L700 380 L900 300 L1100 400 L1300 290 L1600 420 V560 H0Z" fill="#c49473" />
      <path d="M0 520 Q400 450 800 500 T1600 500 V560 H0Z" fill="#b98262" />
      <path d="M0 560 H1600 V900 H0Z" fill="#e6c79a" />
      <path d="M0 640 H1600 V760 H0Z" fill="#d4b083" />
      <g stroke="#c29d6e" strokeWidth="3">
        {Array.from({ length: 20 }, (_, i) => (
          <path key={i} d={`M${i * 82} 640 V760`} />
        ))}
        <path d="M0 700 H1600" />
      </g>
      <g transform="translate(800 0)">
        <rect x="-170" y="300" width="340" height="300" fill="#e9cfa6" stroke="#b98a5e" strokeWidth="4" />
        <rect x="-186" y="286" width="372" height="22" fill="#d9b98a" />
        <path d="M-56 600 V420 A56 60 0 0 1 56 420 V600Z" fill="#9c7650" />
        <path d="M-150 600 V480 A32 36 0 0 1 -86 480 V600Z M86 600 V480 A32 36 0 0 1 150 480 V600Z" fill="#9c7650" />
        <g fill="#f3dcb5">
          <rect x="-104" y="330" width="16" height="270" />
          <rect x="88" y="330" width="16" height="270" />
        </g>
      </g>
      {columns.map((x, i) => {
        const h = i % 3 === 2 ? 120 : 220;
        return (
          <g key={x}>
            <rect x={x - 16} y={600 - h} width="32" height={h} fill="#efd9b4" stroke="#c29d6e" strokeWidth="2" />
            <rect x={x - 24} y={600 - h - 14} width="48" height="16" fill="#e2c597" />
            <rect x={x - 24} y="596" width="48" height="12" fill="#e2c597" />
          </g>
        );
      })}
      <OliveTree x={560} y={860} s={1.2} />
      <OliveTree x={1080} y={870} s={1} />
    </g>
  );
}

function Tassili() {
  return (
    <g>
      <rect width="1600" height="900" fill="url(#jw-sky-tassili)" />
      <g fill="#fff6c2">
        {TASSILI_STARS.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} opacity=".7" />
        ))}
      </g>
      <g fill="#7a3a26">
        <path d="M60 620 V380 Q40 330 100 320 Q170 316 150 380 V620Z" />
        <path d="M300 620 V300 Q270 240 350 236 Q430 240 400 300 V620Z" />
        <path d="M1150 620 V340 Q1120 290 1190 286 Q1260 290 1230 340 V620Z" />
        <path d="M1380 620 V260 Q1350 200 1430 196 Q1510 200 1480 260 V620Z" />
        <path d="M1240 620 V470 Q1250 380 1310 380 Q1370 380 1380 470 V620 H1350 V480 Q1340 420 1310 420 Q1280 420 1270 480 V620Z" />
      </g>
      <path d="M560 640 V380 Q600 330 800 330 Q1000 330 1040 380 V640Z" fill="#9c4a2c" />
      <path d="M600 600 V400 Q640 360 800 360 Q960 360 1000 400 V600Z" fill="#b8613a" />
      <g fill="#f4e1c1" stroke="#f4e1c1" strokeWidth="5" strokeLinecap="round">
        <path d="M660 520 L700 470 L740 520 M700 470 V440 M690 452 L710 452" fill="none" />
        <circle cx="700" cy="432" r="7" />
        <path d="M770 520 L800 480 L830 520 M800 480 V450 M780 466 L820 466 M816 466 L840 440" fill="none" />
        <circle cx="800" cy="442" r="7" />
      </g>
      <g fill="#e0a070">
        <path d="M880 520 Q880 470 920 466 L930 420 Q934 410 940 420 L944 466 Q980 470 980 520 L972 520 L968 494 L952 494 L948 520 L940 520 L936 494 L900 494 L896 520 L888 520Z" />
        <path d="M640 420 Q660 400 700 404 Q740 398 760 412 L756 424 L700 420 L650 430Z" />
      </g>
      <path d="M0 620 Q400 580 800 640 T1600 620 V900 H0Z" fill="#d98f55" />
      <path d="M0 760 Q300 720 700 770 T1600 760 V900 H0Z" fill="#c47a42" />
    </g>
  );
}

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

const BACKDROPS: Record<JourneyWorldId, () => React.ReactElement> = {
  sahara: Sahara,
  casbah: Casbah,
  sea: Sea,
  constantine: Constantine,
  djurdjura: Djurdjura,
  timgad: Timgad,
  tassili: Tassili,
  space: Space,
};

export const WorldBackdrop = React.memo(function WorldBackdrop({ id }: { id: JourneyWorldId }) {
  const Backdrop = BACKDROPS[id];
  return <Backdrop />;
});
