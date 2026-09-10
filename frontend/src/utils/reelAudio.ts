// Gemini TTS (GeminiAiService.generateNarration) returns raw PCM audio — no container format, so
// the browser's AudioContext.decodeAudioData can't read it directly. This wraps it in a minimal WAV
// header (the only work needed to make raw PCM decodable) and adds a tiny procedural transition
// chime (Web Audio oscillator, no external asset) so a reel isn't dead silent even without narration.

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** Parses the sample rate out of a Gemini TTS mimeType like "audio/L16;codec=pcm;rate=24000". */
function parseSampleRate(mimeType: string | undefined): number {
  const match = mimeType?.match(/rate=(\d+)/);
  return match ? parseInt(match[1], 10) : 24000;
}

/** Wraps 16-bit signed mono PCM bytes in a WAV (RIFF) header — the browser needs a container to decode it. */
export function pcmBase64ToWavBlob(audioBase64: string, mimeType?: string): Blob {
  const pcmBytes = base64ToBytes(audioBase64);
  const sampleRate = parseSampleRate(mimeType);
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = pcmBytes.length;

  const header = new ArrayBuffer(44);
  const view = new DataView(header);
  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };
  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true); // fmt chunk size
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeStr(36, 'data');
  view.setUint32(40, dataSize, true);

  return new Blob([header, pcmBytes], { type: 'audio/wav' });
}

export async function decodeAudioBlob(audioCtx: AudioContext, blob: Blob): Promise<AudioBuffer> {
  const arrayBuffer = await blob.arrayBuffer();
  return audioCtx.decodeAudioData(arrayBuffer);
}

/** A short, pleasant rising "pop" — plays at each slide transition so a narration-less reel still has sound. */
export function scheduleTransitionChime(audioCtx: AudioContext, destination: AudioNode, atTime: number) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(520, atTime);
  osc.frequency.exponentialRampToValueAtTime(880, atTime + 0.12);
  gain.gain.setValueAtTime(0.0001, atTime);
  gain.gain.exponentialRampToValueAtTime(0.22, atTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, atTime + 0.22);
  osc.connect(gain);
  gain.connect(destination);
  osc.start(atTime);
  osc.stop(atTime + 0.25);
}
