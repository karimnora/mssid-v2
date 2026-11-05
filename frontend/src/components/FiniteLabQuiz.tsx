import React, { useEffect, useRef, useState } from 'react';
import { QuizBlock } from './immersive/ImmersiveLabShell';
import { LabQuizSession } from './LabQuizSession';
import { useTranslation } from '../hooks/useTranslation';
import { speakText, stopSpeech } from '../utils/speech';

export interface LabQuizQuestion { id: string; questionAr: string; optionsAr: readonly string[]; correctAr: string; explanationAr?: string }
export function FiniteLabQuiz({ questions, onAnswer }: { questions: readonly LabQuizQuestion[]; onAnswer: (correct: boolean, firstCorrect: boolean) => void }) {
 const t = useTranslation('labsImmersive');
 useEffect(() => () => stopSpeech(), []);
 const [index, setIndex] = useState(0);
 const [picked, setPicked] = useState<string | null>(null);
 const [score, setScore] = useState(0);
 const locked = useRef(false);
 const rewarded = useRef(new Set<string>());
 const current = questions[index];
 return <LabQuizSession complete={index >= questions.length} score={score} total={questions.length} onRestart={() => { setIndex(0); setPicked(null); setScore(0); locked.current = false; }}>
   {current && <section className="space-y-3" data-finite-lab-quiz>
     <p className="text-sm font-extrabold" data-quiz-progress>{t('quizProgress', { current: index + 1, total: questions.length })}</p>
     <QuizBlock questionAr={current.questionAr} optionsAr={current.optionsAr} correctAr={current.correctAr} picked={picked} onPick={(option, correct) => {
       if (locked.current) return;
       locked.current = true;
       setPicked(option);
       if (correct) setScore(value => value + 1);
       const firstCorrect = correct && !rewarded.current.has(current.id);
       if (firstCorrect) rewarded.current.add(current.id);
       onAnswer(correct, firstCorrect);
     }} />
     {picked && <div className="rounded-2xl bg-emerald-50 p-4 space-y-3 text-slate-900">
       <div className="flex items-start gap-3"><p lang="ar" className="flex-1 font-bold leading-relaxed" data-quiz-explanation>{current.explanationAr ?? current.correctAr}</p><button type="button" data-quiz-explanation-listen className="hit-target min-h-[60px] min-w-[60px] rounded-2xl bg-white shrink-0" aria-label={t('listenDidou')} onClick={() => void speakText(current.explanationAr ?? current.correctAr, 'ar-SA').catch(() => {})}><span aria-hidden="true">🔊</span></button></div>
       <button type="button" data-quiz-next className="hit-target min-h-[60px] px-6 rounded-2xl bg-emerald-700 text-white font-extrabold" onClick={() => {
         if (!locked.current) return; stopSpeech();
         locked.current = false;
         setIndex(value => Math.min(value + 1, questions.length));
         setPicked(null);
       }}>{t('next')}</button>
     </div>}
   </section>}
 </LabQuizSession>;
}
