import React, { useMemo, useState } from 'react';
import { TextToSpeechButton } from './TextToSpeechButton';
import { evaluateExpression, generateExplanation, MathParserError } from '../utils/mathParser';
import { useLocaleContext } from '../context/LocaleContext';

const BUTTON_LAYOUT = [
  ['7', '8', '9', '+'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '*'],
  ['0', '.', '%', '/'],
  ['(', ')', 'x', 'C'],
];

export const EducationalCalculator: React.FC = () => {
  const { t } = useLocaleContext();
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState<string>('');
  const [explanation, setExplanation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleButton = (value: string) => {
    if (value === 'C') {
      setExpression('');
      setResult('');
      setExplanation('');
      setErrorMessage('');
      return;
    }

    setExpression((prev) => `${prev}${value}`);
    setErrorMessage('');
  };

  const handleCalculate = () => {
    try {
      const evaluated = evaluateExpression(expression || '0');
      const explanationText = generateExplanation(expression || '0');
      setResult(String(evaluated));
      setExplanation(explanationText);
      setErrorMessage('');
    } catch (error) {
      const message = error instanceof MathParserError ? error.message : t('common', 'responseError');
      setErrorMessage(message);
      setResult('');
      setExplanation('');
    }
  };

  const canSpeak = useMemo(() => !!result || !!errorMessage || !!explanation, [result, errorMessage, explanation]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-md text-slate-900 max-w-4xl mx-auto">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-extrabold">{t('common', 'calculatorTitle')}</h2>
          <p className="text-sm opacity-70 mt-1">{t('common', 'calculatorHelp')}</p>
        </div>

        <div className="rounded-3xl bg-slate-50 p-4 border border-slate-200 shadow-sm">
          <input
            type="text"
            aria-label={t('common', 'expressionLabel')}
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-lg font-bold text-right outline-none focus:border-indigo-500"
            placeholder={t('common', 'expressionPlaceholder')}
          />
          <div className="mt-3 grid grid-cols-4 gap-2">
            {BUTTON_LAYOUT.flat().map((buttonValue) => (
              <button
                key={buttonValue}
                type="button"
                onClick={() => handleButton(buttonValue)}
                className="rounded-2xl bg-indigo-600 text-white py-3 text-lg font-bold shadow-sm hover:bg-indigo-700 transition"
              >
                {buttonValue}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handleCalculate}
            className="rounded-3xl bg-emerald-600 text-white px-5 py-3 font-bold shadow-sm hover:bg-emerald-700 transition"
          >
            {t('common', 'calculate')}
          </button>
          {canSpeak && <TextToSpeechButton text={errorMessage || `${t('common', 'solution')}: ${result}. ${explanation}`} />}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-slate-950/95 p-5 text-white shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-widest text-amber-300">{t('common', 'solution')}</h3>
            <div className="mt-3 min-h-[110px] text-sm leading-6">{result || t('common', 'noResultYet')}</div>
          </div>

          <div className="rounded-3xl bg-slate-50 border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800">{t('common', 'explanation')}</h3>
            <div className="mt-3 min-h-[110px] whitespace-pre-line text-sm leading-6 text-slate-700">
              {errorMessage || explanation || t('common', 'noExplanationYet')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
