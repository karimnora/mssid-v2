import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad2, Compass, CheckCircle2, XCircle, Trophy, RotateCcw, Sparkles } from 'lucide-react';
import { Shape3DViewer, Solid3DId, ShapeDimensions, HighlightFeature } from './Shape3DViewer';
import { useTranslation } from '../hooks/useTranslation';
import { useLocaleContext } from '../context/LocaleContext';

// ─────────────────────────────────────────────────────
// Shape data
// ─────────────────────────────────────────────────────
interface PropertyItem {
  text: string;
  highlightKey?: HighlightFeature;
}

interface ShapeInfo {
  id: string;
  nameAr: string;
  category: '2d' | '3d';
  properties: PropertyItem[];
  perimeterFormulaAr?: string;
  areaFormulaAr?: string;
  volumeFormulaAr?: string;
  accentHex: string;
  svgIcon: string;
}

const SHAPES: ShapeInfo[] = [
  {
    id: 'square', nameAr: 'المربع', category: '2d', accentHex: '#f59e0b', svgIcon: 'square',
    properties: [
      { text: 'مضلع رباعي له 4 أضلاع متقايسة' },
      { text: 'له 4 زوايا قائمة (90°)' },
      { text: 'قطراه متقايسان ومتعامدان ومتناصفان' },
    ],
    perimeterFormulaAr: 'المحيط = الضلع × 4',
    areaFormulaAr: 'المساحة = الضلع² (a²)',
  },
  {
    id: 'rectangle', nameAr: 'المستطيل', category: '2d', accentHex: '#10b981', svgIcon: 'rectangle',
    properties: [
      { text: 'مضلع رباعي كل ضلعين متقابلين متوازيان ومتقايسان' },
      { text: 'له 4 زوايا قائمة (90°)' },
      { text: 'قطراه متقايسان ومتناصفان وغير متعامدين' },
    ],
    perimeterFormulaAr: 'المحيط = (الطول + العرض) × 2',
    areaFormulaAr: 'المساحة = الطول × العرض (L × l)',
  },
  {
    id: 'triangle', nameAr: 'المثلثات', category: '2d', accentHex: '#38bdf8', svgIcon: 'triangle',
    properties: [
      { text: 'مثلث قائم: فيه زاوية قائمة (90°)' },
      { text: 'متساوي الساقين: فيه ضلعان متقايسان' },
      { text: 'متقايس الأضلاع: أضلاعه الثلاثة متقايسة (60°)' },
    ],
    perimeterFormulaAr: 'المحيط = مجموع أطوال الأضلاع الثلاثة',
    areaFormulaAr: 'المساحة = (القاعدة × الارتفاع) ÷ 2',
  },
  {
    id: 'circle', nameAr: 'الدائرة', category: '2d', accentHex: '#818cf8', svgIcon: 'circle',
    properties: [
      { text: 'مجموعة نقط تبعد ببعد ثابت (r) عن المركز O' },
      { text: 'القطر D = 2 × r' },
      { text: 'الوتر: قطعة تربط نقطتين ولا تمر بالمركز' },
    ],
    perimeterFormulaAr: 'محيط الدائرة = القطر × π',
    areaFormulaAr: 'مساحة القرص = r × r × π',
  },
  {
    id: 'cube', nameAr: 'المكعب', category: '3d', accentHex: '#a78bfa', svgIcon: 'cube',
    properties: [
      { text: 'مجسم منتظم له 6 أوجه مربعة متطابقة', highlightKey: 'faces' },
      { text: 'له 12 حرفاً متقايساً', highlightKey: 'edges' },
      { text: 'له 8 رؤوس', highlightKey: 'vertices' },
    ],
    areaFormulaAr: 'المساحة الكلية = الحرف² × 6',
    volumeFormulaAr: 'الحجم = الحرف³ (c³)',
  },
  {
    id: 'cuboid', nameAr: 'متوازي المستطيلات', category: '3d', accentHex: '#2dd4bf', svgIcon: 'cuboid',
    properties: [
      { text: 'مجسم له 6 أوجه مستطيلة', highlightKey: 'faces' },
      { text: 'له 12 حرفاً', highlightKey: 'edges' },
      { text: 'له 8 رؤوس', highlightKey: 'vertices' },
    ],
    areaFormulaAr: 'المساحة الجانبية = محيط القاعدة × الارتفاع',
    volumeFormulaAr: 'الحجم = الطول × العرض × الارتفاع',
  },
  {
    id: 'cylinder', nameAr: 'الأسطوانة', category: '3d', accentHex: '#fb923c', svgIcon: 'cylinder',
    properties: [
      { text: 'يتكون من قاعدتين دائريتين متوازيتين', highlightKey: 'faces' },
      { text: 'سطح جانبي منحني يلتف حول الارتفاع h', highlightKey: 'faces' },
      { text: 'حافة دائرية علوية وسفلية', highlightKey: 'edges' },
    ],
    areaFormulaAr: 'المساحة الجانبية = 2 × π × r × h',
    volumeFormulaAr: 'الحجم = π × r² × h',
  },
  {
    id: 'pyramid', nameAr: 'الهرم', category: '3d', accentHex: '#f472b6', svgIcon: 'pyramid',
    properties: [
      { text: 'قاعدة مربعة وأربعة أوجه جانبية مثلثة', highlightKey: 'faces' },
      { text: 'له 8 حروف', highlightKey: 'edges' },
      { text: 'له 5 رؤوس (4 قاعدة + قمة واحدة)', highlightKey: 'vertices' },
    ],
    areaFormulaAr: 'مساحة القاعدة = الضلع × الضلع',
    volumeFormulaAr: 'الحجم = (مساحة القاعدة × الارتفاع) ÷ 3',
  },
  {
    id: 'prism', nameAr: 'الموشور', category: '3d', accentHex: '#34d399', svgIcon: 'prism',
    properties: [
      { text: 'قاعدتان مثلثتان متطابقتان ومتوازيتان', highlightKey: 'faces' },
      { text: 'أوجه جانبية مستطيلات (3 أوجه)', highlightKey: 'faces' },
      { text: 'له 9 حروف و 6 رؤوس', highlightKey: 'edges' },
    ],
    areaFormulaAr: 'مساحة القاعدة (مثلث) = (قاعدة × ارتفاع) ÷ 2',
    volumeFormulaAr: 'الحجم = مساحة القاعدة × الارتفاع',
  },
];

