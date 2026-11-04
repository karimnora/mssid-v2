import React from 'react';
import type { PrimaryGrade } from '../../types';
import type { JourneyWorldId } from '../../data/journey/journeyWorlds';
import { ALGERIA_OUTLINE_PATH } from '../../data/algeriaMapOutline';

/**
 * Grade identity of Didou's maps (V2): the eight places keep their landscape, and each grade adds
 * (1) its own light — 2AP pink morning, 3AP spring, 4AP golden afternoon, 5AP violet evening — and
 * (2) its own landmarks in every world, drawn from what the child learns there that year.
 * Everything sits in the sky band (y < 460) or the bottom edge, away from the stations' path.
 * Map units: one world is 1600 × 900.
 */
const FONT = "Cairo, 'Noto Naskh Arabic', Tahoma, sans-serif";

/** Arabic reads right to left; numbers and formulas (no Arabic letter) left to right. */
function Label({ x, y, children, size = 34, fill = '#13206b' }: { x: number; y: number; children: React.ReactNode; size?: number; fill?: string }) {
  const arabic = /[؀-ۿ]/.test(String(children));
  return (
    <text x={x} y={y} fontSize={size} fontWeight={900} fill={fill} textAnchor="middle" direction={arabic ? 'rtl' : 'ltr'} style={{ direction: arabic ? 'rtl' : 'ltr', unicodeBidi: 'plaintext' }} fontFamily={arabic ? FONT : "'Segoe UI', Arial, sans-serif"}>{children}</text>
  );
}

function Balloon({ x, y, color, label }: { x: number; y: number; color: string; label: string }) {
  return (
    <g className="jgd-float">
      <path d={`M${x} ${y + 62} q-10 40 6 90`} stroke="#fff" strokeWidth="3" fill="none" opacity=".8" />
      <ellipse cx={x} cy={y} rx="46" ry="56" fill={color} />
      <ellipse cx={x - 16} cy={y - 22} rx="12" ry="18" fill="#fff" opacity=".45" />
      <path d={`M${x - 8} ${y + 56} h16 l-8 10z`} fill={color} />
      <text x={x} y={y + 14} fontSize="40" fontWeight="900" fill="#fff" textAnchor="middle" fontFamily="'Segoe UI', Arial, sans-serif">{label}</text>
    </g>
  );
}

function Kite({ x, y, color, label }: { x: number; y: number; color: string; label: string }) {
  return (
    <g className="jgd-sway">
      <path d={`M${x} ${y} l60 70 l-60 90 l-60 -90z`} fill={color} stroke="#fff" strokeWidth="4" />
      <path d={`M${x} ${y} v160 M${x - 60} ${y + 70} h120`} stroke="#fff" strokeWidth="3" opacity=".7" />
      <path d={`M${x} ${y + 160} q30 40 0 80 q-30 40 0 80`} stroke="#fff" strokeWidth="3" fill="none" />
      <text x={x} y={y + 92} fontSize="34" fontWeight="900" fill="#fff" textAnchor="middle" fontFamily="'Segoe UI', Arial, sans-serif">{label}</text>
    </g>
  );
}

function Flag({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0 V170" stroke="#6b4a2a" strokeWidth="6" strokeLinecap="round" />
      <g className="jgd-wave">
        <rect x="3" y="4" width="48" height="66" fill="#006233" />
        <rect x="51" y="4" width="48" height="66" fill="#fff" />
        <circle cx="51" cy="37" r="17" fill="#d21034" />
        <circle cx="56" cy="37" r="14" fill="#fff" />
        <path d="M63 30 l2.6 6.6 7 .3 -5.5 4.4 2 6.8 -6.1 -4 -6 4 2 -6.8 -5.6 -4.4 7.1 -.3z" fill="#d21034" />
      </g>
    </g>
  );
}

function Tablet({ x, y, lines, color = '#13206b' }: { x: number; y: number; lines: string[]; color?: string }) {
  const h = 30 + lines.length * 46;
  return (
    <g>
      <rect x={x - 150} y={y} width="300" height={h} rx="22" fill="#fffaf0" stroke={color} strokeWidth="6" />
      <rect x={x - 150} y={y} width="300" height="14" rx="7" fill={color} />
      {lines.map((line, i) => <Label key={line} x={x} y={y + 58 + i * 46} size={32} fill={color}>{line}</Label>)}
      <path d={`M${x - 90} ${y + h} v60 M${x + 90} ${y + h} v60`} stroke="#8a5a1f" strokeWidth="8" />
    </g>
  );
}

