import React, { useState, useRef, useEffect } from 'react';
import { CourseLesson } from '../types';
import {
  PenTool,
  Eraser,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Pencil,
  Tag,
  Palette,
  Zap,
  Award
} from 'lucide-react';
import { VoiceEchoBar } from './VoiceEchoBar';
import {
  ARABIC_CANVAS_2AP_DEFAULT,
  ARABIC_CANVAS_BY_LESSON,
  arabicCanvasPrefersDiacritics,
} from '../data/arabicCanvasByLesson';

interface ArabicCanvasInteractiveProps {
  lesson?: CourseLesson;
  grade?: string;
}

type HarakaId = 'fatha' | 'damma' | 'kasra' | 'sukun';

const HARAKA_CHOICES: { id: HarakaId; mark: string; nameAr: string }[] = [
  { id: 'fatha', mark: 'َ', nameAr: 'فَتْحَةٌ' },
  { id: 'damma', mark: 'ُ', nameAr: 'ضَمَّةٌ' },
  { id: 'kasra', mark: 'ِ', nameAr: 'كَسْرَةٌ' },
  { id: 'sukun', mark: 'ْ', nameAr: 'سُكُونٌ' },
];

const TASHKIL_ITEMS: { letter: string; haraka: HarakaId; shown: string; promptAr: string }[] = [
  { letter: 'ب', haraka: 'fatha', shown: 'بَ', promptAr: 'ضَعِ الفَتْحَةَ فَوْقَ البَاءِ' },
  { letter: 'ب', haraka: 'damma', shown: 'بُ', promptAr: 'ضَعِ الضَّمَّةَ فَوْقَ البَاءِ' },
  { letter: 'ب', haraka: 'kasra', shown: 'بِ', promptAr: 'ضَعِ الكَسْرَةَ تَحْتَ البَاءِ' },
  { letter: 'ب', haraka: 'sukun', shown: 'بْ', promptAr: 'ضَعِ السُّكُونَ فَوْقَ البَاءِ' },
  { letter: 'ت', haraka: 'fatha', shown: 'تَ', promptAr: 'ضَعِ الفَتْحَةَ فَوْقَ التَّاءِ' },
  { letter: 'د', haraka: 'damma', shown: 'دُ', promptAr: 'ضَعِ الضَّمَّةَ فَوْقَ الدَّالِ' },
  { letter: 'م', haraka: 'kasra', shown: 'مِ', promptAr: 'ضَعِ الكَسْرَةَ تَحْتَ المِيمِ' },
  { letter: 'ل', haraka: 'sukun', shown: 'لْ', promptAr: 'ضَعِ السُّكُونَ فَوْقَ اللَّامِ كَمَا فِي قَلْبٌ' },
];

const TashkilPractice: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<HarakaId | null>(null);
  const item = TASHKIL_ITEMS[index];
  const correct = picked === item.haraka;

  const pick = (id: HarakaId) => {
    if (picked) return;
    setPicked(id);
  };

  const next = () => {
    setPicked(null);
    setIndex((i) => (i + 1) % TASHKIL_ITEMS.length);
  };

  return (
    <div className="space-y-5 min-w-0" data-arabic-tool="tashkil">
      <p className="text-center text-sm font-black text-[#1E293B]">{item.promptAr}</p>
      <div className="flex items-center justify-center">
        <span className="text-7xl sm:text-8xl font-black text-[#1E293B] leading-none">
          {picked && correct ? item.shown : item.letter}
        </span>
      </div>
      <VoiceEchoBar modelText={item.shown} language="ar" />
      <div className="grid grid-cols-2 gap-3">
        {HARAKA_CHOICES.map((h) => {
          const selected = picked === h.id;
          const isRight = selected && h.id === item.haraka;
          const isWrong = selected && h.id !== item.haraka;
          return (
            <button
              key={h.id}
              type="button"
              onClick={() => pick(h.id)}
              disabled={!!picked}
              className={`min-h-14 rounded-3xl border text-base font-black cursor-pointer ${
                isRight
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                  : isWrong
                    ? 'bg-rose-100 border-rose-200 text-rose-800'
                    : 'bg-sky-50 border-sky-100 text-[#1E293B] hover:bg-sky-100'
              }`}
            >
              <span className="text-2xl ml-2">{h.mark}</span>
              {h.nameAr}
            </button>
          );
        })}
      </div>
      {picked && (
        <div className="space-y-2">
          <p className={`text-center text-sm font-bold ${correct ? 'text-emerald-700' : 'text-rose-700'}`}>
            {correct ? `أَحْسَنْتَ! ${item.shown}` : `جَرِّبْ مَرَّةً أُخْرَى. الصَّوَابُ: ${item.shown}`}
          </p>
          <button
            type="button"
            onClick={next}
            className="w-full min-h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-3xl cursor-pointer"
          >
            التَّالِي
          </button>
        </div>
      )}
    </div>
  );
};

