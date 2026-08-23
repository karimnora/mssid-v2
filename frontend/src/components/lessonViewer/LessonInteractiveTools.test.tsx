import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { COURSES_DATA } from '../../data/coursesData';
import { hasRenderableInteractiveTool, LessonInteractiveTools } from './LessonInteractiveTools';

describe('P0 interactive lesson tools', () => {
  it('renders tamazight_lab instead of a blank tab', async () => {
    const tamazight = COURSES_DATA.filter((l) => l.interactiveTool === 'tamazight_lab');
    expect(tamazight.length).toBe(10);
    tamazight.forEach((lesson) => {
      expect(hasRenderableInteractiveTool(lesson)).toBe(true);
    });

    const lesson = tamazight.find((l) => l.id === 'tamazight-3ap-initiation-lettres-formes');
    expect(lesson).toBeDefined();
    render(<LessonInteractiveTools lesson={lesson!} />);

    await waitFor(() => {
      expect(screen.getByText(/المختبر التفاعلي للغة الأمازيغية/)).toBeInTheDocument();
    });
    expect(screen.getAllByText('ⵣ').length).toBeGreaterThan(0);
    expect(screen.queryByText('العودة للأدوات')).not.toBeInTheDocument();
  });

  it('does not open the 5AP conjugueur on 3AP French or English lessons', async () => {
    const lang3ap = COURSES_DATA.filter(
      (l) => l.grade === '3AP' && (l.subject === 'french' || l.subject === 'english'),
    );
    expect(lang3ap.length).toBeGreaterThanOrEqual(19);
    lang3ap.forEach((lesson) => {
      expect(lesson.interactiveTool).not.toBe('french_lab');
      expect(lesson.interactiveTool).not.toBe('english_lab');
      expect(['french_dialogue_lab', 'english_dialogue_lab']).toContain(lesson.interactiveTool);
      expect(lesson.languageInteractive).toBeDefined();
      expect(hasRenderableInteractiveTool(lesson)).toBe(true);
    });

    const greetings = lang3ap.find((l) => l.id === 'french-3ap-p1-seq1-greetings-letters');
    expect(greetings).toBeDefined();
    render(<LessonInteractiveTools lesson={greetings!} />);

    await waitFor(() => {
      expect(screen.getByText('Bonjour ! Je me présente')).toBeInTheDocument();
    });
    expect(screen.queryByText('Imparfait (5AP)')).not.toBeInTheDocument();
  });
});

describe('P1 math interactive coverage 1AP–4AP', () => {
  it('every math lesson from 1AP to 4AP has a renderable tool', () => {
    const math = COURSES_DATA.filter(
      (l) => l.subject === 'math' && ['1AP', '2AP', '3AP', '4AP'].includes(l.grade),
    );
    expect(math.length).toBeGreaterThan(40);
    math.forEach((lesson) => {
      expect(hasRenderableInteractiveTool(lesson), lesson.id).toBe(true);
    });
  });

  it('uses clock_trainer on 3AP time and math_lab pose on 2AP addition', () => {
    expect(COURSES_DATA.find((l) => l.id === 'math-3ap-t3-time-read')?.interactiveTool).toBe('clock_trainer');
    expect(COURSES_DATA.find((l) => l.id === 'math-2ap-t1-addition-no-carry')?.interactiveTool).toBe('math_lab');
    expect(COURSES_DATA.find((l) => l.id === 'math-2ap-t1-addition-no-carry')?.mathInteractive?.type).toBe(
      'written_operation',
    );
    expect(COURSES_DATA.find((l) => l.id === 'math-3ap-t3-division-fractions')?.mathInteractive?.type).toBe(
      'number_cards',
    );
  });
});
