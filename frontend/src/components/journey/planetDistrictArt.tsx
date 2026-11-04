import React, { useId } from 'react';

/**
 * 3D-lit art for the five districts of the planet home (V2): light from the top left, a lit and a
 * shaded face per volume, glass and metal highlights and a contact shadow. Pure SVG, so it stays
 * crisp on any phone and works offline. Gradient ids are sanitised per instance (React ids contain
 * « : », which some Android WebViews reject inside url(#…)).
 */
type Stop = [offset: number, color: string, opacity?: number];

function useDefs() {
  const base = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const defs: React.ReactNode[] = [];
  let n = 0;
  const stops = (list: Stop[]) =>
    list.map(([o, c, op], i) => <stop key={i} offset={o} stopColor={c} stopOpacity={op ?? 1} />);
  /** Linear gradient; `dir` h = left→right (cylinders), v = top→bottom, d = diagonal. */
  const lin = (list: Stop[], dir: 'h' | 'v' | 'd' = 'd') => {
    const id = `${base}l${n++}`;
    const [x2, y2] = dir === 'h' ? ['1', '0'] : dir === 'v' ? ['0', '1'] : ['1', '1'];
    defs.push(<linearGradient key={id} id={id} x1="0" y1="0" x2={x2} y2={y2}>{stops(list)}</linearGradient>);
    return `url(#${id})`;
  };
  /** Radial gradient lit from the top left — round, glossy volumes. */
  const ball = (list: Stop[], cx = 0.34, cy = 0.3, r = 0.8) => {
    const id = `${base}r${n++}`;
    defs.push(<radialGradient key={id} id={id} cx={cx} cy={cy} r={r}>{stops(list)}</radialGradient>);
    return `url(#${id})`;
  };
  const clip = (shape: React.ReactNode) => {
    const id = `${base}c${n++}`;
    defs.push(<clipPath key={id} id={id}>{shape}</clipPath>);
    return `url(#${id})`;
  };
  return { lin, ball, clip, Defs: () => <defs>{defs}</defs> };
}

const Shadow = ({ cx = 60, cy = 112, rx = 40 }: { cx?: number; cy?: number; rx?: number }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry="5" fill="#050b33" opacity="0.32" />
);

function RocketArt() {
  const { lin, ball, Defs } = useDefs();
  const body = lin([[0, '#9aa3b8'], [0.28, '#ffffff'], [0.62, '#eef1f7'], [1, '#7d879d']], 'h');
  const red = lin([[0, '#ff9a9a'], [0.35, '#ef2a3c'], [1, '#7c0d1b']], 'h');
  const fin = lin([[0, '#ff6b78'], [1, '#8f1020']]);
  const metal = lin([[0, '#f8fafc'], [0.5, '#94a3b8'], [1, '#334155']]);
  const glass = ball([[0, '#ecfbff'], [0.35, '#5fd0ff'], [1, '#0b4a7a']]);
  const nozzle = lin([[0, '#64748b'], [0.4, '#cbd5e1'], [1, '#1e293b']], 'h');
  const flame = ball([[0, '#ffffff'], [0.3, '#fff3a3'], [0.65, '#ffb020'], [1, '#ff4d1a', 0.85]], 0.5, 0.15, 0.9);
  const moon = ball([[0, '#fff7c2'], [0.55, '#ffcf3a'], [1, '#c98a00']]);
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <Defs />
      <circle cx="20" cy="26" r="14" fill={moon} />
      <circle cx="15" cy="23" r="2.6" fill="#d9a400" opacity=".55" />
      <circle cx="24" cy="31" r="1.8" fill="#d9a400" opacity=".5" />
      <ellipse cx="14" cy="19" rx="4" ry="2.2" fill="#fff" opacity=".7" transform="rotate(-30 14 19)" />
      <path d="M8 108 Q40 84 60 96 T112 70" stroke="#fff" strokeWidth="4" strokeDasharray="2 9" strokeLinecap="round" fill="none" opacity=".9" />
      <g transform="translate(68 56) rotate(32)">
        <g className="j-art-flame">
          <path d="M-10 18 Q-6 44 0 52 Q6 44 10 18Z" fill={flame} />
          <path d="M-5 18 Q-2 32 0 38 Q2 32 5 18Z" fill="#fffbe6" />
        </g>
        <path d="M-9 13 H9 L11 21 H-11Z" fill={nozzle} />
        <path d="M-14 0 L-28 18 Q-29 22 -24 21 L-13 14Z" fill={fin} />
        <path d="M14 0 L28 18 Q29 22 24 21 L13 14Z" fill="#8f1020" />
        <path d="M0 -48 C16 -34 17 -8 15 14 H-15 C-17 -8 -16 -34 0 -48Z" fill={body} />
        <path d="M0 -48 C9 -40 13 -32 14.5 -25 H-14.5 C-13 -32 -9 -40 0 -48Z" fill={red} />
        <rect x="-15.5" y="5" width="31" height="5" rx="1.5" fill={red} />
        <circle cy="-11" r="9" fill={metal} />
        <circle cy="-11" r="6.4" fill={glass} />
        <ellipse cx="-2.6" cy="-13.6" rx="2.6" ry="1.6" fill="#fff" opacity=".85" transform="rotate(-35 -2.6 -13.6)" />
        <path d="M-9 -30 C-11 -14 -11 0 -10 10" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" opacity=".75" fill="none" />
      </g>
    </svg>
  );
}

