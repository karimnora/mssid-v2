import React from 'react';

/** Original vector art for the souk lab: goods on the stalls and Algerian dinar pieces. */
type ArtProps = { size?: number; className?: string };

export function SoukItemArt({ id, size = 64, className }: ArtProps & { id: string }) {
  const common = { width: size, height: size, viewBox: '0 0 64 64', className, 'aria-hidden': true } as const;
  switch (id) {
    case 'bread':
      return (
        <svg {...common}>
          <ellipse cx="32" cy="40" rx="27" ry="15" fill="#B9782F" />
          <ellipse cx="32" cy="36" rx="25" ry="14" fill="#E3A857" />
          <path d="M14 33c6-6 30-6 36 0" stroke="#F6D29A" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M20 40l4-6M30 41l3-7M40 40l3-6" stroke="#A8641F" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'milk':
      return (
        <svg {...common}>
          <path d="M18 14h28l4 40a4 4 0 01-4 4H18a4 4 0 01-4-4z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
          <path d="M18 14l4-6h20l4 6" fill="#E2E8F0" />
          <rect x="15" y="30" width="34" height="12" fill="#2563EB" />
          <text x="32" y="39.5" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff">حليب</text>
        </svg>
      );
    case 'dates':
      return (
        <svg {...common}>
          <rect x="8" y="28" width="48" height="24" rx="4" fill="#C2410C" />
          <rect x="8" y="28" width="48" height="7" rx="3" fill="#EA580C" />
          {[16, 26, 36, 46].map((x, i) => (
            <ellipse key={x} cx={x} cy={i % 2 ? 22 : 24} rx="5" ry="8" fill="#7C2D12" transform={`rotate(${i % 2 ? 12 : -12} ${x} 24)`} />
          ))}
          {[16, 26, 36, 46].map((x) => (
            <ellipse key={`h${x}`} cx={x - 1.5} cy="20" rx="1.5" ry="3" fill="#B45309" opacity=".7" />
          ))}
        </svg>
      );
    case 'veg':
      return (
        <svg {...common}>
          {[
            [22, 40],
            [42, 40],
            [32, 26],
          ].map(([x, y]) => (
            <g key={`${x}-${y}`}>
              <circle cx={x} cy={y} r="13" fill="#DC2626" />
              <circle cx={x - 4} cy={y - 4} r="3.5" fill="#FCA5A5" opacity=".8" />
              <path d={`M${x - 5} ${y - 12}l5 3 5-3-2 5h-6z`} fill="#16A34A" />
            </g>
          ))}
        </svg>
      );
    default:
      return null;
  }
}

/** Coins up to 100 DA, notes from 200 DA, as on Algerian money (colours simplified, no real design copied). */
export function DinarPiece({ value, size = 64 }: { value: number; size?: number }) {
  if (value >= 200) {
    const fill = value >= 500 ? '#7E22CE' : '#A16207';
    return (
      <svg width={size * 1.5} height={size * 0.8} viewBox="0 0 96 52" aria-hidden="true">
        <rect x="2" y="2" width="92" height="48" rx="6" fill={fill} />
        <rect x="8" y="8" width="80" height="36" rx="4" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="2" />
        <circle cx="26" cy="26" r="10" fill="#fff" opacity=".25" />
        <text x="62" y="32" textAnchor="middle" fontSize="18" fontWeight="800" fill="#fff">{value}</text>
      </svg>
    );
  }
  const gold = value === 20 || value === 50 || value === 100;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="34" r="27" fill={gold ? '#A16207' : '#64748B'} />
      <circle cx="32" cy="31" r="27" fill={gold ? '#FACC15' : '#CBD5E1'} />
      <circle cx="32" cy="31" r="21" fill="none" stroke={gold ? '#CA8A04' : '#94A3B8'} strokeWidth="2.5" />
      <text x="32" y="38" textAnchor="middle" fontSize={value >= 100 ? 17 : 20} fontWeight="800" fill={gold ? '#713F12' : '#334155'}>{value}</text>
    </svg>
  );
}