// ─────────────────────────────────────────────────────
// Quiz data
// ─────────────────────────────────────────────────────
interface QuizQuestion {
  id: string;
  questionAr: string;
  options: string[];
  correctIndex: number;
  explanationAr: string;
  relatedShapeId?: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 'q1', questionAr: 'كم عدد أوجه المكعب؟', options: ['4 أوجه', '6 أوجه', '8 أوجه', '12 وجهاً'], correctIndex: 1, explanationAr: 'المكعب له 6 أوجه مربعة متطابقة.', relatedShapeId: 'cube' },
  { id: 'q2', questionAr: 'ما قانون حجم الأسطوانة؟', options: ['π × r² × h', 'r × h × 2', 'π × r × h', 'r² × h'], correctIndex: 0, explanationAr: 'حجم الأسطوانة = π × r² × h', relatedShapeId: 'cylinder' },
  { id: 'q3', questionAr: 'أيّ شكل له 5 رؤوس؟', options: ['المكعب', 'متوازي المستطيلات', 'الهرم', 'الموشور'], correctIndex: 2, explanationAr: 'الهرم له 5 رؤوس: 4 في القاعدة المربعة + قمة واحدة.', relatedShapeId: 'pyramid' },
  { id: 'q4', questionAr: 'كم عدد حروف (أضلاع) متوازي المستطيلات؟', options: ['6', '8', '12', '16'], correctIndex: 2, explanationAr: 'متوازي المستطيلات له 12 حرفاً (ضلعاً).', relatedShapeId: 'cuboid' },
  { id: 'q5', questionAr: 'ما قانون مساحة المربع؟', options: ['a × 4', 'a²', '2 × (L+l)', 'π × r²'], correctIndex: 1, explanationAr: 'مساحة المربع = a² (الضلع × الضلع)', relatedShapeId: 'square' },
  { id: 'q6', questionAr: 'الموشور الثلاثي له كم رأساً؟', options: ['3', '4', '5', '6'], correctIndex: 3, explanationAr: 'الموشور الثلاثي له 6 رؤوس (3 في كل قاعدة مثلثية).', relatedShapeId: 'prism' },
  { id: 'q7', questionAr: 'ما قانون محيط المستطيل؟', options: ['L × l', 'L + l', '(L + l) × 2', '2 × L²'], correctIndex: 2, explanationAr: 'محيط المستطيل = (الطول + العرض) × 2', relatedShapeId: 'rectangle' },
  { id: 'q8', questionAr: 'كم عدد حروف المكعب؟', options: ['6', '8', '10', '12'], correctIndex: 3, explanationAr: 'المكعب له 12 حرفاً (ضلعاً) متقايسة.', relatedShapeId: 'cube' },
];

