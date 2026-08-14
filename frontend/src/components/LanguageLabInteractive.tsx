import React, { useState } from 'react';
import {
  BookOpen,
  MessageCircle,
  Sparkles
} from 'lucide-react';
import type { LanguageInteractiveConfig } from '../types';

interface LanguageLabInteractiveProps {
  config: LanguageInteractiveConfig;
  subject: 'french' | 'english';
}

const THEME = {
  french: {
    bg: 'bg-sky-950',
    border: 'border-sky-800',
    introText: 'text-sky-200',
    cardBg: 'bg-sky-900/80',
    cardBorder: 'border-sky-800',
    cardText: 'text-sky-100',
    cardHover: 'hover:bg-sky-850',
    pillBg: 'bg-sky-900',
    pillText: 'text-sky-200',
    pillBorder: 'border-sky-800',
    pillHover: 'hover:bg-sky-850',
    detailBg: 'bg-sky-950',
    detailBorder: 'border-sky-800',
    feedbackBg: 'bg-sky-900',
    feedbackBorder: 'border-sky-600',
    feedbackText: 'text-sky-100',
  },
  english: {
    bg: 'bg-indigo-950',
    border: 'border-indigo-800',
    introText: 'text-indigo-200',
    cardBg: 'bg-indigo-900/80',
    cardBorder: 'border-indigo-800',
    cardText: 'text-indigo-100',
    cardHover: 'hover:bg-indigo-850',
    pillBg: 'bg-indigo-900',
    pillText: 'text-indigo-200',
    pillBorder: 'border-indigo-800',
    pillHover: 'hover:bg-indigo-850',
    detailBg: 'bg-indigo-950',
    detailBorder: 'border-indigo-800',
    feedbackBg: 'bg-indigo-900',
    feedbackBorder: 'border-indigo-600',
    feedbackText: 'text-indigo-100',
  },
} as const;

/* ==========================================
   PER-LESSON CONFIG-DRIVEN VIEWS — shared between French and English 5AP.
   Rendered when the lesson supplies `languageInteractive` — shows only the
   single module relevant to THAT lesson's content, not a fixed grade-wide set.
   ========================================== */
const ConfiguredLanguageTool: React.FC<{ config: LanguageInteractiveConfig; subject: 'french' | 'english' }> = ({ config, subject }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const t = THEME[subject];

  const headerIcon = config.type === 'vocabulary_explorer'
    ? <BookOpen className="w-6 h-6 text-amber-400" />
    : <MessageCircle className="w-6 h-6 text-amber-400" />;

  return (
    <div className={`${t.bg} text-white rounded-3xl p-6 border ${t.border} shadow-2xl space-y-6 dir-rtl`} dir="rtl">
      <div className={`flex items-center gap-3 border-b ${t.border} pb-4`}>
        <div className="p-3 bg-amber-500/20 text-amber-300 rounded-2xl border border-amber-500/30">
          {headerIcon}
        </div>
        <div>
          <h2 className="text-lg font-black text-amber-300">{config.titleAr}</h2>
          {config.introAr && (
            <p className={`text-xs ${t.introText} mt-1`}>{config.introAr}</p>
          )}
        </div>
      </div>

      {config.type === 'vocabulary_explorer' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            {config.terms.map((term, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`w-full p-4 rounded-2xl border text-right transition-all cursor-pointer ${
                  activeIdx === idx
                    ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-xl font-bold text-base scale-[1.01]'
                    : `${t.cardBg} ${t.cardBorder} ${t.cardText} ${t.cardHover} text-sm`
                }`}
              >
                <div dir="ltr" className="text-right font-serif">{term.termAr}</div>
              </button>
            ))}
          </div>
          <div className={`bg-slate-950 p-6 rounded-3xl border ${t.detailBorder} space-y-4`}>
            <div dir="ltr" className="text-sm font-mono font-bold text-amber-400 text-right">{config.terms[activeIdx].termAr}</div>
            <div className={`p-4 ${t.detailBg} rounded-2xl border ${t.detailBorder} space-y-2`}>
              <div className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>المعنى:</span>
              </div>
              <p className="text-sm font-bold text-slate-200 leading-relaxed">{config.terms[activeIdx].meaningAr}</p>
            </div>
            <div className={`p-4 ${t.detailBg} rounded-2xl border ${t.detailBorder} space-y-2`}>
              <div className="text-xs font-black text-cyan-400">✏️ مثال:</div>
              <p className="text-sm font-bold text-slate-200 leading-relaxed">{config.terms[activeIdx].exampleAr}</p>
            </div>
          </div>
        </div>
      )}

      {config.type === 'dialogue_scenario' && (() => {
        const turn = config.turns[activeIdx];
        return (
          <div className="space-y-6">
            {config.turns.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {config.turns.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIdx(idx)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer shrink-0 border ${
                      activeIdx === idx
                        ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md scale-[1.02]'
                        : `${t.pillBg} ${t.pillText} ${t.pillBorder} ${t.pillHover}`
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            )}
            <DialogueTurnView turn={turn} theme={t} />
          </div>
        );
      })()}
    </div>
  );
};

const DialogueTurnView: React.FC<{
  turn: { promptAr: string; lineAr: string; choices: { textAr: string; isCorrect: boolean; feedbackAr: string }[] };
  theme: typeof THEME['french'];
}> = ({ turn, theme: t }) => {
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

  return (
    <div className={`bg-slate-950 p-6 rounded-3xl border ${t.detailBorder} space-y-4`}>
      <p className="text-xs text-slate-300 font-bold">{turn.promptAr}</p>
      <p dir="ltr" className={`text-sm font-bold text-slate-200 ${t.detailBg} p-4 rounded-2xl border ${t.detailBorder} leading-relaxed text-right`}>
        {turn.lineAr}
      </p>
      <div className="space-y-3">
        {turn.choices.map((choice, cIdx) => (
          <button
            key={cIdx}
            onClick={() => setSelectedChoice(cIdx)}
            dir="ltr"
            className={`w-full p-4 rounded-2xl border text-right text-xs font-bold transition-all cursor-pointer ${
              selectedChoice === cIdx
                ? choice.isCorrect
                  ? 'bg-amber-500 text-slate-950 border-amber-300 ring-2 ring-amber-400'
                  : 'bg-rose-950 border-rose-500 text-rose-200'
                : `${t.cardBg} ${t.cardBorder} ${t.cardText} ${t.cardHover}`
            }`}
          >
            {choice.textAr}
          </button>
        ))}
      </div>
      {selectedChoice !== null && (
        <div className={`p-4 ${t.feedbackBg} border ${t.feedbackBorder} rounded-2xl text-xs ${t.feedbackText} font-bold leading-relaxed animate-in fade-in duration-300`}>
          {turn.choices[selectedChoice].feedbackAr}
        </div>
      )}
    </div>
  );
};

export const LanguageLabInteractive: React.FC<LanguageLabInteractiveProps> = ({ config, subject }) => (
  <ConfiguredLanguageTool config={config} subject={subject} />
);
