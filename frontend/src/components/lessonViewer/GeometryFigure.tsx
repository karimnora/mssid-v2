import React from 'react';
import type { GeometryFigureSpec } from '../../types';

/**
 * Drawings for geometry missions. A child cannot learn "perpendicular" or "rhombus" from a sentence:
 * every figure here is the picture the text of the step talks about, with the same numbers.
 * Pure inline SVG: no image file, crisp on every phone, readable in light and dark themes.
 */
const STROKE = '#047857';
const FILL = '#d1fae5';
const ACCENT = '#d97706';
const line = { stroke: STROKE, strokeWidth: 3, strokeLinecap: 'round' as const, fill: 'none' };
const shape = { stroke: STROKE, strokeWidth: 3, strokeLinejoin: 'round' as const, fill: FILL };

const Label: React.FC<{ x: number; y: number; children: React.ReactNode; anchor?: 'start' | 'middle' | 'end'; size?: number; accent?: boolean }> = ({ x, y, children, anchor = 'middle', size = 14, accent }) => (
  <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={800} fill={accent ? ACCENT : 'currentColor'} style={{ unicodeBidi: 'plaintext' }}>{children}</text>
);

/** Small square drawn in the corner of a right angle, as in the pupil's textbook. */
const RightMark: React.FC<{ x: number; y: number; dx?: 1 | -1; dy?: 1 | -1 }> = ({ x, y, dx = 1, dy = -1 }) => (
  <path d={`M ${x + 12 * dx} ${y} L ${x + 12 * dx} ${y + 12 * dy} L ${x} ${y + 12 * dy}`} stroke={ACCENT} strokeWidth={2.5} fill="none" />
);

function Angle({ kind, cx, label }: { kind: 'acute' | 'right' | 'obtuse'; cx: number; label: string }) {
  const degrees = kind === 'acute' ? 45 : kind === 'right' ? 90 : 130;
  const theta = (degrees * Math.PI) / 180;
  const vx = cx - 30 + (kind === 'obtuse' ? 25 : 0);
  const vy = 120;
  return (
    <g>
      <path d={`M ${vx + (kind === 'obtuse' ? 42 : 62)} ${vy} L ${vx} ${vy} L ${vx + 70 * Math.cos(theta)} ${vy - 70 * Math.sin(theta)}`} {...line} />
      {kind === 'right'
        ? <RightMark x={vx} y={vy} />
        : <path d={`M ${vx + 22} ${vy} A 22 22 0 0 0 ${vx + 22 * Math.cos(theta)} ${vy - 22 * Math.sin(theta)}`} stroke={ACCENT} strokeWidth={2.5} fill="none" />}
      <Label x={cx} y={158}>{label}</Label>
    </g>
  );
}

