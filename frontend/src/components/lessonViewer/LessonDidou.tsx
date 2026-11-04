import React, { useEffect, useRef, useState } from 'react';
import { playPop } from '../../utils/immersiveFeedback';
import type { CourseLesson } from '../../types';
import type { TabId } from './shared';
import { DidouGuide, type DidouMood } from '../immersive/DidouGuide';
import { speakText, speechLangForSubject, stopSpeech } from '../../utils/speech';
import { LESSON_ILLUSTRATIONS } from './illustrations';

/** What Didou says when the child opens each step of a lesson (2AP–5AP; 1AP has its own story view). */
const STEP_LINES: Partial<Record<TabId, string>> = {
  practice: 'هَيَّا نَتَدَرَّبُ! اِبْدَأْ بِالمُسْتَوَى الأَوَّلِ، ثُمَّ اصْعَدْ خُطْوَةً خُطْوَةً.',
  interactive: 'جَرِّبْ بِيَدِكَ: اُنْقُرْ وَاكْتَشِفْ.',
  gameplay: 'هَيَّا نُجَرِّبُ التَّجْرِبَةَ مَعاً!',
  evaluation: 'حَانَ وَقْتُ التَّقْوِيمِ. اِقْرَأْ كُلَّ سُؤَالٍ بِهُدُوءٍ.',
  quiz: 'آخِرُ مَرْحَلَةٍ! أَجِبْ، وَإِنْ أَخْطَأْتَ أُسَاعِدُكَ.',
};

export function didouLineForStep(lesson: CourseLesson, tab: TabId): string | null {
  switch (tab) {
    case 'explanation':
      return lesson.missionIntroAr ?? lesson.detailedCourse?.introAr ?? lesson.discoveryAr ?? lesson.objectiveAr ?? null;
    case 'content':
      return lesson.detailedCourse?.takeawayAr ?? lesson.rulesAr?.[0] ?? null;
    case 'interactive':
      return lesson.mathInteractive?.introAr ?? STEP_LINES.interactive ?? null;
    default:
      return STEP_LINES[tab] ?? null;
  }
}

const hasArabic = (text: string) => /[؀-ۿ]/.test(text);

/**
 * Didou opens every lesson step: he reads its key sentence aloud (the voice follows the language
 * of the sentence) and, on the first step, shows the drawing made for the lesson when there is one.
 */
export function LessonDidou({ lesson, tab }: { lesson: CourseLesson; tab: TabId }) {
  const line = didouLineForStep(lesson, tab);
  const [mood, setMood] = useState<DidouMood>('talk');
  const Illustration = tab === 'explanation' ? LESSON_ILLUSTRATIONS[lesson.id] : undefined;
  const figureRef = useRef<HTMLElement>(null);
  const [replay, setReplay] = useState(0);
  const [animated, setAnimated] = useState(false);

  // Animated drawings: a soft sound each time a piece appears (timing matches .ill-step in didouGuide.css).
  useEffect(() => {
    const figure = figureRef.current;
    if (!figure) return;
    const steps = new Set(Array.from(figure.querySelectorAll<SVGElement>('.ill-step')).map(el => el.style.getPropertyValue('--i')));
    setAnimated(steps.size > 0);
    if (!steps.size || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const timers = Array.from(steps).slice(0, 10).map(i => window.setTimeout(() => playPop(), Number(i || 0) * 500 + 200));
    return () => timers.forEach(t => window.clearTimeout(t));
  }, [lesson.id, tab, replay]);

  const read = () => {
    if (!line) return;
    setMood('talk');
    const lang = hasArabic(line) ? 'ar-SA' : speechLangForSubject(lesson.subject);
    try {
      void speakText(line, lang).then(() => setMood('happy')).catch(() => undefined);
    } catch {
      /* no speech engine */
    }
  };

  // Opening a step is a tap, so the browser lets Didou speak right away.
  useEffect(() => {
    read();
    return () => stopSpeech();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id, tab]);

  if (!line && !Illustration) return null;
  return (
    <div className="lesson-didou space-y-3 mb-4" data-lesson-didou={tab}>
      {line && (
        <DidouGuide line={line} mood={mood} lang={hasArabic(line) ? 'ar' : 'fr'} listenLabel="اِسْتَمِعْ إِلَى دِيدُو" onReplay={read} />
      )}
      {Illustration && (
        <figure key={replay} ref={figureRef} className="lesson-illustration" data-lesson-illustration={lesson.id}>
          <Illustration />
        </figure>
      )}
      {Illustration && animated && (
        <div className="flex justify-center">
          <button type="button" className="lesson-illustration-replay" onClick={() => setReplay(n => n + 1)} data-illustration-replay>
            🔁 شَاهِدِ الرَّسْمَ مِنْ جَدِيدٍ
          </button>
        </div>
      )}
    </div>
  );
}
