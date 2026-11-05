/**
 * Rendered 3D artwork of the V2 "monde de jeu" (pilot, docs/v2-pilote-prompts-nanobanana.md).
 * Images were generated from our own prompts (Nano Banana), keyed and exported to WebP; Vite
 * hashes them and the PWA precaches them, so they also work offline.
 */
import didouTalk from '../../assets/world/didou/didou-talk.webp';
import didouCheer from '../../assets/world/didou/didou-cheer.webp';
import didouThink from '../../assets/world/didou/didou-think.webp';
import didouPoint from '../../assets/world/didou/didou-point.webp';
import didouStand from '../../assets/world/didou/didou-stand.webp';
import planet from '../../assets/world/space/planet.webp';
import spaceLandscape from '../../assets/world/space/space-landscape.webp';
import spacePortrait from '../../assets/world/space/space-portrait.webp';
import spaceWorldPortrait from '../../assets/world/space/space-world-portrait.webp';
import constantineLandscape from '../../assets/world/constantine/constantine-landscape.webp';
import constantinePortrait from '../../assets/world/constantine/constantine-portrait.webp';
import constantineForeground from '../../assets/world/constantine/constantine-foreground.webp';
import constantineIsland from '../../assets/world/constantine/island-constantine.webp';
import saharaLandscape from '../../assets/world/sahara/sahara-landscape.webp';
import saharaPortrait from '../../assets/world/sahara/sahara-portrait.webp';
import saharaIsland from '../../assets/world/sahara/island-sahara.webp';
import casbahLandscape from '../../assets/world/casbah/casbah-landscape.webp';
import casbahPortrait from '../../assets/world/casbah/casbah-portrait.webp';
import casbahIsland from '../../assets/world/casbah/island-casbah.webp';
import seaLandscape from '../../assets/world/sea/sea-landscape.webp';
import seaPortrait from '../../assets/world/sea/sea-portrait.webp';
import seaIsland from '../../assets/world/sea/island-sea.webp';
import djurdjuraLandscape from '../../assets/world/djurdjura/djurdjura-landscape.webp';
import djurdjuraPortrait from '../../assets/world/djurdjura/djurdjura-portrait.webp';
import djurdjuraIsland from '../../assets/world/djurdjura/island-djurdjura.webp';
import timgadLandscape from '../../assets/world/timgad/timgad-landscape.webp';
import timgadPortrait from '../../assets/world/timgad/timgad-portrait.webp';
import timgadIsland from '../../assets/world/timgad/island-timgad.webp';
import tassiliLandscape from '../../assets/world/tassili/tassili-landscape.webp';
import tassiliPortrait from '../../assets/world/tassili/tassili-portrait.webp';
import tassiliIsland from '../../assets/world/tassili/island-tassili.webp';
import star from '../../assets/world/objects/obj-star.webp';
import lock from '../../assets/world/objects/obj-lock.webp';
import chest from '../../assets/world/objects/obj-chest.webp';
// obj-medal-constantine.webp and obj-watch.webp wait in assets/world/objects/ until they have a place.
import type { JourneyWorldId } from '../../data/journey/journeyWorlds';

export type DidouPose = 'talk' | 'cheer' | 'think' | 'point';

/** Waist-up poses (the portrait crops them to the head and scarf). */
export const DIDOU_POSES: Record<DidouPose, { src: string; w: number; h: number }> = {
  talk: { src: didouTalk, w: 505, h: 640 },
  cheer: { src: didouCheer, w: 442, h: 640 },
  think: { src: didouThink, w: 482, h: 640 },
  // Points toward the left of the image.
  point: { src: didouPoint, w: 443, h: 640 },
};

/** Standing Didou, front view, feet at the bottom edge. */
export const DIDOU_STAND = { src: didouStand, w: 395, h: 640 };

export const SPACE_ART = { planet, landscape: spaceLandscape, portrait: spacePortrait };

export const OBJECT_ART = { star, lock, chest };

export interface WorldDecor {
  landscape: string;
  /** Upright phones. */
  portrait: string;
  /** Parallax layer: framing elements on the left and right edges only. */
  foreground?: string;
  island?: string;
  /**
   * The landscape image (1376 × 768) is drawn 1600 wide on the journey map, so 893 units tall;
   * this moves it down to line a landmark up with the stations (Constantine: the bridge deck).
   */
  mapOffsetY?: number;
}

/**
 * Painted decors of the eight worlds (docs/v2-pilote-prompts-nanobanana.md). Their stations
 * (journeyWorlds.ts, `ys`) stand on each decor's calm ground: on the water for the Sea, in the calm
 * middle band for Space.
 */
export const WORLD_DECOR: Record<JourneyWorldId, WorldDecor> = {
  sahara: { landscape: saharaLandscape, portrait: saharaPortrait, island: saharaIsland },
  casbah: { landscape: casbahLandscape, portrait: casbahPortrait, island: casbahIsland },
  sea: { landscape: seaLandscape, portrait: seaPortrait, island: seaIsland },
  constantine: { landscape: constantineLandscape, portrait: constantinePortrait, foreground: constantineForeground, island: constantineIsland, mapOffsetY: 44 },
  djurdjura: { landscape: djurdjuraLandscape, portrait: djurdjuraPortrait, island: djurdjuraIsland },
  timgad: { landscape: timgadLandscape, portrait: timgadPortrait, island: timgadIsland },
  tassili: { landscape: tassiliLandscape, portrait: tassiliPortrait, island: tassiliIsland },
  // The home screen's space sky (calm centre for the rocket's stations); no island yet.
  space: { landscape: spaceLandscape, portrait: spaceWorldPortrait },
};
