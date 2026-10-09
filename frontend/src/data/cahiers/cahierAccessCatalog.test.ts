import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { COMPETENCE_CAHIERS } from './competenceCahiers';
describe('server cahier catalog', () => {
  it('authorizes exactly the published cahiers', () => {
    const server = readFileSync('../backend/src/main/resources/cahier-ids.txt', 'utf8').trim().split(/\r?\n/).sort();
    expect(server).toEqual(COMPETENCE_CAHIERS.map(c => c.competenceId).sort());
  });
});
