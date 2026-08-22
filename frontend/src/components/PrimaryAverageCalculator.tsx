import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { PrimaryGrade, SubjectId } from '../types';
import { SUBJECTS_LIST } from '../data/subjectsData';
import { averageSubjectsForGrade, computeTermBulletin, SubjectTermNotes } from '../utils/primaryAverage';
import { useTranslation } from '../hooks/useTranslation';
import { useLocaleContext } from '../context/LocaleContext';

interface PrimaryAverageCalculatorProps {
  grade: PrimaryGrade;
}

function parseNote(raw: string): number | null {
  if (raw.trim() === '') return null;
  const n = Number(raw.replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

export const PrimaryAverageCalculator: React.FC<PrimaryAverageCalculatorProps> = ({ grade }) => {
  const t = useTranslation('exams');
  const { direction } = useLocaleContext();
  const [includeTamazight, setIncludeTamazight] = useState(false);
  const [notes, setNotes] = useState<Partial<Record<SubjectId, { eval: string; composition: string }>>>({});

  const subjects = averageSubjectsForGrade(grade, { includeTamazight });
  const canOfferTamazight = grade !== '1AP' && grade !== '2AP';

  const bulletin = useMemo(() => {
    const mapped: Partial<Record<SubjectId, SubjectTermNotes>> = {};
    subjects.forEach((id) => {
      mapped[id] = {
        evalNote: parseNote(notes[id]?.eval || ''),
        compositionNote: parseNote(notes[id]?.composition || ''),
      };
    });
    return computeTermBulletin(grade, mapped, { includeTamazight });
  }, [grade, includeTamazight, notes, subjects]);

  const setField = (id: SubjectId, field: 'eval' | 'composition', value: string) => {
    setNotes((prev) => ({
      ...prev,
      [id]: {
        eval: field === 'eval' ? value : prev[id]?.eval || '',
        composition: field === 'composition' ? value : prev[id]?.composition || '',
      },
    }));
  };

  const subjectName = (id: SubjectId) => SUBJECTS_LIST.find((s) => s.id === id)?.nameAr || id;

  return (
    <motion.section
      dir={direction}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl p-6 sm:p-7 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] space-y-5"
    >
      <div className="space-y-1">
        <h2 className="text-base sm:text-lg font-black text-[var(--app-text)]">{t('averageTitle')}</h2>
        <p className="text-xs text-[var(--app-text-muted)] font-medium leading-relaxed">{t('averageSubtitle')}</p>
      </div>

      {canOfferTamazight && (
        <label className="flex items-center gap-2 text-xs font-bold text-[var(--app-text)] cursor-pointer">
          <input
            type="checkbox"
            checked={includeTamazight}
            onChange={(e) => setIncludeTamazight(e.target.checked)}
            className="rounded-md"
          />
          <span>{t('averageIncludeTamazight')}</span>
        </label>
      )}

      <div className="space-y-3">
        {subjects.map((id) => (
          <div
            key={id}
            className="rounded-2xl p-4 bg-[var(--app-card-subtle)] grid grid-cols-1 sm:grid-cols-3 gap-3 items-end"
          >
            <p className="text-sm font-black text-[var(--app-text)]">{subjectName(id)}</p>
            <label className="space-y-1 text-[11px] font-bold text-[var(--app-text-muted)]">
              <span>{t('averageEvalLabel')}</span>
              <input
                inputMode="decimal"
                value={notes[id]?.eval || ''}
                onChange={(e) => setField(id, 'eval', e.target.value)}
                placeholder="—"
                className="w-full rounded-xl px-3 py-2.5 text-sm font-black text-[var(--app-text)] bg-[var(--app-card-bg)] border border-[var(--app-card-border)]"
              />
            </label>
            <label className="space-y-1 text-[11px] font-bold text-[var(--app-text-muted)]">
              <span>{t('averageCompositionLabel')}</span>
              <input
                inputMode="decimal"
                value={notes[id]?.composition || ''}
                onChange={(e) => setField(id, 'composition', e.target.value)}
                placeholder="—"
                className="w-full rounded-xl px-3 py-2.5 text-sm font-black text-[var(--app-text)] bg-[var(--app-card-bg)] border border-[var(--app-card-border)]"
              />
            </label>
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-4 bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
        <span className="text-sm font-black text-emerald-900">{t('averageResult')}</span>
        <span className="text-2xl font-black text-emerald-800" dir="ltr">
          {bulletin.generalAverage == null ? '—' : bulletin.generalAverage.toFixed(2)}
        </span>
      </div>
      <p className="text-[11px] text-[var(--app-text-muted)] leading-relaxed">{t('averageFormulaNote')}</p>
    </motion.section>
  );
};
