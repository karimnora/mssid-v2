import React, { useEffect, useState } from 'react';
import { speakText } from '../utils/speech';
import { VoiceEchoBar } from './VoiceEchoBar';
import { PrimaryGrade } from '../types';
import { allowedEnglishTenses, EnglishTense } from '../utils/labGradePolicy';
import {
  Volume2,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  BookOpen,
  MessageCircle,
  Award,
  Globe,
  Check,
  Zap,
  Ear,
  Search,
  HelpCircle
} from 'lucide-react';

interface EnglishVerbData {
  verb: string;
  translationAr: string;
  category: 'Auxiliary Verb' | 'Regular Verb' | 'Irregular Verb' | 'Daily Routine';
  ruleEn: string;
  ruleAr: string;
  presentSimple: Record<string, { full: string; stem: string; ending: string }>;
  presentContinuous: Record<string, { full: string; stem: string; ending: string }>;
  pastSimple: Record<string, { full: string; stem: string; ending: string }>;
  futureSimple: Record<string, { full: string; stem: string; ending: string }>;
}

const ENGLISH_VERBS_DATABASE: EnglishVerbData[] = [
  {
    verb: 'to be',
    translationAr: 'كَانَ / يَكُونُ (فِعْلُ الكَيْنُونَةِ الأساسي)',
    category: 'Auxiliary Verb',
    ruleEn: 'The verb "to be" is irregular in Present and Past: I am, He is, They are / I was, They were.',
    ruleAr: 'فِعْلُ الكَيْنُونَةِ "to be" شَاذٌّ فِي الحَاضِرِ وَالمَاضِي: I am, He is, They are / I was, They were.',
    presentSimple: {
      'I': { full: 'I am', stem: 'I ', ending: 'am' },
      'You': { full: 'You are', stem: 'You ', ending: 'are' },
      'He / She / It': { full: 'He / She / It is', stem: 'He / She / It ', ending: 'is' },
      'We': { full: 'We are', stem: 'We ', ending: 'are' },
      'They': { full: 'They are', stem: 'They ', ending: 'are' },
    },
    presentContinuous: {
      'I': { full: 'I am being', stem: 'I am ', ending: 'being' },
      'You': { full: 'You are being', stem: 'You are ', ending: 'being' },
      'He / She / It': { full: 'He / She / It is being', stem: 'He / She / It is ', ending: 'being' },
      'We': { full: 'We are being', stem: 'We are ', ending: 'being' },
      'They': { full: 'They are being', stem: 'They are ', ending: 'being' },
    },
    pastSimple: {
      'I': { full: 'I was', stem: 'I ', ending: 'was' },
      'You': { full: 'You were', stem: 'You ', ending: 'were' },
      'He / She / It': { full: 'He / She / It was', stem: 'He / She / It ', ending: 'was' },
      'We': { full: 'We were', stem: 'We ', ending: 'were' },
      'They': { full: 'They were', stem: 'They ', ending: 'were' },
    },
    futureSimple: {
      'I': { full: 'I will be', stem: 'I will ', ending: 'be' },
      'You': { full: 'You will be', stem: 'You will ', ending: 'be' },
      'He / She / It': { full: 'He / She / It will be', stem: 'He / She / It will ', ending: 'be' },
      'We': { full: 'We will be', stem: 'We will ', ending: 'be' },
      'They': { full: 'They will be', stem: 'They will ', ending: 'be' },
    }
  },
  {
    verb: 'to have',
    translationAr: 'يَمْلِكُ / لَدَيْهِ (فِعْلُ المِلْكِيَّةِ)',
    category: 'Auxiliary Verb',
    ruleEn: 'Use "has" for He/She/It in Present Simple, and "have" for I/You/We/They.',
    ruleAr: 'نَسْتَخْدِمُ "has" مَعَ الضَّمَائِرِ (He/She/It)، وَنَسْتَخْدِمُ "have" مَعَ بَقِيَّةِ الضَّمَائِرِ.',
    presentSimple: {
      'I': { full: 'I have', stem: 'I ', ending: 'have' },
      'You': { full: 'You have', stem: 'You ', ending: 'have' },
      'He / She / It': { full: 'He / She / It has', stem: 'He / She / It ', ending: 'has' },
      'We': { full: 'We have', stem: 'We ', ending: 'have' },
      'They': { full: 'They have', stem: 'They ', ending: 'have' },
    },
    presentContinuous: {
      'I': { full: 'I am having', stem: 'I am ', ending: 'having' },
      'You': { full: 'You are having', stem: 'You are ', ending: 'having' },
      'He / She / It': { full: 'He / She / It is having', stem: 'He / She / It is ', ending: 'having' },
      'We': { full: 'We are having', stem: 'We are ', ending: 'having' },
      'They': { full: 'They are having', stem: 'They are ', ending: 'having' },
    },
    pastSimple: {
      'I': { full: 'I had', stem: 'I ', ending: 'had' },
      'You': { full: 'You had', stem: 'You ', ending: 'had' },
      'He / She / It': { full: 'He / She / It had', stem: 'He / She / It ', ending: 'had' },
      'We': { full: 'We had', stem: 'We ', ending: 'had' },
      'They': { full: 'They had', stem: 'They ', ending: 'had' },
    },
    futureSimple: {
      'I': { full: 'I will have', stem: 'I will ', ending: 'have' },
      'You': { full: 'You will have', stem: 'You will ', ending: 'have' },
      'He / She / It': { full: 'He / She / It will have', stem: 'He / She / It will ', ending: 'have' },
      'We': { full: 'We will have', stem: 'We will ', ending: 'have' },
      'They': { full: 'They will have', stem: 'They will ', ending: 'have' },
    }
  },
  {
    verb: 'to play',
    translationAr: 'يَلْعَبُ (فِعْلٌ قِيَاسِيٌّ)',
    category: 'Regular Verb',
    ruleEn: 'Add "-s" for He/She/It in Present Simple. Add "-ed" in Past Simple.',
    ruleAr: 'فِي الحَاضِرِ نُضِيفُ "-s" مَعَ (He/She/It). وَفِي المَاضِي نُضِيفُ "-ed" (played).',
    presentSimple: {
      'I': { full: 'I play', stem: 'play', ending: '' },
      'You': { full: 'You play', stem: 'play', ending: '' },
      'He / She / It': { full: 'He / She / It plays', stem: 'play', ending: 's' },
      'We': { full: 'We play', stem: 'play', ending: '' },
      'They': { full: 'They play', stem: 'play', ending: '' },
    },
    presentContinuous: {
      'I': { full: 'I am playing', stem: 'I am play', ending: 'ing' },
      'You': { full: 'You are playing', stem: 'You are play', ending: 'ing' },
      'He / She / It': { full: 'He / She / It is playing', stem: 'He / She / It is play', ending: 'ing' },
      'We': { full: 'We are playing', stem: 'We are play', ending: 'ing' },
      'They': { full: 'They are playing', stem: 'They are play', ending: 'ing' },
    },
    pastSimple: {
      'I': { full: 'I played', stem: 'play', ending: 'ed' },
      'You': { full: 'You played', stem: 'play', ending: 'ed' },
      'He / She / It': { full: 'He / She / It played', stem: 'play', ending: 'ed' },
      'We': { full: 'We played', stem: 'play', ending: 'ed' },
      'They': { full: 'They played', stem: 'play', ending: 'ed' },
    },
    futureSimple: {
      'I': { full: 'I will play', stem: 'I will ', ending: 'play' },
      'You': { full: 'You will play', stem: 'You will ', ending: 'play' },
      'He / She / It': { full: 'He / She / It will play', stem: 'He / She / It will ', ending: 'play' },
      'We': { full: 'We will play', stem: 'We will ', ending: 'play' },
      'They': { full: 'They will play', stem: 'They will ', ending: 'play' },
    }
  },
  {
    verb: 'to go',
    translationAr: 'يَذْهَبُ (فِعْلٌ شَاذٌّ)',
    category: 'Irregular Verb',
    ruleEn: 'Present: He/She/It "goes" (add -es). Past: completely changes to "went"!',
    ruleAr: 'فِي الحَاضِرِ نُضِيفُ "-es" مَعَ (He/She/It -> goes). وَفِي المَاضِي يَتَغَيَّرُ كُلِّيَّاً إلَى "went"!',
    presentSimple: {
      'I': { full: 'I go', stem: 'go', ending: '' },
      'You': { full: 'You go', stem: 'go', ending: '' },
      'He / She / It': { full: 'He / She / It goes', stem: 'go', ending: 'es' },
      'We': { full: 'We go', stem: 'go', ending: '' },
      'They': { full: 'They go', stem: 'go', ending: '' },
    },
    presentContinuous: {
      'I': { full: 'I am going', stem: 'I am go', ending: 'ing' },
      'You': { full: 'You are going', stem: 'You are go', ending: 'ing' },
      'He / She / It': { full: 'He / She / It is going', stem: 'He / She / It is go', ending: 'ing' },
      'We': { full: 'We are going', stem: 'We are go', ending: 'ing' },
      'They': { full: 'They are going', stem: 'They are go', ending: 'ing' },
    },
    pastSimple: {
      'I': { full: 'I went', stem: 'I ', ending: 'went' },
      'You': { full: 'You went', stem: 'You ', ending: 'went' },
      'He / She / It': { full: 'He / She / It went', stem: 'He / She / It ', ending: 'went' },
      'We': { full: 'We went', stem: 'We ', ending: 'went' },
      'They': { full: 'They went', stem: 'They ', ending: 'went' },
    },
    futureSimple: {
      'I': { full: 'I will go', stem: 'I will ', ending: 'go' },
      'You': { full: 'You will go', stem: 'You will ', ending: 'go' },
      'He / She / It': { full: 'He / She / It will go', stem: 'He / She / It will ', ending: 'go' },
      'We': { full: 'We will go', stem: 'We will ', ending: 'go' },
      'They': { full: 'They will go', stem: 'They will ', ending: 'go' },
    }
  },
  {
    verb: 'to wash',
    translationAr: 'يَغْسِلُ / يَتَوَضَّأُ (الرُّوتِينُ اليَوْمِيُّ)',
    category: 'Daily Routine',
    ruleEn: 'Verbs ending in -sh add "-es" for He/She/It in Present Simple (washes).',
    ruleAr: 'الأَفْعَالُ المُنْتَهِيَةُ بـ -sh نُضِيفُ لَهَا "-es" مَعَ (He/She/It -> washes).',
    presentSimple: {
      'I': { full: 'I wash', stem: 'wash', ending: '' },
      'You': { full: 'You wash', stem: 'wash', ending: '' },
      'He / She / It': { full: 'He / She / It washes', stem: 'wash', ending: 'es' },
      'We': { full: 'We wash', stem: 'wash', ending: '' },
      'They': { full: 'They wash', stem: 'wash', ending: '' },
    },
    presentContinuous: {
      'I': { full: 'I am washing', stem: 'I am wash', ending: 'ing' },
      'You': { full: 'You are washing', stem: 'You are wash', ending: 'ing' },
      'He / She / It': { full: 'He / She / It is washing', stem: 'He / She / It is wash', ending: 'ing' },
      'We': { full: 'We are washing', stem: 'We are wash', ending: 'ing' },
      'They': { full: 'They are washing', stem: 'They are wash', ending: 'ing' },
    },
    pastSimple: {
      'I': { full: 'I washed', stem: 'wash', ending: 'ed' },
      'You': { full: 'You washed', stem: 'wash', ending: 'ed' },
      'He / She / It': { full: 'He / She / It washed', stem: 'wash', ending: 'ed' },
      'We': { full: 'We washed', stem: 'wash', ending: 'ed' },
      'They': { full: 'They washed', stem: 'wash', ending: 'ed' },
    },
    futureSimple: {
      'I': { full: 'I will wash', stem: 'I will ', ending: 'wash' },
      'You': { full: 'You will wash', stem: 'You will ', ending: 'wash' },
      'He / She / It': { full: 'He / She / It will wash', stem: 'He / She / It will ', ending: 'wash' },
      'We': { full: 'We will wash', stem: 'We will ', ending: 'wash' },
      'They': { full: 'They will wash', stem: 'They will ', ending: 'wash' },
    }
  }
];

