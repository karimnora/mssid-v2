import { describe, expect, it } from 'vitest';
import { applyDidouGoldBonus, getDidouEnergy, getDidouFriendshipLevel, getDidouStage } from './didouCompanion';
import { DIDOU_STAGES } from '../data/outfitsData';
import { DidouAvatarConfig } from '../types/ecosystem';

const daysAgoIso = (days: number) => new Date(Date.now() - days * 86_400_000).toISOString();

describe('getDidouEnergy — real decay instead of a number that only ever goes up', () => {
  it('defaults to 90 with no avatarConfig at all', () => {
    expect(getDidouEnergy(undefined)).toBe(90);
  });

  it('never decays before the very first feeding — a brand-new companion starts happy, not hungry', () => {
    const config: DidouAvatarConfig = { activeOutfit: 'default', unlockedOutfits: ['default'], energy: 90 };
    expect(getDidouEnergy(config)).toBe(90);
  });

  it('fades gently since the last treat', () => {
    const config: DidouAvatarConfig = {
      activeOutfit: 'default',
      unlockedOutfits: ['default'],
      energy: 100,
      lastFedAt: daysAgoIso(5),
    };
    // 5 days * 8%/day = 40 → 60
    expect(getDidouEnergy(config)).toBe(60);
  });

  it('never drops below the floor, even after weeks of silence — never a "starving" pet', () => {
    const config: DidouAvatarConfig = {
      activeOutfit: 'default',
      unlockedOutfits: ['default'],
      energy: 100,
      lastFedAt: daysAgoIso(30),
    };
    expect(getDidouEnergy(config)).toBe(25);
  });

  it('caps at 100 for a just-fed companion', () => {
    const config: DidouAvatarConfig = {
      activeOutfit: 'default',
      unlockedOutfits: ['default'],
      energy: 100,
      lastFedAt: new Date().toISOString(),
    };
    expect(getDidouEnergy(config)).toBe(100);
  });
});

describe('getDidouFriendshipLevel — grows from real interaction, not a relabeled XP counter', () => {
  it('starts at 0 for a companion never fed', () => {
    expect(getDidouFriendshipLevel(undefined)).toBe(0);
    expect(getDidouFriendshipLevel({ activeOutfit: 'default', unlockedOutfits: ['default'] })).toBe(0);
  });

  it('tracks the number of treats given, one point each', () => {
    const config: DidouAvatarConfig = { activeOutfit: 'default', unlockedOutfits: ['default'], totalTreatsGiven: 4 };
    expect(getDidouFriendshipLevel(config)).toBe(4);
  });

  it('caps at 10/10 no matter how many treats have been given', () => {
    const config: DidouAvatarConfig = { activeOutfit: 'default', unlockedOutfits: ['default'], totalTreatsGiven: 47 };
    expect(getDidouFriendshipLevel(config)).toBe(10);
  });
});

describe('getDidouStage', () => {
  it('stays at stage 1 below level 4', () => {
    expect(getDidouStage(1)).toBe(DIDOU_STAGES[0]);
    expect(getDidouStage(3)).toBe(DIDOU_STAGES[0]);
  });

  it('reaches stage 2 at level 4', () => {
    expect(getDidouStage(4)).toBe(DIDOU_STAGES[1]);
    expect(getDidouStage(7)).toBe(DIDOU_STAGES[1]);
  });

  it('reaches stage 3 at level 8', () => {
    expect(getDidouStage(8)).toBe(DIDOU_STAGES[2]);
    expect(getDidouStage(50)).toBe(DIDOU_STAGES[2]);
  });
});

describe('applyDidouGoldBonus — makes the stage-2 "+10% gold" perk real', () => {
  it('grants no bonus below level 4 (stage 1)', () => {
    expect(applyDidouGoldBonus(20, 1)).toBe(20);
    expect(applyDidouGoldBonus(20, 3)).toBe(20);
  });

  it('applies +10% (rounded) from level 4 onward', () => {
    expect(applyDidouGoldBonus(20, 4)).toBe(22);
    expect(applyDidouGoldBonus(15, 8)).toBe(17); // 16.5 → 17
  });

  it('never turns a zero reward into a positive one', () => {
    expect(applyDidouGoldBonus(0, 8)).toBe(0);
  });
});
