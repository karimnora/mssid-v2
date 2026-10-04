import { describe, it, expect } from 'vitest';
import { PRESCHOOL_MODULES } from './index';
import { PreschoolLanguage } from './types';
import { PRESCHOOL_BADGES } from './preschoolBadgesData';
import { CHALLENGE_MODULE_IDS } from '../../components/preschool/useDailyChallenge';
import { activityPicture, activityPathIcon } from '../../components/preschool/preschoolGlyphs';

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

  it('every module_complete badge points at a real PRESCHOOL_MODULES id', () => {
    const ids = new Set(PRESCHOOL_MODULES.map((m) => m.id));
    for (const badge of PRESCHOOL_BADGES) {
      if (badge.criteria.type !== 'module_complete') continue;
      expect(ids.has(badge.criteria.moduleId), `${badge.id} → ${badge.criteria.moduleId}`).toBe(true);
    }
  });

  it('Mon Petit Monde is tagged domain world, not animals', () => {
    const world = PRESCHOOL_MODULES.find((m) => m.id === 'preschool-world');
    expect(world?.domain).toBe('world');
  });

  it('every daily-challenge module id exists, including numbers 0-10', () => {
    const ids = new Set(PRESCHOOL_MODULES.map((m) => m.id));
    for (const id of CHALLENGE_MODULE_IDS) {
      expect(ids.has(id), id).toBe(true);
    }
    expect(CHALLENGE_MODULE_IDS).toContain('preschool-numbers-0-10');
    expect(CHALLENGE_MODULE_IDS).not.toContain('preschool-numbers');
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
                LANGUAGES.forEach((lang) => {
                  const choices = activity.i18n[lang].choices ?? assets.choices;
                  expect(choices?.length, `${activity.id} ${lang}`).toBeGreaterThanOrEqual(2);
                  const correctCount = choices!.filter((c) => c.isCorrect).length;
                  expect(correctCount, `${activity.id} ${lang} must have exactly one correct choice`).toBe(1);
                });
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
                LANGUAGES.forEach((lang) => {
                  const pairs = activity.i18n[lang].connectPairs ?? assets.connectPairs;
                  expect(pairs?.length, `${activity.id} ${lang}`).toBeGreaterThanOrEqual(2);
                });
                break;
              }
              case 'sorting': {
                LANGUAGES.forEach((lang) => {
                  const bins = activity.i18n[lang].sortBins ?? assets.sortBins ?? [];
                  const items = activity.i18n[lang].sortItems ?? assets.sortItems ?? [];
                  expect(bins.length, `${activity.id} ${lang}`).toBeGreaterThanOrEqual(2);
                  expect(items.length, `${activity.id} ${lang}`).toBeGreaterThan(0);
                  const binIds = new Set(bins.map((b) => b.id));
                  items.forEach((item) => {
                    expect(binIds.has(item.correctBinId), `${activity.id} ${lang}: item ${item.id} references unknown bin ${item.correctBinId}`).toBe(true);
                  });
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
                LANGUAGES.forEach((lang) => {
                  const glyph = activity.i18n[lang].glyph ?? assets.mainSvgOrImage;
                  expect(glyph?.trim(), `${activity.id} ${lang}`).toBeTruthy();
                });
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
              case 'listen_tap': {
                expect(assets.listenCards?.length, activity.id).toBeGreaterThanOrEqual(2);
                const ids = (assets.listenCards || []).map((c) => c.id);
                expect(new Set(ids).size, `${activity.id} listen card ids`).toBe(ids.length);
                break;
              }
            }
          });
        });
      });
    });
  });

  it('color tap-choice answers use the matching colored disc, including blue', () => {
    const dots: Record<string, string> = {
      red: '🔴', orange: '🟠', yellow: '🟡', green: '🟢', blue: '🔵', purple: '🟣',
    };
    const colors = PRESCHOOL_MODULES.find((m) => m.id === 'preschool-colors');
    expect(colors).toBeTruthy();
    for (const activity of colors!.activities) {
      if (activity.interactionType !== 'tap_choice') continue;
      const expected = dots[String(activity.targetValue)];
      if (!expected) continue;
      const correct = activity.visualAssets.choices?.find((c) => c.isCorrect);
      expect(correct?.asset, activity.id).toBe(expected);
    }
  });

  it('the fennec color path follows red, orange, yellow, green, then home', () => {
    const colors = PRESCHOOL_MODULES.find((m) => m.id === 'preschool-colors');
    const path = colors?.activities.find((a) => a.id === 'colors-fennec-path');
    expect(path?.visualAssets.pathStops?.map((s) => s.asset)).toEqual(['🍓', '🍊', '🍋', '🌴', '🏡']);
  });

  it('letter tap_choice isolates picture and glyphs per language', () => {
    const letters = PRESCHOOL_MODULES.find((m) => m.id === 'preschool-letters');
    const alif = letters?.activities.find((a) => a.id === 'letters-alif-rabbit');
    expect(alif).toBeTruthy();
    expect(activityPicture(alif!, 'ar')).toBe('🐰');
    expect(activityPicture(alif!, 'fr')).toBe('🍍');
    expect(activityPicture(alif!, 'en')).toBe('🍎');
    expect(alif!.i18n.ar.choices?.find((c) => c.isCorrect)?.asset).toBe('أ');
    expect(alif!.i18n.fr.choices?.find((c) => c.isCorrect)?.asset).toBe('A');
    expect(alif!.i18n.en.choices?.find((c) => c.isCorrect)?.asset).toBe('A');
  });

  it('letter path icons follow the selected language, not Arabic targetValue', () => {
    const letters = PRESCHOOL_MODULES.find((m) => m.id === 'preschool-letters');
    const traceAlif = letters?.activities.find((a) => a.id === 'letters-trace-alif');
    const tapTaa = letters?.activities.find((a) => a.id === 'letters-taa-apple');
    expect(traceAlif).toBeTruthy();
    expect(tapTaa).toBeTruthy();
    expect(activityPathIcon(traceAlif!, 'fr')).toBe('A');
    expect(activityPathIcon(traceAlif!, 'en')).toBe('A');
    expect(activityPathIcon(traceAlif!, 'ar')).toBe('أ');
    expect(activityPathIcon(tapTaa!, 'fr')).toBe('🍎');
    expect(activityPathIcon(tapTaa!, 'en')).toBe('🚂');
    expect(activityPathIcon(tapTaa!, 'ar')).toBe('🍎');
  });

  it('letter FR/EN never expose Arabic glyphs in tap, trace, or connect', () => {
    const letters = PRESCHOOL_MODULES.find((m) => m.id === 'preschool-letters');
    expect(letters).toBeTruthy();
    const arabicLetter = /[\u0600-\u06FF]/;
    for (const activity of letters!.activities) {
      for (const lang of ['fr', 'en'] as const) {
        const content = activity.i18n[lang];
        for (const choice of content.choices ?? []) {
          expect(choice.asset, `${activity.id} ${lang}`).not.toMatch(arabicLetter);
        }
        if (content.glyph) {
          expect(content.glyph, `${activity.id} ${lang}`).not.toMatch(arabicLetter);
        }
        for (const pair of content.connectPairs ?? []) {
          expect(pair.rightAsset, `${activity.id} ${lang}`).not.toMatch(arabicLetter);
          expect(pair.leftAsset, `${activity.id} ${lang}`).not.toMatch(arabicLetter);
        }
        expect(content.promptAudio, `${activity.id} ${lang}`).not.toMatch(
          /\b(Alif|Jeem|Ba|Mim|Saad|Faa|Lam|Waw|Tha|Seen|Dal|Ra|Qaf|Kaf|Noon|Haa|Yaa)\b/i,
        );
      }
    }
  });

  it('FR/EN letter tap_choice: title, promptAudio and successAudio all name the same letter', () => {
    // Regression guard for a real content bug found in review: several FR/EN letter activities had a
    // title naming one letter while promptAudio/successAudio and the actual tappable choice taught a
    // different one (e.g. title "La Pêche à la Lettre Th" but promptAudio/choice were about "R").
    // Only single, unaccented Latin letters are checked — digraph titles (Th, Ch, Sh…) describe an
    // Arabic sound that has no 1:1 Latin letter and are intentionally out of scope here.
    // Tokens can be a single letter (A) or a digraph describing an Arabic sound (Th, Ch, Sh, Ç) — any
    // length is accepted here, title vs. audio just have to agree on the same token.
    const letterAfter = (text: string, word: 'lettre' | 'letter'): string | null => {
      const m = text.match(new RegExp(`\\b${word}s?\\s+([A-Za-zÀ-ÖØ-öø-ÿ]+)\\b`, 'i'));
      return m ? m[1].toUpperCase() : null;
    };
    const leadingLetterOf = (text: string): string | null => {
      // successAudio pattern: "Bravo ! A comme Ananas !" / "Well done! A for Apple!"
      const m = text.match(/\b([A-Za-zÀ-ÖØ-öø-ÿ]+)\s+(?:comme|for)\b/i);
      return m ? m[1].toUpperCase() : null;
    };

    const letters = PRESCHOOL_MODULES.find((m) => m.id === 'preschool-letters');
    expect(letters).toBeTruthy();

    const issues: string[] = [];
    for (const activity of letters!.activities) {
      if (activity.interactionType !== 'tap_choice') continue;
      for (const [lang, word] of [['fr', 'lettre'], ['en', 'letter']] as const) {
        const content = activity.i18n[lang];
        const correct = content.choices?.find((c) => c.isCorrect)?.asset?.toUpperCase();

        const titleLetter = letterAfter(content.title, word);
        const audioLetter = letterAfter(content.promptAudio, word);
        const successLetter = leadingLetterOf(content.successAudio ?? '');

        // title and promptAudio must always agree on which letter/sound is being taught.
        if (titleLetter && audioLetter && titleLetter !== audioLetter) {
          issues.push(`${activity.id} ${lang}: title says "${word} ${titleLetter}" but promptAudio says "${word} ${audioLetter}"`);
        }
        // The audio directly names the tile the child is asked to tap — when it's a single Latin
        // letter, it must be the one actually marked correct among the choices.
        if (audioLetter && audioLetter.length === 1 && correct && audioLetter !== correct) {
          issues.push(`${activity.id} ${lang}: promptAudio says "${word} ${audioLetter}" but the correct choice is "${correct}"`);
        }
        if (successLetter && audioLetter && successLetter !== audioLetter) {
          issues.push(`${activity.id} ${lang}: successAudio leads with "${successLetter}" but promptAudio said "${word} ${audioLetter}"`);
        }
      }
    }
    expect(issues).toEqual([]);
  });

  it('seasons-connect names each season and matches winter to the scarf already taught', () => {
    const seasons = PRESCHOOL_MODULES.find((m) => m.id === 'preschool-seasons');
    const connect = seasons?.activities.find((a) => a.id === 'seasons-connect');
    const pairs = connect?.visualAssets.connectPairs || [];
    expect(pairs.map((p) => p.leftLabel?.fr)).toEqual(['Printemps', 'Été', 'Automne', 'Hiver']);
    const winter = pairs.find((p) => p.leftLabel?.fr === 'Hiver');
    expect(winter?.rightAsset).toBe('🧣');
    expect(connect?.visualAssets.connectColumnTitles).toEqual({
      left: { ar: 'الفَصْل', fr: 'Saison', en: 'Season' },
      right: { ar: 'الصُّورَة', fr: 'Image', en: 'Picture' },
    });
  });

  it('calendar module shows names with audio, week starts Sunday, weekend Fri–Sat', () => {
    const cal = PRESCHOOL_MODULES.find((m) => m.id === 'preschool-calendar');
    expect(cal).toBeTruthy();
    expect(cal!.totalSteps).toBe(4);
    const activityIds = cal!.activities.map((a) => a.id);
    expect(new Set(activityIds).size).toBe(activityIds.length);

    const blob = JSON.stringify(cal);
    expect(blob).toMatch(/جَانْفِي|جانفي/);
    expect(blob).toMatch(/جُوِيلِيَة|جويلية/);
    expect(blob).toMatch(/سِبْتَمْبِر|سبتمبر/);
    expect(blob).toMatch(/أُوت|أوت/);
    expect(blob).not.toContain('يناير');
    expect(blob).not.toContain('فبراير');
    expect(blob).not.toMatch(/رمضان/);

    const days = cal!.activities.find((a) => a.id === 'calendar-days');
    expect(days?.interactionType).toBe('listen_tap');
    expect(days?.visualAssets.listenCards?.map((c) => c.id)).toEqual([
      'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday',
    ]);
    expect(days?.visualAssets.listenCards?.[0].label.fr).toBe('Dimanche');

    const months = [
      ...(cal!.activities.find((a) => a.id === 'calendar-months-1')?.visualAssets.listenCards || []),
      ...(cal!.activities.find((a) => a.id === 'calendar-months-2')?.visualAssets.listenCards || []),
    ];
    expect(months.map((c) => c.label.fr)).toEqual([
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
    ]);

    const sort = cal!.activities.find((a) => a.id === 'calendar-school-weekend');
    const school = (sort?.visualAssets.sortItems || [])
      .filter((i) => i.correctBinId === 'school-bin')
      .map((i) => i.label?.fr);
    const weekend = (sort?.visualAssets.sortItems || [])
      .filter((i) => i.correctBinId === 'weekend-bin')
      .map((i) => i.label?.fr);
    expect(school).toEqual(['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi']);
    expect(weekend).toEqual(['Vendredi', 'Samedi']);
    expect(sort?.visualAssets.sortItems?.[0].label?.fr).toBe('Dimanche');
  });

  it('seasons clothes keep casquette and straw hat as two different hats', () => {
    const seasons = PRESCHOOL_MODULES.find((m) => m.id === 'preschool-seasons');
    const sorting = seasons?.activities.find((a) => a.id === 'seasons-clothes-sorting');
    const items = sorting?.visualAssets.sortItems ?? [];
    const cap = items.find((i) => i.id === 'cl-cap');
    const straw = items.find((i) => i.id === 'cl-hat');
    expect(cap?.asset).toBe('🧢');
    expect(straw?.asset).toBe('👒');
    expect(cap?.label?.fr).toBe('casquette');
    expect(straw?.label?.fr).toBe('chapeau de paille');
    expect(cap?.label?.ar).toBe('قُبَّعَة');
    expect(straw?.label?.ar).toBe('قُبَّعَةُ قَشّ');
    expect(cap?.correctBinId).toBe('summer-bin');
    expect(straw?.correctBinId).toBe('spring-bin');
  });
});
