import React from 'react';
import { PreschoolColorDot, PreschoolShapeMark, isColorDot, isGeometricShape } from './PreschoolShapeMark';
import { PreschoolFlagMark, isFlagEmoji } from './PreschoolFlagMark';

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
  if (isColorDot(asset)) return <PreschoolColorDot asset={asset} size={size} className={className} />;
  if (isGeometricShape(asset)) return <PreschoolShapeMark asset={asset} size={size} className={className} />;
  if (isFlagEmoji(asset)) return <PreschoolFlagMark asset={asset} size={size} className={className} />;
  return (
    <span className={textClassName ?? className} style={textClassName ? undefined : { fontSize: size * 0.9 }}>
      {asset}
    </span>
  );
};
