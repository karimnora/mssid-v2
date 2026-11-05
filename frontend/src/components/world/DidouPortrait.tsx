import React from 'react';
import { DIDOU_POSES, type DidouPose } from './worldArt';

/**
 * Didou, bust portrait (V2 "monde de jeu" design, docs/v2-design-monde.md). Rendered 3D art since
 * the pilot (docs/v2-pilote-prompts-nanobanana.md): the waist-up pose is cropped to the head and
 * scarf inside a square. Still an <svg>, so it also nests inside the journey map's SVG with
 * x / y / width / height. Decorative unless a label is given.
 */
type PortraitProps = Omit<React.SVGProps<SVGSVGElement>, 'viewBox' | 'ref'> & {
  size?: number;
  label?: string;
  /** talk (default): explaining · cheer: right answer · think: hint or answer to review · point: shows something. */
  pose?: DidouPose;
};

export function DidouPortrait({ size = 120, label, className, pose = 'talk', ...rest }: PortraitProps) {
  const art = DIDOU_POSES[pose];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      data-didou-portrait
      data-pose={pose}
      {...rest}
    >
      <image href={art.src} x="0" y="0" width="200" height="200" preserveAspectRatio="xMidYMin slice" />
    </svg>
  );
}
