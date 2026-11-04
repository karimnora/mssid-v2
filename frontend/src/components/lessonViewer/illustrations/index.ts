import type React from 'react';
import { MATH_5AP_ILLUSTRATIONS } from './math5ap';
import { ARABIC_5AP_ILLUSTRATIONS } from './arabic5ap';

/** Drawings made for a lesson, keyed by lesson id. Shown by LessonDidou on the first step. */
export const LESSON_ILLUSTRATIONS: Record<string, React.FC> = {
  ...MATH_5AP_ILLUSTRATIONS,
  ...ARABIC_5AP_ILLUSTRATIONS,
};