interface GrammarWord {
  id: string;
  word: string;
  correctTag: string; // e.g., 'فعل', 'فاعل', 'مفعول به', 'صفة', 'اسم مجرور', 'مبتدأ', 'خبر'
  hint: string;
}

export const ArabicCanvasInteractive: React.FC<ArabicCanvasInteractiveProps> = ({
  lesson,
  grade = '4AP'
}) => {
  const is1AP = (lesson?.grade || grade) === '1AP';
  const isHarakatLesson = !!lesson?.id?.includes('harakat');
  const prefersDiacritics = arabicCanvasPrefersDiacritics(lesson?.id || '', lesson?.grade || grade);
  // Canvas State for Free Drawing / Writing
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [penColor, setPenColor] = useState<string>('#10b981'); // Emerald default
  const [penSize, setPenSize] = useState<number>(4);
  const [isEraser, setIsEraser] = useState<boolean>(false);

  const [activeSubTab, setActiveSubTab] = useState<'drawing' | 'grammar_analysis' | 'diacritics'>(
    is1AP ? (isHarakatLesson ? 'diacritics' : 'drawing') : prefersDiacritics ? 'diacritics' : 'grammar_analysis',
  );

  // Grammar Analysis State
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [userGrammarTags, setUserGrammarTags] = useState<Record<string, string>>({});
  const [isGrammarChecked, setIsGrammarChecked] = useState<boolean>(false);

  // Custom sentences generated for the active lesson / grade
  const getLessonGrammarData = (): { sentence: string; words: GrammarWord[] } => {
    if (lesson?.irabTableAr && lesson.irabTableAr.length > 0) {
      return {
        sentence: lesson.irabTableAr.map((row) => row.wordAr).join(' '),
        words: lesson.irabTableAr.map((row, i) => ({
          id: `w${i + 1}`,
          word: row.wordAr,
          correctTag: row.analysisAr,
          hint: row.analysisAr,
        })),
      };
    }
    if (lesson?.id && ARABIC_CANVAS_BY_LESSON[lesson.id]) {
      return ARABIC_CANVAS_BY_LESSON[lesson.id];
    }
    if ((lesson?.grade || grade) === '2AP') {
      return ARABIC_CANVAS_2AP_DEFAULT;
    }
    if (lesson?.id?.includes('arabic-4ap') || grade === '4AP') {
      return {
        sentence: 'يَقْرَأُ الطَّالِبُ المَاهِرُ الكِتَابَ القَيِّمَ فِي المَكْتَبَةِ',
        words: [
          { id: 'w1', word: 'يَقْرَأُ', correctTag: 'فعل مضارع', hint: 'يدل على حدث وقع في الزمن الحاضر أو المستقبل ويقبل السين' },
          { id: 'w2', word: 'الطَّالِبُ', correctTag: 'فاعل', hint: 'اسم مرفوع يدل على من قام بالفعل (من يقرأ؟)' },
          { id: 'w3', word: 'المَاهِرُ', correctTag: 'صفة (نعت)', hint: 'تتبع الموصوف في الحركة والتعريف والتذكير' },
          { id: 'w4', word: 'الكِتَابَ', correctTag: 'مفعول به', hint: 'اسم منصوب وقع عليه فعل الفاعل (ماذا يقرأ؟)' },
          { id: 'w5', word: 'القَيِّمَ', correctTag: 'صفة (نعت)', hint: 'تصف الكتاب وتتبعه في الحركة والتعريف' },
          { id: 'w6', word: 'فِي', correctTag: 'حرف جر', hint: 'حرف مبني يجر الاسم الذي بعده' },
          { id: 'w7', word: 'المَكْتَبَةِ', correctTag: 'اسم مجرور', hint: 'اسم كسرت آخره بسب حرف الجر "في"' }
        ]
      };
    }

    return {
      sentence: 'يُدَافِعُ الجُنُودُ البُسَلاءُ عَنِ الوَطَنِ العَزِيزِ بِشَجَاعَةٍ',
      words: [
        { id: 'w1', word: 'يُدَافِعُ', correctTag: 'فعل مضارع', hint: 'فعل مرفوع وعلامة رفعه الضمة الظاهرة' },
        { id: 'w2', word: 'الجُنُودُ', correctTag: 'فاعل', hint: 'من يقوم بالدفاع؟ فاعل مرفوع بالضمة' },
        { id: 'w3', word: 'البُسَلاءُ', correctTag: 'صفة (نعت)', hint: 'صفة مرفوعة تتبع الجنود' },
        { id: 'w4', word: 'عَنِ', correctTag: 'حرف جر', hint: 'حرف جر مبني' },
        { id: 'w5', word: 'الوَطَنِ', correctTag: 'اسم مجرور', hint: 'اسم مجرور بـ "عن" وعلامة جره الكسرة' },
        { id: 'w6', word: 'العَزِيزِ', correctTag: 'صفة (نعت)', hint: 'صفة تتبع الوطن في الكسرة والتعريف' },
        { id: 'w7', word: 'بِشَجَاعَةٍ', correctTag: 'جار ومجرور', hint: 'الباء حرف جر، وشجاعة اسم مجرور بالكسرة' }
      ]
    };
  };

  const grammarData = getLessonGrammarData();
  const gradeKey = lesson?.grade || grade;
  const baseTags =
    gradeKey === '2AP'
      ? ['اسم', 'فعل', 'حرف']
      : [
          'فعل ماضٍ',
          'فعل مضارع',
          'فعل أمر',
          'فاعل',
          'مفعول به',
          'صفة (نعت)',
          'مبتدأ',
          'خبر',
          'حرف جر',
          'اسم مجرور',
          'جار ومجرور',
          'حرف عطف',
        ];
  const availableTags = [...new Set([...baseTags, ...grammarData.words.map((w) => w.correctTag)])];

  // Setup Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI crispness
    canvas.width = canvas.parentElement?.clientWidth || 600;
    canvas.height = 280;

    // Initial canvas background
    ctx.fillStyle = '#1e293b'; // Dark Slate background for contrast
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw lines like a notebook
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let y = 40; y < canvas.height; y += 35) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }, [activeSubTab]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    if (isEraser) {
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = penSize * 4;
    } else {
      ctx.strokeStyle = penColor;
      ctx.lineWidth = penSize;
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let y = 40; y < canvas.height; y += 35) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  };

  const handleTagAssign = (tag: string) => {
    if (!selectedWordId) return;
    setUserGrammarTags((prev) => ({
      ...prev,
      [selectedWordId]: tag
    }));
    setIsGrammarChecked(false);
  };

  const calculateGrammarScore = (): number => {
    let count = 0;
    grammarData.words.forEach((w) => {
      if (userGrammarTags[w.id] === w.correctTag) {
        count++;
      }
    });
    return count;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-md space-y-6 dir-rtl" dir="rtl">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-slate-900 text-white rounded-2xl p-5 shadow-sm border border-emerald-700/50 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-2xl shadow-sm">
            🎨
          </div>
          <div>
            <h3 className="font-extrabold text-base sm:text-lg flex items-center gap-2">
              <span>{is1AP ? 'لَوْحَةُ التَّشْكِيلِ وَالكِتَابَةِ' : 'لوحة الكتابة والتحليل التفاعلية للغة العربية'}</span>
              <span className="text-xs bg-amber-300 text-slate-950 font-black px-2.5 py-0.5 rounded-md">
                {lesson?.grade || grade}
              </span>
            </h3>
            <p className="text-xs text-emerald-200 font-sans mt-0.5">
              درس: {lesson?.titleAr || 'اللغة العربية والتحليل النحوي'}
            </p>
          </div>
        </div>

        <span className="bg-white/10 text-emerald-100 text-xs font-extrabold px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>أداة مخصصة لهذا الدرس</span>
        </span>
      </div>

      {/* Mode Sub-Tabs */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold overflow-x-auto">
        {(is1AP || prefersDiacritics) && (
        <button
          onClick={() => setActiveSubTab('diacritics')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'diacritics'
              ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>التَّشْكِيلُ: َ ُ ِ ْ</span>
        </button>
        )}

        {!is1AP && (
        <button
          onClick={() => setActiveSubTab('grammar_analysis')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'grammar_analysis'
              ? 'bg-emerald-600 text-white font-extrabold shadow-sm'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>محلل الإعراب والتراكيب ({grammarData.words.length} كلمات)</span>
        </button>
        )}

        <button
          onClick={() => setActiveSubTab('drawing')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSubTab === 'drawing'
              ? 'bg-indigo-600 text-white font-extrabold shadow-sm'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <PenTool className="w-4 h-4" />
          <span>{is1AP ? 'أَكْتُبُ الحَرْفَ' : 'اللوحة التفاعلية للرسم والإملاء'}</span>
        </button>
      </div>

      {(is1AP || prefersDiacritics) && activeSubTab === 'diacritics' && <TashkilPractice />}

      {/* VIEW 1: GRAMMAR ANALYSIS (محلل الإعراب والتراكيب) */}
      {activeSubTab === 'grammar_analysis' && !is1AP && (
        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
            <span className="text-xs font-bold text-slate-500 block">الجملة المقررة للتحليل:</span>
            <div className="text-base sm:text-xl font-black text-slate-900 font-serif leading-relaxed bg-white p-4 rounded-xl border border-slate-300 text-center shadow-xs">
              "{grammarData.sentence}"
            </div>
            <p className="text-xs text-slate-600 font-sans">
              💡 اضغط على كل كلمة في الأسفل ثم اختر وظيفتها النحوية السليمة من البطاقات.
            </p>
          </div>

          {/* Interactive Words Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {grammarData.words.map((w) => {
              const isSelected = selectedWordId === w.id;
              const assignedTag = userGrammarTags[w.id];
              const isCorrect = isGrammarChecked && assignedTag === w.correctTag;
              const isWrong = isGrammarChecked && assignedTag && assignedTag !== w.correctTag;

              let cardStyle = 'bg-white border-slate-200 hover:border-emerald-400';
              if (isSelected) {
                cardStyle = 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-300';
              }
              if (isGrammarChecked) {
                if (isCorrect) cardStyle = 'bg-emerald-100 border-emerald-600 text-emerald-900';
                else if (isWrong) cardStyle = 'bg-rose-100 border-rose-500 text-rose-900';
              }

              return (
                <div
                  key={w.id}
                  onClick={() => setSelectedWordId(w.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 relative ${cardStyle}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900">{w.word}</span>
                    {assignedTag && (
                      <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-md">
                        {assignedTag}
                      </span>
                    )}
                  </div>

                  {isGrammarChecked && (
                    <div className="text-[10px] font-extrabold flex items-center gap-1">
                      {isCorrect ? (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> صحيح!
                        </span>
                      ) : (
                        <span className="text-rose-700">
                          الإجابة: {w.correctTag}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Grammatical Tag Selector */}
          {selectedWordId && (
            <div className="bg-emerald-950 text-white p-5 rounded-2xl border border-emerald-800 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-300">
                  حدد الموقع الاعرابي للكلمة: "
                  {grammarData.words.find((w) => w.id === selectedWordId)?.word}"
                </span>
                <span className="text-[11px] text-emerald-200 font-sans">
                  💡 تلميح: {grammarData.words.find((w) => w.id === selectedWordId)?.hint}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => {
                  const isAssigned = userGrammarTags[selectedWordId] === tag;
                  return (
                    <button
                      key={tag}
                      onClick={() => handleTagAssign(tag)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        isAssigned
                          ? 'bg-amber-400 text-slate-950 font-black shadow-md scale-105'
                          : 'bg-emerald-900/80 text-emerald-100 hover:bg-emerald-800 border border-emerald-700/60'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Verify Action Button */}
          <div className="flex items-center justify-between border-t border-slate-200 pt-4">
            {!isGrammarChecked ? (
              <button
                onClick={() => setIsGrammarChecked(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-6 py-3 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>تحقق من التحليل النحوي وإظهار النتيجة</span>
              </button>
            ) : (
              <div className="flex items-center justify-between w-full bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                <div className="flex items-center gap-2 text-xs font-black text-emerald-900">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>
                    النتيجة: {calculateGrammarScore()} من {grammarData.words.length} صحيحة! (+
                    {calculateGrammarScore() * 10} XP)
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsGrammarChecked(false);
                    setUserGrammarTags({});
                  }}
                  className="text-xs font-bold text-emerald-800 bg-white border border-emerald-300 px-4 py-2 rounded-xl hover:bg-emerald-100"
                >
                  إعادة المحاولة
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: INTERACTIVE DIGITAL WHITEBOARD / CANVAS (اللوحة التفاعلية للرسم والإملاء) */}
      {activeSubTab === 'drawing' && (
        <div className="space-y-4">
          {/* Controls toolbar */}
          <div className="flex items-center justify-between flex-wrap gap-3 bg-slate-900 text-white p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300">اللون:</span>
              {['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#ffffff'].map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setPenColor(color);
                    setIsEraser(false);
                  }}
                  className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                    penColor === color && !isEraser ? 'scale-125 border-amber-400 ring-2 ring-amber-300' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300">الحجم:</span>
              {[2, 4, 8].map((size) => (
                <button
                  key={size}
                  onClick={() => setPenSize(size)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-extrabold cursor-pointer ${
                    penSize === size ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {size === 2 ? 'رقيق' : size === 4 ? 'متوسط' : 'عريض'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEraser(!isEraser)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isEraser ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Eraser className="w-4 h-4" />
                <span>ممحاة</span>
              </button>

              <button
                onClick={clearCanvas}
                className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>مسح اللوحة</span>
              </button>
            </div>
          </div>

          {/* Canvas Component */}
          <div className="relative border-2 border-slate-800 rounded-2xl overflow-hidden bg-slate-900 shadow-inner">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-72 cursor-crosshair touch-none"
            />
            <div className="absolute bottom-3 right-3 text-[11px] bg-black/60 text-slate-300 px-3 py-1 rounded-full border border-white/10 pointer-events-none">
              ✍️ استخدم الإصبع أو الفأرة للكتابة والتشكيل على الكرّاس التفاعلي
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
