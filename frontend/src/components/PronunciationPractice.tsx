import React, { useEffect, useState } from 'react';
import { PRONUNCIATION_MODELS, PronunciationLanguage } from '../data/pronunciationModels';
import { stopSpeech } from '../utils/speech';
import { VoiceEchoBar } from './VoiceEchoBar';

export const PronunciationPractice: React.FC<{ language: PronunciationLanguage }> = ({ language }) => {
  const [index, setIndex] = useState(0);
  const models = PRONUNCIATION_MODELS[language];
  const model = models[index % models.length];
  const french = language === 'fr';
  useEffect(() => { stopSpeech(); return () => stopSpeech(); }, [language, model.id]);
  return (
    <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 text-slate-900" dir="ltr" aria-label={french ? 'Atelier de prononciation' : 'Pronunciation practice'}>
      <h3 className="text-lg font-black">{french ? 'Écoute et répète' : 'Listen and repeat'}</h3>
      <p className="text-sm">{french ? 'Écoute le modèle, prononce le mot ou la phrase, puis réécoute ta voix.' : 'Listen to the model, say the word or sentence, then listen to your own voice.'}</p>
      <div className="rounded-3xl bg-emerald-50 p-5 text-center space-y-3">
        <p className="text-sm font-bold text-emerald-800">{model.focus} · {index + 1} / {models.length}</p>
        <p className="text-2xl sm:text-3xl font-black break-words" data-pronunciation-model>{model.text}</p>
      </div>
      <VoiceEchoBar key={`${language}-${model.id}`} modelText={model.text} language={language} />
      <div className="flex justify-between gap-3">
        <button type="button" disabled={index === 0} onClick={() => setIndex(i => i - 1)} className="min-h-12 rounded-2xl border px-4 font-bold disabled:opacity-40">{french ? 'Précédent' : 'Previous'}</button>
        <button type="button" disabled={index === models.length - 1} onClick={() => setIndex(i => i + 1)} className="min-h-12 rounded-2xl bg-emerald-700 text-white px-4 font-bold disabled:opacity-40">{french ? 'Suivant' : 'Next'}</button>
      </div>
    </section>
  );
};
