import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PreschoolLanguage, PRESCHOOL_LANGUAGE_LABELS } from '../../data/preschool/types';
import { playMusicalNote, playSuccessChime, playExplorationSound, usePreschoolSpeech } from './usePreschoolAudio';
import { PreschoolMuteButton } from './PreschoolMuteButton';
import { PreschoolFlagMark } from './PreschoolFlagMark';

interface PreschoolXylophoneProps {
  language: PreschoolLanguage;
  onSelectLanguage?: (lang: PreschoolLanguage) => void;
  onExit: () => void;
}

export type InstrumentType = 'xylophone' | 'piano' | 'marimba' | 'flute' | 'mandole' | 'darbuka';

interface NoteKey {
  id: string;
  noteAr: string;
  noteFr: string;
  noteEn: string;
  freq: number;
  color: string;
  textColor: string;
  heightClass: string;
  keyLabel?: string;
  isBlack?: boolean;
}

const MUSICAL_KEYS: NoteKey[] = [
  { id: 'c4', noteAr: 'دُو', noteFr: 'DO', noteEn: 'C', freq: 261.63, color: 'from-rose-500 to-red-600', textColor: 'text-white', heightClass: 'h-64 sm:h-72', keyLabel: '1' },
  { id: 'd4', noteAr: 'رِي', noteFr: 'RÉ', noteEn: 'D', freq: 293.66, color: 'from-orange-400 to-amber-500', textColor: 'text-orange-950', heightClass: 'h-60 sm:h-68', keyLabel: '2' },
  { id: 'e4', noteAr: 'مِي', noteFr: 'MI', noteEn: 'E', freq: 329.63, color: 'from-amber-300 to-yellow-400', textColor: 'text-amber-950', heightClass: 'h-56 sm:h-64', keyLabel: '3' },
  { id: 'f4', noteAr: 'فَا', noteFr: 'FA', noteEn: 'F', freq: 349.23, color: 'from-emerald-400 to-green-500', textColor: 'text-emerald-950', heightClass: 'h-52 sm:h-60', keyLabel: '4' },
  { id: 'g4', noteAr: 'صُولْ', noteFr: 'SOL', noteEn: 'G', freq: 392.0, color: 'from-cyan-400 to-teal-500', textColor: 'text-cyan-950', heightClass: 'h-48 sm:h-56', keyLabel: '5' },
  { id: 'a4', noteAr: 'لَا', noteFr: 'LA', noteEn: 'A', freq: 440.0, color: 'from-blue-400 to-indigo-500', textColor: 'text-white', heightClass: 'h-44 sm:h-52', keyLabel: '6' },
  { id: 'b4', noteAr: 'سِي', noteFr: 'SI', noteEn: 'B', freq: 493.88, color: 'from-purple-400 to-violet-600', textColor: 'text-white', heightClass: 'h-40 sm:h-48', keyLabel: '7' },
  { id: 'c5', noteAr: 'دُو²', noteFr: 'DO²', noteEn: 'C²', freq: 523.25, color: 'from-pink-400 to-rose-500', textColor: 'text-white', heightClass: 'h-36 sm:h-44', keyLabel: '8' },
];

const PIANO_BLACK_KEYS = [
  { id: 'c#4', noteAr: 'دُو#', noteFr: 'DO#', noteEn: 'C#', freq: 277.18, leftPercent: '11%' },
  { id: 'd#4', noteAr: 'رِي#', noteFr: 'RÉ#', noteEn: 'D#', freq: 311.13, leftPercent: '23.5%' },
  { id: 'f#4', noteAr: 'فَا#', noteFr: 'FA#', noteEn: 'F#', freq: 369.99, leftPercent: '48.5%' },
  { id: 'g#4', noteAr: 'صُول#', noteFr: 'SOL#', noteEn: 'G#', freq: 415.3, leftPercent: '61%' },
  { id: 'a#4', noteAr: 'لَا#', noteFr: 'LA#', noteEn: 'A#', freq: 466.16, leftPercent: '73.5%' },
];

