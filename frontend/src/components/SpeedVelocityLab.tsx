/**
 * SpeedVelocityLab.tsx — مختبر السرعة والحركة «في المدينة» (2D / 3D)
 * Conçu pour les élèves de 1AP à 5AP avec adaptation pédagogique par niveau :
 * - 1AP / 2AP : Éveil intuitif, "Plus rapide / Plus lent", sécurité routière en ville, course 2D/3D visuelle.
 * - 3AP : Mesure des vitesses en km/h, ordre de grandeur des véhicules, chronométrage.
 * - 4AP / 5AP : Formules officielles (v = d/t, d = v × t, t = d/v), trajets réels entre villes d'Algérie, radar de vitesse et défis calculatoires.
 */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PrimaryGrade } from '../types';
import { Vehicle3DModel } from './Vehicle3DModel';

export interface SpeedVelocityLabProps {
  grade: PrimaryGrade;
  onBack?: () => void;
  onReward?: (coins: number, xp: number) => void;
}

export type LabTab = 'race' | 'comparator' | 'calculator' | 'algeria_trips' | 'quiz';
export type ViewPerspective = '2d' | '3d';

export interface Vehicle {
  id: string;
  nameAr: string;
  nameFr: string;
  nameEn: string;
  emoji: string;
  speedKmh: number;
  color: string;
  pitch: number;
  category: 'slow' | 'medium' | 'fast' | 'ultra';
  factAr: string;
  factFr: string;
}

export const CITY_VEHICLES: Vehicle[] = [
  {
    id: 'pedestrian',
    nameAr: 'المَاشِي (طِفْلٌ)',
    nameFr: 'Piéton / Enfant',
    nameEn: 'Pedestrian / Child',
    emoji: '🚶',
    speedKmh: 5,
    color: '#10b981',
    pitch: 220,
    category: 'slow',
    factAr: 'سرعة المشي الهادئ 5 كم/سا. يعبر الطفل ممر الراجلين بأمان.',
    factFr: 'La marche à pied est d’environ 5 km/h. Idéal pour la santé et sécurisé sur les passages piétons.',
  },
  {
    id: 'scooter',
    nameAr: 'السْكُوتَر (الدَّرَّاجَةُ الصَّغِيرَة)',
    nameFr: 'Trottinette',
    nameEn: 'Scooter',
    emoji: '🛴',
    speedKmh: 15,
    color: '#06b6d4',
    pitch: 320,
    category: 'slow',
    factAr: 'السكوتر يسير بـ 15 كم/سا، أي أسرع بثلاث مرات من المشي.',
    factFr: 'La trottinette roule à 15 km/h, soit 3 fois plus vite que la marche !',
  },
  {
    id: 'bike',
    nameAr: 'الدَّرَّاجَةُ الهَوَائِيَّة',
    nameFr: 'Vélo de Ville',
    nameEn: 'Bicycle',
    emoji: '🚲',
    speedKmh: 20,
    color: '#3b82f6',
    pitch: 420,
    category: 'medium',
    factAr: 'الدراجة وسيلة بيئية ممتازة في المدينة، سرعتها المتوسطة 20 كم/سا.',
    factFr: 'Le vélo est écologique et propre, vitesse moyenne : 20 km/h.',
  },
  {
    id: 'city_bus',
    nameAr: 'حَافِلَةُ النَّقْلِ المَدْرَسِي',
    nameFr: 'Bus Scolaire',
    nameEn: 'School Bus',
    emoji: '🚌',
    speedKmh: 40,
    color: '#f59e0b',
    pitch: 360,
    category: 'medium',
    factAr: 'تنقل الحافلة عشرات التلاميذ بذكاء وسلامة وتحد من زحام المدينة.',
    factFr: 'Le bus transporte tous les élèves ensemble et réduit les embouteillages.',
  },
  {
    id: 'taxi',
    nameAr: 'سَيَّارَةُ التَّاكْسِي الحَضَرِيَّة',
    nameFr: 'Taxi Urbain',
    nameEn: 'City Taxi',
    emoji: '🚕',
    speedKmh: 50,
    color: '#eab308',
    pitch: 500,
    category: 'medium',
    factAr: 'السرعة القانونية القصوى داخل شوارع المدينة هي 50 كم/سا لحماية الأطفال والمشاة.',
    factFr: 'La vitesse maximale autorisée en ville est de 50 km/h pour la sécurité de tous.',
  },
  {
    id: 'motorbike',
    nameAr: 'الدَّرَّاجَةُ النَّارِيَّة',
    nameFr: 'Moto Express',
    nameEn: 'Motorbike',
    emoji: '🏍️',
    speedKmh: 75,
    color: '#ec4899',
    pitch: 660,
    category: 'fast',
    factAr: 'الدراجة النارية سريعة وتتطلب دائماً ارتداء خوذة الأمان.',
    factFr: 'La moto est rapide et exige impérativement le port du casque.',
  },
  {
    id: 'sport_car',
    nameAr: 'السَّيَّارَةُ الرِّيَاضِيَّة الخَارِقَة',
    nameFr: 'Voiture de Course 3D',
    nameEn: 'Super Car',
    emoji: '🏎️',
    speedKmh: 120,
    color: '#ef4444',
    pitch: 820,
    category: 'fast',
    factAr: 'سيارة السباق تسير في الطرق السريعة المخصصة وتصل لـ 120 كم/سا.',
    factFr: 'Sur autoroute dégagée, la vitesse est limitée à 120 km/h.',
  },
  {
    id: 'coradia_train',
    nameAr: 'قِطَارُ كُورَادْيَا السَّرِيع (SNTF)',
    nameFr: 'Train Coradia / TGV',
    nameEn: 'Express Train',
    emoji: '🚄',
    speedKmh: 160,
    color: '#8b5cf6',
    pitch: 920,
    category: 'ultra',
    factAr: 'قطار كوراديا الجزائري الحديث يسير على السكك الحديدية بدون إشارات حمراء تعيقه.',
    factFr: 'Le train Coradia relie les villes d’Algérie à grande vitesse sur ses rails dédiés.',
  },
  {
    id: 'airplane',
    nameAr: 'طَائِرَةُ الخُطُوطِ الجَوِّيَّة (Air Algérie)',
    nameFr: 'Avion de Ligne',
    nameEn: 'Airplane',
    emoji: '✈️',
    speedKmh: 800,
    color: '#6366f1',
    pitch: 1100,
    category: 'ultra',
    factAr: 'تطير الطائرة في السماء بسرعة 800 كم/سا، وتعبر الجزائر من الشمال إلى الجنوب في ساعتين!',
    factFr: 'L’avion vole à 800 km/h et traverse l’Algérie du Nord au Grand Sud en 2 heures !',
  },
];

// Algerian Real-Life Intercity Trips for 4AP / 5AP
export interface AlgerianTrip {
  id: string;
  fromAr: string;
  toAr: string;
  fromFr: string;
  toFr: string;
  distanceKm: number;
  recommendedSpeedKmh: number;
  recommendedVehicleId: string;
  descAr: string;
  descFr: string;
}

