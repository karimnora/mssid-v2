import React from 'react';
import breadArt from '../../assets/labs/souk/bread.webp';
import milkArt from '../../assets/labs/souk/milk.webp';
import datesArt from '../../assets/labs/souk/dates.webp';
import tomatoesArt from '../../assets/labs/souk/tomatoes.webp';

/** Original vector art for the souk lab: goods on the stalls and Algerian dinar pieces. */
type ArtProps = { size?: number; className?: string };

const GOODS: Record<string,string> = { bread: breadArt, milk: milkArt, dates: datesArt, veg: tomatoesArt };
export function SoukItemArt({ id, size = 64, className }: ArtProps & { id: string }) {
  const src = GOODS[id];
  return src ? <img src={src} alt="" aria-hidden="true" width={size} height={size} className={className} style={{ objectFit: 'contain' }} draggable={false} /> : null;
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
