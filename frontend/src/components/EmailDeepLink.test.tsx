import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { readEmailDeepLink } from './EmailDeepLink';
import { COMPETENCES } from '../data/competences';

describe('weekly report e-mail links', () => {
  it('recognises only the two links the e-mail sends', () => {
    expect(readEmailDeepLink('?open=parent-notebook')).toBe('parent-notebook');
    expect(readEmailDeepLink('?open=offer&utm=mail')).toBe('offer');
    expect(readEmailDeepLink('?open=admin')).toBeNull();
    expect(readEmailDeepLink('')).toBeNull();
  });

  it('keeps the competence names of the e-mail in sync with the app (npx tsx scripts/export-cahiers.ts)', () => {
    const server = JSON.parse(readFileSync('../backend/src/main/resources/competence-catalog.json', 'utf8')) as { id: string; labelAr: string }[];
    expect(server.map((c) => `${c.id}|${c.labelAr}`).sort()).toEqual(COMPETENCES.map((c) => `${c.id}|${c.labelAr}`).sort());
  });
});
