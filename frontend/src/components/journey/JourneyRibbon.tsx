import React, { useEffect, useRef } from 'react';
import { DidouHead, MedalArt, StarIcon } from './DidouJourneyArt';

export type RibbonTone = 'blue' | 'green' | 'orange' | 'coral' | 'purple';

export interface RibbonButton {
  label: string;
  tone?: RibbonTone;
  onClick: () => void;
}

export interface RibbonContent {
  text: string;
  buttons: RibbonButton[];
  stars?: number;
  medalColor?: string;
  extra?: React.ReactNode;
}

/** Didou pops above a purple ribbon with a message — the journey's only dialog style. */
export function JourneyRibbon({ text, buttons, stars, medalColor, extra, onListen, listenLabel }: RibbonContent & { onListen?: () => void; listenLabel: string }) {
  const lastButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    lastButton.current?.focus({ preventScroll: true });
  }, [text]);
  return (
    <div className="j-modal" role="dialog" aria-modal="true" aria-label={text}>
      <div className="j-rib">
        <div className="j-rib-top">
          <svg className="j-band" viewBox="0 0 400 70" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 18 L40 10 L30 34 L42 58 L0 52Z" fill="#6a14b8" />
            <path d="M400 18 L360 10 L370 34 L358 58 L400 52Z" fill="#6a14b8" />
            <path d="M36 8 Q200 -10 364 8 L364 50 Q200 32 36 50Z" fill="#9b34e8" />
            <path d="M36 8 Q200 -10 364 8 L364 18 Q200 0 36 18Z" fill="#c879ff" />
          </svg>
          <DidouHead className="j-rib-head" />
        </div>
        <div className="j-rib-card">
          <p>{text}</p>
          {onListen && (
            <button type="button" className="j-listen" onClick={onListen} aria-label={listenLabel}>
              <SpeakerIcon />
            </button>
          )}
          {stars != null && (
            <div className="j-rib-stars" aria-label={`${stars}/3`}>
              {[0, 1, 2].map((i) => (
                <StarIcon key={i} on={i < stars} />
              ))}
            </div>
          )}
          {medalColor && <MedalArt className="j-rib-medal" color={medalColor} />}
          {extra}
        </div>
        <div className="j-rib-btns">
          {buttons.map((b, i) => (
            <button
              key={b.label}
              ref={i === buttons.length - 1 ? lastButton : undefined}
              type="button"
              className="j-gloss j-pill"
              data-tone={b.tone ?? 'green'}
              onClick={b.onClick}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SpeakerIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
      <path d="M16 8.5a5 5 0 010 7M18.5 6a8.5 8.5 0 010 12" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** Soft synthesized sounds (no audio files): never a harsh error buzz, as CLAUDE.md requires. */
export function createJourneySfx(isOn: () => boolean) {
  let ctx: AudioContext | null = null;
  const tone = (freq: number, dur: number, { type = 'triangle' as OscillatorType, gain = 0.12, delay = 0, slide = 0 } = {}) => {
    if (!isOn() || typeof window === 'undefined') return;
    try {
      if (!ctx) {
        const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return;
        ctx = new Ctor();
      }
      if (ctx.state === 'suspended') void ctx.resume();
      const t = ctx.currentTime + delay;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, t);
      if (slide) o.frequency.exponentialRampToValueAtTime(freq * slide, t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(gain, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + dur + 0.05);
    } catch {
      /* audio unavailable: stay silent */
    }
  };
  return {
    pop: () => tone(560, 0.12, { slide: 1.6 }),
    whoosh: () => tone(300, 0.35, { slide: 2.2, gain: 0.06, type: 'sine' }),
    win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, { delay: i * 0.08 })),
    fanfare: () => [523, 659, 784, 659, 784, 1047].forEach((f, i) => tone(f, 0.26, { delay: i * 0.12, gain: 0.14 })),
    soft: () => {
      tone(392, 0.2, { gain: 0.08 });
      tone(349, 0.28, { gain: 0.08, delay: 0.16 });
    },
    boing: () => tone(200, 0.38, { slide: 2.6 }),
  };
}

export type JourneySfx = ReturnType<typeof createJourneySfx>;
