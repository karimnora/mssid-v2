import { useCallback, useEffect, useRef, useState } from 'react';
import { fallbackAyahUrl, primaryAyahUrl } from '../data/quranRecitation';

export type RecitationMode = 'idle' | 'ayah' | 'surah';

export function useQuranRecitation(options: {
  surahNumber: number | null;
  ayahCount: number;
  onAyahIndex: (index0: number) => void;
  onSurahComplete?: () => void;
}) {
  const { surahNumber, ayahCount, onAyahIndex, onSurahComplete } = options;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const modeRef = useRef<RecitationMode>('idle');
  const ayahRef = useRef(0);
  const usingFallbackRef = useRef(false);
  const playbackSessionRef = useRef(0);
  const surahRef = useRef(surahNumber);
  const countRef = useRef(ayahCount);
  const onAyahIndexRef = useRef(onAyahIndex);
  const onSurahCompleteRef = useRef(onSurahComplete);
  surahRef.current = surahNumber;
  countRef.current = ayahCount;
  onAyahIndexRef.current = onAyahIndex;
  onSurahCompleteRef.current = onSurahComplete;

  const [mode, setMode] = useState<RecitationMode>('idle');
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);

  const stop = useCallback(() => {
    playbackSessionRef.current += 1;
    modeRef.current = 'idle';
    setMode('idle');
    setPlayingAyah(null);
    usingFallbackRef.current = false;
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.removeAttribute('src');
  }, []);

  const playUrl = useCallback((url: string, fallbackUrl: string) => {
    const audio = audioRef.current;
    if (!audio) return;
    const session = ++playbackSessionRef.current;
    const isCurrent = () => playbackSessionRef.current === session && audioRef.current === audio && modeRef.current !== 'idle';
    const chosen = usingFallbackRef.current ? fallbackUrl : url;
    audio.src = chosen;
    void audio.play().catch(() => {
      if (!isCurrent()) return;
      if (!usingFallbackRef.current) {
        usingFallbackRef.current = true;
        audio.src = fallbackUrl;
        void audio.play().catch(() => {
          if (!isCurrent()) return;
          setFailed(true);
          stop();
        });
        return;
      }
      setFailed(true);
      stop();
    });
  }, [stop]);

  const playAyahFile = useCallback((surah: number, ayah1: number) => {
    playUrl(primaryAyahUrl(surah, ayah1), fallbackAyahUrl(surah, ayah1));
  }, [playUrl]);

  const beginAyah = useCallback((index0: number) => {
    const surah = surahRef.current;
    const count = countRef.current;
    if (!surah || count < 1) return;
    const clamped = Math.max(0, Math.min(index0, count - 1));
    ayahRef.current = clamped;
    setPlayingAyah(clamped + 1);
    onAyahIndexRef.current(clamped);
    playAyahFile(surah, clamped + 1);
  }, [playAyahFile]);

  const startAt = useCallback((index0: number, nextMode: RecitationMode) => {
    const surah = surahRef.current;
    const count = countRef.current;
    if (!surah || count < 1) return;
    setFailed(false);
    usingFallbackRef.current = false;
    modeRef.current = nextMode;
    setMode(nextMode);
    beginAyah(index0);
  }, [beginAyah]);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audioRef.current = audio;

    const onEnded = () => {
      if (modeRef.current === 'idle' || audioRef.current !== audio) return;
      const surah = surahRef.current;
      if (modeRef.current !== 'surah' || !surah) {
        modeRef.current = 'idle';
        setMode('idle');
        setPlayingAyah(null);
        return;
      }
      const next = ayahRef.current + 1;
      if (next >= countRef.current) {
        onSurahCompleteRef.current?.();
        stop();
        return;
      }
      beginAyah(next);
    };

    const onError = () => {
      if (modeRef.current === 'idle' || audioRef.current !== audio) return;
      const surah = surahRef.current;
      if (!usingFallbackRef.current) {
        usingFallbackRef.current = true;
        if (surah) {
          playAyahFile(surah, ayahRef.current + 1);
          return;
        }
      }
      setFailed(true);
      stop();
    };

    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    return () => {
      playbackSessionRef.current += 1;
      modeRef.current = 'idle';
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.pause();
      audio.removeAttribute('src');
      audioRef.current = null;
    };
  }, [beginAyah, playAyahFile, stop]);

  useEffect(() => {
    stop();
  }, [surahNumber, stop]);

  return {
    mode,
    playingAyah,
    failed,
    playAyah: (index0: number) => startAt(index0, 'ayah'),
    playSurah: (fromIndex0 = 0) => startAt(fromIndex0, 'surah'),
    stop,
  };
}