function SchoolArt() {
  const { lin, Defs } = useDefs();
  const front = lin([[0, '#fffdf7'], [1, '#f0e4c8']], 'v');
  const side = lin([[0, '#e4d3ad'], [1, '#bfa778']], 'v');
  const roof = lin([[0, '#4cc38a'], [0.55, '#1f8a5c'], [1, '#0d5b3a']]);
  const trim = lin([[0, '#2aa36c'], [1, '#0b4d31']], 'v');
  const glass = lin([[0, '#bfe6ff'], [0.45, '#3f8ff0'], [1, '#173f9e']]);
  const sideGlass = lin([[0, '#7fb3e6'], [1, '#1d3f86']]);
  const door = lin([[0, '#5b93f5'], [1, '#1b3e9a']], 'v');
  const flagG = lin([[0, '#16a35c'], [1, '#0a6b3a']], 'v');
  const clock = lin([[0, '#ffffff'], [1, '#dbe3ee']]);
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <Defs />
      <Shadow cx={60} cy={112} rx={46} />
      {/* flag on the roof */}
      <path d="M96 52 V8" stroke="#5b3d22" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="96" cy="7.5" r="2.2" fill="#ffd23f" />
      <path d="M97 10 Q104 7 110 10 T122 10 V28 Q116 25 110 28 T97 28Z" fill="#fff" />
      <path d="M97 10 Q101 8.4 104 9 V27 Q101 26.4 97 28Z" fill={flagG} />
      <circle cx="108.5" cy="19" r="4.6" fill="#d6283b" />
      <circle cx="110.2" cy="19" r="3.7" fill="#fff" />
      {/* side wall, front gable, roof */}
      <path d="M86 66 L108 56 V102 L86 110Z" fill={side} />
      <path d="M14 110 V66 L50 40 L86 66 V110Z" fill={front} />
      <path d="M48 37 L72 27 L112 55 L88 65Z" fill={roof} />
      <path d="M6 68 L50 35 L92 66 L88 71 L50 43 L10 73Z" fill={trim} />
      {/* clock in the gable */}
      <circle cx="50" cy="56" r="7" fill="#0d5b3a" />
      <circle cx="50" cy="56" r="5.4" fill={clock} />
      <path d="M50 56 V52.4 M50 56 L52.6 57.4" stroke="#1e293b" strokeWidth="1.3" strokeLinecap="round" />
      {/* windows */}
      {[20, 66].map((x) => (
        <g key={x}>
          <rect x={x - 1.5} y="72.5" width="17" height="17" rx="3" fill="#d9c8a2" />
          <rect x={x} y="74" width="14" height="14" rx="2" fill={glass} />
          <path d={`M${x + 7} 74 V88 M${x} 81 H${x + 14}`} stroke="#fffdf7" strokeWidth="1.6" />
          <path d={`M${x + 2} 86 L${x + 9} 76`} stroke="#fff" strokeWidth="1.8" strokeLinecap="round" opacity=".55" />
        </g>
      ))}
      <path d="M92 72 L102 67.5 V80 L92 84.5Z" fill={sideGlass} />
      <path d="M92 89 L102 84.5 V96 L92 100.5Z" fill={sideGlass} />
      {/* door and base band */}
      <path d="M37.5 110 V91 A12.5 12.5 0 0 1 62.5 91 V110Z" fill="#d9c8a2" />
      <path d="M40 110 V91.5 A10 10 0 0 1 60 91.5 V110Z" fill={door} />
      <circle cx="55.5" cy="100" r="1.4" fill="#ffd23f" />
      <path d="M14 101 H37.5 V110 H14Z M62.5 101 H86 V110 H62.5Z" fill={trim} />
      <path d="M86 101.5 L108 93.5 V102 L86 110Z" fill="#0b4d31" />
      <path d="M34 112 H66 L64 109 H36Z" fill="#cbbd9c" />
    </svg>
  );
}

