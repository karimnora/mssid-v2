import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PreschoolLanguage, PRESCHOOL_LANGUAGE_LABELS } from '../../data/preschool/types';
import { playSuccessChime, playBubblePop, usePreschoolSpeech } from './usePreschoolAudio';

interface PreschoolMagicBoardProps {
  language: PreschoolLanguage;
  onSelectLanguage?: (lang: PreschoolLanguage) => void;
  onExit: () => void;
}

type BoardMode = 'free' | 'slate' | 'trace' | 'coloring';

interface TraceTemplate {
  id: string;
  label: string;
  char: string;
  hintAr: string;
  hintFr: string;
  hintEn: string;
}

interface ColoringTemplate {
  id: string;
  nameAr: string;
  nameFr: string;
  nameEn: string;
  icon: string;
  svgPaths: string[];
}

const TRACE_TEMPLATES: TraceTemplate[] = [
  { id: 'ar_alif', label: 'أ', char: 'أ', hintAr: 'ألف - أرنب', hintFr: 'Alif - Arnab (Lapin)', hintEn: 'Alif - Rabbit' },
  { id: 'ar_baa', label: 'ب', char: 'ب', hintAr: 'باء - بطة', hintFr: 'Baa - Batta (Canard)', hintEn: 'Baa - Duck' },
  { id: 'ar_taa', label: 'ت', char: 'ت', hintAr: 'تاء - تفاح', hintFr: 'Taa - Touffah (Pomme)', hintEn: 'Taa - Apple' },
  { id: 'ar_jeem', label: 'ج', char: 'ج', hintAr: 'جيم - جمل', hintFr: 'Jeem - Jamal (Chameau)', hintEn: 'Jeem - Camel' },
  { id: 'ar_dal', label: 'د', char: 'د', hintAr: 'دال - دبدوب', hintFr: 'Dal - Dabdoob (Ourson)', hintEn: 'Dal - Teddy' },
  { id: 'num_1', label: '١', char: '١', hintAr: 'واحد (١)', hintFr: 'Un en Arabe (1)', hintEn: 'One in Arabic (1)' },
  { id: 'num_2', label: '٢', char: '٢', hintAr: 'اثنان (٢)', hintFr: 'Deux en Arabe (2)', hintEn: 'Two in Arabic (2)' },
  { id: 'num_3', label: '٣', char: '٣', hintAr: 'ثلاثة (٣)', hintFr: 'Trois en Arabe (3)', hintEn: 'Three in Arabic (3)' },
  { id: 'fr_a', label: 'A', char: 'A', hintAr: 'حرف A - Avion', hintFr: 'A comme Avion', hintEn: 'A is for Airplane' },
  { id: 'fr_b', label: 'B', char: 'B', hintAr: 'حرف B - Bateau', hintFr: 'B comme Bateau', hintEn: 'B is for Boat' },
  { id: 'fr_c', label: 'C', char: 'C', hintAr: 'حرف C - Chat', hintFr: 'C comme Chat', hintEn: 'C is for Cat' },
  { id: 'fr_1', label: '1', char: '1', hintAr: 'الرقم 1', hintFr: 'Chiffre 1', hintEn: 'Number 1' },
  { id: 'fr_2', label: '2', char: '2', hintAr: 'الرقم 2', hintFr: 'Chiffre 2', hintEn: 'Number 2' },
  { id: 'fr_3', label: '3', char: '3', hintAr: 'الرقم 3', hintFr: 'Chiffre 3', hintEn: 'Number 3' },
];

