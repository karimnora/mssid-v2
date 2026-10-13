import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from './ui';
import { speakText, stopSpeech } from '../utils/speech';
import { VoiceEchoBar } from './VoiceEchoBar';
import {
  ArrowLeft,
  Volume2,
  Trophy,
  Play,
  Square,
  Headphones,
} from 'lucide-react';
import { PrimaryGrade } from '../types';

interface EnglishAudioDialoguesLabProps {
  grade?: PrimaryGrade;
  onReward?: (coins: number, xp: number) => void;
  onBack?: () => void;
}

interface DialogueLine {
  speaker: string;
  avatar: string;
  textEn: string;
  textAr: string;
}

interface EnglishDialogue {
  id: string;
  grade: PrimaryGrade;
  unit: number;
  titleEn: string;
  titleAr: string;
  topic: string;
  dialogue: DialogueLine[];
  quizQuestions: {
    questionEn: string;
    questionAr: string;
    options: { id: string; textEn: string; isCorrect: boolean }[];
  }[];
}

const OFFICIAL_ENGLISH_DIALOGUES: EnglishDialogue[] = [
  {
    id: 'en-3ap-u1',
    grade: '3AP',
    unit: 1,
    titleEn: 'Unit 1: Hello & Greetings',
    titleAr: 'الوحدة 1 : التحيات والتعارف (Hello, My name is...)',
    topic: 'Introducing oneself, greeting friends and family',
    dialogue: [
      { speaker: 'Amine', avatar: '👦', textEn: 'Hello! My name is Amine. What is your name?', textAr: 'مرحباً! اسمي أمين. ما اسمك؟' },
      { speaker: 'Lina', avatar: '👧', textEn: 'Hi Amine! I am Lina. Nice to meet you.', textAr: 'أهلاً أمين! أنا لينا. سررت بلقائك.' },
      { speaker: 'Amine', avatar: '👦', textEn: 'How old are you, Lina?', textAr: 'كم عمرك يا لينا؟' },
      { speaker: 'Lina', avatar: '👧', textEn: 'I am eight years old. I live in Algiers.', textAr: 'عمري ثماني سنوات. وأعيش في الجزائر العاصمة.' },
    ],
    quizQuestions: [
      {
        questionEn: 'How old is Lina?',
        questionAr: 'كم عمر لينا؟',
        options: [
          { id: 'opt1', textEn: '8 years old', isCorrect: true },
          { id: 'opt2', textEn: '10 years old', isCorrect: false },
          { id: 'opt3', textEn: '5 years old', isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 'en-4ap-u2',
    grade: '4AP',
    unit: 2,
    titleEn: 'Unit 2: My Family & Daily Routine',
    titleAr: 'الوحدة 2 : عائلتي والروتين اليومي',
    topic: 'Family members, morning routines, telling the time',
    dialogue: [
      { speaker: 'Yacine', avatar: '👦', textEn: 'Good morning, Father! What time is it?', textAr: 'صباح الخير يا أبي! كم الساعة الآن؟' },
      { speaker: 'Father', avatar: '👨', textEn: 'Good morning, Yacine! It is seven o’clock. Time for breakfast!', textAr: 'صباح الخير ياسين! إنها السابعة تماماً. حان وقت الفطور!' },
      { speaker: 'Yacine', avatar: '👦', textEn: 'Great! I love milk and dates for breakfast.', textAr: 'رائع! أحب الحليب والتمر في وجبة الإفطار.' },
      { speaker: 'Father', avatar: '👨', textEn: 'Eat well, then we will walk to school together.', textAr: 'تناول فطورك جيداً، ثم سنذهب معاً إلى المدرسة مشياً.' },
    ],
    quizQuestions: [
      {
        questionEn: 'What does Yacine love for breakfast?',
        questionAr: 'ماذا يحب ياسين في وجبة الإفطار؟',
        options: [
          { id: 'opt1', textEn: 'Milk and dates', isCorrect: true },
          { id: 'opt2', textEn: 'Pizza and cola', isCorrect: false },
          { id: 'opt3', textEn: 'Fish and rice', isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 'en-5ap-u3',
    grade: '5AP',
    unit: 3,
    titleEn: 'Unit 3: Giving Directions to Algerian Landmarks',
    titleAr: 'الوحدة 3 : إعطاء الاتجاهات نحو معالم الجزائر',
    topic: 'Giving directions to famous places in Algeria (Martyrs Memorial, Tassili n’Ajjer, Casbah)',
    dialogue: [
      { speaker: 'Meriem', avatar: '👧', textEn: 'Excuse me, how can we get to the Martyrs’ Memorial from here?', textAr: 'معذرة، كيف يمكننا الوصول إلى مقام الشهيد من هنا؟' },
      { speaker: 'Teacher', avatar: '👩‍🏫', textEn: 'Go straight ahead, then turn left at the big park. It is next to the museum.', textAr: 'سيري إلى الأمام، ثم انعطفي يساراً عند الحديقة الكبيرة. إنه بجانب المتحف.' },
      { speaker: 'Karim', avatar: '👦', textEn: 'And how do we get to the Casbah of Algiers?', textAr: 'وكيف نصل إلى قصبة الجزائر؟' },
      { speaker: 'Teacher', avatar: '👩‍🏫', textEn: 'Turn right after the port, then walk straight until you see the old white houses.', textAr: 'انعطف يميناً بعد الميناء، ثم امشِ إلى الأمام حتى ترى البيوت البيضاء القديمة.' },
    ],
    quizQuestions: [
      {
        questionEn: 'Which direction do you turn to reach the Casbah?',
        questionAr: 'في أي اتجاه يجب أن تنعطف للوصول إلى القصبة؟',
        options: [
          { id: 'opt1', textEn: 'Turn right after the port', isCorrect: true },
          { id: 'opt2', textEn: 'Turn left at the school', isCorrect: false },
          { id: 'opt3', textEn: 'Go backward', isCorrect: false },
        ],
      },
    ],
  },
];

export const EnglishAudioDialoguesLab: React.FC<EnglishAudioDialoguesLabProps> = ({
  onReward,
  onBack,
}) => {
  const [selectedDialogueId, setSelectedDialogueId] = useState<string>(OFFICIAL_ENGLISH_DIALOGUES[0].id);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [playingAll, setPlayingAll] = useState(false);
  const playbackEpoch = useRef(0);
  const [activePlayingIndex, setActivePlayingIndex] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [echoLine, setEchoLine] = useState<string>(OFFICIAL_ENGLISH_DIALOGUES[0].dialogue[0]?.textEn ?? '');

  const currentDialogue = OFFICIAL_ENGLISH_DIALOGUES.find((d) => d.id === selectedDialogueId) || OFFICIAL_ENGLISH_DIALOGUES[0];

  const stopPlayback = useCallback(() => {
    playbackEpoch.current++;
    stopSpeech();
    setActivePlayingIndex(null);
    setPlayingAll(false);
  }, []);

  // Routes through the shared speakText helper so this lab gets the same reliable native
  // Android TTS (via Capacitor) as every other lab — calling window.speechSynthesis directly here
  // used to silently fail in the Android app, since the WebView's own speech engine commonly reports
  // zero installed voices (unlike a real Chrome install), unlike the native TTS plugin.
  useEffect(() => {
    stopPlayback();
    setEchoLine(currentDialogue.dialogue[0]?.textEn ?? '');
    return () => { playbackEpoch.current++; stopSpeech(); };
  }, [currentDialogue.id, playbackSpeed, stopPlayback]);

  const speakLine = async (text: string, index?: number) => {
    stopPlayback();
    const run = playbackEpoch.current;
    if (typeof index === 'number') setActivePlayingIndex(index);
    setEchoLine(text);
    try {
      await speakText(text, 'en-US', playbackSpeed, 1, { recordedRate: playbackSpeed });
    } catch {
      if (run === playbackEpoch.current) stopPlayback();
    } finally {
      if (run === playbackEpoch.current) setActivePlayingIndex(null);
    }
  };

  const playEntireDialogue = async () => {
    stopPlayback();
    const run = playbackEpoch.current;
    setPlayingAll(true);
    try {
      for (const [index, line] of currentDialogue.dialogue.entries()) {
        if (run !== playbackEpoch.current) return;
        setActivePlayingIndex(index);
        setEchoLine(line.textEn);
        await speakText(line.textEn, 'en-US', playbackSpeed, 1, { recordedRate: playbackSpeed });
      }
    } catch {
      if (run === playbackEpoch.current) stopPlayback();
    } finally {
      if (run === playbackEpoch.current) { setActivePlayingIndex(null); setPlayingAll(false); }
    }
  };

  const handleQuizAnswer = (qIndex: number, optId: string, isCorrect: boolean) => {
    setQuizAnswers((prev) => ({ ...prev, [qIndex]: optId }));
    if (isCorrect) {
      onReward?.(5, 20);
    }
  };

  return (
    <div data-lab-instrument className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-800 via-purple-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-700/40 relative overflow-hidden">
        <div className="relative z-10 flex items-start gap-3">
          {onBack && (
            <button
              onClick={() => { stopPlayback(); onBack(); }}
              aria-label="Back"
              className="shrink-0 hit-target flex items-center justify-center bg-white/15 hover:bg-white/25 text-white rounded-2xl border border-white/30 shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="space-y-2 flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 text-white px-3 py-1 rounded-full text-xs font-black">
              <Headphones className="w-3.5 h-3.5 text-yellow-300" />
              <span>Official English Audio Lab — 3AP, 4AP & 5AP</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black font-sans">
              Interactive English Listening & Speaking Studio
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed max-w-3xl">
              Listen to native pronunciation, practice real-time dialogues, adjust playback speed, and test your listening comprehension with Algerian curriculum units.
            </p>
          </div>
        </div>
      </div>

      {/* Units Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {OFFICIAL_ENGLISH_DIALOGUES.map((d) => {
          const isSelected = selectedDialogueId === d.id;
          return (
            <button
              key={d.id}
              onClick={() => {
                stopPlayback();
                setSelectedDialogueId(d.id);
                setQuizAnswers({});
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md scale-[1.02]'
                  : 'bg-[var(--app-card-bg)] text-[var(--app-text)] border-[var(--app-card-border)] hover:border-indigo-400'
              }`}
            >
              <div className="space-y-1">
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/90 text-indigo-900' : 'bg-indigo-100 text-indigo-900'}`}>
                  {d.grade} • {d.titleEn.split(':')[0]}
                </span>
                <h3 className="font-black text-sm">{d.titleEn}</h3>
              </div>
              <p className={`text-xs ${isSelected ? 'text-white/80' : 'text-[var(--app-text-muted)]'}`}>
                {d.titleAr}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Dialogue Player */}
      <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Controls bar */}
        <div className="flex items-center justify-between flex-wrap gap-3 border-b border-[var(--app-card-border)] pb-4">
          <div className="flex items-center gap-2">
            <Button variant="primary" size="sm" onClick={() => { if (playingAll) stopPlayback(); else void playEntireDialogue(); }} icon={playingAll ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}>
              {playingAll ? 'Stop Dialogue' : 'Play Full Dialogue 🎧'}
            </Button>
          </div>

          {/* Speed selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[var(--app-text-muted)]">Speed:</span>
            <button
              onClick={() => { stopPlayback(); setPlaybackSpeed(0.7); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                playbackSpeed === 0.7 ? 'bg-indigo-600 text-white' : 'bg-[var(--app-card-subtle)] text-[var(--app-text)]'
              }`}
            >
              0.7x (Slow)
            </button>
            <button
              onClick={() => { stopPlayback(); setPlaybackSpeed(1); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                playbackSpeed === 1 ? 'bg-indigo-600 text-white' : 'bg-[var(--app-card-subtle)] text-[var(--app-text)]'
              }`}
            >
              1.0x (Normal)
            </button>
          </div>
        </div>

        {/* Turn by turn dialogue list */}
        <div className="space-y-3">
          {currentDialogue.dialogue.map((line, idx) => {
            const isPlaying = activePlayingIndex === idx;
            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                  isPlaying
                    ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-300 shadow-sm'
                    : 'bg-[var(--app-card-subtle)] border-[var(--app-card-border)]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl pt-0.5">{line.avatar}</div>
                  <div className="space-y-1">
                    <span className="text-xs font-black text-indigo-700 block">{line.speaker}</span>
                    <p className="text-sm sm:text-base font-bold text-[var(--app-text)]">{line.textEn}</p>
                    <p className="text-xs text-[var(--app-text-muted)] font-arabic dir-rtl">{line.textAr}</p>
                  </div>
                </div>

                <button
                  onClick={() => speakLine(line.textEn, idx)}
                  className="p-2 rounded-xl bg-indigo-500/10 text-indigo-700 hover:bg-indigo-500/20 cursor-pointer shrink-0"
                  title="Listen to this sentence"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        <VoiceEchoBar modelText={echoLine} language="en" onBeforeAction={stopPlayback} />

        {/* Listening Comprehension Quiz */}
        <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-400/30 space-y-4">
          <div className="flex items-center gap-2 text-xs font-black text-indigo-900">
            <Trophy className="w-4 h-4 text-indigo-600" />
            <span>Listening Comprehension Check:</span>
          </div>

          {currentDialogue.quizQuestions.map((q, qIdx) => {
            const userChoice = quizAnswers[qIdx];
            return (
              <div key={qIdx} className="space-y-2">
                <p className="text-xs sm:text-sm font-bold text-[var(--app-text)]">
                  {q.questionEn} <span className="text-xs text-[var(--app-text-muted)] font-arabic">({q.questionAr})</span>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {q.options.map((opt) => {
                    const isSelected = userChoice === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleQuizAnswer(qIdx, opt.id, opt.isCorrect)}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-left ${
                          isSelected
                            ? opt.isCorrect
                              ? 'bg-emerald-100 border-emerald-500 text-emerald-950 font-black'
                              : 'bg-rose-100 border-rose-500 text-rose-950'
                            : 'bg-[var(--app-card-bg)] text-[var(--app-text)] border-[var(--app-card-border)] hover:border-indigo-300'
                        }`}
                      >
                        {opt.textEn}
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
  );
};
