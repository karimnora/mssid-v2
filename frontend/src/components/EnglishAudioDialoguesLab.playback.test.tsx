import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const speech = vi.hoisted(() => ({ speak: vi.fn(), stop: vi.fn() }));
vi.mock('../utils/speech', () => ({ speakText: speech.speak, stopSpeech: speech.stop }));
vi.mock('./VoiceEchoBar', () => ({ VoiceEchoBar: ({ onBeforeAction }: { onBeforeAction?: () => void }) => <button onClick={onBeforeAction}>Record voice</button> }));
import { EnglishAudioDialoguesLab } from './EnglishAudioDialoguesLab';
import { LocaleProvider } from '../context/LocaleContext';
const renderLab = () => render(<LocaleProvider><EnglishAudioDialoguesLab /></LocaleProvider>);

let finish: Array<() => void>;
beforeEach(() => {
  vi.clearAllMocks();
  finish = [];
  speech.speak.mockImplementation(() => new Promise<void>(resolve => finish.push(resolve)));
});
const start = () => fireEvent.click(screen.getByRole('button', { name: /Play Full Dialogue/ }));
const complete = async (index: number) => act(async () => { finish[index](); });

describe('English dialogue playback', () => {
  it('waits for each real completion and passes normal speed to recorded audio', async () => {
    renderLab();
    start();
    expect(speech.speak).toHaveBeenCalledTimes(1);
    expect(speech.speak).toHaveBeenLastCalledWith(expect.stringContaining('My name is Amine'), 'en-US', 1, 1, { recordedRate: 1 });
    await complete(0);
    expect(speech.speak).toHaveBeenCalledTimes(2);
    expect(speech.speak).toHaveBeenLastCalledWith(expect.stringContaining('I am Lina'), 'en-US', 1, 1, { recordedRate: 1 });
    await complete(1); await complete(2); await complete(3);
    expect(speech.speak).toHaveBeenCalledTimes(4);
    expect(screen.getByRole('button', { name: /Play Full Dialogue/ })).toBeInTheDocument();
  });
  it('does not continue after stopping even if the old reading completes later', async () => {
    renderLab(); start();
    fireEvent.click(screen.getByRole('button', { name: 'Stop Dialogue' }));
    await complete(0);
    expect(speech.speak).toHaveBeenCalledTimes(1);
  });
  it('cancels the sequence before the microphone action', async () => {
    renderLab(); start();
    fireEvent.click(screen.getByRole('button', { name: 'Record voice' }));
    await complete(0);
    expect(speech.speak).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: /Play Full Dialogue/ })).toBeInTheDocument();
  });
  it('cancels on dialogue change', async () => {
    renderLab(); start();
    fireEvent.click(screen.getByText(/4AP.*Unit 2/).closest('button')!);
    await complete(0);
    expect(speech.speak).toHaveBeenCalledTimes(1);
    start();
    expect(speech.speak).toHaveBeenLastCalledWith(expect.stringContaining('Good morning, Father'), 'en-US', 1, 1, { recordedRate: 1 });
  });
  it('cancels on leaving the screen', async () => {
    const view = renderLab(); start();
    view.unmount(); await complete(0);
    expect(speech.stop).toHaveBeenCalled();
    expect(speech.speak).toHaveBeenCalledTimes(1);
  });
  it('cancels on speed change and does not let an old completion stop the new sequence', async () => {
    renderLab(); start();
    fireEvent.click(screen.getByRole('button', { name: /0.7x/ }));
    start();
    expect(speech.speak).toHaveBeenLastCalledWith(expect.any(String), 'en-US', 0.7, 1, { recordedRate: 0.7 });
    await complete(0);
    expect(screen.getByRole('button', { name: 'Stop Dialogue' })).toBeInTheDocument();
    expect(speech.speak).toHaveBeenCalledTimes(2);
  });
});