const PERCUSSION_PADS = [
  { id: 'darbuka_dum', nameAr: 'دُوم الدربوكة', nameFr: 'Darbouka DOUM', nameEn: 'Darbuka DOUM', soundKey: 'darbuka_dum', icon: '🥁', color: 'from-amber-600 to-amber-800', descAr: 'ضربة الوسط العميقة', descFr: 'Frappe centrale grave', descEn: 'Deep center hit' },
  { id: 'darbuka_tak', nameAr: 'تَكْ الدربوكة', nameFr: 'Darbouka TAK', nameEn: 'Darbuka TAK', soundKey: 'darbuka_tak', icon: '✨', color: 'from-orange-500 to-amber-600', descAr: 'رنين الحافة الصافي', descFr: 'Frappe aiguë du bord', descEn: 'Crisp rim hit' },
  { id: 'bendir', nameAr: 'البندير الجزائري', nameFr: 'Bendir Traditionnel', nameEn: 'Algerian Bendir', soundKey: 'bendir', icon: '🪘', color: 'from-emerald-600 to-teal-800', descAr: 'إيقاع الفلكلور والتراث', descFr: 'Rythme du terroir', descEn: 'Folk frame drum' },
  { id: 'karkabou', nameAr: 'القرقابو القناوي', nameFr: 'Qarqabou Gnawa', nameEn: 'Gnawa Qarkabu', soundKey: 'karkabou', icon: '🔔', color: 'from-yellow-500 to-amber-600', descAr: 'صنوج معدنية بهيجة', descFr: 'Castagnettes métalliques', descEn: 'Metallic castanets' },
];

interface NurserySong {
  id: string;
  titleAr: string;
  titleFr: string;
  titleEn: string;
  icon: string;
  tag: string;
  sequence: string[]; // key ids
}

const ALGERIAN_NURSERY_SONGS: NurserySong[] = [
  {
    id: 'qassaman',
    titleAr: '🇩🇿 قسماً - النشيد الوطني (مبسّط)',
    titleFr: '🇩🇿 Qassaman - Hymne National',
    titleEn: '🇩🇿 Qassaman - National Anthem',
    icon: '🇩🇿',
    tag: 'وطني',
    sequence: ['c4', 'e4', 'g4', 'g4', 'a4', 'g4', 'e4', 'g4', 'f4', 'e4', 'd4', 'c4'],
  },
  {
    id: 'tira',
    titleAr: '🕊️ يا طيرة طيري يا حمامة',
    titleFr: '🕊️ Ya Tira Tiri Ya Hamama',
    titleEn: '🕊️ Fly Little Dove (Algerian Folk)',
    icon: '🕊️',
    tag: 'تراثي أطفالي',
    sequence: ['e4', 'g4', 'g4', 'e4', 'd4', 'c4', 'd4', 'e4', 'g4', 'e4', 'd4', 'c4'],
  },
  {
    id: 'badru',
    titleAr: '🌙 طلع البدر علينا',
    titleFr: '🌙 Tala\'a al-Badru \'Alayna',
    titleEn: '🌙 Full Moon Rose (Nasheed)',
    icon: '🌙',
    tag: 'نشيد',
    sequence: ['c4', 'e4', 'g4', 'g4', 'a4', 'g4', 'e4', 'f4', 'e4', 'd4', 'c4'],
  },
  {
    id: 'mansour',
    titleAr: '🔨 عمي منصور النجّار',
    titleFr: '🔨 Ammi Mansour le Menuisier',
    titleEn: '🔨 Uncle Mansour the Carpenter',
    icon: '🔨',
    tag: 'أغنية للأطفال',
    sequence: ['c4', 'd4', 'e4', 'c4', 'e4', 'f4', 'g4', 'g4', 'a4', 'g4', 'f4', 'e4', 'c4'],
  },
  {
    id: 'inouva',
    titleAr: '🌾 A Vava Inouva (ثفاث ثفاث - إيدير)',
    titleFr: '🌾 A Vava Inouva (Idir)',
    titleEn: '🌾 A Vava Inouva (Kabyle Lullaby)',
    icon: '🌾',
    tag: 'تراثي قبائلي',
    sequence: ['e4', 'g4', 'a4', 'g4', 'e4', 'd4', 'e4', 'g4', 'e4', 'd4', 'c4'],
  },
  {
    id: 'mama',
    titleAr: '💖 ماما يا ماما يا أنشودة قلبي',
    titleFr: '💖 Maman chérie, mélodie de mon cœur',
    titleEn: '💖 Mama, Melody of My Heart',
    icon: '💖',
    tag: 'أنشودة',
    sequence: ['c4', 'c4', 'g4', 'g4', 'a4', 'g4', 'f4', 'f4', 'e4', 'e4', 'd4', 'c4'],
  },
  {
    id: 'twinkle',
    titleAr: '⭐ نجمة السماء الصغيرة',
    titleFr: '⭐ Ah ! vous dirai-je, maman',
    titleEn: '⭐ Twinkle Twinkle Little Star',
    icon: '⭐',
    tag: 'عالمي',
    sequence: ['c4', 'c4', 'g4', 'g4', 'a4', 'a4', 'g4', 'f4', 'f4', 'e4', 'e4', 'd4', 'd4', 'c4'],
  },
  {
    id: 'week-days',
    titleAr: '📅 أُغْنِيَةُ أَيَّامِ الأُسْبُوعِ',
    titleFr: '📅 La Chanson des Jours de la Semaine',
    titleEn: '📅 Days of the Week Song',
    icon: '📅',
    tag: 'أنشودة تعليمية',
    sequence: ['c4', 'd4', 'e4', 'f4', 'g4', 'a4', 'b4', 'c5', 'b4', 'a4', 'g4', 'f4', 'e4', 'd4', 'c4'],
  },
  {
    id: 'four-seasons',
    titleAr: '🍂 أُغْنِيَةُ الفُصُولِ الأَرْبَعَةِ',
    titleFr: '🍂 La Chanson des 4 Saisons',
    titleEn: '🍂 The Four Seasons Song',
    icon: '🍂',
    tag: 'أنشودة تعليمية',
    sequence: ['c4', 'e4', 'g4', 'e4', 'd4', 'f4', 'a4', 'f4', 'e4', 'g4', 'c5', 'g4', 'c4', 'e4', 'g4', 'c4'],
  },
];

