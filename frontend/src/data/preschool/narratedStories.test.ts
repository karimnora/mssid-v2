import { describe, it, expect } from 'vitest';
import { statSync } from 'node:fs';
import { resolve } from 'node:path';
import { STORIES_MODULE } from './storiesModule';
import { NARRATED_STORIES, STORY_SPEECH } from './narratedStories';
import { findRecordedSpeechSequence } from '../../utils/recordedSpeech';

describe('preschool narrated story catalogue', () => {
  it('keeps the three original stories and adds nine distinct stories with two answerable questions', () => {
    expect(STORIES_MODULE.activities.slice(0, 3).map(a => a.id)).toEqual(['story-couscous', 'story-wash-hands', 'story-school-day']);
    expect(STORIES_MODULE.activities).toHaveLength(12);
    expect(NARRATED_STORIES).toHaveLength(9);
    for (const activity of NARRATED_STORIES) {
      expect(activity.narratedStory!.questions).toHaveLength(2);
      for (const q of activity.narratedStory!.questions) {
        expect(q.choices.filter(c => c.id === q.correctId)).toHaveLength(1);
        expect(new Set(q.choices.map(c => c.asset)).size).toBe(q.choices.length);
      }
    }
  });
  it.each(['ar', 'fr', 'en'] as const)('has real recorded narration, questions, choices and feedback in %s', language => {
    const texts = Object.values(STORY_SPEECH).map(t => t[language]);
    for (const activity of NARRATED_STORIES) {
      texts.push(activity.i18n[language].promptAudio);
      for (const q of activity.narratedStory!.questions) texts.push(q.prompt[language], ...q.choices.map(c => c.label[language]));
    }
    for (const text of texts) {
      const recordings = findRecordedSpeechSequence(text, language);
      expect(recordings, `${language}: ${text}`).toBeTruthy();
      for (const recording of recordings ?? []) expect(statSync(resolve('public', recording.src.slice(1))).size).toBeGreaterThan(1000);
    }
    for (const activity of STORIES_MODULE.activities.filter(a => a.narratedStory)) expect(activity.i18n[language].promptAudioSrc).toBeTruthy();
  });
  it('never answers a question with an object that has nothing to do with the story', () => {
    // A ball or a bed among the choices lets the child answer without listening to the story.
    const unrelated = new Set(['⚽', '🛏️']);
    for (const activity of NARRATED_STORIES) {
      for (const q of activity.narratedStory!.questions) {
        expect(q.choices.filter(c => unrelated.has(c.asset)).map(c => `${q.id}: ${c.label.fr}`)).toEqual([]);
      }
    }
  });
});

