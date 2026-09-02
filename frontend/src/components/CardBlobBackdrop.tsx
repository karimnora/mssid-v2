import React from 'react';

/**
 * Decorative layered-blob overlay for solid-color "kids" cards (labs, poles...).
 * White/black translucent shapes only, so it drops onto any existing `kids-card-*`
 * gradient without needing its own color prop — the same "cadran" depth treatment
 * used by the illustrated subject cards, generalized to plain gradient cards.
 * Render it first inside a `relative overflow-hidden` card, before the real content.
 */
export const CardBlobBackdrop: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 200 140"
    preserveAspectRatio="none"
    aria-hidden="true"
    className={`kids-blob-backdrop pointer-events-none absolute inset-0 w-full h-full ${className}`}
  >
    <path
      className="kids-blob-float-a"
      d="M200 20C200 85 145 140 80 140C40 140 10 110 0 88L0 0L200 0V20Z"
      fill="#FFFFFF"
      fillOpacity="0.14"
    />
    <circle className="kids-blob-float-b" cx="158" cy="98" r="58" fill="#FFFFFF" fillOpacity="0.10" />
    <path
      d="M55 138C100 146 160 112 178 68C196 24 148 0 108 24C68 48 5 128 55 138Z"
      fill="#000000"
      fillOpacity="0.06"
    />
  </svg>
);
