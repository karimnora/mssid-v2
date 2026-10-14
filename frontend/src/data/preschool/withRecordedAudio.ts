import type { PreschoolActivity, PreschoolModule } from './types';
import { findRecordedSpeech } from '../../utils/recordedSpeech';

/** Attach available voices per language; incomplete languages retain their existing fallback. */
export function withRecordedAudio(module: PreschoolModule): PreschoolModule {
  return {
    ...module,
    activities: module.activities.map(activity => ({
      ...activity,
      i18n: Object.fromEntries((['ar', 'fr', 'en'] as const).map(language => {
        const content = activity.i18n[language];
        const prompt = findRecordedSpeech(content.promptAudio, language);
        const success = content.successAudio ? findRecordedSpeech(content.successAudio, language) : undefined;
        return [language, {
          ...content,
          ...(prompt && !content.promptAudioSrc ? { promptAudioSrc: prompt.src } : {}),
          ...(success && !content.successAudioSrc ? {
            successAudioSrc: success.src,
            successAudioDurationMs: success.durationMs,
          } : {}),
        }];
      })) as PreschoolActivity['i18n'],
    })),
  };
}
