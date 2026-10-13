import { describe, expect, it } from 'vitest';
import { readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { PRESCHOOL_MODULES } from './index';
import { findRecordedSpeech } from '../../utils/recordedSpeech';

describe('preschool card and microphone word recordings', () => {
  it.each(['ar', 'fr', 'en'] as const)('%s covers the 40 requested words using the actual activity text', language => {
    const plan: { texte: string; moduleId: string; activiteId: string; type: string }[] = JSON.parse(
      readFileSync(resolve(process.cwd(), '../docs/audio-v1/prochains/22-mots-cartes-et-micro', `${language}-decoupage.json`), 'utf8'),
    );
    expect(plan).toHaveLength(40);
    for (const cue of plan) {
      const activity = PRESCHOOL_MODULES.find(module => module.id === cue.moduleId)?.activities.find(item => item.id === cue.activiteId);
      expect(activity, cue.activiteId).toBeDefined();
      const displayedWords = cue.type === 'echo'
        ? [activity!.echoWord?.[language]]
        : activity!.visualAssets.listenCards?.map(card => card.label[language]);
      expect(displayedWords, cue.texte).toContain(cue.texte);
      const clip = findRecordedSpeech(cue.texte, language);
      expect(clip, `${language}: ${cue.texte}`).toBeDefined();
      expect(clip!.src).toMatch(new RegExp(`^/sounds/preschool/${language}/`));
      expect(clip!.durationMs).toBeGreaterThan(250);
      expect(statSync(resolve(process.cwd(), 'public', clip!.src.slice(1))).size).toBeGreaterThan(1000);
    }
  });
});
