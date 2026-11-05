import React from 'react';
import { DidouPortrait } from '../world/DidouPortrait';
import { DIDOU_STAND, OBJECT_ART } from '../world/worldArt';

/**
 * Didou on the journey map and planet hub: the same rendered Didou as everywhere else
 * (components/world/worldArt.ts, docs/v2-design-monde.md).
 */
type SvgProps = Omit<React.SVGProps<SVGSVGElement>, 'viewBox' | 'ref'>;

export function DidouHead(props: SvgProps) {
  return <DidouPortrait {...props} />;
}

/** Standing Didou, feet on the bottom edge of his box. */
export function DidouFull(props: SvgProps) {
  return (
    <svg viewBox={`0 0 ${DIDOU_STAND.w} ${DIDOU_STAND.h}`} aria-hidden="true" data-didou-full="" {...props}>
      <ellipse cx={DIDOU_STAND.w / 2} cy={DIDOU_STAND.h - 14} rx={DIDOU_STAND.w * 0.3} ry="16" fill="rgba(0,0,30,.28)" />
      <image href={DIDOU_STAND.src} x="0" y="0" width={DIDOU_STAND.w} height={DIDOU_STAND.h} />
    </svg>
  );
}

export function MedalArt({ color, ...props }: SvgProps & { color: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" {...props}>
      <path d="M30 4 L50 40 L70 4Z" fill="#d6283b" />
      <path d="M40 4 L50 24 L60 4Z" fill="#0f8a4b" />
      <circle cx="50" cy="62" r="32" fill={color} stroke="#fff" strokeWidth="6" />
      <path d="M50 42l6 13 14 2-10 10 2 14-12-7-12 7 2-14-10-10 14-2z" fill="#fff" />
    </svg>
  );
}

/** Rendered gold star; an empty star is the same one, faded and grey. */
export function StarIcon({ on = true, ...props }: SvgProps & { on?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" data-star={on ? 'on' : 'off'} {...props}>
      <image
        href={OBJECT_ART.star}
        x="0"
        y="0"
        width="24"
        height="24"
        opacity={on ? 1 : 0.35}
        style={on ? undefined : { filter: 'grayscale(1) brightness(1.6)' }}
      />
    </svg>
  );
}
