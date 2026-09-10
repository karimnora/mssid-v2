import { describe, expect, it } from 'vitest';
import { frenchProjectsForGrade, isWritingRichEnough } from './FrenchProjectsLabInteractive';

describe('frenchProjectsForGrade', () => {
  it('shows 4 official 3AP projects for 3AP', () => {
    const projects = frenchProjectsForGrade('3AP');
    expect(projects).toHaveLength(4);
    expect(projects.every((p) => p.grade === '3AP')).toBe(true);
    expect(projects.map((p) => p.projectNumber)).toEqual([1, 2, 3, 4]);
  });

  it('never shows 5AP projects to 3AP', () => {
    const projects = frenchProjectsForGrade('3AP');
    expect(projects.some((p) => p.grade === '5AP')).toBe(false);
  });

  it('shows 3 five-AP projects for 5AP only', () => {
    const projects = frenchProjectsForGrade('5AP');
    expect(projects).toHaveLength(3);
    expect(projects.every((p) => p.grade === '5AP')).toBe(true);
  });

  it('offers 3AP revision projects for 4AP', () => {
    const projects = frenchProjectsForGrade('4AP');
    expect(projects).toHaveLength(4);
    expect(projects.every((p) => p.grade === '3AP')).toBe(true);
  });
});

// Regression test: a raw "> 20 characters" check let a short, mostly-nonsense answer earn the same
// "Bravo, ta production est riche" praise (and XP/coins) as a real paragraph, since 20 characters is
// only a few words. Real report: "je suis beojg alors bonne nuit" (a typo-word, no real content).
describe('isWritingRichEnough', () => {
  it('rejects the exact reported false positive (short, mostly gibberish, but > 20 chars)', () => {
    expect(isWritingRichEnough('je suis beojg alors bonne nuit')).toBe(false);
  });

  it('rejects empty or near-empty input', () => {
    expect(isWritingRichEnough('')).toBe(false);
    expect(isWritingRichEnough('   ')).toBe(false);
  });

  it('rejects a single word padded with spaces past the old 20-char threshold', () => {
    expect(isWritingRichEnough('bonjourbonjourbonjourbonjour')).toBe(false);
  });

  it('rejects a repeated word used only to pad length/word-count', () => {
    expect(isWritingRichEnough('chat chat chat chat chat chat chat chat')).toBe(false);
  });

  it('accepts a real short paragraph with several distinct words', () => {
    expect(
      isWritingRichEnough(
        'Le fennec vit dans le désert du Sahara. Il mange des insectes et des plantes la nuit.'
      )
    ).toBe(true);
  });

  it('accepts four short distinct ecological tips (the "4 conseils" task shape)', () => {
    expect(
      isWritingRichEnough('Ferme le robinet. Recycle le papier. Économise l’eau. Plante un arbre.')
    ).toBe(true);
  });
});