const COLORING_TEMPLATES: ColoringTemplate[] = [
  {
    id: 'fennec',
    nameAr: 'ثعلب الفنك الجزائري 🦊',
    nameFr: 'Le Fennec du Sahara 🦊',
    nameEn: 'Sahara Fennec Fox 🦊',
    icon: '🦊',
    svgPaths: [
      'M 120 180 C 120 120 180 80 200 80 C 220 80 280 120 280 180 C 280 240 220 270 200 270 C 180 270 120 240 120 180 Z',
      'M 150 110 L 100 40 C 95 60 110 110 135 125 Z',
      'M 250 110 L 300 40 C 305 60 290 110 265 125 Z',
      'M 160 170 A 10 10 0 1 1 160 169',
      'M 240 170 A 10 10 0 1 1 240 169',
      'M 190 205 Q 200 215 210 205',
    ],
  },
  {
    id: 'flag_dz',
    nameAr: 'العلم الجزائري والهلال 🇩🇿',
    nameFr: 'Drapeau & Croissant Algérien 🇩🇿',
    nameEn: 'Algerian Crescent & Star 🇩🇿',
    icon: '🇩🇿',
    svgPaths: [
      'M 70 80 L 330 80 L 330 280 L 70 280 Z',
      'M 200 80 L 200 280',
      'M 190 140 C 220 140 240 160 230 190 C 220 220 190 230 160 215 C 200 225 220 180 190 140 Z',
      'M 215 165 L 220 175 L 232 176 L 223 184 L 226 195 L 215 189 L 204 195 L 207 184 L 198 176 L 210 175 Z',
    ],
  },
  {
    id: 'palm',
    nameAr: 'نخلة الواحة الخضراء 🌴',
    nameFr: 'Le Palmier de l\'Oasis 🌴',
    nameEn: 'The Oasis Palm Tree 🌴',
    icon: '🌴',
    svgPaths: [
      'M 190 160 Q 185 240 180 320 L 220 320 Q 215 240 210 160 Z',
      'M 200 160 Q 140 110 80 140 Q 130 150 200 160',
      'M 200 160 Q 140 80 120 30 Q 160 80 200 160',
      'M 200 160 Q 200 50 200 20 Q 210 70 200 160',
      'M 200 160 Q 260 80 280 30 Q 240 80 200 160',
      'M 200 160 Q 260 110 320 140 Q 270 150 200 160',
    ],
  },
  {
    id: 'camel',
    nameAr: 'الجمل الصحراوي اللطيف 🐪',
    nameFr: 'Le Dromadaire du Désert 🐪',
    nameEn: 'The Desert Dromedary 🐪',
    icon: '🐪',
    svgPaths: [
      'M 100 260 L 100 320 L 120 320 L 120 270 L 180 270 L 180 320 L 200 320 L 200 250',
      'M 100 250 C 90 220 110 190 140 180 C 150 140 190 140 200 180 C 230 190 250 220 250 250',
      'M 95 210 Q 70 180 60 140 Q 80 140 85 160 L 110 210',
      'M 60 140 Q 50 130 40 140 Q 50 150 65 150',
    ],
  },
  {
    id: 'boat',
    nameAr: 'قارب الصيد المتوسطي ⛵',
    nameFr: 'Le Bateau de Pêche ⛵',
    nameEn: 'Mediterranean Fishing Boat ⛵',
    icon: '⛵',
    svgPaths: [
      'M 80 230 L 120 290 L 280 290 L 320 230 Z',
      'M 195 230 L 195 80 L 205 80 L 205 230 Z',
      'M 205 90 L 290 210 L 205 210 Z',
      'M 195 110 L 130 210 L 195 210 Z',
    ],
  },
];

const COLOR_PALETTE = [
  { color: '#ef4444', labelAr: 'أحمر', labelFr: 'Rouge', labelEn: 'Red' },
  { color: '#f97316', labelAr: 'برتقالي', labelFr: 'Orange', labelEn: 'Orange' },
  { color: '#eab308', labelAr: 'أصفر', labelFr: 'Jaune', labelEn: 'Yellow' },
  { color: '#22c55e', labelAr: 'أخضر', labelFr: 'Vert', labelEn: 'Green' },
  { color: '#06b6d4', labelAr: 'سماوي', labelFr: 'Cyan', labelEn: 'Sky Blue' },
  { color: '#3b82f6', labelAr: 'أزرق', labelFr: 'Bleu', labelEn: 'Blue' },
  { color: '#a855f7', labelAr: 'بنفسجي', labelFr: 'Violet', labelEn: 'Purple' },
  { color: '#ec4899', labelAr: 'وردي', labelFr: 'Rose', labelEn: 'Pink' },
  { color: '#78350f', labelAr: 'بني', labelFr: 'Marron', labelEn: 'Brown' },
  { color: '#1e293b', labelAr: 'أسود', labelFr: 'Noir', labelEn: 'Black' },
  { color: '#ffffff', labelAr: 'أبيض / ممحاة', labelFr: 'Blanc / Gomme', labelEn: 'White / Eraser' },
];

