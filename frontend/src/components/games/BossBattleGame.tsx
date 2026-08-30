import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PrimaryGrade } from '../../types';
import { playSuccessChime, playGentleNudge, playModuleCompleteFanfare } from '../preschool/usePreschoolAudio';
import { Shield, Zap, Sparkles, Trophy, ArrowRight, RefreshCw, Heart, Swords, Skull } from 'lucide-react';

interface BossBattleGameProps {
  grade?: PrimaryGrade;
  onExit?: () => void;
  onComplete?: (earnedXp: number, coins: number) => void;
}

interface BossQuestion {
  id: string;
  subjectAr: string;
  subjectIcon: string;
  questionAr: string;
  optionsAr: string[];
  correctAnswerAr: string;
  explanationAr: string;
}

const BOSS_QUESTIONS_BY_GRADE: Record<PrimaryGrade, BossQuestion[]> = {
  '1AP': [
    {
      id: 'b1-1',
      subjectAr: 'رياضيات',
      subjectIcon: '🔢',
      questionAr: 'ما هو ناتج: 5 + 4 = ؟',
      optionsAr: ['9', '8', '10', '7'],
      correctAnswerAr: '9',
      explanationAr: '5 زائد 4 يساوي 9',
    },
    {
      id: 'b1-2',
      subjectAr: 'لغة عربية',
      subjectIcon: '📖',
      questionAr: 'الحرف الأول في كلمة « جَمَلٌ » هو:',
      optionsAr: ['ج', 'ح', 'خ', 'م'],
      correctAnswerAr: 'ج',
      explanationAr: 'كلمة جمل تبدأ بحرف الجيم (ج)',
    },
    {
      id: 'b1-3',
      subjectAr: 'تربية إسلامية',
      subjectIcon: '🕌',
      questionAr: 'أول كلمة نزلت في القرآن الكريم هي:',
      optionsAr: ['اقْرَأْ', 'اكتب', 'اسمع', 'انظر'],
      correctAnswerAr: 'اقْرَأْ',
      explanationAr: 'قال تعالى: {اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ}',
    },
    {
      id: 'b1-4',
      subjectAr: 'علمية',
      subjectIcon: '🌱',
      questionAr: 'النبات يحتاج للنمو إلى:',
      optionsAr: ['الماء والضوء', 'الظلام فقط', 'الحجارة', 'العصير'],
      correctAnswerAr: 'الماء والضوء',
      explanationAr: 'يحتاج النبات إلى الماء والضوء والتربة والهواء',
    },
  ],
  '2AP': [
    {
      id: 'b2-1',
      subjectAr: 'رياضيات',
      subjectIcon: '🔢',
      questionAr: 'ضعف العدد 25 هو:',
      optionsAr: ['50', '40', '30', '55'],
      correctAnswerAr: '50',
      explanationAr: '25 + 25 = 50',
    },
    {
      id: 'b2-2',
      subjectAr: 'لغة عربية',
      subjectIcon: '📖',
      questionAr: 'الجملة التي تدل على المؤنث هي:',
      optionsAr: ['كتبتْ سارةُ الدرسَ', 'كتبَ أحمدُ الدرسَ', 'لعبَ الولدُ', 'نامَ الطفلُ'],
      correctAnswerAr: 'كتبتْ سارةُ الدرسَ',
      explanationAr: 'تاء التأنيث الساكنة تتصل بالفعل مع المؤنث',
    },
    {
      id: 'b2-3',
      subjectAr: 'تربية إسلامية',
      subjectIcon: '🕌',
      questionAr: 'عدد الصلوات المفروضة في اليوم والليلة هو:',
      optionsAr: ['5 صلوات', '3 صلوات', '4 صلوات', '6 صلوات'],
      correctAnswerAr: '5 صلوات',
      explanationAr: 'الصبح، الظهر، العصر، المغرب، العشاء',
    },
    {
      id: 'b2-4',
      subjectAr: 'تربية مدنية',
      subjectIcon: '🇩🇿',
      questionAr: 'ألوان العلم الوطني الجزائري هي:',
      optionsAr: ['الأخضر والأبيض والأحمر', 'الأزرق والأصفر', 'الأحمر والأسود', 'الأبيض والرمادي'],
      correctAnswerAr: 'الأخضر والأبيض والأحمر',
      explanationAr: 'العلم الجزائري يتكون من لونين أخضر وأبيض تتوسطهما نجمة وهلال أحمران',
    },
  ],
  '3AP': [
    {
      id: 'b3-1',
      subjectAr: 'رياضيات',
      subjectIcon: '🔢',
      questionAr: 'ناتج العملية: 7 × 8 = ؟',
      optionsAr: ['56', '54', '48', '64'],
      correctAnswerAr: '56',
      explanationAr: 'من جدول ضرب 7 و8: 7 × 8 = 56',
    },
    {
      id: 'b3-2',
      subjectAr: 'لغة عربية',
      subjectIcon: '📖',
      questionAr: 'الفعل الماضي في الجملة التالية هو:',
      optionsAr: ['رَسَمَ', 'يَرْسُمُ', 'ارْسُمْ', 'رَسَّامٌ'],
      correctAnswerAr: 'رَسَمَ',
      explanationAr: 'رَسَمَ فعل ماضٍ مبني على الفتح',
    },
    {
      id: 'b3-3',
      subjectAr: 'تاريخ وجغرافيا',
      subjectIcon: '🗺️',
      questionAr: 'تقع الجزائر في شمال قارة:',
      optionsAr: ['إفريقيا', 'آسيا', 'أوروبا', 'أمريكا'],
      correctAnswerAr: 'إفريقيا',
      explanationAr: 'الجزائر هي أكبر دولة في قارة إفريقيا',
    },
    {
      id: 'b3-4',
      subjectAr: 'لغة فرنسية',
      subjectIcon: '🇫🇷',
      questionAr: 'Le pluriel du mot « chat » est :',
      optionsAr: ['chats', 'chates', 'chateaux', 'chatx'],
      correctAnswerAr: 'chats',
      explanationAr: 'On ajoute un « s » à la fin du nom régulier au pluriel',
    },
  ],
  '4AP': [
    {
      id: 'b4-1',
      subjectAr: 'رياضيات',
      subjectIcon: '🔢',
      questionAr: 'محيط مستطيل طوله 8cm وعرضه 5cm هو:',
      optionsAr: ['26cm', '40cm', '13cm', '30cm'],
      correctAnswerAr: '26cm',
      explanationAr: 'المحيط = (الطول + العرض) × 2 = (8 + 5) × 2 = 26cm',
    },
    {
      id: 'b4-2',
      subjectAr: 'لغة عربية',
      subjectIcon: '📖',
      questionAr: 'علامة رفع جمع المذكر السالم هي:',
      optionsAr: ['الواو', 'الضمة', 'الألف', 'الياء'],
      correctAnswerAr: 'الواو',
      explanationAr: 'يرفع جمع المذكر السالم بالواو (مثل: المعلمونَ)',
    },
    {
      id: 'b4-3',
      subjectAr: 'علوم وتكنولوجيا',
      subjectIcon: '⚡',
      questionAr: 'العنصر الذي يفتح ويغلق الدارة الكهربائية هو:',
      optionsAr: ['القاطعة', 'المصباح', 'البطارية', 'السلك'],
      correctAnswerAr: 'القاطعة',
      explanationAr: 'القاطعة تتحكم في مرور التيار الكهربائي',
    },
    {
      id: 'b4-4',
      subjectAr: 'تاريخ',
      subjectIcon: '🏛️',
      questionAr: 'الملك النوميدي الذي وحّد نوميديا الشرقية والغربية هو:',
      optionsAr: ['ماسينيسا', 'يوغرطة', 'سيفاكس', 'يوبا الأول'],
      correctAnswerAr: 'ماسينيسا',
      explanationAr: 'الملك ماسينيسا وحد نوميديا وجعل عاصمتها سيرتا (قسنطينة)',
    },
  ],
  '5AP': [
    {
      id: 'b5-1',
      subjectAr: 'رياضيات',
      subjectIcon: '🔢',
      questionAr: 'إذا كان ثمن 3 كتب هو 600 دج، فإن ثمن 5 كتب هو:',
      optionsAr: ['1000 دج', '900 دج', '1200 دج', '800 دج'],
      correctAnswerAr: '1000 دج',
      explanationAr: 'ثمن الكتاب الواحد = 600 ÷ 3 = 200 دج. ثمن 5 كتب = 200 × 5 = 1000 دج',
    },
    {
      id: 'b5-2',
      subjectAr: 'لغة عربية',
      subjectIcon: '📖',
      questionAr: 'إعراب كلمة « نشيطاً » في: « كانَ التلميذُ نشيطاً »:',
      optionsAr: ['خبر كان منصوب', 'اسم كان مرفوع', 'حال منصوب', 'مفعول به'],
      correctAnswerAr: 'خبر كان منصوب',
      explanationAr: 'كان ترفع المبتدأ ويسمى اسمها، وتنصب الخبر ويسمى خبرها',
    },
    {
      id: 'b5-3',
      subjectAr: 'تاريخ وطني',
      subjectIcon: '🇩🇿',
      questionAr: 'اندلعت الثورة التحريرية الجزائرية الكبرى في:',
      optionsAr: ['1 نوفمبر 1954', '5 جويلية 1962', '8 ماي 1945', '19 مارس 1962'],
      correctAnswerAr: '1 نوفمبر 1954',
      explanationAr: 'اندلعت الثورة التحريرية المظفرة في الفاتح من نوفمبر 1954',
    },
    {
      id: 'b5-4',
      subjectAr: 'علوم وتكنولوجيا',
      subjectIcon: '🫁',
      questionAr: 'الغاز الضروري لتنفس الكائنات الحية هو:',
      optionsAr: ['الأكسجين (O2)', 'ثنائي أكسيد الكربون', 'الآزوت', 'الهيدروجين'],
      correctAnswerAr: 'الأكسجين (O2)',
      explanationAr: 'يمتص الجسم الأكسجين أثناء الشهيق ويطرح غاز الفحم',
    },
  ],
};

