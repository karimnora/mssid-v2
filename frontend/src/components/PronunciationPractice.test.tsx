import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PronunciationPractice } from './PronunciationPractice';

vi.mock('./VoiceEchoBar', () => ({ VoiceEchoBar: ({ modelText, language }: { modelText: string; language: string }) => <div data-testid="echo" data-language={language}>{modelText}</div> }));
vi.mock('../utils/speech', () => ({ stopSpeech: vi.fn() }));

describe('pronunciation practice', () => {
  it.each([['fr', 'chat', 'chapeau', 'Suivant'], ['en', 'ship', 'sheep', 'Next']] as const)('keeps %s display and microphone model aligned when changing words', (language, first, next, label) => {
    render(<PronunciationPractice language={language} />);
    expect(screen.getByTestId('echo')).toHaveTextContent(first);
    expect(screen.getByTestId('echo')).toHaveAttribute('data-language', language);
    fireEvent.click(screen.getByRole('button', { name: label }));
    expect(screen.getByTestId('echo')).toHaveTextContent(next);
  });
});