function FlaskArt() {
  const { lin, ball, clip, Defs } = useDefs();
  const shape = 'M46 22 H74 V46 L101 97 Q107 110 93 110 H27 Q13 110 19 97 L46 46Z';
  const inside = clip(<path d={shape} />);
  const glassFill = lin([[0, '#ffffff', 0.7], [0.35, '#e6f6ff', 0.35], [0.8, '#a9cde8', 0.4], [1, '#5f8fb8', 0.6]], 'h');
  const liquid = lin([[0, '#c9ff7a'], [0.45, '#6fd63a'], [1, '#2f8a16']]);
  const liquidTop = lin([[0, '#eaffb8'], [1, '#9fe85a']], 'h');
  const cap = lin([[0, '#c58bff'], [0.4, '#8b22e0'], [1, '#4a0f86']], 'h');
  const bubble = ball([[0, '#ffffff'], [0.6, '#ffffff', 0.55], [1, '#ffffff', 0.15]]);
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <Defs />
      <Shadow cx={60} cy={112} rx={42} />
      <ellipse cx="60" cy="106" rx="30" ry="4" fill="#9cff6a" opacity=".35" />
      <g clipPath={inside}>
        <rect x="0" y="72" width="120" height="40" fill={liquid} />
        <ellipse cx="60" cy="72" rx="29" ry="4.2" fill={liquidTop} />
        <g className="j-art-bubbles">
          <circle cx="48" cy="94" r="5" fill={bubble} />
          <circle cx="68" cy="99" r="3.4" fill={bubble} />
          <circle cx="76" cy="86" r="2.4" fill={bubble} />
          <circle cx="57" cy="82" r="2" fill={bubble} />
        </g>
      </g>
      <path d={shape} fill={glassFill} stroke="#3a5d8f" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M51 26 V48 L28 94" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" fill="none" opacity=".85" />
      <path d="M69 52 L90 92" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity=".45" />
      <circle className="j-art-rise" cx="61" cy="40" r="2.4" fill={bubble} />
      <ellipse cx="60" cy="22" rx="16" ry="3.6" fill="#dff3ff" stroke="#3a5d8f" strokeWidth="2" />
      <path d="M42 10 H78 V21 Q60 26 42 21Z" fill={cap} />
      <ellipse cx="60" cy="10" rx="18" ry="4" fill="#d9b3ff" />
      <ellipse cx="53" cy="9.4" rx="5" ry="1.4" fill="#fff" opacity=".7" />
    </svg>
  );
}

