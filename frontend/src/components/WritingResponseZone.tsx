import React, { useMemo, useState } from 'react';
import { solveLinearEquation, MathParserError, evaluateExpression } from '../utils/mathParser';
import { useLocaleContext } from '../context/LocaleContext';
import { TextToSpeechButton } from './TextToSpeechButton';

const SAMPLE_PROMPTS = [
  'اكتب حل مسألة بسيطة: ٣ + ٤ = ؟',
  'حل المعادلة التالية: 2x + 3 = 7',
  'اكتب جملة قصيرة تشرح طريقة الحل.',
];

export const WritingResponseZone: React.FC = () => {
  const { t } = useLocaleContext();
  const [inputText, setInputText] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSolved, setIsSolved] = useState(false);

  const handleCheck = () => {
    if (!inputText.trim()) {
      setFeedback(t('common', 'emptyResponseError'));
      setIsSolved(false);
      return;
    }

    try {
      const normalized = inputText.trim();

      if (normalized.includes('=')) {
        const solution = solveLinearEquation(normalized);
        setFeedback(`${t('common', 'equationSolved')} x = ${solution.value}`);
        setIsSolved(true);
        return;
      }

      const value = evaluateExpression(normalized);
      setFeedback(`${t('common', 'calculationChecked')} ${value}`);
      setIsSolved(true);
    } catch (error) {
      const message = error instanceof MathParserError ? error.message : t('common', 'responseError');
      setFeedback(message);
      setIsSolved(false);
    }
  };

  const speechText = useMemo(() => {
    return isSolved ? `${t('common', 'responseSuccess')} ${feedback}` : `${t('common', 'responsePrompt')} ${inputText}`;
  }, [feedback, inputText, isSolved, t]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-md max-w-4xl mx-auto">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-extrabold">{t('common', 'writingZoneTitle')}</h2>
          <p className="text-sm opacity-70 mt-1">{t('common', 'writingZoneHelp')}</p>
        </div>

        <textarea
          rows={8}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full rounded-3xl border border-slate-300 bg-slate-50 p-4 text-base leading-7 text-slate-900 outline-none focus:border-indigo-500"
          placeholder={t('common', 'writingPlaceholder')}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handleCheck}
            className="rounded-3xl bg-amber-500 text-white px-5 py-3 font-bold shadow-sm hover:bg-amber-600 transition"
          >
            {t('common', 'checkResponse')}
          </button>
          <TextToSpeechButton text={speechText} />
        </div>

        <div className="rounded-3xl bg-slate-50 border border-slate-200 p-5 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800">{t('common', 'feedback')}</h3>
          <div className="mt-3 min-h-[120px] whitespace-pre-line text-sm leading-6 text-slate-700">
            {feedback || t('common', 'feedbackPlaceholder')}
          </div>
        </div>

        <div className="rounded-3xl bg-slate-950/95 p-5 text-white shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-widest text-cyan-300">{t('common', 'cardExample')}</h3>
          <div className="mt-3 grid gap-3 text-sm leading-6">
            {SAMPLE_PROMPTS.map((prompt) => (
              <div key={prompt} className="rounded-2xl bg-slate-900/80 p-3">
                <p>{prompt}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
