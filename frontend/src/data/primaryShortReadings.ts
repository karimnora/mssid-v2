import type { ReadingStory } from '../types';

export const FIRST_READINGS: Record<string, ReadingStory> = {
  'arabic-1ap-t1-school-axis': {
    titleAr: 'أَقْرَأُ جُمْلَةً قَصِيرَةً',
    characters: [],
    scenes: [
      { id: 'first-school-book', emoji: '📖', textAr: 'هَذَا كِتَابٌ.' },
      { id: 'first-school-pen', emoji: '✏️', textAr: 'هَذَا قَلَمٌ.' },
    ],
  },
  'arabic-1ap-t1-family-axis': {
    titleAr: 'أَقْرَأُ عَنْ العَائِلَةِ',
    characters: [],
    scenes: [
      { id: 'first-family-mom', emoji: '👩', textAr: 'هَذِهِ أُمٌّ.' },
      { id: 'first-family-dad', emoji: '👨', textAr: 'هَذَا أَبٌ.' },
    ],
  },
};
