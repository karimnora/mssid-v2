import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PreschoolLanguage, PRESCHOOL_LANGUAGE_LABELS } from '../../data/preschool/types';
import { playExplorationSound, playSuccessChime, playGentleNudge, usePreschoolSpeech } from './usePreschoolAudio';

interface PreschoolSoundBoxProps {
  language: PreschoolLanguage;
  onSelectLanguage?: (lang: PreschoolLanguage) => void;
  onExit: () => void;
}

type SoundCategory = 'animals' | 'heritage' | 'vehicles' | 'nature';

interface SoundItem {
  id: string;
  category: SoundCategory;
  nameAr: string;
  nameFr: string;
  nameEn: string;
  descAr: string;
  descFr: string;
  descEn: string;
  icon: string;
  soundKey: string;
  color: string;
}

const SOUND_ITEMS: SoundItem[] = [
  // Animals (including Algerian Sahara fauna)
  {
    id: 'fennec',
    category: 'animals',
    nameAr: 'الفنك الجزائري',
    nameFr: 'Le Fennec du Sahara',
    nameEn: 'Sahara Fennec Fox',
    descAr: 'ثعلب الصحراء اللطيف ذو الأذنين الكبيرتين',
    descFr: 'Le petit renard du désert aux grandes oreilles',
    descEn: 'The friendly desert fox with big ears',
    icon: '🦊',
    soundKey: 'fennec',
    color: 'from-amber-400 to-orange-500',
  },
  {
    id: 'camel',
    category: 'animals',
    nameAr: 'الجمل الصحراوي',
    nameFr: 'Le Dromadaire',
    nameEn: 'The Desert Camel',
    descAr: 'سفينة الصحراء الصبورة',
    descFr: 'Le vaisseau du désert',
    descEn: 'The ship of the desert',
    icon: '🐪',
    soundKey: 'camel',
    color: 'from-yellow-500 to-amber-600',
  },
  {
    id: 'sheep',
    category: 'animals',
    nameAr: 'الخروف الصغير',
    nameFr: 'Le Petit Mouton',
    nameEn: 'The Little Sheep',
    descAr: 'صوت المأمأة اللطيف',
    descFr: 'Doux bêlement dans la prairie',
    descEn: 'Gentle baa in the meadow',
    icon: '🐑',
    soundKey: 'sheep',
    color: 'from-emerald-400 to-green-600',
  },
  {
    id: 'cat',
    category: 'animals',
    nameAr: 'القطة الجميلة',
    nameFr: 'Le Joli Chat',
    nameEn: 'The Cute Cat',
    descAr: 'مواء ناعم ولطيف',
    descFr: 'Doux miaulement câlin',
    descEn: 'Soft friendly meow',
    icon: '🐱',
    soundKey: 'cat',
    color: 'from-rose-400 to-pink-500',
  },
  {
    id: 'dog',
    category: 'animals',
    nameAr: 'الكلب الوفي',
    nameFr: 'Le Chien Fidèle',
    nameEn: 'The Faithful Dog',
    descAr: 'نباح الحراسة والمرح',
    descFr: 'Aboiement joyeux et protecteur',
    descEn: 'Playful barking sound',
    icon: '🐶',
    soundKey: 'dog',
    color: 'from-blue-400 to-indigo-500',
  },
  {
    id: 'bird',
    category: 'animals',
    nameAr: 'العصفور المغرد',
    nameFr: 'L\'Oiseau Chanteur',
    nameEn: 'The Singing Bird',
    descAr: 'زقزقة الصباح البهيجة',
    descFr: 'Gazouillis matinal joyeux',
    descEn: 'Joyful morning chirping',
    icon: '🐦',
    soundKey: 'bird',
    color: 'from-sky-400 to-cyan-500',
  },
  {
    id: 'lion',
    category: 'animals',
    nameAr: 'الأسد الأطلسي',
    nameFr: 'Le Lion de l\'Atlas',
    nameEn: 'The Atlas Lion',
    descAr: 'زئير ملك الغابة القوي',
    descFr: 'Puissant rugissement royal',
    descEn: 'Mighty royal roar',
    icon: '🦁',
    soundKey: 'lion',
    color: 'from-orange-500 to-red-600',
  },

  // Algerian Heritage & Instruments
  {
    id: 'darbuka',
    category: 'heritage',
    nameAr: 'الدربوكة الجزائرية',
    nameFr: 'La Darbouka Algérienne',
    nameEn: 'Algerian Darbuka Drum',
    descAr: 'إيقاع الدوم والتك الأصيل للأعراس',
    descFr: 'Rythme festif Doum & Tak',
    descEn: 'Festive rhythmic drum beat',
    icon: '🥁',
    soundKey: 'darbuka_dum',
    color: 'from-amber-600 to-yellow-600',
  },
  {
    id: 'bendir',
    category: 'heritage',
    nameAr: 'البندير التراثي',
    nameFr: 'Le Bendir Traditionnel',
    nameEn: 'Traditional Bendir',
    descAr: 'دف شعبي أصيل من التراث الجزائري',
    descFr: 'Tambour sur cadre traditionnel',
    descEn: 'Traditional Algerian frame drum',
    icon: '🪘',
    soundKey: 'bendir',
    color: 'from-emerald-500 to-teal-700',
  },
  {
    id: 'karkabou',
    category: 'heritage',
    nameAr: 'القرقابو القناوي',
    nameFr: 'Les Qarqabou Gnawa',
    nameEn: 'Gnawa Qarkabu',
    descAr: 'صنوج معدنية رنانة ومبهجة',
    descFr: 'Castagnettes métalliques envoûtantes',
    descEn: 'Rhythmic metallic percussion',
    icon: '🔔',
    soundKey: 'karkabou',
    color: 'from-yellow-400 to-amber-600',
  },
  {
    id: 'gasba',
    category: 'heritage',
    nameAr: 'القصبة والناي',
    nameFr: 'La Gasba & le Ney',
    nameEn: 'Gasba Flute',
    descAr: 'أنغام القصبة البدوية الأصيلة',
    descFr: 'Mélodie de flûte pastorale',
    descEn: 'Traditional reed melody',
    icon: '🪈',
    soundKey: 'gasba',
    color: 'from-lime-500 to-emerald-600',
  },

  // Vehicles
  {
    id: 'car',
    category: 'vehicles',
    nameAr: 'السيارة ومنبه الصوت',
    nameFr: 'La Voiture & Klaxon',
    nameEn: 'The Car & Horn',
    descAr: 'صوت المحرك والمنبه بي-بيب',
    descFr: 'Vroum et klaxon pouët-pouët',
    descEn: 'Engine vroom and horn beep',
    icon: '🚗',
    soundKey: 'car',
    color: 'from-rose-500 to-red-600',
  },
  {
    id: 'train',
    category: 'vehicles',
    nameAr: 'قطار الجزائر السريع',
    nameFr: 'Le Train Express',
    nameEn: 'The Express Train',
    descAr: 'صوت صفارة القطار تووت تووت',
    descFr: 'Tchou-tchou du train sur les rails',
    descEn: 'Choo-choo train horn',
    icon: '🚂',
    soundKey: 'train',
    color: 'from-purple-500 to-violet-700',
  },
  {
    id: 'plane',
    category: 'vehicles',
    nameAr: 'الطائرة المحلقة',
    nameFr: 'L\'Avion dans le Ciel',
    nameEn: 'The Flying Airplane',
    descAr: 'تحليق الطائرة في أعالي السحاب',
    descFr: 'L\'avion qui fend les nuages',
    descEn: 'Jet soaring through clouds',
    icon: '✈️',
    soundKey: 'plane',
    color: 'from-cyan-500 to-blue-600',
  },

  // Nature
  {
    id: 'sea',
    category: 'nature',
    nameAr: 'أمواج بحر الجزائر',
    nameFr: 'Les Vagues de la Méditerranée',
    nameEn: 'The Mediterranean Waves',
    descAr: 'خرير أمواج البحر الهادئة',
    descFr: 'Le doux ressac des vagues',
    descEn: 'Gentle sea waves on the shore',
    icon: '🌊',
    soundKey: 'sea',
    color: 'from-teal-400 to-cyan-600',
  },
  {
    id: 'rain',
    category: 'nature',
    nameAr: 'زخات المطر والخير',
    nameFr: 'Les Gouttes de Pluie',
    nameEn: 'Gentle Raindrops',
    descAr: 'صوت قطرات المطر العذبة',
    descFr: 'La douce pluie bienfaisante',
    descEn: 'Fresh soothing rain showers',
    icon: '🌧️',
    soundKey: 'rain',
    color: 'from-blue-400 to-indigo-600',
  },
];

