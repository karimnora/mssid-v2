import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { speakText as speakTextShared } from '../utils/speech';
import {
  FlaskConical,
  Sun,
  Droplets,
  Thermometer,
  Wind,
  Compass,
  CheckCircle,
  XCircle,
  HelpCircle,
  Volume2,
  Award,
  Sparkles,
  Play,
  RotateCcw,
  Zap,
  Leaf,
  Layers,
  Flame,
  Waves,
} from 'lucide-react';
import { AuthService } from '../services/authService';
import { FoggaraHydraulicLab } from './science/FoggaraHydraulicLab';
import { SolarOasisPumpLab } from './science/SolarOasisPumpLab';
import { DensityChottLab } from './science/DensityChottLab';

interface ScienceExperimentLabProps {
  onBack?: () => void;
  grade?: string;
  onReward?: (coins: number, xp: number) => void;
}

export const ScienceExperimentLab: React.FC<ScienceExperimentLabProps> = ({
  onBack,
  grade = '4AP',
  onReward,
}) => {
  const [activeTab, setActiveTab] = useState<
    'foggara' | 'solar_pump' | 'density_chott' | 'water_cycle' | 'plant_growth' | 'compass' | 'quiz'
  >('foggara');

  // ==========================================
  // --- 1. WATER STATES & CYCLE SIMULATION ---
  // ==========================================
  const [temperature, setTemperature] = useState<number>(25); // Celsius
  const [waterPhase, setWaterPhase] = useState<'solid' | 'liquid' | 'gas'>('liquid');

  const handleTempChange = (newTemp: number) => {
    setTemperature(newTemp);
    if (newTemp <= 0) {
      setWaterPhase('solid');
    } else if (newTemp >= 100) {
      setWaterPhase('gas');
    } else {
      setWaterPhase('liquid');
    }
  };

  // ==========================================
  // --- 2. PLANT GERMINATION & GROWTH LAB ---
  // ==========================================
  const [hasWater, setHasWater] = useState(true);
  const [hasLight, setHasLight] = useState(true);
  const [hasAir, setHasAir] = useState(true);
  const [plantDay, setPlantDay] = useState(1);
  const [plantFeedback, setPlantFeedback] = useState<string | null>(null);

  const canGrow = hasWater && hasLight && hasAir;

  const handleAdvanceDay = () => {
    if (!hasWater) {
      setPlantFeedback('⚠️ النبتة ذبلت وجفت لعدم وجود الماء! الماء ضروري لإنتاش البذرة ونمو النبات.');
      return;
    }
    if (!hasLight) {
      setPlantFeedback('⚠️ النبتة صفراء وشاحبة بسبب غياب ضوء الشمس! الضوء ضروري لعملية التركيب الضوئي.');
      return;
    }
    if (!hasAir) {
      setPlantFeedback('⚠️ النبتة اختنقت لعدم وجود الهواء! النبات كائن حي يتنفس كالإنسان.');
      return;
    }

    if (plantDay < 5) {
      const next = plantDay + 1;
      setPlantDay(next);
      setPlantFeedback(null);
      if (next === 5) {
        AuthService.addScore(40);
        if (onReward) onReward(15, 40);
      }
    }
  };

  const handleResetPlant = () => {
    setPlantDay(1);
    setHasWater(true);
    setHasLight(true);
    setHasAir(true);
    setPlantFeedback(null);
  };

  // ==========================================
  // --- 3. COMPASS & MAGNET LAB ---
  // ==========================================
  const [compassAngle, setCompassAngle] = useState(0);
  const [magnetDistance, setMagnetDistance] = useState(50); // px
  const [magnetPole, setMagnetPole] = useState<'attract' | 'repel'>('attract');

  // ==========================================
  // --- 4. SCIENCE QUIZ CHALLENGE ---
  // ==========================================
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Delegates to the shared, feature-flag-gated implementation (see utils/speech.ts) so voiceReading
  // actually controls this like every other narration in the app.
  const speakText = (text: string) => {
    speakTextShared(text, 'ar-SA', 0.92);
  };

  const SCIENCE_QUIZ = [
    {
      question: 'ما هي درجة الحرارة التي يتحول عندها الماء السائل إلى جليد صلب (التجمد)؟',
      options: ['0 درجة مئوية (°C)', '100 درجة مئوية (°C)', '25 درجة مئوية (°C)', '50 درجة مئوية (°C)'],
      answer: '0 درجة مئوية (°C)',
      explanation: 'يتجمد الماء النقي عند درجة 0°C ويغلي ويتحول إلى بخار عند 100°C تحت الضغط الجوي العادي.',
    },
    {
      question: 'ما هي الشروط الضرورية لإنتاش بذرة الفاصولياء أو القمح؟',
      options: ['الماء والحرارة المناسبة وسلامة البذرة', 'الظلام الدامس والملح', 'السكر والبرودة الشديدة', 'الرياح العاتية فقط'],
      answer: 'الماء والحرارة المناسبة وسلامة البذرة',
      explanation: 'تحتاج البذرة لكي تنتش إلى الماء للانتفاخ والحرارة المناسبة وتوفر الهواء وسلامة رشيمها.',
    },
    {
      question: 'ماذا يحدث عند تقريب قطبين مغناطيسيين متشابهين (شمالي N مع شمالي N)؟',
      options: ['يتنافران ويتباعدان', 'يتجاذبان ويلتصقان', 'يتحولان إلى حرارة', 'لا يحدث أي تفاعل'],
      answer: 'يتنافران ويتباعدان',
      explanation: 'الأقطاب المغناطيسية المتشابهة تتنافر (N مع N أو S مع S)، بينما الأقطاب المختلفة تتجاذب (N مع S).',
    },
    {
      question: 'في أي اتجاه تشير الإبرة المغناطيسية للبوصلة دائماً عند استقرارها؟',
      options: ['الشمال الجغرافي (Nord)', 'الجنوب الشرقي', 'مكان غروب الشمس', 'الشرق دائماً'],
      answer: 'الشمال الجغرافي (Nord)',
      explanation: 'تتجه إبرة البوصلة دائماً نحو القطب الشمالي المغناطيسي للأرض، مما يساعدنا في تحديد الاتجاهات والقبلة.',
    },
    {
      question: 'ما هو الجزء في النبتة الذي يقوم بامتصاص الماء والأملاح المعدنية من التربة؟',
      options: ['الجذور والأوبار الماصة', 'الأوراق الخضراء', 'الأزهار والبتلات', 'الثمار فقط'],
      answer: 'الجذور والأوبار الماصة',
      explanation: 'تمتص الجذور المحلول المعدني من التربة وتنقله الساق إلى الأوراق لتصنيع الغذاء عبر التركيب الضوئي.',
    },
    {
      question: 'كيف ينتقل الماء في الرواق الباطني لنظام الفقارة في أدرار وتيميمون؟',
      options: ['بالانسياب الطبيعي عبر الجاذبية بدون محركات', 'باستخدام مضخات الديزل', 'بأشرعة الرياح', 'بالتبخير والضغط'],
      answer: 'بالانسياب الطبيعي عبر الجاذبية بدون محركات',
      explanation: 'ينساب الماء في الرواق الباطني بانحدار هندسي مدروس (1 إلى 2 مم/م) مدفوعاً بالجاذبية الطبيعية دون وقود ودون تبخر تحت حرارة الصحراء.',
    },
    {
      question: 'ما هي الأداة الحجرية التقليدية التي تقسم حصص الماء بعدالة في الواحة؟',
      options: ['القصريّة (المشط الحجري)', 'المروحة الهوائية', 'الساعة الرملية', 'الجرار الفخارية'],
      answer: 'القصريّة (المشط الحجري)',
      explanation: 'القصريّة هي لوح حجري مصقول به فتحات مقاسة هندسياً يقسم مياه الفقارة إلى السواقي بعدالة مطلقة تحت إشراف الكيّال.',
    },
    {
      question: 'ما هي الزاوية المثالية لتركيب الألواح الشمسية في الجنوب الجزائري للحصول على أقصى استطاعة لضخ المياه؟',
      options: ['30° إلى 32° نحو الجنوب', '90° عمودياً', '0° أفقياً على الأرض', '180° نحو الشمال'],
      answer: '30° إلى 32° نحو الجنوب',
      explanation: 'زاوية 30°-32° تتوافق تماماً مع خط عرض الصحراء الجزائرية (أدرار وبسكرة وتيميمون) لتسقط أشعة الشمس عمودياً وتولد طاقة قصوى.',
    },
    {
      question: 'لماذا تطفو تمرة دقلة نور في ماء شط ملغيغ فائق الملوحة بينما تغرق في الماء العذب؟',
      options: [
        'لأن كثافة الماء المالح أعلى من كثافة التمرة فتتغلب دافعة أرخميدس على ثقلها',
        'لأن التمرة تفقد وزنها تماماً',
        'لأن الملح يجعل التمرة خفيفة كالريشة',
        'بسبب حرارة الجو في الشط فقط',
      ],
      answer: 'لأن كثافة الماء المالح أعلى من كثافة التمرة فتتغلب دافعة أرخميدس على ثقلها',
      explanation: 'إضافة الملح ترفع الكتلة الحجمية للماء لتتجاوز كتلة التمرة (1.14 g/cm³)، فتصبح دافعة أرخميدس الصاعدة أقوى من ثقل التمرة النازل، فتطفو على السطح!',
    },
  ];

  const currentQuiz = SCIENCE_QUIZ[quizIndex % SCIENCE_QUIZ.length];

  const handleAnswerQuiz = (opt: string) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);

    const isCorrect = opt === currentQuiz.answer;
    if (isCorrect) {
      setQuizScore((p) => p + 1);
      setFeedback({
        isCorrect: true,
        text: `ممتاز يا عالم المستقبل! إجابة صحيحة: ${currentQuiz.explanation} 🧪✨ (+30 نقطة و15 دينار ذهبي)`,
      });
      speakText('ممتاز! إجابة صحيحة.');
      AuthService.addScore(30);
      if (onReward) onReward(15, 30);
    } else {
      setFeedback({
        isCorrect: false,
        text: `إجابة خاطئة! الجواب العلمي الصحيح هو: ${currentQuiz.answer}. ${currentQuiz.explanation}`,
      });
      speakText('إجابة غير صحيحة، راجع الشرح العلمي.');
    }
  };

  const handleNextQuiz = () => {
    setQuizIndex((p) => p + 1);
    setSelectedOption(null);
    setIsAnswered(false);
    setFeedback(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6 dir-rtl" dir="rtl">
      {/* Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-800 via-cyan-800 to-blue-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-teal-500/30">
        <div className="flex items-center gap-4 z-10">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/30 shrink-0">
            🔬
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                مختبر التجارب العلمية والإيقاظ العلمي
              </h1>
              <span className="bg-amber-400 text-amber-950 text-xs font-black px-3 py-1 rounded-full shadow-xs">
                التربية العلمية والتكنولوجية
              </span>
            </div>
            <p className="text-teal-100 text-xs sm:text-sm mt-1.5 font-medium max-w-2xl leading-relaxed">
              محاكاة تفاعلية للتجارب المقررة في المنهاج الجزائري: حالات المادة ودورة الماء، إنتاش ونمو النبات الأخضر، والمغناطيس والبوصلة! 🧪🌱
            </p>
          </div>
        </div>

        {onBack && (
          <button
            onClick={onBack}
            className="z-10 px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-2xl font-black text-xs transition-all border border-white/30 shadow-sm cursor-pointer whitespace-nowrap"
          >
            العودة للأدوات
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 bg-[var(--app-card-bg)] p-2 rounded-2xl border border-[var(--app-card-border)] shadow-xs">
        <button
          onClick={() => setActiveTab('foggara')}
          className={`py-2.5 px-2 rounded-xl font-black text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'foggara'
              ? 'bg-amber-700 text-white shadow-md'
              : 'text-[var(--app-text-muted)] hover:bg-[var(--app-card-subtle)]'
          }`}
        >
          <span>🏛️</span>
          <span>فقارة أدرار وتيميمون</span>
        </button>

        <button
          onClick={() => setActiveTab('solar_pump')}
          className={`py-2.5 px-2 rounded-xl font-black text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'solar_pump'
              ? 'bg-yellow-600 text-white shadow-md'
              : 'text-[var(--app-text-muted)] hover:bg-[var(--app-card-subtle)]'
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
          <span>ضخ المياه بالطاقة الشمسية</span>
        </button>

        <button
          onClick={() => setActiveTab('density_chott')}
          className={`py-2.5 px-2 rounded-xl font-black text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'density_chott'
              ? 'bg-sky-600 text-white shadow-md'
              : 'text-[var(--app-text-muted)] hover:bg-[var(--app-card-subtle)]'
          }`}
        >
          <span>🌴</span>
          <span>كثافة دقلة نور وشط ملغيغ</span>
        </button>

        <button
          onClick={() => setActiveTab('water_cycle')}
          className={`py-2.5 px-2 rounded-xl font-black text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'water_cycle'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-[var(--app-text-muted)] hover:bg-[var(--app-card-subtle)]'
          }`}
        >
          <Droplets className="w-3.5 h-3.5" />
          <span>حالات المادة</span>
        </button>

        <button
          onClick={() => setActiveTab('plant_growth')}
          className={`py-2.5 px-2 rounded-xl font-black text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'plant_growth'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-[var(--app-text-muted)] hover:bg-[var(--app-card-subtle)]'
          }`}
        >
          <Leaf className="w-3.5 h-3.5" />
          <span>إنتاش النبات</span>
        </button>

        <button
          onClick={() => setActiveTab('compass')}
          className={`py-2.5 px-2 rounded-xl font-black text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'compass'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-[var(--app-text-muted)] hover:bg-[var(--app-card-subtle)]'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>المغناطيس</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`py-2.5 px-2 rounded-xl font-black text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'quiz'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-[var(--app-text-muted)] hover:bg-[var(--app-card-subtle)]'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>تحدي العالِم</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 1. FOGGARA HYDRAULIC LAB                                 */}
      {/* ======================================================== */}
      {activeTab === 'foggara' && (
        <FoggaraHydraulicLab onReward={onReward} />
      )}

      {/* ======================================================== */}
      {/* 2. SOLAR OASIS PUMP LAB                                 */}
      {/* ======================================================== */}
      {activeTab === 'solar_pump' && (
        <SolarOasisPumpLab onReward={onReward} />
      )}

      {/* ======================================================== */}
      {/* 3. DENSITY & CHOTT MELRHIR LAB                           */}
      {/* ======================================================== */}
      {activeTab === 'density_chott' && (
        <DensityChottLab onReward={onReward} />
      )}

      {/* ======================================================== */}
      {/* TAB 1: WATER CYCLE & STATES OF MATTER                    */}
      {/* ======================================================== */}
      {activeTab === 'water_cycle' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls (5 Cols) */}
          <div className="lg:col-span-5 bg-[var(--app-card-bg)] rounded-3xl p-6 border border-[var(--app-card-border)] shadow-md space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                التحكم في درجة الحرارة 🌡️
              </span>
              <h2 className="text-xl font-black text-[var(--app-text)]">
                تغيير حالة المادة بالحرارة
              </h2>
              <p className="text-xs text-[var(--app-text-muted)] font-medium">
                حرك شريط الحرارة لملاحظة تحول الماء بين الحالة الصلبة، السائلة، والغازية.
              </p>
            </div>

            {/* Slider */}
            <div className="space-y-3 bg-[var(--app-card-subtle)] p-4 rounded-2xl border border-[var(--app-card-border)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--app-text-muted)]">درجة الحرارة:</span>
                <span
                  className={`text-2xl font-black font-mono ${
                    temperature <= 0
                      ? 'text-cyan-600'
                      : temperature >= 100
                      ? 'text-rose-600'
                      : 'text-blue-600'
                  }`}
                >
                  {temperature}°C
                </span>
              </div>

              <input
                type="range"
                min="-20"
                max="120"
                value={temperature}
                onChange={(e) => handleTempChange(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />

              <div className="flex justify-between text-[10px] font-bold text-[var(--app-text-muted)]">
                <span>-20°C (تجمد شديد)</span>
                <span>0°C (نقطة التجمد)</span>
                <span>100°C (نقطة الغليان)</span>
              </div>
            </div>

            {/* State info Card */}
            <div
              className={`p-4 rounded-2xl border ${
                waterPhase === 'solid'
                  ? 'bg-cyan-50 text-cyan-950 border-cyan-300'
                  : waterPhase === 'liquid'
                  ? 'bg-blue-50 text-blue-950 border-blue-300'
                  : 'bg-amber-50 text-amber-950 border-amber-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">
                  {waterPhase === 'solid' ? '🧊' : waterPhase === 'liquid' ? '💧' : '♨️'}
                </span>
                <h3 className="font-black text-sm">
                  {waterPhase === 'solid'
                    ? 'الحالة الصلبة (جليد / ثلج)'
                    : waterPhase === 'liquid'
                    ? 'الحالة السائلة (ماء جارٍ)'
                    : 'الحالة الغازية (بخار ماء)'}
                </h3>
              </div>
              <p className="text-xs font-bold leading-relaxed">
                {waterPhase === 'solid'
                  ? 'جزيئات الماء متراصة ومتماسكة وتأخذ شكلاً ثابتاً وحجماً محدداً.'
                  : waterPhase === 'liquid'
                  ? 'الماء يأخذ شكل الإناء الذي يوضع فيه، قابل للجريان وله حجم ثابت.'
                  : 'بخار الماء يملأ كل الحيز المتاح له، غير مرئي وقابل للانتشار والانضغاط.'}
              </p>
            </div>

            {/* Quick Preset Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleTempChange(-10)}
                className="flex-1 py-2.5 bg-cyan-100 hover:bg-cyan-200 text-cyan-900 font-black rounded-xl text-xs transition-colors cursor-pointer"
              >
                🧊 تجميد (-10°C)
              </button>
              <button
                onClick={() => handleTempChange(25)}
                className="flex-1 py-2.5 bg-blue-100 hover:bg-blue-200 text-blue-900 font-black rounded-xl text-xs transition-colors cursor-pointer"
              >
                💧 حرارة عادية (25°C)
              </button>
              <button
                onClick={() => handleTempChange(105)}
                className="flex-1 py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-900 font-black rounded-xl text-xs transition-colors cursor-pointer"
              >
                ♨️ غليان (105°C)
              </button>
            </div>
          </div>

          {/* Visualization (7 Cols) */}
          <div className="lg:col-span-7 bg-[var(--app-card-bg)] rounded-3xl p-6 border border-[var(--app-card-border)] shadow-md space-y-6">
            <h3 className="font-black text-base text-[var(--app-text)] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span>محاكاة دورة الماء في الطبيعة الجزائرية:</span>
            </h3>

            {/* Nature Landscape representation */}
            <div className="relative h-72 rounded-3xl overflow-hidden bg-gradient-to-b from-sky-400 via-sky-200 to-emerald-600 p-4 flex flex-col justify-between border border-sky-300 shadow-inner">
              {/* Sun and Clouds in Sky */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-5xl animate-spin-slow">☀️</span>
                  <div className="bg-white/80 backdrop-blur-md px-3 py-1 rounded-xl text-[11px] font-black text-amber-900 shadow-xs">
                    حرارة الشمس تبخر المياه
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-4xl animate-pulse">☁️🌧️</span>
                  <div className="bg-white/80 backdrop-blur-md px-3 py-1 rounded-xl text-[11px] font-black text-slate-800 shadow-xs mt-1">
                    تكاثف الغيوم والأمطار
                  </div>
                </div>
              </div>

              {/* Mountains & Rivers */}
              <div className="space-y-2 z-10">
                <div className="flex items-center justify-between text-white font-black text-xs drop-shadow-md">
                  <span>🏔️ جبال الأطلس والشريعة والجرجرة</span>
                  <span>🌊 مياه البحر الأبيض المتوسط</span>
                </div>

                {/* River Flow bar */}
                <div className="h-6 bg-blue-500/80 rounded-xl border border-white/40 flex items-center justify-center text-[10px] text-white font-black shadow-inner">
                  جريان الأودية والمياه الجوفية نحو البحر
                </div>
              </div>
            </div>

            {/* Cycle steps summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-blue-50 p-2.5 rounded-2xl border border-blue-200">
                <span className="font-black text-blue-900 block">1. التبخر</span>
                <span className="text-[10px] text-blue-700 font-bold">بفعل حرارة الشمس</span>
              </div>
              <div className="bg-slate-100 p-2.5 rounded-2xl border border-slate-300">
                <span className="font-black text-slate-900 block">2. التكاثف</span>
                <span className="text-[10px] text-slate-700 font-bold">تشكل السحب والغيوم</span>
              </div>
              <div className="bg-sky-50 p-2.5 rounded-2xl border border-sky-200">
                <span className="font-black text-sky-900 block">3. التساقط</span>
                <span className="text-[10px] text-sky-700 font-bold">أمطار وثلوج</span>
              </div>
              <div className="bg-emerald-50 p-2.5 rounded-2xl border border-emerald-200">
                <span className="font-black text-emerald-900 block">4. الجريان</span>
                <span className="text-[10px] text-emerald-700 font-bold">الأودية والبحار</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: PLANT GERMINATION & GROWTH LAB                    */}
      {/* ======================================================== */}
      {activeTab === 'plant_growth' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Factors Control (5 Cols) */}
          <div className="lg:col-span-5 bg-[var(--app-card-bg)] rounded-3xl p-6 border border-[var(--app-card-border)] shadow-md space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                شروط الإنتاش والنمو 🧪
              </span>
              <h2 className="text-xl font-black text-[var(--app-text)]">
                التحكم في شروط حياة النبات
              </h2>
              <p className="text-xs text-[var(--app-text-muted)] font-medium">
                قم بتوفير أو حجب العناصر الحيوية وشاهد كيف يتأثر نمو بذرة الفاصولياء.
              </p>
            </div>

            {/* Toggles */}
            <div className="space-y-2.5">
              <button
                onClick={() => setHasWater(!hasWater)}
                className={`w-full p-3.5 rounded-2xl border-2 font-black text-xs flex items-center justify-between transition-all cursor-pointer ${
                  hasWater
                    ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-xs'
                    : 'bg-slate-100 border-slate-300 text-slate-400 line-through'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-600" />
                  <span>سقي الماء بانتظام (الرطوبة)</span>
                </div>
                <span>{hasWater ? 'متوفر ✅' : 'محجوب ❌'}</span>
              </button>

              <button
                onClick={() => setHasLight(!hasLight)}
                className={`w-full p-3.5 rounded-2xl border-2 font-black text-xs flex items-center justify-between transition-all cursor-pointer ${
                  hasLight
                    ? 'bg-amber-50 border-amber-400 text-amber-900 shadow-xs'
                    : 'bg-slate-100 border-slate-300 text-slate-400 line-through'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>ضوء الشمس المباشر</span>
                </div>
                <span>{hasLight ? 'متوفر ✅' : 'محجوب ❌'}</span>
              </button>

              <button
                onClick={() => setHasAir(!hasAir)}
                className={`w-full p-3.5 rounded-2xl border-2 font-black text-xs flex items-center justify-between transition-all cursor-pointer ${
                  hasAir
                    ? 'bg-teal-50 border-teal-400 text-teal-900 shadow-xs'
                    : 'bg-slate-100 border-slate-300 text-slate-400 line-through'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-teal-600" />
                  <span>الهواء والأكسجين النقي</span>
                </div>
                <span>{hasAir ? 'متوفر ✅' : 'محجوب ❌'}</span>
              </button>
            </div>

            {/* Advance day button */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleAdvanceDay}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <Play className="w-4 h-4" />
                <span>مرور يوم جديد (اليوم {plantDay} من 5) 📅</span>
              </button>

              <button
                onClick={handleResetPlant}
                className="w-full py-2.5 bg-[var(--app-card-subtle)] hover:bg-rose-50 hover:text-rose-700 text-[var(--app-text-muted)] font-black rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer border border-[var(--app-card-border)]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة زراعة بذرة جديدة</span>
              </button>
            </div>

            {plantFeedback && (
              <div className="p-3 rounded-2xl bg-amber-50 text-amber-950 border border-amber-300 text-xs font-bold leading-relaxed">
                {plantFeedback}
              </div>
            )}
          </div>

          {/* Plant Growth Visualizer (7 Cols) */}
          <div className="lg:col-span-7 bg-[var(--app-card-bg)] rounded-3xl p-6 border border-[var(--app-card-border)] shadow-md space-y-6 text-center">
            <h3 className="font-black text-base text-[var(--app-text)] flex items-center justify-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-600" />
              <span>مراحل إنتاش بذرة الفاصولياء (اليوم {plantDay}):</span>
            </h3>

            {/* Pot Visualization */}
            <div className="relative h-64 bg-gradient-to-b from-sky-100 to-amber-100 rounded-3xl p-4 flex flex-col justify-end items-center border border-amber-200 overflow-hidden shadow-inner">
              {/* Plant Visual based on day */}
              <div className="z-10 flex flex-col items-center mb-6">
                {plantDay === 1 && (
                  <div className="text-center space-y-1">
                    <span className="text-4xl block animate-pulse">🌰</span>
                    <span className="text-[11px] font-black bg-amber-200 text-amber-950 px-2 py-0.5 rounded-lg">
                      اليوم 1: انتفاخ البذرة بالماء
                    </span>
                  </div>
                )}
                {plantDay === 2 && (
                  <div className="text-center space-y-1">
                    <span className="text-5xl block animate-bounce">🌱</span>
                    <span className="text-[11px] font-black bg-amber-200 text-amber-950 px-2 py-0.5 rounded-lg">
                      اليوم 2: ظهور الجذير نحو الأسفل
                    </span>
                  </div>
                )}
                {plantDay === 3 && (
                  <div className="text-center space-y-1">
                    <span className="text-6xl block">🌿</span>
                    <span className="text-[11px] font-black bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded-lg">
                      اليوم 3: صعود السويقة وظهور الفلقتين
                    </span>
                  </div>
                )}
                {plantDay === 4 && (
                  <div className="text-center space-y-1">
                    <span className="text-7xl block">🪴</span>
                    <span className="text-[11px] font-black bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded-lg">
                      اليوم 4: تفتح الأوراق الخضراء الأولى
                    </span>
                  </div>
                )}
                {plantDay >= 5 && (
                  <div className="text-center space-y-1">
                    <span className="text-8xl block animate-bounce">🌻</span>
                    <span className="text-xs font-black bg-emerald-600 text-white px-3 py-1 rounded-xl shadow-md">
                      اليوم 5: نبتة كاملة مزهرة ومورقة! 🎉
                    </span>
                  </div>
                )}
              </div>

              {/* Soil layer */}
              <div className="w-full h-16 bg-amber-900 rounded-2xl border-t-4 border-amber-700 flex items-center justify-center text-amber-200 text-xs font-black shadow-md">
                تربة زراعية خصبة غنية بالأملاح المعدنية
              </div>
            </div>

            {/* Stages overview */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-[var(--app-card-subtle)] p-2.5 rounded-2xl border border-[var(--app-card-border)]">
                <span className="font-black text-[var(--app-text)] block">الجذير:</span>
                <span className="text-[10px] text-[var(--app-text-muted)] font-bold">ينمو نحو الأسفل لامتصاص الماء</span>
              </div>
              <div className="bg-[var(--app-card-subtle)] p-2.5 rounded-2xl border border-[var(--app-card-border)]">
                <span className="font-black text-[var(--app-text)] block">السويقة:</span>
                <span className="text-[10px] text-[var(--app-text-muted)] font-bold">تنمو نحو الأعلى باتجاه الضوء</span>
              </div>
              <div className="bg-[var(--app-card-subtle)] p-2.5 rounded-2xl border border-[var(--app-card-border)]">
                <span className="font-black text-[var(--app-text)] block">الأوراق:</span>
                <span className="text-[10px] text-[var(--app-text-muted)] font-bold">تقوم بالتركيب الضوئي والتنفس</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: COMPASS & MAGNET LAB                              */}
      {/* ======================================================== */}
      {activeTab === 'compass' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Magnet Pole Simulator (6 Cols) */}
          <div className="lg:col-span-6 bg-[var(--app-card-bg)] rounded-3xl p-6 border border-[var(--app-card-border)] shadow-md space-y-5">
            <div className="space-y-1">
              <span className="text-xs font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                تجاذب وتنافر الأقطاب 🧲
              </span>
              <h2 className="text-lg font-black text-[var(--app-text)]">
                تجربة قطبي المغناطيس (شمالي N / جنوبي S)
              </h2>
            </div>

            {/* Interactive Magnet Stage */}
            <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-2xl p-4 flex items-center justify-center gap-6 border border-slate-300 dark:border-slate-700">
              {/* Magnet 1 */}
              <div className="flex rounded-xl overflow-hidden border-2 border-slate-700 shadow-md">
                <div className="bg-rose-600 text-white font-black px-4 py-6 text-sm">N (شمالي)</div>
                <div className="bg-blue-600 text-white font-black px-4 py-6 text-sm">S (جنوبي)</div>
              </div>

              {/* Force indicator */}
              <div className="text-2xl font-black text-amber-600 animate-pulse">
                {magnetPole === 'attract' ? '➡️ 🧲 ⬅️' : '⬅️ 🚫 ➡️'}
              </div>

              {/* Magnet 2 */}
              <div className="flex rounded-xl overflow-hidden border-2 border-slate-700 shadow-md">
                {magnetPole === 'attract' ? (
                  <>
                    <div className="bg-blue-600 text-white font-black px-4 py-6 text-sm">S (جنوبي)</div>
                    <div className="bg-rose-600 text-white font-black px-4 py-6 text-sm">N (شمالي)</div>
                  </>
                ) : (
                  <>
                    <div className="bg-rose-600 text-white font-black px-4 py-6 text-sm">N (شمالي)</div>
                    <div className="bg-blue-600 text-white font-black px-4 py-6 text-sm">S (جنوبي)</div>
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setMagnetPole('attract')}
                className={`flex-1 py-3 rounded-xl font-black text-xs transition-all cursor-pointer ${
                  magnetPole === 'attract'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)]'
                }`}
              >
                🧲 أقطاب مختلفة (تجاذب N مع S)
              </button>

              <button
                onClick={() => setMagnetPole('repel')}
                className={`flex-1 py-3 rounded-xl font-black text-xs transition-all cursor-pointer ${
                  magnetPole === 'repel'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)]'
                }`}
              >
                🚫 أقطاب متشابهة (تنافر N مع N)
              </button>
            </div>

            <p className="text-xs text-[var(--app-text-muted)] font-bold bg-[var(--app-card-subtle)] p-3 rounded-xl border border-[var(--app-card-border)]">
              💡 <span className="text-[var(--app-text)]">القاعدة العلمية:</span> الأقطاب المتشابهة تتنافر وتتباعد، بينما الأقطاب المغناطيسية المختلفة تتجاذب وتلتصق بقوة.
            </p>
          </div>

          {/* Compass & Directions (6 Cols) */}
          <div className="lg:col-span-6 bg-[var(--app-card-bg)] rounded-3xl p-6 border border-[var(--app-card-border)] shadow-md space-y-5 text-center">
            <div className="space-y-1">
              <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                البوصلة والجهات الأربع 🧭
              </span>
              <h2 className="text-lg font-black text-[var(--app-text)]">
                تحديد الاتجاهات الجغرافية
              </h2>
            </div>

            {/* Compass Circle */}
            <div className="relative w-48 h-48 mx-auto rounded-full bg-slate-900 border-4 border-amber-500 shadow-xl flex items-center justify-center text-white">
              {/* Compass Cardinal Points */}
              <span className="absolute top-2 font-black text-rose-400 text-xs">الشمال N</span>
              <span className="absolute bottom-2 font-black text-slate-300 text-xs">الجنوب S</span>
              <span className="absolute right-2 font-black text-amber-400 text-xs">الشرق E</span>
              <span className="absolute left-2 font-black text-amber-400 text-xs">الغرب W</span>

              {/* Needle */}
              <div
                className="w-1.5 h-32 bg-gradient-to-b from-rose-600 via-white to-blue-600 rounded-full transition-transform duration-700 shadow-md"
                style={{ transform: `rotate(${compassAngle}deg)` }}
              />

              <div className="w-5 h-5 rounded-full bg-amber-400 border-2 border-white absolute shadow-inner" />
            </div>

            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setCompassAngle((p) => p + 45)}
                className="px-4 py-2 bg-[var(--app-card-subtle)] hover:bg-slate-200 text-[var(--app-text)] font-black rounded-xl text-xs transition-colors cursor-pointer border border-[var(--app-card-border)]"
              >
                تدوير البوصلة 45° 🔄
              </button>
              <button
                onClick={() => setCompassAngle(0)}
                className="px-4 py-2 bg-blue-600 text-white font-black rounded-xl text-xs hover:bg-blue-700 transition-colors cursor-pointer"
              >
                إعادة ضبط الشمال (0°) 🧭
              </button>
            </div>

            <p className="text-xs text-[var(--app-text-muted)] font-bold">
              تعتمد البوصلة على إبرة ممغنطة تشير دائماً إلى القطب الشمالي لكوكب الأرض.
            </p>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: SCIENCE DETECTIVE QUIZ                            */}
      {/* ======================================================== */}
      {activeTab === 'quiz' && (
        <div className="bg-[var(--app-card-bg)] rounded-3xl p-6 sm:p-8 border border-[var(--app-card-border)] shadow-md space-y-6 max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--app-card-border)]">
            <span className="text-xs font-black text-[var(--app-text-muted)]">
              اللغز العلمي رقم {quizIndex + 1}
            </span>
            <span className="bg-amber-100 text-amber-950 font-black text-xs px-3 py-1 rounded-full shadow-xs">
              النقاط: {quizScore} 🏆
            </span>
          </div>

          <div className="space-y-4 py-4">
            <span className="text-5xl block animate-bounce">🔬</span>
            <h3 className="text-xl sm:text-2xl font-black text-[var(--app-text)] leading-snug">
              {currentQuiz.question}
            </h3>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQuiz.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isCorrect = opt === currentQuiz.answer;
              let btnClass =
                'bg-[var(--app-card-subtle)] hover:bg-[var(--app-card-bg)] text-[var(--app-text)] border-[var(--app-card-border)]';

              if (isAnswered) {
                if (isCorrect) {
                  btnClass = 'bg-teal-600 text-white border-teal-600 shadow-md scale-[1.02]';
                } else if (isSelected) {
                  btnClass = 'bg-rose-600 text-white border-rose-600 shadow-md';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleAnswerQuiz(opt)}
                  className={`p-4 rounded-2xl border-2 font-black text-sm transition-all flex items-center justify-center cursor-pointer ${btnClass}`}
                >
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="space-y-4 pt-2">
              {feedback && (
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm font-bold border ${
                    feedback.isCorrect
                      ? 'bg-teal-50 text-teal-950 border-teal-200'
                      : 'bg-rose-50 text-rose-950 border-rose-200'
                  }`}
                >
                  {feedback.text}
                </div>
              )}

              <button
                onClick={handleNextQuiz}
                className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-2xl shadow-lg transition-all text-sm cursor-pointer"
              >
                اللغز العلمي التالي ➡️
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
