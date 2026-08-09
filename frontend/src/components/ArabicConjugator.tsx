import React, { useState } from 'react';
import { Sparkles, BookOpen, CheckCircle2, RotateCcw, ChevronLeft } from 'lucide-react';

interface VerbData {
  verb: string;
  typeAr: string;
  category: 'سالم' | 'مهموز' | 'مضعف' | 'مثال' | 'أجوف' | 'ناقص';
  past: Record<string, string>;
  present: Record<string, string>;
  imperative?: Record<string, string>;
  ruleAr: string;
}

const VERBS_DATABASE: VerbData[] = [
  {
    verb: 'كَتَبَ',
    typeAr: 'فِعْلٌ صَحِيحٌ سَالِمٌ',
    category: 'سالم',
    ruleAr: 'الفِعْلُ السَّالِمُ تَسْلَمُ حُرُوفُهُ الأَصْلِيَّةُ مِنَ التَّغْيِيرِ عِنْدَ التَّصْرِيفِ.',
    past: {
      'أَنَا': 'كَتَبْتُ',
      'نَحْنُ': 'كَتَبْنَا',
      'أَنْتَ': 'كَتَبْتَ',
      'أَنْتِ': 'كَتَبْتِ',
      'أَنْتُمَا': 'كَتَبْتُمَا',
      'أَنْتُمْ': 'كَتَبْتُمْ',
      'أَنْتُنَّ': 'كَتَبْتُنَّ',
      'هُوَ': 'كَتَبَ',
      'هِيَ': 'كَتَبَتْ',
      'هُمَا': 'كَتَبَا',
      'هُمْ': 'كَتَبُوا',
      'هُنَّ': 'كَتَبْنَ'
    },
    present: {
      'أَنَا': 'أَكْتُبُ',
      'نَحْنُ': 'نَكْتُبُ',
      'أَنْتَ': 'تَكْتُبُ',
      'أَنْتِ': 'تَكْتُبِينَ',
      'أَنْتُمَا': 'تَكْتُبَانِ',
      'أَنْتُمْ': 'تَكْتُبُونَ',
      'أَنْتُنَّ': 'تَكْتُبْنَ',
      'هُوَ': 'يَكْتُبُ',
      'هِيَ': 'تَكْتُبُ',
      'هُمَا': 'يَكْتُبَانِ',
      'هُمْ': 'يَكْتُبُونَ',
      'هُنَّ': 'يَكْتُبْنَ'
    },
    imperative: {
      'أَنْتَ': 'اُكْتُبْ',
      'أَنْتِ': 'اُكْتُبِي',
      'أَنْتُمَا': 'اُكْتُبَا',
      'أَنْتُمْ': 'اُكْتُبُوا',
      'أَنْتُنَّ': 'اُكْتُبْنَ'
    }
  },
  {
    verb: 'قَالَ',
    typeAr: 'فِعْلٌ مُعْتَلٌّ أَجْوَفُ',
    category: 'أجوف',
    ruleAr: 'الفِعْلُ الأَجْوَفُ تُحْذَفُ أَلِفُهُ عِنْدَ سُكُونِ الحَرْفِ الأَخِيرِ (مِثْلُ: أَنَا قُلْتُ، هُنَّ قُلْنَ).',
    past: {
      'أَنَا': 'قُلْتُ',
      'نَحْنُ': 'قُلْنَا',
      'أَنْتَ': 'قُلْتَ',
      'أَنْتِ': 'قُلْتِ',
      'أَنْتُمَا': 'قُلْتُمَا',
      'أَنْتُمْ': 'قُلْتُمْ',
      'أَنْتُنَّ': 'قُلْتُنَّ',
      'هُوَ': 'قَالَ',
      'هِيَ': 'قَالَتْ',
      'هُمَا': 'قَالَا',
      'هُمْ': 'قَالُوا',
      'هُنَّ': 'قُلْنَ'
    },
    present: {
      'أَنَا': 'أَقُولُ',
      'نَحْنُ': 'نَقُولُ',
      'أَنْتَ': 'تَقُولُ',
      'أَنْتِ': 'تَقُولِينَ',
      'أَنْتُمَا': 'تَقُولَانِ',
      'أَنْتُمْ': 'تَقُولُونَ',
      'أَنْتُنَّ': 'تَقُلْنَ',
      'هُوَ': 'يَقُولُ',
      'هِيَ': 'تَقُولُ',
      'هُمَا': 'يَقُولَانِ',
      'هُمْ': 'يَقُولُونَ',
      'هُنَّ': 'يَقُلْنَ'
    },
    imperative: {
      'أَنْتَ': 'قُلْ',
      'أَنْتِ': 'قُولِي',
      'أَنْتُمَا': 'قُولَا',
      'أَنْتُمْ': 'قُولُوا',
      'أَنْتُنَّ': 'قُلْنَ'
    }
  },
  {
    verb: 'وَصَلَ',
    typeAr: 'فِعْلٌ مُعْتَلٌّ مِثَالٌ',
    category: 'مثال',
    ruleAr: 'الفِعْلُ المِثَالُ المَاوِيُّ تُحْذَفُ وَاوُهُ فِي المضَارِعِ وَالأَمْرِ (وَصَلَ ➔ يَصِلُ ➔ صِلْ).',
    past: {
      'أَنَا': 'وَصَلْتُ',
      'نَحْنُ': 'وَصَلْنَا',
      'أَنْتَ': 'وَصَلْتَ',
      'أَنْتِ': 'وَصَلْتِ',
      'أَنْتُمَا': 'وَصَلْتُمَا',
      'أَنْتُمْ': 'وَصَلْتُمْ',
      'أَنْتُنَّ': 'وَصَلْتُنَّ',
      'هُوَ': 'وَصَلَ',
      'هِيَ': 'وَصَلَتْ',
      'هُمَا': 'وَصَلَا',
      'هُمْ': 'وَصَلُوا',
      'هُنَّ': 'وَصَلْنَ'
    },
    present: {
      'أَنَا': 'أَصِلُ',
      'نَحْنُ': 'نَصِلُ',
      'أَنْتَ': 'تَصِلُ',
      'أَنْتِ': 'تَصِلِينَ',
      'أَنْتُمَا': 'تَصِلَانِ',
      'أَنْتُمْ': 'تَصِلُونَ',
      'أَنْتُنَّ': 'تَصِلْنَ',
      'هُوَ': 'يَصِلُ',
      'هِيَ': 'تَصِلُ',
      'هُمَا': 'يَصِلَانِ',
      'هُمْ': 'يَصِلُونَ',
      'هُنَّ': 'يَصِلْنَ'
    },
    imperative: {
      'أَنْتَ': 'صِلْ',
      'أَنْتِ': 'صِلِي',
      'أَنْتُمَا': 'صِلَا',
      'أَنْتُمْ': 'صِلُوا',
      'أَنْتُنَّ': 'صِلْنَ'
    }
  },
  {
    verb: 'شَدَّ',
    typeAr: 'فِعْلٌ صَحِيحٌ مُضَعَّفٌ',
    category: 'مضعف',
    ruleAr: 'الفِعْلُ المُضَعَّفُ يُفَكُّ إِدْغَامُهُ مَعَ الضَّمَائِرِ التَّالِيَةِ: (أَنَا، نَحْنُ، أَنْتَ، أَنْتِ، أَنْتُمَا، أَنْتُمْ، أَنْتُنَّ، هُنَّ).',
    past: {
      'أَنَا': 'شَدَدْتُ',
      'نَحْنُ': 'شَدَدْنَا',
      'أَنْتَ': 'شَدَدْتَ',
      'أَنْتِ': 'شَدَدْتِ',
      'أَنْتُمَا': 'شَدَدْتُمَا',
      'أَنْتُمْ': 'شَدَدْتُمْ',
      'أَنْتُنَّ': 'شَدَدْتُنَّ',
      'هُوَ': 'شَدَّ',
      'هِيَ': 'شَدَّتْ',
      'هُمَا': 'شَدَّا',
      'هُمْ': 'شَدُّوا',
      'هُنَّ': 'شَدَدْنَ'
    },
    present: {
      'أَنَا': 'أَشُدُّ',
      'نَحْنُ': 'نَشُدُّ',
      'أَنْتَ': 'تَشُدُّ',
      'أَنْتِ': 'تَشُدِّينَ',
      'أَنْتُمَا': 'تَشُدَّانِ',
      'أَنْتُمْ': 'تَشُدُّونَ',
      'أَنْتُنَّ': 'تَشْدُدْنَ',
      'هُوَ': 'يَشُدُّ',
      'هِيَ': 'تَشُدُّ',
      'هُمَا': 'يَشُدَّانِ',
      'هُمْ': 'يَشُدُّونَ',
      'هُنَّ': 'يَشْدُدْنَ'
    },
    imperative: {
      'أَنْتَ': 'اُشْدُدْ / شُدَّ',
      'أَنْتِ': 'شُدِّي',
      'أَنْتُمَا': 'شُدَّا',
      'أَنْتُمْ': 'شُدُّوا',
      'أَنْتُنَّ': 'اُشْدُدْنَ'
    }
  }
];

