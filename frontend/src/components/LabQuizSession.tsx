import React from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { DidouPortrait } from './world/DidouPortrait';

/** A finite session ends here; another round always requires an explicit restart. */
export function LabQuizSession({ complete, score, total, onRestart, children }: { complete: boolean; score: number; total: number; onRestart: () => void; children: ReactNode }) {
 const t = useTranslation('labsImmersive');
 if (!complete) return <>{children}</>;
 return <section data-quiz-finished role="status" className="rounded-3xl border-2 border-emerald-200 bg-white p-6 text-center space-y-4 text-slate-900">
   <DidouPortrait size={96} pose={score > 0 ? 'cheer' : 'think'} className="mx-auto" />
   <h2 className="text-xl font-extrabold">{t('quizFinished')}</h2>
   <p className="text-lg font-bold" data-quiz-score>{t('quizResult', { score, total })}</p>
   <button type="button" data-quiz-restart onClick={onRestart} className="hit-target min-h-[60px] px-6 rounded-2xl bg-emerald-700 text-white font-extrabold">{t('quizRestart')}</button>
 </section>;
}
