import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Printer, X } from 'lucide-react';
import { motion } from 'motion/react';
import type { CompetenceCahier } from '../../data/cahiers/competenceCahiers';
import { useTranslation } from '../../hooks/useTranslation';

interface CompetenceCahierSheetProps {
  cahier: CompetenceCahier;
  onClose: () => void;
}

export const CompetenceCahierSheet: React.FC<CompetenceCahierSheetProps> = ({ cahier, onClose }) => {
  const t = useTranslation('labsImmersive');
  const [side, setSide] = useState<'front' | 'verso'>('front');

  const print = () => {
    setTimeout(() => window.print(), 50);
  };

  return createPortal(
    <div className="sheet-print-modal fixed inset-0 z-[70] bg-black/40 flex items-start justify-center overflow-auto p-3 sm:p-6">
      <div className="w-full max-w-[210mm] space-y-3">
        <div className="no-print flex flex-wrap items-center gap-2 justify-between bg-white rounded-2xl border-2 border-[#E7E2D7] p-3">
          <div className="flex gap-2">
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setSide('front')}
              className={`hit-target px-4 rounded-2xl text-sm font-extrabold cursor-pointer ${
                side === 'front' ? 'bg-[#008751] text-white' : 'bg-white border-2 border-[#E7E2D7]'
              }`}
            >
              {t('cahierFront')}
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setSide('verso')}
              className={`hit-target px-4 rounded-2xl text-sm font-extrabold cursor-pointer ${
                side === 'verso' ? 'bg-[#008751] text-white' : 'bg-white border-2 border-[#E7E2D7]'
              }`}
            >
              {t('cahierVerso')}
            </motion.button>
          </div>
          <div className="flex gap-2">
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={print}
              className="hit-target px-4 rounded-2xl bg-[#008751] text-white text-sm font-extrabold cursor-pointer inline-flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" aria-hidden />
              {t('cahierPrint')}
            </motion.button>
            <button type="button" onClick={onClose} className="kids-close cursor-pointer" aria-label={t('backAria')}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <article
          dir="rtl"
          data-print-mode={side === 'verso' ? 'corrige' : 'subject'}
          className="printable-sheet bg-white max-w-[210mm] mx-auto p-6 sm:p-8 border border-[#E7E2D7] text-[#0f172a] space-y-5"
        >
          <header className="border-b-2 border-[#008751] pb-3 space-y-1 print-identity">
            <p className="text-xs font-extrabold text-[#008751]">مَسِيد DZ — كُرَّاسُ الكَفَاءَةِ</p>
            <p className="text-[11px] font-bold text-slate-500">{cahier.domainAr} · {cahier.grade}</p>
            <h1 className="text-lg font-extrabold leading-tight">{cahier.titleAr}</h1>
            <p className="text-xs font-bold">الاسم: …………………… الأَبُ / الأُمُّ: …………………… التاريخ: …… / …… / ……</p>
          </header>

          {side === 'front' ? (
            <ol className="space-y-5 list-decimal pr-5">
              {cahier.exercises.map((exercise, index) => (
                <li key={index} className="space-y-2">
                  <p className="text-[15px] font-bold leading-relaxed">{exercise.promptAr}</p>
                  <div className="print-answer-lines space-y-2">
                    {Array.from({ length: exercise.lines }, (_, line) => (
                      <div key={line} className="border-b border-slate-300 h-7" />
                    ))}
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <div className="print-corrige space-y-4">
              <p className="text-xs font-extrabold text-[#008751]">{t('cahierVerso')}</p>
              <ol className="space-y-3 list-decimal pr-5">
                {cahier.versoAr.map((line, index) => (
                  <li key={index} className="print-corrige-box text-[15px] font-bold leading-relaxed bg-[#FFF8E7] rounded-2xl p-3">
                    {line}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </article>
      </div>
    </div>,
    document.body,
  );
};