function School({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-150" y="40" width="300" height="140" fill="#fff6e6" stroke="#c99a52" strokeWidth="4" />
      <path d="M-170 46 L0 -30 L170 46Z" fill="#d6283b" />
      {[-110, -50, 50, 110].map((wx) => <rect key={wx} x={wx - 20} y="78" width="40" height="40" rx="6" fill="#62b6e8" stroke="#fff" strokeWidth="4" />)}
      <path d="M-24 180 V128 a24 24 0 0 1 48 0 V180Z" fill="#2f6fe0" />
      <Label x={0} y={30} size={26} fill="#fff">مَدْرَسَتِي</Label>
      <Flag x={150} y={-150} s={0.8} />
    </g>
  );
}

function Sheep({ x, y, dark = false }: { x: number; y: number; dark?: boolean }) {
  const wool = dark ? '#5b4636' : '#fffdf5';
  return (
    <g transform={`translate(${x} ${y})`}>
      {[[-30, 0], [0, -14], [30, 0], [0, 10], [-14, -6], [16, -6]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r="26" fill={wool} />)}
      <ellipse cx="-56" cy="-4" rx="18" ry="22" fill="#3b2a1e" />
      <circle cx="-60" cy="-10" r="3" fill="#fff" />
      <path d="M-24 28 v30 M-4 30 v30 M16 30 v30 M34 28 v30" stroke="#3b2a1e" strokeWidth="7" strokeLinecap="round" />
    </g>
  );
}

function Shape({ x, y, kind, color }: { x: number; y: number; kind: 'square' | 'triangle' | 'circle'; color: string }) {
  return (
    <g className="jgd-float">
      {kind === 'square' && <rect x={x - 50} y={y - 50} width="100" height="100" rx="10" fill={color} stroke="#fff" strokeWidth="6" />}
      {kind === 'triangle' && <path d={`M${x} ${y - 60} L${x + 62} ${y + 50} H${x - 62}Z`} fill={color} stroke="#fff" strokeWidth="6" strokeLinejoin="round" />}
      {kind === 'circle' && <circle cx={x} cy={y} r="56" fill={color} stroke="#fff" strokeWidth="6" />}
    </g>
  );
}

function RockText({ x, y, words }: { x: number; y: number; words: string[] }) {
  return (
    <g>
      <path d={`M${x - 220} ${y + 90} Q${x - 240} ${y - 40} ${x - 120} ${y - 60} Q${x} ${y - 90} ${x + 140} ${y - 50} Q${x + 240} ${y - 20} ${x + 220} ${y + 90}Z`} fill="#b86b3a" opacity=".9" />
      {words.map((w, i) => <Label key={w} x={x - 140 + i * 140} y={y + 30} size={40} fill="#fde7c2">{w}</Label>)}
    </g>
  );
}

function Planet({ x, y, r, color, label }: { x: number; y: number; r: number; color: string; label: string }) {
  return (
    <g className="jgd-float">
      <circle cx={x} cy={y} r={r} fill={color} />
      <circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.3} fill="#fff" opacity=".3" />
      <ellipse cx={x} cy={y} rx={r * 1.6} ry={r * 0.35} fill="none" stroke="#ffd23f" strokeWidth="6" transform={`rotate(-18 ${x} ${y})`} />
      <text x={x} y={y + r * 0.22} fontSize={r * 0.62} fontWeight="900" fill="#fff" textAnchor="middle" direction="rtl" fontFamily={FONT}>{label}</text>
    </g>
  );
}

function Clock({ x, y, r = 70 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#fff" stroke="#d6283b" strokeWidth="10" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * Math.PI) / 6;
        return <circle key={i} cx={x + r * 0.78 * Math.sin(a)} cy={y - r * 0.78 * Math.cos(a)} r={i % 3 ? 3 : 6} fill="#13206b" />;
      })}
      <path className="jgd-spin" style={{ transformOrigin: `${x}px ${y}px` }} d={`M${x} ${y} V${y - r * 0.6}`} stroke="#13206b" strokeWidth="7" strokeLinecap="round" />
      <path d={`M${x} ${y} L${x + r * 0.42} ${y + r * 0.18}`} stroke="#13206b" strokeWidth="9" strokeLinecap="round" />
    </g>
  );
}

