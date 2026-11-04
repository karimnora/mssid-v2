import React, { useId } from 'react';
import { ALGERIA_OUTLINE_PATH } from '../../data/algeriaMapOutline';

/**
 * 3D icon family (V2 « produit plus beau »): one soft-lit object per icon, light from the top left,
 * gradients for volume, a contact shadow and a specular highlight. 64×64, crisp at any size, a few
 * hundred bytes each — works offline, unlike photos. Gradient ids are unique and sanitised per
 * instance (React 19 ids contain « : », which some Android WebViews reject inside url(#…)).
 */
export type Icon3dName =
  | 'algeria' | 'museum' | 'market' | 'flags' | 'mountains' | 'graduation' | 'notebook'
  | 'book' | 'drop' | 'prayerMat' | 'mosque' | 'trafficLight' | 'abacus' | 'calculator'
  | 'geometry' | 'fraction' | 'grid' | 'clock' | 'times' | 'flask' | 'bulb' | 'magnifier'
  | 'heart' | 'earthCycle' | 'speech' | 'pen' | 'tifinagh' | 'letters' | 'trophy' | 'planet'
  | 'balloons' | 'map' | 'puzzle' | 'star';

type Stops = [string, string, string?];

function useGrad() {
  const base = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const defs: React.ReactNode[] = [];
  let n = 0;
  /** Radial gradient lit from the top left — for round, glossy volumes. */
  const ball = ([a, b, c]: Stops) => {
    const id = `${base}r${n++}`;
    defs.push(
      <radialGradient key={id} id={id} cx="0.34" cy="0.3" r="0.85">
        <stop offset="0" stopColor={a} />
        <stop offset={c ? '0.5' : '1'} stopColor={b} />
        {c && <stop offset="1" stopColor={c} />}
      </radialGradient>,
    );
    return `url(#${id})`;
  };
  /** Linear gradient top-left → bottom-right — for faces and flat parts. */
  const face = ([a, b]: Stops, vertical = false) => {
    const id = `${base}l${n++}`;
    defs.push(
      <linearGradient key={id} id={id} x1="0" y1="0" x2={vertical ? '0' : '1'} y2="1">
        <stop offset="0" stopColor={a} />
        <stop offset="1" stopColor={b} />
      </linearGradient>,
    );
    return `url(#${id})`;
  };
  return { ball, face, defs: () => <defs>{defs}</defs> };
}

const Floor = ({ cx = 32, cy = 58, rx = 20 }: { cx?: number; cy?: number; rx?: number }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry="3.6" fill="#0b1240" opacity="0.28" />
);
const Shine = ({ cx, cy, rx = 4, ry = 2.4, rot = -30 }: { cx: number; cy: number; rx?: number; ry?: number; rot?: number }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#fff" opacity="0.6" transform={`rotate(${rot} ${cx} ${cy})`} />
);

const GOLD: Stops = ['#fff3c4', '#f5b301', '#a16207'];
const GREEN: Stops = ['#bbf7d0', '#16a34a', '#14532d'];
const BLUE: Stops = ['#dbeafe', '#3b82f6', '#1e3a8a'];
const RED: Stops = ['#fecaca', '#ef4444', '#7f1d1d'];
const PAPER: Stops = ['#ffffff', '#e7dcc4'];
const WOOD: Stops = ['#f3c58a', '#9a5b1f'];

