import React, { useState, useEffect, useId, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap,
  Power,
  Lightbulb,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Volume2,
  VolumeX,
  Play,
  ArrowLeftRight,
  Flame,
  Award,
  HelpCircle,
  Check,
  AlertTriangle,
  Cpu
} from 'lucide-react';
import { CircuitBuilder } from './CircuitBuilder';
import { ElectricDeviceArt, MATERIAL_ART } from './ElectricDeviceArt';
import { useTranslation } from '../hooks/useTranslation';
import { useLocaleContext } from '../context/LocaleContext';

// Types for components in the circuit
type VoltageLevel = 4.5 | 9.0;
type DiodePolarity = 'forward' | 'reverse'; // forward = anode (+), reverse = cathode (-)
type CircuitType = 'simple' | 'series' | 'parallel';
type TestedMaterial = 'iron_nail' | 'copper' | 'salt_water' | 'plastic_ruler' | 'wood' | 'rubber';

interface MaterialInfo {
  id: TestedMaterial;
  nameAr: string;
  nameFr: string;
  isConductor: boolean;
  icon: string;
  color: string;
}

const MATERIALS_LIST: MaterialInfo[] = [
  { id: 'iron_nail', nameAr: 'مسمار حديدي', nameFr: 'Clou en fer', isConductor: true, icon: '🔩', color: 'bg-slate-200 text-slate-800 border-slate-400' },
  { id: 'copper', nameAr: 'سلك نحاسي', nameFr: 'Fil de cuivre', isConductor: true, icon: '🪙', color: 'bg-amber-200 text-amber-900 border-amber-400' },
  { id: 'salt_water', nameAr: 'ماء مالح', nameFr: 'Eau salée', isConductor: true, icon: '🧂💧', color: 'bg-cyan-100 text-cyan-900 border-cyan-400' },
  { id: 'plastic_ruler', nameAr: 'مسطرة بلاستيكية', nameFr: 'Règle en plastique', isConductor: false, icon: '📏', color: 'bg-blue-100 text-blue-900 border-blue-300' },
  { id: 'wood', nameAr: 'قطعة خشب جافة', nameFr: 'Morceau de bois', isConductor: false, icon: '🪵', color: 'bg-amber-100 text-amber-900 border-amber-300' },
  { id: 'rubber', nameAr: 'قطعة مطاط (محاية)', nameFr: 'Gomme en caoutchouc', isConductor: false, icon: '🧼', color: 'bg-rose-100 text-rose-900 border-rose-300' },
];