/** Maqam Echahid: three standing palm leaves meeting high, and the eternal flame. */
function MaqamEchahid({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-70 300 Q-40 120 0 0 Q-10 150 -20 300Z" fill="#e8e2d4" stroke="#b9ae96" strokeWidth="3" />
      <path d="M70 300 Q40 120 0 0 Q10 150 20 300Z" fill="#d9d1bf" stroke="#b9ae96" strokeWidth="3" />
      <path d="M0 300 Q8 140 0 0 Q-8 140 0 300Z" fill="#f4efe4" />
      <path d="M-12 -6 Q0 -40 12 -6 Q0 4 -12 -6Z" fill="#f59e0b" className="jgd-flame" />
      <rect x="-90" y="300" width="180" height="22" rx="4" fill="#c8bea8" />
    </g>
  );
}

function AlgeriaMap({ x, y, w = 260, legend = false }: { x: number; y: number; w?: number; legend?: boolean }) {
  return (
    <g>
      <rect x={x - 20} y={y - 20} width={w + 40} height={w + 40 + (legend ? 70 : 0)} rx="20" fill="#fffaf0" stroke="#8a5a1f" strokeWidth="5" />
      <svg x={x} y={y} width={w} height={w} viewBox="45 50 380 386">
        <path d={ALGERIA_OUTLINE_PATH} fill="#86efac" stroke="#166534" strokeWidth="6" />
        <circle cx="258.9" cy="65.4" r="12" fill="#d6283b" />
      </svg>
      {legend && (
        <g>
          <rect x={x + 10} y={y + w + 14} width="30" height="30" fill="#86efac" stroke="#166534" strokeWidth="3" />
          <circle cx={x + w / 2 + 10} cy={y + w + 29} r="12" fill="#d6283b" />
          <Label x={x + w - 30} y={y + w + 40} size={24}>مِفْتَاحٌ</Label>
        </g>
      )}
    </g>
  );
}

function Bubbles({ x, y }: { x: number; y: number }) {
  return (
    <g className="jgd-rise">
      {[[0, 0, 34], [70, -60, 22], [-60, -90, 26], [30, -150, 16], [110, 20, 18]].map(([dx, dy, r], i) => (
        <g key={i}>
          <circle cx={x + dx} cy={y + dy} r={r} fill="#e0f2fe" fillOpacity=".55" stroke="#fff" strokeWidth="3" />
          <circle cx={x + dx - r * 0.35} cy={y + dy - r * 0.35} r={r * 0.25} fill="#fff" />
        </g>
      ))}
    </g>
  );
}

function Flowers({ x, y, n = 5 }: { x: number; y: number; n?: number }) {
  const colors = ['#f472b6', '#facc15', '#fb923c', '#a78bfa', '#f87171'];
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const fx = x + i * 70;
        const c = colors[i % colors.length];
        return (
          <g key={i}>
            <path d={`M${fx} ${y} v50`} stroke="#16a34a" strokeWidth="5" />
            {[0, 72, 144, 216, 288].map((a) => <circle key={a} cx={fx + 14 * Math.cos((a * Math.PI) / 180)} cy={y + 14 * Math.sin((a * Math.PI) / 180)} r="11" fill={c} />)}
            <circle cx={fx} cy={y} r="8" fill="#fde047" />
          </g>
        );
      })}
    </g>
  );
}

function Birds({ x, y }: { x: number; y: number }) {
  return (
    <g className="jgd-sway" stroke="#13206b" strokeWidth="5" fill="none" strokeLinecap="round">
      {[[0, 0], [60, 30], [120, -10]].map(([dx, dy], i) => <path key={i} d={`M${x + dx - 20} ${y + dy} q10 -14 20 0 q10 -14 20 0`} />)}
    </g>
  );
}

function Crown({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x - 40} y={y + 60} width="80" height="200" fill="#e9d8b4" stroke="#b98a4e" strokeWidth="4" />
      <path d={`M${x - 70} ${y + 60} l20 -70 l30 40 l20 -60 l20 60 l30 -40 l20 70z`} fill="#f5b301" stroke="#a16207" strokeWidth="4" />
      <circle cx={x} cy={y + 30} r="10" fill="#d6283b" />
    </g>
  );
}