export const PreschoolSoundBox: React.FC<PreschoolSoundBoxProps> = ({
  language,
  onSelectLanguage,
  onExit,
}) => {
  const [activeCategory, setActiveCategory] = useState<SoundCategory | 'all'>('all');
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizTarget, setQuizTarget] = useState<SoundItem | null>(null);
  const [quizOptions, setQuizOptions] = useState<SoundItem[]>([]);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);

  const { speak } = usePreschoolSpeech(language);

  const filteredItems =
    activeCategory === 'all'
      ? SOUND_ITEMS
      : SOUND_ITEMS.filter((i) => i.category === activeCategory);

  const startNewQuizRound = () => {
    const randomTarget = SOUND_ITEMS[Math.floor(Math.random() * SOUND_ITEMS.length)];
    const others = SOUND_ITEMS.filter((i) => i.id !== randomTarget.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);
    const options = [randomTarget, ...others].sort(() => 0.5 - Math.random());

    setQuizTarget(randomTarget);
    setQuizOptions(options);

    // Play target sound & vocal prompt
    setTimeout(() => {
      playExplorationSound(randomTarget.soundKey);
      speak(
        language === 'ar'
          ? 'استمع جيداً... من يصدر هذا الصوت يا شاطر؟'
          : language === 'fr'
          ? 'Écoute bien... qui fait ce son ?'
          : 'Listen closely... who makes this sound?'
      );
    }, 250);
  };

  useEffect(() => {
    if (isQuizMode) {
      startNewQuizRound();
    }
  }, [isQuizMode]);

  const handleCardClick = (item: SoundItem) => {
    setActiveCardId(item.id);
    setTimeout(() => setActiveCardId(null), 500);

    if (isQuizMode) {
      if (item.id === quizTarget?.id) {
        playSuccessChime();
        setScore((prev) => prev + 1);
        const name = language === 'ar' ? item.nameAr : language === 'fr' ? item.nameFr : item.nameEn;
        speak(
          language === 'ar'
            ? `أحسنت ممتاز! هذا صوت ${name}`
            : language === 'fr'
            ? `Bravo excellent ! C'est ${name}`
            : `Great job! That's ${name}`
        );
        setTimeout(() => startNewQuizRound(), 1300);
      } else {
        playGentleNudge();
        speak(
          language === 'ar'
            ? 'حاول مرة أخرى يا بطل، استمع ثانية!'
            : language === 'fr'
            ? 'Essaie encore champion, réécoute le son !'
            : 'Try again, listen one more time!'
        );
      }
    } else {
      playExplorationSound(item.soundKey);
      const name = language === 'ar' ? item.nameAr : language === 'fr' ? item.nameFr : item.nameEn;
      speak(name);
    }
  };

  const labels = {
    title:
      language === 'ar'
        ? 'صندوق الأصوات والتراث الجزائري 🔊'
        : language === 'fr'
        ? 'Boîte à Sons & Découverte Sensorielle 🔊'
        : 'Preschool Sound Box & Heritage 🔊',
    all: language === 'ar' ? 'الكل' : language === 'fr' ? 'Tous' : 'All',
    animals: language === 'ar' ? 'الحيوانات 🦁' : language === 'fr' ? 'Animaux 🦁' : 'Animals 🦁',
    heritage: language === 'ar' ? 'آلات التراث 🥁' : language === 'fr' ? 'Instruments 🥁' : 'Instruments 🥁',
    vehicles: language === 'ar' ? 'المركبات 🚗' : language === 'fr' ? 'Véhicules 🚗' : 'Vehicles 🚗',
    nature: language === 'ar' ? 'الطبيعة 🌊' : language === 'fr' ? 'Nature 🌊' : 'Nature 🌊',
    quizMode: language === 'ar' ? '🎯 لعبة خمن الصوت' : language === 'fr' ? '🎯 Mini-Quiz Sonore' : '🎯 Guess Sound Quiz',
    exploreMode: language === 'ar' ? '👂 استكشاف الأصوات' : language === 'fr' ? '👂 Explorer' : '👂 Explore',
    replaySound: language === 'ar' ? 'إعادة سماع الصوت 🔊' : language === 'fr' ? 'Réécouter le son 🔊' : 'Replay Sound 🔊',
    quizPrompt:
      language === 'ar'
        ? 'استمع للصوت واضغط على البطاقة الصحيحة!'
        : language === 'fr'
        ? 'Écoute le son et choisis la bonne carte !'
        : 'Listen to the sound and pick the matching card!',
    footerHint:
      language === 'ar'
        ? 'المس أي بطاقة لاكتشاف صوتها والتعلم مع صديقنا الفنك! 🦊'
        : language === 'fr'
        ? 'Touche une carte pour écouter son son et apprendre avec Dido le Fennec ! 🦊'
        : 'Tap any card to discover its sound with Dido the Fennec! 🦊',
  };

  return (
    <div
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="min-h-screen bg-gradient-to-b from-amber-100 via-orange-50 to-teal-100 p-3 sm:p-6 flex flex-col justify-between"
    >
      {/* Top Header */}
      <div className="max-w-5xl w-full mx-auto flex items-center justify-between gap-2 sm:gap-4 mb-3">
        <button
          onClick={onExit}
          className="min-h-11 min-w-11 sm:min-h-12 sm:min-w-12 flex items-center justify-center rounded-2xl bg-white shadow-md text-2xl hover:bg-orange-50 active:scale-95 transition-all cursor-pointer border border-orange-200"
          aria-label="خروج"
        >
          🚪
        </button>

        <h1 className="text-lg sm:text-2xl font-black text-amber-950 text-center flex-1 truncate px-2">
          {labels.title}
        </h1>

        {/* Trilingual Language Quick Switcher */}
        <div className="flex items-center gap-1 bg-white/90 p-1 rounded-2xl shadow-sm border border-amber-200">
          {(['ar', 'fr', 'en'] as PreschoolLanguage[]).map((l) => (
            <button
              key={l}
              onClick={() => {
                if (onSelectLanguage) onSelectLanguage(l);
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                language === l
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-amber-900 hover:bg-amber-100'
              }`}
            >
              {PRESCHOOL_LANGUAGE_LABELS[l].flag} {l.toUpperCase()}
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

      {/* Quiz Banner if in Quiz mode */}
      {isQuizMode && quizTarget && (
        <div className="max-w-xl w-full mx-auto mb-4 bg-white/95 backdrop-blur-xs rounded-3xl p-5 shadow-lg border-2 border-amber-300 text-center space-y-3">
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
            onClick={() => playExplorationSound(quizTarget.soundKey)}
            className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-sm shadow-md active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer border border-amber-500 animate-pulse"
          >
            <span>{labels.replaySound}</span>
          </button>
        </div>
      )}

      {/* Categories Filter (Only in Explore mode) */}
      {!isQuizMode && (
        <div className="max-w-3xl w-full mx-auto flex items-center justify-center gap-1.5 sm:gap-2 mb-3 flex-wrap">
          {[
            { id: 'all', label: labels.all, icon: '🌟' },
            { id: 'animals', label: labels.animals, icon: '🦁' },
            { id: 'heritage', label: labels.heritage, icon: '🥁' },
            { id: 'vehicles', label: labels.vehicles, icon: '🚗' },
            { id: 'nature', label: labels.nature, icon: '🌊' },
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

      {/* Sound Cards Grid */}
      <div className="max-w-5xl w-full mx-auto flex-1 flex items-center justify-center py-2">
        <div
          className={`grid gap-3 sm:gap-4 w-full ${
            isQuizMode
              ? 'grid-cols-1 sm:grid-cols-3 max-w-2xl'
              : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
          }`}
        >
          {(isQuizMode ? quizOptions : filteredItems).map((item) => {
            const isTargetEffect = activeCardId === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => handleCardClick(item)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                className={`min-h-36 sm:min-h-44 rounded-3xl bg-gradient-to-b ${item.color} shadow-lg border-4 border-white/80 p-3 sm:p-4 flex flex-col items-center justify-between text-white transition-all select-none cursor-pointer ${
                  isTargetEffect ? 'ring-4 ring-yellow-400 scale-105 brightness-110' : ''
                }`}
              >
                <span className="text-4xl sm:text-5xl drop-shadow-md">{item.icon}</span>
                <div className="text-center space-y-0.5">
                  <span className="text-sm sm:text-base font-black block drop-shadow-sm leading-tight">
                    {language === 'ar' ? item.nameAr : language === 'fr' ? item.nameFr : item.nameEn}
                  </span>
                  {!isQuizMode && (
                    <span className="text-[10px] opacity-80 block line-clamp-1">
                      {language === 'ar' ? item.descAr : language === 'fr' ? item.descFr : item.descEn}
                    </span>
                  )}
                </div>
                <span className="text-[10px] opacity-90 bg-white/20 px-2.5 py-0.5 rounded-full font-bold">
                  🔊 {language === 'ar' ? 'استمع' : language === 'fr' ? 'Écouter' : 'Listen'}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Footer hint */}
      <p className="text-center text-xs font-bold text-amber-900/80 mt-2">
        {labels.footerHint}
      </p>
    </div>
  );
};