// ─────────────────────────────────────────────────────
// Default dimensions
// ─────────────────────────────────────────────────────
const DEFAULT_DIMS: Record<string, ShapeDimensions> = {
  cube: { a: 5, b: 5, c: 5 },
  cuboid: { a: 6, b: 4, c: 3 },
  cylinder: { a: 3, b: 6, c: 0 },
  pyramid: { a: 5, b: 6, c: 0 },
  prism: { a: 5, b: 6, c: 0 },
};

// ─────────────────────────────────────────────────────
// Computed measurements
// ─────────────────────────────────────────────────────
const computeMeasurements = (shapeId: string, dims: ShapeDimensions): { areaLabel?: string; volumeLabel?: string } => {
  switch (shapeId) {
    case 'cube': {
      const area = 6 * dims.a * dims.a;
      const volume = dims.a ** 3;
      return { areaLabel: `= 6 × ${dims.a}² = ${area} سم²`, volumeLabel: `= ${dims.a}³ = ${volume} سم³` };
    }
    case 'cuboid': {
      const area = 2 * (dims.a * dims.b + dims.a * dims.c + dims.b * dims.c);
      const volume = dims.a * dims.b * dims.c;
      return { areaLabel: `= ${area} سم²`, volumeLabel: `= ${dims.a}×${dims.b}×${dims.c} = ${volume} سم³` };
    }
    case 'cylinder': {
      const area = 2 * Math.PI * dims.a * dims.b;
      const volume = Math.PI * dims.a * dims.a * dims.b;
      return { areaLabel: `≈ ${area.toFixed(1)} سم²`, volumeLabel: `≈ ${volume.toFixed(1)} سم³` };
    }
    case 'pyramid': {
      const baseArea = dims.a * dims.a;
      const volume = (baseArea * dims.b) / 3;
      return { areaLabel: `= ${dims.a}² = ${baseArea} سم²`, volumeLabel: `≈ ${volume.toFixed(1)} سم³` };
    }
    case 'prism': {
      const baseArea = (dims.a * (dims.a * 0.87)) / 2;
      const volume = baseArea * dims.b;
      return { areaLabel: `≈ ${baseArea.toFixed(1)} سم²`, volumeLabel: `≈ ${volume.toFixed(1)} سم³` };
    }
    default: return {};
  }
};

