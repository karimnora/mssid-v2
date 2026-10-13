import type { PreschoolLanguage } from './types';

// Supplied Arabic, French and English recordings aligned with the surah instructions.
export const SURAH_AUDIO_CLIPS: Partial<Record<PreschoolLanguage, Record<string, { prompt: string; success: string; successDurationMs: number }>>> = {
  "ar": {
    "surah-fatiha": {
      "prompt": "/sounds/preschool/ar/surah-fatiha-prompt.mp3",
      "success": "/sounds/preschool/ar/surah-fatiha-success.mp3",
      "successDurationMs": 2292
    },
    "surah-ikhlas": {
      "prompt": "/sounds/preschool/ar/surah-ikhlas-prompt.mp3",
      "success": "/sounds/preschool/ar/surah-fatiha-success.mp3",
      "successDurationMs": 2292
    },
    "surah-falaq": {
      "prompt": "/sounds/preschool/ar/surah-falaq-prompt.mp3",
      "success": "/sounds/preschool/ar/surah-fatiha-success.mp3",
      "successDurationMs": 2292
    },
    "surah-nas": {
      "prompt": "/sounds/preschool/ar/surah-nas-prompt.mp3",
      "success": "/sounds/preschool/ar/surah-fatiha-success.mp3",
      "successDurationMs": 2292
    },
    "surah-kawthar": {
      "prompt": "/sounds/preschool/ar/surah-kawthar-prompt.mp3",
      "success": "/sounds/preschool/ar/surah-fatiha-success.mp3",
      "successDurationMs": 2292
    },
    "surah-nasr": {
      "prompt": "/sounds/preschool/ar/surah-nasr-prompt.mp3",
      "success": "/sounds/preschool/ar/surah-fatiha-success.mp3",
      "successDurationMs": 2292
    },
    "surah-asr": {
      "prompt": "/sounds/preschool/ar/surah-asr-prompt.mp3",
      "success": "/sounds/preschool/ar/surah-fatiha-success.mp3",
      "successDurationMs": 2292
    }
  },
  "fr": {
    "surah-fatiha": {
      "prompt": "/sounds/preschool/fr/surah-fatiha-prompt.mp3",
      "success": "/sounds/preschool/fr/surah-fatiha-success.mp3",
      "successDurationMs": 2187
    },
    "surah-ikhlas": {
      "prompt": "/sounds/preschool/fr/surah-ikhlas-prompt.mp3",
      "success": "/sounds/preschool/fr/surah-fatiha-success.mp3",
      "successDurationMs": 2187
    },
    "surah-falaq": {
      "prompt": "/sounds/preschool/fr/surah-falaq-prompt.mp3",
      "success": "/sounds/preschool/fr/surah-fatiha-success.mp3",
      "successDurationMs": 2187
    },
    "surah-nas": {
      "prompt": "/sounds/preschool/fr/surah-nas-prompt.mp3",
      "success": "/sounds/preschool/fr/surah-fatiha-success.mp3",
      "successDurationMs": 2187
    },
    "surah-kawthar": {
      "prompt": "/sounds/preschool/fr/surah-kawthar-prompt.mp3",
      "success": "/sounds/preschool/fr/surah-fatiha-success.mp3",
      "successDurationMs": 2187
    },
    "surah-nasr": {
      "prompt": "/sounds/preschool/fr/surah-nasr-prompt.mp3",
      "success": "/sounds/preschool/fr/surah-fatiha-success.mp3",
      "successDurationMs": 2187
    },
    "surah-asr": {
      "prompt": "/sounds/preschool/fr/surah-asr-prompt.mp3",
      "success": "/sounds/preschool/fr/surah-fatiha-success.mp3",
      "successDurationMs": 2187
    }
  },
  "en": {
    "surah-fatiha": {
      "prompt": "/sounds/preschool/en/surah-fatiha-prompt.mp3",
      "success": "/sounds/preschool/en/surah-fatiha-success.mp3",
      "successDurationMs": 2303
    },
    "surah-ikhlas": {
      "prompt": "/sounds/preschool/en/surah-ikhlas-prompt.mp3",
      "success": "/sounds/preschool/en/surah-fatiha-success.mp3",
      "successDurationMs": 2303
    },
    "surah-falaq": {
      "prompt": "/sounds/preschool/en/surah-falaq-prompt.mp3",
      "success": "/sounds/preschool/en/surah-fatiha-success.mp3",
      "successDurationMs": 2303
    },
    "surah-nas": {
      "prompt": "/sounds/preschool/en/surah-nas-prompt.mp3",
      "success": "/sounds/preschool/en/surah-fatiha-success.mp3",
      "successDurationMs": 2303
    },
    "surah-kawthar": {
      "prompt": "/sounds/preschool/en/surah-kawthar-prompt.mp3",
      "success": "/sounds/preschool/en/surah-fatiha-success.mp3",
      "successDurationMs": 2303
    },
    "surah-nasr": {
      "prompt": "/sounds/preschool/en/surah-nasr-prompt.mp3",
      "success": "/sounds/preschool/en/surah-fatiha-success.mp3",
      "successDurationMs": 2303
    },
    "surah-asr": {
      "prompt": "/sounds/preschool/en/surah-asr-prompt.mp3",
      "success": "/sounds/preschool/en/surah-fatiha-success.mp3",
      "successDurationMs": 2303
    }
  }
};
