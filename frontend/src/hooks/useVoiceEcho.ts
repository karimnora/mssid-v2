import { useCallback, useEffect, useRef, useState } from 'react';

export type VoiceEchoPhase = 'idle' | 'recording' | 'ready' | 'playing' | 'denied' | 'unsupported';

const MAX_MS = 20_000;
const TIMESLICE_MS = 200;

const MIME_CANDIDATES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4',
  'audio/ogg;codecs=opus',
];

export function pickRecorderMime(): string | undefined {
  if (typeof MediaRecorder === 'undefined') return undefined;
  return MIME_CANDIDATES.find((type) => MediaRecorder.isTypeSupported(type));
}

export function voiceEchoSupported(): boolean {
  return typeof navigator !== 'undefined'
    && !!navigator.mediaDevices?.getUserMedia
    && typeof MediaRecorder !== 'undefined';
}

function attachHiddenAudio(audio: HTMLAudioElement) {
  if (audio.isConnected) return;
  audio.setAttribute('playsinline', 'true');
  audio.setAttribute('data-voice-echo', 'true');
  audio.preload = 'auto';
  audio.controls = false;
  audio.hidden = true;
  document.body.appendChild(audio);
}

/** Record the child's voice then play it back — no upload, blob stays in memory. */
export function useVoiceEcho() {
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const urlRef = useRef<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const [phase, setPhase] = useState<VoiceEchoPhase>(() => (voiceEchoSupported() ? 'idle' : 'unsupported'));
  const [failed, setFailed] = useState(false);

  const clearUrl = () => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
  };

  const stopTimer = () => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const stop = useCallback(() => {
    stopTimer();
    const rec = recorderRef.current;
    if (!rec || rec.state === 'inactive') return;
    try {
      rec.requestData();
    } catch {
      /* some browsers throw if no data yet */
    }
    rec.stop();
  }, []);

  const start = useCallback(async () => {
    if (!voiceEchoSupported()) {
      setPhase('unsupported');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      chunksRef.current = [];
      clearUrl();
      setFailed(false);
      const mime = pickRecorderMime();
      const rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      recorderRef.current = rec;
      rec.ondataavailable = (ev) => {
        if (ev.data.size > 0) chunksRef.current.push(ev.data);
      };
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const type = rec.mimeType || mime || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type });
        clearUrl();
        if (blob.size < 1) {
          setPhase('idle');
          setFailed(true);
          return;
        }
        urlRef.current = URL.createObjectURL(blob);
        setPhase('ready');
      };
      rec.start(TIMESLICE_MS);
      setPhase('recording');
      stopTimer();
      timerRef.current = window.setTimeout(() => stop(), MAX_MS);
    } catch {
      setPhase('denied');
    }
  }, [stop]);

  const play = useCallback(() => {
    if (!urlRef.current) return;
    const audio = audioRef.current ?? new Audio();
    audioRef.current = audio;
    attachHiddenAudio(audio);
    audio.pause();
    audio.volume = 1;
    audio.muted = false;
    audio.src = urlRef.current;
    setFailed(false);
    setPhase('playing');
    audio.onended = () => setPhase('ready');
    audio.onerror = () => {
      setFailed(true);
      setPhase('ready');
    };
    void audio.play().catch(() => {
      setFailed(true);
      setPhase('ready');
    });
  }, []);

  const reset = useCallback(() => {
    stop();
    audioRef.current?.pause();
    clearUrl();
    setFailed(false);
    setPhase(voiceEchoSupported() ? 'idle' : 'unsupported');
  }, [stop]);

  useEffect(() => () => {
    stop();
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute('src');
      audio.remove();
    }
    audioRef.current = null;
    clearUrl();
  }, [stop]);

  return { phase, failed, start, stop, play, reset };
}
