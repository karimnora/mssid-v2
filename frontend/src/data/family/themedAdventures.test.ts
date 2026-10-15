import { describe, expect, it } from 'vitest';
import { ADVENTURE_THEMES, THEMED_READING } from './themedAdventures';
import { marketAmounts, premiumLabResultId, premiumLabResultIds, shadowExperiments, shadowLength } from './premiumLabJourneys';
import type { PrimaryGrade } from '../../types';
import { familyStorageKey, readFamilyResults } from '../../utils/familyLearning';
const grades: PrimaryGrade[] = ['1AP','2AP','3AP','4AP','5AP'];
describe('thematic adventures content', () => {
 it('provides ten original short stories and thirty corrected questions with distinct choices', () => {
  const texts = new Set<string>();
  for (const theme of ['garden','library'] as const) for (const grade of grades) {
   const reading = THEMED_READING[theme][grade]; texts.add(reading.text);
   expect(reading.text.length).toBeGreaterThan(50); expect(reading.tasks).toHaveLength(3);
   for (const task of reading.tasks) {
    expect(new Set([...task.wrong, task.correct]).size).toBe(3);
    expect(task.prompt).toMatch(/[؀-ۿ]/); expect(task.hint.fr.length).toBeGreaterThan(10);
    expect(task.hint.ar.length).toBeGreaterThan(10); expect(task.method.length).toBeGreaterThan(25);
   }
  }
  expect(texts.size).toBe(10);
 });
 it('has distinct valid purchases in every theme and never exceeds the quantity control', () => {
  for (const grade of grades) {
   const totals = new Set<number>();
   for (const theme of ADVENTURE_THEMES) {
    const values = marketAmounts(grade,theme.id); totals.add(values.total);
    expect(values.quantity).toBeGreaterThan(0); expect(values.quantity).toBeLessThanOrEqual(10);
    expect(values.price * values.quantity + values.change).toBe(values.payment); expect(values.change).toBeGreaterThanOrEqual(0);
   }
   // 1AP and 2AP deliberately reuse a total with different quantities/prices.
   expect(totals.size).toBeGreaterThanOrEqual(2);
  }
 });
 it('keeps 27 challenge IDs per grade and does not merge progress between themes', () => {
  localStorage.clear();
  const ids = premiumLabResultIds('3AP'); expect(ids).toHaveLength(27); expect(new Set(ids).size).toBe(27);
  expect(premiumLabResultId('3AP','market',0)).toBe('adventure:3AP:market:0');
  const id = premiumLabResultId('3AP','market',0,'garden'); const key = familyStorageKey('user:7:child:1','3AP');
  localStorage.setItem(key,JSON.stringify({[id]:{outcome:'independent',at:'2026-10-15T12:00:00Z'}}));
  const saved = readFamilyResults(key); expect(saved[id]?.outcome).toBe('independent');
  expect(saved[premiumLabResultId('3AP','market',0,'library')]).toBeUndefined();
 });
 it('changes exactly one physical parameter in every themed experiment', () => {
  for (const theme of ADVENTURE_THEMES) for (const experiment of shadowExperiments(theme.id)) {
   expect(Number(experiment.before.angle !== experiment.after.angle) + Number(experiment.before.height !== experiment.after.height)).toBe(1);
   const before = shadowLength(experiment.before.height,experiment.before.angle); const after = shadowLength(experiment.after.height,experiment.after.angle);
   expect(after > before ? 'longer' : 'shorter').toBe(experiment.prediction);
  }
 });
});
