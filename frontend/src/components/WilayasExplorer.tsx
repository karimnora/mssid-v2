import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { speakText as speakTextShared } from '../utils/speech';
import {
  MapPin,
  Search,
  Award,
  Volume2,
  Sparkles,
  Compass,
  CheckCircle,
  XCircle,
  HelpCircle,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Flag,
  Share2,
  Printer,
  Trophy,
  ShieldCheck,
  Navigation,
  Globe,
  Layers,
  ChevronRight,
  ChevronLeft,
  Star,
  Flame,
  Check,
} from 'lucide-react';
import { WILAYAS_LIST } from '../data/wilayasData';
import { WilayaInfo } from '../types/ecosystem';
import { PrimaryGrade } from '../types';
import { AuthService } from '../services/authService';

interface WilayasExplorerProps {
  onBack?: () => void;
  grade?: PrimaryGrade;
  onReward?: (coins: number, xp: number) => void;
}

// wilayasData.ts's mapPosition values are geographically literal, but Algeria's real geography
// crams the huge majority of wilayas (30 of 58) into just the northernmost ~12% of that vertical
// range (the coastal/Tell band) while the sparse Sahara stretches over the remaining ~80% — so a
// literal 1:1 plot makes ~30 pins overlap into an unreadable blob at the top of the map. This
// stretches that crowded band out to ~42% of the display height (compressing the sparser south
// to make room) so every pin gets breathing room, at the cost of exact geographic proportion —
// a legibility trade worth making for a tap target aimed at 8-11 year olds.
const CROWDED_BAND_MAX_Y = 29;
const remapMapY = (y: number): number => {
  if (y <= CROWDED_BAND_MAX_Y) {
    return 4 + ((y - 17) / (CROWDED_BAND_MAX_Y - 17)) * 42;
  }
  return 46 + ((y - 30) / (96 - 30)) * 52;
};

// 6 Guided Algerian Expeditions
interface Expedition {
  id: string;
  titleAr: string;
  titleFr: string;
  badge: string;
  descriptionAr: string;
  regionColor: string;
  wilayaCodes: number[];
  rewardCoins: number;
  rewardXp: number;
}

const EXPEDITIONS_LIST: Expedition[] = [
  {
    id: 'coastal_belt',
    titleAr: '1. شريط الساحل الأزرق والمرجان',
    titleFr: 'La Ceinture Bleue Côtière',
    badge: '🌊',
    descriptionAr: 'من الطارف والقالة شرقاً حتى تلمسان والغزوات غرباً عبر 14 ولاية ساحلية فاتنة.',
    regionColor: 'from-blue-600 to-cyan-500',
    wilayaCodes: [36, 23, 21, 18, 6, 15, 35, 16, 42, 2, 27, 31, 46, 13],
    rewardCoins: 40,
    rewardXp: 80,
  },
  {
    id: 'tell_plains',
    titleAr: '2. سهول الأطلس التلي والتاريخ الأشم',
    titleFr: 'Plaines Telliennes & Villes Royales',
    badge: '🏰',
    descriptionAr: 'مدن الورود والتيطري ومعسكر موطن الأمير عبد القادر وقلاع سيدي بلعباس.',
    regionColor: 'from-emerald-600 to-teal-500',
    wilayaCodes: [9, 26, 44, 48, 29, 22, 24, 41, 10],
    rewardCoins: 35,
    rewardXp: 70,
  },
  {
    id: 'high_plateaus',
    titleAr: '3. الهضاب العليا، سيرتا والأوراس',
    titleFr: 'Hauts Plateaux & Aurès Antique',
    badge: '🦅',
    descriptionAr: 'عواصم الحبوب، مدينة الجسور المعلقة قسنطينة، تيمقاد الأثرية ومهد الثورة.',
    regionColor: 'from-amber-600 to-orange-500',
    wilayaCodes: [19, 34, 25, 5, 4, 40, 43, 20, 14, 38, 12],
    rewardCoins: 45,
    rewardXp: 90,
  },
  {
    id: 'desert_gates',
    titleAr: '4. السهوب وبوابات الزيبان',
    titleFr: 'Les Portes du Désert & Zibans',
    badge: '🌾',
    descriptionAr: 'مراعي الحلفاء، عروس الزيبان بسكرة ومسقط رأس البطل العربي بن مهيدي.',
    regionColor: 'from-amber-700 to-yellow-600',
    wilayaCodes: [7, 3, 17, 28, 45, 32, 51],
    rewardCoins: 40,
    rewardXp: 80,
  },
  {
    id: 'ancient_oasis',
    titleAr: '5. الواحات العتيقة، وادي ميزاب والريغ',
    titleFr: 'Les Grandes Oasis & M\'zab',
    badge: '🌴',
    descriptionAr: 'العمارة الميزابية العالمية، مدينة الألف قبة الوادي، وحقول النخيل الشامخة.',
    regionColor: 'from-teal-700 to-emerald-600',
    wilayaCodes: [47, 30, 39, 55, 57, 58],
    rewardCoins: 40,
    rewardXp: 80,
  },
  {
    id: 'great_sahara',
    titleAr: '6. أعماق الصحراء، الطاسيلي والهقار',
    titleFr: 'Le Grand Sahara & Terres d\'Aventures',
    badge: '🐪',
    descriptionAr: 'عروس الهقار تمنراست، نقوش الطاسيلي جانت، وقصور الساورة وعروق الرمال الكبرى.',
    regionColor: 'from-rose-700 to-amber-700',
    wilayaCodes: [11, 33, 37, 8, 1, 49, 50, 52, 53, 54, 56],
    rewardCoins: 60,
    rewardXp: 120,
  },
];

// Adventure Rank helper
const getAdventureRank = (count: number) => {
  if (count >= 58) {
    return {
      titleAr: '👑 فارس الـ 58 ولاية الأسطوري',
      titleFr: 'Légende Suprême des 58 Wilayas',
      color: 'text-amber-400 bg-amber-950/60 border-amber-500',
      tier: 5,
    };
  }
  if (count >= 40) {
    return {
      titleAr: '🥇 سفير التراث والوطن الجزائري',
      titleFr: 'Grand Ambassadeur DZ',
      color: 'text-emerald-300 bg-emerald-950/60 border-emerald-500',
      tier: 4,
    };
  }
  if (count >= 25) {
    return {
      titleAr: '🥈 رحالة القوافل والواحات',
      titleFr: 'Grand Voyageur des Caravanes',
      color: 'text-teal-300 bg-teal-950/60 border-teal-500',
      tier: 3,
    };
  }
  if (count >= 10) {
    return {
      titleAr: '🥉 مستكشف مدن وسهوب الجزائر',
      titleFr: 'Explorateur Passionné',
      color: 'text-blue-300 bg-blue-950/60 border-blue-500',
      tier: 2,
    };
  }
  return {
    titleAr: '🌱 مبتدئ في درب الاستكشاف',
    titleFr: 'Jeune Apprenti Explorateur',
    color: 'text-slate-300 bg-slate-800 border-slate-600',
    tier: 1,
  };
};

