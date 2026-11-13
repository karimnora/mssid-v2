import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PreschoolNarratedStory } from './PreschoolNarratedStory';
import { NARRATED_STORIES, STORY_SPEECH } from '../../data/preschool/narratedStories';

const speech = vi.hoisted(() => ({ speak: vi.fn(), stop: vi.fn() }));
vi.mock('./usePreschoolAudio', () => ({ usePreschoolSpeech: () => speech, playGentleNudge: vi.fn(), playSuccessChime: vi.fn() }));
beforeEach(() => { vi.useFakeTimers(); vi.clearAllMocks(); });
afterEach(() => vi.useRealTimers());
const activity = NARRATED_STORIES[0];

describe('narrated preschool stories', () => {
  it('requires both correct answers and a retelling confirmation; mistakes remain retryable', () => {
    const complete = vi.fn();
    render(<PreschoolNarratedStory activity={activity} story={activity.narratedStory!} language="fr" onComplete={complete} />);
    fireEvent.click(screen.getByRole('button', { name: 'On joue avec l’histoire ▶' }));
    act(() => vi.advanceTimersByTime(250));
    expect(speech.speak).toHaveBeenCalledWith(activity.narratedStory!.questions[0].prompt.fr);
    fireEvent.click(screen.getByRole('button', { name: 'Un livre' }));
    expect(complete).not.toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: 'Je continue ▶' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Des pommes' }));
    fireEvent.click(screen.getByRole('button', { name: 'Je continue ▶' }));
    fireEvent.click(screen.getByRole('button', { name: 'Un panier' }));
    fireEvent.click(screen.getByRole('button', { name: 'Je continue ▶' }));
    expect(document.querySelector('[data-narrated-story="retell"]')).toBeTruthy();
    expect(complete).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Je l’ai racontée !' }));
    expect(complete).toHaveBeenCalledTimes(1);
  });

  it('listens to a choice without submitting it and keeps controls separate', () => {
    render(<PreschoolNarratedStory activity={activity} story={activity.narratedStory!} language="fr" onComplete={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'On joue avec l’histoire ▶' }));
    fireEvent.click(screen.getByRole('button', { name: 'Écouter: Des pommes' }));
    expect(speech.speak).toHaveBeenLastCalledWith('Des pommes');
    expect(screen.queryByRole('status')).toBeNull();
    expect(document.querySelector('button button')).toBeNull();
  });

  it.each(['ar', 'en'] as const)('uses the chosen language for the question and feedback: %s', language => {
    const { container } = render(<PreschoolNarratedStory activity={activity} story={activity.narratedStory!} language={language} onComplete={vi.fn()} />);
    fireEvent.click(container.querySelector('[data-narrated-story="listen"] > button:last-child')!);
    act(() => vi.advanceTimersByTime(250));
    expect(speech.speak).toHaveBeenCalledWith(activity.narratedStory!.questions[0].prompt[language]);
    fireEvent.click(screen.getByRole('button', { name: activity.narratedStory!.questions[0].choices[1].label[language] }));
    expect(speech.speak).toHaveBeenLastCalledWith(STORY_SPEECH.retry[language]);
  });
});
