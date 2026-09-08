import React, { useState } from 'react';
import { ElectricityLabInteractive } from './ElectricityLabInteractive';
import { MovementLabView } from './lessonViewer/MovementLabView';
import {
  GameplaySimulation,
  CircuitGameplay,
  SafetyRoleplayGameplay,
  MixtureGameplay,
  CircuitCombination,
  ProcessStagesGameplay,
  MatchingLabGameplay
} from '../types';
import {
  Zap,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FlaskConical,
  Flame,
  Filter,
  Magnet,
  Power,
  Gauge,
  Languages,
  Workflow,
  Shuffle
} from 'lucide-react';

interface ScienceLabSimulationProps {
  gameplay: GameplaySimulation;
  grade?: string;
}

export const ScienceLabSimulation: React.FC<ScienceLabSimulationProps> = ({ gameplay, grade = '4AP' }) => {
  // Global state for optional French terminology display
  const [showFrench, setShowFrench] = useState<boolean>(false);

  // 1AP has zero French per the official programme — the movement lab skips the French toggle
  // bar entirely rather than showing an always-empty/irrelevant control to a 6-7 year old.
  if (gameplay.type === 'movement_lab') {
    return <MovementLabView gameplay={gameplay} grade={grade} />;
  }

  return (
    <div className="space-y-4">
      {/* Optional French Language Toggle Control Bar */}
      <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex items-center justify-between flex-wrap gap-2 dir-rtl" dir="rtl">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <Languages className="w-4 h-4 text-cyan-400" />
          <span>لُغَةُ العَرْضِ: <span className="text-emerald-400 font-extrabold">العَرَبِيَّةُ (أَسَاسِيٌّ)</span></span>
        </div>

        <button
          onClick={() => setShowFrench(!showFrench)}
          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 border ${
            showFrench
              ? 'bg-blue-600/30 text-blue-200 border-blue-400/60 shadow-md ring-2 ring-blue-500/30'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-slate-200 hover:bg-slate-700'
          }`}
        >
          <span>🌐 المصطلحات بالفرنسية (Optionnel):</span>
          <span className={`px-2 py-0.5 rounded-md text-[10px] ${showFrench ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-950 text-slate-500'}`}>
            {showFrench ? 'مُظْهَرَة' : 'مُخْفَيَة'}
          </span>
        </button>
      </div>

      {gameplay.type === 'circuit_builder' && (
        <div className="space-y-6">
          <ElectricityLabInteractive />
          <CircuitSimulationView gameplay={gameplay} showFrench={showFrench} />
        </div>
      )}
      {gameplay.type === 'safety_roleplay' && <SafetyRoleplayView gameplay={gameplay} showFrench={showFrench} />}
      {gameplay.type === 'mixtures_lab' && <MixturesLabView gameplay={gameplay} showFrench={showFrench} />}
      {gameplay.type === 'process_stages' && <ProcessStagesView gameplay={gameplay} showFrench={showFrench} />}
      {gameplay.type === 'matching_lab' && <MatchingLabView gameplay={gameplay} showFrench={showFrench} />}
    </div>
  );
};

/* ==========================================
   1. CIRCUITS ÉLECTRIQUES SIMULATION VIEW
   ========================================== */
const CircuitSimulationView: React.FC<{ gameplay: CircuitGameplay; showFrench: boolean }> = ({ gameplay, showFrench }) => {
  const [selectedComboId, setSelectedComboId] = useState<string>(gameplay.combinations[0]?.id || 'successful_circuit');
  const [switchIsClosed, setSwitchIsClosed] = useState<boolean>(true);
  const [middleComponent, setMiddleComponent] = useState<'switch' | 'plastic_ruler' | 'iron_nail' | 'wooden_stick'>('switch');

  const currentCombo: CircuitCombination =
    gameplay.combinations.find((c) => c.id === selectedComboId) || gameplay.combinations[0];

  const isInsulatorInSlot = middleComponent === 'plastic_ruler' || middleComponent === 'wooden_stick';
  const isConductorInSlot = middleComponent === 'iron_nail';

  const isLightOn =
    (middleComponent === 'switch' && switchIsClosed) ||
    isConductorInSlot;

  return (
    <div className="kids-pole rounded-[28px] p-6 space-y-6 dir-rtl" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
            <Zap className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <h2 className="text-lg font-black text-amber-300">{gameplay.titleAr}</h2>
            {showFrench && <p className="text-xs text-slate-300">{gameplay.titleFr}</p>}
          </div>
        </div>
        <span className="bg-amber-400/10 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> مختبر الدارات الحقيقي
        </span>
      </div>

      <p className="text-xs text-slate-300 bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 leading-relaxed">
        💡 <strong className="text-amber-300">طريقة اللعب والتجربة:</strong> اختر المكون المُراد ربطه وسط الدارة (قاطعة، مسطرة بلاستيك، مسمار حديد، خشبة)، واضغط على القاطعة لفتحها أو غلقها لمشاهدة سريان الإلكترونات واشتعال المصباح فوراً!
      </p>

      {/* Preset Fast Selector */}
      <div className="space-y-2">
        <h3 className="text-xs font-extrabold text-slate-300">1. التجارب المنهجية الجاهزة:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {gameplay.combinations.map((combo) => {
            const isSelected = combo.id === selectedComboId;
            return (
              <button
                key={combo.id}
                onClick={() => {
                  setSelectedComboId(combo.id);
                  if (combo.id === 'successful_circuit') {
                    setMiddleComponent('switch');
                    setSwitchIsClosed(true);
                  } else if (combo.id === 'open_circuit') {
                    setMiddleComponent('switch');
                    setSwitchIsClosed(false);
                  } else if (combo.id === 'insulator_circuit') {
                    setMiddleComponent('plastic_ruler');
                  }
                }}
                className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-black border-amber-300 shadow-lg scale-[1.02]'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200'
                }`}
              >
                <div className="text-xs font-bold">{combo.titleAr}</div>
                {showFrench && (
                  <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-slate-900' : 'text-slate-300'}`}>
                    {combo.titleFr}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Component Shelf / Selector */}
      <div className="space-y-2">
        <h3 className="text-xs font-extrabold text-slate-300">2. اختر العنصر الذي تضعه بين سلكي التوصيل:</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => {
              setMiddleComponent('switch');
              setSelectedComboId(switchIsClosed ? 'successful_circuit' : 'open_circuit');
            }}
            className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
              middleComponent === 'switch'
                ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-2 ring-amber-400/50'
                : 'bg-slate-800/90 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold">🔌 قاطعة كهربائية</span>
              <Power className="w-4 h-4 text-amber-400" />
            </div>
            {showFrench && <span className="text-[10px] text-slate-300 mt-1">Interrupteur</span>}
          </button>

          <button
            onClick={() => {
              setMiddleComponent('plastic_ruler');
              setSelectedComboId('insulator_circuit');
            }}
            className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
              middleComponent === 'plastic_ruler'
                ? 'bg-rose-500/20 border-rose-400 text-rose-200 ring-2 ring-rose-400/50'
                : 'bg-slate-800/90 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold">📏 مسطرة بلاستيك</span>
              <span className="text-[10px] bg-rose-500/30 text-rose-300 px-1.5 py-0.5 rounded">عازل</span>
            </div>
            {showFrench && <span className="text-[10px] text-slate-300 mt-1">Règle en Plastique</span>}
          </button>

          <button
            onClick={() => {
              setMiddleComponent('iron_nail');
              setSelectedComboId('successful_circuit');
            }}
            className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
              middleComponent === 'iron_nail'
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400/50'
                : 'bg-slate-800/90 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold">🧷 مسمار حديدي</span>
              <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded">ناقل</span>
            </div>
            {showFrench && <span className="text-[10px] text-slate-300 mt-1">Clou en fer</span>}
          </button>

          <button
            onClick={() => {
              setMiddleComponent('wooden_stick');
              setSelectedComboId('insulator_circuit');
            }}
            className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
              middleComponent === 'wooden_stick'
                ? 'bg-rose-500/20 border-rose-400 text-rose-200 ring-2 ring-rose-400/50'
                : 'bg-slate-800/90 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold">🪵 قطعة خشب</span>
              <span className="text-[10px] bg-rose-500/30 text-rose-300 px-1.5 py-0.5 rounded">عازل</span>
            </div>
            {showFrench && <span className="text-[10px] text-slate-300 mt-1">Morceau de bois</span>}
          </button>
        </div>
      </div>

      {/* Visual Realistic Circuit Workbench Board */}
      <div className="bg-slate-950 rounded-3xl p-6 border-2 border-slate-800 relative overflow-hidden flex flex-col items-center justify-center min-h-[280px]">
        {/* Top status tag */}
        <div className="absolute top-3 right-4 flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-black border ${
            isLightOn
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 animate-pulse'
              : 'bg-rose-500/20 border-rose-500/50 text-rose-300'
          }`}>
            {isLightOn ? '⚡ التيار يمر' : '🚫 لا يمر التيار'}
            {showFrench && (isLightOn ? ' (Circuit Fermé)' : ' (Circuit Ouvert)')}
          </span>
        </div>

        {/* Real Interactive Circuit Graphic — a genuine closed loop (top + bottom wire rails
            connecting all 3 components), not just 3 boxes floating in a row. The wire segments
            above/below each component are flex-1 so they stretch to reach the rails regardless of
            how tall a given component's box happens to be (switch vs. material slot vs. bulb),
            with no manual measurement needed. */}
        <div className="w-full max-w-lg mt-6 flex flex-col items-center">
          <div className="relative w-full h-56 border-4 border-slate-700 rounded-3xl p-4 flex items-stretch justify-between overflow-hidden">

            {/* Top & bottom wire rails — amber and glowing when the circuit is closed, dull grey when open */}
            <div className={`absolute top-4 inset-x-[14%] h-1.5 rounded-full transition-colors duration-500 ${
              isLightOn ? 'bg-amber-400 shadow-[0_0_10px_2px_rgba(251,191,36,0.7)]' : 'bg-slate-700'
            }`} />
            <div className={`absolute bottom-4 inset-x-[14%] h-1.5 rounded-full transition-colors duration-500 ${
              isLightOn ? 'bg-amber-400 shadow-[0_0_10px_2px_rgba(251,191,36,0.7)]' : 'bg-slate-700'
            }`} />

            {isLightOn && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                <div className="w-2 h-2 bg-amber-300 rounded-full shadow-[0_0_8px_#fbbf24] absolute top-3.5 left-1/3 animate-ping" />
                <div className="w-2 h-2 bg-amber-300 rounded-full shadow-[0_0_8px_#fbbf24] absolute bottom-3.5 right-1/3 animate-ping" />
              </div>
            )}

            {/* BATTERY */}
            <div className="relative z-10 flex flex-col items-center flex-1">
              <div className={`w-1 flex-1 rounded-full transition-colors duration-500 ${isLightOn ? 'bg-amber-400' : 'bg-slate-700'}`} />
              <div className="flex flex-col items-center bg-slate-900 border-2 border-amber-500 p-3 rounded-2xl shadow-xl hover:scale-105 transition-transform shrink-0">
                <div className="text-2xl mb-1">🔋</div>
                <div className="text-amber-400 text-xs font-black">مولد (4.5V)</div>
                {showFrench && <div className="text-[9px] text-slate-300">Pile / Générateur</div>}
                <div className="flex gap-2 text-[10px] font-mono mt-1 font-extrabold text-amber-300">
                  <span>(+)</span>
                  <span>(-)</span>
                </div>
              </div>
              <div className={`w-1 flex-1 rounded-full transition-colors duration-500 ${isLightOn ? 'bg-amber-400' : 'bg-slate-700'}`} />
            </div>

            {/* MIDDLE SLOT: SWITCH OR TEST MATERIAL */}
            <div className="relative z-10 flex flex-col items-center flex-1">
              <div className={`w-1 flex-1 rounded-full transition-colors duration-500 ${isLightOn ? 'bg-amber-400' : 'bg-slate-700'}`} />
              {middleComponent === 'switch' ? (
                <button
                  onClick={() => {
                    const nextState = !switchIsClosed;
                    setSwitchIsClosed(nextState);
                    setSelectedComboId(nextState ? 'successful_circuit' : 'open_circuit');
                  }}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-center shadow-xl active:scale-95 ${
                    switchIsClosed
                      ? 'bg-emerald-950 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500'
                      : 'bg-amber-950/80 border-amber-500 text-amber-200 ring-2 ring-amber-500'
                  }`}
                >
                  <div className="text-xs font-black mb-1">
                    {switchIsClosed ? 'قاطعة مغلقة 🔒' : 'قاطعة مفتوحة 🔓'}
                  </div>
                  {showFrench && (
                    <div className="text-[10px] font-mono opacity-80">
                      {switchIsClosed ? 'Interrupteur Fermé' : 'Interrupteur Ouvert'}
                    </div>
                  )}
                  <div className="mt-2 text-[11px] font-bold underline text-amber-300">
                    انقر للـ {switchIsClosed ? 'فتح 🔓' : 'غلق 🔒'}
                  </div>
                </button>
              ) : (
                <div
                  className={`p-4 rounded-2xl border-2 text-center shadow-xl ${
                    isInsulatorInSlot
                      ? 'bg-rose-950 border-rose-500 text-rose-200'
                      : 'bg-emerald-950 border-emerald-500 text-emerald-200'
                  }`}
                >
                  <div className="text-2xl mb-1">
                    {middleComponent === 'plastic_ruler' && '📏'}
                    {middleComponent === 'iron_nail' && '🧷'}
                    {middleComponent === 'wooden_stick' && '🪵'}
                  </div>
                  <div className="text-xs font-black">
                    {middleComponent === 'plastic_ruler' && 'مسطرة بلاستيك'}
                    {middleComponent === 'iron_nail' && 'مسمار حديدي'}
                    {middleComponent === 'wooden_stick' && 'قطعة خشب'}
                  </div>
                  <div className="text-[10px] font-bold mt-1">
                    {isInsulatorInSlot ? '🚫 مادة عازلة' : '⚡ مادة ناقلة'}
                    {showFrench && (isInsulatorInSlot ? ' (Isolant)' : ' (Conducteur)')}
                  </div>
                </div>
              )}
              <div className={`w-1 flex-1 rounded-full transition-colors duration-500 ${isLightOn ? 'bg-amber-400' : 'bg-slate-700'}`} />
            </div>

            {/* LIGHT BULB */}
            <div className="relative z-10 flex flex-col items-center flex-1">
              <div className={`w-1 flex-1 rounded-full transition-colors duration-500 ${isLightOn ? 'bg-amber-400' : 'bg-slate-700'}`} />
              <div
                className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all duration-500 shrink-0 ${
                  isLightOn
                    ? 'bg-amber-400/30 border-amber-400 text-amber-200 shadow-[0_0_35px_rgba(251,191,36,0.8)] scale-110'
                    : 'bg-slate-900 border-slate-700 text-slate-500'
                }`}
              >
              <Lightbulb
                className={`w-10 h-10 ${
                  isLightOn
                    ? 'text-amber-300 fill-amber-300 animate-pulse drop-shadow-[0_0_15px_#f59e0b]'
                    : 'text-slate-600'
                }`}
              />
              <span className="text-xs font-extrabold mt-1">
                {isLightOn ? '💡 المصباح مشتعل !' : '⚪ المصباح مطفأ'}
              </span>
              {showFrench && <span className="text-[9px] text-slate-300">Ampoule</span>}
              </div>
              <div className={`w-1 flex-1 rounded-full transition-colors duration-500 ${isLightOn ? 'bg-amber-400' : 'bg-slate-700'}`} />
            </div>

          </div>
        </div>

        {/* Live Feedback Banner */}
        <div
          className={`w-full mt-6 p-4 rounded-2xl border text-xs leading-relaxed space-y-1 transition-all ${
            isLightOn
              ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
              : 'bg-rose-950/90 border-rose-500 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
          }`}
        >
          <div className="font-black text-sm flex items-center gap-2">
            {isLightOn ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-rose-400" />}
            <span>
              {isLightOn
                ? '🟢 نجاح التركيب: يمر التيار الكهربائي في الدارة المغلقة!'
                : '🔴 انقطاع التيار: الدارة مفتوحة أو تحتوي على مادة عازلة!'}
            </span>
          </div>
          <p className="pt-2 text-xs border-t border-white/10 font-sans">
            <strong>الشرح المنهجي:</strong>{' '}
            {middleComponent === 'switch' && switchIsClosed && 'القاطعة المغلقة تسمح بمرور التيار الكهربائي من البطارية إلى المصباح عبر ناقل سليمة.'}
            {middleComponent === 'switch' && !switchIsClosed && 'القاطعة المفتوحة تقطع مسار التيار فلا يمكنه الوصول للمصباح.'}
            {middleComponent === 'plastic_ruler' && 'البلاستيك مادة عازلة تمنع سريان التيار الكهربائي كلياً.'}
            {middleComponent === 'iron_nail' && 'الحديد مادة ناقلة للكهرباء تسمح بمرور التيار واشتعال المصباح.'}
            {middleComponent === 'wooden_stick' && 'الخشب مادة عازلة للكهرباء تمنع انغلاق الدارة الكهربائية.'}
          </p>
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   2. SÉCURITÉ ÉLECTRIQUE ROLEPLAY VIEW
   ========================================== */
const SafetyRoleplayView: React.FC<{ gameplay: SafetyRoleplayGameplay; showFrench: boolean }> = ({ gameplay, showFrench }) => {
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [disjoncteurOff, setDisjoncteurOff] = useState<boolean>(false);
  const [handsAreDry, setHandsAreDry] = useState<boolean>(false);

  const selectedChoice = gameplay.choices.find((c) => c.id === selectedChoiceId);

  return (
    <div className="kids-pole rounded-[28px] p-6 space-y-6 dir-rtl" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-500/20 text-rose-400 rounded-2xl border border-rose-500/30">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-black text-rose-300">{gameplay.sceneTitleAr}</h2>
            {showFrench && <p className="text-xs text-slate-300">{gameplay.sceneTitleFr}</p>}
          </div>
        </div>
        <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 px-3 py-1 rounded-full text-xs font-bold">
          مفتش السلامة الكهربائية المنزلية
        </span>
      </div>

      {/* Danger Scene Card */}
      <div
        className="p-5 rounded-2xl border border-rose-900/60 space-y-2"
        style={{ backgroundImage: 'linear-gradient(to right, rgba(76, 5, 25, 0.8), #0f172a, #0f172a)' }}
      >
        <div className="flex items-center gap-2 text-rose-400 font-extrabold text-xs">
          <AlertTriangle className="w-4 h-4" />
          <span>الموقف والخطورة المنزلية:</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
          {gameplay.sceneDescriptionAr}
        </p>
        {showFrench && (
          <p className="text-[11px] text-slate-300 font-mono">
            {gameplay.sceneDescriptionFr}
          </p>
        )}
      </div>

      {/* Interactive Safety Panel Tools */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
        <h3 className="text-xs font-extrabold text-slate-300">⚙️ أدوات التحكم بالسلامة الكهربائية:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => setDisjoncteurOff(!disjoncteurOff)}
            className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex items-center justify-between ${
              disjoncteurOff
                ? 'bg-emerald-950 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500'
                : 'bg-rose-950 border-rose-500 text-rose-200'
            }`}
          >
            <div>
              <div className="text-xs font-black">
                القاطع العام: {disjoncteurOff ? 'مقطوع 🛑 (OFF)' : 'موصول ⚡ (ON)'}
                {showFrench && ' [Disjoncteur]'}
              </div>
              <div className="text-[10px] text-slate-300 mt-0.5">انقر لقطع التيار عن كامل المنزل</div>
            </div>
            <Power className={`w-6 h-6 ${disjoncteurOff ? 'text-emerald-400' : 'text-rose-400'}`} />
          </button>

          <button
            onClick={() => setHandsAreDry(!handsAreDry)}
            className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex items-center justify-between ${
              handsAreDry
                ? 'bg-emerald-950 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500'
                : 'bg-amber-950 border-amber-500 text-amber-200'
            }`}
          >
            <div>
              <div className="text-xs font-black">
                حالة اليدين: {handsAreDry ? 'جافتان تماماً 🤲' : 'مبلولتان بالماء 💧'}
                {showFrench && (handsAreDry ? ' (Sèches)' : ' (Mouillées)')}
              </div>
              <div className="text-[10px] text-slate-300 mt-0.5">انقر لتجفيف اليدين بالمنشفة</div>
            </div>
            <span className="text-xl">{handsAreDry ? '🤲' : '💧'}</span>
          </button>
        </div>
      </div>

      {/* 3 Choices Selection */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold text-slate-300">اختر التصرف الذي ستنصح به الأم:</h3>
        <div className="grid grid-cols-1 gap-3">
          {gameplay.choices.map((choice) => {
            const isSelected = selectedChoiceId === choice.id;
            return (
              <button
                key={choice.id}
                onClick={() => setSelectedChoiceId(choice.id)}
                className={`p-4 rounded-2xl border text-right transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  isSelected
                    ? choice.isSafe
                      ? 'bg-emerald-950 border-emerald-400 text-emerald-100 ring-2 ring-emerald-500'
                      : 'bg-rose-950 border-rose-400 text-rose-100 ring-2 ring-rose-500'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200'
                }`}
              >
                <div className="space-y-1">
                  <div className="text-xs font-extrabold">{choice.textAr}</div>
                  {showFrench && <div className="text-[11px] text-slate-300">{choice.textFr}</div>}
                </div>
                {isSelected && (
                  <span className="shrink-0 p-1.5 rounded-full bg-white/10">
                    {choice.isSafe ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-rose-400" />}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Immediate Result Card */}
      {selectedChoice && (
        <div
          className={`p-5 rounded-2xl border leading-relaxed space-y-2 transition-all ${
            selectedChoice.isSafe || (disjoncteurOff && handsAreDry)
              ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
              : 'bg-rose-950/90 border-rose-500 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.2)]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-black">{selectedChoice.statusLabelAr}</span>
            {showFrench && <span className="text-xs font-mono font-bold">{selectedChoice.statusLabelFr}</span>}
          </div>
          <p className="text-xs border-t border-white/10 pt-2 font-sans">
            <strong>النتيجة والتفسير:</strong> {selectedChoice.resultMessageAr}
          </p>
        </div>
      )}
    </div>
  );
};


