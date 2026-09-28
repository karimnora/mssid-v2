import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import {
  PRINTABLE_WORKSHEETS,
  PRINTABLE_CATEGORY_LABELS,
  PrintableCategory,
  PrintableWorksheet,
} from '../../data/preschool/printablesData';
import { PreschoolLanguage } from '../../data/preschool/types';

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

// Original line-art for coloring pages (hand-authored SVG, not copied from any worksheet site).
const ColoringArt: React.FC<{ shapeId?: PrintableWorksheet['coloringShapeId'] }> = ({ shapeId }) => {
  const common = { fill: 'none', stroke: '#0f172a', strokeWidth: 3, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };
  switch (shapeId) {
    case 'house':
      return (
        <svg viewBox="0 0 200 200" className="w-full max-w-md mx-auto" {...common}>
          <polygon points="30,100 100,35 170,100" />
          <rect x="40" y="100" width="120" height="80" />
          <rect x="85" y="140" width="30" height="40" />
          <rect x="52" y="115" width="25" height="25" />
          <rect x="123" y="115" width="25" height="25" />
        </svg>
      );
    case 'star_crescent':
      return (
        <svg viewBox="0 0 300 200" className="w-full max-w-md mx-auto" {...common}>
          <path d="M 110 30 A 55 55 0 1 0 110 170 A 42 42 0 1 1 110 30 Z" />
          <path d="M 220 40 L 235 85 L 282 85 L 244 112 L 258 158 L 220 130 L 182 158 L 196 112 L 158 85 L 205 85 Z" />
        </svg>
      );
    case 'sun':
      return (
        <svg viewBox="0 0 200 200" className="w-full max-w-md mx-auto" {...common}>
          <circle cx="100" cy="100" r="45" />
          <line x1="100" y1="30" x2="100" y2="10" />
          <line x1="100" y1="170" x2="100" y2="190" />
          <line x1="30" y1="100" x2="10" y2="100" />
          <line x1="170" y1="100" x2="190" y2="100" />
          <line x1="50" y1="50" x2="35" y2="35" />
          <line x1="150" y1="150" x2="165" y2="165" />
          <line x1="50" y1="150" x2="35" y2="165" />
          <line x1="150" y1="50" x2="165" y2="35" />
        </svg>
      );
    case 'flower':
      return (
        <svg viewBox="0 0 200 220" className="w-full max-w-md mx-auto" {...common}>
          <ellipse cx="100" cy="42" rx="20" ry="30" />
          <ellipse cx="148" cy="70" rx="30" ry="20" />
          <ellipse cx="148" cy="118" rx="30" ry="20" />
          <ellipse cx="100" cy="146" rx="20" ry="30" />
          <ellipse cx="52" cy="118" rx="30" ry="20" />
          <ellipse cx="52" cy="70" rx="30" ry="20" />
          <circle cx="100" cy="94" r="24" />
          <line x1="100" y1="118" x2="100" y2="208" />
          <ellipse cx="78" cy="168" rx="22" ry="12" />
          <ellipse cx="124" cy="180" rx="22" ry="12" />
        </svg>
      );
    case 'fish':
      return (
        <svg viewBox="0 0 240 180" className="w-full max-w-md mx-auto" {...common}>
          <ellipse cx="110" cy="95" rx="62" ry="36" />
          <polygon points="172,95 220,58 220,132" />
          <polygon points="110,59 128,38 92,38" />
          <polygon points="110,131 128,152 92,152" />
          <circle cx="72" cy="88" r="8" />
          <circle cx="72" cy="88" r="3" />
          <path d="M 108 72 Q 128 95 108 118" />
          <circle cx="38" cy="42" r="10" />
          <circle cx="22" cy="58" r="6" />
          <circle cx="48" cy="28" r="5" />
        </svg>
      );
    case 'boat':
      return (
        <svg viewBox="0 0 220 200" className="w-full max-w-md mx-auto" {...common}>
          <path d="M 40 118 L 180 118 L 162 158 L 58 158 Z" />
          <line x1="110" y1="118" x2="110" y2="38" />
          <polygon points="110,38 110,112 178,82" />
          <polygon points="110,52 110,96 58,78" />
          <path d="M 18 172 Q 55 158 92 172 T 166 172 T 210 172" />
          <circle cx="42" cy="48" r="14" />
        </svg>
      );
    case 'camel':
      return (
        <svg viewBox="0 0 240 200" className="w-full max-w-md mx-auto" {...common}>
          <path d="M 78 108 Q 118 42 158 108" />
          <ellipse cx="118" cy="118" rx="58" ry="28" />
          <path d="M 64 108 Q 36 78 42 52" />
          <ellipse cx="36" cy="48" rx="16" ry="11" />
          <line x1="28" y1="44" x2="18" y2="32" />
          <line x1="88" y1="142" x2="82" y2="182" />
          <line x1="108" y1="144" x2="104" y2="182" />
          <line x1="132" y1="144" x2="138" y2="182" />
          <line x1="152" y1="142" x2="160" y2="182" />
          <path d="M 176 118 Q 198 108 208 128" />
        </svg>
      );
    case 'mosque':
      return (
        <svg viewBox="0 0 220 220" className="w-full max-w-md mx-auto" {...common}>
          <rect x="38" y="108" width="118" height="88" />
          <path d="M 38 108 Q 97 38 156 108" />
          <rect x="168" y="48" width="22" height="148" />
          <polygon points="168,48 179,22 190,48" />
          <path d="M 82 196 Q 97 152 112 196" />
          <rect x="52" y="128" width="20" height="24" />
          <rect x="122" y="128" width="20" height="24" />
          <path d="M 174 18 A 8 8 0 1 0 186 18" />
        </svg>
      );
    case 'olive':
      return (
        <svg viewBox="0 0 200 220" className="w-full max-w-md mx-auto" {...common}>
          <rect x="88" y="138" width="24" height="62" />
          <circle cx="100" cy="88" r="52" />
          <circle cx="62" cy="108" r="34" />
          <circle cx="138" cy="108" r="34" />
          <ellipse cx="72" cy="92" rx="7" ry="10" />
          <ellipse cx="108" cy="70" rx="7" ry="10" />
          <ellipse cx="128" cy="102" rx="7" ry="10" />
          <ellipse cx="88" cy="118" rx="7" ry="10" />
          <line x1="20" y1="200" x2="180" y2="200" />
        </svg>
      );
    default: {
      if (shapeId) {
        const _exhaustive: never = shapeId;
        return _exhaustive;
      }
      return null;
    }
  }
};

