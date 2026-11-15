import React, { useEffect, useMemo, useState } from 'react';
import type { PreschoolActivity, PreschoolLanguage, PreschoolNarratedStory as Story } from '../../data/preschool/types';
import { STORY_SPEECH } from '../../data/preschool/narratedStories';
import { PreschoolAsset } from './PreschoolAsset';
import { playGentleNudge, playSuccessChime, usePreschoolSpeech } from './usePreschoolAudio';

type Props = { activity: PreschoolActivity; story: Story; language: PreschoolLanguage; onComplete: () => void };

/** The parent player reads the narration on entry; question reading follows the current screen. */
export function PreschoolNarratedStory({ activity, story, language, onComplete }: Props) {
  const [phase, setPhase] = useState<'listen' | 'questions' | 'retell'>('listen');
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const { speak, stop } = usePreschoolSpeech(language);
  const question = story.questions[index];
  const choices = useMemo(() => story.questions.map(q => [...q.choices].sort(() => Math.random() - 0.5)), [story]);
  const correct = selected === question.correctId;
  const t = (ar: string, fr: string, en: string) => language === 'ar' ? ar : language === 'fr' ? fr : en;
  const button = 'min-h-14 rounded-2xl px-5 py-3 font-black text-base border-2 cursor-pointer focus-visible:outline-4 focus-visible:outline-sky-600 focus-visible:outline-offset-2';

  useEffect(() => {
    if (phase === 'listen') return;
    const line = phase === 'questions' ? question.prompt[language] : STORY_SPEECH.retell[language];
    const timer = window.setTimeout(() => speak(line), 200);
    return () => { window.clearTimeout(timer); stop(); };
  }, [phase, question, language, speak, stop]);

  const pictures = <div className="grid grid-cols-3 gap-2 w-full">
    {activity.visualAssets.storyFrames?.map(frame => <div key={frame.id} className="rounded-2xl bg-white border border-amber-200 p-2 text-center flex flex-col items-center gap-2">
      <PreschoolAsset asset={frame.asset} size={48} />
      <span className="text-sm font-bold text-slate-800">{frame.caption?.[language]}</span>
    </div>)}
  </div>;

  if (phase === 'listen') return <section className="w-full max-w-sm space-y-4" data-narrated-story="listen">
    {pictures}
    <button type="button" className={`${button} w-full bg-sky-50 text-sky-950 border-sky-200`} onClick={() => speak(activity.i18n[language].promptAudio)}>
      {t('🔊 أَسْتَمِعُ إِلَى الْقِصَّة', '🔊 Écouter l’histoire', '🔊 Listen to the story')}
    </button>
    <details className="text-sm rounded-2xl bg-white border border-amber-200 p-3 text-slate-800">
      <summary className="min-h-10 flex items-center cursor-pointer font-bold">{t('النَّصُّ لِلْعَائِلَة', 'Le texte pour la famille', 'Story text for the family')}</summary>
      <p className="leading-relaxed pt-2">{activity.i18n[language].promptAudio}</p>
    </details>
    <button type="button" className={`${button} w-full bg-emerald-700 text-white border-emerald-800`} onClick={() => { stop(); setPhase('questions'); }}>
      {t('نَلْعَبُ مَعَ الْقِصَّة ◀', 'On joue avec l’histoire ▶', 'Let’s play with the story ▶')}
    </button>
  </section>;

  if (phase === 'retell') return <section className="w-full max-w-sm space-y-4" data-narrated-story="retell">
    {pictures}
    <button type="button" className={`${button} w-full bg-sky-50 text-sky-950 border-sky-200`} onClick={() => speak(STORY_SPEECH.retell[language])}>
      {t('🔊 أَحْكِي بِكَلِمَاتِي', '🔊 Je raconte avec mes mots', '🔊 I tell it in my own words')}
    </button>
    <button type="button" disabled={completed} className={`${button} w-full bg-emerald-700 text-white border-emerald-800`} onClick={() => { if (!completed) { setCompleted(true); stop(); onComplete(); } }}>
      {t('قُلْتُهَا!', 'Je l’ai racontée !', 'I told the story!')}
    </button>
  </section>;

  return <section className="w-full max-w-sm space-y-4" data-narrated-story="questions">
    <p className="text-center text-sm font-bold text-slate-600">{index + 1} / {story.questions.length}</p>
    <button type="button" className={`${button} w-full bg-sky-50 text-sky-950 border-sky-200`} onClick={() => speak(question.prompt[language])}>🔊 {question.prompt[language]}</button>
    <div className="grid grid-cols-2 gap-3">
      {choices[index].map(choice => <div key={choice.id} className="flex flex-col gap-2">
        <button type="button" aria-label={choice.label[language]} aria-pressed={selected === choice.id} disabled={correct}
          className={`${button} flex flex-col items-center gap-2 min-h-32 ${selected === choice.id ? correct ? 'bg-emerald-100 border-emerald-500 text-emerald-950' : 'bg-amber-50 border-amber-500 text-amber-950' : 'bg-white border-amber-200 text-slate-800'}`}
          onClick={() => { if (correct) return; setSelected(choice.id); if (choice.id === question.correctId) { playSuccessChime(); speak(STORY_SPEECH.success[language]); } else { playGentleNudge(); speak(STORY_SPEECH.retry[language]); } }}>
          <PreschoolAsset asset={choice.asset} size={64} /><span>{choice.label[language]}</span>
        </button>
        <button type="button" className={`${button} bg-sky-50 border-sky-200 text-sky-950`} aria-label={`${t('اِسْتَمِعْ', 'Écouter', 'Listen')}: ${choice.label[language]}`} onClick={() => speak(choice.label[language])}>🔊</button>
      </div>)}
    </div>
    {selected && <p role="status" className="text-center font-bold text-slate-800">{correct ? STORY_SPEECH.success[language] : STORY_SPEECH.retry[language]}</p>}
    {correct && <button type="button" className={`${button} w-full bg-emerald-700 text-white border-emerald-800`} onClick={() => {
      stop(); setSelected(null);
      if (index + 1 < story.questions.length) setIndex(i => i + 1); else setPhase('retell');
    }}>{t('أُوَاصِلُ ◀', 'Je continue ▶', 'Continue ▶')}</button>}
    <button type="button" className={`${button} w-full bg-white border-amber-200 text-slate-800`} onClick={() => { stop(); setPhase('listen'); }}>{t('أَسْمَعُ الْقِصَّةَ مُجَدَّداً', 'Réécouter l’histoire', 'Hear the story again')}</button>
  </section>;
}