/** A faceted star: each point has a lit and a shaded half, which reads as embossed metal. */
function bevelStar(cx: number, cy: number, R: number, r: number) {
  const pt = (i: number, rad: number) => {
    const a = (-90 + i * 36) * (Math.PI / 180);
    return `${(cx + rad * Math.cos(a)).toFixed(2)} ${(cy + rad * Math.sin(a)).toFixed(2)}`;
  };
  const facets: Array<{ d: string; lit: boolean }> = [];
  for (let k = 0; k < 10; k++) {
    const a = k % 2 === 0 ? pt(k, R) : pt(k, r);
    const b = (k + 1) % 2 === 0 ? pt(k + 1, R) : pt(k + 1, r);
    // Facets facing the top left catch the light.
    const mid = (-90 + (k + 0.5) * 36 + 360) % 360;
    facets.push({ d: `M${cx} ${cy} L${a} L${b}Z`, lit: mid > 150 && mid < 330 });
  }
  return facets;
}

function MedalArt3d() {
  const { lin, ball, Defs } = useDefs();
  const green = lin([[0, '#34c77b'], [1, '#0a5c33']], 'h');
  const red = lin([[0, '#ff6170'], [1, '#8f1020']], 'h');
  const rim = lin([[0, '#fff6c9'], [0.35, '#ffc21a'], [0.7, '#c98200'], [1, '#7a4a00']]);
  const disc = ball([[0, '#fff2a8'], [0.5, '#ffbf1a'], [1, '#b56f00']]);
  const ring = lin([[0, '#fff3b0'], [1, '#a86a00']]);
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <Defs />
      <Shadow cx={60} cy={114} rx={30} />
      <path d="M30 2 H50 L68 48 L52 54Z" fill={green} />
      <path d="M38 2 H43 L60 46 L56 48Z" fill="#fff" opacity=".9" />
      <path d="M90 2 H70 L52 48 L68 54Z" fill={red} />
      <path d="M52 48 L68 54 L62 58Z" fill="#000" opacity=".25" />
      <ellipse cx="60" cy="50" rx="7" ry="4.5" fill="none" stroke={ring} strokeWidth="3.4" />
      <circle cx="60" cy="81" r="33" fill={rim} />
      <circle cx="60" cy="81" r="26.5" fill="#a96800" opacity=".55" />
      <circle cx="60" cy="81.8" r="25.5" fill={disc} />
      <circle cx="60" cy="81" r="22" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="1" strokeDasharray="1.5 2.5" />
      <g transform="translate(1.2 1.6)" opacity=".35">
        {bevelStar(60, 81, 17, 7.2).map((f, i) => <path key={i} d={f.d} fill="#6b3d00" />)}
      </g>
      {bevelStar(60, 81, 17, 7.2).map((f, i) => (
        <path key={i} d={f.d} fill={f.lit ? '#fffbe8' : '#f3c64a'} />
      ))}
      <path d="M36 70 A27 27 0 0 1 58 54" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" fill="none" opacity=".75" />
      <path className="j-art-sparkle" d="M92 56 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" fill="#fff" />
    </svg>
  );
}

