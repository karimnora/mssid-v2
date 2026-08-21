import { describe, it, expect } from 'vitest';
import { PRESCHOOL_MODULES } from './index';
import { PreschoolLanguage } from './types';

const LANGUAGES: PreschoolLanguage[] = ['ar', 'fr', 'en'];

describe('Preschool (Mode Éveil) data integrity', () => {
  it('has at least one module and every module id is unique', () => {
    expect(PRESCHOOL_MODULES.length).toBeGreaterThan(0);
    const ids = PRESCHOOL_MODULES.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every activity id is globally unique across all modules', () => {
    const allActivityIds = PRESCHOOL_MODULES.flatMap((m) => m.activities.map((a) => a.id));
    expect(new Set(allActivityIds).size).toBe(allActivityIds.length);
  });

  PRESCHOOL_MODULES.forEach((mod) => {
    describe(`module: ${mod.id}`, () => {
      it('declares totalSteps matching the actual number of activities', () => {
        expect(mod.activities.length).toBe(mod.totalSteps);
      });

      it('has titleI18n for ar/fr/en, all non-empty', () => {
        LANGUAGES.forEach((lang) => {
          expect(mod.titleI18n[lang]).toBeTruthy();
        });
      });

      it('numbers activities 1..totalSteps with no gaps or duplicates', () => {
        const stepNumbers = mod.activities.map((a) => a.stepNumber).sort((a, b) => a - b);
        expect(stepNumbers).toEqual(Array.from({ length: mod.totalSteps }, (_, i) => i + 1));
      });

      mod.activities.forEach((activity) => {
        describe(`activity: ${activity.id}`, () => {
          it('provides i18n content for ar/fr/en with a title and promptAudio', () => {
            LANGUAGES.forEach((lang) => {
              const content = activity.i18n[lang];
              expect(content, `missing ${lang} i18n on ${activity.id}`).toBeTruthy();
              expect(content.title?.trim()).toBeTruthy();
              expect(content.promptAudio?.trim()).toBeTruthy();
            });
          });

          it('matches its interactionType\'s required visualAssets shape', () => {
            const assets = activity.visualAssets;
            switch (activity.interactionType) {
              case 'tap_choice': {
                expect(assets.choices?.length, activity.id).toBeGreaterThanOrEqual(2);
                const correctCount = assets.choices!.filter((c) => c.isCorrect).length;
                expect(correctCount, `${activity.id} must have exactly one correct choice`).toBe(1);
                break;
              }
              case 'drag_drop': {
                expect(assets.dropZoneCount, activity.id).toBeGreaterThan(0);
                expect(assets.dragItems?.length, activity.id).toBe(assets.dropZoneCount);
                break;
              }
              case 'find_path': {
                expect(assets.pathToken, activity.id).toBeTruthy();
                break;
              }
              case 'connect_dots': {
                expect(assets.connectPairs?.length, activity.id).toBeGreaterThanOrEqual(2);
                break;
              }
              case 'sorting': {
                const bins = assets.sortBins || [];
                const items = assets.sortItems || [];
                expect(bins.length, activity.id).toBeGreaterThanOrEqual(2);
                expect(items.length, activity.id).toBeGreaterThan(0);
                const binIds = new Set(bins.map((b) => b.id));
                items.forEach((item) => {
                  expect(binIds.has(item.correctBinId), `${activity.id}: item ${item.id} references unknown bin ${item.correctBinId}`).toBe(true);
                });
                break;
              }
              case 'memory_cards': {
                const pairs = assets.memoryPairs || [];
                expect(pairs.length, activity.id).toBeGreaterThanOrEqual(2);
                // PreschoolMemoryCards hard-caps at 3 pairs (.slice(0, 3)) — anything beyond is silently dropped.
                expect(pairs.length, `${activity.id}: more than 3 pairs are silently dropped by PreschoolMemoryCards`).toBeLessThanOrEqual(3);
                break;
              }
              case 'creative_extra': {
                expect(assets.bubbleCount, activity.id).toBeGreaterThan(0);
                expect(assets.bubbleAsset, activity.id).toBeTruthy();
                break;
              }
              case 'trace': {
                expect(assets.mainSvgOrImage?.trim(), activity.id).toBeTruthy();
                break;
              }
              case 'coloring': {
                expect(assets.coloringRegions?.length, activity.id).toBeGreaterThanOrEqual(2);
                break;
              }
              case 'maze': {
                // Start + at least one waypoint + goal, so there's an actual route to trace.
                expect(assets.mazeWaypoints?.length, activity.id).toBeGreaterThanOrEqual(3);
                break;
              }
              case 'jigsaw': {
                const slots = assets.jigsawSlots || [];
                const pieces = assets.jigsawPieces || [];
                expect(slots.length, activity.id).toBeGreaterThanOrEqual(2);
                expect(pieces.length, `${activity.id}: every slot needs exactly one matching piece`).toBe(slots.length);
                const slotIds = new Set(slots.map((s) => s.id));
                pieces.forEach((piece) => {
                  expect(slotIds.has(piece.correctSlotId), `${activity.id}: piece ${piece.id} references unknown slot ${piece.correctSlotId}`).toBe(true);
                });
                break;
              }
              case 'sequence': {
                const shown = assets.sequencePattern || [];
                expect(shown.length, activity.id).toBeGreaterThanOrEqual(3);
                expect(assets.choices?.length, activity.id).toBeGreaterThanOrEqual(2);
                const correct = (assets.choices || []).filter((c) => c.isCorrect);
                expect(correct.length, `${activity.id} must have exactly one next-item`).toBe(1);
                let period: number | null = null;
                for (let p = 1; p < shown.length; p++) {
                  if (shown.every((item, i) => item === shown[i % p])) {
                    period = p;
                    break;
                  }
                }
                if (period) {
                  const expected = shown[shown.length % period];
                  expect(correct[0].asset, `${activity.id}: next item after a repeating pattern`).toBe(expected);
                }
                break;
              }
            }
          });
        });
      });
    });
  });
});