interface ArabicConjugatorProps {
  grade?: string;
}

export const ArabicConjugator: React.FC<ArabicConjugatorProps> = ({ grade = '4AP' }) => {
  const [selectedVerbIndex, setSelectedVerbIndex] = useState<number>(0);
  const [selectedTense, setSelectedTense] = useState<'past' | 'present' | 'imperative'>('past');

  const currentVerb = VERBS_DATABASE[selectedVerbIndex];
  const conjugationMap =
    selectedTense === 'past'
      ? currentVerb.past
      : selectedTense === 'present'
      ? currentVerb.present
      : currentVerb.imperative || currentVerb.present;

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-6 dir-rtl" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-black text-emerald-300">أَدَاةُ تَصْرِيفِ الأَفْعَالِ العَرَبِيَّةِ التَّفَاعُلِيَّةِ</h2>
            <p className="text-xs text-slate-400">جدول التصريف التفاعلي مع قواعد الفك والزيادة والتغيير</p>
          </div>
        </div>
        <span className="bg-emerald-400/10 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold">
          جدول الضمائر التفاعلي
        </span>
      </div>

      {/* Verb Selector */}
      <div className="space-y-2">
        <h3 className="text-xs font-extrabold text-slate-300">1. إخْتَرِ الفِعْلَ المُرَادَ تَصْرِيفُهُ:</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {VERBS_DATABASE.map((v, idx) => {
            const isSelected = idx === selectedVerbIndex;
            return (
              <button
                key={v.verb}
                onClick={() => setSelectedVerbIndex(idx)}
                className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 font-black border-emerald-300 shadow-lg scale-[1.02]'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200'
                }`}
              >
                <div className="text-sm font-black">{v.verb}</div>
                <div className="text-[10px] opacity-90 mt-0.5">{v.typeAr}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tense Selector */}
      <div className="space-y-2">
        <h3 className="text-xs font-extrabold text-slate-300">2. إخْتَرِ الزَّمَنَ:</h3>
        <div className="flex gap-3">
          <button
            onClick={() => setSelectedTense('past')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer border ${
              selectedTense === 'past'
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            📜 الزَّمَنُ المَاضِي
          </button>
          <button
            onClick={() => setSelectedTense('present')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer border ${
              selectedTense === 'present'
                ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-md'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            ⚡ الزَّمَنُ المُضَارِعُ
          </button>
          {currentVerb.imperative && (
            <button
              onClick={() => setSelectedTense('imperative')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer border ${
                selectedTense === 'imperative'
                  ? 'bg-indigo-500 text-white border-indigo-300 shadow-md'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              🎯 زَمَنُ الأَمْرِ
            </button>
          )}
        </div>
      </div>

      {/* Rule Notification Box */}
      <div className="bg-emerald-950/80 border border-emerald-500/60 p-4 rounded-2xl text-xs text-emerald-200 leading-relaxed font-sans space-y-1">
        <div className="font-extrabold text-amber-300 flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          <span>القَاعِدَةُ الصَّرْفِيَّةُ لِلْفِعْلِ ({currentVerb.verb}):</span>
        </div>
        <p>{currentVerb.ruleAr}</p>
      </div>

      {/* Conjugation Grid */}
      <div className="space-y-2">
        <h3 className="text-xs font-extrabold text-slate-300">3. جَدْوَلُ التَّصْرِيفِ مَعَ كَافَّةِ الضَّمَائِرِ:</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {Object.entries(conjugationMap).map(([pronoun, conjugatedForm]) => (
            <div
              key={pronoun}
              className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-center space-y-1 hover:border-emerald-500/50 transition-colors"
            >
              <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20 inline-block">
                {pronoun}
              </span>
              <div className="text-base font-black text-white pt-1">{conjugatedForm}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