function Bulb({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r="90" fill="#fef08a" opacity=".25" className="jgd-glow" />
      <path d={`M${x} ${y - 70} a60 60 0 0 1 38 106 q-10 10 -10 24 h-56 q0 -14 -10 -24 a60 60 0 0 1 38 -106z`} fill="#fde047" stroke="#ca8a04" strokeWidth="5" />
      <rect x={x - 28} y={y + 62} width="56" height="30" rx="6" fill="#94a3b8" />
    </g>
  );
}

function Cube({ x, y, s = 80 }: { x: number; y: number; s?: number }) {
  return (
    <g className="jgd-float">
      <path d={`M${x} ${y - s * 0.5} L${x + s * 0.9} ${y} L${x} ${y + s * 0.5} L${x - s * 0.9} ${y}Z`} fill="#fde68a" />
      <path d={`M${x - s * 0.9} ${y} L${x} ${y + s * 0.5} V${y + s * 1.5} L${x - s * 0.9} ${y + s}Z`} fill="#f59e0b" />
      <path d={`M${x + s * 0.9} ${y} L${x} ${y + s * 0.5} V${y + s * 1.5} L${x + s * 0.9} ${y + s}Z`} fill="#b45309" />
    </g>
  );
}

function Cap({ x, y }: { x: number; y: number }) {
  return (
    <g className="jgd-float">
      <path d={`M${x - 70} ${y + 10} V${y + 46} Q${x} ${y + 80} ${x + 70} ${y + 46} V${y + 10}Z`} fill="#1e293b" />
      <path d={`M${x - 140} ${y} L${x} ${y - 56} L${x + 140} ${y} L${x} ${y + 56}Z`} fill="#334155" />
      <path d={`M${x} ${y} L${x + 100} ${y + 20} V${y + 90}`} stroke="#f5b301" strokeWidth="6" fill="none" />
      <circle cx={x + 100} cy={y + 96} r="12" fill="#f5b301" />
    </g>
  );
}

type Decor = Partial<Record<JourneyWorldId, React.ReactNode>>;

