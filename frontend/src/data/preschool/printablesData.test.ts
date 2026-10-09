import { describe, it, expect } from 'vitest';
import { PRINTABLE_WORKSHEETS, PRINTABLE_CATEGORY_LABELS, getPrintableWorksheets } from './printablesData';
import { PreschoolLanguage } from './types';

const LANGUAGES: PreschoolLanguage[] = ['ar', 'fr', 'en'];

describe('Preschool printable worksheets data integrity', () => {
  it.each(LANGUAGES)('offers the complete selected alphabet without foreign letter worksheets in %s', language => {
    const letters = getPrintableWorksheets(language).filter(sheet => sheet.category === 'lettres');
    const glyphs = new Set(letters.flatMap(sheet => sheet.traceRows ?? []).map(row => row.glyph));
    const alphabet = language === 'ar' ? [...'أبتثجحخدذرزسشصضطظعغفقكلمنهوي'] : [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
    alphabet.forEach(glyph => expect(glyphs.has(glyph), glyph).toBe(true));
    for (const sheet of letters) {
      const content = [sheet.titleI18n[language], sheet.instructionI18n[language], sheet.glyphWord?.[language] ?? '', ...(sheet.traceRows ?? []).map(row => row.glyph)].join(' ');
      if (language === 'ar') expect(content).not.toMatch(/[A-Za-z]/);
      else expect(content).not.toMatch(/\p{Script=Arabic}/u);
    }
  });
  it('has at least one worksheet and every id is unique', () => {
    expect(PRINTABLE_WORKSHEETS.length).toBeGreaterThanOrEqual(35);
    const ids = PRINTABLE_WORKSHEETS.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('covers every printable category', () => {
    const used = new Set(PRINTABLE_WORKSHEETS.map((w) => w.category));
    expect([...used].sort()).toEqual(Object.keys(PRINTABLE_CATEGORY_LABELS).sort());
  });

  it('every category used by a worksheet has a label in all 3 languages', () => {
    PRINTABLE_WORKSHEETS.forEach((sheet) => {
      const labels = PRINTABLE_CATEGORY_LABELS[sheet.category];
      expect(labels, `missing category labels for ${sheet.category}`).toBeTruthy();
      LANGUAGES.forEach((lang) => expect(labels[lang]?.trim()).toBeTruthy());
    });
  });

  PRINTABLE_WORKSHEETS.forEach((sheet) => {
    describe(`worksheet: ${sheet.id}`, () => {
      it('has a title and instruction in ar/fr/en', () => {
        LANGUAGES.forEach((lang) => {
          expect(sheet.titleI18n[lang]?.trim(), `missing ${lang} title`).toBeTruthy();
          expect(sheet.instructionI18n[lang]?.trim(), `missing ${lang} instruction`).toBeTruthy();
        });
      });

      it('provides the payload required by its kind', () => {
        switch (sheet.kind) {
          case 'line_trace':
            expect(sheet.tracePaths?.length, sheet.id).toBeGreaterThan(0);
            sheet.tracePaths!.forEach((p) => expect(p.d?.trim(), sheet.id).toBeTruthy());
            break;
          case 'letter_trace':
            expect(sheet.traceRows?.length, sheet.id).toBeGreaterThan(0);
            sheet.traceRows!.forEach((r) => expect(r.repeatCount, sheet.id).toBeGreaterThan(0));
            break;
          case 'count_and_color':
            expect(sheet.countRows?.length, sheet.id).toBeGreaterThan(0);
            sheet.countRows!.forEach((r) => expect(r.count, sheet.id).toBeGreaterThanOrEqual(0));
            break;
          case 'match_pairs':
            expect(sheet.matchPairs?.length, sheet.id).toBeGreaterThanOrEqual(2);
            break;
          case 'odd_one_out':
            expect(sheet.oddOneOutSets?.length, sheet.id).toBeGreaterThan(0);
            sheet.oddOneOutSets!.forEach((set) => {
              expect(set.oddIndex, sheet.id).toBeGreaterThanOrEqual(0);
              expect(set.oddIndex, sheet.id).toBeLessThan(set.items.length);
            });
            break;
          case 'cut_along_lines':
            expect(sheet.cutShapes?.length, sheet.id).toBeGreaterThan(0);
            break;
          case 'coloring_page':
            expect(sheet.coloringShapeId, sheet.id).toBeTruthy();
            break;
          case 'story_order':
            expect(sheet.storyFrames, sheet.id).toHaveLength(3);
            sheet.storyFrames!.forEach(frame => LANGUAGES.forEach(lang => expect(frame.caption[lang]).toBeTruthy()));
            break;
        }
      });
    });
  });
});
