/** Bound requests; after a failure drain in-flight work without starting more paid calls. */
export async function runAudioQueue<T>(jobs: readonly T[], concurrency: number, produce: (job: T) => Promise<void>) {
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 4) throw new Error('Audio concurrency must be 1 to 4');
  let cursor = 0;
  let failed = false;
  let failure: unknown;
  await Promise.all(Array.from({ length: Math.min(jobs.length, concurrency) }, async () => {
    while (!failed && cursor < jobs.length) {
      const job = jobs[cursor++];
      try { await produce(job); } catch (error) { failed = true; failure ??= error; }
    }
  }));
  if (failed) throw failure;
}
