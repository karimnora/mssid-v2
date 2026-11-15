import { describe, expect, it } from 'vitest';
import { runAudioQueue } from './audio-production-queue';

describe('bounded paid audio production', () => {
  it('processes each job once while respecting concurrency', async () => {
    let active = 0, maximum = 0;
    const completed: number[] = [];
    await runAudioQueue([1, 2, 3, 4, 5], 2, async job => {
      maximum = Math.max(maximum, ++active);
      await new Promise(resolve => setTimeout(resolve, 5));
      completed.push(job); active--;
    });
    expect(maximum).toBe(2);
    expect(completed.sort()).toEqual([1, 2, 3, 4, 5]);
  });
  it('stops new billing after an error but waits for the other active job to save', async () => {
    const started: number[] = [], saved: number[] = [];
    await expect(runAudioQueue([1, 2, 3, 4], 2, async job => {
      started.push(job);
      if (job === 1) throw new Error('provider unavailable');
      await new Promise(resolve => setTimeout(resolve, 10));
      saved.push(job);
    })).rejects.toThrow('provider unavailable');
    expect(started).toEqual([1, 2]);
    expect(saved).toEqual([2]);
  });
  it('rejects unbounded concurrency before any call', async () => {
    let calls = 0;
    await expect(runAudioQueue([1], 20, async () => { calls++; })).rejects.toThrow('1 to 4');
    expect(calls).toBe(0);
  });
});