export const ALGERIAN_TRIPS: AlgerianTrip[] = [
  {
    id: 'alg_blida',
    fromAr: 'الجزائر العاصمة',
    toAr: 'البليدة (مدينة الورود)',
    fromFr: 'Alger',
    toFr: 'Blida',
    distanceKm: 50,
    recommendedSpeedKmh: 50,
    recommendedVehicleId: 'city_bus',
    descAr: 'رحلة يومية عبر الطريق السريع، يستغرق الباص حوالي ساعة واحدة.',
    descFr: 'Trajet quotidien de 50 km, environ 1 heure en bus ou taxi.',
  },
  {
    id: 'alg_oran',
    fromAr: 'الجزائر العاصمة',
    toAr: 'وهران (الباهية)',
    fromFr: 'Alger',
    toFr: 'Oran',
    distanceKm: 400,
    recommendedSpeedKmh: 100,
    recommendedVehicleId: 'coradia_train',
    descAr: 'مسافة 400 كم عبر قطار كوراديا أو السيارة السريعة (حوالي 4 ساعات).',
    descFr: '400 km via l’autoroute Est-Ouest ou train Coradia (environ 4 heures).',
  },
  {
    id: 'alg_const',
    fromAr: 'الجزائر العاصمة',
    toAr: 'قسنطينة (مدينة الجسور)',
    fromFr: 'Alger',
    toFr: 'Constantine',
    distanceKm: 390,
    recommendedSpeedKmh: 100,
    recommendedVehicleId: 'sport_car',
    descAr: 'مسافة 390 كم عبر الطريق السيار شرق-غرب وجسور قسنطينة المعلقة.',
    descFr: '390 km reliant la capitale à la cité des ponts suspendus.',
  },
  {
    id: 'alg_ouargla',
    fromAr: 'الجزائر العاصمة',
    toAr: 'ورقلة (عاصمة الواحات)',
    fromFr: 'Alger',
    toFr: 'Ouargla',
    distanceKm: 800,
    recommendedSpeedKmh: 800,
    recommendedVehicleId: 'airplane',
    descAr: 'مسافة 800 كم نحو الصحراء، تستغرق الطائرة ساعة واحدة والسيارة 10 ساعات!',
    descFr: '800 km vers le Sud : 1h en avion contre 10h en voiture !',
  },
];

