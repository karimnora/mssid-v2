import { describe, expect, it } from 'vitest';
import { isWuduTargetCorrect, WUDU_STEPS } from './wudu';
import { rakahsFor, isSalatPostureCorrect, SALAT_POSTURES } from './salat';
import { isRoadAnswerCorrect, nextCrossingStep, roadScenesForGrade } from './roadCode';
import { basketTotal, missionComplete, soukChange, soukMissionForGrade } from './souk';
import { MAGHREB_LAYOUT, maghrebIds, WORLD_COUNTRIES } from './worldFlags';
import { isMosqueAnswerCorrect } from './mosqueAdab';

describe('wudu order', () => {
  it('keeps the official 2AP seven-step sequence', () => {
    expect(WUDU_STEPS.map((step) => step.target)).toEqual([
      'niyyah',
      'hands',
      'mouth',
      'face',
      'arms',
      'head',
      'feet',
    ]);
    expect(isWuduTargetCorrect(0, 'niyyah')).toBe(true);
    expect(isWuduTargetCorrect(0, 'feet')).toBe(false);
    expect(isWuduTargetCorrect(6, 'feet')).toBe(true);
  });
});

describe('salat rakahs and postures', () => {
  it('matches the official counts', () => {
    expect(rakahsFor('fajr')).toBe(2);
    expect(rakahsFor('dhuhr')).toBe(4);
    expect(rakahsFor('asr')).toBe(4);
    expect(rakahsFor('maghrib')).toBe(3);
    expect(rakahsFor('isha')).toBe(4);
  });

  it('asks for takbir before ruku', () => {
    expect(isSalatPostureCorrect(0, 'takbir')).toBe(true);
    expect(isSalatPostureCorrect(0, 'ruku')).toBe(false);
    expect(SALAT_POSTURES).toHaveLength(7);
  });
});

describe('road code', () => {
  it('hides the tram/bus scene before 5AP', () => {
    expect(roadScenesForGrade('2AP').some((scene) => scene.id === 'bus')).toBe(false);
    expect(roadScenesForGrade('5AP').some((scene) => scene.id === 'bus')).toBe(true);
  });

  it('looks left first in right-hand traffic', () => {
    expect(isRoadAnswerCorrect('look', 'look_left')).toBe(true);
    expect(isRoadAnswerCorrect('red', 'stop')).toBe(true);
    expect(nextCrossingStep([])).toBe('left');
    expect(nextCrossingStep(['left'])).toBe('right');
    expect(nextCrossingStep(['left', 'right'])).toBe('cross');
  });
});

describe('souk money', () => {
  it('prices a 1AP bread mission at 50 DA', () => {
    const mission = soukMissionForGrade('1AP');
    expect(mission.stallIds).toEqual(['bread']);
    expect(basketTotal(['bread'])).toBe(50);
    expect(soukChange(50, 100)).toBe(50);
    expect(soukChange(50, 20)).toBeNull();
    expect(missionComplete(mission, ['bread'])).toBe(true);
  });

  it('asks 2AP for bread and milk under 100 DA', () => {
    const mission = soukMissionForGrade('2AP');
    expect(basketTotal(mission.stallIds)).toBe(75);
  });
});

describe('world flags', () => {
  it('keeps Algeria in the Maghreb set with Algiers as capital', () => {
    expect(maghrebIds()).toContain('dz');
    expect(WORLD_COUNTRIES.find((country) => country.id === 'dz')?.capitalAr).toBe('مَدِينَةُ الجَزَائِرِ');
    expect(WORLD_COUNTRIES.find((country) => country.id === 'ma')?.capitalAr).toBe('الرِّبَاطُ');
    expect(MAGHREB_LAYOUT).toEqual([null, 'tn', null, 'ma', 'dz', 'ly', 'eh', 'mr', null]);
    expect(maghrebIds()).toContain('eh');
    expect(WORLD_COUNTRIES.find((country) => country.id === 'eh')?.capitalAr).toBe('العُيُونُ');
  });
});

describe('mosque adab', () => {
  it('enters with the right foot and stays quiet', () => {
    expect(isMosqueAnswerCorrect('enter', 'right_foot')).toBe(true);
    expect(isMosqueAnswerCorrect('inside', 'run')).toBe(false);
  });
});
