import React from 'react';
import { DidouPortrait } from './DidouPortrait';
import { speakText } from '../../utils/speech';

/** Didou speaking on the purple ribbon (V2 "monde de jeu" child screens). */
export function DidouRibbon({ text, lang, listenLabel }: { text: string; lang: 'ar' | 'fr'; listenLabel: string }) {
  return (
    <section className="world-ribbon" data-didou-ribbon aria-live="polite">
      <DidouPortrait size={92} className="world-ribbon-didou" />
      <p className="world-ribbon-text" lang={lang}>{text}</p>
      <button
        type="button"
        className="world-gloss world-gloss-blue world-ribbon-listen"
        aria-label={listenLabel}
        onClick={() => void speakText(text, lang === 'ar' ? 'ar-SA' : 'fr-FR').catch(() => {})}
      >
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
          <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
          <path d="M16 8.5a5 5 0 010 7M18.5 6a8.5 8.5 0 010 12" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </svg>
      </button>
    </section>
  );
}