export const PreschoolXylophone: React.FC<PreschoolXylophoneProps> = ({
  language,
  onSelectLanguage,
  onExit,
}) => {
  const [instrument, setInstrument] = useState<InstrumentType>('xylophone');
  const [activeSong, setActiveSong] = useState<NurserySong | null>(null);
  const [songStepIndex, setSongStepIndex] = useState<number>(0);
  const [activeKeyEffect, setActiveKeyEffect] = useState<string | null>(null);
  const [particles, setParticles] = useState<{ id: number; keyId: string; symbol: string }[]>([]);

  const { speak } = usePreschoolSpeech(language);
  const noteLabel = (n: { noteAr: string; noteFr: string; noteEn: string }) =>
    language === 'ar' ? n.noteAr : language === 'fr' ? n.noteFr : n.noteEn;

  const targetSongKeyId = activeSong ? activeSong.sequence[songStepIndex] : null;

  const handleKeyPress = (key: { id: string; freq: number; noteAr: string; noteFr: string; noteEn: string }) => {
    // Play instrument sound
    playMusicalNote(key.freq, instrument);
    setActiveKeyEffect(key.id);
    setTimeout(() => setActiveKeyEffect(null), 300);

    // Particle effect
    const newParticle = {
      id: Date.now() + Math.random(),
      keyId: key.id,
      symbol: ['🎵', '🎶', '✨', '⭐', '🎈', '💖'][Math.floor(Math.random() * 6)],
    };
    setParticles((prev) => [...prev.slice(-6), newParticle]);

    // Check song step
    if (activeSong && targetSongKeyId === key.id) {
      const nextIndex = songStepIndex + 1;
      if (nextIndex >= activeSong.sequence.length) {
        // Song completed!
        setTimeout(() => {
          playSuccessChime();
          speak(
            language === 'ar'
              ? 'أحسنت يا بطل! عزفت اللحن التراثي الرائع كاملاً!'
              : language === 'fr'
              ? 'Bravo champion ! Tu as joué toute la mélodie avec succès !'
              : 'Awesome! You played the entire melody perfectly!'
          );
          setSongStepIndex(0);
          setActiveSong(null);
        }, 300);
      } else {
        setSongStepIndex(nextIndex);
      }
    }
  };

  const handlePercussionPress = (pad: typeof PERCUSSION_PADS[0]) => {
    playExplorationSound(pad.soundKey);
    setActiveKeyEffect(pad.id);
    setTimeout(() => setActiveKeyEffect(null), 350);

    const padName = language === 'ar' ? pad.nameAr : language === 'fr' ? pad.nameFr : pad.nameEn;
    speak(padName);
  };

  const labels = {
    title:
      language === 'ar'
        ? 'الْبِيَانُو وَالْمُوسِيقَى 🎹'
        : language === 'fr'
        ? 'Piano et mélodies 🎹'
        : 'Piano and songs 🎹',
    instruments: language === 'ar' ? 'اِخْتَرِ الآلَة:' : language === 'fr' ? 'Choisis l\'instrument :' : 'Choose an instrument:',
    xylophone: language === 'ar' ? 'زِيلُوفُون' : language === 'fr' ? 'Xylophone' : 'Xylophone',
    piano: language === 'ar' ? 'بِيَانُو' : language === 'fr' ? 'Piano' : 'Piano',
    marimba: language === 'ar' ? 'مَارِيمْبَا' : language === 'fr' ? 'Marimba' : 'Marimba',
    flute: language === 'ar' ? 'النَّاي / القَصَبَة' : language === 'fr' ? 'Gasba / Flûte' : 'Gasba / Flute',
    mandole: language === 'ar' ? 'مَنْدُول / عُود' : language === 'fr' ? 'Mandole / Oud' : 'Mandole / Oud',
    darbuka: language === 'ar' ? 'دَرْبُوكَة وَبَنْدِير' : language === 'fr' ? 'Darbouka et bendir' : 'Darbuka and bendir',
    songsTitle:
      language === 'ar'
        ? '🇩🇿 أَنَاشِيد وَأَهَازِيج الأَطْفَال:'
        : language === 'fr'
        ? '🇩🇿 Chansons et comptines algériennes :'
        : '🇩🇿 Algerian nursery songs:',
    freePlay: language === 'ar' ? 'عَزْف حُرّ' : language === 'fr' ? 'Jeu libre' : 'Free play',
    songGuideHint:
      language === 'ar'
        ? '👉 اِضْغَطْ عَلَى المِفْتَاحِ المُضِيء 🌟 لِتُكَمِّلَ النَّشِيد!'
        : language === 'fr'
        ? '👉 Touche la touche scintillante 🌟 pour continuer la chanson !'
        : '👉 Tap the glowing key 🌟 to continue the song!',
    tapHint:
      language === 'ar'
        ? 'اِلْمَسِ المَفَاتِيحَ المُلَوَّنَة لِعَزْفِ أَحْلَى النَّغَمَات! 🎶'
        : language === 'fr'
        ? 'Touche les notes colorées pour créer de jolies mélodies ! 🎶'
            : 'Tap the colourful keys to play sweet melodies! 🎶',
  };

  const INSTRUMENTS = [
    { id: 'xylophone', icon: '🔔', label: labels.xylophone },
    { id: 'piano', icon: '🎹', label: labels.piano },
    { id: 'marimba', icon: '🪵', label: labels.marimba },
    { id: 'flute', icon: '🪈', label: labels.flute },
    { id: 'mandole', icon: '🪕', label: labels.mandole },
    { id: 'darbuka', icon: '🥁', label: labels.darbuka },
  ];

  return (
    <div
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="preschool-safe-top min-h-screen bg-gradient-to-b from-sky-100 via-purple-50 to-amber-100 p-3 sm:p-6 flex flex-col justify-between"
    >
      {/* Top Header */}
      <div className="max-w-5xl w-full mx-auto flex items-center justify-between gap-2 sm:gap-4 mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onExit}
            className="min-h-11 min-w-11 sm:min-h-12 sm:min-w-12 flex items-center justify-center rounded-2xl bg-white shadow-md text-2xl hover:bg-orange-50 active:scale-95 transition-all cursor-pointer border border-orange-200"
            aria-label={language === 'ar' ? 'العودة إلى الورشات' : language === 'fr' ? 'Retour aux ateliers' : 'Back to workshops'}
          >
            {language === 'ar' ? '▶' : '◀'}
          </button>
          <PreschoolMuteButton language={language} className="border-purple-200 text-purple-800 hover:bg-purple-50" />
        </div>

        <h1 className="text-lg sm:text-2xl font-black text-purple-950 text-center flex-1 truncate px-2">
          {labels.title}
        </h1>

        {/* Trilingual Language Quick Switcher */}
        <div className="flex items-center gap-1 bg-white/90 p-1 rounded-2xl shadow-sm border border-purple-200">
          {(['ar', 'fr', 'en'] as PreschoolLanguage[]).map((l) => (
            <button
              key={l}
              onClick={() => {
                if (onSelectLanguage) onSelectLanguage(l);
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                language === l
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-purple-900 hover:bg-purple-100'
              }`}
            >
              <span className="inline-flex items-center gap-1">
                <PreschoolFlagMark asset={PRESCHOOL_LANGUAGE_LABELS[l].flag} size={16} />
                {l.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Instrument Switcher Tabs */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-center gap-1.5 sm:gap-2 mb-3 flex-wrap">
        {INSTRUMENTS.map((inst) => (
          <button
            key={inst.id}
            onClick={() => {
              setInstrument(inst.id as InstrumentType);
              playMusicalNote(440, inst.id as InstrumentType);
              speak(inst.label);
            }}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              instrument === inst.id
                ? 'bg-purple-600 text-white shadow-md scale-105 border-2 border-purple-300 ring-2 ring-purple-400'
                : 'bg-white text-purple-950 hover:bg-purple-50 border border-purple-200'
            }`}
          >
            <span className="text-base sm:text-lg">{inst.icon}</span>
            <span>{inst.label}</span>
          </button>
        ))}
      </div>

      {/* Song Guide Section (Anachid & Melodies) */}
      <div className="max-w-4xl w-full mx-auto mb-3 bg-white/90 backdrop-blur-xs rounded-3xl p-3 sm:p-4 shadow-md border border-purple-100">
        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
          <span className="text-xs sm:text-sm font-black text-purple-950">{labels.songsTitle}</span>
          {activeSong && (
            <button
              onClick={() => {
                setActiveSong(null);
                setSongStepIndex(0);
              }}
              className="text-xs text-rose-600 font-black hover:underline cursor-pointer bg-rose-50 px-2.5 py-1 rounded-xl"
            >
              ❌ {labels.freePlay}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-thin">
          {ALGERIAN_NURSERY_SONGS.map((song) => {
            const isPlaying = activeSong?.id === song.id;
            return (
              <button
                key={song.id}
                onClick={() => {
                  setActiveSong(song);
                  setSongStepIndex(0);
                  speak(
                    language === 'ar'
                      ? `هَيَّا نَعْزِف ${song.titleAr.replace(/[^\p{L}\p{N}\s'’.\-()]/gu, ' ').replace(/\s+/g, ' ').trim()}`
                      : language === 'fr'
                      ? `Jouons ${song.titleFr.replace(/[^\p{L}\p{N}\s'’.\-()]/gu, ' ').replace(/\s+/g, ' ').trim()}`
                      : `Let's play ${song.titleEn.replace(/[^\p{L}\p{N}\s'’.\-()]/gu, ' ').replace(/\s+/g, ' ').trim()}`
                  );
                }}
                className={`px-3 py-2 rounded-2xl text-xs font-black shrink-0 flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
                  isPlaying
                    ? 'bg-amber-400 text-amber-950 border-2 border-amber-500 scale-105 shadow-md ring-2 ring-amber-300'
                    : 'bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200'
                }`}
              >
                <span className="text-lg">{song.icon}</span>
                <span>{language === 'ar' ? song.titleAr : language === 'fr' ? song.titleFr : song.titleEn}</span>
                {isPlaying && (
                  <span className="bg-amber-950/20 px-2 py-0.5 rounded-full text-[10px]">
                    {songStepIndex + 1}/{song.sequence.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {activeSong && (
          <div className="mt-2 text-center text-xs font-bold text-amber-900 bg-amber-50 rounded-xl p-1.5 border border-amber-200 animate-pulse">
            {labels.songGuideHint}
          </div>
        )}
      </div>

      {/* Dynamic Visual Instrument Workspace */}
      <div className="max-w-4xl w-full mx-auto flex-1 flex items-center justify-center py-2 px-1">
        {/* 1. PIANO VIEW */}
        {instrument === 'piano' && (
          <div className="w-full bg-slate-900 p-4 sm:p-6 rounded-[2.5rem] shadow-2xl border-4 border-amber-400/80 relative">
            <div className="text-center mb-3">
              <span className="text-amber-400 font-black tracking-widest text-xs uppercase px-4 py-1 rounded-full bg-amber-950/60 border border-amber-400/40">
                ⭐ {language === 'ar' ? 'بِيَانُو' : language === 'fr' ? 'Grand piano' : 'Grand piano'} ⭐
              </span>
            </div>

            {/* Piano Keys Frame */}
            <div className="relative flex justify-between bg-neutral-900 p-2 rounded-2xl shadow-inner border border-neutral-700">
              {/* White keys */}
              <div className="flex w-full gap-1 sm:gap-2">
                {MUSICAL_KEYS.map((key) => {
                  const isTarget = targetSongKeyId === key.id;
                  const isPressed = activeKeyEffect === key.id;

                  return (
                    <motion.button
                      key={key.id}
                      onClick={() => handleKeyPress(key)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      className={`flex-1 h-56 sm:h-64 rounded-b-2xl bg-gradient-to-b from-white via-neutral-100 to-neutral-200 border-2 border-neutral-300 shadow-md flex flex-col justify-end items-center pb-4 cursor-pointer relative select-none ${
                        isTarget ? 'ring-4 ring-yellow-400 bg-yellow-100 animate-pulse' : ''
                      } ${isPressed ? 'bg-amber-100 translate-y-1 shadow-xs' : ''}`}
                    >
                      {/* Floating Note Particles */}
                      <AnimatePresence>
                        {particles
                          .filter((p) => p.keyId === key.id)
                          .map((p) => (
                            <motion.div
                              key={p.id}
                              initial={{ opacity: 1, y: 0, scale: 0.8 }}
                              animate={{ opacity: 0, y: -70, scale: 1.5 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.7 }}
                              className="absolute top-1/4 pointer-events-none text-2xl font-black"
                            >
                              {p.symbol}
                            </motion.div>
                          ))}
                      </AnimatePresence>

                      {isTarget && <span className="text-xl animate-spin mb-2">⭐</span>}

                      <div className="text-center font-black text-neutral-800">
                        <span className="text-base sm:text-xl block">{noteLabel(key)}</span>
                        {language !== 'en' && (
                          <span className="text-[10px] text-neutral-500 font-bold">{key.noteEn}</span>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Black keys overlay */}
              {PIANO_BLACK_KEYS.map((bk) => {
                const isPressed = activeKeyEffect === bk.id;
                return (
                  <motion.button
                    key={bk.id}
                    onClick={() =>
                      handleKeyPress({
                        id: bk.id,
                        freq: bk.freq,
                        noteAr: bk.noteAr,
                        noteFr: bk.noteFr,
                        noteEn: bk.noteEn,
                      })
                    }
                    whileTap={{ scale: 0.95 }}
                    style={{ left: bk.leftPercent }}
                    className={`absolute top-2 w-9 sm:w-12 h-32 sm:h-38 rounded-b-xl bg-gradient-to-b from-neutral-800 via-neutral-900 to-black border-2 border-neutral-700 shadow-xl z-20 flex flex-col justify-end items-center pb-2 cursor-pointer ${
                      isPressed ? 'bg-amber-900 translate-y-1 ring-2 ring-yellow-400' : ''
                    }`}
                  >
                    <span className="text-[10px] sm:text-xs font-black text-amber-300">
                      {noteLabel(bk)}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. XYLOPHONE VIEW */}
        {instrument === 'xylophone' && (
          <div className="w-full flex items-end justify-center gap-2 sm:gap-3 px-2">
            {MUSICAL_KEYS.map((key) => {
              const isTarget = targetSongKeyId === key.id;
              const isPressed = activeKeyEffect === key.id;

              return (
                <motion.button
                  key={key.id}
                  onClick={() => handleKeyPress(key)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.94 }}
                  className={`relative flex-1 ${key.heightClass} rounded-3xl bg-gradient-to-b ${key.color} shadow-xl border-4 ${
                    isTarget
                      ? 'border-yellow-300 ring-4 ring-yellow-400 animate-bounce'
                      : 'border-white/50'
                  } flex flex-col items-center justify-between py-4 cursor-pointer transition-all select-none ${
                    isPressed ? 'brightness-125 scale-95' : ''
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white/40 shadow-inner border border-white/60" />

                  {/* Floating Particles */}
                  <AnimatePresence>
                    {particles
                      .filter((p) => p.keyId === key.id)
                      .map((p) => (
                        <motion.div
                          key={p.id}
                          initial={{ opacity: 1, y: 0, scale: 0.8 }}
                          animate={{ opacity: 0, y: -80, scale: 1.6 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.8 }}
                          className="absolute top-1/3 pointer-events-none text-2xl font-black"
                        >
                          {p.symbol}
                        </motion.div>
                      ))}
                  </AnimatePresence>

                  {isTarget && <div className="text-2xl animate-spin">⭐</div>}

                  <div className={`flex flex-col items-center gap-0.5 ${key.textColor} font-black`}>
                    <span className="text-lg sm:text-2xl drop-shadow-sm">
                      {noteLabel(key)}
                    </span>
                    {language !== 'en' && (
                      <span className="text-[10px] sm:text-xs opacity-90">{key.noteEn}</span>
                    )}
                  </div>

                  <div className="w-4 h-4 rounded-full bg-white/40 shadow-inner border border-white/60" />
                </motion.button>
              );
            })}
          </div>
        )}

        {/* 3. MARIMBA VIEW */}
        {instrument === 'marimba' && (
          <div className="w-full bg-amber-950/30 p-4 sm:p-6 rounded-[2.5rem] border-4 border-amber-800 shadow-xl">
            <div className="flex items-end justify-center gap-2 sm:gap-3">
              {MUSICAL_KEYS.map((key) => {
                const isTarget = targetSongKeyId === key.id;
                const isPressed = activeKeyEffect === key.id;

                return (
                  <motion.button
                    key={key.id}
                    onClick={() => handleKeyPress(key)}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.94 }}
                    className={`relative flex-1 ${key.heightClass} rounded-2xl shadow-xl border-3 ${
                      isTarget
                        ? 'border-yellow-300 ring-4 ring-yellow-400 animate-bounce'
                        : 'border-amber-600'
                    } flex flex-col items-center justify-between py-4 cursor-pointer text-amber-100 select-none ${
                      isPressed ? 'brightness-150' : ''
                    }`}
                    style={{ backgroundImage: 'linear-gradient(to bottom, #b45309, #92400e, #451a03)' }}
                  >
                    <div className="w-3 h-3 rounded-full bg-amber-900 border border-amber-600" />
                    {isTarget && <div className="text-xl animate-spin">⭐</div>}
                    <div className="text-center font-black">
                      <span className="text-base sm:text-xl block">
                        {noteLabel(key)}
                      </span>
                      <span className="text-[10px] text-amber-300">{key.noteEn}</span>
                    </div>
                    <div className="w-3 h-3 rounded-full bg-amber-900 border border-amber-600" />
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. FLUTE / GASBA VIEW */}
        {instrument === 'flute' && (
          <div className="w-full max-w-2xl bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 p-6 sm:p-8 rounded-[3rem] shadow-2xl border-4 border-amber-600 flex flex-col items-center gap-6">
            <div className="text-center">
              <h2 className="text-base sm:text-lg font-black text-amber-950">
                {language === 'ar' ? '🪈 القَصَبَة وَالنَّاي' : language === 'fr' ? '🪈 Gasba et nay' : '🪈 Gasba and nay'}
              </h2>
              <p className="text-xs text-amber-900/80">
                {language === 'ar' ? 'اِنْقُرْ عَلَى فَتَحَاتِ القَصَبَة لِعَزْفِ الأَنْغَام' : language === 'fr' ? 'Touche les trous de la flûte pour jouer' : 'Tap the holes of the flute to play'}
              </p>
            </div>

            {/* Bamboo Flute Body with 8 Holes */}
            <div className="w-full flex items-center justify-between bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 p-4 sm:p-5 rounded-full shadow-inner border-2 border-amber-950 gap-2 overflow-x-auto">
              <div className="w-8 h-8 rounded-full bg-amber-950 border-2 border-amber-600 shrink-0" />
              {MUSICAL_KEYS.map((key) => {
                const isTarget = targetSongKeyId === key.id;
                const isPressed = activeKeyEffect === key.id;

                return (
                  <motion.button
                    key={key.id}
                    onClick={() => handleKeyPress(key)}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-11 h-11 sm:w-14 sm:h-14 rounded-full flex flex-col items-center justify-center font-black cursor-pointer transition-all shadow-md ${
                      isTarget
                        ? 'bg-yellow-400 text-yellow-950 ring-4 ring-yellow-300 animate-bounce'
                        : isPressed
                        ? 'bg-amber-300 text-amber-950 scale-110'
                        : 'bg-amber-950 text-amber-200 border-2 border-amber-700 hover:bg-amber-900'
                    }`}
                  >
                    <span className="text-xs sm:text-sm">{noteLabel(key)}</span>
                  </motion.button>
                );
              })}
              <div className="w-6 h-6 rounded-full bg-amber-950 border border-amber-600 shrink-0" />
            </div>
          </div>
        )}

        {/* 5. MANDOLE / OUD VIEW */}
        {instrument === 'mandole' && (
          <div
            className="w-full max-w-2xl p-6 rounded-[2.5rem] shadow-2xl border-4 border-amber-600 text-white flex flex-col items-center gap-4"
            style={{ backgroundImage: 'linear-gradient(to bottom, #92400e, #451a03)' }}
          >
            <div className="text-center">
              <h2 className="text-base sm:text-lg font-black text-amber-200">
                {language === 'ar' ? '🪕 المَنْدُول وَالعُود' : language === 'fr' ? '🪕 Mandole et oud' : '🪕 Mandole and oud'}
              </h2>
              <p className="text-xs text-amber-300/80">
                {language === 'ar' ? 'اِعْزِفْ عَلَى أَوْتَارِ المَنْدُول' : language === 'fr' ? 'Pince les cordes pour faire résonner la mélodie' : 'Pluck the strings to play the melody'}
              </p>
            </div>

            {/* Fretboard & Strings */}
            <div className="w-full flex justify-between gap-2 bg-amber-950/80 p-4 rounded-2xl border border-amber-700">
              {MUSICAL_KEYS.map((key) => {
                const isTarget = targetSongKeyId === key.id;
                const isPressed = activeKeyEffect === key.id;

                return (
                  <motion.button
                    key={key.id}
                    onClick={() => handleKeyPress(key)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-1 h-48 sm:h-56 rounded-xl bg-amber-900/60 border border-amber-700/60 flex flex-col items-center justify-between py-3 cursor-pointer relative ${
                      isTarget ? 'ring-4 ring-yellow-400 bg-amber-800' : ''
                    } ${isPressed ? 'bg-amber-700' : ''}`}
                  >
                    {/* Metal fret line */}
                    <div className="w-full h-1 bg-amber-400/40 rounded-full" />

                    {/* Vertical vibrating String */}
                    <div
                      className={`w-1 h-3/4 rounded-full transition-all ${
                        isPressed
                          ? 'bg-yellow-300 shadow-[0_0_10px_#fde047] scale-x-150 animate-pulse'
                          : 'bg-amber-200/80 shadow-sm'
                      }`}
                    />

                    {isTarget && <span className="text-base animate-spin">⭐</span>}

                    <span className="text-xs font-black text-amber-200">
                      {noteLabel(key)}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* 6. PERCUSSION & DARBOUKA VIEW */}
        {instrument === 'darbuka' && (
          <div className="w-full max-w-3xl grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {PERCUSSION_PADS.map((pad) => {
              const isPressed = activeKeyEffect === pad.id;

              return (
                <motion.button
                  key={pad.id}
                  onClick={() => handlePercussionPress(pad)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  className={`min-h-48 rounded-3xl bg-gradient-to-b ${pad.color} p-4 text-white shadow-xl border-4 border-white/60 flex flex-col items-center justify-between text-center cursor-pointer transition-all ${
                    isPressed ? 'ring-4 ring-yellow-400 scale-105 brightness-125' : ''
                  }`}
                >
                  <span className="text-5xl sm:text-6xl drop-shadow-md">{pad.icon}</span>
                  <div className="space-y-1">
                    <p className="text-base sm:text-lg font-black drop-shadow-sm">
                      {language === 'ar' ? pad.nameAr : language === 'fr' ? pad.nameFr : pad.nameEn}
                    </p>
                    <p className="text-[11px] text-white/80 font-medium">
                      {language === 'ar' ? pad.descAr : language === 'fr' ? pad.descFr : pad.descEn}
                    </p>
                  </div>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-black">
                    🔊 {language === 'ar' ? 'إِيقَاع' : language === 'fr' ? 'Rythme' : 'Beat'}
                  </span>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Instructions */}
      <p className="text-center text-xs font-bold text-purple-900/80 mt-2">
        {labels.tapHint}
      </p>
    </div>
  );
};
