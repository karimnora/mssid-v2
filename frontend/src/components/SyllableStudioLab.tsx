import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { PrimaryGrade } from '../types';
import { canShowFrenchInLab } from '../utils/labGradePolicy';

interface SyllableStudioLabProps {
  grade?: PrimaryGrade;
  onReward?: (coins: number, xp: number) => void;
  onBack?: () => void;
}

type StudioTab = 'arabic' | 'french';

interface SyllableWord {
  word: string;
  syllables: string[];
}

const ARABIC_WORDS: SyllableWord[] = [
  { word: 'شَمْس', syllables: ['شَمْس'] },
  { word: 'قَلَم', syllables: ['قَ', 'لَم'] },
  { word: 'كِتَاب', syllables: ['كِ', 'تَاب'] },
  { word: 'مَدْرَسَة', syllables: ['مَدْ', 'رَ', 'سَة'] },
  { word: 'تُفَّاحَة', syllables: ['تُفْ', 'فَا', 'حَة'] },
  { word: 'سَيَّارَة', syllables: ['سَيْ', 'يَا', 'رَة'] },
];

const FRENCH_WORDS: SyllableWord[] = [
  { word: 'chat', syllables: ['chat'] },
  { word: 'papa', syllables: ['pa', 'pa'] },
  { word: 'chapeau', syllables: ['cha', 'peau'] },
  { word: 'école', syllables: ['é', 'co', 'le'] },
  { word: 'banane', syllables: ['ba', 'na', 'ne'] },
];

const SYLLABLE_COLORS = ['bg-sky-500', 'bg-amber-500', 'bg-emerald-500', 'bg-fuchsia-500'];

export const SyllableStudioLab: React.FC<SyllableStudioLabProps> = ({ grade = '2AP', onReward }) => {
  const showFrench = canShowFrenchInLab(grade);
  const [activeTab, setActiveTab] = useState<StudioTab>('arabic');
  const [wordIdx, setWordIdx] = useState<number>(0);
  const [guess, setGuess] = useState<number | null>(null);
  const [revealed, setRevealed] = useState<boolean>(false);

  const words = activeTab === 'arabic' ? ARABIC_WORDS : FRENCH_WORDS;
  const currentWord = words[wordIdx % words.length];

  const switchTab = (tab: StudioTab) => {
    if (tab === 'french' && !showFrench) return;
    setActiveTab(tab);
    setWordIdx(0);
    setGuess(null);
    setRevealed(false);
  };

  useEffect(() => {
    if (!showFrench && activeTab === 'french') {
      setActiveTab('arabic');
    }
  }, [showFrench, activeTab]);

  const handleGuess = (n: number) => {
    setGuess(n);
    setRevealed(true);
    if (n === currentWord.syllables.length) onReward?.(5, 15);
  };

  const nextWord = () => {
    setWordIdx((prev) => (prev + 1) % words.length);
    setGuess(null);
    setRevealed(false);
  };

  return (
    <div className="space-y-6 dir-rtl max-w-4xl mx-auto" dir="rtl">
      <div className="bg-gradient-to-r from-cyan-700 via-sky-800 to-blue-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-cyan-600/40 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 text-white px-3 py-1 rounded-full text-xs font-black">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>أستوديو المقاطع الصوتية (1AP - 3AP)</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black font-sans">تَفْكِيكُ الكَلِمَاتِ إِلَى مَقَاطِعَ</h1>
          <p className="text-xs sm:text-sm text-cyan-100 leading-relaxed max-w-3xl">
            صفّق مع كل مقطع صوتي تسمعه، ثم شاهد الكلمة وهي تنقسم إلى مقاطعها الملونة.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-[var(--app-card-border)] pb-3 overflow-x-auto">
        <button
          onClick={() => switchTab('arabic')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === 'arabic' ? 'bg-cyan-600 text-white shadow-md' : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
          }`}
        >
          🇩🇿 كلمات عربية
        </button>
        {showFrench && (
        <button
          onClick={() => switchTab('french')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === 'french' ? 'bg-sky-600 text-white shadow-md' : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
          }`}
        >
          🇫🇷 Mots français
        </button>
        )}
      </div>

      <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-center">
        <p className="text-xs font-black text-[var(--app-text-muted)]">
          {activeTab === 'arabic' ? 'كَمْ مَقْطَعاً صَوْتِيّاً تَسْمَعُ فِي هَذِهِ الكَلِمَةِ؟' : 'Combien de syllabes entends-tu dans ce mot ?'}
        </p>

        <h2 className={`text-4xl sm:text-5xl font-black text-[var(--app-text)] ${activeTab === 'french' ? 'font-sans' : ''}`}>
          {currentWord.word}
        </h2>

        {!revealed ? (
          <div className="flex items-center justify-center gap-3">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                onClick={() => handleGuess(n)}
                className="w-14 h-14 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-black text-xl shadow-md transition-all cursor-pointer"
              >
                {n}
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div
              className={`text-sm font-black p-3 rounded-xl max-w-md mx-auto ${
                guess === currentWord.syllables.length ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
              }`}
            >
              {guess === currentWord.syllables.length
                ? 'إِجَابَةٌ صَحِيحَةٌ! أَحْسَنْتَ 🌟'
                : `العَدَدُ الصَّحِيحُ هُوَ ${currentWord.syllables.length}`}
            </div>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {currentWord.syllables.map((syl, i) => (
                <span
                  key={i}
                  className={`px-4 py-2 rounded-xl text-white font-black text-lg shadow-xs ${
                    SYLLABLE_COLORS[i % SYLLABLE_COLORS.length]
                  } ${activeTab === 'french' ? 'font-sans' : ''}`}
                >
                  {syl}
                </span>
              ))}
            </div>
            <button
              onClick={nextWord}
              className="px-5 py-3 rounded-2xl bg-[var(--app-card-subtle)] text-[var(--app-text)] font-black text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
            >
              الكَلِمَةُ التَّالِيَةُ ⟵
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
