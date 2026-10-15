import React, { useState } from 'react';
import { PreschoolLanguage } from '../../data/preschool/types';
import { BilanRow } from './preschoolProgress';

interface ModuleProgressRow {
  title: string;
  done: number;
  total: number;
}

interface NextStep {
  title: string;
  moduleTitle: string;
}

interface PreschoolParentBilanProps {
  syncNotice?: React.ReactNode;
  language: PreschoolLanguage;
  childName: string;
  accountEmail?: string;
  todayCount: number;
  streak: number;
  completedCount: number;
  modules: ModuleProgressRow[];
  nextStep: NextStep | null;
  rows: BilanRow[];
  onSaveName: (name: string) => void;
  onPlayNext?: () => void;
  onClose: () => void;
}

function newGateSum() {
  return {
    a: 10 + Math.floor(Math.random() * 40),
    b: 10 + Math.floor(Math.random() * 40),
  };
}

export function ParentGateButton({
  language,
  onUnlock,
}: {
  language: PreschoolLanguage;
  onUnlock: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [sum, setSum] = useState(newGateSum);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);

  const t = (ar: string, fr: string, en: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  const openGate = () => {
    setSum(newGateSum());
    setAnswer('');
    setError(false);
    setOpen(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(answer) === sum.a + sum.b) {
      setOpen(false);
      onUnlock();
    } else {
      setError(true);
      setAnswer('');
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={openGate}
        aria-label={t('لِلأَبِ وَالأُمّ', 'Espace parent', 'For grown-ups')}
        className="min-h-12 min-w-12 flex items-center justify-center rounded-2xl bg-white shadow-md
                    text-2xl cursor-pointer border border-orange-200 hover:bg-orange-50 active:scale-95
                    transition-all select-none"
      >
        👪
      </button>
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 flex items-end sm:items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={t('بَوَّابَةُ الوَلِيّ', 'Espace parent', 'Grown-up gate')}
        >
          <form
            onSubmit={submit}
            className="w-full max-w-sm rounded-[2rem] bg-[#FFFBF0] border-2 border-[#E7E2D7] shadow-xl p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-black text-[#0f172a]">
                {t('بَوَّابَةُ الوَلِيّ', 'Espace parent', 'Grown-up gate')}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="min-h-12 min-w-12 rounded-2xl bg-white border border-[#E7E2D7] text-xl cursor-pointer"
                aria-label={t('إِغْلَاق', 'Fermer', 'Close')}
              >
                ✕
              </button>
            </div>
            <p className="text-sm font-bold text-slate-600">
              {t(
                'هَذَا الْمَكَانُ لِلْكِبَارِ. اُكْتُبْ نَاتِجَ الْجَمْعِ لِلْمُتَابَعَةِ.',
                'Cet espace est réservé à un adulte. Écrivez le résultat pour continuer.',
                'This space is for grown-ups. Type the sum to continue.',
              )}
            </p>
            <div className="rounded-2xl bg-[#FFF8E7] border-2 border-[#E7E2D7] p-4 text-center">
              <span dir="ltr" className="text-2xl font-black text-[#0f172a] font-mono">
                {sum.a} + {sum.b} = ?
              </span>
            </div>
            <input
              type="number"
              inputMode="numeric"
              autoFocus
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                setError(false);
              }}
              placeholder={t('اُكْتُبِ النَّاتِج', 'Saisissez le résultat', 'Type the answer')}
              aria-label={t('اُكْتُبِ النَّاتِج', 'Saisissez le résultat', 'Type the answer')}
              dir="ltr"
              className="w-full min-h-12 rounded-2xl border border-[#E7E2D7] px-3 text-center text-lg font-bold"
            />
            {error && (
              <p role="alert" className="text-xs font-bold text-center text-[#C42A23]">
                {t('إِجَابَةٌ غَيْرُ صَحِيحَةٍ.', 'Réponse incorrecte.', 'Incorrect answer.')}
              </p>
            )}
            <button
              type="submit"
              disabled={!answer}
              className="w-full min-h-12 rounded-2xl bg-[#008751] text-white font-black cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t('مُتَابَعَة', 'Continuer', 'Continue')}
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export const PreschoolParentBilan: React.FC<PreschoolParentBilanProps> = ({
  language,
  childName,
  accountEmail,
  syncNotice,
  todayCount,
  streak,
  completedCount,
  modules,
  nextStep,
  rows,
  onSaveName,
  onPlayNext,
  onClose,
}) => {
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const t = (ar: string, fr: string, en: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(childName);

  const displayName = childName.trim() || t('طِفْلُكَ', 'Votre enfant', 'Your child');

  const statusLabel = (status: BilanRow['status']) => {
    if (status === 'several') return t('عِدَّةَ مَرَّات', 'Plusieurs fois', 'Several times');
    if (status === 'helped') return t('مَعَ مُسَاعَدَة', 'Avec de l’aide', 'With help');
    if (status === 'tried') return t('مُحَاوَلَة', 'Essai', 'Tried');
    if (status === 'skipped') return t('تَخَطَّى', 'Passé', 'Skipped');
    return t('اكْتَشَفَ', 'Découvert', 'Discovered');
  };

  return (
    <div dir={dir} className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-lg max-h-[88vh] overflow-y-auto rounded-[2rem] bg-[#FFFBF0] border-2 border-[#E7E2D7] shadow-xl p-5 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xl font-black text-[#0f172a]">
            {t('بِيلَانُ الوَلِيّ', 'Bilan parent', 'Parent recap')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="min-h-12 min-w-12 rounded-2xl bg-white border border-[#E7E2D7] text-xl cursor-pointer"
            aria-label={t('إِغْلَاق', 'Fermer', 'Close')}
          >
            ✕
          </button>
        </div>

        {syncNotice}
        <div className="rounded-2xl bg-white border border-[#E7E2D7] px-4 py-3 space-y-1">
          <p className="text-lg font-black text-[#0f172a]">{displayName}</p>
          {accountEmail && (
            <p className="text-xs font-bold text-slate-500 truncate">{accountEmail}</p>
          )}
          {editing ? (
            <div className="flex items-center gap-2 pt-1">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                maxLength={24}
                className="flex-1 min-h-12 rounded-2xl border border-[#E7E2D7] px-3 text-base"
                aria-label={t('اسْمُ الطِّفْل', 'Prénom', 'Name')}
              />
              <button
                type="button"
                className="min-h-12 px-4 rounded-2xl bg-[#008751] text-white font-black cursor-pointer"
                onClick={() => {
                  onSaveName(draft);
                  setEditing(false);
                }}
              >
                {t('حِفْظ', 'OK', 'Save')}
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="text-sm font-bold text-[#2563EB] cursor-pointer"
              onClick={() => {
                setDraft(childName);
                setEditing(true);
              }}
            >
              {t('تَغْيِيرُ الاِسْم', 'Renommer', 'Rename')}
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Stat label={t('اليَوْم', 'Aujourd’hui', 'Today')} value={todayCount} />
          <Stat label={t('الأَيَّامُ تِبَاعًا', 'Série', 'Streak')} value={streak} />
          <Stat label={t('أَنْجَزَ', 'Réussi', 'Done')} value={completedCount} />
        </div>

        {modules.length > 0 && (
          <ul className="space-y-2">
            {modules.map((mod) => (
              <li key={mod.title} className="rounded-2xl bg-white border border-[#E7E2D7] px-4 py-3">
                <p className="font-black text-sm text-[#0f172a] truncate">{mod.title}</p>
                <p className="text-xs font-bold text-slate-500">{mod.done} / {mod.total}</p>
              </li>
            ))}
          </ul>
        )}

        {nextStep && onPlayNext && (
          <button
            type="button"
            onClick={onPlayNext}
            className="w-full min-h-12 rounded-2xl bg-[#008751] text-white font-black cursor-pointer px-4"
          >
            {t('الْآتِي:', 'Ensuite :', 'Next:')} {nextStep.title}
          </button>
        )}

        {rows.length === 0 ? (
          <p className="text-center text-sm font-bold text-slate-500 py-6">
            {t('لَا يُوجَدُ شَيْءٌ بَعْد.', 'Rien pour le moment.', 'Nothing yet.')}
          </p>
        ) : (
          <ul className="space-y-2">
            {rows.slice(0, 12).map((row) => (
              <li
                key={row.activityId}
                className="rounded-2xl bg-white border border-[#E7E2D7] px-4 py-3 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="font-black text-sm text-[#0f172a] truncate">{row.title}</p>
                  <p className="text-xs font-bold text-slate-500">{statusLabel(row.status)}</p>
                </div>
                <span className="text-xs font-black text-amber-700 shrink-0">×{Math.max(row.count, 1)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const Stat: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="rounded-2xl bg-white border border-[#E7E2D7] px-2 py-3 text-center">
    <p className="text-xl font-black text-[#008751]">{value}</p>
    <p className="text-[10px] font-bold text-slate-600 leading-tight">{label}</p>
  </div>
);
