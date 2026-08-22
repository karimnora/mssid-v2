/**
 * ToolsHubView.tsx
 * ─ Mobile (< md) : navigation 3 vues  Hub → Liste → retour
 * ─ Desktop (≥ md): affichage original dense — INCHANGÉ
 */
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SubjectInfo, SubjectId, PrimaryGrade } from '../types';
import { isToolAvailableForGrade } from '../data/subjectsData';
import {
  Calculator,
  BookOpen,
  FlaskConical,
  Sparkles,
  Languages,
  Globe,
  Zap,
  Compass,
  Grid,
  Store,
  MapPin,
  Shield,
  Layers,
  PenTool,
  Award,
  Trophy,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Search,
} from 'lucide-react';

// ─── Icon map (commun aux deux layouts) ──────────────────────────────────────
const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Calculator, BookOpen, FlaskConical, Sparkles, Languages, Globe, Zap,
  Compass, Grid, Store, MapPin, Shield, Layers, PenTool, Award, Trophy,
};

// ─── Données Mobile — tuiles de navigation ───────────────────────────────────
interface MobileCat {
  key: string;
  emoji: string;
  labelAr: string;
  hintAr: string;
  gradient: string;
  toolIds: SubjectId[];
}

const MOBILE_CATS: MobileCat[] = [
  {
    key: 'identity_civics',
    emoji: '🇩🇿',
    labelAr: 'الهوية والتراث',
    hintAr: 'ولايات • تاريخ • خرائط',
    gradient: 'from-green-500 to-emerald-700',
    toolIds: ['wilayas_map', 'history_museum', 'algerian_market', 'topography_map'] as SubjectId[],
  },
  {
    key: 'math_logic',
    emoji: '📐',
    labelAr: 'الرياضيات والحساب',
    hintAr: 'عمليات • هندسة • أعداد',
    gradient: 'from-sky-500 to-blue-700',
    toolIds: ['primary_math_ops', 'soroban', 'multiplication', 'educational_calculator', 'converter', 'geometry', 'fractions_lab', 'area_grid', 'clock_trainer'] as SubjectId[],
  },
  {
    key: 'science_discovery',
    emoji: '🧪',
    labelAr: 'العلوم والإيقاظ',
    hintAr: 'تجارب • جسم الإنسان • أرض',
    gradient: 'from-cyan-500 to-teal-700',
    toolIds: ['science_lab', 'electricity', 'primary_discovery', 'human_anatomy', 'earth_cycles'] as SubjectId[],
  },
  {
    key: 'languages_expression',
    emoji: '🗣️',
    labelAr: 'اللغات والتعبير',
    hintAr: 'عربي • فرنسي • أمازيغية',
    gradient: 'from-violet-500 to-purple-700',
    toolIds: ['french_projects', 'english_audio_dialogues', 'touch_writing', 'arabic_conjugator', 'french_lab', 'english_lab', 'tamazight_lab', 'tamazight_curriculum', 'syllable_studio', 'speed_reading'] as SubjectId[],
  },
];

// ─── Données Desktop — groupes originaux ─────────────────────────────────────
const DESKTOP_GROUPS: {
  key: string;
  labelAr: string;
  badgeColor: string;
  icon: React.FC<{ className?: string }>;
  toolIds: SubjectId[];
}[] = [
  {
    key: 'identity_civics',
    labelAr: '🇩🇿 الهوية، التراث والتقييم الرسمي',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    icon: Shield,
    toolIds: ['wilayas_map', 'history_museum', 'algerian_market', 'topography_map'] as SubjectId[],
  },
  {
    key: 'math_logic',
    labelAr: '📐 الرياضيات، الحساب الذهني والمقادير',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    icon: Calculator,
    toolIds: ['primary_math_ops', 'soroban', 'multiplication', 'educational_calculator', 'converter', 'geometry', 'fractions_lab', 'area_grid', 'clock_trainer'] as SubjectId[],
  },
  {
    key: 'science_discovery',
    labelAr: '🧪 العلوم، التجارب والإيقاظ العلمي',
    badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
    icon: FlaskConical,
    toolIds: ['science_lab', 'electricity', 'primary_discovery', 'human_anatomy', 'earth_cycles'] as SubjectId[],
  },
  {
    key: 'languages_expression',
    labelAr: '🗣️ اللغات، المشاريع، الخط والتصريف',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    icon: Languages,
    toolIds: ['french_projects', 'english_audio_dialogues', 'touch_writing', 'arabic_conjugator', 'french_lab', 'english_lab', 'tamazight_lab', 'tamazight_curriculum', 'syllable_studio', 'speed_reading'] as SubjectId[],
  },
];

