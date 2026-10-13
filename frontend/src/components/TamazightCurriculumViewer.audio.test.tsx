import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TamazightCurriculumViewer } from './TamazightCurriculumViewer';

const speech = vi.hoisted(() => vi.fn());
vi.mock('../utils/speech', () => ({ speakText: speech }));

describe('Tamazight pronunciation', () => {
  it('does not offer a French or Arabic approximation of mixed Tamazight content', () => {
    render(<TamazightCurriculumViewer />);
    expect(screen.queryByTitle('استمع لنطق العنوان')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /استمع إلى/ })).not.toBeInTheDocument();
    expect(speech).not.toHaveBeenCalled();
  });
});
