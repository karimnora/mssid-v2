import { describe, it, expect } from 'vitest';
import { PRESCHOOL_MODULES } from './index';
import { PRINTABLE_WORKSHEETS } from './printablesData';
import { activityPicture } from '../../components/preschool/preschoolGlyphs';

const activities = PRESCHOOL_MODULES.flatMap(m => m.activities);
describe('reviewed preschool word-picture associations', () => {
  it.each([
    ['letters-taa-apple', 'Tomate', '🍅'],
    ['letters-jeem-camel', 'Jardin', 'art:garden'],
    ['letters-dal-bear', 'Dinosaure', '🦕'],
    ['letters-seen-fish', 'Soleil', '☀️'],
    ['letters-meem-banana', 'Maison', '🏠'],
    ['letters-raa-feather', 'Robe', 'art:dress'],
    ['letters-noon-bee', 'Nuage', '☁️'],
    ['letters-thal-wolf', 'Yo-yo', '🪀'],
    ['letters-zay-giraffe', 'Zèbre', '🦓'],
    ['letters-taa2-peacock', 'Tortue', '🐢'],
    ['letters-qaf-monkey', 'Quatre', '4️⃣'],
    ['letters-lam-lemon', 'Limonade', 'art:lemonade'],
    ['letters-khaa-bread', 'Xylophone', 'art:xylophone'],
  ])('%s names the picture used for the French task and echo', (id, word, picture) => {
    const a = activities.find(a=>a.id===id)!;
    expect(a.i18n.fr.promptAudio).toContain(word);
    expect(activityPicture(a,'fr')).toBe(picture);
    if(a.echoWord) expect(a.echoWord.fr).toBe(word);
  });
  it('supports all Arabic and Latin letters on paper and quantities 0–10', () => {
    const glyphs = new Set(PRINTABLE_WORKSHEETS.flatMap(w=>w.traceRows??[]).map(r=>r.glyph));
    [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ', ...'أبتثجحخدذرزسشصضطظعغفقكلمنهوي'].forEach(g=>expect(glyphs.has(g),g).toBe(true));
    for(let n=0;n<=10;n++) expect(PRINTABLE_WORKSHEETS.find(w=>w.id===`quantity-${n}`)?.countRows?.[0].count).toBe(n);
  });
  it('names the same Latin letter in spoken prompts, parent guidance and choices', () => {
    for (const activity of activities.filter(a=>a.domain==='letters')) {
      for (const language of ['fr','en'] as const) {
        const text=activity.i18n[language];
        const spoken=text.promptAudio.match(/(?:lettre|letter) ([A-Z])/i)?.[1];
        if(!spoken) continue;
        const written=text.promptText.match(/(?:lettre|letter)(?: écrite| written)? ([A-Z])/i)?.[1];
        if(written) expect(written, `${activity.id}/${language}`).toBe(spoken);
        if(text.choices) expect(text.choices.find(c=>c.isCorrect)?.asset, `${activity.id}/${language}`).toBe(spoken);
      }
    }
  });
});
