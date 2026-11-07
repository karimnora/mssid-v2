import { useEffect, useRef, useState } from "react";
import { HOME_VOICES } from "./villageVoices";
export type VoiceId = keyof typeof HOME_VOICES;
export type VoicePhase = "idle" | "loading" | "speaking";

/** One voice at a time, no API calls, no speculative preload on a data-saving connection. */
export function useDidouVoice({
  muted,
  onError,
  onStopSpeech,
}: {
  muted: boolean;
  onError: () => void;
  onStopSpeech?: () => void;
}) {
  const [voiceId, setVoiceId] = useState<VoiceId>("welcome");
  const [phase, setPhase] = useState<VoicePhase>("idle");
  const [feedback, setFeedback] = useState("");
  const audio = useRef<HTMLAudioElement | null>(null);
  const request = useRef(0);
  const deadline = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warm = useRef(new Map<VoiceId, HTMLAudioElement>());
  const stop = () => {
    onStopSpeech?.();
    request.current++;
    if (deadline.current) clearTimeout(deadline.current);
    if (audio.current) {
      audio.current.onplaying =
        audio.current.onended =
        audio.current.onerror =
          null;
      audio.current.pause();
      audio.current = null;
    }
    setPhase("idle");
  };
  const sayParts = (parts: readonly { src: string }[]) => {
    stop();
    setFeedback("");
    const token = request.current;
    const play = (index: number) => {
      if (token !== request.current) return;
      if (index >= parts.length) {
        setPhase("idle");
        return;
      }
      const clip = new Audio(parts[index].src);
      audio.current = clip;
      setPhase("loading");
      const fail = () => {
        if (token !== request.current) return;
        stop();
        setFeedback("لم يعمل الصوت. اضغط على السماعة للمحاولة.");
      };
      deadline.current = setTimeout(fail, 15000);
      clip.onplaying = () => {
        if (token === request.current) { if (deadline.current) clearTimeout(deadline.current); setPhase("speaking"); }
      };
      clip.onerror = fail;
      clip.onended = () => {
        if (token !== request.current) return;
        if (deadline.current) clearTimeout(deadline.current);
        clip.onended = clip.onerror = clip.onplaying = null;
        play(index + 1);
      };
      void clip.play().catch(fail);
    };
    play(0);
  };
  const prepare = (force = false, ids: readonly VoiceId[] = ["welcome"]) => {
    if (muted && !force) return;
    if (typeof Audio === "undefined") return;
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
    ).connection;
    if (connection?.saveData || ["slow-2g", "2g", "3g"].includes(connection?.effectiveType ?? "")) return;
    for (const id of ids.slice(0, 1)) {
      if (warm.current.has(id)) continue;
      // Keep only the current clip and one likely next clip in memory.
      for (const [key, cached] of warm.current) {
        if (cached !== audio.current) { cached.removeAttribute("src"); warm.current.delete(key); }
      }
      const clip = new Audio(HOME_VOICES[id].src);
      clip.preload = "auto";
      warm.current.set(id, clip);
      clip.load();
    }
  };
  const say = (id: VoiceId, after?: () => void, forceAudio = false) => {
    stop();
    setVoiceId(id);
    setFeedback("");
    if (muted && !forceAudio) return;
    const token = request.current;
    const clip = warm.current.get(id) ?? new Audio(HOME_VOICES[id].src);
    warm.current.set(id, clip);
    audio.current = clip;
    clip.currentTime = 0;
    setPhase("loading");
    clip.onplaying = () => {
      if (request.current === token) { if (deadline.current) clearTimeout(deadline.current); setPhase("speaking"); }
    };
    clip.onended = () => {
      if (request.current !== token) return;
      setPhase("idle");
      after?.();
    };
    clip.onerror = () => {
      if (request.current !== token) return;
      stop();
      onError();
      setFeedback(
        "لَمْ يَعْمَلِ الصَّوْتُ. اِضْغَطْ عَلَى السَّمَّاعَةِ لِلْمُحَاوَلَةِ."
      );
    };
    deadline.current = setTimeout(() => { if (request.current === token) { stop(); onError(); setFeedback("لم يعمل الصوت. اضغط على السماعة للمحاولة."); } }, 15000);
    void clip.play().catch(() => {
      if (request.current !== token) return;
      stop();
      onError();
      setFeedback("اِضْغَطْ عَلَى السَّمَّاعَةِ لِسَمَاعِ دِيدُو.");
    });
  };

  useEffect(
    () => () => {
      request.current++;
      if (deadline.current) clearTimeout(deadline.current);
      if (audio.current) { audio.current.onplaying = audio.current.onended = audio.current.onerror = null; audio.current.pause(); }
      for (const clip of warm.current.values()) {
        clip.onplaying = clip.onended = clip.onerror = null;
        clip.pause();
        clip.removeAttribute("src");
      }
      warm.current.clear();
    },
    []
  );
  useEffect(() => { if (muted) stop(); }, [muted]);
  useEffect(() => {
    const hide = () => { if (document.visibilityState === "hidden") { stop(); onError(); } };
    document.addEventListener("visibilitychange", hide);
    return () => document.removeEventListener("visibilitychange", hide);
  }, []);
  return { voiceId, setVoiceId, phase, feedback, stop, prepare, say, sayParts };
}
