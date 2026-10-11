import type { PreschoolLanguage } from './types';

// Recordings in Arabic, French and English verified against the family catalog.
export const FAMILY_AUDIO_CLIPS: Partial<Record<PreschoolLanguage, Record<string, { prompt: string; success: string; successDurationMs: number }>>> = {
  "ar": {
    "family-fennec-home": {
      "prompt": "/sounds/preschool/ar/family-fennec-home-prompt.mp3",
      "success": "/sounds/preschool/ar/family-fennec-home-success.mp3",
      "successDurationMs": 2888
    },
    "family-mom": {
      "prompt": "/sounds/preschool/ar/family-mom-prompt.mp3",
      "success": "/sounds/preschool/ar/family-mom-success.mp3",
      "successDurationMs": 2251
    },
    "family-dad": {
      "prompt": "/sounds/preschool/ar/family-dad-prompt.mp3",
      "success": "/sounds/preschool/ar/family-dad-success.mp3",
      "successDurationMs": 2011
    },
    "family-elders-baby": {
      "prompt": "/sounds/preschool/ar/family-elders-baby-prompt.mp3",
      "success": "/sounds/preschool/ar/family-elders-baby-success.mp3",
      "successDurationMs": 2693
    },
    "family-roles": {
      "prompt": "/sounds/preschool/ar/family-roles-prompt.mp3",
      "success": "/sounds/preschool/ar/family-roles-success.mp3",
      "successDurationMs": 2637
    },
    "family-memory": {
      "prompt": "/sounds/preschool/ar/family-memory-prompt.mp3",
      "success": "/sounds/preschool/ar/family-memory-success.mp3",
      "successDurationMs": 2772
    }
  },
  "fr": {
    "family-fennec-home": {
      "prompt": "/sounds/preschool/fr/family-fennec-home-prompt.mp3",
      "success": "/sounds/preschool/fr/family-fennec-home-success.mp3",
      "successDurationMs": 3577
    },
    "family-mom": {
      "prompt": "/sounds/preschool/fr/family-mom-prompt.mp3",
      "success": "/sounds/preschool/fr/family-mom-success.mp3",
      "successDurationMs": 2227
    },
    "family-dad": {
      "prompt": "/sounds/preschool/fr/family-dad-prompt.mp3",
      "success": "/sounds/preschool/fr/family-dad-success.mp3",
      "successDurationMs": 2109
    },
    "family-elders-baby": {
      "prompt": "/sounds/preschool/fr/family-elders-baby-prompt.mp3",
      "success": "/sounds/preschool/fr/family-elders-baby-success.mp3",
      "successDurationMs": 2700
    },
    "family-roles": {
      "prompt": "/sounds/preschool/fr/family-roles-prompt.mp3",
      "success": "/sounds/preschool/fr/family-roles-success.mp3",
      "successDurationMs": 2123
    },
    "family-memory": {
      "prompt": "/sounds/preschool/fr/family-memory-prompt.mp3",
      "success": "/sounds/preschool/fr/family-memory-success.mp3",
      "successDurationMs": 2575
    }
  },
  "en": {
    "family-fennec-home": {
      "prompt": "/sounds/preschool/en/family-fennec-home-prompt.mp3",
      "success": "/sounds/preschool/en/family-fennec-home-success.mp3",
      "successDurationMs": 3484
    },
    "family-mom": {
      "prompt": "/sounds/preschool/en/family-mom-prompt.mp3",
      "success": "/sounds/preschool/en/family-mom-success.mp3",
      "successDurationMs": 2724
    },
    "family-dad": {
      "prompt": "/sounds/preschool/en/family-dad-prompt.mp3",
      "success": "/sounds/preschool/en/family-dad-success.mp3",
      "successDurationMs": 1515
    },
    "family-elders-baby": {
      "prompt": "/sounds/preschool/en/family-elders-baby-prompt.mp3",
      "success": "/sounds/preschool/en/family-elders-baby-success.mp3",
      "successDurationMs": 2882
    },
    "family-roles": {
      "prompt": "/sounds/preschool/en/family-roles-prompt.mp3",
      "success": "/sounds/preschool/en/family-roles-success.mp3",
      "successDurationMs": 3706
    },
    "family-memory": {
      "prompt": "/sounds/preschool/en/family-memory-prompt.mp3",
      "success": "/sounds/preschool/en/family-memory-success.mp3",
      "successDurationMs": 2608
    }
  }
};
