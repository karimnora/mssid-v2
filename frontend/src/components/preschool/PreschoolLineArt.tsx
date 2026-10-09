import React from 'react';
import { COLORING_ART, ColoringArtId } from '../../data/preschool/coloringArt';

export const PreschoolLineArt: React.FC<{ id: ColoringArtId; className?: string; size?: number; title?: string }> = ({ id, className, size, title }) => (
  <svg viewBox="0 0 400 400" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
    {COLORING_ART[id].map((d, i) => <path key={i} d={d} />)}
  </svg>
);