export const SpeedVelocityLab: React.FC<SpeedVelocityLabProps> = ({
  grade,
  onBack,
  onReward,
}) => {
  const isEarlyGrade = grade === '1AP' || grade === '2AP';
  const isMiddleGrade = grade === '3AP';
  const isUpperGrade = grade === '4AP' || grade === '5AP';

  const [activeTab, setActiveTab] = useState<LabTab>('race');
  const [viewPerspective, setViewPerspective] = useState<ViewPerspective>('3d');
  const [language, setLanguage] = useState<'ar' | 'fr'>('ar');

  // Race Simulation State
  const [vehicleAId, setVehicleAId] = useState<string>(isEarlyGrade ? 'bike' : 'city_bus');
  const [vehicleBId, setVehicleBId] = useState<string>(isEarlyGrade ? 'scooter' : 'taxi');
  const [distanceMeters, setDistanceMeters] = useState<number>(isEarlyGrade ? 200 : 500);
  const [raceState, setRaceState] = useState<'idle' | 'countdown' | 'racing' | 'finished'>('idle');
  const [countdown, setCountdown] = useState<number>(3);
  const [progressA, setProgressA] = useState<number>(0);
  const [progressB, setProgressB] = useState<number>(0);
  const [raceTimeElapsed, setRaceTimeElapsed] = useState<number>(0);
  const [winner, setWinner] = useState<'A' | 'B' | 'TIE' | null>(null);
  const [trafficLight, setTrafficLight] = useState<'red' | 'yellow' | 'green'>('red');
  const [weather, setWeather] = useState<'sunny' | 'rain' | 'night'>('sunny');
  const [speedRadarFlashed, setSpeedRadarFlashed] = useState<boolean>(false);
  const [turboA, setTurboA] = useState<boolean>(false);
  const [turboB, setTurboB] = useState<boolean>(false);

  // Sorting Mini-Game for 1AP / 2AP
  const [sortList, setSortList] = useState<string[]>(['airplane', 'pedestrian', 'bike', 'taxi']);
  const [sortSolved, setSortSolved] = useState<boolean>(false);

  // Formula Lab for 4AP / 5AP
  const [targetVariable, setTargetVariable] = useState<'v' | 'd' | 't'>('v');
  const [inputDistanceKm, setInputDistanceKm] = useState<number>(120);
  const [inputTimeHours, setInputTimeHours] = useState<number>(2);
  const [inputSpeedKmh, setInputSpeedKmh] = useState<number>(60);

  // Algerian Intercity Planner for 4AP / 5AP
  const [selectedTripId, setSelectedTripId] = useState<string>('alg_oran');
  const [tripVehicleId, setTripVehicleId] = useState<string>('coradia_train');
  const [departureHour, setDepartureHour] = useState<number>(8); // 08:00

  // Quiz / Challenges State
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | null>(null);

  // WebAudio Synthesizer
  const audioCtxRef = useRef<AudioContext | null>(null);
  const fanfareTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Release the audio hardware/resources on unmount — an AudioContext left open keeps running
  // (and, on some browsers, counts against a limited number of concurrent contexts) even after
  // the component navigating away from this lab has unmounted. Also cancel any still-pending
  // success-fanfare notes so they don't fire against a closed/stale AudioContext.
  useEffect(() => {
    return () => {
      fanfareTimeoutsRef.current.forEach((id) => clearTimeout(id));
      fanfareTimeoutsRef.current = [];
      audioCtxRef.current?.close().catch(() => {});
    };
  }, []);

  const t = (ar: string, fr: string) => (language === 'ar' ? ar : fr);

  const vehicleA = useMemo(() => CITY_VEHICLES.find((v) => v.id === vehicleAId) || CITY_VEHICLES[2], [vehicleAId]);
  const vehicleB = useMemo(() => CITY_VEHICLES.find((v) => v.id === vehicleBId) || CITY_VEHICLES[4], [vehicleBId]);

  const weatherFactor = weather === 'rain' ? 0.8 : 1.0;
  const realSpeedA = vehicleA.speedKmh * (turboA ? 1.5 : 1.0) * weatherFactor;
  const realSpeedB = vehicleB.speedKmh * (turboB ? 1.5 : 1.0) * weatherFactor;

  const timeA = distanceMeters / (realSpeedA / 3.6);
  const timeB = distanceMeters / (realSpeedB / 3.6);

  const playTone = (freq: number, type: OscillatorType = 'sine', duration: number = 0.15) => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio context silently ignored if unavailable
    }
  };

  const playEngineHum = (speed: number) => {
    playTone(180 + Math.min(speed * 3, 800), 'triangle', 0.08);
  };

  const playSuccessFanfare = () => {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, idx) => {
      const id = setTimeout(() => playTone(f, 'sine', 0.25), idx * 120);
      fanfareTimeoutsRef.current.push(id);
    });
  };

  // Trigger Race
  const startRace = () => {
    setProgressA(0);
    setProgressB(0);
    setRaceTimeElapsed(0);
    setWinner(null);
    setSpeedRadarFlashed(false);
    setTrafficLight('red');
    setRaceState('countdown');
    setCountdown(3);
    playTone(350, 'square', 0.2);
  };

  useEffect(() => {
    if (raceState !== 'countdown') return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((c) => c - 1);
        if (countdown === 2) {
          setTrafficLight('yellow');
          playTone(450, 'square', 0.2);
        } else if (countdown === 1) {
          setTrafficLight('green');
          playTone(850, 'triangle', 0.4);
        }
      }, 850);
      return () => clearTimeout(timer);
    } else {
      setRaceState('racing');
    }
  }, [raceState, countdown]);

  useEffect(() => {
    if (raceState !== 'racing') return;

    const intervalMs = 40;
    const dt = intervalMs / 1000;

    const timer = setInterval(() => {
      setRaceTimeElapsed((prev) => {
        const nextTime = prev + dt;
        const distA = (realSpeedA / 3.6) * nextTime;
        const distB = (realSpeedB / 3.6) * nextTime;

        const pA = Math.min(1, distA / distanceMeters);
        const pB = Math.min(1, distB / distanceMeters);

        setProgressA(pA);
        setProgressB(pB);

        // Flash city radar if speed > 50 km/h near mid-track
        if ((realSpeedA > 50 || realSpeedB > 50) && (pA > 0.45 && pA < 0.55 || pB > 0.45 && pB < 0.55)) {
          setSpeedRadarFlashed(true);
        }

        if (Math.random() < 0.25) {
          playEngineHum(Math.max(realSpeedA, realSpeedB));
        }

        if (pA >= 1 || pB >= 1) {
          clearInterval(timer);
          setRaceState('finished');
          if (pA >= 1 && pB >= 1) {
            setWinner('TIE');
          } else if (pA >= 1) {
            setWinner('A');
          } else {
            setWinner('B');
          }
          playSuccessFanfare();
          if (onReward) onReward(5, 10);
        }
        return nextTime;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [raceState, realSpeedA, realSpeedB, distanceMeters, onReward]);

  // Quiz Questions tailored per grade
  const QUIZ_LIST = useMemo(() => {
    if (isEarlyGrade) {
      return [
        {
          questionAr: 'مَن هُوَ الأَسْرَعُ فِي المَدِينَةِ لِقَطْعِ الطَّرِيقِ؟',
          questionFr: 'Qui est le plus rapide en ville ?',
          options: ['🚶 المَاشِي (5 كم/سا)', '🚲 الدَّرَّاجَة (20 كم/سا)', '🛴 السْكُوتَر (15 كم/سا)'],
          correctIndex: 1,
          explanationAr: 'الدراجة (20 كم/سا) أسرع من المشي والسكوتر وتصل أولاً!',
          explanationFr: 'Le vélo (20 km/h) est le plus rapide parmi les trois !',
        },
        {
          questionAr: 'مَاذَا يَجِبُ أَنْ نَفْعَلَ عِنْدَمَا يَكُونُ الضَّوْءُ أَحْمَر 🔴 لِلسَّيَّارَاتِ؟',
          questionFr: 'Que faire quand le feu est rouge 🔴 pour les voitures ?',
          options: ['نَعْبُرُ بِأَمَانٍ عَلَى مَمَرِّ الرَّاجِلِينَ', 'نَجْرِي بِسُرْعَةٍ جِدّاً', 'نَقِفُ فِي وَسَطِ الشَّارِع'],
          correctIndex: 0,
          explanationAr: 'عندما تتوقف السيارات في الضوء الأحمر، يعبر الأطفال بهدوء وأمان!',
          explanationFr: 'Les piétons peuvent traverser en toute sécurité sur les clous !',
        },
      ];
    } else if (isMiddleGrade) {
      return [
        {
          questionAr: 'سَيَّارَةٌ تَسِيرُ بِسُرْعَةِ 60 كم/سا، كَمْ كِيلُومِتْراً تَقْطَعُ خِلَالَ سَاعَتَيْنِ (2h)؟',
          questionFr: 'Une voiture roule à 60 km/h. Quelle distance parcourt-elle en 2h ?',
          options: ['30 km', '60 km', '120 km', '180 km'],
          correctIndex: 2,
          explanationAr: 'المسافة = السرعة × الزمن (60 × 2 = 120 كم).',
          explanationFr: 'Distance = Vitesse × Temps (60 × 2 = 120 km).',
        },
        {
          questionAr: 'مَا هِيَ السُّرْعَةُ القَانُونِيَّةُ لِلسَّيَّارَاتِ دَاخِلَ الشَّوَارِعِ الحَضَرِيَّةِ؟',
          questionFr: 'Quelle est la vitesse limite en ville ?',
          options: ['50 km/h', '120 km/h', '200 km/h'],
          correctIndex: 0,
          explanationAr: '50 كم/سا هي السرعة الآمنة المحددة في المدينة لحماية المشاة.',
          explanationFr: '50 km/h est la limitation légale en agglomération.',
        },
      ];
    } else {
      return [
        {
          questionAr: 'قَانُونُ حِسَابِ السُّرْعَةِ المُتَوَسِّطَةِ (v) هُوَ:',
          questionFr: 'La formule de la vitesse moyenne (v) est :',
          options: ['v = d / t (المسافة ÷ الزمن)', 'v = d × t', 'v = t / d', 'v = d + t'],
          correctIndex: 0,
          explanationAr: 'السرعة = المسافة المقطوعة مقسومة على الزمن المستغرق (v = d / t).',
          explanationFr: 'Vitesse = Distance divisée par le Temps (v = d / t).',
        },
        {
          questionAr: 'قَطَعَ قِطَارُ كُورَادْيَا مَسَافَةَ 400 كم بَيْنَ الجَزَائِرِ وَوَهْرَانَ فِي 4 سَاعَاتٍ. مَا هِيَ سُرْعَتُهُ المُتَوَسِّطَةُ؟',
          questionFr: 'Un train fait 400 km entre Alger et Oran en 4h. Quelle est sa vitesse moyenne ?',
          options: ['80 km/h', '100 km/h', '120 km/h', '160 km/h'],
          correctIndex: 1,
          explanationAr: 'v = 400 km ÷ 4 h = 100 كم/سا بالضبط!',
          explanationFr: 'v = 400 ÷ 4 = 100 km/h !',
        },
        {
          questionAr: 'لِتَحْوِيلِ السُّرْعَةِ مِنْ (كم/سا) إِلَى (م/ث m/s)، نَقُومُ بـ:',
          questionFr: 'Pour convertir des km/h en m/s, on :',
          options: ['القِسْمَة عَلَى 3.6', 'الضَّرْب فِي 3.6', 'القِسْمَة عَلَى 100', 'الضَّرْب فِي 60'],
          correctIndex: 0,
          explanationAr: 'لأن 1 كم = 1000 م، و 1 ساعة = 3600 ثا (1000/3600 = 1/3.6).',
          explanationFr: 'On divise par 3.6 car 1 km = 1000 m et 1 h = 3600 s.',
        },
      ];
    }
  }, [isEarlyGrade, isMiddleGrade]);

  const currentQuiz = QUIZ_LIST[quizIndex % QUIZ_LIST.length];

  const handleAnswer = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    if (idx === currentQuiz.correctIndex) {
      setQuizFeedback('correct');
      setQuizScore((s) => s + 10);
      playTone(880, 'sine', 0.25);
      if (onReward) onReward(5, 15);
    } else {
      setQuizFeedback('wrong');
      playTone(240, 'sawtooth', 0.3);
    }
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setQuizFeedback(null);
    setQuizIndex((i) => (i + 1) % QUIZ_LIST.length);
  };

  // Sorting game validation for 1AP/2AP
  const handleSwapSort = (idx1: number, idx2: number) => {
    const next = [...sortList];
    const temp = next[idx1];
    next[idx1] = next[idx2];
    next[idx2] = temp;
    setSortList(next);
    playTone(400 + idx1 * 50);

    // Check if sorted from slowest to fastest (pedestrian < bike < taxi < airplane)
    const speeds = next.map((id) => CITY_VEHICLES.find((v) => v.id === id)?.speedKmh || 0);
    const isSorted = speeds.every((val, i, arr) => !i || arr[i - 1] <= val);
    if (isSorted) {
      setSortSolved(true);
      playSuccessFanfare();
      if (onReward) onReward(10, 20);
    }
  };

  const selectedTrip = useMemo(
    () => ALGERIAN_TRIPS.find((t) => t.id === selectedTripId) || ALGERIAN_TRIPS[1],
    [selectedTripId]
  );
  const tripVehicle = useMemo(
    () => CITY_VEHICLES.find((v) => v.id === tripVehicleId) || CITY_VEHICLES[7],
    [tripVehicleId]
  );

  const calculatedTripDurationHours = selectedTrip.distanceKm / tripVehicle.speedKmh;
  const tripHours = Math.floor(calculatedTripDurationHours);
  const tripMinutes = Math.round((calculatedTripDurationHours - tripHours) * 60);
  const arrivalHour = (departureHour + tripHours + Math.floor(tripMinutes / 60)) % 24;
  const arrivalMinute = tripMinutes % 60;

  return (
    <div
      data-lab-instrument
      className="w-full bg-slate-950 text-slate-100 rounded-3xl p-4 sm:p-6 font-sans shadow-2xl border border-slate-800 flex flex-col items-center select-none"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* ── HEADER ── */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-6 bg-slate-900/90 border border-slate-800 p-4 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              aria-label={t('العودة للدروس والمختبرات', 'Retour')}
              className="w-11 h-11 flex items-center justify-center rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-lg border border-slate-700 active:scale-95 transition-all"
            >
              ⬅️
            </button>
          )}
          <div className="flex items-center gap-2">
            <span className="text-3xl sm:text-4xl animate-bounce">⚡</span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-black bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent">
                  {t('مُخْتَبَرُ السُّرْعَة وَالحَرَكَة: «فِي المَدِينَة» 🏙️', 'Labo de Vitesse & Mouvement : « En Ville » 🏙️')}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {grade}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                {isEarlyGrade
                  ? t('اكتشف أسرع وأبطأ وسائل النقل مع قواعد السلامة والسباقات الممتعة!', 'Découvre les allures des véhicules et la sécurité routière en ville !')
                  : t('محاكاة تفاعلية 2D/3D، حساب v = d/t، ومقارنة السرعات بين مدن الجزائر.', 'Simulation 2D/3D, calcul de vitesse v = d/t et trajets d’Algérie.')}
              </p>
            </div>
          </div>
        </div>

        {/* CONTROLS (2D/3D, Weather, Language) */}
        <div className="flex items-center gap-2">
          {/* 2D vs 3D */}
          <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => { setViewPerspective('2d'); playTone(450); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                viewPerspective === '2d' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              📐 2D
            </button>
            <button
              onClick={() => { setViewPerspective('3d'); playTone(600); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                viewPerspective === '3d' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🧊 3D
            </button>
          </div>

          {/* Weather */}
          <button
            onClick={() => {
              const next = weather === 'sunny' ? 'rain' : weather === 'rain' ? 'night' : 'sunny';
              setWeather(next);
              playTone(500);
            }}
            title={t('تغيير الطقس', 'Météo')}
            className="p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-base"
          >
            {weather === 'sunny' ? '☀️' : weather === 'rain' ? '🌧️' : '🌙'}
          </button>

          {/* Language Switch */}
          <button
            onClick={() => setLanguage(language === 'ar' ? 'fr' : 'ar')}
            className="px-3 py-1.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-300"
          >
            {language === 'ar' ? '🇫🇷 Français' : '🇩🇿 العربية'}
          </button>
        </div>
      </div>

      {/* ── TABS NAVIGATION ── */}
      <div className="w-full flex items-center justify-center gap-2 sm:gap-3 mb-6 overflow-x-auto pb-1">
        <button
          onClick={() => { setActiveTab('race'); playTone(500); }}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all border ${
            activeTab === 'race'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-300 shadow-lg shadow-amber-500/20 scale-105'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
          }`}
        >
          <span>🏁</span>
          <span>{t('سِبَاقُ المَدِينَة 2D/3D', 'Course Urbaine 2D/3D')}</span>
        </button>

        <button
          onClick={() => { setActiveTab('comparator'); playTone(520); }}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all border ${
            activeTab === 'comparator'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-300 shadow-lg shadow-amber-500/20 scale-105'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
          }`}
        >
          <span>📊</span>
          <span>{isEarlyGrade ? t('مَنْ الأَسْرَعُ؟', 'Qui est le plus rapide ?') : t('مُقَارَنَةُ السُّرُعَات (كم/سا)', 'Comparateur km/h')}</span>
        </button>

        {isUpperGrade && (
          <button
            onClick={() => { setActiveTab('calculator'); playTone(540); }}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all border ${
              activeTab === 'calculator'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-300 shadow-lg shadow-amber-500/20 scale-105'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
          >
            <span>🧪</span>
            <span>{t('قَانُونُ السُّرْعَة (v = d/t)', 'Formule v = d / t')}</span>
          </button>
        )}

        {isUpperGrade && (
          <button
            onClick={() => { setActiveTab('algeria_trips'); playTone(560); }}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all border ${
              activeTab === 'algeria_trips'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-300 shadow-lg shadow-amber-500/20 scale-105'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
          >
            <span>🇩🇿</span>
            <span>{t('رِحْلَاتُ مُدُنِ الجَزَائِر', 'Trajets Villes d’Algérie')}</span>
          </button>
        )}

        <button
          onClick={() => { setActiveTab('quiz'); playTone(580); }}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all border ${
            activeTab === 'quiz'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-300 shadow-lg shadow-amber-500/20 scale-105'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
          }`}
        >
          <span>🎯</span>
          <span>{t('تَحَدِّي السُّرْعَة وَالأَوْسِمَة', 'Quiz & Défis')}</span>
        </button>
      </div>

      {/* ── TAB 1 : RACE ARENA ── */}
      {activeTab === 'race' && (
        <div className="w-full flex flex-col gap-4">
          {/* VEHICLE CONFIGURATION */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-3xl shadow-xl">
            {/* Lane A */}
            <div className="flex flex-col gap-2 p-3 rounded-2xl bg-slate-950/60 border border-indigo-900/50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-indigo-400">🔵 {t('المَسَارُ (A)', 'Piste A')}</span>
                <button
                  onClick={() => setTurboA(!turboA)}
                  disabled={raceState === 'racing' || raceState === 'countdown'}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                    turboA ? 'bg-cyan-500 text-slate-950 border-cyan-300 animate-pulse' : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  🚀 {t('تُورْبُو', 'Turbo')} {turboA ? 'ON' : 'OFF'}
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-4xl p-2 rounded-2xl bg-indigo-950/80 border border-indigo-700/50">
                  {vehicleA.emoji}
                </span>
                <div className="flex-1">
                  <select
                    value={vehicleAId}
                    onChange={(e) => setVehicleAId(e.target.value)}
                    disabled={raceState === 'racing' || raceState === 'countdown'}
                    className="w-full appearance-none bg-slate-900 text-white font-bold text-sm rounded-xl px-3 py-2 border border-indigo-500/40 focus:outline-none"
                  >
                    {CITY_VEHICLES.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.emoji} {t(v.nameAr, v.nameFr)} ({v.speedKmh} km/h)
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center justify-between text-xs text-indigo-300 font-bold mt-1">
                    <span>{t('السرعة:', 'Vitesse :')} {realSpeedA.toFixed(0)} km/h</span>
                    <span>{(realSpeedA / 3.6).toFixed(1)} m/s</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Controls (Lights, Distance, Start) */}
            <div className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-3">
                {/* Traffic Light */}
                <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-700">
                  <div className={`w-3.5 h-3.5 rounded-full ${trafficLight === 'red' ? 'bg-red-500 shadow-lg shadow-red-500' : 'bg-red-950'}`} />
                  <div className={`w-3.5 h-3.5 rounded-full ${trafficLight === 'yellow' ? 'bg-yellow-400 shadow-lg shadow-yellow-400' : 'bg-yellow-950'}`} />
                  <div className={`w-3.5 h-3.5 rounded-full ${trafficLight === 'green' ? 'bg-emerald-400 shadow-lg shadow-emerald-400' : 'bg-emerald-950'}`} />
                </div>

                {/* Distance Selector */}
                <div className="flex items-center gap-1 text-xs font-bold bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
                  <span>📏</span>
                  <select
                    value={distanceMeters}
                    onChange={(e) => setDistanceMeters(Number(e.target.value))}
                    disabled={raceState === 'racing' || raceState === 'countdown'}
                    className="appearance-none bg-transparent text-amber-300 font-black focus:outline-none"
                  >
                    <option value={100}>100 m</option>
                    <option value={200}>200 m</option>
                    <option value={300}>300 m</option>
                    <option value={500}>500 m</option>
                    <option value={1000}>1000 m (1 km)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={startRace}
                disabled={raceState === 'racing' || raceState === 'countdown'}
                className={`w-full py-2.5 px-6 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${
                  raceState === 'racing' || raceState === 'countdown'
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white shadow-emerald-900/50 cursor-pointer'
                }`}
              >
                {raceState === 'countdown' ? (
                  <span className="text-xl font-black animate-ping text-amber-300">{countdown}</span>
                ) : raceState === 'racing' ? (
                  <span>🏎️ {t('السباق جارٍ...', 'Course en cours...')}</span>
                ) : (
                  <>
                    <span>🚀</span>
                    <span>{t('انْطِلاَقُ السِّبَاق!', 'Lancer le Départ !')}</span>
                  </>
                )}
              </button>
            </div>

            {/* Lane B */}
            <div className="flex flex-col gap-2 p-3 rounded-2xl bg-slate-950/60 border border-rose-900/50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-rose-400">🔴 {t('المَسَارُ (B)', 'Piste B')}</span>
                <button
                  onClick={() => setTurboB(!turboB)}
                  disabled={raceState === 'racing' || raceState === 'countdown'}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                    turboB ? 'bg-rose-500 text-white border-rose-300 animate-pulse' : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  🚀 {t('تُورْبُو', 'Turbo')} {turboB ? 'ON' : 'OFF'}
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-4xl p-2 rounded-2xl bg-rose-950/80 border border-rose-700/50">
                  {vehicleB.emoji}
                </span>
                <div className="flex-1">
                  <select
                    value={vehicleBId}
                    onChange={(e) => setVehicleBId(e.target.value)}
                    disabled={raceState === 'racing' || raceState === 'countdown'}
                    className="w-full appearance-none bg-slate-900 text-white font-bold text-sm rounded-xl px-3 py-2 border border-rose-500/40 focus:outline-none"
                  >
                    {CITY_VEHICLES.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.emoji} {t(v.nameAr, v.nameFr)} ({v.speedKmh} km/h)
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center justify-between text-xs text-rose-300 font-bold mt-1">
                    <span>{t('السرعة:', 'Vitesse :')} {realSpeedB.toFixed(0)} km/h</span>
                    <span>{(realSpeedB / 3.6).toFixed(1)} m/s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── 2D / 3D CITY TRACK ARENA ── */}
          <div
            className={`relative w-full rounded-3xl overflow-hidden border-4 border-amber-400/40 shadow-2xl transition-all duration-700 ${
              viewPerspective === '3d'
                ? 'bg-gradient-to-b from-sky-900 via-slate-900 to-slate-950 [perspective:1000px]'
                : 'bg-slate-900'
            }`}
            style={{ minHeight: '360px' }}
          >
            {/* Speed Radar Flash Overlay */}
            {speedRadarFlashed && (
              <div className="absolute top-4 right-1/2 translate-x-1/2 z-30 bg-amber-400 text-slate-950 px-4 py-2 rounded-2xl font-black text-xs sm:text-sm shadow-2xl flex items-center gap-2 animate-bounce border-2 border-white">
                <span>📸⚡</span>
                <span>{t('فلاش رادار المدينة! تجاوز السرعة المحددة (50 كم/سا)', 'Flash Radar Urbain ! Dépassement de 50 km/h')}</span>
              </div>
            )}

            {/* City Skyline */}
            <div className="absolute top-0 inset-x-0 h-20 flex items-end justify-between px-6 opacity-30 pointer-events-none text-2xl sm:text-4xl border-b border-slate-700/50 select-none">
              <span>🏢</span><span>🏬</span><span>🏨</span><span>🌴</span><span>🏫</span><span>🏥</span><span>🌳</span><span>🏛️</span>
            </div>

            {/* Track Isometric Container */}
            <div
              className={`w-full h-full p-6 sm:p-10 flex flex-col justify-center gap-8 transition-transform duration-700 ${
                viewPerspective === '3d' ? '[transform:rotateX(28deg)_scale(0.95)] shadow-2xl' : ''
              }`}
            >
              {/* LANE A */}
              <div className="relative flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-bold text-indigo-300 px-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-md bg-indigo-900/60">🔵 {t(vehicleA.nameAr, vehicleA.nameFr)}</span>
                    <span className="bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">⚡ {realSpeedA.toFixed(0)} km/h</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span>⏱️ {(progressA * timeA).toFixed(1)} s / {timeA.toFixed(1)} s</span>
                    <span>📍 {(progressA * distanceMeters).toFixed(0)} m</span>
                  </div>
                </div>

                <div className="relative h-20 sm:h-24 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl border-2 border-indigo-500/40 shadow-inner flex items-center px-4 overflow-hidden">
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 border-t-2 border-dashed border-yellow-400/40 pointer-events-none" />
                  <div className="absolute start-3 top-0 bottom-0 flex flex-col items-center justify-center border-e-2 border-dashed border-emerald-400/60 pe-2 pointer-events-none">
                    <span className="text-xs font-black text-emerald-400">START</span>
                    <span className="text-sm">🚦</span>
                  </div>
                  <div className="absolute end-3 top-0 bottom-0 flex flex-col items-center justify-center border-s-2 border-dashed border-amber-400/80 ps-2 pointer-events-none bg-amber-400/10">
                    <span className="text-xs font-black text-amber-300">GOAL</span>
                    <span className="text-sm">🏁</span>
                  </div>

                  {/* Vehicle A */}
                  <div
                    className="absolute flex items-center transition-all duration-75"
                    style={{ insetInlineStart: `calc(40px + ${progressA * 80}% )`, transform: 'translateY(-2px)' }}
                  >
                    <Vehicle3DModel
                      vehicleId={vehicleA.id}
                      emoji={vehicleA.emoji}
                      color={vehicleA.color}
                      isRacing={raceState === 'racing'}
                      turbo={turboA}
                      viewPerspective={viewPerspective}
                    />
                  </div>
                </div>
              </div>

              {/* LANE B */}
              <div className="relative flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-bold text-rose-300 px-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-md bg-rose-900/60">🔴 {t(vehicleB.nameAr, vehicleB.nameFr)}</span>
                    <span className="bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">⚡ {realSpeedB.toFixed(0)} km/h</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span>⏱️ {(progressB * timeB).toFixed(1)} s / {timeB.toFixed(1)} s</span>
                    <span>📍 {(progressB * distanceMeters).toFixed(0)} m</span>
                  </div>
                </div>

                <div className="relative h-20 sm:h-24 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl border-2 border-rose-500/40 shadow-inner flex items-center px-4 overflow-hidden">
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 border-t-2 border-dashed border-yellow-400/40 pointer-events-none" />
                  <div className="absolute start-3 top-0 bottom-0 flex flex-col items-center justify-center border-e-2 border-dashed border-emerald-400/60 pe-2 pointer-events-none">
                    <span className="text-xs font-black text-emerald-400">START</span>
                    <span className="text-sm">🚦</span>
                  </div>
                  <div className="absolute end-3 top-0 bottom-0 flex flex-col items-center justify-center border-s-2 border-dashed border-amber-400/80 ps-2 pointer-events-none bg-amber-400/10">
                    <span className="text-xs font-black text-amber-300">GOAL</span>
                    <span className="text-sm">🏁</span>
                  </div>

                  {/* Vehicle B */}
                  <div
                    className="absolute flex items-center transition-all duration-75"
                    style={{ insetInlineStart: `calc(40px + ${progressB * 80}% )`, transform: 'translateY(-2px)' }}
                  >
                    <Vehicle3DModel
                      vehicleId={vehicleB.id}
                      emoji={vehicleB.emoji}
                      color={vehicleB.color}
                      isRacing={raceState === 'racing'}
                      turbo={turboB}
                      viewPerspective={viewPerspective}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* FINISH POPUP */}
            <AnimatePresence>
              {raceState === 'finished' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 z-20"
                >
                  <div className="max-w-md w-full bg-slate-900 border-2 border-amber-400 rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center gap-4">
                    <span className="text-6xl animate-bounce">🏆</span>
                    <h2 className="text-2xl font-black text-amber-300">
                      {winner === 'A'
                        ? t(`الفائز: ${vehicleA.emoji} ${vehicleA.nameAr}!`, `Victoire : ${vehicleA.emoji} ${vehicleA.nameFr} !`)
                        : winner === 'B'
                        ? t(`الفائز: ${vehicleB.emoji} ${vehicleB.nameAr}!`, `Victoire : ${vehicleB.emoji} ${vehicleB.nameFr} !`)
                        : t('تعادل رائع وسرعة متكافئة!', 'Égalité parfaite !')}
                    </h2>

                    <div className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs sm:text-sm text-slate-300 text-start space-y-2">
                      <div className="flex justify-between border-b border-slate-800 pb-1">
                        <span>🔵 {t(vehicleA.nameAr, vehicleA.nameFr)}</span>
                        <span className="font-mono text-cyan-400 font-bold">{timeA.toFixed(2)} s ({realSpeedA.toFixed(0)} km/h)</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-1">
                        <span>🔴 {t(vehicleB.nameAr, vehicleB.nameFr)}</span>
                        <span className="font-mono text-rose-400 font-bold">{timeB.toFixed(2)} s ({realSpeedB.toFixed(0)} km/h)</span>
                      </div>
                      <div className="pt-1 text-amber-300 font-bold text-center">
                        ⚡ {t(
                          `فارق الوصول: ${Math.abs(timeA - timeB).toFixed(2)} ثانية!`,
                          `Différence d'arrivée : ${Math.abs(timeA - timeB).toFixed(2)} secondes !`
                        )}
                      </div>
                    </div>

                    <button
                      onClick={startRace}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-black text-base shadow-lg active:scale-95"
                    >
                      🔄 {t('إعادة السباق وتجربة مركبات أخرى', 'Rejouer / Changer de véhicules')}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* ── TAB 2 : COMPARATOR & SORTING LAB ── */}
      {activeTab === 'comparator' && (
        <div className="w-full flex flex-col gap-6">
          {/* If 1AP/2AP, show interactive ordering game */}
          {isEarlyGrade ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div>
                <h2 className="text-xl font-black text-amber-400 flex items-center gap-2">
                  <span>🧩</span>
                  <span>{t('لُعْبَةُ التَّرْتِيبِ: مِنْ الأَبْطَأِ إِلَى الأَسْرَعِ!', 'Jeu : Du plus lent au plus rapide !')}</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  {t('اضغط على بطاقتين لتبديل مكانهما حتى ترتب وسائل النقل من الأبطأ (المشي) إلى الأسرع (الطائرة)!',
                     'Touche deux cartes pour échanger leur position et les classer de la plus lente à la plus rapide !')}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {sortList.map((id, idx) => {
                  const veh = CITY_VEHICLES.find((v) => v.id === id) || CITY_VEHICLES[0];
                  return (
                    <div
                      key={id}
                      className="bg-slate-950 p-4 rounded-2xl border-2 border-slate-800 hover:border-amber-400 flex flex-col items-center gap-2 shadow-lg transition-all"
                    >
                      <span className="text-5xl">{veh.emoji}</span>
                      <span className="text-sm font-black text-slate-100 text-center">{t(veh.nameAr, veh.nameFr)}</span>
                      <span className="text-xs font-bold text-amber-400 font-mono">{veh.speedKmh} km/h</span>
                      <div className="flex gap-2 mt-2">
                        {idx > 0 && (
                          <button
                            onClick={() => handleSwapSort(idx, idx - 1)}
                            aria-label={t('بدّل مع البطاقة السابقة', 'Échanger avec la carte précédente')}
                            className="min-w-[60px] min-h-[60px] flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-2xl"
                          >
                            ⬅️
                          </button>
                        )}
                        {idx < sortList.length - 1 && (
                          <button
                            onClick={() => handleSwapSort(idx, idx + 1)}
                            aria-label={t('بدّل مع البطاقة التالية', 'Échanger avec la carte suivante')}
                            className="min-w-[60px] min-h-[60px] flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-2xl"
                          >
                            ➡️
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {sortSolved && (
                <div className="p-4 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500 text-center text-emerald-300 font-black text-base animate-bounce">
                  🎉 {t('أحسنت يا بطل! الترتيب صحيح ومثالي: المشي 🚶 ⬅️ الدراجة 🚲 ⬅️ التاكسي 🚕 ⬅️ الطائرة ✈️',
                         'Bravo champion ! Classement parfait : Marche 🚶 ⬅️ Vélo 🚲 ⬅️ Taxi 🚕 ⬅️ Avion ✈️')}
                </div>
              )}
            </div>
          ) : (
            /* Bar Chart for 3AP, 4AP, 5AP */
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div>
                <h2 className="text-xl font-black text-amber-400 flex items-center gap-2">
                  <span>📊</span>
                  <span>{t('مُقَارَنَةُ سُرُعَاتِ وَسَائِلِ النَّقْلِ فِي المَدِينَةِ وَالطُّرُقَاتِ', 'Comparateur Graphique des Vitesses Urbaines & Interurbaines')}</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  {t('شاهد الفارق الزمني المذهل لقطع مسافة 100 كيلومتر بكل وسيلة نقل!', 'Visualise le temps nécessaire pour parcourir 100 km selon la vitesse !')}
                </p>
              </div>

              <div className="space-y-3">
                {CITY_VEHICLES.map((v) => {
                  const percent = (v.speedKmh / 800) * 100;
                  const timeFor100km = 100 / v.speedKmh;
                  const hours = Math.floor(timeFor100km);
                  const minutes = Math.round((timeFor100km - hours) * 60);

                  return (
                    <div
                      key={v.id}
                      className="p-3 sm:p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-amber-400/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 w-48 shrink-0">
                        <span className="text-3xl p-2 rounded-xl bg-slate-900 border border-slate-700">
                          {v.emoji}
                        </span>
                        <div>
                          <div className="font-black text-sm text-slate-100">{t(v.nameAr, v.nameFr)}</div>
                          <div className="text-xs text-amber-400 font-mono font-bold">{v.speedKmh} km/h</div>
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col gap-1">
                        <div className="w-full bg-slate-900 h-4 rounded-full overflow-hidden border border-slate-800">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.max(percent, 2)}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: v.color }}
                          />
                        </div>
                        <div className="text-[11px] text-slate-400 italic">💡 {t(v.factAr, v.factFr)}</div>
                      </div>

                      <div className="text-xs font-mono bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 text-end shrink-0">
                        <span className="text-slate-400 block">{t('لزمن 100 كم:', 'Pour 100 km :')}</span>
                        <span className="font-bold text-amber-300">
                          {hours > 0 ? `${hours}h ` : ''}{minutes > 0 ? `${minutes}min` : ''}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 3 : FORMULA LAB (4AP & 5AP) ── */}
      {activeTab === 'calculator' && isUpperGrade && (
        <div className="w-full max-w-4xl flex flex-col gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div>
              <h2 className="text-xl font-black text-amber-400 flex items-center gap-2">
                <span>🧪</span>
                <span>{t('المُثَلَّثُ السِّحْرِيُّ لِقَانُونِ السُّرْعَة: v = d / t', 'Triangle Magique de la Vitesse : v = d / t')}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                {t('اختر ما تريد حسابه (السرعة، المسافة، أو الزمن) واستخدم الآلة الحاسبة الذكية المفسرة بالخطوات!',
                   'Choisis la grandeur à calculer et observe la résolution pas-à-pas !')}
              </p>
            </div>

            {/* Interactive Magic Triangle */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 bg-slate-950 p-6 rounded-2xl border border-slate-800">
              <div className="relative w-52 h-44 flex flex-col items-center justify-center bg-indigo-950/40 border-2 border-indigo-500/50 rounded-3xl p-4 shadow-lg">
                <button
                  onClick={() => setTargetVariable('d')}
                  className={`text-base font-black px-4 py-1.5 rounded-xl border transition-all mb-2 ${
                    targetVariable === 'd' ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-lg scale-105' : 'bg-slate-900 text-amber-400 border-amber-500/40'
                  }`}
                >
                  d ({t('المسافة', 'Distance')})
                </button>
                <div className="w-full h-0.5 bg-indigo-400/50 mb-2" />
                <div className="flex items-center justify-between w-full px-2 text-sm font-black">
                  <button
                    onClick={() => setTargetVariable('v')}
                    className={`px-3 py-1.5 rounded-lg border transition-all ${
                      targetVariable === 'v' ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-lg scale-105' : 'bg-slate-900 text-cyan-400 border-cyan-500/40'
                    }`}
                  >
                    v ({t('السرعة', 'Vitesse')})
                  </button>
                  <span className="text-slate-400 text-lg">×</span>
                  <button
                    onClick={() => setTargetVariable('t')}
                    className={`px-3 py-1.5 rounded-lg border transition-all ${
                      targetVariable === 't' ? 'bg-rose-500 text-white border-rose-300 shadow-lg scale-105' : 'bg-slate-900 text-rose-400 border-rose-500/40'
                    }`}
                  >
                    t ({t('الزمن', 'Temps')})
                  </button>
                </div>
              </div>

              {/* Dynamic Formula Display */}
              <div className="flex-1 bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3 text-sm">
                <div className="font-black text-amber-400 text-base">
                  {targetVariable === 'v' && t('📌 حساب السرعة: v = d ÷ t', '📌 Calcul de la Vitesse : v = d ÷ t')}
                  {targetVariable === 'd' && t('📌 حساب المسافة: d = v × t', '📌 Calcul de la Distance : d = v × t')}
                  {targetVariable === 't' && t('📌 حساب الزمن: t = d ÷ v', '📌 Calcul du Temps : t = d ÷ v')}
                </div>
                <p className="text-xs text-slate-300">
                  {targetVariable === 'v' && t('لقياس السرعة المتوسطة، نقسم المسافة الإجمالية المقطوعة (بالكيلومتر) على المدة الزمنية (بالساعات).', 'On divise la distance (km) par le temps (h) pour obtenir des km/h.')}
                  {targetVariable === 'd' && t('لمعرفة المسافة المقطوعة، نضرب السرعة المتوسطة في عدد الساعات.', 'On multiplie la vitesse par la durée du trajet.')}
                  {targetVariable === 't' && t('لمعرفة المدة الزمنية للرحلة، نقسم المسافة على السرعة.', 'On divise la distance par la vitesse pour trouver le temps.')}
                </p>
              </div>
            </div>

            {/* Interactive Calculator Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-6 rounded-2xl border border-slate-800">
              {targetVariable === 'v' && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300">
                      📏 {t('المسافة المقطوعة d (بالكيلومتر km):', 'Distance d (en km) :')} <span className="text-amber-400 font-black">{inputDistanceKm} km</span>
                    </label>
                    <input
                      type="range"
                      min={10}
                      max={1000}
                      step={10}
                      value={inputDistanceKm}
                      onChange={(e) => setInputDistanceKm(Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300">
                      ⏱️ {t('الزمن المستغرق t (بالساعات h):', 'Temps t (en heures) :')} <span className="text-rose-400 font-black">{inputTimeHours} h</span>
                    </label>
                    <input
                      type="range"
                      min={0.5}
                      max={10}
                      step={0.5}
                      value={inputTimeHours}
                      onChange={(e) => setInputTimeHours(Number(e.target.value))}
                      className="w-full accent-rose-400 cursor-pointer"
                    />
                  </div>
                </>
              )}

              {targetVariable === 'd' && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300">
                      ⚡ {t('السرعة المتوسطة v (كم/سا):', 'Vitesse v (en km/h) :')} <span className="text-cyan-400 font-black">{inputSpeedKmh} km/h</span>
                    </label>
                    <input
                      type="range"
                      min={10}
                      max={200}
                      step={5}
                      value={inputSpeedKmh}
                      onChange={(e) => setInputSpeedKmh(Number(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300">
                      ⏱️ {t('الزمن المستغرق t (بالساعات):', 'Temps t (en heures) :')} <span className="text-rose-400 font-black">{inputTimeHours} h</span>
                    </label>
                    <input
                      type="range"
                      min={0.5}
                      max={10}
                      step={0.5}
                      value={inputTimeHours}
                      onChange={(e) => setInputTimeHours(Number(e.target.value))}
                      className="w-full accent-rose-400 cursor-pointer"
                    />
                  </div>
                </>
              )}

              {targetVariable === 't' && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300">
                      📏 {t('المسافة d (بالكيلومتر):', 'Distance d (en km) :')} <span className="text-amber-400 font-black">{inputDistanceKm} km</span>
                    </label>
                    <input
                      type="range"
                      min={10}
                      max={1000}
                      step={10}
                      value={inputDistanceKm}
                      onChange={(e) => setInputDistanceKm(Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300">
                      ⚡ {t('السرعة v (كم/سا):', 'Vitesse v (en km/h) :')} <span className="text-cyan-400 font-black">{inputSpeedKmh} km/h</span>
                    </label>
                    <input
                      type="range"
                      min={10}
                      max={200}
                      step={5}
                      value={inputSpeedKmh}
                      onChange={(e) => setInputSpeedKmh(Number(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Step-by-Step Calculation Result Box */}
            <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 p-5 rounded-2xl border-2 border-indigo-500/50 shadow-xl space-y-2">
              <div className="text-xs font-black text-indigo-400 uppercase">
                📝 {t('الشرح والحل بالخطوات النموذجية:', 'Résolution Détaillée Pas-à-Pas :')}
              </div>
              <div className="font-mono text-base sm:text-lg font-bold text-slate-100">
                {targetVariable === 'v' && (
                  <div>
                    v = {inputDistanceKm} km ÷ {inputTimeHours} h ={' '}
                    <span className="text-amber-300 text-xl font-black">
                      {(inputDistanceKm / inputTimeHours).toFixed(1)} km/h
                    </span>{' '}
                    ({((inputDistanceKm / inputTimeHours) / 3.6).toFixed(1)} m/s)
                  </div>
                )}
                {targetVariable === 'd' && (
                  <div>
                    d = {inputSpeedKmh} km/h × {inputTimeHours} h ={' '}
                    <span className="text-amber-300 text-xl font-black">
                      {(inputSpeedKmh * inputTimeHours).toFixed(0)} km
                    </span>
                  </div>
                )}
                {targetVariable === 't' && (
                  <div>
                    t = {inputDistanceKm} km ÷ {inputSpeedKmh} km/h ={' '}
                    <span className="text-amber-300 text-xl font-black">
                      {(inputDistanceKm / inputSpeedKmh).toFixed(2)} h
                    </span>{' '}
                    ({Math.floor(inputDistanceKm / inputSpeedKmh)}h {Math.round(((inputDistanceKm / inputSpeedKmh) - Math.floor(inputDistanceKm / inputSpeedKmh)) * 60)}min)
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4 : ALGERIAN INTERCITY TRIPS (4AP & 5AP) ── */}
      {activeTab === 'algeria_trips' && isUpperGrade && (
        <div className="w-full max-w-4xl flex flex-col gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div>
              <h2 className="text-xl font-black text-amber-400 flex items-center gap-2">
                <span>🇩🇿</span>
                <span>{t('مُخَطَّطُ السَّفَرِ وَالرِّحْلَاتِ بَيْنَ وِلاَيَاتِ الجَزَائِر', 'Planificateur de Voyage & Vitesse en Algérie')}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                {t('احسب وقت الوصول الفعلي والسرعة المطلوبة للتنقل بين المدن الجزائرية بالطائرة أو القطار أو السيارة!',
                   'Calcule l’heure d’arrivée et la durée de trajet entre les villes algériennes !')}
              </p>
            </div>

            {/* Trip Selector & Config */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">📍 {t('اختر المسار:', 'Choix du trajet :')}</label>
                <select
                  value={selectedTripId}
                  onChange={(e) => setSelectedTripId(e.target.value)}
                  className="w-full appearance-none bg-slate-950 text-white font-bold text-sm rounded-xl px-3 py-2.5 border border-slate-800 focus:outline-none"
                >
                  {ALGERIAN_TRIPS.map((tr) => (
                    <option key={tr.id} value={tr.id}>
                      {t(tr.fromAr, tr.fromFr)} ➡️ {t(tr.toAr, tr.toFr)} ({tr.distanceKm} km)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">🚗 {t('وسيلة النقل:', 'Moyen de transport :')}</label>
                <select
                  value={tripVehicleId}
                  onChange={(e) => setTripVehicleId(e.target.value)}
                  className="w-full appearance-none bg-slate-950 text-white font-bold text-sm rounded-xl px-3 py-2.5 border border-slate-800 focus:outline-none"
                >
                  {CITY_VEHICLES.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.emoji} {t(v.nameAr, v.nameFr)} ({v.speedKmh} km/h)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">⏰ {t('ساعة الانطلاق:', 'Heure de départ :')}</label>
                <select
                  value={departureHour}
                  onChange={(e) => setDepartureHour(Number(e.target.value))}
                  className="w-full appearance-none bg-slate-950 text-white font-bold text-sm rounded-xl px-3 py-2.5 border border-slate-800 focus:outline-none"
                >
                  {Array.from({ length: 24 }).map((_, h) => (
                    <option key={h} value={h}>
                      {String(h).padStart(2, '0')}:00
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Travel Summary Card */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl p-3 bg-slate-900 rounded-2xl border border-slate-700">{tripVehicle.emoji}</span>
                  <div>
                    <h3 className="font-black text-base text-slate-100">
                      {t(selectedTrip.fromAr, selectedTrip.fromFr)} ➡️ {t(selectedTrip.toAr, selectedTrip.toFr)}
                    </h3>
                    <p className="text-xs text-amber-400 font-bold">📏 {t('المسافة:', 'Distance :')} {selectedTrip.distanceKm} km</p>
                  </div>
                </div>

                <div className="text-end">
                  <div className="text-xs text-slate-400">{t('وقت الانطلاق:', 'Départ :')} {String(departureHour).padStart(2, '0')}:00</div>
                  <div className="text-lg font-black text-emerald-400">
                    🏁 {t('وقت الوصول المتوقع:', 'Arrivée :')} {String(arrivalHour).padStart(2, '0')}:{String(arrivalMinute).padStart(2, '0')}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">⏱️ {t('المدة الإجمالية للرحلة:', 'Durée du voyage :')}</span>
                  <span className="text-base font-black text-amber-300">
                    {tripHours > 0 ? `${tripHours} ${t('ساعات', 'heures')} ` : ''}
                    {tripMinutes > 0 ? `${tripMinutes} ${t('دقيقة', 'minutes')}` : ''}
                  </span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">💡 {t('معلومات الرحلة الميدانية:', 'Infos pratiques :')}</span>
                  <span className="text-slate-300">{t(selectedTrip.descAr, selectedTrip.descFr)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 5 : QUIZ & CHALLENGES ── */}
      {activeTab === 'quiz' && (
        <div className="w-full max-w-2xl flex flex-col gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-black text-amber-400 flex items-center gap-2">
                  <span>🎯</span>
                  <span>{t('تَحَدِّي السُّرْعَةِ وَالمَسَائِلِ الذَّكِيَّةِ', 'Quiz & Défis de Vitesse')}</span>
                </h2>
                <p className="text-xs text-slate-400">{t('أجب على الأسئلة لكسب نقاط الخبرة والأوسمة الذهبية!', 'Gagne des XP et des pièces d’or !')}</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-2xl border border-amber-500/40 text-amber-300 font-black text-sm">
                <span>⭐</span>
                <span>{quizScore} XP</span>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <span className="px-2.5 py-1 rounded-full text-xs font-black bg-indigo-950 text-indigo-300 border border-indigo-500/40">
                {t(`السؤال ${quizIndex + 1} من ${QUIZ_LIST.length}`, `Question ${quizIndex + 1} / ${QUIZ_LIST.length}`)}
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-100 leading-relaxed">
                {t(currentQuiz.questionAr, currentQuiz.questionFr)}
              </h3>

              {/* Options */}
              <div className="grid grid-cols-1 gap-2 pt-2">
                {currentQuiz.options.map((opt, oIdx) => {
                  const isSelected = selectedOption === oIdx;
                  const isCorrect = oIdx === currentQuiz.correctIndex;
                  let btnClass = 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800';

                  if (selectedOption !== null) {
                    if (isCorrect) btnClass = 'bg-emerald-950/80 text-emerald-300 border-emerald-500 shadow-lg';
                    else if (isSelected) btnClass = 'bg-rose-950/80 text-rose-300 border-rose-500';
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleAnswer(oIdx)}
                      disabled={selectedOption !== null}
                      className={`p-3.5 rounded-2xl font-bold text-sm text-start border transition-all ${btnClass}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Next */}
              {selectedOption !== null && (
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <div className={`p-3 rounded-xl text-xs font-bold ${quizFeedback === 'correct' ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'}`}>
                    💡 {t(currentQuiz.explanationAr, currentQuiz.explanationFr)}
                  </div>
                  <button
                    onClick={nextQuestion}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-black text-sm shadow-md"
                  >
                    ➡️ {t('السؤال الموالي', 'Question Suivante')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
