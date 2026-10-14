import type { PreschoolLanguage } from './types';

// Supplied recordings for the pre-writing activities.
export const PRE_WRITING_AUDIO_CLIPS: Partial<Record<PreschoolLanguage, Record<string, { prompt: string; success: string; successDurationMs: number }>>> = {
  "ar": {
    "writing-pencil-path": {
      "prompt": "/sounds/preschool/ar/writing-pencil-path-prompt.mp3",
      "success": "/sounds/preschool/ar/writing-pencil-path-success.mp3",
      "successDurationMs": 2269
    },
    "writing-vertical-line": {
      "prompt": "/sounds/preschool/ar/writing-vertical-line-prompt.mp3",
      "success": "/sounds/preschool/ar/writing-vertical-line-success.mp3",
      "successDurationMs": 3012
    },
    "writing-horizontal-line": {
      "prompt": "/sounds/preschool/ar/writing-horizontal-line-prompt.mp3",
      "success": "/sounds/preschool/ar/writing-horizontal-line-success.mp3",
      "successDurationMs": 2710
    },
    "writing-oblique-line": {
      "prompt": "/sounds/preschool/ar/writing-oblique-line-prompt.mp3",
      "success": "/sounds/preschool/ar/writing-oblique-line-success.mp3",
      "successDurationMs": 2895
    },
    "writing-zigzag-line": {
      "prompt": "/sounds/preschool/ar/writing-zigzag-line-prompt.mp3",
      "success": "/sounds/preschool/ar/writing-zigzag-line-success.mp3",
      "successDurationMs": 2283
    },
    "writing-wavy-line": {
      "prompt": "/sounds/preschool/ar/writing-wavy-line-prompt.mp3",
      "success": "/sounds/preschool/ar/writing-wavy-line-success.mp3",
      "successDurationMs": 2476
    },
    "writing-loop-line": {
      "prompt": "/sounds/preschool/ar/writing-loop-line-prompt.mp3",
      "success": "/sounds/preschool/ar/writing-loop-line-success.mp3",
      "successDurationMs": 3168
    },
    "writing-pencil-maze": {
      "prompt": "/sounds/preschool/ar/writing-pencil-maze-prompt.mp3",
      "success": "/sounds/preschool/ar/writing-pencil-maze-success.mp3",
      "successDurationMs": 2110
    }
  },
  "fr": {
    "writing-pencil-path": {
      "prompt": "/sounds/preschool/fr/writing-pencil-path-prompt.mp3",
      "success": "/sounds/preschool/fr/writing-pencil-path-success.mp3",
      "successDurationMs": 1996
    },
    "writing-vertical-line": {
      "prompt": "/sounds/preschool/fr/writing-vertical-line-prompt.mp3",
      "success": "/sounds/preschool/fr/writing-vertical-line-success.mp3",
      "successDurationMs": 2658
    },
    "writing-horizontal-line": {
      "prompt": "/sounds/preschool/fr/writing-horizontal-line-prompt.mp3",
      "success": "/sounds/preschool/fr/writing-horizontal-line-success.mp3",
      "successDurationMs": 2508
    },
    "writing-oblique-line": {
      "prompt": "/sounds/preschool/fr/writing-oblique-line-prompt.mp3",
      "success": "/sounds/preschool/fr/writing-oblique-line-success.mp3",
      "successDurationMs": 2967
    },
    "writing-zigzag-line": {
      "prompt": "/sounds/preschool/fr/writing-zigzag-line-prompt.mp3",
      "success": "/sounds/preschool/fr/writing-zigzag-line-success.mp3",
      "successDurationMs": 2205
    },
    "writing-wavy-line": {
      "prompt": "/sounds/preschool/fr/writing-wavy-line-prompt.mp3",
      "success": "/sounds/preschool/fr/writing-wavy-line-success.mp3",
      "successDurationMs": 2644
    },
    "writing-loop-line": {
      "prompt": "/sounds/preschool/fr/writing-loop-line-prompt.mp3",
      "success": "/sounds/preschool/fr/writing-loop-line-success.mp3",
      "successDurationMs": 2807
    },
    "writing-pencil-maze": {
      "prompt": "/sounds/preschool/fr/writing-pencil-maze-prompt.mp3",
      "success": "/sounds/preschool/fr/writing-pencil-maze-success.mp3",
      "successDurationMs": 2289
    }
  },
  "en": {
    "writing-pencil-path": {
      "prompt": "/sounds/preschool/en/writing-pencil-path-prompt.mp3",
      "success": "/sounds/preschool/en/writing-pencil-path-success.mp3",
      "successDurationMs": 2648
    },
    "writing-vertical-line": {
      "prompt": "/sounds/preschool/en/writing-vertical-line-prompt.mp3",
      "success": "/sounds/preschool/en/writing-vertical-line-success.mp3",
      "successDurationMs": 3235
    },
    "writing-horizontal-line": {
      "prompt": "/sounds/preschool/en/writing-horizontal-line-prompt.mp3",
      "success": "/sounds/preschool/en/writing-horizontal-line-success.mp3",
      "successDurationMs": 2670
    },
    "writing-oblique-line": {
      "prompt": "/sounds/preschool/en/writing-oblique-line-prompt.mp3",
      "success": "/sounds/preschool/en/writing-oblique-line-success.mp3",
      "successDurationMs": 3032
    },
    "writing-zigzag-line": {
      "prompt": "/sounds/preschool/en/writing-zigzag-line-prompt.mp3",
      "success": "/sounds/preschool/en/writing-zigzag-line-success.mp3",
      "successDurationMs": 2069
    },
    "writing-wavy-line": {
      "prompt": "/sounds/preschool/en/writing-wavy-line-prompt.mp3",
      "success": "/sounds/preschool/en/writing-wavy-line-success.mp3",
      "successDurationMs": 2925
    },
    "writing-loop-line": {
      "prompt": "/sounds/preschool/en/writing-loop-line-prompt.mp3",
      "success": "/sounds/preschool/en/writing-loop-line-success.mp3",
      "successDurationMs": 2878
    },
    "writing-pencil-maze": {
      "prompt": "/sounds/preschool/en/writing-pencil-maze-prompt.mp3",
      "success": "/sounds/preschool/en/writing-pencil-maze-success.mp3",
      "successDurationMs": 2495
    }
  }
};