function draw(name: Icon3dName, g: ReturnType<typeof useGrad>): React.ReactNode {
  switch (name) {
    case 'algeria':
      return (
        <>
          <Floor rx={24} />
          <svg x="6" y="9" width="52" height="48" viewBox="45 50 380 386">
            <path d={ALGERIA_OUTLINE_PATH} fill="#0b5f37" transform="translate(10 22)" />
            <path d={ALGERIA_OUTLINE_PATH} fill={g.face(['#86efac', '#15803d'])} stroke="#ecfdf5" strokeWidth="8" strokeLinejoin="round" />
          </svg>
          <path d="M44 12 a7 7 0 0 1 14 0 c0 6 -7 12 -7 12 s-7 -6 -7 -12z" fill={g.ball(RED)} />
          <circle cx="51" cy="12" r="2.6" fill="#fff" />
        </>
      );
    case 'museum':
      return (
        <>
          <Floor />
          <path d="M8 22 L32 8 L56 22Z" fill={g.face(['#fde68a', '#d97706'])} />
          <rect x="10" y="22" width="44" height="5" fill="#f1e4c8" />
          {[14, 24, 34, 44].map((x) => <rect key={x} x={x} y="28" width="6" height="22" rx="1" fill={g.face(['#ffffff', '#cbb994'])} />)}
          <rect x="8" y="50" width="48" height="6" rx="1.5" fill={g.face(['#f5ecd8', '#b8a477'], true)} />
        </>
      );
    case 'market':
      return (
        <>
          <Floor />
          <rect x="12" y="28" width="40" height="26" rx="3" fill={g.face(WOOD)} />
          <path d="M8 18 H56 L52 30 H12Z" fill="#fff" />
          {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${8 + i * 8} 18 H${16 + i * 8} L${15.3 + i * 6.7} 30 H${12 + i * 6.7}Z`} fill={i % 2 ? '#fff' : g.ball(RED)} />)}
          <circle cx="22" cy="40" r="5" fill={g.ball(['#fed7aa', '#f97316', '#9a3412'])} />
          <circle cx="32" cy="41" r="5" fill={g.ball(GREEN)} />
          <circle cx="42" cy="40" r="5" fill={g.ball(['#fef08a', '#eab308', '#854d0e'])} />
        </>
      );
    case 'flags':
      return (
        <>
          <Floor rx={18} />
          <path d="M18 56 V8 M44 56 V14" stroke="#6b4a2a" strokeWidth="3" strokeLinecap="round" />
          <path d="M19 9 Q26 6 31 10 V27 Q26 23 19 26Z" fill="#0f8a4b" />
          <path d="M31 10 Q36 13 42 10 V27 Q36 30 31 27Z" fill="#fff" />
          <circle cx="31" cy="18" r="4" fill="#d6283b" /><circle cx="32.4" cy="18" r="3.2" fill="#fff" />
          <path d="M45 15 Q52 12 58 16 V32 Q52 28 45 31Z" fill={g.face(BLUE as Stops)} />
          <path d="M45 23 H58" stroke="#fff" strokeWidth="2" />
        </>
      );
    case 'mountains':
      return (
        <>
          <Floor rx={24} />
          <path d="M4 56 L24 18 L44 56Z" fill={g.face(['#a8a29e', '#57534e'])} />
          <path d="M24 18 L44 56 H30Z" fill="#44403c" opacity="0.5" />
          <path d="M18 30 L24 18 L30 30 L26 28 L22 31Z" fill="#fff" />
          <path d="M28 56 L44 26 L60 56Z" fill={g.face(['#86efac', '#166534'])} />
          <path d="M40 34 L44 26 L48 34 L45 32Z" fill="#ecfdf5" />
        </>
      );
    case 'graduation':
      return (
        <>
          <Floor />
          <path d="M18 34 V46 Q32 54 46 46 V34Z" fill={g.face(['#334155', '#0f172a'])} />
          <path d="M4 26 L32 14 L60 26 L32 38Z" fill={g.face(['#475569', '#111827'])} />
          <path d="M32 26 L52 30 V44" stroke={g.face(GOLD as Stops)} strokeWidth="2.5" fill="none" />
          <circle cx="52" cy="46" r="3.5" fill={g.ball(GOLD)} />
          <Shine cx={24} cy={22} rx={6} ry={2} rot={-20} />
        </>
      );
    case 'notebook':
      return (
        <>
          <Floor />
          <rect x="14" y="8" width="38" height="48" rx="4" fill={g.face(['#60a5fa', '#1d4ed8'])} />
          <rect x="18" y="10" width="32" height="44" rx="2" fill={g.face(PAPER)} />
          {[20, 27, 34, 41, 48].map((y) => <path key={y} d={`M22 ${y} H46`} stroke="#93c5fd" strokeWidth="1.4" />)}
          {[14, 22, 30, 38, 46].map((y) => <circle key={y} cx="14" cy={y} r="2.2" fill="#e2e8f0" stroke="#64748b" />)}
        </>
      );
    case 'book':
      return (
        <>
          <Floor rx={22} />
          <path d="M10 46 L32 54 L54 46 L50 42 L32 48 L14 42Z" fill={g.face(WOOD)} />
          <path d="M8 18 Q20 12 32 18 V46 Q20 40 8 46Z" fill={g.face(PAPER)} />
          <path d="M56 18 Q44 12 32 18 V46 Q44 40 56 46Z" fill={g.face(['#e7dcc4', '#ffffff'])} />
          <path d="M8 18 Q20 12 32 18 Q44 12 56 18" stroke="#0f766e" strokeWidth="2.5" fill="none" />
          {[24, 30, 36].map((y) => <path key={y} d={`M13 ${y} Q20 ${y - 3} 28 ${y}`} stroke="#94a3b8" strokeWidth="1.5" />)}
          {[24, 30, 36].map((y) => <path key={`r${y}`} d={`M36 ${y} Q44 ${y - 3} 51 ${y}`} stroke="#94a3b8" strokeWidth="1.5" />)}
        </>
      );
    case 'drop':
      return (
        <>
          <Floor rx={14} />
          <path d="M32 6 C40 20 50 30 50 40 A18 18 0 0 1 14 40 C14 30 24 20 32 6Z" fill={g.ball(['#e0f2fe', '#38bdf8', '#0369a1'])} />
          <Shine cx={25} cy={34} rx={4} ry={7} rot={20} />
          <circle cx="40" cy="46" r="2.5" fill="#fff" opacity="0.5" />
        </>
      );
    case 'prayerMat':
      return (
        <>
          <Floor rx={24} />
          <path d="M14 56 L20 10 H44 L50 56Z" fill={g.face(['#16a34a', '#14532d'], true)} />
          <path d="M19 52 L24 16 H40 L45 52Z" fill="none" stroke={g.face(GOLD as Stops)} strokeWidth="2" />
          <path d="M26 30 Q32 18 38 30 V46 H26Z" fill={g.face(['#fde68a', '#b45309'])} opacity="0.9" />
          {[18, 24, 30, 36, 42, 48].map((x) => <path key={x} d={`M${x} 56 V60`} stroke="#fde68a" strokeWidth="1.5" />)}
        </>
      );
    case 'mosque':
      return (
        <>
          <Floor rx={24} />
          <rect x="46" y="16" width="8" height="40" fill={g.face(['#ffffff', '#cbd5e1'])} />
          <path d="M46 16 Q50 8 54 16Z" fill={g.ball(GOLD)} />
          <rect x="10" y="34" width="36" height="22" fill={g.face(['#ffffff', '#cbd5e1'])} />
          <path d="M12 34 Q12 14 28 11 Q44 14 44 34Z" fill={g.ball(GOLD)} />
          <path d="M28 11 V5" stroke="#f5b301" strokeWidth="1.8" />
          <Shine cx={20} cy={22} rx={4} ry={2.5} />
          {[19, 28, 37].map((x) => <path key={x} d={`M${x - 3} 56 V47 Q${x} 42 ${x + 3} 47 V56Z`} fill="#1e3a8a" />)}
        </>
      );
    case 'trafficLight':
      return (
        <>
          <Floor rx={14} />
          <rect x="30" y="44" width="4" height="12" fill="#334155" />
          <rect x="20" y="4" width="24" height="42" rx="8" fill={g.face(['#475569', '#0f172a'])} />
          <circle cx="32" cy="14" r="5" fill={g.ball(RED)} />
          <circle cx="32" cy="25" r="5" fill={g.ball(['#fef9c3', '#facc15', '#a16207'])} />
          <circle cx="32" cy="36" r="5" fill={g.ball(GREEN)} />
        </>
      );
    case 'abacus':
      return (
        <>
          <Floor rx={24} />
          <rect x="8" y="10" width="48" height="44" rx="4" fill="none" stroke={g.face(WOOD)} strokeWidth="5" />
          {[20, 32, 44].map((y, row) => (
            <g key={y}>
              <path d={`M10 ${y} H54`} stroke="#94a3b8" strokeWidth="1.5" />
              {[0, 1, 2, 3].map((i) => <circle key={i} cx={16 + i * 7 + (row === 1 ? 12 : row === 2 ? 6 : 0)} cy={y} r="3.8" fill={g.ball([['#fecaca', '#ef4444', '#7f1d1d'], ['#bfdbfe', '#3b82f6', '#1e3a8a'], ['#bbf7d0', '#16a34a', '#14532d']][row] as Stops)} />)}
            </g>
          ))}
        </>
      );
    case 'calculator':
      return (
        <>
          <Floor />
          <rect x="14" y="6" width="36" height="50" rx="6" fill={g.face(['#64748b', '#1e293b'])} />
          <rect x="18" y="10" width="28" height="12" rx="2" fill={g.face(['#d9f99d', '#84cc16'])} />
          {[0, 1, 2].map((r) => [0, 1, 2].map((c) => (
            <rect key={`${r}${c}`} x={18 + c * 10} y={26 + r * 9} width="8" height="7" rx="2" fill={c === 2 && r === 2 ? '#f97316' : '#e2e8f0'} />
          )))}
          <Shine cx={22} cy={12} rx={5} ry={1.6} rot={0} />
        </>
      );
    case 'geometry':
      return (
        <>
          <Floor rx={24} />
          <path d="M8 52 L52 52 L8 12Z" fill={g.face(['#fde68a', '#f59e0b'])} opacity="0.95" />
          <path d="M16 44 L36 44 L16 26Z" fill="#fffbeb" />
          {[14, 20, 26, 32, 38, 44].map((x) => <path key={x} d={`M${x} 52 V48`} stroke="#92400e" strokeWidth="1.2" />)}
          <path d="M46 8 L38 46 M46 8 L56 44" stroke={g.face(['#cbd5e1', '#475569'])} strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="46" cy="8" r="4" fill={g.ball(RED)} />
        </>
      );
    case 'fraction':
      return (
        <>
          <Floor />
          <path d="M32 32 L32 10 A22 22 0 1 1 10 32Z" fill={g.ball(['#fed7aa', '#fb923c', '#9a3412'])} />
          <path d="M28 28 L28 6 A22 22 0 0 0 6 28Z" fill={g.ball(['#fef9c3', '#facc15', '#854d0e'])} />
          <path d="M32 32 L32 10 M32 32 L54 32 M32 32 L32 54" stroke="#fff7ed" strokeWidth="1.5" opacity="0.7" />
          <Shine cx={40} cy={18} rx={5} ry={2.5} />
        </>
      );
    case 'grid':
      return (
        <>
          <Floor rx={24} />
          {[0, 1, 2].map((r) => [0, 1, 2].map((c) => {
            const on = (r + c) % 2 === 0;
            return <rect key={`${r}${c}`} x={10 + c * 15} y={10 + r * 15} width="13" height="13" rx="3" fill={on ? g.face(['#93c5fd', '#2563eb']) : g.face(['#ffffff', '#cbd5e1'])} />;
          }))}
        </>
      );
    case 'clock':
      return (
        <>
          <Floor rx={18} />
          <circle cx="32" cy="32" r="24" fill={g.ball(['#fecaca', '#ef4444', '#991b1b'])} />
          <circle cx="32" cy="32" r="19" fill={g.ball(['#ffffff', '#f1f5f9', '#cbd5e1'])} />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i * Math.PI) / 6;
            return <circle key={i} cx={32 + 15 * Math.sin(a)} cy={32 - 15 * Math.cos(a)} r={i % 3 ? 1 : 1.8} fill="#334155" />;
          })}
          <path d="M32 32 V20 M32 32 L41 37" stroke="#0f172a" strokeWidth="2.6" strokeLinecap="round" />
          <circle cx="32" cy="32" r="2.4" fill="#ef4444" />
          <Shine cx={22} cy={20} rx={6} ry={3} />
        </>
      );
    case 'times':
      return (
        <>
          <Floor rx={22} />
          <rect x="6" y="18" width="24" height="24" rx="6" fill={g.face(['#c4b5fd', '#6d28d9'])} />
          <rect x="34" y="18" width="24" height="24" rx="6" fill={g.face(['#99f6e4', '#0f766e'])} />
          <text x="18" y="36" fontSize="16" fontWeight="900" fill="#fff" textAnchor="middle" fontFamily="'Segoe UI', Arial, sans-serif">7</text>
          <text x="46" y="36" fontSize="16" fontWeight="900" fill="#fff" textAnchor="middle" fontFamily="'Segoe UI', Arial, sans-serif">8</text>
          <circle cx="32" cy="30" r="7" fill={g.ball(GOLD)} />
          <path d="M29 27 L35 33 M35 27 L29 33" stroke="#78350f" strokeWidth="2.2" strokeLinecap="round" />
        </>
      );
    case 'flask':
      return (
        <>
          <Floor rx={18} />
          <path d="M20 56 Q14 56 17 50 L27 30 V12 H37 V30 L47 50 Q50 56 44 56Z" fill={g.face(['#a3e635', '#15803d'], true)} />
          <path d="M20 56 Q14 56 17 50 L27 30 V12 H37 V30 L47 50 Q50 56 44 56Z" fill="#fff" opacity="0.16" stroke="#ecfeff" strokeWidth="2" />
          <path d="M24 12 H40" stroke="#ecfeff" strokeWidth="3" strokeLinecap="round" />
          <path d="M30 18 V30 L22 48" stroke="#fff" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
          {[[34, 42, 2.5], [38, 36, 1.8], [30, 46, 1.8]].map(([x, y, r]) => <circle key={`${x}${y}`} cx={x} cy={y} r={r} fill="#ecfccb" />)}
        </>
      );
    case 'bulb':
      return (
        <>
          <Floor rx={14} />
          <circle cx="32" cy="26" r="22" fill="#fef08a" opacity="0.25" />
          <path d="M32 6 A16 16 0 0 1 42 34 Q39 37 39 42 H25 Q25 37 22 34 A16 16 0 0 1 32 6Z" fill={g.ball(['#fffbeb', '#fde047', '#ca8a04'])} />
          <rect x="24" y="42" width="16" height="10" rx="2" fill={g.face(['#e2e8f0', '#64748b'], true)} />
          <path d="M24 46 H40 M24 49 H40" stroke="#475569" strokeWidth="1" />
          <path d="M28 30 L32 22 L36 30" stroke="#b45309" strokeWidth="1.6" fill="none" />
          <Shine cx={26} cy={16} rx={4} ry={2.5} />
        </>
      );
    case 'magnifier':
      return (
        <>
          <Floor rx={20} />
          <path d="M38 40 L54 56" stroke={g.face(WOOD)} strokeWidth="7" strokeLinecap="round" />
          <circle cx="28" cy="28" r="18" fill={g.face(['#cbd5e1', '#475569'])} />
          <circle cx="28" cy="28" r="14" fill={g.ball(['#ecfeff', '#a5f3fc', '#0e7490'])} opacity="0.9" />
          <path d="M22 34 Q28 20 34 34" stroke="#16a34a" strokeWidth="2.5" fill="none" />
          <path d="M28 34 V24 Q34 20 34 26 Q30 26 28 30" fill="#22c55e" />
          <Shine cx={21} cy={21} rx={4} ry={2.5} />
        </>
      );
    case 'heart':
      return (
        <>
          <Floor rx={16} />
          <path d="M32 54 C10 40 6 28 10 18 C14 8 28 8 32 18 C36 8 50 8 54 18 C58 28 54 40 32 54Z" fill={g.ball(['#fecdd3', '#f43f5e', '#881337'])} />
          <Shine cx={18} cy={18} rx={5} ry={3} />
          <path d="M14 34 H24 L28 26 L33 40 L37 32 H50" stroke="#fff" strokeWidth="2" fill="none" strokeLinejoin="round" opacity="0.85" />
        </>
      );
    case 'earthCycle':
      return (
        <>
          <Floor rx={18} />
          <circle cx="32" cy="36" r="18" fill={g.ball(['#bae6fd', '#0ea5e9', '#075985'])} />
          <path d="M22 30 Q28 26 32 30 Q36 36 30 42 Q24 40 22 30Z M36 24 Q44 26 44 34 Q40 32 36 24Z" fill={g.face(['#86efac', '#15803d'])} />
          <circle cx="50" cy="12" r="7" fill={g.ball(['#fef9c3', '#facc15', '#ca8a04'])} />
          <path d="M10 12 Q14 6 20 10 Q26 8 26 14 H10Z" fill="#fff" />
          <path d="M14 18 l-1 4 M19 18 l-1 4" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
        </>
      );
    case 'speech':
      return (
        <>
          <Floor rx={22} />
          <path d="M6 12 H38 Q44 12 44 18 V32 Q44 38 38 38 H22 L14 46 L15 38 H12 Q6 38 6 32 V18 Q6 12 12 12Z" fill={g.face(['#93c5fd', '#2563eb'])} />
          <path d="M26 26 H54 Q58 26 58 30 V44 Q58 48 54 48 H52 L53 54 L45 48 H30 Q26 48 26 44Z" fill={g.face(['#fde68a', '#f59e0b'])} />
          {[14, 22, 30].map((x) => <circle key={x} cx={x} cy="25" r="2.4" fill="#fff" />)}
          <path d="M33 37 H51" stroke="#78350f" strokeWidth="2.4" strokeLinecap="round" />
        </>
      );
    case 'pen':
      return (
        <>
          <Floor rx={20} />
          <g transform="rotate(40 32 32)">
            <rect x="26" y="2" width="12" height="40" rx="6" fill={g.face(['#475569', '#0f172a'])} />
            <rect x="26" y="12" width="12" height="4" fill="#facc15" />
            <path d="M26 42 L32 60 L38 42Z" fill={g.face(GOLD as Stops)} />
            <path d="M32 46 V56" stroke="#78350f" strokeWidth="1.2" />
            <rect x="28.5" y="6" width="2" height="30" rx="1" fill="#fff" opacity="0.35" />
          </g>
        </>
      );
    case 'tifinagh':
      return (
        <>
          <Floor />
          <circle cx="32" cy="30" r="24" fill={g.ball(['#fed7aa', '#ea580c', '#7c2d12'])} />
          <circle cx="32" cy="30" r="18" fill="none" stroke="#fef3c7" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x="32" y="40" fontSize="28" fontWeight="900" fill="#fef3c7" textAnchor="middle" fontFamily="'Noto Sans Tifinagh', 'Ebrima', sans-serif">ⵣ</text>
          <Shine cx={22} cy={16} rx={6} ry={3} />
        </>
      );
    case 'letters':
      return (
        <>
          <Floor rx={24} />
          {[
            { x: 6, y: 26, c: ['#86efac', '#15803d'], l: 'ب' },
            { x: 23, y: 14, c: ['#fde68a', '#d97706'], l: 'أ' },
            { x: 40, y: 26, c: ['#93c5fd', '#1d4ed8'], l: 'ت' },
          ].map((b) => (
            <g key={b.l}>
              <path d={`M${b.x} ${b.y + 4} L${b.x + 4} ${b.y} H${b.x + 22} L${b.x + 18} ${b.y + 4}Z`} fill="#fff" opacity="0.55" />
              <rect x={b.x} y={b.y + 4} width="18" height="18" rx="3" fill={g.face(b.c as Stops)} />
              <path d={`M${b.x + 18} ${b.y + 4} L${b.x + 22} ${b.y} V${b.y + 18} L${b.x + 18} ${b.y + 22}Z`} fill="#000" opacity="0.2" />
              <text x={b.x + 9} y={b.y + 18.5} fontSize="13" fontWeight="900" fill="#fff" textAnchor="middle" direction="rtl" fontFamily="'Noto Naskh Arabic', Tahoma, serif">{b.l}</text>
            </g>
          ))}
        </>
      );
    case 'trophy':
      return (
        <>
          <Floor rx={16} />
          <path d="M18 10 H46 V24 A14 14 0 0 1 18 24Z" fill={g.ball(GOLD)} />
          <path d="M18 14 H10 Q10 26 20 28 M46 14 H54 Q54 26 44 28" stroke={g.face(GOLD as Stops)} strokeWidth="3.5" fill="none" />
          <rect x="29" y="36" width="6" height="10" fill={g.face(GOLD as Stops)} />
          <rect x="20" y="46" width="24" height="9" rx="2" fill={g.face(['#78350f', '#451a03'], true)} />
          <path d="M32 15 L33.8 19.6 L38.6 19.8 L34.8 22.8 L36.1 27.4 L32 24.7 L27.9 27.4 L29.2 22.8 L25.4 19.8 L30.2 19.6Z" fill="#fffbeb" />
          <Shine cx={23} cy={16} rx={3} ry={6} rot={10} />
        </>
      );
    case 'planet':
      return (
        <>
          <circle cx="32" cy="32" r="18" fill={g.ball(['#c7d2fe', '#6366f1', '#312e81'])} />
          <path d="M18 30 Q26 26 34 32 T48 30" stroke="#a5b4fc" strokeWidth="3" fill="none" opacity="0.7" />
          <ellipse cx="32" cy="34" rx="30" ry="8" fill="none" stroke={g.face(GOLD as Stops)} strokeWidth="3.5" transform="rotate(-16 32 34)" />
          <path d="M14 22 A18 18 0 0 1 50 26" stroke="#fff" strokeWidth="2" fill="none" opacity="0.3" />
          <Shine cx={24} cy={22} rx={5} ry={3} />
          <circle cx="54" cy="10" r="2" fill="#fff" /><circle cx="8" cy="50" r="1.5" fill="#fff" />
        </>
      );
    case 'balloons':
      return (
        <>
          <path d="M22 34 Q24 46 30 58 M42 30 Q40 44 32 58 M32 38 V58" stroke="#e2e8f0" strokeWidth="1.2" fill="none" />
          <ellipse cx="22" cy="24" rx="11" ry="13" fill={g.ball(RED)} />
          <ellipse cx="42" cy="20" rx="11" ry="13" fill={g.ball(['#bfdbfe', '#3b82f6', '#1e3a8a'])} />
          <ellipse cx="32" cy="30" rx="10" ry="12" fill={g.ball(['#fef9c3', '#facc15', '#a16207'])} />
          <Shine cx={18} cy={18} rx={3} ry={4.5} rot={20} />
          <Shine cx={38} cy={14} rx={3} ry={4.5} rot={20} />
          <Shine cx={28} cy={25} rx={2.6} ry={4} rot={20} />
        </>
      );
    case 'map':
      return (
        <>
          <Floor rx={24} />
          <path d="M6 14 L22 8 L42 14 L58 8 V50 L42 56 L22 50 L6 56Z" fill={g.face(['#fff8e6', '#e8cf9a'])} stroke="#8a5a1f" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M22 8 V50 M42 14 V56" stroke="#c99a52" strokeWidth="1.3" />
          <path d="M12 44 Q18 30 28 34 T40 22 T52 14" stroke="#d6283b" strokeWidth="2.2" strokeDasharray="1 4" strokeLinecap="round" fill="none" />
          <path d="M48 6 a5 5 0 0 1 10 0 c0 4 -5 8 -5 8 s-5 -4 -5 -8z" fill={g.ball(RED)} />
        </>
      );
    case 'puzzle':
      return (
        <>
          <Floor rx={20} />
          <path d="M10 18 H24 Q24 10 30 10 Q36 10 36 18 H50 V32 Q58 32 58 38 Q58 44 50 44 V56 H10Z" fill={g.face(['#c4b5fd', '#6d28d9'])} />
          <Shine cx={18} cy={24} rx={5} ry={2.5} />
        </>
      );
    case 'star':
    default:
      return (
        <>
          <Floor rx={16} />
          <path d="M32 6 L38.5 22.6 L56 23.4 L42.3 34.4 L47 51.4 L32 41.6 L17 51.4 L21.7 34.4 L8 23.4 L25.5 22.6Z" fill={g.ball(GOLD)} />
          <Shine cx={26} cy={22} rx={4} ry={2.5} />
        </>
      );
  }
}

export function Icon3d({ name, className = 'w-12 h-12', label }: { name: Icon3dName; className?: string; label?: string }) {
  const g = useGrad();
  const body = draw(name, g);
  return (
    <svg viewBox="0 0 64 64" className={`${className} select-none`} direction="ltr" style={{ direction: 'ltr', overflow: 'visible' }} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {g.defs()}
      {body}
    </svg>
  );
}

/** One 3D icon per lab (ToolsHubView), so each card says what it is at a glance. */
export const LAB_ICON3D: Record<string, Icon3dName> = {
  wilayas_map: 'algeria', history_museum: 'museum', algerian_market: 'market', souk_lab: 'market',
  world_flags_lab: 'flags', cem_prep_lab: 'graduation', cahiers_lab: 'notebook', wudu_lab: 'drop',
  salat_lab: 'prayerMat', mosque_adab_lab: 'mosque', road_code_lab: 'trafficLight', topography_map: 'mountains',
  quran_lab: 'book', primary_math_ops: 'times', soroban: 'abacus', multiplication: 'times',
  educational_calculator: 'calculator', converter: 'geometry', geometry: 'geometry', fractions_lab: 'fraction',
  area_grid: 'grid', clock_trainer: 'clock', science_lab: 'flask', electricity: 'bulb',
  primary_discovery: 'magnifier', human_anatomy: 'heart', earth_cycles: 'earthCycle', french_projects: 'pen',
  english_audio_dialogues: 'speech', touch_writing: 'pen', arabic_conjugator: 'letters', french_lab: 'speech',
  english_lab: 'speech', tamazight_lab: 'tifinagh', tamazight_curriculum: 'tifinagh', syllable_studio: 'letters',
  speed_reading: 'book',
};