interface EnglishLabProps {
  initialTab?: 'conjugator' | 'vocab' | 'dialogue' | 'phonics' | 'grammar';
  grade?: PrimaryGrade;
}

export const EnglishLanguageLab: React.FC<EnglishLabProps> = ({ initialTab = 'conjugator', grade = '3AP' }) => {
  const permittedTenses = allowedEnglishTenses(grade);
  const [activeTab, setActiveTab] = useState<'conjugator' | 'vocab' | 'dialogue' | 'phonics' | 'grammar'>(initialTab);
  const [speakingText, setSpeakingText] = useState<string | null>(null);
  const [echoPhrase, setEchoPhrase] = useState<string>(ENGLISH_VERBS_DATABASE[0].verb);

  // Conjugator State
  const [selectedVerb, setSelectedVerb] = useState<EnglishVerbData>(ENGLISH_VERBS_DATABASE[0]);
  const [selectedTense, setSelectedTense] = useState<EnglishTense>(permittedTenses[0]);
  const [searchFilter, setSearchFilter] = useState<string>('');

  useEffect(() => {
    if (!permittedTenses.includes(selectedTense)) {
      setSelectedTense(permittedTenses[0]);
    }
  }, [grade, permittedTenses, selectedTense]);

  // Quiz Challenge State
  const [quizScore, setQuizScore] = useState<number>(0);
  const [currentQuizIdx, setCurrentQuizIdx] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);

  const QUIZ_QUESTIONS = [
    {
      sentenceEn: 'Omar ____ football every afternoon with his friends.',
      verbName: 'to play (Present Simple)',
      options: ['play', 'plays', 'played'],
      correct: 'plays',
      explanation: 'With "Omar" (He), we add "-s" in Present Simple: "plays".'
    },
    {
      sentenceEn: 'Yesterday, Amina ____ to school by bus.',
      verbName: 'to go (Past Simple)',
      options: ['go', 'goes', 'went'],
      correct: 'went',
      explanation: 'The Past Simple of "to go" is irregular: "went".'
    },
    {
      sentenceEn: 'Look! The students ____ football right now.',
      verbName: 'to play (Present Continuous)',
      options: ['are playing', 'is playing', 'plays'],
      correct: 'are playing',
      explanation: 'With "The students" (They), we use "are" + verb "-ing": "are playing".'
    }
  ];

  const handleSpeak = (text: string) => {
    setEchoPhrase(text);
    setSpeakingText(text);
    speakText(text, 'en-US', 0.85).then(() => {
      setSpeakingText(null);
    });
  };

  useEffect(() => {
    setEchoPhrase(selectedVerb.verb);
  }, [selectedVerb.verb]);

  const tenseTitleMap = {
    presentSimple: 'Present Simple (الحاضر البسيط)',
    presentContinuous: 'Present Continuous (المضارع المستمر - Now)',
    pastSimple: 'Past Simple (الماضي البسيط - Yesterday)',
    futureSimple: 'Future Simple (المستقبل البسيط - Tomorrow)'
  };

  const filteredVerbs = ENGLISH_VERBS_DATABASE.filter(v =>
    v.verb.toLowerCase().includes(searchFilter.toLowerCase()) ||
    v.translationAr.includes(searchFilter) ||
    v.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div data-lab-instrument className="kids-pole rounded-[28px] p-5 sm:p-6 space-y-6 dir-rtl" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
            <Globe className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-[var(--kids-ink)]">
              أَدَاةُ تَصْرِيفِ الأَفْعَالِ الإِنْجِلِيزِيَّةِ التَّفَاعُلِيَّةِ (English Verbs Conjugator 3AP-5AP)
            </h2>
            <p className="text-xs text-[var(--kids-muted)]">
              تصريف تفاعلي ممتع وشامل لأهم الأفعال الإنجليزية المقررة في المنهج الابتدائي مع الاستماع والتحديات
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-indigo-500/20 text-indigo-800 border border-indigo-500/40 px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-indigo-400" />
            <span>Audio Speech Synthesis (Clear English Voice)</span>
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('conjugator')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border ${
            activeTab === 'conjugator'
              ? 'bg-indigo-500 text-white border-indigo-300 shadow-lg scale-[1.02]'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>1. English Verbs Conjugator (تَصْرِيفُ الأَفْعَالِ)</span>
        </button>

        <button
          onClick={() => setActiveTab('vocab')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border ${
            activeTab === 'vocab'
              ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-lg scale-[1.02]'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>2. Vocabulary & Matching</span>
        </button>

        <button
          onClick={() => setActiveTab('dialogue')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border ${
            activeTab === 'dialogue'
              ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-lg scale-[1.02]'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>3. Interactive Dialogues</span>
        </button>

        <button
          onClick={() => setActiveTab('phonics')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border ${
            activeTab === 'phonics'
              ? 'bg-purple-500 text-white border-purple-300 shadow-lg scale-[1.02]'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
        >
          <Ear className="w-4 h-4" />
          <span>4. Phonics & Pronunciation</span>
        </button>
      </div>

      {/* TAB 1: ENGLISH VERBS CONJUGATOR ENGINE */}
      {activeTab === 'conjugator' && (
        <div className="space-y-6">
          {/* Search & Selector */}
          <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-300">
                <Search className="w-4 h-4" />
                <span>Select or search an English verb to conjugate:</span>
              </div>
              <input
                type="text"
                placeholder="Search verb (e.g. play, go, be)..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 font-sans"
              />
            </div>

            {/* Verb Buttons */}
            <div className="flex flex-wrap gap-2.5">
              {filteredVerbs.map((v) => {
                const isSelected = selectedVerb.verb === v.verb;
                return (
                  <button
                    key={v.verb}
                    onClick={() => {
                      setSelectedVerb(v);
                      handleSpeak(v.verb);
                    }}
                    className={`px-4 py-3 rounded-2xl border text-right transition-all cursor-pointer font-sans text-xs flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black border-indigo-300 shadow-lg scale-[1.03] ring-2 ring-indigo-300'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-black tracking-tight">{v.verb}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${
                        isSelected ? 'bg-slate-950 text-indigo-300' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {v.category}
                      </span>
                    </div>
                    <span className={`text-[11px] mt-1 ${isSelected ? 'text-indigo-200 font-bold' : 'text-slate-300'}`}>
                      {v.translationAr}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Verb Display Card */}
          <div className="bg-slate-950 p-6 rounded-3xl border border-indigo-500/30 space-y-6 shadow-xl">
            {/* Verb Title */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black text-indigo-300 font-sans tracking-wide">{selectedVerb.verb}</span>
                  <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-xl text-xs font-bold">
                    {selectedVerb.category}
                  </span>
                  <button
                    onClick={() => handleSpeak(selectedVerb.verb)}
                    className="p-2 bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 rounded-xl border border-indigo-500/30 transition-all cursor-pointer"
                    title="Listen to verb pronunciation"
                  >
                    <Volume2 className={`w-4 h-4 ${speakingText === selectedVerb.verb ? 'text-amber-400 animate-pulse' : ''}`} />
                  </button>
                </div>
                <p className="text-xs text-amber-300 mt-1 font-bold">{selectedVerb.translationAr}</p>
              </div>

              {/* Tense Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 flex-wrap">
                {permittedTenses.map((tKey) => (
                  <button
                    key={tKey}
                    onClick={() => setSelectedTense(tKey)}
                    className={`px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer font-sans ${
                      selectedTense === tKey
                        ? 'bg-indigo-600 text-white shadow-md font-extrabold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {tKey === 'presentSimple' && 'Present Simple'}
                    {tKey === 'presentContinuous' && 'Present Continuous'}
                    {tKey === 'pastSimple' && 'Past Simple'}
                    {tKey === 'futureSimple' && 'Future Simple'}
                  </button>
                ))}
              </div>
            </div>

            {/* Grammar Rule Box */}
            <div className="bg-slate-900/90 border border-indigo-500/30 p-4 rounded-2xl text-xs space-y-1">
              <div className="flex items-center gap-2 text-amber-300 font-black">
                <HelpCircle className="w-4 h-4" />
                <span>Grammar Rule ({tenseTitleMap[selectedTense]}):</span>
              </div>
              <p className="text-slate-200 leading-relaxed font-sans font-medium">{selectedVerb.ruleEn}</p>
              <p className="text-indigo-300 leading-relaxed font-semibold">{selectedVerb.ruleAr}</p>
            </div>

            {/* Conjugation Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-300 flex items-center justify-between">
                <span>Personal Pronouns Conjugation Table:</span>
                <span className="text-[11px] text-amber-400">💡 Click the speech button on any pronoun!</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(selectedVerb[selectedTense] as Record<string, { full: string; stem: string; ending: string }>).map(([pronoun, item]) => {
                  return (
                    <div
                      key={pronoun}
                      className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center justify-between hover:border-indigo-500/50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black bg-slate-800 text-indigo-300 px-3 py-1.5 rounded-xl border border-slate-700 shrink-0 font-sans">
                          {pronoun}
                        </span>
                        <div className="font-sans text-base font-black text-white dir-ltr">
                          <span className="text-slate-200">{item.stem}</span>
                          <span className="text-amber-400 underline decoration-amber-400 underline-offset-4">{item.ending}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSpeak(item.full)}
                        className="p-2.5 bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 rounded-xl border border-indigo-500/30 transition-all cursor-pointer"
                        title="Listen to full pronoun audio"
                      >
                        <Volume2 className={`w-4 h-4 ${speakingText === item.full ? 'text-amber-400 animate-bounce' : ''}`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <VoiceEchoBar modelText={echoPhrase} language="en" />

            {/* Interactive Quiz Game */}
            <div className="pt-4 border-t border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-amber-300 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span>Fun English Conjugation Challenge:</span>
                </h4>
                <span className="text-xs font-extrabold text-emerald-400 font-mono">
                  Score: {quizScore} pts 🏆
                </span>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
                <p className="text-xs text-slate-300 font-bold">
                  Question {currentQuizIdx + 1} / {QUIZ_QUESTIONS.length}: Choose the correct conjugated verb:
                </p>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-sans text-sm font-black text-indigo-300 dir-ltr text-left">
                  {QUIZ_QUESTIONS[currentQuizIdx].sentenceEn}
                  <span className="text-xs text-slate-300 block mt-1 font-mono">
                    [{QUIZ_QUESTIONS[currentQuizIdx].verbName}]
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 dir-ltr">
                  {QUIZ_QUESTIONS[currentQuizIdx].options.map((opt) => {
                    const isSelected = userAnswer === opt;
                    const isCorrect = opt === QUIZ_QUESTIONS[currentQuizIdx].correct;
                    return (
                      <button
                        key={opt}
                        onClick={() => {
                          setUserAnswer(opt);
                          if (isCorrect) {
                            setQuizScore((s) => s + 10);
                          }
                          handleSpeak(opt);
                        }}
                        className={`p-3 rounded-xl border font-sans text-xs font-black transition-all cursor-pointer ${
                          isSelected
                            ? isCorrect
                              ? 'bg-emerald-950 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500'
                              : 'bg-rose-950 border-rose-400 text-rose-200'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {userAnswer !== null && (
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-2">
                    <p className="text-slate-200 font-bold font-sans">{QUIZ_QUESTIONS[currentQuizIdx].explanation}</p>
                    <button
                      onClick={() => {
                        setUserAnswer(null);
                        setCurrentQuizIdx((prev) => (prev + 1) % QUIZ_QUESTIONS.length);
                      }}
                      className="px-4 py-1.5 bg-amber-500 text-slate-950 font-black rounded-lg text-xs cursor-pointer"
                    >
                      Next Question ➔
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VOCABULARY */}
      {activeTab === 'vocab' && (
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-black text-amber-300">📚 English Vocabulary & Word Matching</h3>
          <p className="text-xs text-slate-300">
            Explore official 3AP-5AP vocabulary units (School, Jobs, Routines, Health, Hobbies) with audio pronunciation.
          </p>
        </div>
      )}

      {/* TAB 3: DIALOGUES */}
      {activeTab === 'dialogue' && (
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-black text-emerald-300">🗣️ Interactive English Conversations</h3>
          <p className="text-xs text-slate-300">
            Listen and practice conversational dialogues from the official English textbook.
          </p>
        </div>
      )}

      {/* TAB 4: PHONICS */}
      {activeTab === 'phonics' && (
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-black text-purple-300">🎧 English Phonics & Pronunciation</h3>
          <p className="text-xs text-slate-300">
            Learn letter sounds, silent letters, and clear English pronunciation rules.
          </p>
        </div>
      )}
    </div>
  );
};
