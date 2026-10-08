import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { PreschoolLanguage, PRESCHOOL_LANGUAGE_LABELS } from '../../data/preschool/types';
import { playSoundBoxClip, stopSoundBoxClip, playSuccessChime, playGentleNudge, resumeTownAudio, usePreschoolSpeech } from './usePreschoolAudio';
import { PreschoolMuteButton } from './PreschoolMuteButton';
import { PreschoolFlagMark } from './PreschoolFlagMark';

interface PreschoolSoundBoxProps {
  language: PreschoolLanguage;
  onSelectLanguage?: (lang: PreschoolLanguage) => void;
  onExit: () => void;
}

type SoundCategory = 'animals' | 'vehicles' | 'nature' | 'home' | 'body';

interface SoundItem {
  id: string;
  category: SoundCategory;
  nameAr: string;
  nameFr: string;
  nameEn: string;
  sayAr: string;
  sayFr: string;
  sayEn: string;
  icon: string;
  soundKey: string;
  color: string;
}

/** Only items with a real recording in /public/sounds/box — never a fake synth. */
const SOUND_ITEMS: SoundItem[] = [
  {
    id: 'dog', category: 'animals', icon: '🐶', soundKey: 'dog', color: 'from-blue-400 to-indigo-500',
    nameAr: 'الكَلْب', nameFr: 'Le chien', nameEn: 'The dog',
    sayAr: 'وَفْ وَفْ!', sayFr: 'Waf waf !', sayEn: 'Woof woof!',
  },
  {
    id: 'cat', category: 'animals', icon: '🐱', soundKey: 'cat', color: 'from-violet-400 to-purple-500',
    nameAr: 'القِطَّة', nameFr: 'Le chat', nameEn: 'The cat',
    sayAr: 'مِيَاوْ!', sayFr: 'Miaou !', sayEn: 'Meow!',
  },
  {
    id: 'sheep', category: 'animals', icon: '🐑', soundKey: 'sheep', color: 'from-stone-300 to-stone-500',
    nameAr: 'الخَرُوف', nameFr: 'Le mouton', nameEn: 'The sheep',
    sayAr: 'مَاءْ!', sayFr: 'Baaa !', sayEn: 'Baaa!',
  },
  {
    id: 'cow', category: 'animals', icon: '🐄', soundKey: 'cow', color: 'from-rose-300 to-pink-500',
    nameAr: 'البَقَرَة', nameFr: 'La vache', nameEn: 'The cow',
    sayAr: 'مُوو!', sayFr: 'Meuh !', sayEn: 'Mooo!',
  },
  {
    id: 'hen', category: 'animals', icon: '🐔', soundKey: 'hen', color: 'from-orange-300 to-red-400',
    nameAr: 'الدَّجَاجَة', nameFr: 'La poule', nameEn: 'The hen',
    sayAr: 'قُقْ قُقْ!', sayFr: 'Cot cot !', sayEn: 'Cluck cluck!',
  },
  {
    id: 'rooster', category: 'animals', icon: '🐓', soundKey: 'rooster', color: 'from-red-400 to-orange-500',
    nameAr: 'الدِّيك', nameFr: 'Le coq', nameEn: 'The rooster',
    sayAr: 'كُوكُوكُو!', sayFr: 'Cocorico !', sayEn: 'Cock-a-doodle-doo!',
  },
  {
    id: 'horse', category: 'animals', icon: '🐴', soundKey: 'horse', color: 'from-amber-600 to-yellow-800',
    nameAr: 'الحِصَان', nameFr: 'Le cheval', nameEn: 'The horse',
    sayAr: 'هِهِهِ!', sayFr: 'Hiiii !', sayEn: 'Neigh!',
  },
  {
    id: 'bird', category: 'animals', icon: '🐦', soundKey: 'bird', color: 'from-sky-300 to-cyan-500',
    nameAr: 'العُصْفُور', nameFr: 'L’oiseau', nameEn: 'The bird',
    sayAr: 'صِيصِي!', sayFr: 'Cui cui !', sayEn: 'Tweet tweet!',
  },
  {
    id: 'lion', category: 'animals', icon: '🦁', soundKey: 'lion', color: 'from-orange-500 to-amber-700',
    nameAr: 'الأَسَد', nameFr: 'Le lion', nameEn: 'The lion',
    sayAr: 'زَئِير!', sayFr: 'Grrr !', sayEn: 'Roar!',
  },
  {
    id: 'car', category: 'vehicles', icon: '🚗', soundKey: 'car', color: 'from-rose-500 to-red-600',
    nameAr: 'السَّيَّارَة', nameFr: 'La voiture', nameEn: 'The car',
    sayAr: 'بيب بيب!', sayFr: 'Pouet pouet !', sayEn: 'Beep beep!',
  },
  {
    id: 'train', category: 'vehicles', icon: '🚂', soundKey: 'train', color: 'from-slate-500 to-zinc-700',
    nameAr: 'القِطَار', nameFr: 'Le train', nameEn: 'The train',
    sayAr: 'تُوت تُوت!', sayFr: 'Tchou tchou !', sayEn: 'Choo choo!',
  },
  {
    id: 'ambulance', category: 'vehicles', icon: '🚑', soundKey: 'ambulance', color: 'from-red-400 to-rose-600',
    nameAr: 'سِيَّارَة الإِسْعَاف', nameFr: 'L’ambulance', nameEn: 'The ambulance',
    sayAr: 'نِيو نِيو!', sayFr: 'Pin pon !', sayEn: 'Nee naw!',
  },
  {
    id: 'helicopter', category: 'vehicles', icon: '🚁', soundKey: 'helicopter', color: 'from-teal-500 to-slate-600',
    nameAr: 'المِرْوَحِيَّة', nameFr: 'L’hélicoptère', nameEn: 'The helicopter',
    sayAr: 'تَكْ تَكْ تَكْ', sayFr: 'Tac tac tac', sayEn: 'Chop chop!',
  },
  {
    id: 'sea', category: 'nature', icon: '🌊', soundKey: 'sea', color: 'from-teal-400 to-cyan-600',
    nameAr: 'البَحْر', nameFr: 'La mer', nameEn: 'The sea',
    sayAr: 'شْشْش...', sayFr: 'Chhh…', sayEn: 'Shhh…',
  },
  {
    id: 'rain', category: 'nature', icon: '🌧️', soundKey: 'rain', color: 'from-blue-400 to-indigo-500',
    nameAr: 'المَطَر', nameFr: 'La pluie', nameEn: 'The rain',
    sayAr: 'طَقْ طَقْ', sayFr: 'Ploc ploc', sayEn: 'Pitter-patter',
  },
  {
    id: 'thunder', category: 'nature', icon: '⛈️', soundKey: 'thunder', color: 'from-indigo-600 to-slate-800',
    nameAr: 'الرَّعْد', nameFr: 'Le tonnerre', nameEn: 'The thunder',
    sayAr: 'بُوم!', sayFr: 'Boum !', sayEn: 'Boom!',
  },
  {
    id: 'fire', category: 'nature', icon: '🔥', soundKey: 'fire', color: 'from-orange-500 to-red-600',
    nameAr: 'النَّار', nameFr: 'Le feu', nameEn: 'The fire',
    sayAr: 'كْرِكْ كْرِكْ', sayFr: 'Crac crac', sayEn: 'Crackling',
  },
  {
    id: 'bee', category: 'nature', icon: '🐝', soundKey: 'bee', color: 'from-yellow-400 to-amber-500',
    nameAr: 'النَّحْلَة', nameFr: 'L’abeille', nameEn: 'The bee',
    sayAr: 'زِزْز!', sayFr: 'Bzzz !', sayEn: 'Bzzz!',
  },
  {
    id: 'clock', category: 'home', icon: '⏰', soundKey: 'clock', color: 'from-yellow-400 to-orange-400',
    nameAr: 'السَّاعَة', nameFr: 'L’horloge', nameEn: 'The clock',
    sayAr: 'تِكْ تَاكْ', sayFr: 'Tic tac', sayEn: 'Tick tock',
  },
  {
    id: 'phone', category: 'home', icon: '📞', soundKey: 'phone', color: 'from-green-400 to-emerald-600',
    nameAr: 'الهَاتِف', nameFr: 'Le téléphone', nameEn: 'The phone',
    sayAr: 'رِينْغ رِينْغ', sayFr: 'Dring dring', sayEn: 'Ring ring',
  },
  {
    id: 'kettle', category: 'home', icon: '🫖', soundKey: 'kettle', color: 'from-rose-300 to-orange-400',
    nameAr: 'البَرَّاد', nameFr: 'La bouilloire', nameEn: 'The kettle',
    sayAr: 'فِييي', sayFr: 'Fiiiii', sayEn: 'Whistle',
  },
  {
    id: 'scissors', category: 'home', icon: '✂️', soundKey: 'scissors', color: 'from-slate-400 to-zinc-600',
    nameAr: 'المِقَصّ', nameFr: 'Les ciseaux', nameEn: 'The scissors',
    sayAr: 'قَصْ قَصْ', sayFr: 'Cric crac', sayEn: 'Snip snip',
  },
  {
    id: 'laugh', category: 'body', icon: '😄', soundKey: 'laugh', color: 'from-pink-400 to-rose-500',
    nameAr: 'الضَّحِك', nameFr: 'Le rire', nameEn: 'A laugh',
    sayAr: 'هَا هَا هَا', sayFr: 'Ha ha ha !', sayEn: 'Ha ha ha!',
  },
  {
    id: 'sneeze', category: 'body', icon: '🤧', soundKey: 'sneeze', color: 'from-sky-300 to-indigo-400',
    nameAr: 'العَطْس', nameFr: 'L’éternuement', nameEn: 'A sneeze',
    sayAr: 'عَطْشُو!', sayFr: 'Atchoum !', sayEn: 'Achoo!',
  },
  {
    id: 'clap', category: 'body', icon: '👏', soundKey: 'clap', color: 'from-amber-300 to-yellow-500',
    nameAr: 'التَّصْفِيق', nameFr: 'Les applaudissements', nameEn: 'Clapping',
    sayAr: 'صَفْق صَفْق', sayFr: 'Clap clap !', sayEn: 'Clap clap!',
  },
];