export const ElectricityLabInteractive: React.FC = () => {
  const { direction } = useLocaleContext();
  const t = useTranslation('labsScience');
  const svgId = useId();
  const lastSwitchToggleAt = useRef(0);
  // Pedagogical labels stay Arabic — never overlay French quiz/explanations.
  const showFrench = false;
  // Global Interactive Settings
  const [activeTab, setActiveTab] = useState<'circuit_builder' | 'sandbox' | 'diode_exp' | 'conductors_exp' | 'series_parallel' | 'quiz'>('diode_exp');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Circuit Core State
  const [batteryVoltage, setBatteryVoltage] = useState<VoltageLevel>(4.5);
  const [batteryFlipped, setBatteryFlipped] = useState<boolean>(false); // Battery +/- orientation
  const [switchClosed, setSwitchClosed] = useState<boolean>(true); // Closed = ON, Open = OFF
  const [activeLoad, setActiveLoad] = useState<'bulb' | 'diode' | 'motor' | 'buzzer' | 'material' | 'resistor'>('diode');

  // Diode specific state
  const [diodeFlipped, setDiodeFlipped] = useState<boolean>(false); // Forward bias vs Reverse bias

  // Resistor specific state
  const [resistorValue, setResistorValue] = useState<10 | 100 | 1000>(100); // Ohms

  // Conductors experiment state
  const [selectedMaterial, setSelectedMaterial] = useState<TestedMaterial>('iron_nail');

  // Series / Parallel state
  const [circuitType, setCircuitType] = useState<CircuitType>('series');
  const [bulb1Broken, setBulb1Broken] = useState<boolean>(false);
  const [bulb2Broken, setBulb2Broken] = useState<boolean>(false);
  const bulb1Lit =
    !bulb1Broken && switchClosed && (circuitType === 'parallel' || !bulb2Broken);
  const bulb2Lit =
    !bulb2Broken && switchClosed && (circuitType === 'parallel' || !bulb1Broken);

  // Challenge Quiz State
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});

  // Helper sound effect using Web Audio API Synth
  const playBeep = (freq: number = 800, duration: number = 0.15, type: OscillatorType = 'sine') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio Context error:', e);
    }
  };

  // Sound effect when switch toggled. Ignore a second event in the same tap
  // (SVG pointerup then the compatibility click, or overlapping hit targets).
  const handleToggleSwitch = () => {
    const now = Date.now();
    if (now - lastSwitchToggleAt.current < 280) return;
    lastSwitchToggleAt.current = now;
    const newState = !switchClosed;
    setSwitchClosed(newState);
    playBeep(newState ? 1200 : 400, 0.1, 'triangle');
  };

  // Calculate Circuit Status Logic
  const getCircuitLogicStatus = () => {
    if (!switchClosed) {
      return {
        isClosed: false,
        isCurrentFlowing: false,
        reasonAr: 'القاطعة مفتوحة — الدارة مقطوعة والتيار لا يمر.',
        explainAr: 'فتح القاطعة يقطع الحلقة بين قطبي البطارية. لا يمكن للكهرباء أن تكمل المسار، لذلك ينطفئ المصباح أو الصمام فوراً — حتى لو كانت كل الأسلاك موصولة.',
        reasonFr: 'Le circuit est ouvert car l\'interrupteur est ouvert.',
        statusColor: 'text-amber-400 bg-amber-950/80 border-amber-700/60'
      };
    }

    if (activeLoad === 'material') {
      const mat = MATERIALS_LIST.find((m) => m.id === selectedMaterial);
      if (mat?.isConductor) {
        return {
          isClosed: true,
          isCurrentFlowing: true,
          reasonAr: `المادة المختارة (${mat.nameAr}) جسم ناقل للكهرباء تسمح بمرور التيار لإضاءة المصباح.`,
          explainAr: `القاطعة مغلقة والحلقة مكتملة. ${mat.nameAr} يسمح بمرور الإلكترونات مثل سلك معدني، فيضيء المصباح.`,
          reasonFr: `Le matériau (${mat.nameFr}) est un conducteur électrique.`,
          statusColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-700/60'
        };
      } else {
        return {
          isClosed: false,
          isCurrentFlowing: false,
          reasonAr: `المادة المختارة (${mat?.nameAr}) جسم عازل للكهرباء لا تسمح بمرور التيار.`,
          explainAr: `القاطعة مغلقة لكن ${mat?.nameAr} يقطع المسار مثل فجوة في السلك. العازل يمنع التيار، لذلك يبقى المصباح مطفأ.`,
          reasonFr: `Le matériau (${mat?.nameFr}) est un isolant électrique.`,
          statusColor: 'text-rose-400 bg-rose-950/80 border-rose-700/60'
        };
      }
    }

    if (activeLoad === 'diode') {
      // Diode allows current ONLY when anode (+) connects to battery (+), cathode (-) to battery (-)
      // If battery is not flipped and diode is not flipped -> Forward bias (Passes current)
      // If battery is flipped and diode is flipped -> Forward bias (Passes current)
      // Otherwise -> Reverse bias (Blocks current)
      const isForwardBias = (!batteryFlipped && !diodeFlipped) || (batteryFlipped && diodeFlipped);

      if (isForwardBias) {
        return {
          isClosed: true,
          isCurrentFlowing: true,
          reasonAr: 'الصمام الثنائي في انحياز أمامي ➔ يمر التيار ويضيء الصمام!',
          explainAr: 'القاطعة مغلقة والحلقة مكتملة. المصعد (+) مقابل القطب الموجب والمهبط (-) مقابل السالب، فيمر التيار في الاتجاه الوحيد الذي يسمح به الصمام.',
          reasonFr: 'La diode est polarisée en sens direct ➔ Le courant passe !',
          statusColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-700/60'
        };
      } else {
        return {
          isClosed: true,
          isCurrentFlowing: false,
          reasonAr: 'الصمام الثنائي في انحياز عكسي ➔ يمنع مرور التيار بالكامل!',
          explainAr: 'القاطعة مغلقة لكن الصمام معكوس: هو صمام اتجاه واحد. رغم أن الأسلاك موصولة، الصمام يسد المسار كما تسد القاطعة المفتوحة.',
          reasonFr: 'La diode est polarisée en sens inverse ➔ Le courant n\'est pas autorisé !',
          statusColor: 'text-rose-400 bg-rose-950/80 border-rose-700/60'
        };
      }
    }

    if (activeLoad === 'bulb' || activeLoad === 'motor' || activeLoad === 'buzzer') {
      const loadName = activeLoad === 'bulb' ? 'المصباح' : activeLoad === 'motor' ? 'المحرك' : 'الجرس';
      return {
        isClosed: true,
        isCurrentFlowing: true,
        reasonAr: `الدارة مغلقة — ${loadName} يعمل لأن التيار يكمل الحلقة.`,
        explainAr: `القاطعة مغلقة فالحلقة مكتملة من القطب الموجب إلى السالب عبر ${loadName}. الكهرباء تمر في مسار واحد مغلق؛ افتح القاطعة لترى الانطفاء فوراً.`,
        reasonFr: 'Le circuit est fermé et le courant circule normalement.',
        statusColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-700/60'
      };
    }

    if (activeLoad === 'resistor') {
      return {
        isClosed: true,
        isCurrentFlowing: true,
        reasonAr: `الدارة مغلقة والمقاومة (${resistorValue} Ω) تحدّ من شدة التيار الكهربائي المار في الدارة.`,
        explainAr: `القاطعة مغلقة والتيار يمر، لكن المقاومة تعيق حركة الشحنات: كلما زادت قيمتها قلّت شدة التيار (قراءة المقياس أدناه).`,
        reasonFr: `Le circuit est fermé, la résistance (${resistorValue} Ω) limite l'intensité du courant.`,
        statusColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-700/60'
      };
    }

    return {
      isClosed: true,
      isCurrentFlowing: true,
      reasonAr: 'الدارة مغلقة والتيار يمر في حلقة مكتملة.',
      explainAr: 'طالما القاطعة مغلقة وكل عنصر يوصل، تكمل الكهرباء المسار من (+) إلى (−).',
      reasonFr: 'Circuit fermé.',
      statusColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-700/60'
    };
  };

  const currentStatus = getCircuitLogicStatus();

  // Simplified multimeter reading (نموذج مبسّط تربوي، وليس حساباً فيزيائياً دقيقاً)
  const getMultimeterReading = (): { voltage: number; currentMa: number; resistanceLabel: string } => {
    if (!currentStatus.isCurrentFlowing) {
      return { voltage: switchClosed ? batteryVoltage : 0, currentMa: 0, resistanceLabel: '∞ (دارة مفتوحة)' };
    }
    let resistanceOhms = 10;
    if (activeLoad === 'resistor') resistanceOhms = resistorValue;
    else if (activeLoad === 'material') resistanceOhms = 2;
    else if (activeLoad === 'diode') resistanceOhms = 5;
    else if (activeLoad === 'motor') resistanceOhms = 15;
    else if (activeLoad === 'buzzer') resistanceOhms = 50;
    else if (activeLoad === 'bulb') resistanceOhms = 10;

    const currentMa = (batteryVoltage / resistanceOhms) * 1000;
    return { voltage: batteryVoltage, currentMa, resistanceLabel: `${resistanceOhms} Ω` };
  };

  const multimeterReading = getMultimeterReading();

  // Play continuous buzzer sound effect when current flows into buzzer
  useEffect(() => {
    if (activeLoad === 'buzzer' && currentStatus.isCurrentFlowing && soundEnabled) {
      const interval = setInterval(() => {
        playBeep(900, 0.08, 'sawtooth');
      }, 150);
      return () => clearInterval(interval);
    }
  }, [activeLoad, currentStatus.isCurrentFlowing, soundEnabled]);

  // Quiz Questions for Primary School Electricity
  const quizQuestions = [
    {
      id: 1,
      qAr: 'ما هو العنصر الذي يسمح بمرور التيار الكهربائي في اتجاه واحد فقط في الدارة؟',
      qFr: 'Quel composant laisse passer le courant dans un seul sens ?',
      options: ['المصباح الكهربائي', 'الصمام الثنائي الضوئي (Diode LED)', 'القاطعة', 'البطارية'],
      correctIdx: 1,
      expAr: 'الصمام الثنائي الضوئي (Diode) يحتوي على مربطين (مصعد وكاثود) ويسمح بمرور التيار في الاتجاه الأمامي فقط.'
    },
    {
      id: 2,
      qAr: 'أي من المواد التالية تُعتبر جسماً ناقلاً للكهرباء وتضيء المصباح عند وضعها في الدارة؟',
      qFr: 'Lequel est un conducteur électrique ?',
      options: ['مسطرة بلاستيكية', 'قطعة خشب جافة', 'مسمار حديدي', 'قطعة مطاط'],
      correctIdx: 2,
      expAr: 'الحديد والنحاس والمعادن أعداء للعزل وناقلة ممتازة للكهرباء.'
    },
    {
      id: 3,
      qAr: 'عند ربط مصباحين على التسلسل (En série) وتلف أو فك أحد المصباحين، ماذا يحدث للمصباح الثاني؟',
      qFr: 'Que se passe-t-il si une ampoule grille dans un montage en série ?',
      options: ['يبقى المصباح الثاني مشتعلاً', 'ينطفئ المصباح الثاني وتفتح الدارة', 'تزداد شدة إضاءة المصباح الثاني', 'ينفجر المولد'],
      correctIdx: 1,
      expAr: 'في الربط على التسلسل تشكل الأجهزة حلقة واحدة؛ إذا انقطعت العروة ينطفئ باقي المصابيح.'
    },
    {
      id: 4,
      qAr: 'ماذا يسمى الاتجاه الاصطلاحي للتيار الكهربائي خارج المولد (البطارية)؟',
      qFr: 'Quel est le sens conventionnel du courant électrique ?',
      options: ['من القطب السالب (-) إلى القطب الموجب (+)', 'من القطب الموجب (+) إلى القطب السالب (-)', 'من القاطعة إلى المولد', 'ليس للتيار اتجاه محدد'],
      correctIdx: 1,
      expAr: 'التيار الكهربائي يسري اصطلاحاً دائماً من القطب الموجب (+) نحو القطب السالب (-) للبطارية.'
    },
    {
      id: 5,
      qAr: 'عند ربط المصباحين على التفرع (En parallèle)، ما فائدة هذا الربط في المنازل؟',
      qFr: 'Quel est l\'avantage du montage en parallèle dans les maisons ?',
      options: ['إذا انطفأ مصباح تظل بقية المصابيح مشتعلة وتعمل بشكل مستقل', 'تصبح الإضاءة خافتة جداً', 'تستهلك البطارية بسرعة مضاعفة بدون فائدة', 'تمنع استخدام القاطعة'],
      correctIdx: 0,
      expAr: 'الربط على التفرع يوفر لكل جهاز دارة مستقلة بالكامل عن باقي الأجهزة.'
    }
  ];

  const handleQuizOptionSelect = (qIdx: number, optIdx: number) => {
    setUserAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleCalculateScore = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIdx) {
        score += 20;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
  };

  return (
    <div data-lab-instrument className="electricity-lab kids-pole rounded-[28px] p-4 sm:p-6 space-y-6" dir={direction}>
      {/* Top Title Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 rounded-2xl shadow-lg shadow-amber-500/20">
            <Zap className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-amber-300 flex items-center gap-2">
              <span>{t('elecTitle')}</span>
              <span className="text-xs bg-amber-500/20 text-amber-300 font-bold px-2.5 py-0.5 rounded-full border border-amber-500/40">
                {t('elecGradeBadge')}
              </span>
            </h2>
            <p className="text-xs text-slate-300 font-sans mt-0.5">
              {t('elecSubtitle')}
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              soundEnabled
                ? 'bg-emerald-950 text-emerald-300 border-emerald-700/60'
                : 'bg-slate-900 text-slate-300 border-slate-800'
            }`}
            title={t('elecSoundToggleTooltip')}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? t('elecSoundOn') : t('elecSoundOff')}</span>
          </button>
        </div>
      </div>

      {/* Experiment Selector Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 bg-slate-900/90 p-2 rounded-2xl border border-slate-800">
        <button
          data-elec-tab="circuit_builder"
          onClick={() => { setActiveTab('circuit_builder'); }}
          className={`p-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 border col-span-2 sm:col-span-1 ${
            activeTab === 'circuit_builder'
              ? 'bg-indigo-500 text-slate-950 border-indigo-400 shadow-md font-black scale-102'
              : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:bg-slate-800'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>{t('elecTabBuilder')}</span>
        </button>

        <button
          onClick={() => { setActiveTab('diode_exp'); setActiveLoad('diode'); }}
          className={`p-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 border ${
            activeTab === 'diode_exp'
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black scale-102'
              : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:bg-slate-800'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>{t('elecTabDiode')}</span>
        </button>

        <button
          onClick={() => { setActiveTab('conductors_exp'); setActiveLoad('material'); }}
          className={`p-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 border ${
            activeTab === 'conductors_exp'
              ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md font-black scale-102'
              : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{t('elecTabConductors')}</span>
        </button>

        <button
          data-elec-tab="series_parallel"
          onClick={() => { setActiveTab('series_parallel'); }}
          className={`p-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 border ${
            activeTab === 'series_parallel'
              ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-black scale-102'
              : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:bg-slate-800'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          <span>{t('elecTabSeriesParallel')}</span>
        </button>

        <button
          onClick={() => { setActiveTab('sandbox'); setActiveLoad('motor'); }}
          className={`p-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 border ${
            activeTab === 'sandbox'
              ? 'bg-purple-500 text-slate-950 border-purple-400 shadow-md font-black scale-102'
              : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:bg-slate-800'
          }`}
        >
          <Power className="w-4 h-4" />
          <span>{t('elecTabMotorBuzzer')}</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`p-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 border col-span-2 sm:col-span-1 ${
            activeTab === 'quiz'
              ? 'bg-rose-500 text-slate-950 border-rose-400 shadow-md font-black scale-102'
              : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{t('elecTabQuiz')}</span>
        </button>
      </div>

      {/* ── CIRCUIT BUILDER TAB ─────────────────────────────── */}
      {activeTab === 'circuit_builder' && (
        <motion.div
          key="circuit_builder"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-4"
        >
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3 flex-wrap">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-xl shadow-lg shadow-indigo-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-indigo-300">
                بناء دارة كهربائية حرة (Constructeur de circuit interactif)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                أضف العناصر واربطها بالأسلاك — ستُضاء الدارة فور اكتمالها!
              </p>
            </div>
          </div>

          <CircuitBuilder />
        </motion.div>
      )}

      {/* Main Workspace for Experiments 1, 2, and 4 */}
      {(activeTab === 'diode_exp' || activeTab === 'conductors_exp' || activeTab === 'sandbox') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel: Circuit Interactive Interactive Workbench (SVG + Canvas) */}
          <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5 shadow-inner">
            
            {/* Live Circuit Banner Status */}
            <div
              data-elec-status
              data-elec-flow={currentStatus.isCurrentFlowing ? 'on' : 'off'}
              className={`p-3.5 rounded-2xl border flex flex-col gap-2 text-xs font-bold transition-all ${currentStatus.statusColor}`}
            >
              <div className="flex items-center gap-2">
                {currentStatus.isCurrentFlowing ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
                <span>{currentStatus.reasonAr}</span>
              </div>
              <p data-elec-explain className="text-[11px] sm:text-xs font-semibold leading-relaxed opacity-95 pr-7">
                {currentStatus.explainAr}
              </p>
              {showFrench && <span className="text-[11px] opacity-80 font-mono dir-ltr" dir="ltr">{currentStatus.reasonFr}</span>}
            </div>

            {/* VISUAL SVG CIRCUIT BENCHMARK CANOPY */}
            <div
              className="electric-rendered-bench rounded-2xl border border-slate-800/80 p-4 sm:p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[300px]"
              style={{ backgroundImage: 'linear-gradient(to bottom, #020617, #0f172a, #020617)' }}
            >
              
              {/* Background Voltage Grid Lines */}
              <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

              <ElectricDeviceArt kind={activeLoad} powered={currentStatus.isCurrentFlowing} material={selectedMaterial} />
              {/* Interactive SVG Diagram */}
              <svg className="w-full max-w-lg h-60 sm:h-72 z-10 overflow-visible" viewBox="0 0 500 300">
                <defs>
                  {/* Glowing effects for current */}
                  <filter id={`${svgId}-glow`} x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <filter id={`${svgId}-bulb-glow`} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="12" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Main wires — left vertical is gapped at the switch so opening it really breaks the loop */}
                <path
                  d="M 120 220 L 50 220 L 50 170"
                  fill="none"
                  stroke={currentStatus.isCurrentFlowing ? '#eab308' : '#475569'}
                  strokeWidth="5"
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
                <path
                  d="M 50 130 L 50 80 L 450 80 L 450 220 L 380 220"
                  fill="none"
                  stroke={currentStatus.isCurrentFlowing ? '#eab308' : '#475569'}
                  strokeWidth="5"
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />

                {/* Animated Electric Current Flow Particles along the wires */}
                {currentStatus.isCurrentFlowing && (
                  <path
                    d="M 120 220 L 50 220 L 50 170 M 50 130 L 50 80 L 450 80 L 450 220 L 380 220"
                    fill="none"
                    stroke="#fef08a"
                    strokeWidth="4"
                    strokeDasharray="8 12"
                    className="opacity-80"
                  />
                )}

                {/* --- 1. BATTERY / GENERATOR AT THE BOTTOM (MOLID) --- */}
                <g transform="translate(120, 195)">
                  <rect x="0" y="0" width="260" height="50" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                  
                  {/* Battery Body */}
                  <rect x="20" y="8" width="220" height="34" rx="6" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
                  
                  {/* Battery Label & Polarity */}
                  <text x="130" y="29" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
                    مولد بطارية {batteryVoltage}V {batteryFlipped ? '(مقلوبة)' : ''}
                  </text>

                  {/* Polarity Indicators (+ and -) */}
                  {!batteryFlipped ? (
                    <>
                      {/* Left is +, Right is - */}
                      <circle cx="35" cy="25" r="11" fill="#ef4444" />
                      <text x="35" y="30" fill="#ffffff" fontSize="14" fontWeight="900" textAnchor="middle">+</text>
                      <circle cx="225" cy="25" r="11" fill="#3b82f6" />
                      <text x="225" y="29" fill="#ffffff" fontSize="14" fontWeight="900" textAnchor="middle">-</text>
                    </>
                  ) : (
                    <>
                      {/* Left is -, Right is + */}
                      <circle cx="35" cy="25" r="11" fill="#3b82f6" />
                      <text x="35" y="29" fill="#ffffff" fontSize="14" fontWeight="900" textAnchor="middle">-</text>
                      <circle cx="225" cy="25" r="11" fill="#ef4444" />
                      <text x="225" y="30" fill="#ffffff" fontSize="14" fontWeight="900" textAnchor="middle">+</text>
                    </>
                  )}
                </g>

                {/* --- 2. SWITCH (KATIA) AT LEFT WIRE — large hit target for touch --- */}
                <g
                  transform="translate(50, 150)"
                  className="cursor-pointer"
                  data-elec-switch-svg
                  onPointerUp={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleToggleSwitch();
                  }}
                >
                  <rect x="-40" y="-48" width="80" height="96" rx="14" fill="transparent" />
                  <circle cx="0" cy="-20" r="8" fill="#fbbf24" stroke="#fef08a" strokeWidth="1.5" />
                  <circle cx="0" cy="20" r="8" fill="#fbbf24" stroke="#fef08a" strokeWidth="1.5" />
                  
                  {/* Switch Blade — fills the wire gap when closed, tilts away when open */}
                  {switchClosed ? (
                    <line x1="0" y1="-20" x2="0" y2="20" stroke="#10b981" strokeWidth="6" strokeLinecap="round" />
                  ) : (
                    <line x1="0" y1="-20" x2="-30" y2="10" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" />
                  )}
                  <text x="-38" y="6" fill="#f8fafc" fontSize="12" fontWeight="bold" textAnchor="end">
                    قاطعة ({switchClosed ? 'مغلقة' : 'مفتوحة'})
                  </text>
                </g>

                {/* --- 3. TOP COMPONENT SLOT (DIODE / BULB / MOTOR / BUZZER / MATERIAL) --- */}
                <g transform="translate(250, 80)">
                  
                  {/* A) DIODE COMPONENT (الصمام الثنائي الضوئي) */}
                  {activeLoad === 'diode' && (
                    <g transform={`scale(${diodeFlipped ? -1 : 1}, 1)`}>
                      {/* Diode Box Frame */}
                      <rect x="-45" y="-35" width="90" height="70" rx="12" fill="#0f172a" stroke="#fbbf24" strokeWidth="2" />
                      
                      {/* Triangle Arrow (Anode -> Cathode) */}
                      <polygon
                        points="-20,-20 -20,20 15,0"
                        fill={currentStatus.isCurrentFlowing ? '#f59e0b' : '#64748b'}
                        stroke="#fef08a"
                        strokeWidth="1.5"
                      />
                      {/* Vertical Bar (Cathode Barrier) */}
                      <line x1="15" y1="-22" x2="15" y2="22" stroke="#fef08a" strokeWidth="4" />

                      {/* LED Glow Rays if current flows */}
                      {currentStatus.isCurrentFlowing && (
                        <g filter={`url(#${svgId}-glow)`}>
                          <circle cx="0" cy="0" r="30" fill="#fbbf24" opacity="0.3" />
                          <line x1="10" y1="-25" x2="25" y2="-40" stroke="#fef08a" strokeWidth="2.5" />
                          <line x1="-5" y1="-28" x2="10" y2="-43" stroke="#fef08a" strokeWidth="2.5" />
                        </g>
                      )}

                      {/* Anode / Cathode Labels */}
                      <text x="-25" y="30" fill="#94a3b8" fontSize="9" fontWeight="bold">المصعد (+)</text>
                      <text x="5" y="30" fill="#94a3b8" fontSize="9" fontWeight="bold">المهبط (-)</text>
                    </g>
                  )}

                  {/* B) LIGHT BULB COMPONENT (المصباح الكهربائي) */}
                  {activeLoad === 'bulb' && (
                    <g>
                      <circle cx="0" cy="0" r="30" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                      
                      {/* Filament */}
                      <path d="M -10 10 L -5 -5 L 0 5 L 5 -5 L 10 10" fill="none" stroke={currentStatus.isCurrentFlowing ? '#fef08a' : '#64748b'} strokeWidth="2" />

                      {/* Glow if ON */}
                      {currentStatus.isCurrentFlowing && (
                        <g>
                          <circle cx="0" cy="0" r="30" fill="#f59e0b" opacity="0.8" filter={`url(#${svgId}-bulb-glow)`} />
                          <circle cx="0" cy="0" r="28" fill="#fef08a" />
                          <text x="0" y="6" fill="#000000" fontSize="16" fontWeight="900" textAnchor="middle">💡</text>
                        </g>
                      )}
                      <text x="0" y="-40" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">مصباح كهربائي</text>
                    </g>
                  )}

                  {/* C) ELECTRIC MOTOR COMPONENT (المحرك) */}
                  {activeLoad === 'motor' && (
                    <g>
                      <circle cx="0" cy="0" r="32" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
                      <text x="0" y="6" fill="#ffffff" fontSize="16" fontWeight="900" textAnchor="middle">
                        M
                      </text>
                      
                      {/* Spinning Fan Blades if current flows */}
                      {currentStatus.isCurrentFlowing && (
                        <g className="animate-spin origin-center" style={{ transformOrigin: '0px 0px' }}>
                          <line x1="-25" y1="0" x2="25" y2="0" stroke="#fef08a" strokeWidth="3" />
                          <line x1="0" y1="-25" x2="0" y2="25" stroke="#fef08a" strokeWidth="3" />
                        </g>
                      )}
                      <text x="0" y="-42" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">محرك كهربائي</text>
                    </g>
                  )}

                  {/* D) BUZZER / BELL COMPONENT (الجرس) */}
                  {activeLoad === 'buzzer' && (
                    <g>
                      <rect x="-30" y="-25" width="60" height="50" rx="10" fill="#7c3aed" stroke="#a78bfa" strokeWidth="2" />
                      <text x="0" y="6" fill="#ffffff" fontSize="20" textAnchor="middle">🔔</text>
                      
                      {/* Sound waves animation if current flows */}
                      {currentStatus.isCurrentFlowing && (
                        <g className="animate-ping" style={{ transformOrigin: '0px 0px' }}>
                          <circle cx="0" cy="0" r="35" fill="none" stroke="#a78bfa" strokeWidth="2" />
                        </g>
                      )}
                      <text x="0" y="-35" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">جرس كهربائي</text>
                    </g>
                  )}

                  {/* E) CONDUCTORS / INSULATORS MATERIAL SLOT (اختبار المواد) */}
                  {activeLoad === 'material' && (
                    <g>
                      {(() => {
                        const mat = MATERIALS_LIST.find((m) => m.id === selectedMaterial);
                        return (
                          <g>
                            <rect x="-60" y="-25" width="120" height="50" rx="10" fill="#1e293b" stroke={mat?.isConductor ? '#10b981' : '#f43f5e'} strokeWidth="2.5" />
                            <text x="0" y="2" fill="#ffffff" fontSize="18" textAnchor="middle">{mat?.icon}</text>
                            <text x="0" y="20" fill="#f8fafc" fontSize="10" fontWeight="bold" textAnchor="middle">{mat?.nameAr}</text>
                          </g>
                        );
                      })()}
                    </g>
                  )}

                  {/* F) RESISTOR COMPONENT (المقاومة الكهربائية) */}
                  {activeLoad === 'resistor' && (
                    <g>
                      <rect x="-45" y="-16" width="90" height="32" rx="6" fill="#78350f" stroke="#fbbf24" strokeWidth="2" />
                      {/* Zigzag resistor symbol */}
                      <polyline
                        points="-35,0 -25,-12 -15,12 -5,-12 5,12 15,-12 25,12 35,0"
                        fill="none"
                        stroke={currentStatus.isCurrentFlowing ? '#fef08a' : '#94a3b8'}
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                      />
                      {currentStatus.isCurrentFlowing && (
                        <g filter={`url(#${svgId}-glow)`}>
                          <circle cx="0" cy="0" r="34" fill="#f59e0b" opacity="0.18" />
                        </g>
                      )}
                      <text x="0" y="32" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
                        مقاومة {resistorValue} Ω
                      </text>
                    </g>
                  )}

                </g>
              </svg>

              {/* Action Buttons under workbench */}
              <div className="flex items-center justify-center gap-3 mt-4 flex-wrap z-20">
                <button
                  type="button"
                  data-elec-switch
                  onClick={handleToggleSwitch}
                  className={`hit-target px-5 rounded-2xl font-black text-xs transition-all cursor-pointer flex items-center gap-2 shadow-lg ${
                    switchClosed
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <Power className="w-4 h-4" />
                  <span>{switchClosed ? t('elecOpenSwitchButton') : t('elecCloseSwitchButton')}</span>
                </button>

                <button
                  onClick={() => { setBatteryFlipped(!batteryFlipped); playBeep(600, 0.1); }}
                  className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-slate-700 transition-all cursor-pointer flex items-center gap-2"
                >
                  <ArrowLeftRight className="w-4 h-4 text-amber-400" />
                  <span>عكس أقطاب البطارية (+ / -)</span>
                </button>

                {activeLoad === 'diode' && (
                  <button
                    onClick={() => { setDiodeFlipped(!diodeFlipped); playBeep(750, 0.1); }}
                    className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs border border-amber-400 transition-all cursor-pointer flex items-center gap-2 shadow-md"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>عكس اتجاه الصمام الثنائي 🔀</span>
                  </button>
                )}
              </div>
            </div>

            {/* Educational Diode Polarity Guide Banner (Specific for Diode Experiment) */}
            {activeTab === 'diode_exp' && (
              <div className="bg-amber-950/60 border border-amber-800/80 rounded-2xl p-4 text-xs space-y-2 text-amber-200 font-sans leading-relaxed">
                <div className="flex items-center gap-2 font-extrabold text-amber-300 text-sm">
                  <Zap className="w-4 h-4" />
                  <span>قاعدة الصمام الثنائي الضوئي الذهبية (Règle de la Diode):</span>
                </div>
                <p className="text-slate-200">
                  الصمام الثنائي هو صمام يسمح بمرور التيار الكهربائي في <strong className="text-amber-300 underline">اتجاه واحد فقط</strong> (من المصعد Anode إلى المهبط Cathode).
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-bold">
                  <div className="bg-emerald-950/80 p-2.5 rounded-xl border border-emerald-700/60 text-emerald-300">
                    ✅ الانحياز الأمامي (Sens direct): المصعد (+) مع قطب البطارية الموجب (+) ➔ <span className="underline">يمر التيار ويضيء</span>.
                  </div>
                  <div className="bg-rose-950/80 p-2.5 rounded-xl border border-rose-700/60 text-rose-300">
                    ❌ الانحياز العكسي (Sens inverse): المصعد (+) مع القطب السالب (-) ➔ <span className="underline">يحجب التيار كلياً</span>.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel: Controls & Options Side Selector */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Component Selector for Workbench */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
              <h3 className="font-extrabold text-sm text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2">
                <Power className="w-4 h-4 text-amber-400" />
                <span>اختر العنصر الكهربائي في الدارة:</span>
              </h3>

              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => { setActiveLoad('diode'); setActiveTab('diode_exp'); }}
                  className={`p-3 rounded-2xl text-xs font-bold transition-all text-right flex items-center justify-between cursor-pointer border ${
                    activeLoad === 'diode'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">🔺</span>
                    <span>الصمام الثنائي الضوئي (Diode LED)</span>
                  </div>
                  {showFrench && <span className="text-[10px] opacity-75 font-mono">Diode</span>}
                </button>

                <button
                  onClick={() => { setActiveLoad('bulb'); }}
                  className={`p-3 rounded-2xl text-xs font-bold transition-all text-right flex items-center justify-between cursor-pointer border ${
                    activeLoad === 'bulb'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">💡</span>
                    <span>المصباح الكهربائي</span>
                  </div>
                  {showFrench && <span className="text-[10px] opacity-75 font-mono">Lampe</span>}
                </button>

                <button
                  onClick={() => { setActiveLoad('motor'); setActiveTab('sandbox'); }}
                  className={`p-3 rounded-2xl text-xs font-bold transition-all text-right flex items-center justify-between cursor-pointer border ${
                    activeLoad === 'motor'
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">⚙️</span>
                    <span>المحرك الكهربائي</span>
                  </div>
                  {showFrench && <span className="text-[10px] opacity-75 font-mono">Moteur</span>}
                </button>

                <button
                  onClick={() => { setActiveLoad('buzzer'); setActiveTab('sandbox'); }}
                  className={`p-3 rounded-2xl text-xs font-bold transition-all text-right flex items-center justify-between cursor-pointer border ${
                    activeLoad === 'buzzer'
                      ? 'bg-purple-500 text-slate-950 border-purple-400 font-black'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">🔔</span>
                    <span>الجرس / المنبه الكهربائي</span>
                  </div>
                  {showFrench && <span className="text-[10px] opacity-75 font-mono">Vibreur</span>}
                </button>

                <button
                  onClick={() => { setActiveLoad('material'); setActiveTab('conductors_exp'); }}
                  className={`p-3 rounded-2xl text-xs font-bold transition-all text-right flex items-center justify-between cursor-pointer border ${
                    activeLoad === 'material'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">🧪</span>
                    <span>كاشف النواقل والعوازل</span>
                  </div>
                  {showFrench && <span className="text-[10px] opacity-75 font-mono">Testeur</span>}
                </button>

                <button
                  onClick={() => { setActiveLoad('resistor'); setActiveTab('sandbox'); }}
                  className={`p-3 rounded-2xl text-xs font-bold transition-all text-right flex items-center justify-between cursor-pointer border ${
                    activeLoad === 'resistor'
                      ? 'bg-orange-500 text-slate-950 border-orange-400 font-black'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">🟤</span>
                    <span>المقاومة الكهربائية</span>
                  </div>
                  {showFrench && <span className="text-[10px] opacity-75 font-mono">Résistance</span>}
                </button>
              </div>
            </div>

            {/* Resistor Value Selector if activeLoad === 'resistor' */}
            {activeLoad === 'resistor' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
                <h3 className="font-extrabold text-xs text-orange-300 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span>اختر قيمة المقاومة (كلما زادت المقاومة، قلّ التيار):</span>
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {([10, 100, 1000] as const).map((val) => (
                    <button
                      key={val}
                      onClick={() => setResistorValue(val)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        resistorValue === val
                          ? 'bg-orange-500 text-slate-950 border-orange-400 font-black'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {val} Ω
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Material Tester Specific Controls if activeLoad === 'material' */}
            {activeLoad === 'material' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
                <h3 className="font-extrabold text-xs text-cyan-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>اختر الجسم المراد اختباره بين السلكين:</span>
                </h3>

                <div className="grid grid-cols-1 gap-2">
                  {MATERIALS_LIST.map((mat) => (
                    <button
                      key={mat.id}
                      onClick={() => setSelectedMaterial(mat.id)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                        selectedMaterial === mat.id
                          ? 'bg-cyan-500 text-slate-950 border-cyan-300 font-black shadow-md'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img src={MATERIAL_ART[mat.id]} alt="" className="electric-material-thumbnail" aria-hidden="true" />
                        <span>{mat.nameAr}</span>
                      </div>

                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                        mat.isConductor ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      }`}>
                        {mat.isConductor ? 'ناقل (Conducteur)' : 'عازل (Isolant)'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Voltage Level Selection */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-2">
              <span className="text-xs font-bold text-slate-300 block">دلالة المولد (قوة البطارية):</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setBatteryVoltage(4.5)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    batteryVoltage === 4.5
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                      : 'bg-slate-950 text-slate-300 border-slate-800'
                  }`}
                >
                  بطارية مسطحة 4.5V
                </button>

                <button
                  onClick={() => setBatteryVoltage(9.0)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    batteryVoltage === 9.0
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                      : 'bg-slate-950 text-slate-300 border-slate-800'
                  }`}
                >
                  بطارية قوية 9.0V
                </button>
              </div>
            </div>

            {/* Visual Multimeter Widget — data-lab-instrument: this panel is deliberately dark
                (looks like a real multimeter), so it must opt out of .lab-interior's "force dark
                panels to white" override — otherwise the bg goes white but the light-on-dark text
                colors below (text-slate-300, text-emerald-400, text-cyan-400...) stay as designed,
                pairing light text on a light background. */}
            <div data-lab-instrument className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>مقياس متعدد (Multimètre):</span>
              </span>
              <div className="bg-slate-950 rounded-2xl border border-emerald-800/60 p-3 grid grid-cols-3 gap-2 font-mono">
                <div className="text-center">
                  <div className="text-[9px] text-slate-300 font-sans font-bold">التوتر (V)</div>
                  <div className="text-emerald-400 text-sm sm:text-base font-black" dir="ltr">{multimeterReading.voltage.toFixed(1)}</div>
                </div>
                <div className="text-center border-x border-slate-800">
                  <div className="text-[9px] text-slate-300 font-sans font-bold">التيار (mA)</div>
                  <div className={`text-sm sm:text-base font-black ${currentStatus.isCurrentFlowing ? 'text-amber-400' : 'text-slate-500'}`} dir="ltr">
                    {multimeterReading.currentMa.toFixed(0)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[9px] text-slate-300 font-sans font-bold">المقاومة (Ω)</div>
                  <div className="text-cyan-400 text-[11px] sm:text-xs font-black" dir="ltr">{multimeterReading.resistanceLabel}</div>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                📌 قراءة مبسّطة توضيحية: كلما زادت المقاومة، قلّت شدة التيار المار في الدارة.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* EXPERIMENT 3: SERIES VS PARALLEL CIRCUIT (الربط على التسلسل وعلى التفرع) */}
      {activeTab === 'series_parallel' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
            <div>
              <h3 className="font-extrabold text-base text-amber-300 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                <span>مقارنة الربط على التسلسل والربط على التفرع (Montage en Série vs Parallèle)</span>
              </h3>
              <p className="text-xs text-slate-300">
                شاهد الفرق في إضاءة المصباحين وماذا يحدث عند فك أو تلف أحد المصباحين!
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCircuitType('series')}
                className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  circuitType === 'series'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                    : 'bg-slate-950 text-slate-300 border-slate-800'
                }`}
              >
                1. الربط على التسلسل (En Série)
              </button>

              <button
                onClick={() => setCircuitType('parallel')}
                className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  circuitType === 'parallel'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black'
                    : 'bg-slate-950 text-slate-300 border-slate-800'
                }`}
              >
                2. الربط على التفرع (En Parallèle)
              </button>
            </div>
          </div>

          {/* Interactive Visual Canvas for Series/Parallel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            
            {/* Visual Canvas */}
            <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 flex flex-col items-center justify-center min-h-[260px] relative">
              <div className="flex w-full justify-center"><ElectricDeviceArt kind="bulb" powered={bulb1Lit} /><ElectricDeviceArt kind="bulb" powered={bulb2Lit} /></div>
              <svg className="w-full h-56" viewBox="0 0 400 240">
                {/* Wires — left vertical gapped at the switch */}
                {circuitType === 'series' ? (
                  <g>
                    <path
                      d="M 100 180 L 40 180 L 40 130"
                      fill="none"
                      stroke={(bulb1Lit && bulb2Lit) ? '#eab308' : '#475569'}
                      strokeWidth="4"
                    />
                    <path
                      d="M 40 90 L 40 60 L 360 60 L 360 180 L 300 180"
                      fill="none"
                      stroke={(bulb1Lit && bulb2Lit) ? '#eab308' : '#475569'}
                      strokeWidth="4"
                    />
                  </g>
                ) : (
                  <g>
                    <path d="M 100 190 L 40 190 L 40 130" fill="none" stroke={switchClosed ? '#eab308' : '#475569'} strokeWidth="4" />
                    <path d="M 40 90 L 40 50 L 360 50 L 360 190 L 300 190" fill="none" stroke={switchClosed ? '#eab308' : '#475569'} strokeWidth="4" />
                    <line x1="120" y1="50" x2="120" y2="120" stroke={bulb1Lit ? '#eab308' : '#475569'} strokeWidth="3" />
                    <line x1="280" y1="50" x2="280" y2="120" stroke={bulb2Lit ? '#eab308' : '#475569'} strokeWidth="3" />
                    <line x1="120" y1="120" x2="280" y2="120" stroke={(bulb1Lit || bulb2Lit) ? '#eab308' : '#475569'} strokeWidth="3" />
                  </g>
                )}

                {/* Switch on the left vertical wire */}
                <g
                  transform="translate(40, 110)"
                  className="cursor-pointer"
                  onPointerUp={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleToggleSwitch();
                  }}
                >
                  <rect x="-28" y="-32" width="56" height="64" rx="10" fill="transparent" />
                  <circle cx="0" cy="-20" r="6" fill="#fbbf24" />
                  <circle cx="0" cy="20" r="6" fill="#fbbf24" />
                  {switchClosed ? (
                    <line x1="0" y1="-20" x2="0" y2="20" stroke="#10b981" strokeWidth="5" strokeLinecap="round" />
                  ) : (
                    <line x1="0" y1="-20" x2="-22" y2="8" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" />
                  )}
                </g>

                {/* Battery at Bottom */}
                <rect x="100" y="165" width="200" height="35" rx="8" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
                <text x="200" y="187" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">مولد 4.5V</text>

                {/* Bulb 1 Top Left */}
                <g transform={circuitType === 'series' ? 'translate(140, 60)' : 'translate(200, 50)'}>
                  <circle
                    data-elec-bulb="1"
                    data-elec-lit={bulb1Lit ? 'on' : 'off'}
                    cx="0"
                    cy="0"
                    r="22"
                    fill={bulb1Lit ? '#fef08a' : '#334155'}
                    stroke="#64748b"
                    strokeWidth="2"
                  />
                  <text x="0" y="5" fontSize={bulb1Broken || bulb1Lit ? 14 : 9} textAnchor="middle" fill={bulb1Lit ? undefined : '#cbd5e1'}>
                    {bulb1Broken ? '❌' : bulb1Lit ? '💡' : 'طافئ'}
                  </text>
                  <text x="0" y="-30" fill="#f8fafc" fontSize="10" fontWeight="bold" textAnchor="middle">مصباح 1</text>
                </g>

                {/* Bulb 2 Top Right / Parallel */}
                <g transform={circuitType === 'series' ? 'translate(260, 60)' : 'translate(200, 120)'}>
                  <circle
                    data-elec-bulb="2"
                    data-elec-lit={bulb2Lit ? 'on' : 'off'}
                    cx="0"
                    cy="0"
                    r="22"
                    fill={bulb2Lit ? '#fef08a' : '#334155'}
                    stroke="#64748b"
                    strokeWidth="2"
                  />
                  <text x="0" y="5" fontSize={bulb2Broken || bulb2Lit ? 14 : 9} textAnchor="middle" fill={bulb2Lit ? undefined : '#cbd5e1'}>
                    {bulb2Broken ? '❌' : bulb2Lit ? '💡' : 'طافئ'}
                  </text>
                  <text x="0" y="-30" fill="#f8fafc" fontSize="10" fontWeight="bold" textAnchor="middle">مصباح 2</text>
                </g>
              </svg>

              {/* Status Banner — reflects the live experiment, not only the rule */}
              <div className="text-xs text-center font-bold text-amber-300 mt-2 space-y-1">
                {!switchClosed ? (
                  <span>القاطعة مفتوحة: انقطعت الحلقة فانطفأ المصباحان. أغلق القاطعة ليعود التيار.</span>
                ) : circuitType === 'series' ? (
                  <span>
                    {bulb1Broken || bulb2Broken
                      ? 'دارة مفتوحة: المصباح التالف قطع الحلقة، فانطفأ المصباح الآخر أيضاً!'
                      : 'الربط على التسلسل: شدة الإضاءة خافتة، وإذا تلف أحد المصباحين ينطفئ الآخر فوراً!'}
                  </span>
                ) : (
                  <span>
                    {(bulb1Broken || bulb2Broken) && (bulb1Lit || bulb2Lit)
                      ? 'المصباح التالف انطفأ، والمصباح الآخر ما زال مشتعلاً — فرعان مستقلان!'
                      : 'الربط على التفرع: شدة الإضاءة قوية، وإذا تلف أحد المصباحين يظل المصباح الثاني مشتعلاً!'}
                  </span>
                )}
              </div>
            </div>

            {/* Controls for Bulbs */}
            <div className="space-y-4">
              <button
                type="button"
                data-elec-switch-series
                onClick={handleToggleSwitch}
                className={`hit-target w-full px-4 rounded-2xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg ${
                  switchClosed ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                }`}
              >
                <Power className="w-4 h-4" />
                <span>{switchClosed ? t('elecOpenSwitchButton') : t('elecCloseSwitchButton')}</span>
              </button>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-300 block">اختبار تفكيك وتلف المصباحين:</span>
                
                <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-slate-200">المصباح الأول (💡):</span>
                  <button
                    onClick={() => setBulb1Broken(!bulb1Broken)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                      bulb1Broken
                        ? 'bg-rose-500 text-slate-950 font-black'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {bulb1Broken ? 'تالف / مفكوك ❌' : 'سليم ✅'}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-slate-200">المصباح الثاني (💡):</span>
                  <button
                    onClick={() => setBulb2Broken(!bulb2Broken)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                      bulb2Broken
                        ? 'bg-rose-500 text-slate-950 font-black'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {bulb2Broken ? 'تالف / مفكوك ❌' : 'سليم ✅'}
                  </button>
                </div>

                <button
                  onClick={() => { setBulb1Broken(false); setBulb2Broken(false); }}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold rounded-xl border border-slate-700 cursor-pointer"
                >
                  إعادة تركيب المصباحين بحالة سليمة 🔄
                </button>
              </div>

              {/* Explanatory Rule Box */}
              <div className="bg-emerald-950/60 border border-emerald-800 p-4 rounded-2xl text-xs text-emerald-200 space-y-2 leading-relaxed">
                <span className="font-black text-emerald-300 block">📌 النتيجة المنهجية للدرس:</span>
                <p>
                  • <strong>في الربط على التسلسل:</strong> توجد حلقة واحدة للتيار، تتوزع الطاقة بين المصباحين فتكون الإضاءة خافتة، وتلف أحد المصباحين يفتح الدارة بأكملها.
                </p>
                <p>
                  • <strong>في الربط على التفرع:</strong> توجد عدة حلقات مستقلة، تظل الإضاءة قوية ويعمل كل مصباح بشكل مستقل (وهو الربط المستعمل في المنازل).
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* QUIZ MODE / CHALLENGE (التحدي والاختبار) */}
      {activeTab === 'quiz' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
            <div>
              <h3 className="font-extrabold text-base text-rose-300 flex items-center gap-2">
                <Award className="w-5 h-5 text-rose-400" />
                <span>تحدي الكهربائي الصغير (أسئلة الدارات والصمام الثنائي)</span>
              </h3>
              <p className="text-xs text-slate-300">
                أجب عن الأسئلة الخمسة واكسب نقاط التميز في التربية العلمية!
              </p>
            </div>

            {quizSubmitted && (
              <div className="bg-amber-500 text-slate-950 font-black px-4 py-1.5 rounded-full text-xs shadow-md">
                النتيجة: {quizScore} / 100 XP
              </div>
            )}
          </div>

          <div className="space-y-5">
            {quizQuestions.map((q, qIdx) => {
              const selectedOpt = userAnswers[qIdx];
              return (
                <div key={q.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm font-extrabold text-slate-100">
                    <span className="w-6 h-6 rounded-lg bg-rose-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {qIdx + 1}
                    </span>
                    <span>{q.qAr}</span>
                  </div>

                  {showFrench && <p className="text-xs text-slate-300 dir-ltr font-mono" dir="ltr">{q.qFr}</p>}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedOpt === optIdx;
                      let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800';

                      if (quizSubmitted) {
                        if (optIdx === q.correctIdx) {
                          btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold';
                        } else if (isSelected && optIdx !== q.correctIdx) {
                          btnStyle = 'bg-rose-950 border-rose-500 text-rose-300';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-amber-500 text-slate-950 font-black border-amber-400';
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleQuizOptionSelect(qIdx, optIdx)}
                          className={`text-right p-3 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && optIdx === q.correctIdx && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="text-[11px] text-slate-300 bg-slate-900 p-3 rounded-xl border border-slate-800 leading-relaxed font-sans">
                      💡 {q.expAr}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            {!quizSubmitted ? (
              <button
                onClick={handleCalculateScore}
                disabled={Object.keys(userAnswers).length === 0}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-xs px-6 py-3 rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>تصحيح الإجابات وحساب النتيجة النهائيّة</span>
              </button>
            ) : (
              <button
                onClick={() => { setQuizSubmitted(false); setUserAnswers({}); setQuizScore(0); }}
                className="bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs px-5 py-2.5 rounded-xl border border-slate-700 cursor-pointer"
              >
                إعادة المحاولة في التحدي 🔄
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