export const BossBattleGame: React.FC<BossBattleGameProps> = ({
  grade = '3AP',
  onExit,
  onComplete,
}) => {
  const questions = BOSS_QUESTIONS_BY_GRADE[grade] || BOSS_QUESTIONS_BY_GRADE['3AP'];
  const [qIndex, setQIndex] = useState(0);
  const [bossHp, setBossHp] = useState(100);
  const [playerHp, setPlayerHp] = useState(100);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [shieldActive, setShieldActive] = useState(false);
  const [shieldUsed, setShieldUsed] = useState(false);
  const [lightningUsed, setLightningUsed] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState<string[]>([]);
  const [isWon, setIsWon] = useState(false);
  const [isLost, setIsLost] = useState(false);
  const [animatingAttack, setAnimatingAttack] = useState<'player' | 'boss' | null>(null);
  const pendingTimeoutsRef = useRef<number[]>([]);

  // Every attack animation schedules a follow-up setTimeout to advance the battle. Track them
  // all so a component unmount (player exits mid-animation) cancels the pending ones instead of
  // firing state updates after the battle screen is gone.
  useEffect(() => {
    return () => {
      pendingTimeoutsRef.current.forEach((id) => window.clearTimeout(id));
      pendingTimeoutsRef.current = [];
    };
  }, []);

  const scheduleTimeout = (fn: () => void, delay: number) => {
    const id = window.setTimeout(() => {
      pendingTimeoutsRef.current = pendingTimeoutsRef.current.filter((t) => t !== id);
      fn();
    }, delay);
    pendingTimeoutsRef.current.push(id);
  };

  const currentQ = questions[qIndex % questions.length];

  const handleSelectOption = (opt: string) => {
    if (isRevealed || isWon || isLost) return;
    setSelectedOption(opt);
    setIsRevealed(true);

    const isCorrect = opt === currentQ.correctAnswerAr;

    if (isCorrect) {
      playSuccessChime();
      setAnimatingAttack('player');

      const damage = Math.ceil(100 / questions.length);
      const nextBossHp = Math.max(0, bossHp - damage);
      setBossHp(nextBossHp);

      scheduleTimeout(() => {
        setAnimatingAttack(null);
        if (nextBossHp <= 0) {
          setIsWon(true);
          playModuleCompleteFanfare();
          onComplete?.(50, 25);
        } else {
          setQIndex((i) => (i + 1) % questions.length);
          setSelectedOption(null);
          setIsRevealed(false);
          setHiddenOptions([]);
        }
      }, 1200);
    } else {
      playGentleNudge();
      setAnimatingAttack('boss');

      if (shieldActive) {
        setShieldActive(false);
      } else {
        const nextPlayerHp = Math.max(0, playerHp - 35);
        setPlayerHp(nextPlayerHp);
        if (nextPlayerHp <= 0) {
          scheduleTimeout(() => {
            setIsLost(true);
          }, 1000);
        }
      }

      scheduleTimeout(() => {
        setAnimatingAttack(null);
        setSelectedOption(null);
        setIsRevealed(false);
      }, 1400);
    }
  };

  const handleUseShield = () => {
    if (shieldUsed || isWon || isLost) return;
    setShieldUsed(true);
    setShieldActive(true);
  };

  const handleUseLightning = () => {
    if (lightningUsed || isWon || isLost) return;
    setLightningUsed(true);
    const wrongOptions = currentQ.optionsAr.filter((o) => o !== currentQ.correctAnswerAr);
    setHiddenOptions(wrongOptions.slice(0, 2));
  };

  const handleRestart = () => {
    setQIndex(0);
    setBossHp(100);
    setPlayerHp(100);
    setSelectedOption(null);
    setIsRevealed(false);
    setShieldActive(false);
    setShieldUsed(false);
    setLightningUsed(false);
    setHiddenOptions([]);
    setIsWon(false);
    setIsLost(false);
    setAnimatingAttack(null);
  };

  return (
    <div data-lab-instrument className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-slate-950 text-white rounded-3xl shadow-2xl border-2 border-rose-500/40 relative overflow-hidden" dir="rtl">
      {/* Dynamic Arena Background */}
      <div className="absolute inset-0 bg-radial from-rose-950/30 via-slate-950 to-slate-950 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-rose-600 to-amber-700 text-white shadow-md">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white">معركة الزعيم الأسطوري</h2>
            <span className="text-xs text-rose-400 font-bold">اهزم وحش الكسل والتشتت بقوة المعرفة!</span>
          </div>
        </div>

        {onExit && (
          <button
            onClick={onExit}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
          >
            <span>خروج</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {!isWon && !isLost ? (
        <div className="space-y-5 relative z-10">
          {/* Battle Stage (Boss vs Player Avatars & HP) */}
          <div className="grid grid-cols-2 gap-4 bg-slate-900/90 p-4 rounded-3xl border border-slate-800 backdrop-blur-md">
            {/* Boss Side */}
            <div className="flex flex-col items-center text-center space-y-1.5">
              <div className="relative">
                <motion.div
                  animate={
                    animatingAttack === 'boss'
                      ? { scale: [1, 1.25, 1], x: [0, -15, 0] }
                      : animatingAttack === 'player'
                      ? { rotate: [0, -10, 10, 0], opacity: [1, 0.5, 1] }
                      : { y: [0, -4, 0] }
                  }
                  transition={{ repeat: animatingAttack ? 0 : Infinity, duration: 2 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-rose-600 to-purple-900 flex items-center justify-center text-3xl sm:text-4xl shadow-lg shadow-rose-900/40 border-2 border-rose-400/50"
                >
                  👾
                </motion.div>
                <div className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full bg-rose-600 text-[10px] font-black text-white">
                  الزعيم
                </div>
              </div>

              <span className="text-xs font-black text-rose-300">وحش الكسل</span>

              {/* Boss HP Bar */}
              <div className="w-full bg-slate-800 rounded-full h-3 p-0.5 border border-rose-900/50">
                <motion.div
                  className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full"
                  animate={{ width: `${bossHp}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <span className="text-[10px] font-mono text-slate-400 font-bold">{bossHp} / 100 HP</span>
            </div>

            {/* Player Side */}
            <div className="flex flex-col items-center text-center space-y-1.5">
              <div className="relative">
                <motion.div
                  animate={
                    animatingAttack === 'player'
                      ? { scale: [1, 1.25, 1], x: [0, 15, 0] }
                      : animatingAttack === 'boss'
                      ? { rotate: [0, 10, -10, 0], opacity: [1, 0.5, 1] }
                      : { y: [0, -4, 0] }
                  }
                  transition={{ repeat: animatingAttack ? 0 : Infinity, duration: 2, delay: 0.5 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-800 flex items-center justify-center text-3xl sm:text-4xl shadow-lg shadow-emerald-900/40 border-2 border-emerald-400/50"
                >
                  🦊
                </motion.div>
                {shieldActive && (
                  <div className="absolute -top-2 -left-2 p-1 rounded-full bg-sky-500 text-white animate-bounce shadow-md">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              <span className="text-xs font-black text-emerald-300">البطل ديدو</span>

              {/* Player HP Bar */}
              <div className="w-full bg-slate-800 rounded-full h-3 p-0.5 border border-emerald-900/50">
                <motion.div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
                  animate={{ width: `${playerHp}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <span className="text-[10px] font-mono text-slate-400 font-bold">{playerHp} / 100 HP</span>
            </div>
          </div>

          {/* Special Combat Power-ups */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleUseShield}
              disabled={shieldUsed}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                shieldUsed
                  ? 'bg-slate-800 text-slate-600 border border-slate-700/30 opacity-50 cursor-not-allowed'
                  : 'bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 border border-sky-500/40 cursor-pointer'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>درع الصدّ المنيع</span>
            </button>

            <button
              onClick={handleUseLightning}
              disabled={lightningUsed}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                lightningUsed
                  ? 'bg-slate-800 text-slate-600 border border-slate-700/30 opacity-50 cursor-not-allowed'
                  : 'bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/40 cursor-pointer'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>صاعقة البرق (50:50)</span>
            </button>
          </div>

          {/* Question Card */}
          <div className="bg-slate-900 p-5 sm:p-6 rounded-3xl border-2 border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{currentQ.subjectIcon}</span>
              <span className="text-xs font-black text-amber-400 px-2 py-0.5 rounded-md bg-amber-950/60 border border-amber-800/60">
                {currentQ.subjectAr}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-slate-100 leading-snug">
              {currentQ.questionAr}
            </h3>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.optionsAr.map((opt) => {
              const isHidden = hiddenOptions.includes(opt);
              const isSelected = selectedOption === opt;
              const isCorrect = opt === currentQ.correctAnswerAr;

              let style = 'bg-slate-900/90 border-slate-800 hover:border-slate-600 text-slate-200';
              if (isRevealed) {
                if (isCorrect) style = 'bg-emerald-600 border-emerald-400 text-white shadow-lg';
                else if (isSelected) style = 'bg-rose-600 border-rose-400 text-white';
              }

              if (isHidden) {
                return (
                  <div key={opt} className="h-12 sm:h-14 rounded-2xl bg-slate-900/20 border border-slate-900 opacity-20 pointer-events-none" />
                );
              }

              return (
                <motion.button
                  key={opt}
                  onClick={() => handleSelectOption(opt)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className={`p-3.5 rounded-2xl border-2 font-bold text-sm sm:text-base text-right transition-all flex items-center justify-between cursor-pointer ${style}`}
                >
                  <span>{opt}</span>
                  {isRevealed && isCorrect && <span>✓</span>}
                </motion.button>
              );
            })}
          </div>
        </div>
      ) : isWon ? (
        /* Victory Screen */
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-8 space-y-5 relative z-10"
        >
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 text-amber-950 flex items-center justify-center shadow-2xl shadow-amber-500/40">
            <Trophy className="w-12 h-12 animate-pulse" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black text-white">انتصار أسطوري ساحق! 👑</h3>
            <p className="text-sm text-slate-300 font-bold max-w-md mx-auto">
              هزمت وحش الكسل والتشتت وحررت صندوق كنوز المعرفة! حصلت على <strong className="text-amber-400">+50 XP</strong> و <strong className="text-amber-400">+25 قطعة ذهبية</strong>.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-sm shadow-lg shadow-rose-600/30 transition-all cursor-pointer flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>مبارزة جديدة</span>
            </button>

            {onExit && (
              <button
                onClick={onExit}
                className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-sm transition-all cursor-pointer"
              >
                العودة للساحة
              </button>
            )}
          </div>
        </motion.div>
      ) : (
        /* Defeat Screen */
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-8 space-y-5 relative z-10"
        >
          <div className="w-20 h-20 mx-auto rounded-3xl bg-slate-800 text-rose-500 flex items-center justify-center shadow-lg border border-rose-900/50">
            <Skull className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-black text-white">تمكّن وحش الكسل هذه المرة!</h3>
            <p className="text-sm text-slate-400 font-bold">لا تستسلم يا بطل، راجع معلوماتك وحاول من جديد!</p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-black text-sm transition-all cursor-pointer flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>إعادة المحاولة فوراً</span>
            </button>

            {onExit && (
              <button
                onClick={onExit}
                className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-sm transition-all cursor-pointer"
              >
                العودة للساحة
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
