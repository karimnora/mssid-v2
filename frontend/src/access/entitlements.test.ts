import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { ENTITLEMENTS, canAccess, isPremiumRole, renderEntitlementsTable, FREE_JOURNEY_WORLDS } from './entitlements';
import { buildStations, currentStationIndex, stationStates } from '../utils/journeyProgress';
import { journeyForGrade } from '../data/journey/journeyWorlds';
import { SUBSCRIPTION_PLANS } from '../constants/pricing';

const SRC = join(__dirname, '..');
const DOC = join(SRC, '..', '..', 'docs', 'v2-gratuit-payant.md');

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : /\.(ts|tsx)$/.test(name) ? [path] : [];
  });

describe('entitlements registry — single source of truth for free vs paid', () => {
  it('opens free features to everyone and the rest only to Premium roles', () => {
    expect(isPremiumRole('ROLE_PREMIUM')).toBe(true);
    expect(isPremiumRole('ROLE_ADMIN')).toBe(true);
    expect(isPremiumRole('ROLE_FREE')).toBe(false);
    expect(isPremiumRole(undefined)).toBe(false);
    for (const [key, e] of Object.entries(ENTITLEMENTS) as [keyof typeof ENTITLEMENTS, (typeof ENTITLEMENTS)[keyof typeof ENTITLEMENTS]][]) {
      expect(canAccess(key, 'ROLE_PREMIUM'), key).toBe(true);
      expect(canAccess(key, 'ROLE_FREE'), key).toBe(e.tier === 'free');
      expect(canAccess(key, null), key).toBe(e.tier === 'free');
    }
  });

  it('describes the free part of every quota feature', () => {
    for (const [key, e] of Object.entries(ENTITLEMENTS)) {
      if (e.tier === 'quota') expect('freeAllowance' in e && e.freeAllowance, key).toBeTruthy();
    }
  });

  it('keeps docs/v2-gratuit-payant.md in sync with the registry', () => {
    const doc = readFileSync(DOC, 'utf8').replace(/\r\n/g, '\n');
    expect(doc).toContain(renderEntitlementsTable());
  });

  it('forbids role checks outside the registry (every gate must name its feature)', () => {
    const allowed = [
      'access/entitlements.ts',
      'types/auth.ts',
      'services/authService.ts', // dev-only simulated approval
      'components/ProfileModal.tsx', // shows the role label only
      'components/admin/',
      'locales/',
    ];
    const offenders = walk(SRC)
      .map((file) => relative(SRC, file).replace(/\\/g, '/'))
      .filter((rel) => !rel.includes('.test.') && !allowed.some((a) => rel.startsWith(a)))
      .filter((rel) => {
        const code = readFileSync(join(SRC, rel), 'utf8');
        return /['"]ROLE_PREMIUM['"]|\bhasPremium\s*\(/.test(code);
      });
    expect(offenders).toEqual([]);
  });

  it('sells only the two decided offers (3 and 12 months)', () => {
    expect(SUBSCRIPTION_PLANS.map((p) => [p.id, p.priceDzd])).toEqual([['P3M', 900], ['P12M', 2400]]);
  });
});

describe('Didou journey Premium worlds', () => {
  const worlds = journeyForGrade('1AP')!;
  const stations = buildStations(worlds);
  const all = new Set(stations.filter((s) => s.lessonId).map((s) => s.lessonId!));
  const firstPremium = stations.findIndex((s) => s.worldIndex === FREE_JOURNEY_WORLDS);

  it('locks worlds 3 to 8 for a free account and leaves Didou on the last free station', () => {
    const freeDone = new Set(stations.filter((s) => s.worldIndex < FREE_JOURNEY_WORLDS && s.lessonId).map((s) => s.lessonId!));
    const claimed = new Set(worlds.slice(0, FREE_JOURNEY_WORLDS).map((w) => w.id));
    const states = stationStates(stations, worlds, freeDone, claimed, all, FREE_JOURNEY_WORLDS);
    expect(states.slice(0, firstPremium).every((s) => s === 'done')).toBe(true);
    expect(states.slice(firstPremium).every((s) => s === 'premium')).toBe(true);
    expect(currentStationIndex(states)).toBe(firstPremium - 1);
  });

  it('keeps a lesson validated elsewhere as done, and opens everything for Premium', () => {
    const premiumLesson = stations[firstPremium].lessonId!;
    const free = stationStates(stations, worlds, new Set([premiumLesson]), new Set(), all, FREE_JOURNEY_WORLDS);
    expect(free[firstPremium]).toBe('done');
    expect(free[0]).toBe('open');
    const premium = stationStates(stations, worlds, new Set(), new Set(), all, null);
    expect(premium).not.toContain('premium');
  });
});
