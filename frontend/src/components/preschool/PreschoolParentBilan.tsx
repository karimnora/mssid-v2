import React, { useState } from 'react';
import { PreschoolLanguage } from '../../data/preschool/types';
import {
  BilanRow,
  PreschoolChildId,
  PreschoolChildSlot,
  childDisplayName,
  saveChildName,
} from './preschoolProgress';

interface PreschoolParentBilanProps {
  language: PreschoolLanguage;
  rows: BilanRow[];
  slots: PreschoolChildSlot[];
  activeChildId: PreschoolChildId;
  onSelectChild: (id: PreschoolChildId) => void;
  onClose: () => void;
  onSlotsChanged: () => void;
}

const HOLD_MS = 2000;

export function ParentGateButton({
  language,
  onUnlock,
}: {
  language: PreschoolLanguage;
  onUnlock: () => void;
}) {
  const [holding, setHolding] = useState(false);
  const timerRef = React.useRef<number | null>(null);

  const t = (ar: string, fr: string, en: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  const startHold = () => {
    setHolding(true);
    timerRef.current = window.setTimeout(() => {
      setHolding(false);
      onUnlock();
    }, HOLD_MS);
  };

  const stopHold = () => {
    setHolding(false);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  return (
    <button
      type="button"
      onPointerDown={startHold}
      onPointerUp={stopHold}
      onPointerLeave={stopHold}
      onPointerCancel={stopHold}
      aria-label={t('لِلأَبِ وَالأُمّ — اِضْغَطْ مَعِي ثَانِيَتَيْن', 'Pour le parent — rester appuyé 2 secondes', 'For grown-ups — hold 2 seconds')}
      className={`min-h-12 min-w-12 flex items-center justify-center rounded-2xl bg-white shadow-md
                  text-2xl cursor-pointer border transition-all select-none
                  ${holding ? 'border-emerald-500 bg-emerald-50 scale-95' : 'border-orange-200 hover:bg-orange-50'}`}
    >
      👨‍👩‍👧
    </button>
  );
}

export const PreschoolParentBilan: React.FC<PreschoolParentBilanProps> = ({
  language, rows, slots, activeChildId, onSelectChild, onClose, onSlotsChanged,
}) => {
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const t = (ar: string, fr: string, en: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;
  const [editingId, setEditingId] = useState<PreschoolChildId | null>(null);
  const [draft, setDraft] = useState('');

  const statusLabel = (status: BilanRow['status']) => {
    if (status === 'several') return t('عِدَّةَ مَرَّات', 'Plusieurs fois', 'Several times');
    if (status === 'helped') return t('مَعَ مُسَاعَدَة', 'Avec de l’aide', 'With help');
    return t('اكْتَشَفَ', 'Découvert', 'Discovered');
  };

  const counts = {
    discovered: rows.filter((r) => r.status === 'discovered').length,
    helped: rows.filter((r) => r.status === 'helped').length,
    several: rows.filter((r) => r.status === 'several').length,
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

        <p className="text-sm font-bold text-slate-600">
          {t(
            'مَنْ يَلْعَبُ اليَوْم؟ اِضْغَطْ ثَانِيَتَيْنِ لِفَتْحِ هَذِهِ الشَّاشَة.',
            'Qui joue aujourd’hui ? Cette page s’ouvre en restant appuyé 2 secondes.',
            'Who is playing today? This page opens with a 2-second hold.',
          )}
        </p>

        <div className="flex gap-2">
          {slots.map((slot, index) => {
            const active = slot.id === activeChildId;
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => onSelectChild(slot.id)}
                className={`flex-1 min-h-14 rounded-2xl font-black text-sm cursor-pointer border-2 ${
                  active
                    ? 'bg-[#008751] text-white border-emerald-700'
                    : 'bg-white text-[#0f172a] border-[#E7E2D7]'
                }`}
              >
                {childDisplayName(slot, language, index)}
              </button>
            );
          })}
        </div>

        {slots.map((slot, index) => (
          slot.id === activeChildId ? (
            <div key={slot.id} className="flex items-center gap-2">
              {editingId === slot.id ? (
                <>
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
                      saveChildName(slot.id, draft);
                      setEditingId(null);
                      onSlotsChanged();
                    }}
                  >
                    {t('حِفْظ', 'OK', 'Save')}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="text-sm font-bold text-[#2563EB] cursor-pointer"
                  onClick={() => {
                    setEditingId(slot.id);
                    setDraft(slot.name || childDisplayName(slot, language, index));
                  }}
                >
                  {t('تَغْيِيرُ الاِسْم', 'Renommer', 'Rename')}
                </button>
              )}
            </div>
          ) : null
        ))}

        <div className="grid grid-cols-3 gap-2">
          <Stat label={t('اكْتَشَفَ', 'Découvert', 'Discovered')} value={counts.discovered} />
          <Stat label={t('مَعَ مُسَاعَدَة', 'Avec aide', 'With help')} value={counts.helped} />
          <Stat label={t('عِدَّةَ مَرَّات', 'Plusieurs fois', 'Several times')} value={counts.several} />
        </div>

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
