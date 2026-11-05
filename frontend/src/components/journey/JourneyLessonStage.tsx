import React, { useEffect, useRef, useState } from 'react';
import { DIDOU_POSES, type WorldDecor } from '../world/worldArt';
import { SpeakerIcon } from './JourneyRibbon';

interface JourneyLessonStageProps {
  decor: WorldDecor;
  locale: string;
  lessonTitle: string;
  say: (text: string) => void;
  children: React.ReactNode;
}

/**
 * A journey lesson inside its world's painted decor (pilot: Constantine). The decor stays behind
 * the lesson's cream sheet, which keeps the reading surface of the app; the foreground layer moves
 * a little faster than the page for depth. Before the lesson appears, Didou welcomes the child.
 */
export function JourneyLessonStage({ decor, locale, lessonTitle, say, children }: JourneyLessonStageProps) {
  const ar = locale === 'ar';
  const intro = ar
    ? `هيّا نتعلّم معاً درس «${lessonTitle}». سأرافقك خطوة بخطوة!`
    : `C'est parti ! On apprend ensemble la leçon « ${lessonTitle} ». Je t'accompagne pas à pas !`;
  const [showIntro, setShowIntro] = useState(true);
  const stageRef = useRef<HTMLDivElement>(null);
  const okRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    say(intro);
    okRef.current?.focus();
    // Said once when the lesson opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    stageRef.current?.style.setProperty('--sy', String(e.currentTarget.scrollTop));
  };

  return (
    <div
      ref={stageRef}
      className="journey-lesson"
      data-decor=""
      style={{ ['--decor-l' as string]: `url(${decor.landscape})`, ['--decor-p' as string]: `url(${decor.portrait})` }}
    >
      <div className="jl-decor" aria-hidden="true" />
      {decor.foreground && <img className="jl-fore" src={decor.foreground} alt="" aria-hidden="true" draggable={false} />}
      {/* The lesson mounts after Didou's welcome, so nothing shows through and its audio never talks over him. */}
      {!showIntro && (
        <div className="jl-scroll" onScroll={onScroll}>
          <div className="journey-lesson-inner">{children}</div>
        </div>
      )}

      {showIntro && (
        <div className="jl-intro" role="dialog" aria-modal="true" aria-label={ar ? 'ديدو يرحّب بك' : 'Didou t’accueille'}>
          {decor.island && <img className="jl-island" src={decor.island} alt="" aria-hidden="true" draggable={false} />}
          <img className="jl-coach" src={DIDOU_POSES.talk.src} alt="" aria-hidden="true" draggable={false} />
          <div className="jl-talk">
            <div className="jl-bubble">
              <p>{intro}</p>
              <button type="button" className="j-listen" onClick={() => say(intro)} aria-label={ar ? 'استمع' : 'Écouter'}>
                <SpeakerIcon />
              </button>
            </div>
            <button ref={okRef} type="button" className="j-gloss j-pill jl-ok" data-tone="green" onClick={() => setShowIntro(false)}>
              {ar ? 'هيّا!' : "C'est parti !"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
