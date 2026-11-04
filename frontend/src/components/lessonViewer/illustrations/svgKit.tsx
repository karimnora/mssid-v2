import React from 'react';

/** Shared pieces for the lesson drawings (5AP math, 5AP Arabic…). */
export const FONT = "Cairo, 'Noto Naskh Arabic', Tahoma, sans-serif";
export const INK = '#0f172a';
export const MUTED = '#475569';
export const GREEN = '#15803d';
export const BLUE = '#1d4ed8';
export const GOLD = '#f5b301';
export const ORANGE = '#c2410c';
export const VIOLET = '#7c3aed';

export type TextProps = { x: number; y: number; size?: number; fill?: string; weight?: number; anchor?: 'start' | 'middle' | 'end'; children: React.ReactNode };

/** Arabic label (right-to-left shaping and number order). */
export function Ar({ x, y, size = 14, fill = INK, weight = 700, anchor = 'middle', children }: TextProps) {
  return (
    <text x={x} y={y} fontSize={size} fill={fill} fontWeight={weight} textAnchor={anchor} direction="rtl" fontFamily={FONT}>
      {children}
    </text>
  );
}

/** Numbers and formulas, left to right. */
export function Num({ x, y, size = 16, fill = INK, weight = 800, anchor = 'middle', children }: TextProps) {
  return (
    <text x={x} y={y} fontSize={size} fill={fill} fontWeight={weight} textAnchor={anchor} direction="ltr" fontFamily="'Segoe UI', Roboto, Arial, sans-serif">
      {children}
    </text>
  );
}

export function Frame({ label, children, height = 220 }: { label: string; children: React.ReactNode; height?: number }) {
  return (
    // The page is right-to-left: the drawing itself is laid out left to right, Arabic labels opt into RTL.
    <svg viewBox={`0 0 380 ${height}`} role="img" aria-label={label} className="w-full h-auto" direction="ltr" style={{ maxWidth: 520, direction: 'ltr' }}>
      <rect x="1" y="1" width="378" height={height - 2} rx="18" fill="#fffbf2" stroke="#e7e2d7" strokeWidth="2" />
      {children}
    </svg>
  );
}
