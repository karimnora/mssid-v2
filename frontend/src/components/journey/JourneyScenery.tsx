import React from 'react';
import type { JourneyWorldId } from '../../data/journey/journeyWorlds';
import { WORLD_DECOR } from '../world/worldArt';
import { WorldAmbience, WorldAmbienceDefs } from '../world/WorldAmbience';

/*
 * Backdrops of the journey worlds. Each world is drawn in its own 1600 × 900 box and the map
 * translates it into place: its painted decor (components/world/worldArt.ts) over its sky
 * gradient, with the ambient life layer (WorldAmbience) on top.
 */

/** Sky gradient of each world: behind its decor's faded edges, and borrowed across the seams. */
export const WORLD_SKY: Record<JourneyWorldId, string> = {
  sahara: 'jw-sky-sahara',
  casbah: 'jw-sky-casbah',
  sea: 'jw-sky-sea',
  constantine: 'jw-sky-constantine',
  djurdjura: 'jw-sky-djurdjura',
  timgad: 'jw-sky-timgad',
  tassili: 'jw-sky-tassili',
  space: 'jw-sky-space',
};

function vGrad(id: string, stops: Array<[number, string]>) {
  return (
    <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
      {stops.map(([o, c]) => (
        <stop key={o} offset={o} stopColor={c} />
      ))}
    </linearGradient>
  );
}

export function JourneySceneryDefs() {
  return (
    <>
      {vGrad('jw-sky-sahara', [[0, '#9fbde0'], [0.6, '#f6d2a6']])}
      {vGrad('jw-sky-casbah', [[0, '#5fa9f0'], [1, '#d6ebfd']])}
      {vGrad('jw-sky-sea', [[0, '#8ec5f0'], [1, '#e4f3fc']])}
      {vGrad('jw-sky-constantine', [[0, '#7fc4f0'], [1, '#f3fbff']])}
      {vGrad('jw-sky-djurdjura', [[0, '#5d97d8'], [0.6, '#d3e6f4']])}
      {vGrad('jw-sky-timgad', [[0, '#86aed4'], [0.7, '#f3cf9f']])}
      {vGrad('jw-sky-tassili', [[0, '#26236e'], [0.55, '#8b4f8e'], [1, '#f0955e']])}
      {vGrad('jw-sky-space', [[0, '#070a30'], [1, '#1d3a9e']])}
      {/* Painted decors fade out on their left and right edges, so two worlds never meet on a hard line. */}
      <linearGradient id="jw-paint-edge" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#000" />
        <stop offset=".1" stopColor="#fff" />
        <stop offset=".9" stopColor="#fff" />
        <stop offset="1" stopColor="#000" />
      </linearGradient>
      <mask id="jw-paint-fade" maskContentUnits="objectBoundingBox">
        <rect width="1" height="1" fill="url(#jw-paint-edge)" />
      </mask>
      <linearGradient id="jw-hfade" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff" />
        <stop offset="1" stopColor="#000" />
      </linearGradient>
      <WorldAmbienceDefs />
    </>
  );
}

export const WorldBackdrop = React.memo(function WorldBackdrop({ id }: { id: JourneyWorldId }) {
  const decor = WORLD_DECOR[id];
  return (
    <g>
      <rect width="1600" height="900" fill={`url(#${WORLD_SKY[id]})`} />
      <image href={decor.landscape} x="0" y={decor.mapOffsetY ?? 0} width="1600" height="893" preserveAspectRatio="none" mask="url(#jw-paint-fade)" />
      <WorldAmbience id={id} />
    </g>
  );
});