function ParentsArt() {
  const { lin, ball, Defs } = useDefs();
  const front = lin([[0, '#fff0f6'], [1, '#ffc9de']], 'v');
  const side = lin([[0, '#f4a9c6'], [1, '#d77ba0']], 'v');
  const roof = lin([[0, '#f0509a'], [0.55, '#c2186b'], [1, '#7d0c43']]);
  const trim = lin([[0, '#d42a7c'], [1, '#7d0c43']], 'v');
  const heart = ball([[0, '#ffc2de'], [0.4, '#ff3d96'], [1, '#9d1458']], 0.32, 0.28, 0.85);
  const gold = lin([[0, '#fff2a8'], [0.45, '#ffc21a'], [1, '#a86a00']], 'v');
  const shackle = lin([[0, '#f8fafc'], [0.5, '#cbd5e1'], [1, '#64748b']], 'h');
  const brick = lin([[0, '#d9607f'], [1, '#8d2a45']], 'h');
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <Defs />
      <Shadow cx={60} cy={112} rx={46} />
      <path d="M78 26 H88 V46 L78 41Z" fill={brick} />
      <rect x="76" y="22" width="14" height="5" rx="1.5" fill="#7d0c43" />
      <path d="M86 66 L108 56 V102 L86 110Z" fill={side} />
      <path d="M14 110 V66 L50 40 L86 66 V110Z" fill={front} />
      <path d="M48 37 L72 27 L112 55 L88 65Z" fill={roof} />
      <path d="M6 68 L50 35 L92 66 L88 71 L50 43 L10 73Z" fill={trim} />
      <path d="M92 74 L102 69.5 V82 L92 86.5Z" fill="#b8d9ff" opacity=".9" />
      {/* 3D heart */}
      <g className="j-art-beat">
        <path d="M51 103 C22 86 26 62 42 64 C47 64.6 50 68 51 71 C52 68 55 64.6 60 64 C76 62 80 86 51 103Z" fill="#9d1458" transform="translate(1.6 2)" opacity=".35" />
        <path d="M50 101 C21 84 25 60 41 62 C46 62.6 49 66 50 69 C51 66 54 62.6 59 62 C75 60 79 84 50 101Z" fill={heart} />
        <ellipse cx="38" cy="70" rx="5" ry="3" fill="#fff" opacity=".75" transform="rotate(-35 38 70)" />
      </g>
      {/* padlock */}
      <path d="M84 86 V77 A9 9 0 0 1 102 77 V86" stroke={shackle} strokeWidth="4.6" fill="none" strokeLinecap="round" />
      <rect x="78" y="85" width="30" height="24" rx="5" fill={gold} />
      <rect x="80" y="86.5" width="26" height="4" rx="2" fill="#fff" opacity=".45" />
      <circle cx="93" cy="96" r="3.2" fill="#5a3600" />
      <path d="M91.6 97.5 H94.4 L95.2 103 H90.8Z" fill="#5a3600" />
    </svg>
  );
}

export type PlanetDistrict = 'journey' | 'courses' | 'labs' | 'medals' | 'parents';

export function PlanetDistrictArt({ id }: { id: PlanetDistrict }) {
  if (id === 'journey') return <RocketArt />;
  if (id === 'courses') return <SchoolArt />;
  if (id === 'labs') return <FlaskArt />;
  if (id === 'medals') return <MedalArt3d />;
  return <ParentsArt />;
}

/** Relief for the planet itself: shaded continents, a cloud belt, night side and a specular glint. */
export function PlanetSurface() {
  const { lin, ball, Defs } = useDefs();
  const land = lin([[0, '#8be07a'], [0.6, '#3fae5a'], [1, '#1f6e3a']]);
  const sand = lin([[0, '#ffe3a3'], [0.6, '#e0b060'], [1, '#a8742f']]);
  const night = ball([[0, '#000', 0], [0.55, '#000', 0], [1, '#020a3a', 0.6]], 0.3, 0.28, 0.85);
  const glint = ball([[0, '#fff', 0.85], [1, '#fff', 0]], 0.5, 0.5, 0.5);
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true">
      <Defs />
      <path d="M30 70 Q55 40 90 52 Q110 60 104 82 Q96 104 70 100 Q40 98 30 70Z" fill={land} />
      <path d="M44 70 Q60 58 78 66 Q84 76 70 82 Q52 84 44 70Z" fill="#2f8f4a" opacity=".55" />
      <path d="M60 60 l6 -8 6 8z M70 64 l5 -6 5 6z" fill="#e9f5e1" opacity=".8" />
      <path d="M120 120 Q150 100 176 124 Q186 150 160 164 Q132 172 122 150Z" fill={sand} />
      <path d="M132 136 Q146 128 160 138 Q150 150 136 146Z" fill="#c98f45" opacity=".55" />
      <path d="M50 140 Q66 130 80 142 Q84 158 66 162 Q50 160 50 140Z" fill={land} />
      <g fill="#fff" opacity=".3">
        <path d="M10 112 Q50 100 90 112 T170 108 Q150 118 110 120 T20 122Z" />
        <path d="M112 44 Q136 34 162 46 Q140 52 116 50Z" opacity=".8" />
      </g>
      <circle cx="100" cy="100" r="100" fill={night} />
      <ellipse cx="66" cy="54" rx="30" ry="18" fill={glint} transform="rotate(-30 66 54)" />
    </svg>
  );
}
