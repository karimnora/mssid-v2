import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import {
  getPrintableWorksheets,
  PRINTABLE_CATEGORY_LABELS,
  PrintableCategory,
  PrintableWorksheet,
} from '../../data/preschool/printablesData';
import { PreschoolLanguage } from '../../data/preschool/types';
import { PreschoolWorksheet } from './PreschoolWorksheet';
import './preschoolWorksheets.css';
import { printDocument } from '../../utils/printDocument';

interface PreschoolPrintablesModalProps {
  language: PreschoolLanguage;
  onExit: () => void;
}

const CATEGORIES: PrintableCategory[] = ['graphisme', 'lettres', 'chiffres', 'logique', 'motricite', 'coloriage'];

const LABELS: Record<PreschoolLanguage, { title: string; subtitle: string; print: string; instructions: string }> = {
  ar: {
    title: 'أَوْرَاقٌ لِلطِّبَاعَةِ 🖨️',
    subtitle: 'اطبع الورقة وتدرّب في المنزل مع طفلك بقلم رصاص حقيقي!',
    print: 'طباعة / حفظ PDF',
    instructions: 'التعليمة:',
  },
  fr: {
    title: 'Fiches à imprimer 🖨️',
    subtitle: 'Imprime la fiche et entraîne-toi à la maison avec un vrai crayon !',
    print: 'Imprimer / Enregistrer en PDF',
    instructions: 'Consigne :',
  },
  en: {
    title: 'Printable sheets 🖨️',
    subtitle: 'Print the sheet and practice at home with a real pencil!',
    print: 'Print / Save as PDF',
    instructions: 'Instructions:',
  },
};

export const PreschoolPrintablesModal: React.FC<PreschoolPrintablesModalProps> = ({ language, onExit }) => {
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const t = LABELS[language];
  const [printingPack, setPrintingPack] = useState(false);
  const [activeCategory, setActiveCategory] = useState<PrintableCategory>('graphisme');
  const [activeSheetId, setActiveSheetId] = useState<string | null>(null);
  const availableSheets = useMemo(() => getPrintableWorksheets(language), [language]);

  const sheetsInCategory = useMemo(
    () => availableSheets.filter((s) => s.category === activeCategory),
    [activeCategory, availableSheets]
  );

  const activeSheet = useMemo(
    () => sheetsInCategory.find((s) => s.id === activeSheetId) || sheetsInCategory[0] || null,
    [activeSheetId, sheetsInCategory]
  );

  const handleSelectCategory = (cat: PrintableCategory) => {
    setActiveCategory(cat);
    const first = availableSheets.find((s) => s.category === cat);
    setActiveSheetId(first?.id || null);
  };

  const handlePrint = async (pack = false) => {
    setPrintingPack(pack);
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    await document.fonts?.ready;
    try { await printDocument('Mssid DZ — '+(activeSheet?.titleI18n[language] ?? 'Préscolaire')); }
    finally { setPrintingPack(false); }
  };

  return createPortal(
    <div dir={dir} className="sheet-print-modal fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm overflow-x-hidden overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="preschool-paper-dialog web-dialog-studio bg-white rounded-3xl max-w-5xl w-full min-w-0 shadow-2xl border border-orange-100 flex flex-col max-h-[min(94dvh,calc(100svh-1.5rem))] overflow-hidden"
      >
        {/* Header */}
        <div className="no-print flex items-center justify-between gap-2 flex-wrap p-4 sm:p-5 border-b border-orange-100 bg-gradient-to-r from-amber-50 to-orange-50">
          <div>
            <h2 className="text-base sm:text-lg font-black text-orange-950">{t.title}</h2>
            <p className="text-[11px] sm:text-xs font-bold text-orange-700/80">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => void handlePrint()}
              className="hit-target px-4 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>🖨️</span>
              <span>{t.print}</span>
            </button>
            <button onClick={() => void handlePrint(true)} className="hit-target px-3 rounded-xl border border-orange-300 text-orange-900 font-bold text-xs cursor-pointer">
              {language === 'ar' ? 'طباعة الدفتر' : language === 'fr' ? 'Imprimer le cahier' : 'Print booklet'} ({sheetsInCategory.length})
            </button>
            <button
              onClick={onExit}
              className="hit-target w-12 rounded-xl bg-white hover:bg-orange-100 text-orange-700 border border-orange-200 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="خروج / Fermer / Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Category tabs */}
        <div className="no-print flex items-center gap-1.5 overflow-x-auto p-3 border-b border-orange-100 bg-orange-50/40">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleSelectCategory(cat)}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'bg-white text-orange-800 border border-orange-200 hover:bg-orange-100'
              }`}
            >
              {PRINTABLE_CATEGORY_LABELS[cat][language]}
            </button>
          ))}
        </div>

        <div className="preschool-paper-layout flex-1 overflow-hidden flex flex-col sm:flex-row">
          {/* Sheet list within category */}
          <div className="no-print sm:w-56 shrink-0 border-b sm:border-b-0 sm:border-e border-orange-100 overflow-y-auto p-2.5 flex sm:flex-col gap-2">
            {sheetsInCategory.map((sheet) => (
              <button
                key={sheet.id}
                onClick={() => setActiveSheetId(sheet.id)}
                className={`shrink-0 sm:shrink text-start p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeSheet?.id === sheet.id
                    ? 'bg-orange-100 border-orange-400 text-orange-950'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-orange-50'
                }`}
              >
                <span className="text-lg shrink-0">{sheet.headerIcon}</span>
                <span className="line-clamp-2">{sheet.titleI18n[language]}</span>
              </button>
            ))}
          </div>

          {/* A4 print preview */}
          <div className="preschool-paper-preview flex-1 overflow-y-auto p-3 sm:p-5 bg-slate-100">
            {(printingPack ? sheetsInCategory : activeSheet ? [activeSheet] : []).map(sheet => (
              <PreschoolWorksheet key={sheet.id} sheet={sheet} language={language}/>
            ))}
          </div>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
};
