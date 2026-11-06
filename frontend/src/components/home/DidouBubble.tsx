import "./villageHome.css";
import React, { type ReactNode } from "react";
import type { VoicePhase } from "./useDidouVoice";
export function DidouBubble({
  phase,
  tourActive,
  tourStep,
  caption,
  feedback,
  children,
}: {
  phase: VoicePhase;
  tourActive: boolean;
  tourStep: number;
  caption: string;
  feedback: string;
  children: ReactNode;
}) {
  return (
    <section
      className="home-preview-dialogue"
      aria-label="ديدو يرافقك"
      data-home-dialogue
    >
      <div className="home-preview-dialogue-top">
        <span className="home-preview-guide-name">دِيدُو مَعَكَ</span>
        <span
          className={`home-preview-voice-state ${
            phase === "speaking" ? "is-speaking" : ""
          }`}
          data-home-voice-phase={phase}
        >
          {tourActive
            ? `أعرّفك بعالمي · ${tourStep + 1}/4`
            : phase === "speaking"
            ? "أَتَحَدَّثُ مَعَكَ"
            : phase === "loading"
            ? "لَحْظَةٌ صَغِيرَةٌ…"
            : "أَنَا هُنَا لِأُسَاعِدَكَ"}
          <i />
          <i />
          <i />
        </span>
      </div>
      <p lang="ar" aria-live="polite">
        {caption}
      </p>
      <div className="home-preview-dialogue-actions">{children}</div>
      {feedback && (
        <small role="status" className="home-preview-audio-feedback">
          {feedback}
        </small>
      )}
    </section>
  );
}
