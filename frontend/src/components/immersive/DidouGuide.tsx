import React from 'react';
import { motion } from 'motion/react';
import { DidouPortrait } from '../world/DidouPortrait';
import './didouGuide.css';

export type DidouMood = 'talk' | 'happy' | 'think';

/** Didou's speech bubble used inside the immersive labs: what to do next, with a replay button. */
export function DidouGuide({ line, mood, lang, listenLabel, onReplay }: { line: string; mood: DidouMood; lang: 'ar' | 'fr'; listenLabel: string; onReplay: () => void }) {
  return (
    <section className="lab-guide" data-didou-guide={mood} aria-live="polite">
      <motion.div
        key={`${line}-${mood}`}
        animate={mood === 'happy' ? { y: [0, -12, 0], rotate: [0, -4, 4, 0] } : mood === 'think' ? { rotate: [0, -6, 0] } : { y: [0, -4, 0] }}
        transition={{ duration: 0.6 }}
        className="shrink-0"
      >
        <DidouPortrait size={84} />
      </motion.div>
      <p className="lab-guide-bubble" lang={lang}>{line}</p>
      <button type="button" className="lab-guide-listen" aria-label={listenLabel} onClick={onReplay}>
        <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
          <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
          <path d="M16 8.5a5 5 0 010 7M18.5 6a8.5 8.5 0 010 12" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </svg>
      </button>
    </section>
  );
}