interface ToolsHubViewProps {
  grade: PrimaryGrade;
  tools: SubjectInfo[];
  selectedToolId: SubjectId | null;
  onSelectTool: (id: SubjectId) => void;
  onClearTool?: () => void;
}

// ─── Transition mobile ────────────────────────────────────────────────────────
const pageVariants = {
  enter:  { opacity: 0, x: -24, scale: 0.98 },
  center: { opacity: 1, x: 0,   scale: 1    },
  exit:   { opacity: 0, x:  24, scale: 0.98 },
};
const pageTransition = { type: 'spring' as const, stiffness: 300, damping: 28 };

type MobileView = 'hub' | 'list' | 'active';

// ─── Composant principal ──────────────────────────────────────────────────────
export const ToolsHubView: React.FC<ToolsHubViewProps> = ({
  grade, tools, selectedToolId, onSelectTool, onClearTool,
}) => {
  // — état mobile
  const [mobileView, setMobileView]         = useState<MobileView>('hub');
  const [mobileCatKey, setMobileCatKey]     = useState<string>(MOBILE_CATS[0].key);

  // — état desktop (original)
  const [activeFilterCategory, setActiveFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery]                   = useState<string>('');
  const [isGridExpanded, setIsGridExpanded]             = useState<boolean>(true);

  const availableTools = useMemo(
    () => tools.filter(t => isToolAvailableForGrade(t, grade)),
    [tools, grade],
  );
  const currentSelectedTool = useMemo(
    () => tools.find(t => t.id === selectedToolId),
    [tools, selectedToolId],
  );
  const activeMobileCat = MOBILE_CATS.find(c => c.key === mobileCatKey) ?? MOBILE_CATS[0];
  const mobileCatTools  = useMemo(
    () => activeMobileCat.toolIds.map(id => availableTools.find(t => t.id === id)).filter((t): t is SubjectInfo => !!t),
    [activeMobileCat, availableTools],
  );

  const filteredToolsBySearch = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();
    return availableTools.filter(
      t => t.nameAr.toLowerCase().includes(q) || t.nameFr?.toLowerCase().includes(q) || t.description.toLowerCase().includes(q),
    );
  }, [availableTools, searchQuery]);

  // Sur mobile : masquer la section outil quand on est sur hub/list
  useEffect(() => {
    const section = document.getElementById('active-interactive-tool-section');
    if (!section) return;

    const apply = () => {
      if (window.innerWidth < 768) {
        section.style.display = mobileView === 'active' ? '' : 'none';
      } else {
        section.style.display = '';
      }
    };

    apply();
    window.addEventListener('resize', apply);
    return () => {
      window.removeEventListener('resize', apply);
      section.style.display = ''; // rétablir en cas de démontage
    };
  }, [mobileView]);

  // Si l'outil est désélectionné depuis l'extérieur, revenir au hub
  useEffect(() => {
    if (!selectedToolId && mobileView === 'active') {
      setMobileView('hub');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedToolId]);

  const scrollToTool = () => {
    setTimeout(() => {
      document.getElementById('active-interactive-tool-section')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const handleMobileSelect = (id: SubjectId) => {
    onSelectTool(id);
    setMobileView('active');
    scrollToTool();
  };

  const handleDesktopSelect = (id: SubjectId) => {
    onSelectTool(id);
    scrollToTool();
  };

  return (
    <div id="tools-hub-container" dir="rtl" data-labs-layout="full">

      {/* ════════════════════════════════════════════════════════════════
          MOBILE  (block md:hidden)
      ════════════════════════════════════════════════════════════════ */}
      <div className="block md:hidden">
        <AnimatePresence mode="wait">

          {/* Vue 1 — Hub catégories */}
          {mobileView === 'hub' && (
            <motion.div
              key="hub"
              variants={pageVariants} initial="enter" animate="center" exit="exit"
              transition={pageTransition}
              className="space-y-3"
            >
              {/* Header compact */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-lg shadow-md shrink-0">
                  🔬
                </div>
                <div>
                  <h2 className="text-base font-black text-[var(--app-text)]">المختبرات التفاعلية</h2>
                  <p className="text-xs text-[var(--app-text-muted)] mt-0.5">{availableTools.length} أداة — اختر فئة</p>
                </div>
              </div>

              {/* Tuiles catégories */}
              <div className="grid grid-cols-1 gap-3">
                {MOBILE_CATS.map((cat, i) => {
                  const count = cat.toolIds.filter(id => availableTools.find(t => t.id === id)).length;
                  if (count === 0) return null;
                  return (
                    <motion.button
                      key={cat.key}
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07, type: 'spring', stiffness: 260, damping: 22 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => { setMobileCatKey(cat.key); setMobileView('list'); }}
                      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${cat.gradient} px-5 py-4 text-right text-white shadow-md cursor-pointer flex items-center gap-4`}
                    >
                      <div className="absolute inset-0 bg-white/5 rounded-3xl" />
                      <span className="text-3xl drop-shadow-sm shrink-0 relative z-10">{cat.emoji}</span>
                      <div className="flex-1 relative z-10 text-right">
                        <h3 className="text-sm font-black text-white">{cat.labelAr}</h3>
                        <p className="text-xs text-white/70 mt-0.5">{cat.hintAr}</p>
                      </div>
                      <span className="bg-black/20 text-white text-xs font-black px-2.5 py-1 rounded-full relative z-10 shrink-0">
                        {count}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Vue 2 — Liste des outils */}
          {mobileView === 'list' && (
            <motion.div
              key={`list-${mobileCatKey}`}
              variants={pageVariants} initial="enter" animate="center" exit="exit"
              transition={pageTransition}
              className="space-y-4"
            >
              {/* Header avec retour */}
              <div className="flex items-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.93 }}
                  onClick={() => setMobileView('hub')}
                  className="w-9 h-9 rounded-2xl bg-[var(--app-card-subtle)] border border-[var(--app-card-border)] flex items-center justify-center cursor-pointer shrink-0"
                >
                  <ChevronRight className="w-4 h-4 text-[var(--app-text-muted)]" />
                </motion.button>
                <div className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${activeMobileCat.gradient} flex items-center justify-center text-base shadow-sm shrink-0`}>
                  {activeMobileCat.emoji}
                </div>
                <div>
                  <h2 className="text-sm font-black text-[var(--app-text)]">{activeMobileCat.labelAr}</h2>
                  <p className="text-xs text-[var(--app-text-muted)]">{mobileCatTools.length} أدوات متاحة</p>
                </div>
              </div>

              {/* Grille outils */}
              <div className="grid grid-cols-1 gap-3">
                {mobileCatTools.map((tool, idx) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05, type: 'spring', stiffness: 280, damping: 22 }}
                  >
                    <ToolCard
                      tool={tool}
                      isActive={selectedToolId === tool.id}
                      onSelect={() => handleMobileSelect(tool.id)}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Vue 3 — Retour simple (sans répéter le titre, le parent le gère) */}
          {mobileView === 'active' && (
            <motion.div
              key="active"
              variants={pageVariants} initial="enter" animate="center" exit="exit"
              transition={pageTransition}
              className="flex flex-wrap items-center gap-2 pt-1"
            >
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setMobileView('list')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[var(--app-card-subtle)] border border-[var(--app-card-border)] text-[var(--app-text)] font-black text-xs cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
                <span>قائمة {activeMobileCat.labelAr}</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setMobileView('hub')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[var(--app-card-subtle)] border border-[var(--app-card-border)] text-[var(--app-text-muted)] font-black text-xs cursor-pointer"
              >
                🏠 الرئيسية
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          DESKTOP  (hidden md:block) — code original INCHANGÉ
      ════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block space-y-4">

        {/* Top Header & Compact Navigation Banner */}
        <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-4 sm:p-5 shadow-sm space-y-4">

          {/* Title & Quick Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[var(--app-card-border)] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-black shadow-md shrink-0 text-lg">
                ⚡
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-lg font-black text-[var(--app-text)]">
                    المختبرات والأدوات التفاعلية
                  </h2>
                  <span className="bg-amber-500/15 text-amber-700 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-300/50">
                    {availableTools.length} أداة متاحة
                  </span>
                </div>
                <p className="text-xs text-[var(--app-text-muted)] mt-0.5">
                  {currentSelectedTool ? (
                    <span className="inline-flex items-center gap-1.5 flex-wrap">
                      <span>الأداة المفتوحة حالياً:</span>
                      <strong className="text-[var(--app-text)] font-black">{currentSelectedTool.nameAr}</strong>
                    </span>
                  ) : (
                    'استكشف الأدوات التفاعلية والمختبرات الميدانية لتعزيز الفهم والتحصيل'
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
              {currentSelectedTool && (
                <button
                  onClick={scrollToTool}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  انتقل للأداة المفتوحة 👇
                </button>
              )}
              <button
                onClick={() => setIsGridExpanded(!isGridExpanded)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[var(--app-card-subtle)] text-[var(--app-text)] hover:bg-slate-200/60 transition-colors cursor-pointer border border-[var(--app-card-border)]"
              >
                <span>{isGridExpanded ? 'إخفاء الدليل' : 'عرض الدليل الكامل'}</span>
                {isGridExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Search + Category Filter Pills */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => { setActiveFilterCategory('all'); setSearchQuery(''); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activeFilterCategory === 'all' && !searchQuery
                    ? 'bg-amber-600 text-white shadow-sm scale-[1.02]'
                    : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-slate-200/50'
                }`}
              >
                🌟 جميع الأدوات ({availableTools.length})
              </button>

              {DESKTOP_GROUPS.map(group => {
                const count = group.toolIds
                  .map(id => tools.find(t => t.id === id))
                  .filter((t): t is SubjectInfo => !!t && isToolAvailableForGrade(t, grade)).length;
                if (count === 0) return null;
                const isSelected = activeFilterCategory === group.key && !searchQuery;
                return (
                  <button
                    key={group.key}
                    onClick={() => { setActiveFilterCategory(group.key); setSearchQuery(''); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-amber-600 text-white shadow-sm scale-[1.02]'
                        : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-slate-200/50'
                    }`}
                  >
                    <span>{group.labelAr.split(' ')[0]} {group.labelAr.split(' ')[1]}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${isSelected ? 'bg-white/25 text-white' : 'bg-black/5 text-[var(--app-text-muted)]'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="relative min-w-[200px] sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="ابحث عن أداة أو مختبر..."
                className="w-full pl-3 pr-9 py-1.5 text-xs rounded-xl border border-[var(--app-card-border)] bg-[var(--app-card-subtle)] text-[var(--app-text)] focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
              />
              <Search className="w-3.5 h-3.5 text-[var(--app-text-muted)] absolute right-3 top-2.5" />
            </div>
          </div>
        </div>

        {/* Categorized grid */}
        {isGridExpanded && (
          <div className="space-y-6">
            {filteredToolsBySearch !== null ? (
              <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-[var(--app-text)] flex items-center gap-2">
                    <Search className="w-4 h-4 text-amber-600" />
                    <span>نتائج البحث عن: "{searchQuery}" ({filteredToolsBySearch.length})</span>
                  </h3>
                  <button onClick={() => setSearchQuery('')} className="text-xs text-amber-600 font-bold hover:underline cursor-pointer">
                    إلغاء البحث
                  </button>
                </div>
                {filteredToolsBySearch.length === 0 ? (
                  <div className="text-center py-8 text-[var(--app-text-muted)] text-xs">
                    لم يتم العثور على أداة مطابقة لبحثك.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredToolsBySearch.map(tool => (
                      <ToolCard key={tool.id} tool={tool} isActive={selectedToolId === tool.id} onSelect={() => handleDesktopSelect(tool.id)} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              DESKTOP_GROUPS.filter(g => activeFilterCategory === 'all' || g.key === activeFilterCategory).map(group => {
                const groupTools = group.toolIds
                  .map(id => tools.find(t => t.id === id))
                  .filter((t): t is SubjectInfo => !!t && isToolAvailableForGrade(t, grade));
                if (groupTools.length === 0) return null;
                const GroupIcon = group.icon;
                return (
                  <div key={group.key} className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[var(--app-card-border)] pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-700">
                          <GroupIcon className="w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-black text-[var(--app-text)]">{group.labelAr}</h3>
                      </div>
                      <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] border border-[var(--app-card-border)]">
                        {groupTools.length} أدوات
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {groupTools.map(tool => (
                        <ToolCard key={tool.id} tool={tool} isActive={selectedToolId === tool.id} onSelect={() => handleDesktopSelect(tool.id)} />
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

    </div>
  );
};

// ─── Tool Card — design gradient original (commun mobile + desktop) ───────────
interface ToolCardProps {
  tool: SubjectInfo;
  isActive: boolean;
  onSelect: () => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, isActive, onSelect }) => {
  const IconComp = ICON_MAP[tool.icon] || Sparkles;

  return (
    <button
      onClick={onSelect}
      className={`rounded-2xl p-4 text-right text-white shadow-md cursor-pointer bg-gradient-to-br ${tool.color} flex flex-col justify-between gap-3 transition-all relative overflow-hidden group w-full ${
        isActive
          ? 'ring-4 ring-amber-300 ring-offset-2 scale-[1.02] shadow-xl'
          : 'hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]'
      }`}
    >
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all rounded-2xl" />

      <div className="flex items-start justify-between w-full relative z-10">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-xs">
          <IconComp className="w-5 h-5 text-white" />
        </div>
        <div className="flex items-center gap-1.5">
          {tool.minGrade && (
            <span className="bg-black/25 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
              {tool.minGrade}
            </span>
          )}
          {isActive && (
            <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>مفتوح</span>
            </span>
          )}
        </div>
      </div>

      <div className="w-full relative z-10">
        <h4 className="font-black text-sm text-white mb-1 leading-snug">{tool.nameAr}</h4>
        {tool.nameFr && (
          <p className="text-[10px] text-white/70 font-sans tracking-wide mb-1.5 line-clamp-1">{tool.nameFr}</p>
        )}
        <p className="text-[11px] text-white/85 line-clamp-2 leading-relaxed font-arabic">
          {tool.description}
        </p>
      </div>
    </button>
  );
};