function Figure({ spec }: { spec: GeometryFigureSpec }) {
  switch (spec.figure) {
    case 'segment_line':
      return (
        <>
          <path d="M 50 55 L 270 55" {...line} />
          <circle cx={50} cy={55} r={6} fill={ACCENT} /><circle cx={270} cy={55} r={6} fill={ACCENT} />
          <Label x={50} y={38}>A</Label><Label x={270} y={38}>B</Label>
          <Label x={160} y={84}>{spec.segmentLabelAr}</Label>
          <path d="M 45 130 L 275 130" {...line} />
          <path d="M 12 130 L 45 130 M 275 130 L 308 130" {...line} strokeDasharray="3 8" />
          <Label x={160} y={160}>{spec.lineLabelAr}</Label>
        </>
      );
    case 'angles':
      return <>{spec.kinds.map((kind, index) => <Angle key={index} kind={kind} cx={(320 / spec.kinds.length) * (index + 0.5)} label={spec.labelsAr[index] ?? ''} />)}</>;
    case 'lines':
      return spec.relation === 'perpendicular' ? (
        <>
          <path d="M 40 105 L 280 105 M 160 18 L 160 168" {...line} />
          <RightMark x={160} y={105} />
          <Label x={292} y={110} anchor="start" size={13}>(d)</Label><Label x={170} y={24} anchor="start" size={13}>(k)</Label>
        </>
      ) : (
        <>
          <path d="M 35 70 L 285 50 M 35 135 L 285 115" {...line} />
          <Label x={160} y={166}>{spec.labelAr}</Label>
        </>
      );
    case 'solid': {
      const w = spec.kind === 'cube' ? 100 : 150;
      const x0 = spec.kind === 'cube' ? 85 : 55;
      const y0 = 60;
      const h = 100;
      return (
        <>
          <path d={`M ${x0} ${y0} l 40 -35 l ${w} 0 l -40 35 Z`} {...shape} fill="#a7f3d0" />
          <path d={`M ${x0 + w} ${y0} l 40 -35 l 0 ${h} l -40 35 Z`} {...shape} fill="#6ee7b7" />
          <rect x={x0} y={y0} width={w} height={h} {...shape} />
          <path d={`M ${x0} ${y0 + h} l 40 -35 l ${w} 0 M ${x0 + 40} ${y0 + h - 35} l 0 ${-h}`} stroke={STROKE} strokeWidth={2} strokeDasharray="5 6" fill="none" />
          <circle cx={x0 + w + 40} cy={y0 - 35} r={6} fill={ACCENT} />
          <Label x={x0 + w / 2 + 14} y={y0 + h * 0.4}>{spec.faceLabelAr}</Label>
          <Label x={x0 + w / 2} y={y0 + h + 18} accent>{spec.edgeLabelAr}</Label>
          <Label x={x0 + w + 50} y={y0 - 30} anchor="start" accent>{spec.vertexLabelAr}</Label>
        </>
      );
    }
    case 'cube_net':
      return (
        <>
          {[0, 1, 2, 3].map(row => <rect key={row} x={140} y={10 + row * 40} width={40} height={40} {...shape} />)}
          <rect x={100} y={50} width={40} height={40} {...shape} /><rect x={180} y={50} width={40} height={40} {...shape} />
          {[1, 2, 3, 4].map(n => <Label key={n} x={160} y={n * 40 - 4} size={13}>{n}</Label>)}
          <Label x={120} y={76} size={13}>5</Label><Label x={200} y={76} size={13}>6</Label>
        </>
      );
    case 'quadrilaterals':
      return (
        <>
          <rect x={20} y={45} width={70} height={70} {...shape} /><RightMark x={20} y={115} />
          <rect x={115} y={58} width={100} height={57} {...shape} /><RightMark x={115} y={115} />
          <path d="M 270 30 L 305 82 L 270 134 L 235 82 Z" {...shape} />
          {spec.labelsAr.map((label, index) => <Label key={index} x={[55, 165, 270][index]} y={160} size={13}>{label}</Label>)}
        </>
      );
    case 'rectangle': {
      const scale = Math.min(210 / spec.width, 105 / spec.height);
      const w = spec.width * scale;
      const h = spec.height * scale;
      const x0 = (300 - w) / 2;
      const y0 = (140 - h) / 2 + 8;
      const unit = spec.unit ? ` ${spec.unit}` : '';
      return (
        <>
          <rect x={x0} y={y0} width={w} height={h} {...shape} />
          {spec.grid && Array.from({ length: spec.width - 1 }, (_, i) => <path key={`v${i}`} d={`M ${x0 + (i + 1) * scale} ${y0} l 0 ${h}`} stroke={STROKE} strokeWidth={1.5} />)}
          {spec.grid && Array.from({ length: spec.height - 1 }, (_, i) => <path key={`h${i}`} d={`M ${x0} ${y0 + (i + 1) * scale} l ${w} 0`} stroke={STROKE} strokeWidth={1.5} />)}
          {spec.split && Array.from({ length: spec.split - 1 }, (_, i) => <path key={`s${i}`} d={`M ${x0 + ((i + 1) * w) / spec.split!} ${y0} l 0 ${h}`} stroke={ACCENT} strokeWidth={3} strokeDasharray="7 7" />)}
          <text x={x0 + w / 2} y={y0 + h + 20} textAnchor="middle" fontSize={14} fontWeight={800} fill="currentColor" direction="ltr">{spec.width}{unit}</text>
          <text x={x0 + w + 8} y={y0 + h / 2 + 5} textAnchor="start" fontSize={14} fontWeight={800} fill="currentColor" direction="ltr">{spec.height}{unit}</text>
        </>
      );
    }
    case 'triangles':
      return (
        <>
          <path d="M 55 46 L 15 115 L 95 115 Z" {...shape} />
          <path d="M 160 22 L 130 115 L 190 115 Z" {...shape} />
          <path d="M 228 115 L 305 115 L 228 45 Z" {...shape} /><RightMark x={228} y={115} />
          {spec.labelsAr.map((label, index) => <Label key={index} x={[55, 160, 266][index]} y={142} size={12}>{label}</Label>)}
        </>
      );
    case 'circle':
      return (
        <>
          <circle cx={160} cy={90} r={70} {...shape} />
          <path d="M 90 90 L 230 90" stroke={ACCENT} strokeWidth={3} strokeLinecap="round" />
          <path d="M 160 90 L 205 36" {...line} />
          <circle cx={160} cy={90} r={5} fill={STROKE} />
          <Label x={160} y={108} size={13}>{spec.centerLabelAr}</Label>
          <Label x={174} y={58} anchor="end" size={13}>{spec.radiusLabelAr}</Label>
          <Label x={112} y={84} size={13} accent>{spec.diameterLabelAr}</Label>
        </>
      );
  }
}

export const GeometryFigure: React.FC<{ spec: GeometryFigureSpec; label: string }> = ({ spec, label }) => (
  <svg viewBox="0 0 320 180" role="img" aria-label={label} data-geometry-figure={spec.figure} className="mx-auto w-full max-w-md rounded-2xl bg-white p-2 text-slate-800 shadow-[0_3px_0_#a7f3d0]">
    <Figure spec={spec} />
  </svg>
);
