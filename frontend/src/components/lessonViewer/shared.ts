import type { ReactNode } from 'react';

export type TabId = 'explanation' | 'content' | 'practice' | 'interactive' | 'gameplay' | 'quiz' | 'evaluation';

export type LessonStep = {
  id: TabId;
  labelAr: string;
  icon: ReactNode;
  activeClass: string;
  badgeColor: string;
};

export const PRACTICE_TIERS: { level: number; icon: string; titleAr: string }[] = [
  { level: 1, icon: '🔍', titleAr: 'المستوى 1 — أكتشف' },
  { level: 2, icon: '✏️', titleAr: 'المستوى 2 — أتدرب' },
  { level: 3, icon: '🎯', titleAr: 'المستوى 3 — أتقن' },
  { level: 4, icon: '🏆', titleAr: 'المستوى 4 — التحدي' },
  { level: 5, icon: '🌟', titleAr: 'تحدٍّ إضافي' },
];

export const tabTransition = { duration: 0.22, ease: [0.4, 0, 0.2, 1] as const };

export const shuffleOptions = <T,>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};