// ─────────────────────────────────────────────────────
// SVG 2D drawings for flat shapes
// ─────────────────────────────────────────────────────
const Shape2DSVG: React.FC<{ shapeId: string }> = ({ shapeId }) => {
  if (shapeId === 'square') return (
    <svg className="w-28 h-28 text-amber-400 stroke-current" viewBox="0 0 100 100" fill="none" strokeWidth="3">
      <rect x="10" y="10" width="80" height="80" rx="4" className="fill-amber-500/15" />
      <path d="M10,10 L90,90 M90,10 L10,90" strokeDasharray="4,4" strokeWidth="1.5" stroke="#64748b" />
      <text x="50" y="52" textAnchor="middle" fontSize="9" fill="#fbbf24" fontWeight="bold">a</text>
    </svg>
  );
  if (shapeId === 'rectangle') return (
    <svg className="w-32 h-20 text-emerald-400 stroke-current" viewBox="0 0 120 70" fill="none" strokeWidth="3">
      <rect x="5" y="5" width="110" height="60" rx="4" className="fill-emerald-500/15" />
      <text x="60" y="35" textAnchor="middle" fontSize="9" fill="#34d399" fontWeight="bold">L × l</text>
    </svg>
  );
  if (shapeId === 'triangle') return (
    <svg className="w-28 h-28 text-sky-400 stroke-current" viewBox="0 0 100 100" fill="none" strokeWidth="3">
      <polygon points="50,8 8,92 92,92" className="fill-sky-500/15" />
      <line x1="50" y1="8" x2="50" y2="92" strokeDasharray="4,4" strokeWidth="1.5" stroke="#fbbf24" />
      <text x="55" y="55" fontSize="9" fill="#fbbf24" fontWeight="bold">h</text>
    </svg>
  );
  if (shapeId === 'circle') return (
    <svg className="w-28 h-28 text-indigo-400 stroke-current" viewBox="0 0 100 100" fill="none" strokeWidth="3">
      <circle cx="50" cy="50" r="40" className="fill-indigo-500/15" />
      <line x1="50" y1="50" x2="90" y2="50" strokeWidth="2.5" stroke="#fbbf24" />
      <circle cx="50" cy="50" r="4" fill="#fbbf24" />
      <text x="68" y="47" fontSize="9" fill="#fbbf24" fontWeight="bold">r</text>
    </svg>
  );
  return null;
};

// ─────────────────────────────────────────────────────
// DimSlider
// ─────────────────────────────────────────────────────
const DimSlider: React.FC<{ label: string; value: number; onChange: (v: number) => void; max?: number }> = ({ label, value, onChange, max = 10 }) => (
  <div className="flex items-center gap-2 text-xs">
    <span className="font-bold w-24 shrink-0 text-right">{label}:</span>
    <input
      type="range" min={2} max={max} step={1} value={value}
      onChange={e => onChange(Number(e.target.value))}
      className="flex-1 accent-amber-500 cursor-pointer"
    />
    <span className="font-mono font-black w-12 text-left shrink-0">{value} سم</span>
  </div>
);

