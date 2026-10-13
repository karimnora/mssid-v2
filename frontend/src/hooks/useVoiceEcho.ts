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
  const sessionRef = useRef(0);
  const playbackRef = useRef(0);
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

  const pausePlayback = useCallback(() => {
    playbackRef.current++;
    const audio = audioRef.current;
    if (audio) {
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
    }
    if (urlRef.current) setPhase('ready');
  }, []);

  const start = useCallback(async () => {
    if (!voiceEchoSupported()) {
      setPhase('unsupported');
      return;
    }
    const session = ++sessionRef.current;
    pausePlayback();
    stop();
    setFailed(false);
    let openedStream: MediaStream | undefined;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      openedStream = stream;
      if (session !== sessionRef.current) {
        stream.getTracks().forEach(track => track.stop());
        return;
      }
      chunksRef.current = [];
      clearUrl();
      setFailed(false);
      const mime = pickRecorderMime();
      const rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      recorderRef.current = rec;
      rec.ondataavailable = (ev) => {
        if (session === sessionRef.current && ev.data.size > 0) chunksRef.current.push(ev.data);
      };
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        if (session !== sessionRef.current) return;
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
    } catch (error) {
      openedStream?.getTracks().forEach(track => track.stop());
      if (session === sessionRef.current) {
        const permissionDenied = typeof error === 'object' && error !== null && 'name' in error
          && (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError');
        setPhase(permissionDenied ? 'denied' : 'idle');
        setFailed(!permissionDenied);
      }
    }
  }, [stop, pausePlayback]);

  const play = useCallback(() => {
    if (!urlRef.current) return;
    const audio = audioRef.current ?? new Audio();
    audioRef.current = audio;
    attachHiddenAudio(audio);
    audio.pause();
    audio.volume = 1;
    audio.muted = false;
    audio.src = urlRef.current;
    const playback = ++playbackRef.current;
    setFailed(false);
    setPhase('playing');
    audio.onended = () => { if (playback === playbackRef.current) setPhase('ready'); };
    audio.onerror = () => {
      if (playback !== playbackRef.current) return;
      setFailed(true);
      setPhase('ready');
    };
    void audio.play().catch(() => {
      if (playback !== playbackRef.current) return;
      setFailed(true);
      setPhase('ready');
    });
  }, []);

  const reset = useCallback(() => {
    sessionRef.current++;
    stop();
    pausePlayback();
    clearUrl();
    setFailed(false);
    setPhase(voiceEchoSupported() ? 'idle' : 'unsupported');
  }, [stop, pausePlayback]);

  useEffect(() => () => {
    sessionRef.current++;
    playbackRef.current++;
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

  return { phase, failed, start, stop, play, reset, pausePlayback };
}
