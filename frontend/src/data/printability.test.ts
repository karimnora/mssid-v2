import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COURSES_DATA } from './coursesData';
import { OFFICIAL_EXAMS_DATA } from './examsData';

/** A lesson can produce a non-blank revision fiche if it has at least one of these fields. */
function lessonHasPrintableContent(lesson: (typeof COURSES_DATA)[number]): boolean {
  return Boolean(
    lesson.summaryAr?.trim()
    || (lesson.rulesAr && lesson.rulesAr.length > 0)
    || (lesson.keyFormulas && lesson.keyFormulas.length > 0)
    || (lesson.detailedCourse?.vocabulary && lesson.detailedCourse.vocabulary.length > 0)
    || lesson.detailedCourse?.takeawayAr?.trim()
  );
}

function examHasPrintableContent(exam: (typeof OFFICIAL_EXAMS_DATA)[number]): boolean {
  return Boolean(
    exam.titleAr?.trim()
    && exam.exercises.length > 0
    && exam.exercises.every((ex) => ex.titleAr?.trim() && ex.contentAr?.trim())
    && exam.problemExercise?.titleAr?.trim()
    && exam.problemExercise?.contentAr?.trim()
  );
}

describe('Printability — courses (fiches de révision)', () => {
  it('has at least one printable field on every lesson (1AP–5AP)', () => {
    const thin = COURSES_DATA.filter((lesson) => !lessonHasPrintableContent(lesson));
    expect(thin.map((l) => l.id)).toEqual([]);
  });

  it('covers all primary grades with courses', () => {
    for (const grade of ['1AP', '2AP', '3AP', '4AP', '5AP'] as const) {
      expect(COURSES_DATA.some((l) => l.grade === grade)).toBe(true);
    }
  });
});

describe('Printability — official exams', () => {
  it('has complete subject content on every exam paper (2AP–5AP)', () => {
    const empty = OFFICIAL_EXAMS_DATA.filter((exam) => !examHasPrintableContent(exam));
    expect(empty.map((e) => e.id)).toEqual([]);
  });

  it('has no 1AP exams (bank starts at 2AP)', () => {
    expect(OFFICIAL_EXAMS_DATA.filter((e) => e.grade === '1AP')).toEqual([]);
  });

  it('covers 2AP–5AP with at least one paper each', () => {
    for (const grade of ['2AP', '3AP', '4AP', '5AP'] as const) {
      expect(OFFICIAL_EXAMS_DATA.some((e) => e.grade === grade)).toBe(true);
    }
  });
});

describe('Print CSS — exam and fiche jobs must not go blank', () => {
  const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../index.css'), 'utf8');

  it('hides header/main/footer only when printing a certificate overlay', () => {
    expect(css).toContain('body:has(.certificate-print-modal) main');
    expect(css).not.toMatch(/\n  header,\n  main,\n  footer \{\n    display: none/);
  });

  it('keeps the math corrige two-column grid instead of forcing every child to block', () => {
    expect(css).toContain('[data-exam-two-col]');
    expect(css).not.toContain('[data-print-mode="corrige"] .print-corrige *');
  });

  it('flattens overlay worksheets so preschool print is not clipped or blank', () => {
    expect(css).toContain('body:has(.sheet-print-modal) > :not(.sheet-print-modal)');
    expect(css).toContain('.sheet-print-modal .printable-sheet');
    expect(css).toMatch(/\.sheet-print-modal \.printable-sheet \{[\s\S]*position: static/);
  });
});

describe('Print CSS — mobile dialog shell', () => {
  const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../index.css'), 'utf8');

  it('caps kids dialogs to the visual viewport so they scroll instead of overflowing', () => {
    expect(css).toContain('.kids-modal-body');
    expect(css).toContain('max-height: min(90dvh, calc(100svh - 1.5rem))');
  });

  it('keeps print overlays below the phone status bar when the WebView reports no inset', () => {
    expect(css).toContain('.sheet-print-modal,');
    expect(css).toContain('.certificate-print-modal {');
    expect(css).toContain('.revision-sheet-toolbar {');
    expect(css).toContain('padding-top: max(2.5rem, calc(env(safe-area-inset-top) + 0.75rem)) !important;');
  });
});

describe('Print overlays — exam worksheets use the same sheet-print-modal shell', () => {
  it('applies sheet-print-modal on the exam worksheet generator overlay', () => {
    const src = readFileSync(
      resolve(dirname(fileURLToPath(import.meta.url)), '../components/PrintableWorksheetsGeneratorModal.tsx'),
      'utf8',
    );
    expect(src).toContain('sheet-print-modal');
  });
});

