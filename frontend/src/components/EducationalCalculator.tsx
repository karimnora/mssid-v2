import React, { useMemo, useState } from 'react';
import { TextToSpeechButton } from './TextToSpeechButton';
import { evaluateExpression, generateExplanation, MathParserError } from '../utils/mathParser';
import { useLocaleContext } from '../context/LocaleContext';
import { PrimaryGrade } from '../types';
import { allowedCalculatorKeys } from '../utils/labGradePolicy';

const BUTTON_LAYOUT = [
  ['7', '8', '9', '+'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '*'],
  ['0', '.', '%', '/'],
  ['(', ')', 'x', 'C'],
];

interface EducationalCalculatorProps {
  grade?: PrimaryGrade;
}

export const EducationalCalculator: React.FC<EducationalCalculatorProps> = ({ grade = '1AP' }) => {
  const { t, direction } = useLocaleContext();
  const allowedKeys = useMemo(() => allowedCalculatorKeys(grade), [grade]);
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
    // data-lab-instrument: the keypad's bg-indigo-600 buttons otherwise get repainted green by the
    // lab-interior wrapper's force-light-card override (harmless to read, but not the intended
    // color) — everything else here already uses its own light theme regardless of this attribute.
    <div data-lab-instrument className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-md text-slate-900 max-w-4xl mx-auto" dir={direction}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-xl font-extrabold">{t('common', 'calculatorTitle')}</h2>
            <p className="text-sm opacity-70 mt-1">{t('common', 'calculatorHelp')}</p>
          </div>
          <TextToSpeechButton text={t('common', 'calculatorHelp')} />
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
            {BUTTON_LAYOUT.flat().map((buttonValue) => {
              const disabled = !allowedKeys.has(buttonValue);
              return (
              <button
                key={buttonValue}
                type="button"
                disabled={disabled}
                onClick={() => handleButton(buttonValue)}
                className={`hit-target rounded-2xl py-3 text-lg font-bold shadow-sm transition ${
                  disabled
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer'
                }`}
              >
                {buttonValue}
              </button>
            );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handleCalculate}
            className="hit-target rounded-3xl bg-emerald-700 text-white px-5 py-3 font-bold shadow-sm hover:bg-emerald-800 transition"
          >
            {t('common', 'calculate')}
          </button>
          {canSpeak && <TextToSpeechButton text={errorMessage || `${t('common', 'solution')}: ${result}. ${explanation}`} />}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 border border-slate-200 p-5 shadow-sm text-slate-900">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800">{t('common', 'solution')}</h3>
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
