import React, { useState } from 'react';
import { Card, Badge, Button } from './ui';
import {
  Eye,
  Ear,
  Hand,
  Sparkles,
  Award,
  CheckCircle2,
  Trophy,
  RotateCcw,
  Sun,
  Droplets,
  Sprout,
  Shield,
  Heart,
  BookOpen,
} from 'lucide-react';
import { PrimaryGrade } from '../types';

interface PrimaryDiscoveryLabInteractiveProps {
  grade?: PrimaryGrade;
  onReward?: (coins: number, xp: number) => void;
  onBack?: () => void;
}

type DiscoveryTab = 'five_senses' | 'plant_growth' | 'children_rights';

export const PrimaryDiscoveryLabInteractive: React.FC<PrimaryDiscoveryLabInteractiveProps> = ({
  onReward,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<DiscoveryTab>('five_senses');

  // --- 1. Five Senses Game State ---
  const [selectedSense, setSelectedSense] = useState<string>('sight');
  const [sensesQuizScore, setSensesQuizScore] = useState<number>(0);
  const [sensesAnswered, setSensesAnswered] = useState<Record<number, boolean>>({});

  // --- 2. Plant Growth Simulation State ---
  const [plantStage, setPlantStage] = useState<number>(1); // 1: Seed, 2: Germination, 3: Seedling, 4: Adult Plant with flower/fruit
  const [hasWater, setHasWater] = useState<boolean>(false);
  const [hasSun, setHasSun] = useState<boolean>(false);
  const [plantMessage, setPlantMessage] = useState<string>('قم بسقي البذرة وتوفير ضوء الشمس لتنمو النبتة!');

  // --- 3. Children's Rights & Duties Game State ---
  const [rightsScore, setRightsScore] = useState<number>(0);
  const [rightsAnswers, setRightsAnswers] = useState<Record<number, 'right' | 'duty'>>({});

  const SENSES_DATA = [
    {
      id: 'sight',
      nameAr: 'حَاسَّةُ البَصَرِ',
      organAr: 'العَيْنُ 👁️',
      roleAr: 'أَرَى بِهَا الأَلْوَانَ وَالأَشْكَالَ وَالضَّوْءَ وَالمَنَاظِرَ الجَمِيلَةَ.',
      icon: '👁️',
      color: 'from-blue-600 to-indigo-700',
    },
    {
      id: 'hearing',
      nameAr: 'حَاسَّةُ السَّمْعِ',
      organAr: 'الأُذُنُ 👂',
      roleAr: 'أَسْمَعُ بِهَا الأَصْوَاتَ وَالأَنَاشِيدَ وَجَرَسَ المَدْرَسَةِ.',
      icon: '👂',
      color: 'from-emerald-600 to-teal-700',
    },
    {
      id: 'taste',
      nameAr: 'حَاسَّةُ الذَّوْقِ',
      organAr: 'اللِّسَانُ 👅',
      roleAr: 'أَتَذَوَّقُ بِهِ الطَّعَامَ الحُلْوَ وَالمَالِحَ وَالحَامِضَ.',
      icon: '👅',
      color: 'from-rose-600 to-red-700',
    },
    {
      id: 'smell',
      nameAr: 'حَاسَّةُ الشَّمِّ',
      organAr: 'الأَنْفُ 👃',
      roleAr: 'أَشُمُّ بِهِ العُطُورَ الزَّكِيَّةَ وَرَائِحَةَ الأَزْهَارِ وَالطَّعَامِ.',
      icon: '👃',
      color: 'from-amber-600 to-yellow-700',
    },
    {
      id: 'touch',
      nameAr: 'حَاسَّةُ اللَّمْسِ',
      organAr: 'الجِلْدُ وَاليَدُ ✋',
      roleAr: 'أَلْمَسُ بِهِ الأَشْيَاءَ فَأَعْرِفُ السَّاخِنَ وَالبَارِدَ، النَّاعِمَ وَالخَشِنَ.',
      icon: '✋',
      color: 'from-purple-600 to-fuchsia-700',
    },
  ];

  const SENSES_QUESTIONS = [
    {
      id: 1,
      scenarioAr: 'أَسْمَعُ صَوْتَ أَذَانِ صَلَاةِ الظُّهْرِ بِـ ...',
      correctSense: 'hearing',
      options: [
        { id: 'hearing', textAr: 'الأُذُنِ (حَاسَّةُ السَّمْعِ)' },
        { id: 'sight', textAr: 'العَيْنِ (حَاسَّةُ البَصَرِ)' },
        { id: 'taste', textAr: 'اللِّسَانِ (حَاسَّةُ الذَّوْقِ)' },
      ],
    },
    {
      id: 2,
      scenarioAr: 'أُمَيِّزُ أَنَّ اللَّيْمُونَ حَامِضٌ وَالعَسَلَ حُلْوٌ بِـ ...',
      correctSense: 'taste',
      options: [
        { id: 'taste', textAr: 'اللِّسَانِ (حَاسَّةُ الذَّوْقِ)' },
        { id: 'smell', textAr: 'الأَنْفِ (حَاسَّةُ الشَّمِّ)' },
        { id: 'touch', textAr: 'اليَدِ (حَاسَّةُ اللَّمْسِ)' },
      ],
    },
  ];

  const PLANT_STAGES_INFO = [
    { stage: 1, titleAr: '1. البذرة في التربة (Graine)', descAr: 'بذرة نائمة في تربة خصبة تحتاج للماء والدفء.', icon: '🟤' },
    { stage: 2, titleAr: '2. الإنتاش (Germination)', descAr: 'ظهور الجذير الصغير متجهاً نحو الأسفل والرويشة نحو الأعلى.', icon: '🌱' },
    { stage: 3, titleAr: '3. نمو الساق والأوراق (Croissance)', descAr: 'ظهور الساق الخضراء والأوراق التي تمتص ضوء الشمس.', icon: '🌿' },
    { stage: 4, titleAr: '4. نبتة كاملة مزهرة ومثمرة (Plante adulte)', descAr: 'نبتة يانعة بأزهار وثمار وجذور قوية تمتص الماء والأملاح.', icon: '🌸' },
  ];

  const handleWater = () => {
    setHasWater(true);
    if (hasSun && plantStage < 4) {
      setPlantStage((prev) => prev + 1);
      setPlantMessage('رائع! توفر الماء والشمس فكبرت النبتة درجة! 🌿');
      onReward?.(5, 15);
    } else {
      setPlantMessage('سقيت النبتة بالماء المنعش 💧، وفر لها ضوء الشمس الآن!');
    }
  };

  const handleSun = () => {
    setHasSun(true);
    if (hasWater && plantStage < 4) {
      setPlantStage((prev) => prev + 1);
      setPlantMessage('ممتاز! بفضل ضوء الشمس والماء، نمت النبتة وأزهرت! 🌸');
      onReward?.(5, 15);
    } else {
      setPlantMessage('تشرق الشمس على النبتة ☀️، اسقها بالماء الآن!');
    }
  };

  const resetPlant = () => {
    setPlantStage(1);
    setHasWater(false);
    setHasSun(false);
    setPlantMessage('قم بسقي البذرة وتوفير ضوء الشمس لتنمو النبتة!');
  };

  const RIGHTS_CARDS = [
    { id: 1, textAr: 'الحصول على التعليم المجاني في المدرسة', type: 'right', labelAr: 'حَقٌّ مِن حُقُوقِي 📜' },
    { id: 2, textAr: 'احترام المعلمين وزملائي والحفاظ على نظافة القسم', type: 'duty', labelAr: 'وَاجِبٌ عَلَيَّ 🤝' },
    { id: 3, textAr: 'العلاج والرعاية الصحية عند المرض', type: 'right', labelAr: 'حَقٌّ مِن حُقُوقِي 📜' },
    { id: 4, textAr: 'طاعة الوالدين ومساعدتهما في البيت', type: 'duty', labelAr: 'وَاجِبٌ عَلَيَّ 🤝' },
  ];

  const handleRightChoice = (cardId: number, choice: 'right' | 'duty', correctType: string) => {
    setRightsAnswers((prev) => ({ ...prev, [cardId]: choice }));
    if (choice === correctType) {
      setRightsScore((prev) => prev + 1);
      onReward?.(5, 15);
    }
  };

  return (
    <div className="space-y-6 dir-rtl max-w-5xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-700 via-cyan-800 to-blue-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-teal-600/40 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 text-white px-3 py-1 rounded-full text-xs font-black">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>مختبر الإيقاظ العلمي والتربية المدنية (1AP / 2AP)</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black font-sans">
            الحواس الخمس، مراحل نمو النبات، وحقوق وواجبات الطفل
          </h1>
          <p className="text-xs sm:text-sm text-cyan-100 leading-relaxed max-w-3xl">
            اكتشف أعضاء الحواس الخمس ووظائفها، جرب محاكاة نمو النبتة بالماء والشمس، وتعرّف على حقوقك وواجباتك كمواطن صالح.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--app-card-border)] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('five_senses')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'five_senses'
              ? 'bg-teal-600 text-white shadow-md'
              : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
          }`}
        >
          <span>👁️ الحواس الخمس (الأعضاء والوظائف)</span>
        </button>

        <button
          onClick={() => setActiveTab('plant_growth')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'plant_growth'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
          }`}
        >
          <span>🌱 مراحل نمو النبتة واحتياجاتها</span>
        </button>

        <button
          onClick={() => setActiveTab('children_rights')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'children_rights'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
          }`}
        >
          <span>⚖️ حقوق الطفل وواجباته في المدرسة والبيت</span>
        </button>
      </div>

      {/* TAB 1: Five Senses */}
      {activeTab === 'five_senses' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {SENSES_DATA.map((sense) => {
              const isSelected = selectedSense === sense.id;
              return (
                <button
                  key={sense.id}
                  onClick={() => setSelectedSense(sense.id)}
                  className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                    isSelected
                      ? 'bg-teal-600 text-white border-teal-500 shadow-md scale-105 ring-2 ring-teal-400'
                      : 'bg-[var(--app-card-bg)] text-[var(--app-text)] border-[var(--app-card-border)] hover:border-teal-400/50'
                  }`}
                >
                  <span className="text-3xl">{sense.icon}</span>
                  <span className="font-black text-xs">{sense.nameAr}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-teal-100 text-teal-900'
                    }`}
                  >
                    {sense.organAr}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Sense Detail Card */}
          {(() => {
            const cur = SENSES_DATA.find((s) => s.id === selectedSense) || SENSES_DATA[0];
            return (
              <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-teal-500/10 flex items-center justify-center text-4xl shrink-0">
                    {cur.icon}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-[var(--app-text)]">{cur.nameAr}</h3>
                    <p className="text-xs font-bold text-teal-600">العضو المسؤول: {cur.organAr}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--app-card-subtle)] border border-[var(--app-card-border)] text-sm font-bold text-[var(--app-text)] leading-relaxed">
                  💡 {cur.roleAr}
                </div>
              </div>
            );
          })()}

          {/* Senses Mini Quiz */}
          <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-[var(--app-text)]">اختبر معلوماتك في الحواس:</h3>
            <div className="space-y-4">
              {SENSES_QUESTIONS.map((q) => {
                const isAnswered = !!sensesAnswered[q.id];
                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-2xl border border-[var(--app-card-border)] bg-[var(--app-card-subtle)] space-y-3"
                  >
                    <p className="text-xs sm:text-sm font-black text-[var(--app-text)]">{q.scenarioAr}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {q.options.map((opt) => {
                        const isCorrect = opt.id === q.correctSense;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => {
                              if (!isAnswered) {
                                setSensesAnswered((prev) => ({ ...prev, [q.id]: true }));
                                if (isCorrect) {
                                  setSensesQuizScore((s) => s + 1);
                                  onReward?.(5, 15);
                                }
                              }
                            }}
                            className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              isAnswered
                                ? isCorrect
                                  ? 'bg-emerald-100 border-emerald-500 text-emerald-900 font-black'
                                  : 'bg-slate-100 text-slate-400 border-slate-200'
                                : 'bg-[var(--app-card-bg)] text-[var(--app-text)] border-[var(--app-card-border)] hover:border-teal-400'
                            }`}
                          >
                            {opt.textAr}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Plant Growth Simulation */}
      {activeTab === 'plant_growth' && (
        <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <div className="border-b border-[var(--app-card-border)] pb-4 space-y-1">
            <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
              محاكاة نمو النبات الأخضر
            </span>
            <h2 className="text-lg font-black text-[var(--app-text)]">
              ماذا تحتاج النبتة لتنمو وتزهر؟
            </h2>
          </div>

          {/* Plant Display Pot */}
          <div className="max-w-md mx-auto p-8 rounded-3xl bg-gradient-to-b from-sky-100 to-amber-100 border-2 border-emerald-300 space-y-4">
            <div className="text-7xl animate-bounce duration-1000">
              {PLANT_STAGES_INFO[plantStage - 1].icon}
            </div>
            <div className="font-black text-base text-emerald-950 font-sans">
              {PLANT_STAGES_INFO[plantStage - 1].titleAr}
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              {PLANT_STAGES_INFO[plantStage - 1].descAr}
            </p>

            {/* Status of elements */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <span className={`text-xs font-black px-3 py-1 rounded-full ${hasWater ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                💧 الماء: {hasWater ? 'متوفر' : 'ناقص'}
              </span>
              <span className={`text-xs font-black px-3 py-1 rounded-full ${hasSun ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                ☀️ الضوء: {hasSun ? 'متوفر' : 'ناقص'}
              </span>
            </div>
          </div>

          <p className="text-xs font-bold text-emerald-700">{plantMessage}</p>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={handleWater}
              className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Droplets className="w-4 h-4" />
              <span>اسقِ بالماء 💧</span>
            </button>

            <button
              onClick={handleSun}
              className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Sun className="w-4 h-4" />
              <span>وفّر ضوء الشمس ☀️</span>
            </button>

            <button
              onClick={resetPlant}
              className="p-3 rounded-2xl bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] transition-colors cursor-pointer"
              title="إعادة غرس بذرة جديدة"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: Children's Rights & Duties */}
      {activeTab === 'children_rights' && (
        <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-[var(--app-card-border)] pb-4 space-y-1">
            <span className="text-xs font-black text-blue-700 bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
              التربية المدنية: ميثاق حقوقي وواجباتي
            </span>
            <h2 className="text-lg font-black text-[var(--app-text)]">
              ميّز بين ما هو "حَقٌّ لَكَ" وما هو "وَاجِبٌ عَلَيْكَ"
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {RIGHTS_CARDS.map((card) => {
              const userAns = rightsAnswers[card.id];
              const isCorrect = userAns === card.type;

              return (
                <div
                  key={card.id}
                  className="p-5 rounded-2xl border border-[var(--app-card-border)] bg-[var(--app-card-subtle)] space-y-4"
                >
                  <p className="font-black text-sm text-[var(--app-text)] leading-relaxed">{card.textAr}</p>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleRightChoice(card.id, 'right', card.type)}
                      className={`p-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        userAns === 'right'
                          ? isCorrect
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-rose-600 text-white'
                          : 'bg-[var(--app-card-bg)] border border-[var(--app-card-border)] text-[var(--app-text)] hover:border-blue-400'
                      }`}
                    >
                      حَقٌّ لِي 📜
                    </button>
                    <button
                      onClick={() => handleRightChoice(card.id, 'duty', card.type)}
                      className={`p-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        userAns === 'duty'
                          ? isCorrect
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-rose-600 text-white'
                          : 'bg-[var(--app-card-bg)] border border-[var(--app-card-border)] text-[var(--app-text)] hover:border-blue-400'
                      }`}
                    >
                      وَاجِبٌ عَلَيَّ 🤝
                    </button>
                  </div>

                  {userAns && (
                    <div
                      className={`text-[11px] font-bold p-2 rounded-lg text-center ${
                        isCorrect ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                      }`}
                    >
                      {isCorrect ? 'إجابة صحيحة! أحسنت يا بطل 🌟' : `غير صحيح، هذا يمثل: ${card.labelAr}`}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
