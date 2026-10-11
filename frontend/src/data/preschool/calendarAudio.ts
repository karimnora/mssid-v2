import type { PreschoolLanguage } from './types';

// Recordings in Arabic, French and English verified against the calendar catalog.
export const CALENDAR_AUDIO_CLIPS: Partial<Record<PreschoolLanguage, Record<string, { prompt: string; success: string; successDurationMs: number }>>> = {
  "ar": {
    "calendar-days": {
      "prompt": "/sounds/preschool/ar/calendar-days-prompt.mp3",
      "success": "/sounds/preschool/ar/calendar-days-success.mp3",
      "successDurationMs": 2598
    },
    "calendar-months-1": {
      "prompt": "/sounds/preschool/ar/calendar-months-1-prompt.mp3",
      "success": "/sounds/preschool/ar/calendar-months-1-success.mp3",
      "successDurationMs": 2944
    },
    "calendar-months-2": {
      "prompt": "/sounds/preschool/ar/calendar-months-2-prompt.mp3",
      "success": "/sounds/preschool/ar/calendar-months-2-success.mp3",
      "successDurationMs": 2359
    },
    "calendar-school-weekend": {
      "prompt": "/sounds/preschool/ar/calendar-school-weekend-prompt.mp3",
      "success": "/sounds/preschool/ar/calendar-school-weekend-success.mp3",
      "successDurationMs": 2765
    }
  },
  "fr": {
    "calendar-days": {
      "prompt": "/sounds/preschool/fr/calendar-days-prompt.mp3",
      "success": "/sounds/preschool/fr/calendar-days-success.mp3",
      "successDurationMs": 2874
    },
    "calendar-months-1": {
      "prompt": "/sounds/preschool/fr/calendar-months-1-prompt.mp3",
      "success": "/sounds/preschool/fr/calendar-months-1-success.mp3",
      "successDurationMs": 3125
    },
    "calendar-months-2": {
      "prompt": "/sounds/preschool/fr/calendar-months-2-prompt.mp3",
      "success": "/sounds/preschool/fr/calendar-months-2-success.mp3",
      "successDurationMs": 2760
    },
    "calendar-school-weekend": {
      "prompt": "/sounds/preschool/fr/calendar-school-weekend-prompt.mp3",
      "success": "/sounds/preschool/fr/calendar-school-weekend-success.mp3",
      "successDurationMs": 2993
    }
  },
  "en": {
    "calendar-days": {
      "prompt": "/sounds/preschool/en/calendar-days-prompt.mp3",
      "success": "/sounds/preschool/en/calendar-days-success.mp3",
      "successDurationMs": 3174
    },
    "calendar-months-1": {
      "prompt": "/sounds/preschool/en/calendar-months-1-prompt.mp3",
      "success": "/sounds/preschool/en/calendar-months-1-success.mp3",
      "successDurationMs": 2944
    },
    "calendar-months-2": {
      "prompt": "/sounds/preschool/en/calendar-months-2-prompt.mp3",
      "success": "/sounds/preschool/en/calendar-months-2-success.mp3",
      "successDurationMs": 2789
    },
    "calendar-school-weekend": {
      "prompt": "/sounds/preschool/en/calendar-school-weekend-prompt.mp3",
      "success": "/sounds/preschool/en/calendar-school-weekend-success.mp3",
      "successDurationMs": 2880
    }
  }
};
