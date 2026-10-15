import { PreschoolDiscoveryArt } from './PreschoolDiscoveryArt';
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
  if (asset.startsWith('discovery:')) return <PreschoolDiscoveryArt asset={asset} size={size} className={className}/>;
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
