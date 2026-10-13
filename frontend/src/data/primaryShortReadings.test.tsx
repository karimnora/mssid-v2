import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { ARABIC_1AP_THEMES } from './courses/1AP/arabic-themes';
import { YoungLessonStory } from '../components/lessonViewer/YoungLessonStory';

describe('first grade short readings', () => {
  it('connects the school reading to the lesson and speaks its vowel marks even when hidden', () => {
    const lesson = ARABIC_1AP_THEMES.find(row => row.id === 'arabic-1ap-t1-school-axis')!;
    expect(lesson.readingStory?.scenes).toHaveLength(2);
    const onSpeak = vi.fn();
    const { container } = render(<YoungLessonStory lesson={lesson} tashkeelEnabled={false} onSpeak={onSpeak} />);
    fireEvent.click(container.querySelector('[data-tap-speak="scene-first-school-book"]')!);
    expect(onSpeak).toHaveBeenCalledWith('scene-first-school-book', 'هَذَا كِتَابٌ.');
  });
});