export const WilayasExplorer: React.FC<WilayasExplorerProps> = ({
  onBack,
  grade = '5AP',
  onReward,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedWilaya, setSelectedWilaya] = useState<WilayaInfo>(WILAYAS_LIST[15]); // Alger (16)
  const [activeTab, setActiveTab] = useState<
    'map_list' | 'expeditions' | 'detective' | 'quiz' | 'passport'
  >('map_list');
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [mapZoomLevel, setMapZoomLevel] = useState<'national' | 'north' | 'south'>('national');
  // True optical zoom (distinct from mapZoomLevel's region filter above): grows the map's real
  // pixel size inside its scrollable wrapper, so the browser's native scroll/drag handles panning
  // for free instead of hand-rolling pointer-drag logic — works the same with mouse, trackpad and
  // touch. Steps of 0.5x, 1x (fit) to 3x (close-up on the crowded north).
  const MAP_ZOOM_MIN = 1;
  const MAP_ZOOM_MAX = 3;
  const [mapScale, setMapScale] = useState(1);
  const zoomIn = () => setMapScale((z) => Math.min(MAP_ZOOM_MAX, +(z + 0.5).toFixed(1)));
  const zoomOut = () => setMapScale((z) => Math.max(MAP_ZOOM_MIN, +(z - 0.5).toFixed(1)));
  const certificatePrintRef = useRef<HTMLDivElement>(null);

  // Visited / Discovered wilayas for the passport
  const [discoveredCodes, setDiscoveredCodes] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('mssid_discovered_wilayas');
      return saved ? JSON.parse(saved) : [16, 31, 25, 5, 47, 1];
    } catch {
      return [16, 31, 25, 5, 47, 1];
    }
  });

  // Completed Expeditions
  const [completedExpeditions, setCompletedExpeditions] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mssid_completed_expeditions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Mark wilaya as discovered
  const handleSelectWilaya = (w: WilayaInfo) => {
    setSelectedWilaya(w);
    if (!discoveredCodes.includes(w.code)) {
      const updated = [...discoveredCodes, w.code];
      setDiscoveredCodes(updated);
      try {
        localStorage.setItem('mssid_discovered_wilayas', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      if (onReward) {
        onReward(10, 20);
      }
    }
  };

  // Text to Speech narration
  const speakText = (text: string) => {
    speakTextShared(text, 'ar-SA', 0.92);
  };

  // Filtered Wilayas
  const filteredWilayas = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return WILAYAS_LIST.filter((w) => {
      const matchesSearch =
        !term ||
        w.nameAr.includes(term) ||
        w.codeStr.includes(term) ||
        w.capitalAr.includes(term) ||
        w.nameFr.toLowerCase().includes(term) ||
        (w.monumentAr && w.monumentAr.includes(term)) ||
        (w.famousForAr && w.famousForAr.includes(term));

      let matchesRegion = true;
      if (selectedRegion === 'north') matchesRegion = w.region === 'north';
      else if (selectedRegion === 'high_plateaus') matchesRegion = w.region === 'high_plateaus';
      else if (selectedRegion === 'sahara') matchesRegion = w.region === 'sahara';
      else if (selectedRegion === 'new_wilayas') matchesRegion = w.code >= 49;

      return matchesSearch && matchesRegion;
    });
  }, [searchTerm, selectedRegion]);

  // Claim Expedition Reward
  const handleClaimExpedition = (exp: Expedition) => {
    if (completedExpeditions.includes(exp.id)) return;
    const isCompleted = exp.wilayaCodes.every((code) => discoveredCodes.includes(code));
    if (!isCompleted) return;

    const updated = [...completedExpeditions, exp.id];
    setCompletedExpeditions(updated);
    try {
      localStorage.setItem('mssid_completed_expeditions', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    if (onReward) {
      onReward(exp.rewardCoins, exp.rewardXp);
    }
    speakText(`تهانينا! لقد أتممت ${exp.titleAr} بنجاح وحصلت على وسام الرحلة!`);
  };

  // ==========================================
  // --- DETECTIVE / MYSTERY MODE ---
  // ==========================================
  const [detectiveTargetIndex, setDetectiveTargetIndex] = useState(0);
  const [revealedCluesCount, setRevealedCluesCount] = useState(1);
  const [detectiveScore, setDetectiveScore] = useState(0);
  const [detectiveFeedback, setDetectiveFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  const detectiveTargets = useMemo(() => {
    return [
      {
        wilaya: WILAYAS_LIST[24], // Constantine (25)
        clues: [
          'تقع في منطقة الهضاب العليا والشرق الجزائري.',
          'مدينة تاريخية عريقة شيدت فوق صخرة عاتية وعرفت قديماً باسم سيرتا عاصمة نوميديا.',
          'تسمى مدينة الجسور المعلقة وفيها قصر أحمد باي ومسجد الأمير عبد القادر.',
        ],
      },
      {
        wilaya: WILAYAS_LIST[4], // Batna (5)
        clues: [
          'تعتبر عاصمة الأوراس الأشم والرمز الخالد لاندلاع ثورة أول نوفمبر 1954.',
          'تشتهر بشرفات غوفي الساحرة وغابات الأرز الأطلسي في الحظيرة الوطنية لبلزمة.',
          'تحتضن المدينة الأثرية الرومانية العالمية تيمقاد المحفوظة بروعة.',
        ],
      },
      {
        wilaya: WILAYAS_LIST[46], // Ghardaïa (47)
        clues: [
          'واحة تاريخية تقع في قلب وادي ميزاب مصنفة تراثاً إنسانياً عالمياً لدى اليونسكو.',
          'تضم القصور الخمسة العتيقة ذات الهندسة المعمارية الفريدة (بني يزقن، غرداية، العطف...).',
          'تشتهر بنظام تقسيم مياه السيول والزرابي الصوفية التقليدية الجميلة.',
        ],
      },
      {
        wilaya: WILAYAS_LIST[10], // Tamanrasset (11)
        clues: [
          'جوهرة الصحراء الكبرى وعاصمة جبال الهقار الشامخة.',
          'موطن قمة الأسكرام الشهيرة بأجمل شروق وغروب للشمس في العالم.',
          'مهد تراث التوارق الأصيل ومقبرة الملكة تين هينان بأباليسا.',
        ],
      },
      {
        wilaya: WILAYAS_LIST[30], // Oran (31)
        clues: [
          'ثاني أكبر مدن الجزائر وتلقب بالباهية وتقع على الساحل الغربي.',
          'يعلوها جبل مرجاجو الشامخ ومعه قلعة وكنيسة سانتا كروز التاريخية.',
          'تشتهر بحي سيدي الهواري العتيق وميناء وهران الحيوي.',
        ],
      },
      {
        wilaya: WILAYAS_LIST[12], // Tlemcen (13)
        clues: [
          'لؤلؤة المغرب العربي وعاصمة الزيانيين التاريخية وأرض الفن والأندلس.',
          'تحتضن صومعة المنصورة الشامخة ومغارات بني عاد العجيبة ومسجد سيدي بومدين.',
          'تشتهر بلباس الشدة التلمسانية المصنف عالمياً وزهر البرتقال العطر.',
        ],
      },
      {
        wilaya: WILAYAS_LIST[6], // Biskra (7)
        clues: [
          'تلقب بعروس الزيبان وبوابة الصحراء الشرقية الشاسعة.',
          'أكبر وأشهر موطن لإنتاج تمور دقلة نور الذهبية الفاخرة عالمياً.',
          'تحتضن واحة سيدي عقبة التاريخية ومضايق خنقة سيدي ناجي.',
        ],
      },
      {
        wilaya: WILAYAS_LIST[55], // Djanet (56)
        clues: [
          'عروس الطاسيلي نآجر وأرض النقوش الصخرية التي تعود لآلاف السنين قبل التاريخ.',
          'تشتهر بصخرة البقرة الباكية المنحوتة العجيبة وواحة إهرير الساحرة.',
          'يقام فيها مهرجان السبيبة التقليدي المصنف تراثاً لا مادياً عالمياً.',
        ],
      },
    ];
  }, []);

  const currentDetectiveMission = detectiveTargets[detectiveTargetIndex % detectiveTargets.length];

  const detectiveOptions = useMemo(() => {
    const target = currentDetectiveMission.wilaya;
    const others = WILAYAS_LIST.filter((w) => w.code !== target.code)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    return [target, ...others].sort(() => 0.5 - Math.random());
  }, [currentDetectiveMission]);

  const handleDetectiveGuess = (chosen: WilayaInfo) => {
    if (detectiveFeedback) return;
    const isCorrect = chosen.code === currentDetectiveMission.wilaya.code;
    if (isCorrect) {
      const bonusCoins = revealedCluesCount === 1 ? 25 : revealedCluesCount === 2 ? 15 : 10;
      const bonusXp = revealedCluesCount === 1 ? 40 : 25;
      setDetectiveScore((prev) => prev + bonusCoins);
      setDetectiveFeedback({
        isCorrect: true,
        message: `عبقري! إجابة صحيحة! الولاية السرية هي ${chosen.nameAr} (${chosen.codeStr})! نلت ${bonusCoins} قطعة ذهبية! 🌟`,
      });
      speakText(`ممتاز! إجابة صحيحة. الولاية هي ${chosen.nameAr}.`);
      if (onReward) onReward(bonusCoins, bonusXp);
    } else {
      setDetectiveFeedback({
        isCorrect: false,
        message: `محاولة غير صائبة! الولاية المقصودة هي ${currentDetectiveMission.wilaya.nameAr} (${currentDetectiveMission.wilaya.codeStr}). تابع التدريب!`,
      });
      speakText(`للأسف إجابة خاطئة. الولاية الصحيحة هي ${currentDetectiveMission.wilaya.nameAr}.`);
    }
  };

  const handleNextDetective = () => {
    setDetectiveTargetIndex((prev) => prev + 1);
    setRevealedCluesCount(1);
    setDetectiveFeedback(null);
  };

  // ==========================================
  // --- QUIZ MODE STATE ---
  // ==========================================
  const [quizScore, setQuizScore] = useState(0);
  const [quizStreak, setQuizStreak] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [isQuizAnswered, setIsQuizAnswered] = useState(false);
  const [quizFeedback, setQuizFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Question Type: 0 = Number, 1 = Monument, 2 = Capital, 3 = Specialty
  const questionType = quizIndex % 4;
  const currentQuizTarget = WILAYAS_LIST[quizIndex % WILAYAS_LIST.length];

  const quizOptions = useMemo(() => {
    const others = WILAYAS_LIST.filter((w) => w.code !== currentQuizTarget.code)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    return [currentQuizTarget, ...others].sort(() => 0.5 - Math.random());
  }, [currentQuizTarget, quizIndex]);

  const handleQuizAnswer = (chosenWilaya: WilayaInfo) => {
    if (isQuizAnswered) return;
    setSelectedQuizOption(chosenWilaya.codeStr);
    setIsQuizAnswered(true);

    const isCorrect = chosenWilaya.code === currentQuizTarget.code;
    if (isCorrect) {
      const earnedCoins = 10 + (quizStreak >= 2 ? 5 : 0);
      const earnedXp = 20;
      setQuizScore((prev) => prev + 1);
      setQuizStreak((prev) => prev + 1);
      setQuizFeedback({
        isCorrect: true,
        text: `أحسنت! إجابة صحيحة! ولاية ${currentQuizTarget.nameAr} رقمها (${currentQuizTarget.codeStr}) وعاصمتها ${currentQuizTarget.capitalAr}. 🇩🇿`,
      });
      speakText(`ممتاز! إجابة صحيحة. ولاية ${currentQuizTarget.nameAr}.`);
      AuthService.addScore(earnedXp);
      if (onReward) onReward(earnedCoins, earnedXp);
    } else {
      setQuizStreak(0);
      setQuizFeedback({
        isCorrect: false,
        text: `للأسف إجابة خاطئة! الولاية الصحيحة هي ${currentQuizTarget.nameAr} (رقم ${currentQuizTarget.codeStr})، وعاصمتها ${currentQuizTarget.capitalAr}.`,
      });
      speakText(`إجابة غير صحيحة. الولاية المقصودة هي ${currentQuizTarget.nameAr}.`);
    }
  };

  const handleNextQuiz = () => {
    setQuizIndex((prev) => prev + 1);
    setSelectedQuizOption(null);
    setIsQuizAnswered(false);
    setQuizFeedback(null);
  };

  const currentRank = getAdventureRank(discoveredCodes.length);

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6 dir-rtl text-right" dir="rtl">
      {/* Top Banner with Rank & Stats */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-900 via-teal-900 to-amber-900 rounded-[32px] p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-500/30">
        <div className="flex items-center gap-4 z-10">
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-white/15 backdrop-blur-md flex items-center justify-center text-4xl sm:text-5xl shadow-inner border border-white/30 shrink-0">
            🇩🇿
          </div>
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                مسار مغامرة الـ 58 ولاية الجزائري
              </h1>
              <span className="bg-amber-400 text-amber-950 text-xs font-black px-3 py-1 rounded-full shadow-xs">
                Pass Aventure DZ
              </span>
            </div>
            <p className="text-emerald-100 text-xs sm:text-sm font-medium max-w-2xl leading-relaxed">
              سافر في ربوع الجزائر الحبيبة: اجمع الأختام الوطنية، اختبر معلوماتك، ونل شهادة المستكشف الفخرية!
            </p>
            {/* Rank badge */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className={`px-3 py-1 rounded-xl text-xs font-black border ${currentRank.color}`}>
                {currentRank.titleAr}
              </span>
              <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-xl">
                استكشفت {discoveredCodes.length} من 58 ولاية ({Math.round((discoveredCodes.length / 58) * 100)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons on top */}
        <div className="flex flex-wrap items-center gap-2 z-10 shrink-0">
          <button
            onClick={() => setShowCertificateModal(true)}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-amber-950 rounded-2xl font-black text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Trophy className="w-4 h-4" />
            <span>شهادة المستكشف الوطني</span>
          </button>

          {onBack && (
            <button
              onClick={onBack}
              aria-label="العودة للأدوات"
              className="w-11 h-11 flex items-center justify-center bg-white/15 hover:bg-white/25 text-white rounded-2xl transition-all border border-white/30 shadow-sm cursor-pointer"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -left-12 -bottom-12 w-56 h-56 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Mode Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-[var(--app-card-bg)] p-2 rounded-2xl border border-[var(--app-card-border)] shadow-xs">
        <button
          onClick={() => setActiveTab('map_list')}
          className={`py-3 px-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'map_list'
              ? 'bg-emerald-600 text-white shadow-md scale-[1.02]'
              : 'text-[var(--app-text-muted)] hover:bg-[var(--app-card-subtle)]'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>🗺️ الخريطة والدليل</span>
        </button>

        <button
          onClick={() => setActiveTab('expeditions')}
          className={`py-3 px-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'expeditions'
              ? 'bg-blue-600 text-white shadow-md scale-[1.02]'
              : 'text-[var(--app-text-muted)] hover:bg-[var(--app-card-subtle)]'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>🚀 مسار الرحلات الست</span>
        </button>

        <button
          onClick={() => setActiveTab('detective')}
          className={`py-3 px-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'detective'
              ? 'bg-purple-600 text-white shadow-md scale-[1.02]'
              : 'text-[var(--app-text-muted)] hover:bg-[var(--app-card-subtle)]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>🕵️ المحقق الجغرافي</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`py-3 px-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'quiz'
              ? 'bg-amber-600 text-white shadow-md scale-[1.02]'
              : 'text-[var(--app-text-muted)] hover:bg-[var(--app-card-subtle)]'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>🏆 المسابقة الكبرى</span>
        </button>

        <button
          onClick={() => setActiveTab('passport')}
          className={`py-3 px-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer col-span-2 sm:col-span-1 ${
            activeTab === 'passport'
              ? 'bg-teal-600 text-white shadow-md scale-[1.02]'
              : 'text-[var(--app-text-muted)] hover:bg-[var(--app-card-subtle)]'
          }`}
        >
          <Flag className="w-4 h-4" />
          <span>🛂 جواز السفر والأختام</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: INTERACTIVE MAP & GUIDE                           */}
      {/* ======================================================== */}
      {activeTab === 'map_list' && (
        <div className="space-y-6">
          {/* Interactive SVG Algeria Map Canvas */}
          <div className="bg-[var(--app-card-bg)] rounded-3xl p-5 sm:p-6 border border-[var(--app-card-border)] shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[var(--app-card-border)] pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base sm:text-lg font-black text-[var(--app-text)]">
                  خريطة الجزائر التفاعلية — انقر على أي ولاية لاستكشافها
                </h3>
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 text-xs w-full sm:w-auto">
                <span className="text-[var(--app-text-muted)] font-medium w-full sm:w-auto text-center sm:text-start">عرض النطاق:</span>
                <button
                  onClick={() => setMapZoomLevel('national')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    mapZoomLevel === 'national'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)]'
                  }`}
                >
                  كامل الوطن
                </button>
                <button
                  onClick={() => setMapZoomLevel('north')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    mapZoomLevel === 'north'
                      ? 'bg-blue-600 text-white'
                      : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)]'
                  }`}
                >
                  الشمال والتلي
                </button>
                <button
                  onClick={() => setMapZoomLevel('south')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    mapZoomLevel === 'south'
                      ? 'bg-amber-600 text-white'
                      : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)]'
                  }`}
                >
                  الجنوب والصحراء
                </button>

                <span className="hidden sm:block w-px h-5 bg-[var(--app-card-border)] mx-1" />

                <button
                  onClick={zoomOut}
                  disabled={mapScale <= MAP_ZOOM_MIN}
                  aria-label="تصغير الخريطة"
                  className="min-w-[44px] min-h-[44px] rounded-lg font-black text-base flex items-center justify-center bg-[var(--app-card-subtle)] text-[var(--app-text)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:bg-[var(--app-card-bg)] border border-[var(--app-card-border)]"
                >
                  −
                </button>
                <span className="text-[11px] font-black text-[var(--app-text-muted)] w-10 text-center" dir="ltr">
                  {Math.round(mapScale * 100)}%
                </span>
                <button
                  onClick={zoomIn}
                  disabled={mapScale >= MAP_ZOOM_MAX}
                  aria-label="تكبير الخريطة"
                  className="min-w-[44px] min-h-[44px] rounded-lg font-black text-base flex items-center justify-center bg-[var(--app-card-subtle)] text-[var(--app-text)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:bg-[var(--app-card-bg)] border border-[var(--app-card-border)]"
                >
                  +
                </button>
              </div>
            </div>

            {/* Stylized Visual Map Stage — the outer div is a fixed-size scrollable "window";
                the inner stage grows to mapScale×its base size, so zooming in reveals more real
                pixel detail and native scroll/touch-drag pans around it for free (no hand-rolled
                pointer-drag math needed). */}
            <div className="w-full h-[400px] sm:h-[480px] overflow-auto rounded-2xl border border-emerald-200 dark:border-emerald-900/50">
            <div
              className="relative select-none"
              style={{ width: `${100 * mapScale}%`, height: `${420 * mapScale}px` }}
            >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-sky-100 via-amber-50 to-amber-100 dark:from-slate-900 dark:via-emerald-950/20 dark:to-amber-950/30 overflow-hidden">
              {/* Sea banner top */}
              <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-sky-400/25 to-transparent flex items-center justify-center">
                <span className="text-[11px] font-black text-sky-800 dark:text-sky-300 tracking-wider">
                  🌊 البحر الأبيض المتوسط (Méditerranée)
                </span>
              </div>

              {/* Geographic Zones Bands — percentage-based so they track remapMapY's breakpoints
                  (4%/46%/98%) rather than fixed pixel offsets tuned for the old, shorter map. */}
              <div className="absolute left-4 right-4 rounded-xl border border-blue-300/40 bg-blue-500/5 flex items-start justify-start px-4 pt-1" style={{ top: '4%', height: '25%' }}>
                <span className="text-[10px] font-black text-blue-900 dark:text-blue-300">
                  النطاق التلي والساحلي
                </span>
              </div>
              <div className="absolute left-4 right-4 rounded-xl border border-amber-300/40 bg-amber-500/5 flex items-start justify-start px-4 pt-1" style={{ top: '29%', height: '17%' }}>
                <span className="text-[10px] font-black text-amber-900 dark:text-amber-300">
                  نطاق الهضاب العليا والسهوب
                </span>
              </div>
              <div className="absolute left-4 right-4 bottom-4 rounded-xl border border-emerald-300/40 bg-emerald-500/5 flex items-end justify-start p-4" style={{ top: '46%' }}>
                <span className="text-[10px] font-black text-emerald-900 dark:text-emerald-300">
                  نطاق الصحراء والواحات وجبال الهقار والطاسيلي
                </span>
              </div>

              {/* Interactive Pins on Map */}
              {WILAYAS_LIST.map((w) => {
                const isSelected = selectedWilaya?.code === w.code;
                const isDiscovered = discoveredCodes.includes(w.code);
                const pos = w.mapPosition || { xPercent: 50, yPercent: 50 };

                // Handle filter zoom visibility
                if (mapZoomLevel === 'north' && w.region === 'sahara') return null;
                if (mapZoomLevel === 'south' && w.region === 'north') return null;

                return (
                  <button
                    key={w.code}
                    onClick={() => handleSelectWilaya(w)}
                    style={{
                      left: `${pos.xPercent}%`,
                      top: `${remapMapY(pos.yPercent)}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    title={`${w.codeStr} - ${w.nameAr}`}
                    className={`absolute z-10 transition-transform duration-200 cursor-pointer group flex flex-col items-center ${
                      isSelected ? 'scale-125 z-30' : 'hover:scale-115'
                    }`}
                  >
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[10px] font-black shadow-md border ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-white'
                          : isDiscovered
                          ? 'bg-amber-400 text-amber-950 border-amber-600'
                          : 'bg-white/90 text-slate-800 border-slate-300'
                      }`}
                    >
                      {w.codeStr}
                    </span>
                    <span className="text-[9px] font-bold text-slate-800 dark:text-slate-200 bg-white/80 dark:bg-black/60 px-1 rounded-sm mt-0.5 shadow-2xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      {w.nameAr}
                    </span>
                  </button>
                );
              })}
            </div>
            </div>
            </div>
          </div>

          {/* Grid of Wilayas & Selected Wilaya Details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* List & Filtering Section (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Search & Region Filters */}
              <div className="bg-[var(--app-card-bg)] p-4 rounded-3xl border border-[var(--app-card-border)] shadow-xs space-y-3">
                <div className="relative">
                  <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="ابحث برقم الولاية (مثال: 16، 31) أو بالاسم (مثال: وهران، تيمقاد)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pr-11 pl-4 py-3 bg-[var(--app-card-subtle)] rounded-2xl text-xs sm:text-sm font-bold border border-[var(--app-card-border)] focus:outline-emerald-500 text-[var(--app-text)] placeholder:text-slate-400"
                  />
                </div>

                {/* Region Pills */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    { id: 'all', label: 'كل الولايات (58)' },
                    { id: 'north', label: '🌊 الشمال والساحل' },
                    { id: 'high_plateaus', label: '🌾 الهضاب العليا' },
                    { id: 'sahara', label: '🌴 الجنوب الكبير' },
                    { id: 'new_wilayas', label: '✨ الولايات المستحدثة (49-58)' },
                  ].map((reg) => (
                    <button
                      key={reg.id}
                      onClick={() => setSelectedRegion(reg.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        selectedRegion === reg.id
                          ? 'bg-emerald-600 text-white shadow-xs scale-[1.02]'
                          : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
                      }`}
                    >
                      {reg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wilayas Mini Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[560px] overflow-y-auto pr-1">
                {filteredWilayas.map((w) => {
                  const isSelected = selectedWilaya?.code === w.code;
                  const isDiscovered = discoveredCodes.includes(w.code);
                  return (
                    <motion.button
                      key={w.code}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleSelectWilaya(w)}
                      className={`p-3 rounded-2xl border text-right transition-all flex items-center gap-2.5 cursor-pointer relative overflow-hidden ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-[1.02]'
                          : 'bg-[var(--app-card-bg)] hover:bg-[var(--app-card-subtle)] border-[var(--app-card-border)] text-[var(--app-text)] shadow-xs'
                      }`}
                    >
                      {/* Number Badge */}
                      <span
                        className={`w-9 h-9 rounded-xl font-black text-xs flex items-center justify-center shrink-0 shadow-xs ${
                          isSelected
                            ? 'bg-white text-emerald-800'
                            : 'bg-emerald-50 text-emerald-950 border border-emerald-200'
                        }`}
                      >
                        {w.codeStr}
                      </span>

                      <div className="overflow-hidden">
                        <div className="flex items-center gap-1">
                          <span className="font-black text-xs truncate">{w.nameAr}</span>
                          {isDiscovered && (
                            <span className="text-[10px]" title="تم استكشافها">
                              ✨
                            </span>
                          )}
                        </div>
                        <span
                          className={`block text-[10px] font-bold truncate ${
                            isSelected ? 'text-emerald-100' : 'text-slate-400'
                          }`}
                        >
                          {w.capitalAr} • {w.nameFr}
                        </span>
                      </div>

                      {/* Regional mini dot */}
                      <div
                        className={`w-2 h-2 rounded-full absolute top-2 left-2 ${
                          w.region === 'north'
                            ? 'bg-blue-400'
                            : w.region === 'high_plateaus'
                            ? 'bg-amber-400'
                            : 'bg-emerald-500'
                        }`}
                      />
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Detailed Selected Card (5 Cols) */}
            <div className="lg:col-span-5 space-y-4 sticky top-6">
              {selectedWilaya ? (
                <div className="bg-[var(--app-card-bg)] rounded-3xl p-6 border-2 border-emerald-500 shadow-xl space-y-5">
                  {/* Header of the card */}
                  <div className="flex items-center justify-between pb-4 border-b border-[var(--app-card-border)]">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl p-3 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 shadow-inner">
                        {selectedWilaya.icon}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="bg-emerald-600 text-white text-xs font-black px-2.5 py-0.5 rounded-lg shadow-xs">
                            الولاية رقم {selectedWilaya.codeStr}
                          </span>
                          <button
                            onClick={() =>
                              speakText(
                                `ولاية ${selectedWilaya.nameAr}، عاصمتها ${selectedWilaya.capitalAr}. تشتهر بـ ${selectedWilaya.famousForAr}.`
                              )
                            }
                            className="p-1.5 bg-[var(--app-card-subtle)] hover:bg-emerald-100 rounded-lg text-slate-700 hover:text-emerald-800 transition-colors cursor-pointer"
                            title="استمع للنطق الصوتي"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                        <h2 className="text-2xl font-black text-[var(--app-text)] mt-1">
                          {selectedWilaya.nameAr}
                        </h2>
                        <p className="text-xs text-[var(--app-text-muted)] font-bold">
                          {selectedWilaya.nameFr} (Code: {selectedWilaya.codeStr})
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Key specs */}
                  <div className="space-y-2.5 text-xs sm:text-sm">
                    <div className="bg-[var(--app-card-subtle)] p-3 rounded-2xl border border-[var(--app-card-border)] flex items-center justify-between">
                      <span className="font-bold text-[var(--app-text-muted)]">عاصمة الولاية (Chef-lieu):</span>
                      <span className="font-black text-[var(--app-text)]">{selectedWilaya.capitalAr}</span>
                    </div>

                    <div className="bg-[var(--app-card-subtle)] p-3 rounded-2xl border border-[var(--app-card-border)] flex items-center justify-between">
                      <span className="font-bold text-[var(--app-text-muted)]">المنطقة الجغرافية:</span>
                      <span className="font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-xl">
                        {selectedWilaya.regionAr}
                      </span>
                    </div>

                    {selectedWilaya.postalPrefix && (
                      <div className="bg-[var(--app-card-subtle)] p-3 rounded-2xl border border-[var(--app-card-border)] flex items-center justify-between">
                        <span className="font-bold text-[var(--app-text-muted)]">الترقيم البريدي:</span>
                        <span className="font-black font-mono text-[var(--app-text)]">{selectedWilaya.postalPrefix}</span>
                      </div>
                    )}

                    {/* Monuments & History */}
                    <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-2xl border border-amber-200 dark:border-amber-900 space-y-1.5">
                      <span className="font-black text-amber-950 dark:text-amber-300 block text-xs flex items-center gap-1.5">
                        🏛️ المعالم والآثار التاريخية:
                      </span>
                      <p className="font-bold text-amber-900 dark:text-amber-200 text-xs sm:text-sm leading-relaxed">
                        {selectedWilaya.monumentAr || selectedWilaya.famousForAr}
                      </p>
                    </div>

                    {/* Specialty & Nature */}
                    {selectedWilaya.specialtyAr && (
                      <div className="bg-teal-50 dark:bg-teal-950/40 p-4 rounded-2xl border border-teal-200 dark:border-teal-900 space-y-1.5">
                        <span className="font-black text-teal-950 dark:text-teal-300 block text-xs flex items-center gap-1.5">
                          🌾 المحاصيل، الحرف والتقاليد:
                        </span>
                        <p className="font-bold text-teal-900 dark:text-teal-200 text-xs sm:text-sm leading-relaxed">
                          {selectedWilaya.specialtyAr}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Stamp & Voice Action */}
                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => {
                        speakText(
                          `ولاية ${selectedWilaya.nameAr} هي إحدى ولايات الجزائر الـ 58 الجميلة، عاصمتها ${selectedWilaya.capitalAr}.`
                        );
                      }}
                      className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>نطق صوتي للولاية 🇩🇿</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-[var(--app-card-bg)] rounded-3xl p-8 text-center text-slate-400 border border-[var(--app-card-border)]">
                  اختر ولاية من القائمة لعرض تفاصيلها الكاملة
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: 6 GUIDED EXPEDITIONS / ROAD TRIPS                */}
      {/* ======================================================== */}
      {activeTab === 'expeditions' && (
        <div className="space-y-6">
          <div className="bg-[var(--app-card-bg)] p-6 rounded-3xl border border-[var(--app-card-border)] shadow-sm space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-[var(--app-text)] flex items-center gap-2">
              <span>🚀</span>
              <span>مسار الرحلات الاستكشافية الست الكبرى</span>
            </h2>
            <p className="text-xs sm:text-sm text-[var(--app-text-muted)] font-medium">
              أكمل زيارة ولايات كل رحلة لجمع أوسمة الاستكشاف وفتح صناديق الجوائز الذهبية 🪙!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EXPEDITIONS_LIST.map((exp) => {
              const totalCount = exp.wilayaCodes.length;
              const visitedCount = exp.wilayaCodes.filter((c) => discoveredCodes.includes(c)).length;
              const isFinished = visitedCount === totalCount;
              const isClaimed = completedExpeditions.includes(exp.id);
              const progressPercent = Math.round((visitedCount / totalCount) * 100);

              return (
                <div
                  key={exp.id}
                  className="bg-[var(--app-card-bg)] rounded-3xl p-6 border border-[var(--app-card-border)] shadow-md space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl p-2.5 rounded-2xl bg-[var(--app-card-subtle)] border border-[var(--app-card-border)] shadow-xs">
                          {exp.badge}
                        </span>
                        <div>
                          <h3 className="text-base font-black text-[var(--app-text)]">
                            {exp.titleAr}
                          </h3>
                          <span className="text-[11px] text-[var(--app-text-muted)] font-bold">
                            {exp.titleFr}
                          </span>
                        </div>
                      </div>

                      {isClaimed ? (
                        <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-black px-2.5 py-1 rounded-xl flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>مكتملة 🏆</span>
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-950 text-[11px] font-black px-2.5 py-1 rounded-xl">
                          +{exp.rewardCoins} 🪙 +{exp.rewardXp} XP
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[var(--app-text-muted)] leading-relaxed font-medium">
                      {exp.descriptionAr}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-black text-[var(--app-text-muted)]">
                        <span>التقدم: {visitedCount} / {totalCount} ولاية</span>
                        <span>{progressPercent}%</span>
                      </div>
                      <div className="w-full bg-[var(--app-card-subtle)] h-2.5 rounded-full overflow-hidden border border-[var(--app-card-border)]">
                        <div
                          className={`h-full bg-gradient-to-r ${exp.regionColor} rounded-full transition-all duration-500`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Mini badges of included wilayas */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {exp.wilayaCodes.map((code) => {
                        const w = WILAYAS_LIST.find((item) => item.code === code);
                        const isDiscovered = discoveredCodes.includes(code);
                        if (!w) return null;
                        return (
                          <button
                            key={code}
                            onClick={() => {
                              handleSelectWilaya(w);
                              setActiveTab('map_list');
                            }}
                            className={`px-2 py-1 rounded-lg text-[10px] font-black border transition-all cursor-pointer ${
                              isDiscovered
                                ? 'bg-emerald-50 text-emerald-950 border-emerald-300 shadow-2xs'
                                : 'bg-[var(--app-card-subtle)] text-slate-400 border-[var(--app-card-border)]'
                            }`}
                          >
                            {w.codeStr} {w.nameAr}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Expedition Claim button */}
                  <div className="pt-2">
                    {isFinished && !isClaimed ? (
                      <button
                        onClick={() => handleClaimExpedition(exp)}
                        className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-amber-950 font-black rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer animate-bounce"
                      >
                        <Trophy className="w-4 h-4" />
                        <span>استلم مكافأة إتمام الرحلة (+{exp.rewardCoins} 🪙)</span>
                      </button>
                    ) : isClaimed ? (
                      <div className="w-full py-2.5 bg-emerald-50 text-emerald-900 border border-emerald-200 text-center font-black rounded-2xl text-xs">
                        ✨ حصلت على وسام هذه الرحلة الوطنية بنجاح
                      </div>
                    ) : (
                      <div className="w-full py-2.5 bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] text-center font-bold rounded-2xl text-xs">
                        استكشف بقية ولايات هذا المسار في الدليل لفتح المكافأة
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: DETECTIVE GEOGRAPHY & RIDDLES                     */}
      {/* ======================================================== */}
      {activeTab === 'detective' && (
        <div className="bg-[var(--app-card-bg)] rounded-3xl p-6 sm:p-8 border border-[var(--app-card-border)] shadow-md space-y-6 max-w-3xl mx-auto text-center">
          <div className="space-y-2">
            <span className="text-xs font-black text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              لعبة المحقق الجغرافي 🕵️
            </span>
            <h2 className="text-2xl font-black text-[var(--app-text)]">
              أنا ولاية جزائرية أصيلة... هل عرفت من أكون؟
            </h2>
            <p className="text-xs text-[var(--app-text-muted)] font-medium">
              اقرأ التلميحات التي يقدمها ديدو لكشف الولاية السرية ونيل النقاط الذهبية!
            </p>
          </div>

          {/* Clues Box */}
          <div className="space-y-3 bg-[var(--app-card-subtle)] p-5 rounded-3xl border border-[var(--app-card-border)] text-right">
            <h4 className="text-xs font-black text-emerald-600">التلميحات والأدلة التاريخية:</h4>
            <div className="space-y-2">
              {currentDetectiveMission.clues.map((clue, idx) => {
                const isRevealed = idx < revealedCluesCount;
                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold transition-all ${
                      isRevealed
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800'
                        : 'bg-[var(--app-card-bg)] text-slate-400 border-dashed border-[var(--app-card-border)]'
                    }`}
                  >
                    {isRevealed ? (
                      <span className="flex items-center gap-2">
                        <span>💡 الدليل {idx + 1}:</span>
                        <span>{clue}</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-between text-slate-400">
                        <span>🔒 الدليل {idx + 1} مخفي</span>
                        <button
                          onClick={() => setRevealedCluesCount(idx + 1)}
                          className="px-2 py-1 bg-purple-100 text-purple-900 rounded-lg text-[10px] font-black cursor-pointer"
                        >
                          كشف الدليل
                        </button>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {detectiveOptions.map((opt) => {
              return (
                <button
                  key={opt.code}
                  onClick={() => handleDetectiveGuess(opt)}
                  disabled={detectiveFeedback !== null}
                  className="p-4 rounded-2xl border-2 border-[var(--app-card-border)] bg-[var(--app-card-bg)] hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-[var(--app-text)] font-black text-base transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span className="text-xl">{opt.icon}</span>
                  <span>ولاية {opt.nameAr} ({opt.codeStr})</span>
                </button>
              );
            })}
          </div>

          {/* Feedback & Next */}
          {detectiveFeedback && (
            <div className="space-y-4 pt-2">
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm font-bold border ${
                  detectiveFeedback.isCorrect
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                    : 'bg-rose-50 text-rose-900 border-rose-200'
                }`}
              >
                {detectiveFeedback.message}
              </div>

              <button
                onClick={handleNextDetective}
                className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-2xl shadow-lg transition-all text-sm cursor-pointer"
              >
                اللغز الموالي ➡️
              </button>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: GRAND QUIZ 58 WILAYAS                             */}
      {/* ======================================================== */}
      {activeTab === 'quiz' && (
        <div className="bg-[var(--app-card-bg)] rounded-3xl p-6 sm:p-8 border border-[var(--app-card-border)] shadow-md space-y-6 max-w-2xl mx-auto text-center">
          {/* Header Score & Streak */}
          <div className="flex items-center justify-between pb-4 border-b border-[var(--app-card-border)]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-[var(--app-text-muted)]">
                السؤال رقم {quizIndex + 1}
              </span>
              {quizStreak >= 2 && (
                <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-bounce">
                  🔥 متتالية {quizStreak} إجابات!
                </span>
              )}
            </div>
            <span className="bg-amber-100 text-amber-950 font-black text-xs px-3 py-1 rounded-full shadow-xs">
              النقاط: {quizScore} 🏆
            </span>
          </div>

          {/* Question Body */}
          <div className="space-y-4 py-4">
            <span className="text-5xl block animate-bounce">{currentQuizTarget.icon}</span>

            {questionType === 0 ? (
              <h3 className="text-xl sm:text-2xl font-black text-[var(--app-text)]">
                ما هو رقم ولاية{' '}
                <span className="text-emerald-600 font-extrabold underline">
                  {currentQuizTarget.nameAr}
                </span>
                ؟
              </h3>
            ) : questionType === 1 ? (
              <h3 className="text-xl sm:text-2xl font-black text-[var(--app-text)]">
                أي ولاية تشتهر بـ{' '}
                <span className="text-amber-600 font-extrabold">
                  "{currentQuizTarget.monumentAr || currentQuizTarget.famousForAr}"
                </span>
                ؟
              </h3>
            ) : questionType === 2 ? (
              <h3 className="text-xl sm:text-2xl font-black text-[var(--app-text)]">
                ما هي عاصمة (Chef-lieu) ولاية{' '}
                <span className="text-teal-600 font-extrabold">
                  {currentQuizTarget.nameAr}
                </span>
                ؟
              </h3>
            ) : (
              <h3 className="text-xl sm:text-2xl font-black text-[var(--app-text)]">
                أي ولاية تشتهر بـ{' '}
                <span className="text-purple-600 font-extrabold">
                  "{currentQuizTarget.specialtyAr || currentQuizTarget.natureAr}"
                </span>
                ؟
              </h3>
            )}

            <p className="text-xs sm:text-sm text-[var(--app-text-muted)] font-medium bg-[var(--app-card-subtle)] p-3 rounded-2xl border border-[var(--app-card-border)]">
              💡 تلميح: تقع في منطقة ({currentQuizTarget.regionAr})
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-2 gap-3">
            {quizOptions.map((opt) => {
              const isSelected = selectedQuizOption === opt.codeStr;
              const isCorrect = opt.code === currentQuizTarget.code;
              let btnClass =
                'bg-[var(--app-card-subtle)] hover:bg-[var(--app-card-bg)] text-[var(--app-text)] border-[var(--app-card-border)]';

              if (isQuizAnswered) {
                if (isCorrect) {
                  btnClass = 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-[1.02]';
                } else if (isSelected) {
                  btnClass = 'bg-rose-600 text-white border-rose-600 shadow-md';
                }
              }

              return (
                <button
                  key={opt.code}
                  disabled={isQuizAnswered}
                  onClick={() => handleQuizAnswer(opt)}
                  className={`p-4 rounded-2xl border-2 font-black transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${btnClass}`}
                >
                  {questionType === 0 && (
                    <span className="text-2xl font-black">الولاية ({opt.codeStr})</span>
                  )}
                  {questionType === 1 && (
                    <>
                      <span className="text-lg font-black">{opt.nameAr}</span>
                      <span className="text-[10px] opacity-75">الولاية ({opt.codeStr})</span>
                    </>
                  )}
                  {questionType === 2 && (
                    <span className="text-xl font-black">{opt.capitalAr}</span>
                  )}
                  {questionType === 3 && (
                    <>
                      <span className="text-lg font-black">{opt.nameAr}</span>
                      <span className="text-[10px] opacity-75">الولاية ({opt.codeStr})</span>
                    </>
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Next Button */}
          {isQuizAnswered && (
            <div className="space-y-4 pt-2">
              {quizFeedback && (
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm font-bold border ${
                    quizFeedback.isCorrect
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                      : 'bg-rose-50 text-rose-900 border-rose-200'
                  }`}
                >
                  {quizFeedback.text}
                </div>
              )}

              <button
                onClick={handleNextQuiz}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg transition-all text-sm cursor-pointer"
              >
                السؤال التالي ➡️
              </button>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: PASSPORT OF ALGERIAN WILAYAS                      */}
      {/* ======================================================== */}
      {activeTab === 'passport' && (
        <div className="bg-[var(--app-card-bg)] rounded-3xl p-6 sm:p-8 border border-[var(--app-card-border)] shadow-md space-y-6 max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-[var(--app-card-border)]">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🛂</span>
              <div>
                <h2 className="text-xl font-black text-[var(--app-text)]">
                  جواز السفر الاستكشافي للجمهورية الجزائرية
                </h2>
                <p className="text-xs text-[var(--app-text-muted)] font-medium">
                  استكشف كل ولاية في الدليل لجمع ختمها الوطني وتوثيق رحلتك في ربوع الوطن!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-center sm:text-left bg-emerald-50 text-emerald-900 border border-emerald-200 px-4 py-2 rounded-2xl font-black text-xs">
                التقدم: {discoveredCodes.length} من 58 ولاية (
                {Math.round((discoveredCodes.length / 58) * 100)}%)
              </div>
              <button
                onClick={() => setShowCertificateModal(true)}
                className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-amber-950 font-black rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>الشهادة</span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[var(--app-card-subtle)] h-3.5 rounded-full overflow-hidden border border-[var(--app-card-border)]">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${(discoveredCodes.length / 58) * 100}%` }}
            />
          </div>

          {/* Stamp Collection Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-2.5 pt-2">
            {WILAYAS_LIST.map((w) => {
              const isDiscovered = discoveredCodes.includes(w.code);
              return (
                <button
                  key={w.code}
                  onClick={() => {
                    handleSelectWilaya(w);
                    setActiveTab('map_list');
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 relative ${
                    isDiscovered
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-xs hover:scale-105 ring-1 ring-emerald-300'
                      : 'bg-[var(--app-card-subtle)] border-dashed border-[var(--app-card-border)] text-slate-400 opacity-60'
                  }`}
                >
                  <span className="text-2xl">{isDiscovered ? w.icon : '🔒'}</span>
                  <span className="font-black text-xs font-mono">{w.codeStr}</span>
                  <span className="text-[10px] font-bold truncate max-w-full">{w.nameAr}</span>
                  {isDiscovered && (
                    <span className="absolute -top-1 -right-1 text-[10px] bg-amber-400 text-amber-950 rounded-full px-1 font-black">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CERTIFICATE / DIPLOMA MODAL                              */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showCertificateModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[var(--app-card-bg)] rounded-3xl p-6 sm:p-8 max-w-2xl w-full border-2 border-amber-500 shadow-2xl space-y-6 text-center relative"
            >
              <div
                ref={certificatePrintRef}
                className="p-6 sm:p-8 rounded-2xl border-4 border-double border-amber-500 bg-gradient-to-b from-amber-50/70 via-white to-amber-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/20 space-y-5"
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-4xl">🇩🇿</span>
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-black tracking-widest text-emerald-800 dark:text-emerald-300">
                      الجمهورية الجزائرية الديمقراطية الشعبية
                    </h3>
                    <h4 className="text-[11px] font-bold text-slate-500">
                      وزارة التربية والتعليم والرياضات المعرفية
                    </h4>
                  </div>
                  <span className="text-4xl">🇩🇿</span>
                </div>

                <div className="py-2">
                  <span className="text-xs font-black bg-amber-400 text-amber-950 px-4 py-1 rounded-full uppercase tracking-wider">
                    شهادة المستكشف الوطني الفخرية
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-[var(--app-text)] mt-3">
                    دبلوم بطل الـ 58 ولاية
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-[var(--app-text-muted)] font-medium leading-relaxed max-w-lg mx-auto">
                  تُمنح هذه الشهادة الفخرية تقديراً للاجتهاد والتفوق في استكشاف ولايات الوطن الـ 58
                  والإلمام بمعالمها التاريخية والجغرافية والثرية.
                </p>

                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 text-sm font-black flex items-center justify-around">
                  <div>
                    <span className="block text-xs text-slate-400 font-bold">الولايات المكتشفة:</span>
                    <span className="text-xl">{discoveredCodes.length} / 58</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400 font-bold">الرتبة الممنوحة:</span>
                    <span>{currentRank.titleAr}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-amber-300 text-xs font-bold text-slate-500">
                  <span>ختم منصة مسيد الجزائر 🌟</span>
                  <span>ديدو الرحالة الفنك الذكي 🦊</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة الشهادة (Imprimer)</span>
                </button>
                <button
                  onClick={() => setShowCertificateModal(false)}
                  className="px-5 py-2.5 bg-[var(--app-card-subtle)] hover:bg-[var(--app-card-border)] text-[var(--app-text)] font-black rounded-2xl text-xs transition-all cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
