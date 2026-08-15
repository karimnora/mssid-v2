import React, { useState } from 'react';
import {
  BookOpen,
  Printer,
  Sparkles,
  Volume2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Search,
  Layers,
  HelpCircle,
  FileText,
  Award,
  Gamepad2,
  PenTool,
  Trophy,
} from 'lucide-react';
import { TAMAZIGHT_4AP } from '../data/courses/4AP/tamazight';
import { TAMAZIGHT_5AP } from '../data/courses/5AP/tamazight';
import { CourseLesson, PrimaryGrade } from '../types';

interface TamazightCurriculumViewerProps {
  grade?: PrimaryGrade;
  onOpenLab?: () => void;
  onBack?: () => void;
  onReward?: (coins: number, xp: number) => void;
}

export const TamazightCurriculumViewer: React.FC<TamazightCurriculumViewerProps> = ({
  grade = '4AP',
  onOpenLab,
  onBack,
  onReward,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<'4AP' | '5AP'>(
    grade === '5AP' ? '5AP' : '4AP'
  );
  const [selectedTrimester, setSelectedTrimester] = useState<1 | 2 | 3 | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'lesson' | 'tifinagh_keyboard' | 'quiz'>('lesson');

  // Transliteration state
  const [transliterationInput, setTransliterationInput] = useState('azul fell-awen');

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);

  const lessons: CourseLesson[] = selectedGrade === '4AP' ? TAMAZIGHT_4AP : TAMAZIGHT_5AP;

  // Filter lessons
  const filteredLessons = lessons.filter((lesson) => {
    const matchesTrimester =
      selectedTrimester === 'all' || lesson.trimester === selectedTrimester;
    const matchesSearch =
      !searchQuery ||
      lesson.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.summaryAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lesson.categoryAr && lesson.categoryAr.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTrimester && matchesSearch;
  });

  const currentLesson =
    lessons.find((l) => l.id === selectedLessonId) || filteredLessons[0] || lessons[0];

  // Sound pronunciation helper
  const speakTamazight = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.lang = 'fr-FR'; // fallback for latinized tamazight
      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore
    }
  };

  // Simple Latin to Tifinagh converter mapping
  const latinToTifinaghMap: Record<string, string> = {
    a: 'ⴰ',
    b: 'ⴱ',
    g: 'ⴳ',
    d: 'ⴷ',
    ḍ: 'ⴹ',
    e: 'ⴻ',
    f: 'ⴼ',
    k: 'ⴽ',
    h: 'ⵀ',
    ḥ: 'ⵃ',
    i: 'ⵉ',
    j: 'ⵊ',
    l: 'ⵍ',
    m: 'ⵎ',
    n: 'ⵏ',
    u: 'ⵓ',
    r: 'ⵔ',
    ṛ: 'ⵕ',
    s: 'ⵙ',
    ṣ: 'ⵚ',
    t: 'ⵜ',
    ṭ: 'ⵟ',
    w: 'ⵡ',
    y: 'ⵢ',
    z: 'ⵣ',
    ẓ: 'ⵥ',
    x: 'ⵅ',
    c: 'ⵛ',
    q: 'ⵇ',
    ɣ: 'ⵖ',
    gh: 'ⵖ',
    ch: 'ⵛ',
  };

  const convertToTifinagh = (text: string): string => {
    let res = '';
    const lower = text.toLowerCase();
    for (let i = 0; i < lower.length; i++) {
      // 2 char combos
      if (i + 1 < lower.length && latinToTifinaghMap[lower.substring(i, i + 2)]) {
        res += latinToTifinaghMap[lower.substring(i, i + 2)];
        i++;
      } else if (latinToTifinaghMap[lower[i]]) {
        res += latinToTifinaghMap[lower[i]];
      } else {
        res += lower[i];
      }
    }
    return res;
  };

  // Official Ministry A4 Printable Exam Generator
  const handlePrintMinistryExam = () => {
    if (typeof window === 'undefined') return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <title>امتحان رسمي في اللغة الأمازيغية - ${selectedGrade}</title>
        <style>
          @page { size: A4 portrait; margin: 12mm; }
          body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; line-height: 1.5; font-size: 13px; }
          .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 8px; margin-bottom: 12px; }
          .republic { font-size: 14px; font-weight: bold; }
          .ministry { font-size: 12px; color: #475569; font-weight: bold; }
          .meta-bar { display: flex; justify-content: space-between; font-size: 11px; font-weight: bold; padding-top: 6px; }
          .title-box { display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px 14px; margin-bottom: 15px; }
          .exercise { margin-bottom: 16px; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; }
          .ex-head { display: flex; justify-content: space-between; font-weight: bold; color: #1e3a8a; border-bottom: 1px dashed #cbd5e1; padding-bottom: 4px; margin-bottom: 8px; }
          .tifinagh-text { font-size: 18px; font-weight: bold; color: #0369a1; letter-spacing: 1px; }
          .points { background: #0f172a; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="republic">الجمهورية الجزائرية الديمقراطية الشعبية</div>
          <div class="ministry">وزارة التربية الوطنية — مديرية التعليم الابتدائي</div>
          <div class="meta-bar">
            <span>المدرسة الابتدائية: .......................................</span>
            <span>المستوى: ${selectedGrade} ابتدائي (اللغة الأمازيغية)</span>
            <span>السنة الدراسية: 2025 / 2026</span>
          </div>
        </div>

        <div class="title-box">
          <div>
            <div style="font-size: 15px; font-weight: bold; color: #0f172a;">
              تقويم الكفاءات والفصل الدراسي — مادة اللغة الأمازيغية (Tutlayt Tamaziɣt / ⵜⵓⵜⵍⴰⵢⵜ ⵜⴰⵎⴰⵣⵉⵖⵜ)
            </div>
            <div style="font-size: 12px; color: #64748b;">المحور: ${currentLesson.titleAr}</div>
          </div>
          <div style="text-align: right; border: 1px solid #cbd5e1; background: white; padding: 6px 12px; border-radius: 6px;">
            <div>اسم التلميذ(ة): ...............................</div>
            <div style="margin-top: 4px; font-weight: bold;">العلامة: ......... / 10</div>
          </div>
        </div>

        <!-- Exercise 1 -->
        <div class="exercise">
          <div class="ex-head">
            <span>التمرين الأول: قراءة وتحويل خط التيفيناغ إلى اللاتينية والعربية (Tira d Tɣuri)</span>
            <span class="points">03 نقاط</span>
          </div>
          <p>اربط بسهم بين الكلمة بحروف التيفيناغ، وقراءتها باللاتينية ومعناها العربي:</p>
          <div style="display: flex; justify-content: space-around; margin-top: 10px; font-size: 14px;">
            <div style="line-height: 2.2;">
              <div>1. <span class="tifinagh-text">ⴰⴳⴻⵍⵍⵉⴷ</span> (Agellid)</div>
              <div>2. <span class="tifinagh-text">ⵜⴰⴷⴷⴰⵔⵜ</span> (Taddart)</div>
              <div>3. <span class="tifinagh-text">ⴰⵎⴰⵣⵉⵖ</span> (Amaziɣ)</div>
              <div>4. <span class="tifinagh-text">ⴰⵡⵔⵖ</span> (Awrɣ)</div>
            </div>
            <div style="line-height: 2.2; color: #475569;">
              <div>• القرية والدشرة الأصيلة</div>
              <div>• الملك والقائد التاريخي</div>
              <div>• الفنك الذهبي الصغير</div>
              <div>• الإنسان الحر الأصيل</div>
            </div>
          </div>
        </div>

        <!-- Exercise 2 -->
        <div class="exercise">
          <div class="ex-head">
            <span>التمرين الثاني: تراكيب وقواعد لغوية — التأنيث والتثنية (Taseddast)</span>
            <span class="points">03.5 نقاط</span>
          </div>
          <p>حوّل الأسماء التالية من المذكر إلى المؤنث بإضافة حرفي (ⵜ ... ⵜ):</p>
          <div style="margin-top: 10px; line-height: 2;">
            <div>1. <strong>Argaz</strong> (رجل) ➔ ..................................................... (Tamegert / Tameṭṭut)</div>
            <div>2. <strong>Axxam</strong> (منزل / دار) ➔ ..................................................... (Taxxamt)</div>
            <div>3. <strong>Amcic</strong> (قط) ➔ ..................................................... (Tamcict)</div>
          </div>
        </div>

        <!-- Exercise 3 -->
        <div class="exercise">
          <div class="ex-head">
            <span>التمرين الثالث: التعبير والإنتاج الكتابي التراثي (Afares s Tira)</span>
            <span class="points">03.5 نقاط</span>
          </div>
          <p>اكتب فقرة قصيرة من 3 أسطر باللغة الأمازيغية (أو بخط التيفيناغ) تصف فيها عائلة ديدو الفنك في واحة تاغيت أو ثلوج جرجرة:</p>
          <div style="margin-top: 15px; border-bottom: 1px dotted #94a3b8; height: 25px;"></div>
          <div style="margin-top: 15px; border-bottom: 1px dotted #94a3b8; height: 25px;"></div>
          <div style="margin-top: 15px; border-bottom: 1px dotted #94a3b8; height: 25px;"></div>
        </div>

        <div style="text-align: center; margin-top: 20px; font-size: 11px; color: #64748b;">
          🇩🇿 مَسِيدُ الجَزَائِر — Afus deg ufus i lmend n tmusni (يداً بيد من أجل العلم والمعرفة)
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 300);
  };

  const handleQuizOptionSelect = (qId: string, optId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optId }));
  };

  const handleGradeQuiz = () => {
    if (!currentLesson.quiz) return;
    setSubmittedQuiz(true);
    let correctCount = 0;
    currentLesson.quiz.forEach((q) => {
      const correctOpt = q.options.find((o) => o.isCorrect);
      if (correctOpt && selectedAnswers[q.id] === correctOpt.id) {
        correctCount++;
      }
    });

    if (correctCount === currentLesson.quiz.length && onReward) {
      onReward(25, 30);
    }
  };

  return (
    <div className="space-y-6 dir-rtl" dir="rtl">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-amber-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-amber-400/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black">
              <span>ⵣ</span>
              <span>المنهاج البيداغوجي للغة الأمازيغية (Aselmed n Tmaziɣt)</span>
              <span>•</span>
              <span className="bg-amber-400 text-amber-950 px-2 py-0.5 rounded-md font-mono">{selectedGrade}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
              دروس وقواعد وخط التيفيناغ الرسمي (4AP & 5AP)
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
              تصفح الدروس المعتمدة من وزارة التربية الوطنية مع النطق الصوتي، البطاقات المعجمية، القواعد النحوية، ومولّد الفروض الرسمية A4.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              onClick={handlePrintMinistryExam}
              className="px-4 py-2.5 rounded-2xl bg-white text-emerald-950 hover:bg-emerald-50 font-black text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
              title="طباعة فرض المراقبة المستمرة A4 بالتيفيناغ"
            >
              <Printer className="w-4 h-4 text-emerald-700" />
              <span>🖨️ طباعة الفرض A4</span>
            </button>

            {onOpenLab && (
              <button
                onClick={onOpenLab}
                className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-black text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>مختبر الألعاب ⵣ</span>
              </button>
            )}

            {onBack && (
              <button
                onClick={onBack}
                className="px-3.5 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>العودة</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter & Selector Bar */}
      <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Level Switcher: 4AP / 5AP */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-[var(--app-text-muted)] shrink-0">المستوى:</span>
            <div className="grid grid-cols-2 gap-1.5 bg-[var(--app-card-subtle)] p-1 rounded-xl w-full sm:w-auto">
              <button
                onClick={() => setSelectedGrade('4AP')}
                className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  selectedGrade === '4AP'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
                }`}
              >
                4AP — الرابعة ابتدائي
              </button>
              <button
                onClick={() => setSelectedGrade('5AP')}
                className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  selectedGrade === '5AP'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
                }`}
              >
                5AP — الخامسة ابتدائي
              </button>
            </div>
          </div>

          {/* Trimester Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-[var(--app-text-muted)] shrink-0 hidden md:inline">الفصل:</span>
            {[
              { id: 'all', label: 'جميع الفصول' },
              { id: 1, label: 'الفصل 1' },
              { id: 2, label: 'الفصل 2' },
              { id: 3, label: 'الفصل 3' },
            ].map((trim) => (
              <button
                key={trim.id}
                onClick={() => setSelectedTrimester(trim.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedTrimester === trim.id
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:bg-slate-200/50'
                }`}
              >
                {trim.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Counter */}
        <div className="relative">
          <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن درس، قاعدة، كلمة تيفيناغ أو مشروع..."
            className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-[var(--app-card-subtle)] border border-[var(--app-card-border)] text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Main Workspace Layout (Sidebar + Content View) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar: Lesson List (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black text-[var(--app-text-muted)]">
              قائمة الدروس والمشاريع ({filteredLessons.length})
            </span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredLessons.map((lesson) => {
              const isSelected = lesson.id === currentLesson.id;
              return (
                <button
                  key={lesson.id}
                  onClick={() => {
                    setSelectedLessonId(lesson.id);
                    setSubmittedQuiz(false);
                    setSelectedAnswers({});
                  }}
                  className={`w-full text-right p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 shadow-md ring-1 ring-emerald-400'
                      : 'bg-[var(--app-card-bg)] border-[var(--app-card-border)] hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200">
                      الفصل {lesson.trimester || 1}
                    </span>
                    {lesson.categoryAr && (
                      <span className="text-[10px] font-bold text-slate-400 truncate max-w-[140px]">
                        {lesson.categoryAr}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-black text-[var(--app-text)] leading-snug">
                    {lesson.titleAr}
                  </h4>
                  <p className="text-[11px] text-[var(--app-text-muted)] line-clamp-2 leading-relaxed">
                    {lesson.summaryAr}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Viewer (8 Cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Tabs: Lesson Explanation / Tifinagh Transliteration / Quiz */}
          <div className="flex items-center gap-2 border-b border-[var(--app-card-border)] pb-3">
            <button
              onClick={() => setActiveTab('lesson')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'lesson'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>تفاصيل الدرس والقواعد</span>
            </button>

            <button
              onClick={() => setActiveTab('tifinagh_keyboard')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'tifinagh_keyboard'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)]'
              }`}
            >
              <PenTool className="w-4 h-4" />
              <span>لوحة التيفيناغ والمحول اللحظي</span>
            </button>

            {currentLesson.quiz && (
              <button
                onClick={() => setActiveTab('quiz')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'quiz'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)]'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>التقويم والتمارين ({currentLesson.quiz.length})</span>
              </button>
            )}
          </div>

          {/* TAB 1: LESSON EXPLANATION */}
          {activeTab === 'lesson' && (
            <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-6 space-y-6 shadow-xs">
              {/* Title & Speech */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--app-card-border)]">
                <div>
                  <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md mb-2 inline-block">
                    {currentLesson.categoryAr || 'الوحدة التعليمية'}
                  </span>
                  <h2 className="text-xl font-black text-[var(--app-text)] leading-snug">
                    {currentLesson.titleAr}
                  </h2>
                </div>
                <button
                  onClick={() => speakTamazight(currentLesson.titleAr)}
                  className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 hover:scale-105 transition-transform cursor-pointer"
                  title="استمع لنطق العنوان"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {/* Lesson Objectives */}
              {currentLesson.objectivesAr && (
                <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 space-y-2">
                  <h4 className="text-xs font-black text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>الكفاءات المستهدفة (الأهداف التعلمية):</span>
                  </h4>
                  <ul className="space-y-1 pr-6 list-disc text-xs text-emerald-950 dark:text-emerald-100 leading-relaxed font-bold">
                    {currentLesson.objectivesAr.map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Detailed Content & Intro */}
              {currentLesson.detailedCourse?.introAr && (
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-[var(--app-text)]">💡 تمهيد ومدخل بيداغوجي:</h4>
                  <p className="text-xs text-[var(--app-text-muted)] leading-relaxed font-bold bg-[var(--app-card-subtle)] p-4 rounded-2xl">
                    {currentLesson.detailedCourse.introAr}
                  </p>
                </div>
              )}

              {/* Vocabulary Glossary with Tifinagh & Latin */}
              {currentLesson.detailedCourse?.vocabulary && currentLesson.detailedCourse.vocabulary.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-[var(--app-text)] flex items-center gap-2">
                    <span>📚 المعجم والكلمات التراثية (Amawal):</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentLesson.detailedCourse.vocabulary.map((voc, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 flex flex-col justify-between gap-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-black text-sm text-amber-900 dark:text-amber-200">
                            {voc.termAr}
                          </span>
                          <button
                            onClick={() => speakTamazight(voc.termAr)}
                            className="p-1 rounded-md text-amber-700 hover:bg-amber-200/50 cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-xs font-bold text-amber-950/80 dark:text-amber-100">
                          {voc.definitionAr}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rules & Syntactic Formulas */}
              {currentLesson.rulesAr && (
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-[var(--app-text)]">📜 القواعد النحوية والتركيبية (Taseddast):</h4>
                  <div className="space-y-2">
                    {currentLesson.rulesAr.map((rule, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 text-xs font-bold text-blue-950 dark:text-blue-200 flex items-start gap-2.5"
                      >
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Formulas */}
              {currentLesson.keyFormulas && currentLesson.keyFormulas.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-[var(--app-text)]">⭐ قواعد التحويل والصرف:</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {currentLesson.keyFormulas.map((f, i) => (
                      <div
                        key={i}
                        className="p-3 bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900 rounded-2xl text-xs"
                      >
                        <div className="font-black text-indigo-900 dark:text-indigo-300 mb-1">{f.labelAr}</div>
                        <div className="font-mono font-bold text-indigo-950 dark:text-indigo-100 text-xs sm:text-sm bg-white/70 dark:bg-slate-900/60 p-2 rounded-xl border border-indigo-100 dark:border-indigo-800">
                          {f.formulaAr}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TIFINAGH KEYBOARD & TRANSLITERATION PLAYGROUND */}
          {activeTab === 'tifinagh_keyboard' && (
            <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-6 space-y-5 shadow-xs">
              <div>
                <h3 className="text-base font-black text-[var(--app-text)]">
                  ⌨️ لوحة تحويل الحروف اللاتينية إلى خط التيفيناغ الأصيل (Abeddel n Tira)
                </h3>
                <p className="text-xs text-[var(--app-text-muted)] font-bold mt-1">
                  اكتب باللاتينية (مثل: azul, taddart, amazigh, tafukt) لتظهر لك مباشرة بالخط التيفيناغي الهندسي.
                </p>
              </div>

              {/* Input Latin */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--app-text-muted)]">النص اللاتيني (Tira s Tlatinit) :</label>
                <input
                  type="text"
                  value={transliterationInput}
                  onChange={(e) => setTransliterationInput(e.target.value)}
                  placeholder="اكتب هنا باللاتينية..."
                  className="w-full p-3 rounded-2xl bg-[var(--app-card-subtle)] border border-[var(--app-card-border)] text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Output Tifinagh Box */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-900 dark:to-amber-950/30 border-2 border-amber-300 dark:border-amber-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-900 dark:text-amber-200">
                    النتيجة بالخط التيفيناغي المعتمد (Tifinaɣ) :
                  </span>
                  <button
                    onClick={() => speakTamazight(transliterationInput)}
                    className="p-2 rounded-xl bg-amber-200 text-amber-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>نطق</span>
                  </button>
                </div>

                <div className="text-3xl sm:text-4xl md:text-5xl font-black text-amber-900 dark:text-amber-100 tracking-wider text-center py-4 select-all">
                  {convertToTifinagh(transliterationInput) || '...'}
                </div>
              </div>

              {/* Tifinagh Quick Char Grid */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[var(--app-text-muted)]">أبجدية التيفيناغ السريعة (انقر للإضافة):</span>
                <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5">
                  {Object.entries(latinToTifinaghMap)
                    .filter(([k]) => k.length === 1)
                    .map(([lat, tif]) => (
                      <button
                        key={lat}
                        onClick={() => setTransliterationInput((prev) => prev + lat)}
                        className="p-2 rounded-xl bg-[var(--app-card-subtle)] hover:bg-amber-100 border border-[var(--app-card-border)] text-center transition-all cursor-pointer"
                      >
                        <div className="text-lg font-black text-amber-950 dark:text-amber-200">{tif}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{lat}</div>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: QUIZ & PRACTICE */}
          {activeTab === 'quiz' && currentLesson.quiz && (
            <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-6 space-y-6 shadow-xs">
              <div>
                <h3 className="text-base font-black text-[var(--app-text)] flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>تمارين الفهم والتقويم التكويني ({currentLesson.titleAr})</span>
                </h3>
                <p className="text-xs text-[var(--app-text-muted)] font-bold mt-1">
                  أجب عن الأسئلة بدقة للحصول على تقييم 10/10 وربح الدنانير الذهبية 🪙.
                </p>
              </div>

              <div className="space-y-5">
                {currentLesson.quiz.map((q, qIdx) => {
                  const isAnswered = !!selectedAnswers[q.id];
                  return (
                    <div
                      key={q.id}
                      className="p-4 rounded-2xl border border-[var(--app-card-border)] bg-[var(--app-card-subtle)] space-y-3"
                    >
                      <div className="flex items-center gap-2 font-black text-xs text-[var(--app-text)]">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                          {qIdx + 1}
                        </span>
                        <span>{q.questionAr}</span>
                      </div>

                      <div className="space-y-2 pr-6">
                        {q.options.map((opt) => {
                          const isSelected = selectedAnswers[q.id] === opt.id;
                          let optStyle =
                            'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-[var(--app-text)]';
                          if (submittedQuiz) {
                            if (opt.isCorrect) {
                              optStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                            } else if (isSelected && !opt.isCorrect) {
                              optStyle = 'bg-rose-100 border-rose-500 text-rose-950';
                            }
                          } else if (isSelected) {
                            optStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-300';
                          }

                          return (
                            <button
                              key={opt.id}
                              disabled={submittedQuiz}
                              onClick={() => handleQuizOptionSelect(q.id, opt.id)}
                              className={`w-full text-right p-3 rounded-xl border text-xs transition-all cursor-pointer ${optStyle}`}
                            >
                              {opt.textAr}
                            </button>
                          );
                        })}
                      </div>

                      {submittedQuiz && (
                        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                          {q.options.find((o) => o.isCorrect)?.explanationAr || 'إجابة نموذجية صحيحة!'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {!submittedQuiz ? (
                <button
                  onClick={handleGradeQuiz}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تأكيد الإجابات وتصحيح التمرين</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSubmittedQuiz(false);
                    setSelectedAnswers({});
                  }}
                  className="w-full py-3.5 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-black text-xs transition-all cursor-pointer"
                >
                  إعادة المحاولة من جديد
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