const WorksheetBody: React.FC<{ sheet: PrintableWorksheet }> = ({ sheet }) => {
  switch (sheet.kind) {
    case 'line_trace':
      return (
        <div className="space-y-6 py-2">
          {sheet.tracePaths?.map((path, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-3xl shrink-0">{path.startIcon}</span>
              <svg viewBox="0 0 800 100" className="flex-1 h-16">
                <path d={path.d} fill="none" stroke="#94a3b8" strokeWidth="3" strokeDasharray="10 8" strokeLinecap="round" />
              </svg>
              <span className="text-3xl shrink-0">{path.endIcon}</span>
            </div>
          ))}
        </div>
      );

    case 'letter_trace':
      return (
        <div className="space-y-5 py-2">
          {sheet.traceRows?.map((row, i) => (
            <div key={i} className="flex items-center gap-3 flex-wrap justify-center">
              {Array.from({ length: row.repeatCount }).map((_, j) => (
                <span
                  key={j}
                  style={{ WebkitTextStroke: '2px #94a3b8', color: 'transparent' }}
                  className="text-5xl sm:text-6xl font-black leading-none"
                >
                  {row.glyph}
                </span>
              ))}
            </div>
          ))}
        </div>
      );

    case 'count_and_color':
      return (
        <div className="space-y-5 py-2">
          {sheet.countRows?.map((row, i) => (
            <div key={i} className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap flex-1">
                {Array.from({ length: row.count }).map((_, j) => (
                  <span key={j} className="text-3xl">{row.icon}</span>
                ))}
              </div>
              <span className="text-sm font-black text-slate-600">=</span>
              <div className="w-12 h-12 border-2 border-slate-400 rounded-lg shrink-0" />
            </div>
          ))}
        </div>
      );

    case 'match_pairs':
      return (
        <div className="grid grid-cols-2 gap-y-6 py-2 max-w-sm mx-auto">
          <div className="space-y-6 flex flex-col items-start">
            {sheet.matchPairs?.map((pair, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full border-2 border-slate-400" />
                <span className="text-3xl">{pair.left}</span>
              </div>
            ))}
          </div>
          <div className="space-y-6 flex flex-col items-end">
            {[...(sheet.matchPairs || [])].reverse().map((pair, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-3xl">{pair.right}</span>
                <span className="w-3 h-3 rounded-full border-2 border-slate-400" />
              </div>
            ))}
          </div>
        </div>
      );

    case 'odd_one_out':
      return (
        <div className="space-y-5 py-2">
          {sheet.oddOneOutSets?.map((set, i) => (
            <div key={i} className="flex items-center gap-3 justify-center flex-wrap">
              {set.items.map((item, j) => (
                <span
                  key={j}
                  className="w-14 h-14 flex items-center justify-center text-2xl rounded-xl border-2 border-slate-300"
                >
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      );

    case 'cut_along_lines':
      return (
        <div className="grid grid-cols-3 gap-4 py-2">
          {sheet.cutShapes?.map((shape, i) => (
            <div key={i} className="aspect-square flex items-center justify-center rounded-2xl border-2 border-dashed border-slate-400 text-5xl">
              {shape}
            </div>
          ))}
        </div>
      );

    case 'coloring_page':
      return (
        <div className="py-4">
          <ColoringArt shapeId={sheet.coloringShapeId} />
        </div>
      );

    default:
      return null;
  }
};

export const PreschoolPrintablesModal: React.FC<PreschoolPrintablesModalProps> = ({ language, onExit }) => {
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const t = LABELS[language];
  const [activeCategory, setActiveCategory] = useState<PrintableCategory>('graphisme');
  const [activeSheetId, setActiveSheetId] = useState<string | null>(null);

  const sheetsInCategory = useMemo(
    () => PRINTABLE_WORKSHEETS.filter((s) => s.category === activeCategory),
    [activeCategory]
  );

  const activeSheet = useMemo(
    () => PRINTABLE_WORKSHEETS.find((s) => s.id === activeSheetId) || sheetsInCategory[0] || null,
    [activeSheetId, sheetsInCategory]
  );

  const handleSelectCategory = (cat: PrintableCategory) => {
    setActiveCategory(cat);
    const first = PRINTABLE_WORKSHEETS.find((s) => s.category === cat);
    setActiveSheetId(first?.id || null);
  };

  const handlePrint = () => window.print();

  return createPortal(
    <div dir={dir} className="sheet-print-modal fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-orange-100 flex flex-col max-h-[94vh] overflow-hidden"
      >
        {/* Header */}
        <div className="no-print flex items-center justify-between gap-2 flex-wrap p-4 sm:p-5 border-b border-orange-100 bg-gradient-to-r from-amber-50 to-orange-50">
          <div>
            <h2 className="text-base sm:text-lg font-black text-orange-950">{t.title}</h2>
            <p className="text-[11px] sm:text-xs font-bold text-orange-700/80">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="hit-target px-4 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>🖨️</span>
              <span>{t.print}</span>
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

        <div className="flex-1 overflow-hidden flex flex-col sm:flex-row">
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
          <div className="flex-1 overflow-y-auto p-3 sm:p-5 bg-slate-100">
            {activeSheet && (
              <div
                data-preschool-printable="true"
                className="printable-sheet bg-white max-w-[210mm] mx-auto p-6 sm:p-8 border border-slate-300 shadow-lg rounded-xl text-slate-900 font-sans space-y-4"
              >
                <div className="text-center border-b-2 border-orange-300 pb-3 space-y-1">
                  <span className="text-3xl">{activeSheet.headerIcon}</span>
                  <h3 className="text-base sm:text-lg font-black text-orange-950">{activeSheet.titleI18n[language]}</h3>
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 pt-1">
                    <span>مَسِيد DZ — التحضيري 🦊</span>
                    <span>الاسم: .......................</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm font-bold text-slate-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                  <span className="text-amber-800">{t.instructions}</span> {activeSheet.instructionI18n[language]}
                </p>

                <WorksheetBody sheet={activeSheet} />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
};