function itemName(item: SoundItem, language: PreschoolLanguage) {
  return language === 'ar' ? item.nameAr : language === 'fr' ? item.nameFr : item.nameEn;
}

function itemSay(item: SoundItem, language: PreschoolLanguage) {
  return language === 'ar' ? item.sayAr : language === 'fr' ? item.sayFr : item.sayEn;
}

export const PreschoolSoundBox: React.FC<PreschoolSoundBoxProps> = ({
  language,
  onSelectLanguage,
  onExit,
}) => {
  const [activeCategory, setActiveCategory] = useState<SoundCategory | 'all'>('animals');
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizTarget, setQuizTarget] = useState<SoundItem | null>(null);
  const [quizOptions, setQuizOptions] = useState<SoundItem[]>([]);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const playTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { speak } = usePreschoolSpeech(language);

  const filteredItems =
    activeCategory === 'all'
      ? SOUND_ITEMS
      : SOUND_ITEMS.filter((i) => i.category === activeCategory);

  const clearPlayTimer = () => {
    if (playTimer.current) {
      clearTimeout(playTimer.current);
      playTimer.current = null;
    }
  };

  /** Explore: say the name, then play the real recording (never at the same time). */
  const playNameThenSound = (item: SoundItem) => {
    resumeTownAudio();
    clearPlayTimer();
    speak(itemName(item, language));
    playTimer.current = setTimeout(() => {
      playSoundBoxClip(item.soundKey);
    }, 1050);
  };

  const startNewQuizRound = () => {
    const pool =
      activeCategory === 'all'
        ? SOUND_ITEMS
        : SOUND_ITEMS.filter((i) => i.category === activeCategory);
    const source = pool.length >= 3 ? pool : SOUND_ITEMS;
    const randomTarget = source[Math.floor(Math.random() * source.length)];
    const others = source
      .filter((i) => i.id !== randomTarget.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);
    const options = [randomTarget, ...others].sort(() => 0.5 - Math.random());

    setQuizTarget(randomTarget);
    setQuizOptions(options);

    clearPlayTimer();
    playTimer.current = setTimeout(() => {
      playSoundBoxClip(randomTarget.soundKey);
      speak(
        language === 'ar'
          ? 'اِسْتَمِعْ... مَنْ هٰذَا؟'
          : language === 'fr'
          ? 'Écoute… qui c’est ?'
          : 'Listen… who is it?',
      );
    }, 280);
  };

  useEffect(() => {
    if (isQuizMode) startNewQuizRound();
    return () => {
      clearPlayTimer();
      stopSoundBoxClip();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isQuizMode]);

  useEffect(() => () => {
    clearPlayTimer();
    stopSoundBoxClip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCardClick = (item: SoundItem) => {
    setActiveCardId(item.id);
    setTimeout(() => setActiveCardId(null), 500);

    if (isQuizMode) {
      if (item.id === quizTarget?.id) {
        playSuccessChime();
        setScore((prev) => prev + 1);
        speak(
          language === 'ar'
            ? `أَحْسَنْت! ${itemName(item, language)}`
            : language === 'fr'
            ? `Bravo ! ${itemName(item, language)}`
            : `Well done! ${itemName(item, language)}`,
        );
        playTimer.current = setTimeout(() => playSoundBoxClip(item.soundKey), 700);
        setTimeout(() => startNewQuizRound(), 1800);
      } else {
        playGentleNudge();
        speak(
          language === 'ar'
            ? 'حاوِلْ مَرَّةً أُخْرَى!'
            : language === 'fr'
            ? 'Essaie encore !'
            : 'Try again!',
        );
      }
      return;
    }

    playNameThenSound(item);
  };

  const labels = {
    title:
      language === 'ar'
        ? 'صُنْدُوقُ الأَصْوَات 🔊'
        : language === 'fr'
        ? 'Boîte à sons 🔊'
        : 'Sound Box 🔊',
    all: language === 'ar' ? 'الْكُلّ' : language === 'fr' ? 'Tous' : 'All',
    animals: language === 'ar' ? 'حَيَوَانَات' : language === 'fr' ? 'Animaux' : 'Animals',
    vehicles: language === 'ar' ? 'وِسَائِل النَّقْل' : language === 'fr' ? 'Véhicules' : 'Vehicles',
    nature: language === 'ar' ? 'طبيعة' : language === 'fr' ? 'Nature' : 'Nature',
    home: language === 'ar' ? 'البيت' : language === 'fr' ? 'Maison' : 'Home',
    body: language === 'ar' ? 'الجِسْم' : language === 'fr' ? 'Corps' : 'Body',
    quizMode: language === 'ar' ? '🎯 مَنْ هٰذَا؟' : language === 'fr' ? '🎯 Qui c’est ?' : '🎯 Who is it?',
    exploreMode: language === 'ar' ? '👂 اِسْتَكْشِفْ' : language === 'fr' ? '👂 Explorer' : '👂 Explore',
    replaySound: language === 'ar' ? 'أَعِدِ الصَّوْت 🔊' : language === 'fr' ? 'Réécouter 🔊' : 'Play again 🔊',
    quizPrompt:
      language === 'ar'
        ? 'اِسْتَمِعْ ثُمَّ الْمَسِ الصُّورَةَ!'
        : language === 'fr'
        ? 'Écoute, puis touche l’image !'
        : 'Listen, then tap the picture!',
    footerHint:
      language === 'ar'
        ? 'أَصْوَاتٌ حَقِيقِيَّة: الِاسْمُ ثُمَّ الصَّوْت'
        : language === 'fr'
        ? 'Vrais enregistrements : le nom, puis le son'
        : 'Real recordings: first the name, then the sound',
  };

  return (
    <div
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="preschool-safe-top min-h-screen bg-gradient-to-b from-amber-100 via-orange-50 to-teal-100 p-3 sm:p-6 flex flex-col"
    >
      <div className="max-w-5xl w-full mx-auto flex items-center justify-between gap-2 sm:gap-4 mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onExit}
            className="min-h-11 min-w-11 sm:min-h-12 sm:min-w-12 flex items-center justify-center rounded-2xl bg-white shadow-md text-2xl hover:bg-orange-50 active:scale-95 transition-all cursor-pointer border border-orange-200"
            aria-label={language === 'ar' ? 'العودة إلى الورشات' : language === 'fr' ? 'Retour aux ateliers' : 'Back to workshops'}
          >
            {language === 'ar' ? '▶' : '◀'}
          </button>
          <PreschoolMuteButton language={language} className="border-amber-200 text-amber-900 hover:bg-amber-50" />
        </div>

        <h1 className="text-lg sm:text-2xl font-black text-amber-950 text-center flex-1 truncate px-2">
          {labels.title}
        </h1>

        <div className="flex items-center gap-1 bg-white/90 p-1 rounded-2xl shadow-sm border border-amber-200">
          {(['ar', 'fr', 'en'] as PreschoolLanguage[]).map((l) => (
            <button
              key={l}
              onClick={() => onSelectLanguage?.(l)}
              className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                language === l
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-amber-900 hover:bg-amber-100'
              }`}
            >
              <span className="inline-flex items-center gap-1">
                <PreschoolFlagMark asset={PRESCHOOL_LANGUAGE_LABELS[l].flag} size={16} />
                {l.toUpperCase()}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsQuizMode(!isQuizMode)}
          className={`min-h-11 px-3 sm:px-4 rounded-2xl text-xs sm:text-sm font-black shadow-md flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer border ${
            isQuizMode
              ? 'bg-amber-400 text-amber-950 border-amber-500 ring-2 ring-amber-300'
              : 'bg-teal-600 text-white border-teal-500'
          }`}
        >
          <span>{isQuizMode ? labels.exploreMode : labels.quizMode}</span>
        </button>
      </div>

      {isQuizMode && quizTarget && (
        <div className="max-w-xl w-full mx-auto mb-4 bg-white/95 rounded-3xl p-5 shadow-lg border-2 border-amber-300 text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">👂</span>
            <h2 className="text-base sm:text-lg font-black text-amber-950">
              {labels.quizPrompt}
            </h2>
            <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-black">
              ⭐ {score}
            </span>
          </div>

          <button
            onClick={() => playSoundBoxClip(quizTarget.soundKey)}
            className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-sm shadow-md active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer border border-amber-500"
          >
            <span>{labels.replaySound}</span>
          </button>
        </div>
      )}

      {!isQuizMode && (
        <div className="max-w-3xl w-full mx-auto flex items-center justify-center gap-1.5 sm:gap-2 mb-3 flex-wrap">
          {[
            { id: 'animals', label: labels.animals, icon: '🐄' },
            { id: 'vehicles', label: labels.vehicles, icon: '🚗' },
            { id: 'nature', label: labels.nature, icon: '🌊' },
            { id: 'home', label: labels.home, icon: '🏠' },
            { id: 'body', label: labels.body, icon: '😄' },
            { id: 'all', label: labels.all, icon: '🌟' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as SoundCategory | 'all')}
              className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                activeCategory === cat.id
                  ? 'bg-amber-500 text-white shadow-md scale-105 border-2 border-amber-300 ring-2 ring-amber-400'
                  : 'bg-white text-amber-950 hover:bg-amber-50 border border-amber-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      )}

      <div className="max-w-5xl w-full mx-auto flex-1 flex items-center justify-center py-2">
        <div
          className={`grid gap-3 sm:gap-4 w-full ${
            isQuizMode
              ? 'grid-cols-1 sm:grid-cols-3 max-w-2xl'
              : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
          }`}
        >
          {(isQuizMode ? quizOptions : filteredItems).map((item) => {
            const isTargetEffect = activeCardId === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => handleCardClick(item)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`min-h-32 sm:min-h-40 rounded-3xl bg-gradient-to-b ${item.color} shadow-lg border-4 border-white/80 p-3 sm:p-4 flex flex-col items-center justify-between text-white transition-all select-none cursor-pointer ${
                  isTargetEffect ? 'ring-4 ring-yellow-400 scale-105 brightness-110' : ''
                }`}
              >
                <span className="text-4xl sm:text-5xl drop-shadow-md">{item.icon}</span>
                <div className="text-center space-y-0.5">
                  <span className="text-sm sm:text-base font-black block drop-shadow-sm leading-tight">
                    {itemName(item, language)}
                  </span>
                  {!isQuizMode && (
                    <span className="text-xs sm:text-sm font-black opacity-95 block">
                      {itemSay(item, language)}
                    </span>
                  )}
                </div>
                <span className="text-[10px] opacity-90 bg-white/20 px-2.5 py-0.5 rounded-full font-bold">
                  🔊
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <p className="text-center text-xs font-bold text-amber-900/80 mt-2">
        {labels.footerHint}
      </p>
    </div>
  );
};
