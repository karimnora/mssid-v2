import { describe, it, expect } from 'vitest';
import { GAMES } from './gamesHubCatalog';

describe('GamesHub catalog integrity', () => {
  it('every game exposes progressId and maxLevels so stars can show on the card', () => {
    expect(GAMES.length).toBe(10);
    for (const game of GAMES) {
      expect(game.progressId, `${game.id} missing progressId`).toBe(game.id);
      expect(game.maxLevels, `${game.id} missing maxLevels`).toBeGreaterThan(0);
    }
  });
});
