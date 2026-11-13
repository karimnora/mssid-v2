import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { COURSES_DATA } from '../../data/coursesData';
import { GeometryFigure } from './GeometryFigure';

const GEOMETRY_LESSONS = [
  'math-3ap-t1-geometry-lines', 'math-3ap-t2-right-angles', 'math-3ap-t2-perpendicular-lines', 'math-3ap-t3-solids-nets',
  'math-4ap-geometry-lines-polygons', 'math-4ap-perimeter-squares-rectangles', 'math-4ap-composite-shapes-perimeter',
  'math-5ap-perimeters-areas', 'math-5ap-lines-angles', 'math-5ap-polygons-triangles', 'math-5ap-symmetry-solides', 'math-5ap-circle-radius',
];

describe('geometry mission drawings', () => {
  it.each(GEOMETRY_LESSONS)('%s opens on a drawing that renders valid coordinates', (id) => {
    const lesson = COURSES_DATA.find(l => l.id === id)!;
    const visual = lesson.learningPath!.steps[0].kind === 'observe' ? lesson.learningPath!.steps[0].visual : undefined;
    expect(visual?.type).toBe('geometry');
    if (visual?.type !== 'geometry') return;
    const { container } = render(<GeometryFigure spec={visual.figure} label={visual.captionAr} />);
    const svg = container.querySelector('svg')!;
    expect(svg.getAttribute('aria-label')).toBe(visual.captionAr);
    expect(svg.children.length).toBeGreaterThan(1);
    expect(svg.outerHTML).not.toMatch(/NaN|undefined|Infinity/);
  });

  it('draws the rectangle of the perimeter lesson with the numbers of its text', () => {
    const { container } = render(<GeometryFigure spec={{ figure: 'rectangle', width: 5, height: 3, unit: 'cm' }} label="" />);
    const labels = [...container.querySelectorAll('text')].map(node => node.textContent);
    expect(labels).toEqual(['5 cm', '3 cm']);
  });

  it('draws one unit square per square centimetre in the area lesson', () => {
    const { container } = render(<GeometryFigure spec={{ figure: 'rectangle', width: 4, height: 3, grid: true }} label="" />);
    // 3 inner vertical lines and 2 inner horizontal lines cut the rectangle into 4 × 3 = 12 squares.
    expect(container.querySelectorAll('path')).toHaveLength(5);
  });
});
