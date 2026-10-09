import React from 'react';
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { IslamicEducationInteractive } from './IslamicEducationInteractive';
import { ISLAMIC_5AP } from '../data/courses/5AP/islamic';
import type { IslamicRitualSteps } from '../types';

const lesson = ISLAMIC_5AP.find(l=>l.id==='islamic-5ap-worship-tayammum-khuffain')!;
const config = lesson.islamicInteractive as IslamicRitualSteps;

describe('Tayammum lesson complete navigation', () => {
  it('exposes every step and lets the child reach the end and return', () => {
    render(<IslamicEducationInteractive config={config}/>);
    expect(screen.getByRole('status')).toHaveTextContent('الخطوة 1 من 5');
    expect(screen.getByRole('button',{name:'الخطوة السابقة'})).toBeDisabled();
    config.steps.forEach(s=>expect(screen.getByRole('button',{name:new RegExp(s.titleAr)})).toBeInTheDocument());
    for (let i=1;i<config.steps.length;i++) {
      fireEvent.click(screen.getByRole('button',{name:'الخطوة التالية'}));
      expect(screen.getByRole('status')).toHaveTextContent(`الخطوة ${i+1} من 5`);
      expect(screen.getByText(config.steps[i].descAr)).toBeInTheDocument();
      expect(document.querySelector(`[data-ritual-illustration="${config.steps[i].illustration}"]`)).toBeTruthy();
    }
    expect(screen.getByRole('button',{name:'الخطوة التالية'})).toBeDisabled();
    fireEvent.click(screen.getByRole('button',{name:'الخطوة السابقة'}));
    expect(screen.getByRole('status')).toHaveTextContent('الخطوة 4 من 5');
  });

  it('resets safely when switching from the last step to a shorter lesson', () => {
    const view=render(<IslamicEducationInteractive config={config}/>);
    fireEvent.click(screen.getByRole('button',{name:/5\. مسح الكفين/}));
    view.rerender(<IslamicEducationInteractive config={{...config,steps:config.steps.slice(0,1)}}/>);
    expect(screen.getByRole('status')).toHaveTextContent('الخطوة 1 من 1');
    expect(screen.getByText(config.steps[0].descAr)).toBeInTheDocument();
    view.rerender(<IslamicEducationInteractive config={{...config,steps:[]}}/>);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('includes intention before the gestures in the ordering exercise, without prayer as a gesture', () => {
    const exercise=lesson.progressiveExercises?.find(e=>e.id==='islamic-5ap-tayammum-ex5');
    expect(exercise?.orderedItemsAr).toHaveLength(4);
    expect(exercise?.orderedItemsAr?.[0]).toContain('النية');
    expect(exercise?.orderedItemsAr?.[1]).toContain('ضرب الصعيد');
    expect(exercise?.orderedItemsAr?.[2]).toContain('مسح الوجه');
    expect(exercise?.orderedItemsAr?.[3]).toContain('مسح الكفين');
    expect(exercise?.orderedItemsAr?.some(s=>s.includes('الدخول في الصلاة'))).toBe(false);
  });
});
