import React from 'react';
import { PreschoolColorDot, PreschoolShapeMark, isColorDot, isGeometricShape } from './PreschoolShapeMark';
import { PreschoolFlagMark, isFlagEmoji } from './PreschoolFlagMark';

import { COLORING_ART, ColoringArtId } from '../../data/preschool/coloringArt';
import { PreschoolLineArt } from './PreschoolLineArt';

interface PreschoolAssetProps {
  asset: string;
  size?: number;
  className?: string;
  textClassName?: string;
}

/** Windows-safe picture for a preschool glyph (color disc, shape, flag, or emoji). */
export const PreschoolAsset: React.FC<PreschoolAssetProps> = ({
  asset,
  size = 56,
  className = '',
  textClassName,
}) => {
  if (asset === 'story:dates') return <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden="true" className={className}>
    <ellipse cx="40" cy="61" rx="33" ry="9" fill="#f5dfb3" />
    {[[-15, 0, -20], [4, -7, 12], [18, 7, 35]].map(([x, y, angle], i) => <g key={i} transform={`translate(${40 + x} ${40 + y}) rotate(${angle})`}>
      <ellipse rx="12" ry="23" fill="#8b451f" /><path d="M0 -16 Q-6 0 0 17" stroke="#c68145" strokeWidth="3" fill="none" />
    </g>)}
  </svg>;
  if (asset.startsWith('art:') && asset.slice(4) in COLORING_ART) {
    return <PreschoolLineArt id={asset.slice(4) as ColoringArtId} size={size} className={`shrink-0 ${className}`} />;
  }
  if (isColorDot(asset)) return <PreschoolColorDot asset={asset} size={size} className={className} />;
  if (isGeometricShape(asset)) return <PreschoolShapeMark asset={asset} size={size} className={className} />;
  if (isFlagEmoji(asset)) return <PreschoolFlagMark asset={asset} size={size} className={className} />;
  return (
    <span className={textClassName ?? className} style={textClassName ? undefined : { fontSize: size * 0.9 }}>
      {asset}
    </span>
  );
};
