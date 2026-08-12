import React from 'react';
import { motion } from 'motion/react';
import { CourseLesson } from '../types';
import { SUBJECTS_LIST } from '../data/subjectsData';
import { Button, Badge } from './ui';
import { Printer, X, ListChecks, Sigma, BookMarked, Star, AlertTriangle } from 'lucide-react';
import { stripArabicTashkeel } from '../utils/textFormatter';

interface RevisionSheetViewerProps {
  lesson: CourseLesson;
  onClose: () => void;
  tashkeelEnabled?: boolean;
}

/**
 * Full-screen printable "fiche de révision" derived entirely from a lesson's
 * already-authored fields (summaryAr, rulesAr, keyFormulas, detailedCourse) —
 * no separate content to author/maintain, always in sync with the lesson.
 */
export const RevisionSheetViewer: React.FC<RevisionSheetViewerProps> = ({ lesson, onClose, tashkeelEnabled = true }) => {
  const subject = SUBJECTS_LIST.find((s) => s.id === lesson.subject);
  const detailed = lesson.detailedCourse;

  const t = (text: string | undefined | null): string => {
    if (!text) return '';
    return tashkeelEnabled ? text : stripArabicTashkeel(text);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm"
    >
      {/* Screen-only toolbar — hidden entirely when printing */}
      <div className="no-print sticky top-0 z-10 flex items-center justify-between gap-3 bg-[var(--app-card-bg)] border-b border-[var(--app-card-border)] px-4 py-3">
        <Button variant="ghost" size="sm" icon={<X className="w-4 h-4" />} onClick={onClose}>
          إغلاق
        </Button>
        <Button variant="primary" size="sm" icon={<Printer className="w-4 h-4" />} onClick={() => window.print()}>
          🖨️ طباعة / تحميل PDF
        </Button>
      </div>

      <div className="flex justify-center px-3 py-6">
        <div
          className="printable-sheet w-full max-w-[210mm] rounded-2xl print:rounded-none border border-[var(--app-card-border)] bg-white text-slate-900 shadow-2xl print:shadow-none print:border-0 p-6 sm:p-8 print:p-0"
          dir="rtl"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3 border-b-2 border-slate-800 pb-3 mb-4 break-inside-avoid">
            <div>
              <p className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">
                <span dir="ltr">MSSID DZ</span> — فيشة مراجعة
              </p>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">{t(lesson.titleAr)}</h1>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <Badge variant="info">
                {subject?.nameAr ?? lesson.subject} · <span dir="ltr">{lesson.grade}</span>
              </Badge>
              {lesson.trimester && (
                <Badge variant="neutral">
                  الفصل <span dir="ltr">{lesson.trimester}</span>
                </Badge>
              )}
            </div>
          </div>

          {/* Résumé */}
          {lesson.summaryAr && (
            <section className="mb-4 break-inside-avoid">
              <p className="text-sm leading-relaxed text-slate-700">{t(lesson.summaryAr)}</p>
            </section>
          )}

          <div className="print:grid print:grid-cols-2 print:gap-x-6">
            {/* Règles clés */}
            {lesson.rulesAr && lesson.rulesAr.length > 0 && (
              <section className="mb-4 break-inside-avoid">
                <h2 className="flex items-center gap-1.5 text-sm font-extrabold text-emerald-800 border-r-4 border-emerald-600 pr-2 mb-2">
                  <ListChecks className="w-4 h-4" /> القواعد الأساسية
                </h2>
                <ul className="space-y-1.5">
                  {lesson.rulesAr.map((rule, i) => (
                    <li key={i} className="text-[13px] leading-relaxed text-slate-800 flex items-start gap-1.5">
                      <span className="text-emerald-700 font-black mt-0.5">•</span>
                      <span>{t(rule)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Formules clés */}
            {lesson.keyFormulas && lesson.keyFormulas.length > 0 && (
              <section className="mb-4 break-inside-avoid">
                <h2 className="flex items-center gap-1.5 text-sm font-extrabold text-blue-800 border-r-4 border-blue-600 pr-2 mb-2">
                  <Sigma className="w-4 h-4" /> الصيغ والقوانين
                </h2>
                <div className="space-y-1.5">
                  {lesson.keyFormulas.map((f, i) => (
                    <div key={i} className="text-[13px] rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5">
                      <p className="font-bold text-blue-900">{t(f.labelAr)}</p>
                      <p dir="ltr" className="font-mono text-blue-950">{f.formulaAr}</p>
                      {f.noteAr && <p className="text-[11px] text-blue-700 mt-0.5">{t(f.noteAr)}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Vocabulaire */}
            {detailed?.vocabulary && detailed.vocabulary.length > 0 && (
              <section className="mb-4 break-inside-avoid">
                <h2 className="flex items-center gap-1.5 text-sm font-extrabold text-amber-800 border-r-4 border-amber-600 pr-2 mb-2">
                  <BookMarked className="w-4 h-4" /> مفردات مهمة
                </h2>
                <ul className="space-y-1">
                  {detailed.vocabulary.map((v, i) => (
                    <li key={i} className="text-[13px] leading-relaxed">
                      <span className="font-extrabold text-amber-900">{t(v.termAr)}</span>
                      <span className="text-slate-600"> — {t(v.definitionAr)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Erreurs fréquentes */}
            {detailed?.commonMistakes && detailed.commonMistakes.length > 0 && (
              <section className="mb-4 break-inside-avoid">
                <h2 className="flex items-center gap-1.5 text-sm font-extrabold text-rose-800 border-r-4 border-rose-600 pr-2 mb-2">
                  <AlertTriangle className="w-4 h-4" /> أخطاء شائعة
                </h2>
                <ul className="space-y-1.5">
                  {detailed.commonMistakes.map((m, i) => (
                    <li key={i} className="text-[13px] leading-relaxed">
                      <span className="text-rose-700 line-through">{t(m.mistakeAr)}</span>
                      <span className="text-emerald-700 font-bold"> ← {t(m.correctionAr)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* À retenir */}
          {detailed?.takeawayAr && (
            <section className="mt-1 mb-2 break-inside-avoid rounded-xl border-2 border-slate-800 bg-slate-50 px-3.5 py-2.5">
              <h2 className="flex items-center gap-1.5 text-sm font-extrabold text-slate-900 mb-1">
                <Star className="w-4 h-4" /> ما يجب أن أتذكره
              </h2>
              <p className="text-[13px] leading-relaxed text-slate-800">{t(detailed.takeawayAr)}</p>
            </section>
          )}

          <p className="mt-4 pt-2 border-t border-slate-200 text-[10px] text-slate-400 text-center break-inside-avoid">
            <span dir="ltr">MSSID DZ</span> — فيشة مراجعة تلقائية مُولَّدة من محتوى الدرس
          </p>
        </div>
      </div>
    </motion.div>
  );
};