const STAMPS = ['🌟', '💖', '🎈', '🇩🇿', '🦁', '🦊', '🌴', '🌸', '🚀', '🍰', '⭐', '🌈'];

export const PreschoolMagicBoard: React.FC<PreschoolMagicBoardProps> = ({
  language,
  onSelectLanguage,
  onExit,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [mode, setMode] = useState<BoardMode>('free');
  const [selectedColor, setSelectedColor] = useState<string>('#ef4444');
  const [brushSize, setBrushSize] = useState<number>(14);
  const [isRainbow, setIsRainbow] = useState<boolean>(false);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [activeStamp, setActiveStamp] = useState<string | null>(null);

  const [activeTrace, setActiveTrace] = useState<TraceTemplate>(TRACE_TEMPLATES[0]);
  const [activeColoring, setActiveColoring] = useState<ColoringTemplate>(COLORING_TEMPLATES[0]);
  const [rainbowHue, setRainbowHue] = useState<number>(0);

  const { speak } = usePreschoolSpeech(language);

  // Initialize canvas size
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Save previous image data if existing
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (tempCtx && canvas.width > 0 && canvas.height > 0) {
      tempCtx.drawImage(canvas, 0, 0);
    }

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      if (tempCanvas.width > 0 && tempCanvas.height > 0) {
        ctx.drawImage(tempCanvas, 0, 0, rect.width, rect.height);
      } else {
        clearCanvas(false);
      }
    }
  }, [mode]);

  const clearCanvas = (withChime = true) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    if (mode === 'slate') {
      // Dark chalkboard slate
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, w, h);
    } else {
      // Clean white paper
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
    }

    if (withChime) {
      playBubblePop();
      speak(
        language === 'ar'
          ? 'تم مسح اللوحة! هيا نرسم شيئاً جميلاً مجدداً!'
          : language === 'fr'
          ? 'Tableau effacé ! Dessinons quelque chose de beau !'
          : 'Board cleared! Let\'s draw something awesome!'
      );
    }
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  useEffect(() => {
    clearCanvas(false);
  }, [mode]);

  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);

    // If stamp is active, place stamp
    if (activeStamp) {
      ctx.font = `${brushSize * 2.5}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(activeStamp, x, y);
      playBubblePop();
      return;
    }

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize;

    if (isRainbow) {
      ctx.strokeStyle = `hsl(${rainbowHue}, 100%, 50%)`;
      setRainbowHue((prev) => (prev + 20) % 360);
    } else {
      ctx.strokeStyle = mode === 'slate' && selectedColor === '#1e293b' ? '#ffffff' : selectedColor;
    }
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing || activeStamp) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);

    if (isRainbow) {
      ctx.strokeStyle = `hsl(${rainbowHue}, 100%, 50%)`;
      setRainbowHue((prev) => (prev + 8) % 360);
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.closePath();
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    playSuccessChime();
    const link = document.createElement('a');
    link.download = `dessin-enfant-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    speak(
      language === 'ar'
        ? 'تم حفظ رسمتك الرائعة بنجاح!'
        : language === 'fr'
        ? 'Ton magnifique dessin a été téléchargé !'
        : 'Your great drawing has been saved!'
    );
  };

  const labels = {
    title:
      language === 'ar'
        ? 'لوحة الرسم والكتابة السحرية 🎨'
        : language === 'fr'
        ? 'Tableau Magique & Ardoise d\'Écriture 🎨'
        : 'Magic Board & Writing Slate 🎨',
    freeMode: language === 'ar' ? '🎨 رسم حر' : language === 'fr' ? '🎨 Dessin Libre' : '🎨 Free Draw',
    slateMode: language === 'ar' ? '⬛ لوحة مدرسية' : language === 'fr' ? '⬛ Ardoise' : '⬛ Slate',
    traceMode: language === 'ar' ? '✏️ تتبع الحروف' : language === 'fr' ? '✏️ Tracé & Lettres' : '✏️ Trace Letters',
    colorMode: language === 'ar' ? '🖍️ تلوين التراث' : language === 'fr' ? '🖍️ Coloriage' : '🖍️ Coloring',
    colors: language === 'ar' ? '🎨 ألوان الفرشاة:' : language === 'fr' ? '🎨 Couleurs :' : '🎨 Colors:',
    brushSize: language === 'ar' ? '🖌️ حجم الفرشاة:' : language === 'fr' ? '🖌️ Taille pinceau :' : '🖌️ Brush size:',
    stamps: language === 'ar' ? '⭐ ملصقات مرحة:' : language === 'fr' ? '⭐ Autocollants :' : '⭐ Fun Stamps:',
    cancelStamp: language === 'ar' ? 'إلغاء الملصق' : language === 'fr' ? 'Annuler' : 'Cancel stamp',
    rainbow: language === 'ar' ? 'فرشاة قوس قزح 🌈' : language === 'fr' ? 'Pinceau Arc-en-ciel 🌈' : 'Rainbow Brush 🌈',
    clear: language === 'ar' ? 'مسح اللوحة 🧽' : language === 'fr' ? 'Effacer 🧽' : 'Clear 🧽',
    save: language === 'ar' ? 'حفظ الرسمة 📥' : language === 'fr' ? 'Télécharger 📥' : 'Save Image 📥',
    pickTrace: language === 'ar' ? 'اختر حرفاً أو رقماً للتتبع:' : language === 'fr' ? 'Choisis une lettre / chiffre :' : 'Choose letter/number:',
    pickColoring: language === 'ar' ? 'اختر رسمة جزائرية للتلوين:' : language === 'fr' ? 'Choisis un coloriage algérien :' : 'Choose Algerian template:',
  };

  return (
    <div
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="min-h-screen bg-gradient-to-b from-amber-100 via-rose-50 to-orange-100 p-2 sm:p-4 flex flex-col justify-between select-none"
    >
      {/* Top Header */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between gap-2 mb-2">
        <button
          onClick={onExit}
          className="min-h-11 min-w-11 sm:min-h-12 sm:min-w-12 flex items-center justify-center rounded-2xl bg-white shadow-md text-2xl hover:bg-orange-50 active:scale-95 transition-all cursor-pointer border border-orange-200"
          aria-label="خروج"
        >
          🚪
        </button>

        <h1 className="text-base sm:text-2xl font-black text-orange-950 text-center flex-1 truncate px-2">
          {labels.title}
        </h1>

        {/* Trilingual Quick Switcher */}
        <div className="flex items-center gap-1 bg-white/90 p-1 rounded-2xl shadow-sm border border-orange-200">
          {(['ar', 'fr', 'en'] as PreschoolLanguage[]).map((l) => (
            <button
              key={l}
              onClick={() => {
                if (onSelectLanguage) onSelectLanguage(l);
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                language === l
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-orange-950 hover:bg-orange-100'
              }`}
            >
              {PRESCHOOL_LANGUAGE_LABELS[l].flag} {l.toUpperCase()}
            </button>
          ))}
        </div>

        <button
          onClick={downloadDrawing}
          className="min-h-11 px-3 sm:px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer border border-emerald-500"
        >
          <span>{labels.save}</span>
        </button>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-center gap-1.5 sm:gap-2 mb-2 flex-wrap">
        {[
          { id: 'free', label: labels.freeMode },
          { id: 'slate', label: labels.slateMode },
          { id: 'trace', label: labels.traceMode },
          { id: 'coloring', label: labels.colorMode },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setMode(m.id as BoardMode);
              playBubblePop();
            }}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
              mode === m.id
                ? 'bg-orange-500 text-white shadow-md scale-105 border-2 border-orange-300 ring-2 ring-orange-400'
                : 'bg-white text-orange-950 hover:bg-orange-50 border border-orange-200'
            }`}
          >
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      {/* Sub-bar for Trace Mode */}
      {mode === 'trace' && (
        <div className="max-w-4xl w-full mx-auto mb-2 bg-white/90 rounded-2xl p-2 shadow-xs border border-orange-100 flex items-center gap-2 overflow-x-auto scrollbar-thin">
          <span className="text-xs font-black text-orange-950 shrink-0">{labels.pickTrace}</span>
          {TRACE_TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setActiveTrace(t);
                clearCanvas(false);
                const hint = language === 'ar' ? t.hintAr : language === 'fr' ? t.hintFr : t.hintEn;
                speak(hint);
              }}
              className={`w-9 h-9 rounded-xl font-black text-base shrink-0 flex items-center justify-center cursor-pointer transition-all ${
                activeTrace.id === t.id
                  ? 'bg-orange-500 text-white shadow-md scale-110'
                  : 'bg-orange-50 text-orange-950 hover:bg-orange-100 border border-orange-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Sub-bar for Coloring Mode */}
      {mode === 'coloring' && (
        <div className="max-w-4xl w-full mx-auto mb-2 bg-white/90 rounded-2xl p-2 shadow-xs border border-orange-100 flex items-center gap-2 overflow-x-auto scrollbar-thin">
          <span className="text-xs font-black text-orange-950 shrink-0">{labels.pickColoring}</span>
          {COLORING_TEMPLATES.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setActiveColoring(c);
                clearCanvas(false);
                const name = language === 'ar' ? c.nameAr : language === 'fr' ? c.nameFr : c.nameEn;
                speak(name);
              }}
              className={`px-3 py-1.5 rounded-xl font-black text-xs shrink-0 flex items-center gap-1.5 cursor-pointer transition-all ${
                activeColoring.id === c.id
                  ? 'bg-orange-500 text-white shadow-md scale-105'
                  : 'bg-orange-50 text-orange-950 hover:bg-orange-100 border border-orange-200'
              }`}
            >
              <span className="text-base">{c.icon}</span>
              <span>{language === 'ar' ? c.nameAr : language === 'fr' ? c.nameFr : c.nameEn}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main Board Workspace */}
      <div className="max-w-6xl w-full mx-auto flex-1 grid grid-cols-1 md:grid-cols-4 gap-3 items-stretch min-h-[380px]">
        {/* Canvas Drawing Stage */}
        <div
          ref={containerRef}
          className={`md:col-span-3 rounded-3xl overflow-hidden shadow-2xl relative border-4 ${
            mode === 'slate'
              ? 'border-amber-900 bg-slate-900 shadow-slate-900/40'
              : 'border-orange-300 bg-white shadow-orange-900/10'
          }`}
          style={{ touchAction: 'none' }}
        >
          {/* Overlay Template for Trace Mode */}
          {mode === 'trace' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
              <span className="text-[140px] sm:text-[200px] font-black text-orange-400/25 tracking-widest leading-none">
                {activeTrace.char}
              </span>
              <span className="text-sm sm:text-base font-black text-orange-600/70 bg-orange-50/80 px-4 py-1 rounded-full mt-2">
                {language === 'ar' ? activeTrace.hintAr : language === 'fr' ? activeTrace.hintFr : activeTrace.hintEn}
              </span>
            </div>
          )}

          {/* Overlay Template for Coloring Mode */}
          {mode === 'coloring' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none p-4">
              <svg
                viewBox="0 0 400 400"
                className="w-full h-full max-w-[360px] max-h-[360px] opacity-25"
              >
                {activeColoring.svgPaths.map((d, i) => (
                  <path
                    key={i}
                    d={d}
                    fill="none"
                    stroke="#ea580c"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
              </svg>
            </div>
          )}

          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-full cursor-crosshair block"
          />

          {/* Clear board button inside corner */}
          <button
            onClick={() => clearCanvas(true)}
            className="absolute bottom-3 left-3 bg-rose-500 hover:bg-rose-600 text-white font-black text-xs px-3 py-2 rounded-2xl shadow-md active:scale-95 transition-all flex items-center gap-1 cursor-pointer border border-rose-400"
          >
            <span>{labels.clear}</span>
          </button>
        </div>

        {/* Sidebar Tools Panel */}
        <div className="bg-white/95 backdrop-blur-xs rounded-3xl p-3 sm:p-4 shadow-xl border border-orange-200 flex flex-col justify-between gap-3">
          {/* Colors Palette */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-orange-950 block">{labels.colors}</label>
            <div className="grid grid-cols-6 md:grid-cols-4 gap-1.5">
              {/* Rainbow Brush Button */}
              <button
                onClick={() => {
                  setIsRainbow(true);
                  setActiveStamp(null);
                }}
                className={`min-h-9 rounded-xl shadow-xs text-sm font-black transition-all cursor-pointer flex items-center justify-center border-2 ${
                  isRainbow
                    ? 'border-orange-500 scale-110 shadow-md ring-2 ring-orange-400'
                    : 'border-slate-200 hover:scale-105'
                }`}
                style={{
                  background: 'linear-gradient(135deg, #ef4444, #eab308, #22c55e, #3b82f6, #a855f7)',
                }}
                title={labels.rainbow}
              >
                🌈
              </button>

              {COLOR_PALETTE.map((p) => {
                const isSelected = !isRainbow && !activeStamp && selectedColor === p.color;
                return (
                  <button
                    key={p.color}
                    onClick={() => {
                      setSelectedColor(p.color);
                      setIsRainbow(false);
                      setActiveStamp(null);
                      playBubblePop();
                    }}
                    className={`min-h-9 rounded-xl shadow-xs transition-all cursor-pointer border-2 ${
                      isSelected
                        ? 'border-orange-600 scale-115 shadow-md ring-2 ring-orange-400'
                        : 'border-slate-200 hover:scale-105'
                    }`}
                    style={{ backgroundColor: p.color }}
                    title={language === 'ar' ? p.labelAr : language === 'fr' ? p.labelFr : p.labelEn}
                  />
                );
              })}
            </div>
          </div>

          {/* Brush Sizes */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-orange-950 block">{labels.brushSize}</label>
            <div className="flex items-center gap-2">
              {[
                { size: 8, iconSize: 'w-2.5 h-2.5' },
                { size: 16, iconSize: 'w-4 h-4' },
                { size: 28, iconSize: 'w-6 h-6' },
              ].map((b) => (
                <button
                  key={b.size}
                  onClick={() => setBrushSize(b.size)}
                  className={`flex-1 min-h-10 rounded-xl flex flex-col items-center justify-center text-xs font-black transition-all cursor-pointer border ${
                    brushSize === b.size
                      ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-xs'
                      : 'bg-amber-50/60 text-slate-700 hover:bg-amber-100/60 border-amber-200'
                  }`}
                >
                  <span className={`rounded-full bg-slate-800 ${b.iconSize}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Stickers / Stamps */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-orange-950 block">{labels.stamps}</label>
              {activeStamp && (
                <button
                  onClick={() => setActiveStamp(null)}
                  className="text-[10px] text-rose-600 font-bold hover:underline"
                >
                  {labels.cancelStamp}
                </button>
              )}
            </div>
            <div className="grid grid-cols-6 md:grid-cols-4 gap-1.5">
              {STAMPS.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setActiveStamp(s);
                    playBubblePop();
                  }}
                  className={`min-h-8 rounded-xl text-base flex items-center justify-center transition-all cursor-pointer border ${
                    activeStamp === s
                      ? 'bg-amber-300 border-amber-500 scale-115 shadow-md ring-2 ring-amber-400'
                      : 'bg-white hover:bg-amber-50 border-slate-200 hover:scale-105'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
