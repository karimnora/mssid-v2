import { DidouAvatarConfig } from '../types/ecosystem';
import { DIDOU_STAGES, DidouStageInfo } from '../data/outfitsData';

// Didou's energy fades gently since the last treat — floored well above zero so a child who skips
// a few days never opens the app to a "starving" pet, just a gentle nudge it's been a while.
// Never decays before the very first feeding: a brand-new companion starts happy, not hungry.
const ENERGY_DECAY_PER_DAY = 8;
const ENERGY_FLOOR = 25;

export function getDidouEnergy(avatarConfig?: DidouAvatarConfig): number {
  const stored = avatarConfig?.energy ?? 90;
  if (!avatarConfig?.lastFedAt) return Math.min(100, stored);

  const daysSinceFed = (Date.now() - new Date(avatarConfig.lastFedAt).getTime()) / 86_400_000;
  if (daysSinceFed <= 0) return Math.min(100, stored);

  const decayed = stored - daysSinceFed * ENERGY_DECAY_PER_DAY;
  return Math.max(ENERGY_FLOOR, Math.min(100, Math.round(decayed)));
}

// Real friendship, not a relabeled XP counter: it only grows from the one companion interaction
// that actually costs something and gets persisted — feeding Didou a treat — one point per treat,
// up to 10/10. Petting/talking stay free, expressive interactions without inflating this number.
export function getDidouFriendshipLevel(avatarConfig?: DidouAvatarConfig): number {
  return Math.min(10, avatarConfig?.totalTreatsGiven ?? 0);
}

export function getDidouStage(level: number): DidouStageInfo {
  return level >= 8 ? DIDOU_STAGES[2] : level >= 4 ? DIDOU_STAGES[1] : DIDOU_STAGES[0];
}

// DIDOU_STAGES[1] ("Écolier Brillant", level 4+) advertises "+10% de pièces d'or" as an unlocked
// perk — this is what actually applies it wherever gold gets earned, instead of it staying flavor
// text in the perks list with no code behind it.
const STAGE2_GOLD_BONUS_LEVEL = 4;
const STAGE2_GOLD_BONUS_MULTIPLIER = 1.1;

export function applyDidouGoldBonus(baseCoins: number, level: number): number {
  if (baseCoins <= 0 || level < STAGE2_GOLD_BONUS_LEVEL) return baseCoins;
  return Math.round(baseCoins * STAGE2_GOLD_BONUS_MULTIPLIER);
}