const DECOR: Partial<Record<PrimaryGrade, Decor>> = {
  '2AP': {
    sahara: <><Balloon x={700} y={200} color="#f472b6" label="12" /><Balloon x={860} y={150} color="#60a5fa" label="27" /><Balloon x={1020} y={220} color="#34d399" label="49" /></>,
    casbah: <School x={1000} y={240} />,
    sea: <><Bubbles x={760} y={330} /><Bubbles x={1180} y={300} /></>,
    constantine: <><Kite x={760} y={80} color="#d6283b" label="50" /><Kite x={1120} y={60} color="#2f6fe0" label="99" /></>,
    djurdjura: <><Sheep x={1470} y={830} /><Sheep x={1330} y={850} dark /><Birds x={760} y={180} /></>,
    timgad: <><Shape x={760} y={240} kind="square" color="#60a5fa" /><Shape x={950} y={200} kind="triangle" color="#f472b6" /><Shape x={1140} y={250} kind="circle" color="#facc15" /></>,
    tassili: <RockText x={880} y={250} words={['حَرْفٌ', 'فِعْلٌ', 'اسْمٌ']} />,
    space: <><Clock x={760} y={200} /><Planet x={1100} y={260} r={70} color="#b45309" label="دج" /></>,
  },
  '3AP': {
    sahara: <Tablet x={900} y={120} lines={['3 × 4 = 12', '5 × 6 = 30']} />,
    casbah: <><Tablet x={900} y={110} lines={['مَعَالِمُ وَطَنِي']} color="#0f766e" /><Flag x={1150} y={140} s={0.9} /></>,
    sea: <><Birds x={720} y={160} /><Tablet x={1050} y={120} lines={['الْمَاضِي ← الْحَاضِرُ']} color="#1d4ed8" /></>,
    constantine: <Tablet x={900} y={100} lines={['1 000', 'm · cm · kg']} color="#7c3aed" />,
    djurdjura: <><Flowers x={1180} y={820} n={5} /><Birds x={800} y={170} /></>,
    timgad: <Tablet x={900} y={100} lines={['∟ زَاوِيَةٌ قَائِمَةٌ', 'كِتَابُ التِّلْمِيذِ']} color="#b45309" />,
    tassili: <RockText x={880} y={250} words={['مَتَى؟', 'أَيْنَ؟', 'مَنْ؟']} />,
    space: <><AlgeriaMap x={700} y={90} w={240} /><Cube x={1150} y={220} /></>,
  },
  '4AP': {
    sahara: <Tablet x={900} y={120} lines={['99 999', '+ ‎·‎ − ‎·‎ ×']} color="#c2410c" />,
    casbah: <><Crown x={1050} y={120} /><Tablet x={760} y={120} lines={['مَاسِينِيسَا']} color="#b45309" /></>,
    sea: <Bubbles x={980} y={320} />,
    constantine: <><Tablet x={760} y={110} lines={['3/4 · ½']} color="#1d4ed8" /><Tablet x={1100} y={110} lines={['L · g · m']} color="#0f766e" /></>,
    djurdjura: <><Birds x={760} y={160} /><Flowers x={1200} y={830} n={4} /></>,
    timgad: <AlgeriaMap x={820} y={70} w={220} legend />,
    tassili: <RockText x={880} y={250} words={['ئـ', 'ؤ', 'أ']} />,
    space: <><Planet x={800} y={220} r={80} color="#0ea5e9" label="🌍" /><Tablet x={1150} y={120} lines={['مُحِيطٌ']} color="#7c3aed" /></>,
  },
  '5AP': {
    sahara: <><AlgeriaMap x={700} y={80} w={230} /><Tablet x={1150} y={120} lines={['1 000 000 000']} color="#c2410c" /></>,
    casbah: <><Tablet x={880} y={100} lines={['فِعْلٌ + فَاعِلٌ', 'مُبْتَدَأٌ + خَبَرٌ']} color="#0f766e" /><Flag x={1160} y={140} s={0.9} /></>,
    sea: <><Tablet x={900} y={110} lines={['الْقَيْرَوَانُ 670 م']} color="#15803d" /><Birds x={1200} y={170} /></>,
    constantine: <Tablet x={900} y={100} lines={['157 = (12 × 13) + 1', '3/4 = 0,75']} color="#1d4ed8" />,
    djurdjura: <><Bulb x={900} y={220} /><Flowers x={1200} y={830} n={4} /></>,
    timgad: <Tablet x={900} y={100} lines={['كَانَ · إِنَّ', 'تَمْيِيزٌ: تَمْراً']} color="#7c3aed" />,
    tassili: <><MaqamEchahid x={900} y={90} s={1.05} /><Flag x={1150} y={150} s={0.9} /><Flag x={620} y={180} s={0.8} /></>,
    space: <><Cap x={900} y={200} /><Tablet x={1250} y={110} lines={['% · 0,5']} color="#7c3aed" /></>,
  },
};

/** Light of the grade over the whole world, like a time of day. */
const LIGHT: Partial<Record<PrimaryGrade, { color: string; opacity: number; blend: 'multiply' | 'soft-light' | 'screen' }>> = {
  '2AP': { color: '#ff8fb8', opacity: 0.16, blend: 'soft-light' },
  '3AP': { color: '#6ee7b7', opacity: 0.14, blend: 'soft-light' },
  '4AP': { color: '#ffb347', opacity: 0.3, blend: 'multiply' },
  '5AP': { color: '#6d4bc2', opacity: 0.38, blend: 'multiply' },
};

export function hasGradeDecor(grade: PrimaryGrade): boolean {
  return Boolean(DECOR[grade]);
}

/** Drawn over a world's backdrop, under the path and the stations. */
export const GradeDecor = React.memo(function GradeDecor({ grade, world }: { grade: PrimaryGrade; world: JourneyWorldId }) {
  const light = LIGHT[grade];
  const decor = DECOR[grade]?.[world];
  if (!light && !decor) return null;
  return (
    <g data-grade-decor={`${grade}:${world}`}>
      {light && <rect width="1600" height="900" fill={light.color} opacity={light.opacity} style={{ mixBlendMode: light.blend }} />}
      {grade === '5AP' && world !== 'space' && (
        <g fill="#fff" opacity=".7">
          {[[120, 60], [420, 110], [1480, 80], [1300, 40], [260, 160]].map(([sx, sy]) => <circle key={`${sx}-${sy}`} cx={sx} cy={sy} r="3" />)}
        </g>
      )}
      {/* The world sign stands top right of every world: landmarks keep to its left. */}
      {decor && <g transform="translate(-260 0)">{decor}</g>}
    </g>
  );
});
