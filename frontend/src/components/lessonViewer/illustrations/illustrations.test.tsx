import React from 'react';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { LESSON_ILLUSTRATIONS } from './index';
import { ARABIC_5AP_ILLUSTRATIONS } from './arabic5ap';
import { MATH_5AP_ILLUSTRATIONS } from './math5ap';
import { SCIENCE_5AP_ILLUSTRATIONS } from './science5ap';
import { SCIENCE_5AP } from '../../../data/courses/5AP/science';
import { ARABIC_5AP } from '../../../data/courses/5AP/arabic';
import { COURSES_5AP } from '../../../data/courses/5AP';

describe('lesson illustrations', () => {
  it('draws every 5AP Arabic lesson', () => {
    expect(Object.keys(ARABIC_5AP_ILLUSTRATIONS).sort()).toEqual(ARABIC_5AP.map(lesson => lesson.id).sort());
  });

  it('draws every 5AP science lesson', () => {
    expect(Object.keys(SCIENCE_5AP_ILLUSTRATIONS).sort()).toEqual(SCIENCE_5AP.map(lesson => lesson.id).sort());
  });

  it('only uses ids of real 5AP math lessons', () => {
    const ids = new Set(COURSES_5AP.filter(lesson => lesson.subject === 'math').map(lesson => lesson.id));
    expect(Object.keys(MATH_5AP_ILLUSTRATIONS).filter(id => !ids.has(id))).toEqual([]);
  });

  it.each(Object.entries(LESSON_ILLUSTRATIONS))('%s renders a labelled drawing', (_id, Drawing) => {
    const { container } = render(<Drawing />);
    const svg = container.querySelector('svg[role="img"]');
    expect(svg?.getAttribute('aria-label')).toBeTruthy();
  });
});
