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
 * Painted decors (docs/v2-pilote-prompts-nanobanana.md); the worlds without one keep their vector
 * backdrop. Their stations (journeyWorlds.ts, `ys`) stand on the decor's calm lower ground.
 */
export const WORLD_DECOR: Partial<Record<JourneyWorldId, WorldDecor>> = {
  sahara: { landscape: saharaLandscape, portrait: saharaPortrait, island: saharaIsland },
  casbah: { landscape: casbahLandscape, portrait: casbahPortrait, island: casbahIsland },
  constantine: { landscape: constantineLandscape, portrait: constantinePortrait, foreground: constantineForeground, island: constantineIsland, mapOffsetY: 44 },
};
