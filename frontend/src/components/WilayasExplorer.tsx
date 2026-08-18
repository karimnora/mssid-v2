import React, { useState, useMemo } from 'react';
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

export const WilayasExplorer: React.FC<WilayasExplorerProps> = ({
  onBack,
  grade = '5AP',
  onReward,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedWilaya, setSelectedWilaya] = useState<WilayaInfo>(WILAYAS_LIST[15]); // Default: Alger (16)
  const [activeTab, setActiveTab] = useState<'map_list' | 'quiz' | 'geo_guess' | 'passport'>('map_list');

  // Visited / Discovered wilayas for the passport
  const [discoveredCodes, setDiscoveredCodes] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('mssid_discovered_wilayas');
      return saved ? JSON.parse(saved) : [16, 31, 25, 5, 47, 1];
    } catch {
      return [16, 31, 25, 5, 47, 1];
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
        onReward(5, 10);
      }
    }
  };

  // Text to Speech — delegates to the shared, feature-flag-gated implementation (see
  // utils/speech.ts) so voiceReading actually controls this like every other narration in the app.
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

  // ==========================================
  // --- QUIZ MODE STATE ---
  // ==========================================
  const [quizScore, setQuizScore] = useState(0);
  const [quizStreak, setQuizStreak] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [isQuizAnswered, setIsQuizAnswered] = useState(false);
  const [quizFeedback, setQuizFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Question Type Rotation: 0 = Guess Number, 1 = Guess Monument, 2 = Guess Capital
  const questionType = quizIndex % 3;
  const currentQuizTarget = WILAYAS_LIST[quizIndex % WILAYAS_LIST.length];

  const quizOptions = useMemo(() => {
    const others = WILAYAS_LIST.filter((w) => w.code !== currentQuizTarget.code)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    return [currentQuizTarget, ...others].sort(() => 0.5 - Math.random());
  }, [currentQuizTarget]);

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
        text: `أحسنت! إجابة صحيحة! ولاية ${currentQuizTarget.nameAr} رقمها ${currentQuizTarget.codeStr} وعاصمتها ${currentQuizTarget.capitalAr}. 🇩🇿`,
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

  // ==========================================
  // --- GEO GUESS MAP CHALLENGE ---
  // ==========================================
  const [geoTargetIndex, setGeoTargetIndex] = useState(3);
  const [geoFeedback, setGeoFeedback] = useState<string | null>(null);
  const geoTarget = WILAYAS_LIST[geoTargetIndex % WILAYAS_LIST.length];

  const handleGeoGuessRegion = (guessedRegion: 'north' | 'high_plateaus' | 'sahara') => {
    if (guessedRegion === geoTarget.region) {
      setGeoFeedback(`صحيح! ولاية ${geoTarget.nameAr} تقع في ${geoTarget.regionAr}! 🎉`);
      speakText(`صحيح! ولاية ${geoTarget.nameAr} تقع في ${geoTarget.regionAr}.`);
      if (onReward) onReward(10, 15);
      setTimeout(() => {
        setGeoTargetIndex((p) => p + 1);
        setGeoFeedback(null);
      }, 2000);
    } else {
      setGeoFeedback(`حاول ثانية! ولاية ${geoTarget.nameAr} لا تقع هناك.`);
      speakText(`حاول ثانية. ولاية ${geoTarget.nameAr} تقع في ${geoTarget.regionAr}.`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6 dir-rtl" dir="rtl">
      {/* Top Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-800 via-teal-800 to-amber-700 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-600/30">
        <div className="flex items-center gap-4 z-10">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/30 shrink-0 animate-pulse">
            🇩🇿
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                خريطة واستكشاف ولايات الجزائر الـ 58
              </h1>
              <span className="bg-amber-400 text-amber-950 text-xs font-black px-3 py-1 rounded-full shadow-xs">
                منهاج الجغرافيا والتاريخ
              </span>
            </div>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1.5 font-medium max-w-2xl leading-relaxed">
              اكتشف ولايات الوطن الـ 58 من أدرار إلى المنيعة: أرقام الترقيم، العواصم، الآثار التاريخية، والميزات الطبيعية الفاتنة!
            </p>
          </div>
        </div>

        {onBack && (
          <button
            onClick={onBack}
            className="z-10 px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-2xl font-black text-xs transition-all border border-white/30 shadow-sm cursor-pointer whitespace-nowrap"
          >
            العودة للأدوات والمختبرات
          </button>
        )}

        {/* Ambient background decoration */}
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Mode Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[var(--app-card-bg)] p-2 rounded-2xl border border-[var(--app-card-border)] shadow-xs">
        <button
          onClick={() => setActiveTab('map_list')}
          className={`py-3 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'map_list'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-[var(--app-text-muted)] hover:bg-[var(--app-card-subtle)]'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>🗺️ دليل وخريطة الـ 58 ولاية</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`py-3 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'quiz'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-[var(--app-text-muted)] hover:bg-[var(--app-card-subtle)]'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>🏆 مسابقة وألغاز الولايات</span>
        </button>

        <button
          onClick={() => setActiveTab('geo_guess')}
          className={`py-3 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'geo_guess'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-[var(--app-text-muted)] hover:bg-[var(--app-card-subtle)]'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>📍 أين تقع على الخريطة؟</span>
        </button>

        <button
          onClick={() => setActiveTab('passport')}
          className={`py-3 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'passport'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-[var(--app-text-muted)] hover:bg-[var(--app-card-subtle)]'
          }`}
        >
          <Flag className="w-4 h-4" />
          <span>🛂 جواز السفر الجزائري ({discoveredCodes.length}/58)</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: GUIDE & INTERACTIVE MAP VIEW                      */}
      {/* ======================================================== */}
      {activeTab === 'map_list' && (
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
                  { id: 'all', label: 'كل الولايات (58)', count: 58 },
                  { id: 'north', label: '🌊 الشمال والساحل', count: 20 },
                  { id: 'high_plateaus', label: '🌾 الهضاب العليا', count: 17 },
                  { id: 'sahara', label: '🌴 الجنوب الكبير', count: 21 },
                  { id: 'new_wilayas', label: '✨ الولايات الجديدة (49-58)', count: 10 },
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

            {/* Wilayas Grid */}
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
      )}

      {/* ======================================================== */}
      {/* TAB 2: GRAND QUIZ 58 WILAYAS                             */}
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
            ) : (
              <h3 className="text-xl sm:text-2xl font-black text-[var(--app-text)]">
                ما هي عاصمة (Chef-lieu) ولاية{' '}
                <span className="text-teal-600 font-extrabold">
                  {currentQuizTarget.nameAr}
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

              // What each option shows depends on questionType — showing the wilaya's own name when
              // the question asks "which wilaya has number X" (questionType 0) would let a child find
              // the answer by matching text instead of actually knowing the number, and showing both
              // nameAr and capitalAr together was pure noise for the many wilayas whose capital shares
              // the wilaya's name (e.g. بجاية/بجاية) — each option now surfaces only the one piece of
              // information the question is actually testing.
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
      {/* TAB 3: GEO GUESS CHALLENGE                               */}
      {/* ======================================================== */}
      {activeTab === 'geo_guess' && (
        <div className="bg-[var(--app-card-bg)] rounded-3xl p-6 sm:p-8 border border-[var(--app-card-border)] shadow-md space-y-6 max-w-3xl mx-auto text-center">
          <div className="space-y-2">
            <span className="text-xs font-black text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              تحدي التموضع الجغرافي 📍
            </span>
            <h2 className="text-2xl font-black text-[var(--app-text)]">
              في أي نطاق جغرافي تقع ولاية{' '}
              <span className="text-emerald-600 font-extrabold">{geoTarget.nameAr}</span> (
              {geoTarget.codeStr})؟
            </h2>
            <p className="text-xs text-[var(--app-text-muted)] font-medium">
              اختر المنطقة الجغرافية الصحيحة على خريطة الجزائر
            </p>
          </div>

          {/* Visual Map Zones */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <button
              onClick={() => handleGeoGuessRegion('north')}
              className="p-5 rounded-3xl bg-blue-50 hover:bg-blue-100 text-blue-950 border-2 border-blue-300 font-black flex flex-col items-center gap-3 transition-all cursor-pointer hover:scale-105 shadow-sm"
            >
              <span className="text-4xl">🌊</span>
              <span className="text-base">1. الشمال والساحل</span>
              <span className="text-[11px] text-blue-800 font-bold">
                (المناخ المتوسطي، الشواطئ وسلاسل الأطلس التلي)
              </span>
            </button>

            <button
              onClick={() => handleGeoGuessRegion('high_plateaus')}
              className="p-5 rounded-3xl bg-amber-50 hover:bg-amber-100 text-amber-950 border-2 border-amber-300 font-black flex flex-col items-center gap-3 transition-all cursor-pointer hover:scale-105 shadow-sm"
            >
              <span className="text-4xl">🌾</span>
              <span className="text-base">2. الهضاب العليا والسهوب</span>
              <span className="text-[11px] text-amber-800 font-bold">
                (مراعي الحلفاء، زراعة الحبوب والأطلس الصحراوي)
              </span>
            </button>

            <button
              onClick={() => handleGeoGuessRegion('sahara')}
              className="p-5 rounded-3xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border-2 border-emerald-300 font-black flex flex-col items-center gap-3 transition-all cursor-pointer hover:scale-105 shadow-sm"
            >
              <span className="text-4xl">🌴</span>
              <span className="text-base">3. الصحراء والواحات</span>
              <span className="text-[11px] text-emerald-800 font-bold">
                (الكثبان الذهبية، واحات النخيل وجبال الهقار)
              </span>
            </button>
          </div>

          {geoFeedback && (
            <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-sm font-black animate-pulse">
              {geoFeedback}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: PASSPORT OF ALGERIAN WILAYAS                      */}
      {/* ======================================================== */}
      {activeTab === 'passport' && (
        <div className="bg-[var(--app-card-bg)] rounded-3xl p-6 sm:p-8 border border-[var(--app-card-border)] shadow-md space-y-6 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-[var(--app-card-border)]">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🛂</span>
              <div>
                <h2 className="text-xl font-black text-[var(--app-text)]">
                  جواز السفر الاستكشافي للجمهورية الجزائرية
                </h2>
                <p className="text-xs text-[var(--app-text-muted)] font-medium">
                  استكشف كل ولاية في الدليل لجمع ختمها الوطني وتوثيق رحلتك في ربوع الوطن!
                </p>
              </div>
            </div>

            <div className="text-center sm:text-left bg-emerald-50 text-emerald-900 border border-emerald-200 px-4 py-2 rounded-2xl font-black text-xs">
              التقدم: {discoveredCodes.length} من 58 ولاية (
              {Math.round((discoveredCodes.length / 58) * 100)}%)
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[var(--app-card-subtle)] h-3 rounded-full overflow-hidden border border-[var(--app-card-border)]">
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
                  className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    isDiscovered
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-xs hover:scale-105'
                      : 'bg-[var(--app-card-subtle)] border-dashed border-[var(--app-card-border)] text-slate-400 opacity-60'
                  }`}
                >
                  <span className="text-xl">{isDiscovered ? w.icon : '🔒'}</span>
                  <span className="font-black text-xs">{w.codeStr}</span>
                  <span className="text-[10px] font-bold truncate max-w-full">{w.nameAr}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