// ─────────────────────────────────────────────────────
// Quiz panel
// ─────────────────────────────────────────────────────
const QuizPanel: React.FC<{ theme: string; onClose: () => void; onShapeHighlight: (id: string) => void }> = ({ theme, onClose, onShapeHighlight }) => {
  const { direction } = useLocaleContext();
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const questions = QUIZ_QUESTIONS;
  const q = questions[qIdx];
  const isCorrect = selected === q.correctIndex;

  const handleAnswer = useCallback((i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.correctIndex) {
      setScore(s => s + 1);
    }
    if (q.relatedShapeId) onShapeHighlight(q.relatedShapeId);
  }, [selected, q, onShapeHighlight]);

  const handleNext = () => {
    if (qIdx + 1 >= questions.length) {
      setFinished(true);
    } else {
      setQIdx(i => i + 1);
      setSelected(null);
    }
  };

  const handleRestart = () => {
    setQIdx(0); setSelected(null); setScore(0); setFinished(false);
  };

  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-slate-800/90 border-slate-700' : theme === 'sepia' ? 'bg-[#FAF7F0] border-[#E7E2D7]' : 'bg-white border-slate-200';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`${cardBg} border rounded-2xl p-4 space-y-4`}
      dir={direction}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎯</span>
          <span className="font-extrabold text-sm">تحدي سريع!</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-lg">
            {score}/{questions.length}
          </span>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-200 text-xs font-bold cursor-pointer">
            ✕ إغلاق
          </button>
        </div>
      </div>

      {!finished ? (
        <>
          {/* Progress */}
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full ${i < qIdx ? 'bg-amber-500' : i === qIdx ? 'bg-amber-400 animate-pulse' : 'bg-slate-700'}`} />
            ))}
          </div>

          {/* Question */}
          <p className="font-bold text-sm leading-relaxed">{q.questionAr}</p>

          {/* Options */}
          <div className="grid grid-cols-2 gap-2">
            {q.options.map((opt, i) => {
              const isSelected = selected === i;
              const isRight = i === q.correctIndex;
              let btnStyle = 'border bg-slate-800/50 border-slate-700 hover:border-amber-500/50 hover:bg-amber-500/10 cursor-pointer';
              if (selected !== null) {
                if (isRight) btnStyle = 'border bg-emerald-500/15 border-emerald-500 text-emerald-300';
                else if (isSelected) btnStyle = 'border bg-red-500/15 border-red-500 text-red-300';
                else btnStyle = 'border bg-slate-800/30 border-slate-700 opacity-50';
              }
              return (
                <motion.button
                  key={i}
                  type="button"
                  whileHover={selected === null ? { scale: 1.02 } : {}}
                  whileTap={selected === null ? { scale: 0.97 } : {}}
                  onClick={() => handleAnswer(i)}
                  className={`${btnStyle} hit-target text-xs font-bold rounded-xl p-2.5 text-right transition-all`}
                >
                  {isSelected && selected !== null && (isRight ? '✅ ' : '❌ ')}{opt}
                </motion.button>
              );
            })}
          </div>

          {/* Feedback & next */}
          <AnimatePresence>
            {selected !== null && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className={`rounded-xl p-3 text-xs font-bold ${isCorrect ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'}`}
              >
                <div className="flex items-start gap-2">
                  {isCorrect ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />}
                  <span>{isCorrect ? '🎉 ممتاز! ' : '💡 تذكّر: '}{q.explanationAr}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {selected !== null && (
            <motion.button
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              type="button"
              onClick={handleNext}
              className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-black cursor-pointer"
            >
              {qIdx + 1 >= questions.length ? '🏆 النتيجة' : 'السؤال التالي ←'}
            </motion.button>
          )}
        </>
      ) : (
        /* Final score screen */
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-4 space-y-4">
          <div className="text-5xl">{score >= 7 ? '🥇' : score >= 5 ? '🥈' : '🌟'}</div>
          <div>
            <p className="font-extrabold text-lg">{score >= 7 ? 'ممتاز!' : score >= 5 ? 'جيد جداً!' : 'استمر في التعلم!'}</p>
            <p className="text-xs opacity-70">حصلت على <strong>{score}</strong> من <strong>{questions.length}</strong></p>
          </div>
          <div className="flex items-center justify-center gap-1">
            {Array(questions.length).fill(null).map((_, i) => (
              <span key={i} className={`text-lg ${i < score ? '⭐' : '☆'}`}>{i < score ? '⭐' : '☆'}</span>
            ))}
          </div>
          <button type="button" onClick={handleRestart} className="flex items-center gap-2 mx-auto px-5 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-black cursor-pointer">
            <RotateCcw className="w-3.5 h-3.5" /> إعادة المحاولة
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────
// GeometryVisualizer — main export
// ─────────────────────────────────────────────────────
interface GeometryVisualizerProps {
  grade?: string;
  theme?: string;
}

export const GeometryVisualizer: React.FC<GeometryVisualizerProps> = ({ grade = '4AP', theme = 'dark' }) => {
  const { direction } = useLocaleContext();
  const t = useTranslation('labsMath');
  const allows3D = grade === '3AP' || grade === '4AP' || grade === '5AP';
  const shapeCatalog = useMemo(
    () => (allows3D ? SHAPES : SHAPES.filter((s) => s.category === '2d')),
    [allows3D],
  );

  const [selectedId, setSelectedId] = useState<string>('square');
  const [dimensionsByShape, setDimensionsByShape] = useState<Record<string, ShapeDimensions>>(DEFAULT_DIMS);
  const [highlightFeature, setHighlightFeature] = useState<HighlightFeature>(null);
  const [appMode, setAppMode] = useState<'explore' | 'quiz'>('explore');
  const [activeCategory, setActiveCategory] = useState<'all' | '2d' | '3d'>(allows3D ? 'all' : '2d');

  useEffect(() => {
    if (!allows3D) {
      setActiveCategory('2d');
      setSelectedId((prev) => {
        const current = SHAPES.find((s) => s.id === prev);
        if (current?.category === '3d') return 'square';
        return prev;
      });
    }
  }, [allows3D]);

  const selectedShape = shapeCatalog.find((s) => s.id === selectedId) || shapeCatalog[0];
  const currentDims = dimensionsByShape[selectedId] || { a: 5, b: 5, c: 5 };
  const measurements = selectedShape.category === '3d' ? computeMeasurements(selectedId, currentDims) : {};

  const updateDim = (key: keyof ShapeDimensions, value: number) => {
    setDimensionsByShape(prev => ({ ...prev, [selectedId]: { ...(prev[selectedId] || currentDims), [key]: value } }));
  };

  const filteredShapes = shapeCatalog.filter(s => activeCategory === 'all' ? true : s.category === activeCategory);

  const isNeutre = theme === 'neutre';
  const isLight = theme === 'light';
  const isSepia = theme === 'sepia';
  const isDark = !isNeutre && !isLight && !isSepia;

  const cardBg = isNeutre ? 'bg-white border-slate-200 text-slate-900'
    : isLight ? 'bg-slate-50 border-slate-200 text-slate-900'
    : isSepia ? 'bg-[#F5F2EB] border-[#E7E2D7] text-stone-900'
    : 'bg-slate-900 border-slate-800 text-slate-100';

  const subBg = isNeutre ? 'bg-slate-50 border-slate-200'
    : isLight ? 'bg-white border-slate-200'
    : isSepia ? 'bg-[#FBF9F5] border-[#E7E2D7]'
    : 'bg-slate-800/80 border-slate-700/80';

  return (
    // data-lab-instrument: this component already adapts cardBg/subBg to the app's own theme prop
    // (light/neutre/sepia/dark) correctly on its own — without this opt-out, the lab-interior
    // wrapper's force-light-card override still neutralizes its bg-slate-900/bg-slate-800/80 classes
    // to white whenever theme='dark', while every light-on-dark text color inside (text-emerald-300,
    // text-amber-300, text-red-300...) stays untouched, breaking the quiz tab's answer feedback.
    <div data-lab-instrument className={`${cardBg} border rounded-2xl p-4 sm:p-5 shadow-sm transition-colors duration-300`} dir={direction}>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700/25 flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-lg shadow-inner ${isDark ? 'text-amber-400' : 'text-amber-800'}`}>
            📐
          </div>
          <div>
            <h3 className="font-extrabold text-base flex items-center gap-2">
              {t('geometryTitle')}
              <span className={`text-xs bg-amber-500/20 font-bold px-2 py-0.5 rounded-md border border-amber-500/30 ${isDark ? 'text-amber-400' : 'text-amber-800'}`}>{grade}</span>
            </h3>
            <p className="text-xs opacity-60">{t('geometrySubtitle')}</p>
          </div>
        </div>

        {/* Mode toggle */}
        <div className={`flex gap-1 p-1 rounded-xl border text-xs font-bold ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
          {([
            { id: 'explore', labelAr: '🔭 استكشاف', icon: Compass },
            { id: 'quiz', labelAr: '🎯 تحدي', icon: Gamepad2 },
          ] as const).map(({ id, labelAr }) => (
            <button
              key={id}
              type="button"
              onClick={() => setAppMode(id)}
              className={`hit-target px-3 py-1.5 rounded-lg transition-all cursor-pointer ${appMode === id ? 'bg-amber-500 text-slate-950 font-black shadow-sm' : 'opacity-60 hover:opacity-90'}`}
            >
              {labelAr}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {appMode === 'quiz' ? (
          <motion.div key="quiz"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            <QuizPanel
              theme={theme}
              onClose={() => setAppMode('explore')}
              onShapeHighlight={shapeId => { setSelectedId(shapeId); setAppMode('explore'); }}
            />
          </motion.div>
        ) : (
          <motion.div key="explore"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="space-y-4"
          >
            {/* Category tabs + shape pills */}
            <div className="space-y-2">
              {/* Category tabs */}
              <div className={`flex gap-1 p-1 rounded-xl border text-[11px] font-bold w-fit ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                {([
                  { id: 'all', label: 'الكل' },
                  { id: '2d', label: '2D' },
                  ...(allows3D ? [{ id: '3d' as const, label: '3D' }] : []),
                ] as const).map(({ id, label }) => (
                  <button
                    key={id} type="button"
                    onClick={() => { setActiveCategory(id); if (id !== 'all') { const first = shapeCatalog.find(s => s.category === id); if (first) setSelectedId(first.id); } }}
                    className={`hit-target px-2.5 py-1 rounded-lg transition-all cursor-pointer ${activeCategory === id ? 'bg-amber-500 text-slate-950 font-black' : 'opacity-60 hover:opacity-90'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Shape pills */}
              <div className={`flex gap-1 p-1 rounded-xl border flex-wrap ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                {filteredShapes.map(s => (
                  <motion.button
                    key={s.id}
                    type="button"
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => { setSelectedId(s.id); setHighlightFeature(null); }}
                    className={`hit-target px-2.5 py-1 rounded-lg transition-all text-[11px] font-bold cursor-pointer ${selectedId === s.id ? 'bg-amber-500 text-slate-950 font-black shadow-sm' : 'opacity-60 hover:opacity-90'}`}
                  >
                    {s.nameAr}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Main content grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedId}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-4"
              >
                {/* ── Left: 3D viewer or SVG ── */}
                <div className="md:col-span-5">
                  {selectedShape.category === '3d' ? (
                    <Shape3DViewer
                      shapeId={selectedShape.id as Solid3DId}
                      dims={currentDims}
                      accentHex={selectedShape.accentHex}
                      highlightFeature={highlightFeature}
                    />
                  ) : (
                    <div className={`${subBg} rounded-2xl border p-6 flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden`}>
                      <div className={`text-[10px] font-mono absolute top-3 right-3 uppercase tracking-widest ${isDark ? 'text-amber-400/70' : 'text-amber-800'}`}>
                        2D PLANE SHAPE
                      </div>
                      <motion.div
                        animate={{ rotate: [0, 1, -1, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                      >
                        <Shape2DSVG shapeId={selectedShape.id} />
                      </motion.div>
                    </div>
                  )}
                </div>

                {/* ── Right: info pane ── */}
                <div className="md:col-span-7 space-y-3">
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: selectedShape.accentHex }}
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                    <h4 className="font-extrabold text-base">{selectedShape.nameAr}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${selectedShape.category === '3d' ? (isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700') : (isDark ? 'bg-sky-500/20 text-sky-400' : 'bg-sky-100 text-sky-700')}`}>
                      {selectedShape.category.toUpperCase()}
                    </span>
                  </div>

                  {/* Dimension sliders (3D only) */}
                  {selectedShape.category === '3d' && (
                    <div className={`${subBg} p-3 rounded-xl border space-y-2`}>
                      <span className="text-[10px] font-bold opacity-60 uppercase block">{t('geometryDimensionsLabel')}</span>
                      {selectedId === 'cube' && (
                        <DimSlider label="الحرف (a)" value={currentDims.a} onChange={v => updateDim('a', v)} />
                      )}
                      {selectedId === 'cuboid' && (<>
                        <DimSlider label="الطول (L)" value={currentDims.a} onChange={v => updateDim('a', v)} />
                        <DimSlider label="العرض (l)" value={currentDims.b} onChange={v => updateDim('b', v)} />
                        <DimSlider label="الارتفاع (h)" value={currentDims.c} onChange={v => updateDim('c', v)} />
                      </>)}
                      {selectedId === 'cylinder' && (<>
                        <DimSlider label="نصف القطر (r)" value={currentDims.a} onChange={v => updateDim('a', v)} max={7} />
                        <DimSlider label="الارتفاع (h)" value={currentDims.b} onChange={v => updateDim('b', v)} />
                      </>)}
                      {(selectedId === 'pyramid' || selectedId === 'prism') && (<>
                        <DimSlider label="ضلع القاعدة" value={currentDims.a} onChange={v => updateDim('a', v)} />
                        <DimSlider label="الارتفاع (h)" value={currentDims.b} onChange={v => updateDim('b', v)} />
                      </>)}
                    </div>
                  )}

                  {/* Properties (hoverable → highlights 3D shape) */}
                  <div className={`${subBg} p-3 rounded-xl border`}>
                    <span className="text-[10px] font-bold opacity-60 uppercase block mb-2">{t('geometryPropertiesLabel')}</span>
                    <ul className="space-y-1.5">
                      {selectedShape.properties.map((prop, i) => (
                        <motion.li
                          key={i}
                          whileHover={{ x: -4 }}
                          onHoverStart={() => prop.highlightKey ? setHighlightFeature(prop.highlightKey) : undefined}
                          onHoverEnd={() => setHighlightFeature(null)}
                          className={`flex items-start gap-2 text-xs font-medium rounded-lg px-2.5 py-1.5 cursor-default transition-colors ${prop.highlightKey && highlightFeature === prop.highlightKey ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : prop.highlightKey ? 'hover:bg-amber-500/10 border border-transparent' : 'border border-transparent'}`}
                        >
                          <span className="text-amber-400 mt-0.5 shrink-0">{prop.highlightKey ? '✦' : '•'}</span>
                          <span>{prop.text}</span>
                          {prop.highlightKey && (
                            <span className="mr-auto text-[9px] font-bold opacity-50 shrink-0">
                              {prop.highlightKey === 'faces' ? '(أوجه)' : prop.highlightKey === 'edges' ? '(حروف)' : '(رؤوس)'}
                            </span>
                          )}
                        </motion.li>
                      ))}
                    </ul>
                    {selectedShape.category === '3d' && (
                      <p className="text-[9px] opacity-40 mt-2 font-bold">✦ مرّر المؤشر لإبراز العنصر في المجسّم</p>
                    )}
                  </div>

                  {/* Formulas */}
                  <div className="space-y-2">
                    {selectedShape.perimeterFormulaAr && (
                      <div className={`p-2.5 rounded-xl flex items-center justify-between flex-wrap gap-1 text-xs font-bold border ${
                        isDark
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      }`}>
                        <span>{t('geometryPerimeterLawLabel')}</span>
                        <span className={`font-mono px-2 py-0.5 rounded ${isDark ? 'text-emerald-300 bg-emerald-500/20' : 'text-emerald-950 bg-emerald-100'}`}>
                          {selectedShape.perimeterFormulaAr}
                        </span>
                      </div>
                    )}
                    {selectedShape.areaFormulaAr && (
                      <div className={`p-2.5 rounded-xl flex items-center justify-between flex-wrap gap-1 text-xs font-bold border ${
                        isDark
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          : 'bg-amber-50 border-amber-200 text-amber-950'
                      }`}>
                        <span>{t('geometryAreaLawLabel')}</span>
                        <span className={`font-mono px-2 py-0.5 rounded ${isDark ? 'text-amber-300 bg-amber-500/20' : 'text-amber-950 bg-amber-100'}`}>
                          {selectedShape.areaFormulaAr}{' '}
                          {measurements.areaLabel && (
                            <span className={`font-medium ${isDark ? 'text-amber-200' : 'text-amber-950'}`}>{measurements.areaLabel}</span>
                          )}
                        </span>
                      </div>
                    )}
                    {selectedShape.volumeFormulaAr && (
                      <div className={`p-2.5 rounded-xl flex items-center justify-between flex-wrap gap-1 text-xs font-bold border ${
                        isDark
                          ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                          : 'bg-purple-50 border-purple-200 text-purple-950'
                      }`}>
                        <span>{t('geometryVolumeLawLabel')}</span>
                        <span className={`font-mono px-2 py-0.5 rounded ${isDark ? 'text-purple-300 bg-purple-500/20' : 'text-purple-950 bg-purple-100'}`}>
                          {selectedShape.volumeFormulaAr}{' '}
                          {measurements.volumeLabel && (
                            <span className={`font-medium ${isDark ? 'text-purple-200' : 'text-purple-950'}`}>{measurements.volumeLabel}</span>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
