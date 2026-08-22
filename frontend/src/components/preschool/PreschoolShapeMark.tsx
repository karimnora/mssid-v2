import React from 'react';

type ShapeKind = 'circle' | 'square' | 'triangle' | 'diamond' | 'star' | 'heart';

const EMOJI_TO_SHAPE: Record<string, ShapeKind> = {
  '⚪': 'circle', '⭕': 'circle', '🔵': 'circle',
  '🟦': 'square', '⬜': 'square', '🔲': 'square',
  '🔺': 'triangle',
  '🔷': 'diamond', '🔹': 'diamond', '💎': 'diamond', '♦️': 'diamond',
  '⭐': 'star', '🌟': 'star',
  '❤️': 'heart', '♥': 'heart', '💌': 'heart',
};

export function isGeometricShape(asset: string): boolean {
  return asset in EMOJI_TO_SHAPE;
}

interface PreschoolShapeMarkProps {
  asset: string;
  size?: number;
  className?: string;
}

/** Crisp SVG shapes — emoji diamonds/squares often look identical on Windows. */
export const PreschoolShapeMark: React.FC<PreschoolShapeMarkProps> = ({
  asset, size = 56, className = '',
}) => {
  const kind = EMOJI_TO_SHAPE[asset];
  if (!kind) {
    return <span className={className} style={{ fontSize: size * 0.9 }}>{asset}</span>;
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      {kind === 'circle' && (
        <circle cx="50" cy="50" r="38" fill="#f8fafc" stroke="#94a3b8" strokeWidth="6" />
      )}
      {kind === 'square' && (
        <rect x="16" y="16" width="68" height="68" rx="8" fill="#38bdf8" stroke="#0369a1" strokeWidth="6" />
      )}
      {kind === 'triangle' && (
        <polygon points="50,12 90,86 10,86" fill="#fb7185" stroke="#be123c" strokeWidth="6" strokeLinejoin="round" />
      )}
      {kind === 'diamond' && (
        <polygon points="50,6 90,50 50,94 10,50" fill="#22d3ee" stroke="#0e7490" strokeWidth="6" strokeLinejoin="round" />
      )}
      {kind === 'star' && (
        <polygon
          points="50,8 61,38 94,38 67,58 78,90 50,70 22,90 33,58 6,38 39,38"
          fill="#fbbf24"
          stroke="#b45309"
          strokeWidth="4"
          strokeLinejoin="round"
        />
      )}
      {kind === 'heart' && (
        <path
          d="M50 86 C50 86 12 58 12 36 C12 22 24 14 36 14 C44 14 50 20 50 20 C50 20 56 14 64 14 C76 14 88 22 88 36 C88 58 50 86 50 86 Z"
          fill="#f43f5e"
          stroke="#9f1239"
          strokeWidth="5"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
};
