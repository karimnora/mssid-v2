import { APPROVED_VALUES_RECORDINGS } from './approvedValuesAudio';
import type { PreschoolLanguage } from './types';

// Supplied Arabic, French and English recordings aligned with the values activities.
export const VALUES_AUDIO_CLIPS: Partial<Record<PreschoolLanguage, Record<string, { prompt: string; success: string; successDurationMs: number }>>> = {
  "ar": {
    "values-mosque-path": {
      "prompt": "/sounds/preschool/ar/values-mosque-path-prompt.mp3",
      "success": "/sounds/preschool/ar/values-mosque-path-success.mp3",
      "successDurationMs": 2796
    },
    "values-bismillah": {
      "prompt": "/sounds/preschool/ar/values-bismillah-approved-prompt-4d4945869703.mp3",
      "success": "/sounds/preschool/ar/values-bismillah-approved-success-d3c251b8f2e8.mp3",
      "successDurationMs": 2273
    },
    "values-alhamdulillah": {
      "prompt": "/sounds/preschool/ar/values-alhamdulillah-approved-prompt-386e72892ab7.mp3",
      "success": "/sounds/preschool/ar/values-alhamdulillah-approved-success-97a011396abb.mp3",
      "successDurationMs": 2429
    },
    "values-salam": {
      "prompt": "/sounds/preschool/ar/values-salam-prompt.mp3",
      "success": "/sounds/preschool/ar/values-salam-success.mp3",
      "successDurationMs": 2428
    },
    "values-mosque-tap": {
      "prompt": "/sounds/preschool/ar/values-mosque-tap-prompt.mp3",
      "success": "/sounds/preschool/ar/algeria-mosque-success.mp3",
      "successDurationMs": 2208
    },
    "values-good-manners": {
      "prompt": "/sounds/preschool/ar/values-good-manners-prompt.mp3",
      "success": "/sounds/preschool/ar/values-good-manners-success.mp3",
      "successDurationMs": 3299
    },
    "values-memory": {
      "prompt": "/sounds/preschool/ar/values-memory-prompt.mp3",
      "success": "/sounds/preschool/ar/values-memory-success.mp3",
      "successDurationMs": 2379
    }
  },
  "fr": {
    "values-mosque-path": {
      "prompt": "/sounds/preschool/fr/values-mosque-path-prompt.mp3",
      "success": "/sounds/preschool/fr/values-mosque-path-success.mp3",
      "successDurationMs": 2496
    },
    "values-bismillah": {
      "prompt": "/sounds/preschool/fr/values-bismillah-approved-prompt-e3761dcce64c.mp3",
      "success": "/sounds/preschool/fr/values-bismillah-approved-success-bbcec19644b2.mp3",
      "successDurationMs": 1959
    },
    "values-alhamdulillah": {
      "prompt": "/sounds/preschool/fr/values-alhamdulillah-approved-prompt-5dc0c0e4105a.mp3",
      "success": "/sounds/preschool/fr/values-alhamdulillah-approved-success-ebfb520a4fae.mp3",
      "successDurationMs": 2116
    },
    "values-salam": {
      "prompt": "/sounds/preschool/fr/values-salam-prompt.mp3",
      "success": "/sounds/preschool/fr/values-salam-success.mp3",
      "successDurationMs": 2422
    },
    "values-mosque-tap": {
      "prompt": "/sounds/preschool/fr/values-mosque-tap-prompt.mp3",
      "success": "/sounds/preschool/fr/algeria-mosque-success.mp3",
      "successDurationMs": 2264
    },
    "values-good-manners": {
      "prompt": "/sounds/preschool/fr/values-good-manners-prompt.mp3",
      "success": "/sounds/preschool/fr/values-good-manners-success.mp3",
      "successDurationMs": 3106
    },
    "values-memory": {
      "prompt": "/sounds/preschool/fr/values-memory-prompt.mp3",
      "success": "/sounds/preschool/fr/values-memory-success.mp3",
      "successDurationMs": 3149
    }
  },
  "en": {
    "values-mosque-path": {
      "prompt": "/sounds/preschool/en/values-mosque-path-prompt.mp3",
      "success": "/sounds/preschool/en/values-mosque-path-success.mp3",
      "successDurationMs": 2859
    },
    "values-bismillah": {
      "prompt": "/sounds/preschool/en/values-bismillah-approved-prompt-ec48cfb2e081.mp3",
      "success": "/sounds/preschool/en/values-bismillah-approved-success-293cd4bf81ea.mp3",
      "successDurationMs": 2586
    },
    "values-alhamdulillah": {
      "prompt": "/sounds/preschool/en/values-alhamdulillah-approved-prompt-993895a3e816.mp3",
      "success": "/sounds/preschool/en/values-alhamdulillah-approved-success-b3c39f892a9e.mp3",
      "successDurationMs": 2429
    },
    "values-salam": {
      "prompt": "/sounds/preschool/en/values-salam-prompt.mp3",
      "success": "/sounds/preschool/en/values-salam-success.mp3",
      "successDurationMs": 2798
    },
    "values-mosque-tap": {
      "prompt": "/sounds/preschool/en/values-mosque-tap-prompt.mp3",
      "success": "/sounds/preschool/en/algeria-mosque-success.mp3",
      "successDurationMs": 2347
    },
    "values-good-manners": {
      "prompt": "/sounds/preschool/en/values-good-manners-prompt.mp3",
      "success": "/sounds/preschool/en/values-good-manners-success.mp3",
      "successDurationMs": 3932
    },
    "values-memory": {
      "prompt": "/sounds/preschool/en/values-memory-prompt.mp3",
      "success": "/sounds/preschool/en/values-memory-success.mp3",
      "successDurationMs": 3197
    }
  }
};

// Consistency guard: approved clips (already written above) must match an existing activity.
for (const clip of APPROVED_VALUES_RECORDINGS) {
  const entry = VALUES_AUDIO_CLIPS[clip.language]?.[clip.activityId];
  if (!entry) throw new Error('Approved values recording has no activity');
  if (clip.kind === 'prompt') entry.prompt = clip.src;
  else { entry.success = clip.src; entry.successDurationMs = clip.durationMs; }
}