/* ==========================================
   4. LA MATIÈRE ET LES MÉLANGES VIEW
   ========================================== */
const MixturesLabView: React.FC<{ gameplay: MixtureGameplay; showFrench: boolean }> = ({ gameplay, showFrench }) => {
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState<number>(0);
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [isSeparating, setIsSeparating] = useState<boolean>(false);

  const recipe = gameplay.mixtures[selectedRecipeIndex] || gameplay.mixtures[0];
  const selectedMethod = recipe.availableMethods.find((m) => m.id === selectedMethodId);

  return (
    <div className="kids-pole rounded-[28px] p-6 space-y-6 dir-rtl" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-2xl border border-cyan-500/30">
            <FlaskConical className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-black text-cyan-300">{gameplay.titleAr}</h2>
            {showFrench && <p className="text-xs text-slate-300">{gameplay.titleFr}</p>}
          </div>
        </div>
        <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> مخبر الكيمياء التفاعلي
        </span>
      </div>

      {/* Recipe / Mixture Selector */}
      <div className="space-y-2">
        <h3 className="text-xs font-extrabold text-slate-300">1. اختر المخلوط المحضّر في البيشر:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {gameplay.mixtures.map((mix, idx) => {
            const isSelected = idx === selectedRecipeIndex;
            return (
              <button
                key={mix.id}
                onClick={() => {
                  setSelectedRecipeIndex(idx);
                  setSelectedMethodId(null);
                  setIsSeparating(false);
                }}
                className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 font-black border-cyan-300 shadow-lg scale-[1.02]'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200'
                }`}
              >
                <div className="text-xs font-extrabold">
                  🧪 {mix.ingredient1Ar} + {mix.ingredient2Ar}
                </div>
                <div className="text-[10px] mt-1 opacity-90">{mix.mixtureTypeAr}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Beaker Simulation View */}
      <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden">
        <div className="text-xs font-bold text-cyan-300 mb-2">
          المخلوط الحالي: {recipe.mixtureTypeAr}
          {showFrench && ` (${recipe.mixtureTypeFr})`}
        </div>

        {/* Visual Flask / Beaker Graphic */}
        <div className="relative w-32 h-36 bg-slate-900/80 border-4 border-slate-600 rounded-b-3xl border-t-0 p-2 flex flex-col justify-end items-center shadow-2xl">
          <div
            className={`w-full rounded-b-2xl transition-all duration-700 flex items-center justify-center relative ${
              recipe.id === 'mix_water_sand'
                ? 'h-24 bg-amber-900/60 border-t-2 border-amber-600'
                : 'h-24 bg-cyan-600/40 border-t-2 border-cyan-400'
            }`}
          >
            {recipe.id === 'mix_water_sand' && (
              <span className="text-[10px] text-amber-200 font-bold animate-pulse">رمل مترسب + ماء عكر</span>
            )}
            {recipe.id === 'mix_water_salt' && (
              <span className="text-[10px] text-cyan-200 font-bold animate-pulse">محلول ملحي شفاف</span>
            )}

            {isSeparating && selectedMethod?.id === 'evaporation' && (
              <div className="absolute -top-10 flex gap-2 text-slate-300 animate-bounce">
                <Flame className="w-5 h-5 text-amber-400" />
                <span className="text-[10px] font-bold text-amber-300">بخار الماء ينطلق ♨️</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3 Separation Method Choices */}
      <div className="space-y-2">
        <h3 className="text-xs font-extrabold text-slate-300">2. اختر طريقة الفصل واشرع في العملية:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {recipe.availableMethods.map((method) => {
            const isSelected = method.id === selectedMethodId;
            return (
              <button
                key={method.id}
                onClick={() => {
                  setSelectedMethodId(method.id);
                  setIsSeparating(true);
                }}
                className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${
                  isSelected
                    ? method.isCorrect
                      ? 'bg-emerald-500 text-slate-950 font-black border-emerald-300 shadow-lg scale-[1.02]'
                      : 'bg-rose-500 text-slate-950 font-black border-rose-300 shadow-lg scale-[1.02]'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200'
                }`}
              >
                <div className="text-xs font-bold flex items-center gap-1.5">
                  {method.id === 'filtration' && <Filter className="w-4 h-4 text-cyan-300" />}
                  {method.id === 'evaporation' && <Flame className="w-4 h-4 text-amber-400" />}
                  {method.id === 'magnet' && <Magnet className="w-4 h-4 text-rose-400" />}
                  <span>{method.nameAr}</span>
                </div>
                {showFrench && <div className="text-[10px] mt-0.5 opacity-90">{method.nameFr}</div>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Result & Animation Display */}
      {selectedMethod && (
        <div
          className={`p-5 rounded-2xl border leading-relaxed space-y-2 transition-all ${
            selectedMethod.isCorrect
              ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
              : 'bg-rose-950/90 border-rose-500 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.2)]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-black">{selectedMethod.resultTitleAr}</span>
            {showFrench && <span className="text-xs font-mono font-bold">{selectedMethod.resultTitleFr}</span>}
          </div>
          <p className="text-xs border-t border-white/10 pt-2 font-sans">
            <strong>الشرح العلمي والنتيجة المخبرية:</strong> {selectedMethod.explanationAr}
          </p>
        </div>
      )}
    </div>
  );
};

/* ==========================================
   5. PROCESS STAGES VIEW (cycles/processes: respiration, circulation,
      plant/animal reproduction, water cycle...)
   ========================================== */
const ProcessStagesView: React.FC<{ gameplay: ProcessStagesGameplay; showFrench: boolean }> = ({ gameplay, showFrench }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const stage = gameplay.stages[activeIdx];

  return (
    <div className="kids-pole rounded-[28px] p-6 space-y-6 dir-rtl" dir="rtl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-500/20 text-teal-400 rounded-2xl border border-teal-500/30">
            <Workflow className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-teal-300">{gameplay.titleAr}</h2>
            {showFrench && gameplay.titleFr && <p className="text-xs text-slate-300">{gameplay.titleFr}</p>}
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-300 bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 leading-relaxed">
        {gameplay.instructionsAr}
        {showFrench && gameplay.instructionsFr && <span className="block text-slate-500 mt-1">{gameplay.instructionsFr}</span>}
      </p>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {gameplay.stages.map((s, idx) => (
          <button
            key={s.step}
            onClick={() => setActiveIdx(idx)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer shrink-0 border flex items-center gap-2 ${
              activeIdx === idx
                ? 'bg-teal-500 text-slate-950 border-teal-300 shadow-md scale-[1.02]'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <span>{s.icon}</span>
            <span>{s.step}. {s.titleAr}</span>
          </button>
        ))}
      </div>

      <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
          <span className="text-4xl p-3 bg-teal-950 rounded-2xl border border-teal-800">{stage.icon}</span>
          <h3 className="text-lg font-black text-teal-300">{stage.titleAr}</h3>
        </div>
        <p className="text-sm font-bold text-slate-200 leading-relaxed bg-slate-900 p-4 rounded-2xl border border-slate-800">
          {stage.descAr}
        </p>
      </div>
    </div>
  );
};

/* ==========================================
   6. MATCHING LAB VIEW (nutrition, adaptation, air properties...)
   ========================================== */
const MatchingLabView: React.FC<{ gameplay: MatchingLabGameplay; showFrench: boolean }> = ({ gameplay, showFrench }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const pair = gameplay.pairs[activeIdx];

  return (
    <div className="kids-pole rounded-[28px] p-6 space-y-6 dir-rtl" dir="rtl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-2xl border border-cyan-500/30">
            <Shuffle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-cyan-300">{gameplay.titleAr}</h2>
            {showFrench && gameplay.titleFr && <p className="text-xs text-slate-300">{gameplay.titleFr}</p>}
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-300 bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 leading-relaxed">
        {gameplay.instructionsAr}
        {showFrench && gameplay.instructionsFr && <span className="block text-slate-500 mt-1">{gameplay.instructionsFr}</span>}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          {gameplay.pairs.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`w-full p-4 rounded-2xl border text-right transition-all cursor-pointer ${
                activeIdx === idx
                  ? 'bg-cyan-500 text-slate-950 font-black border-cyan-300 shadow-xl scale-[1.01]'
                  : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700 text-sm font-bold'
              }`}
            >
              {p.leftAr}
            </button>
          ))}
        </div>
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-black text-cyan-300">{pair.leftAr}</h3>
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-full text-xs font-bold">
              {pair.rightAr}
            </span>
          </div>
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>التفسير:</span>
            </div>
            <p className="text-sm font-bold text-slate-200 leading-relaxed">{pair.explanationAr}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

