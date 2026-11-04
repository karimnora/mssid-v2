/**
 * ToolsHubView.tsx
 * ─ Mobile (< md) : navigation 3 vues  Hub → Liste → retour
 * ─ Desktop (≥ md): affichage original dense — INCHANGÉ
 */
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Icon3d, LAB_ICON3D, type Icon3dName } from './art3d/Icon3d';
import { motion, AnimatePresence } from 'motion/react';
import { SubjectInfo, SubjectId, PrimaryGrade } from '../types';
import { isToolAvailableForGrade } from '../data/subjectsData';
import { CardBlobBackdrop } from './CardBlobBackdrop';
import { useTranslation } from '../hooks/useTranslation';
import { useLocaleContext } from '../context/LocaleContext';
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
  ChevronLeft,
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
  /** 3D icon shown in place of the emoji (art3d/Icon3d). */
  icon3d: Icon3dName;
  labelKey: 'categoryFaithStreetShort' | 'categoryIdentityShort' | 'categoryMathShort' | 'categoryScienceShort' | 'categoryLangsShort';
  hintKey: 'categoryFaithStreetHint' | 'categoryIdentityHint' | 'categoryMathHint' | 'categoryScienceHint' | 'categoryLangsHint';
  cardClass: string;
  toolIds: SubjectId[];
}

const MOBILE_CATS: MobileCat[] = [
  {
    key: 'identity_civics',
    emoji: '🇩🇿',
    icon3d: 'algeria',
    labelKey: 'categoryIdentityShort',
    hintKey: 'categoryIdentityHint',
    cardClass: 'kids-cat-identity',
    toolIds: ['wilayas_map', 'history_museum', 'algerian_market', 'topography_map', 'souk_lab', 'world_flags_lab', 'cem_prep_lab'] as SubjectId[],
  },
  {
    key: 'faith_street',
    emoji: '🕌',
    icon3d: 'mosque',
    labelKey: 'categoryFaithStreetShort',
    hintKey: 'categoryFaithStreetHint',
    cardClass: 'kids-cat-identity',
    toolIds: ['quran_lab', 'wudu_lab', 'salat_lab', 'mosque_adab_lab', 'road_code_lab'] as SubjectId[],
  },
  {
    key: 'math_logic',
    emoji: '📐',
    icon3d: 'geometry',
    labelKey: 'categoryMathShort',
    hintKey: 'categoryMathHint',
    cardClass: 'kids-cat-math',
    toolIds: ['primary_math_ops', 'soroban', 'multiplication', 'educational_calculator', 'converter', 'geometry', 'fractions_lab', 'area_grid', 'clock_trainer', 'cahiers_lab'] as SubjectId[],
  },
  {
    key: 'science_discovery',
    emoji: '🧪',
    icon3d: 'flask',
    labelKey: 'categoryScienceShort',
    hintKey: 'categoryScienceHint',
    cardClass: 'kids-cat-science',
    toolIds: ['science_lab', 'speed_lab', 'electricity', 'primary_discovery', 'human_anatomy', 'earth_cycles'] as SubjectId[],
  },
  {
    key: 'languages_expression',
    emoji: '🗣️',
    icon3d: 'speech',
    labelKey: 'categoryLangsShort',
    hintKey: 'categoryLangsHint',
    cardClass: 'kids-cat-langs',
    toolIds: ['french_projects', 'english_audio_dialogues', 'touch_writing', 'arabic_conjugator', 'french_lab', 'english_lab', 'tamazight_lab', 'tamazight_curriculum', 'syllable_studio', 'speed_reading'] as SubjectId[],
  },
];

// ─── Données Desktop — groupes originaux ─────────────────────────────────────
const DESKTOP_GROUPS: {
  key: string;
  labelKey: 'categoryFaithStreet' | 'categoryIdentityCivics' | 'categoryMathLogic' | 'categoryScienceDiscovery' | 'categoryLanguagesExpression';
  badgeColor: string;
  icon: React.FC<{ className?: string }>;
  toolIds: SubjectId[];
}[] = [
  {
    key: 'identity_civics',
    labelKey: 'categoryIdentityCivics',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    icon: Shield,
    toolIds: ['wilayas_map', 'history_museum', 'algerian_market', 'topography_map', 'souk_lab', 'world_flags_lab', 'cem_prep_lab'] as SubjectId[],
  },
  {
    key: 'faith_street',
    labelKey: 'categoryFaithStreet',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    icon: Shield,
    toolIds: ['quran_lab', 'wudu_lab', 'salat_lab', 'mosque_adab_lab', 'road_code_lab'] as SubjectId[],
  },
  {
    key: 'math_logic',
    labelKey: 'categoryMathLogic',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    icon: Calculator,
    toolIds: ['primary_math_ops', 'soroban', 'multiplication', 'educational_calculator', 'converter', 'geometry', 'fractions_lab', 'area_grid', 'clock_trainer', 'cahiers_lab'] as SubjectId[],
  },
  {
    key: 'science_discovery',
    labelKey: 'categoryScienceDiscovery',
    badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
    icon: FlaskConical,
    toolIds: ['science_lab', 'speed_lab', 'electricity', 'primary_discovery', 'human_anatomy', 'earth_cycles'] as SubjectId[],
  },
  {
    key: 'languages_expression',
    labelKey: 'categoryLanguagesExpression',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    icon: Languages,
    toolIds: ['french_projects', 'english_audio_dialogues', 'touch_writing', 'arabic_conjugator', 'french_lab', 'english_lab', 'tamazight_lab', 'tamazight_curriculum', 'syllable_studio', 'speed_reading'] as SubjectId[],
  },
];

function catalogToolTitle(tool: SubjectInfo, locale: 'ar' | 'fr'): string {
  return locale === 'fr' ? tool.nameFr : tool.nameAr;
}

interface ToolsHubViewProps {
  grade: PrimaryGrade;
  tools: SubjectInfo[];
  selectedToolId: SubjectId | null;
  /** false = lab plein écran (P0) ; true = catalogue visible, lab masqué */
  catalogOpen: boolean;
  onCatalogOpenChange: (open: boolean) => void;
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
  grade,
  tools,
  selectedToolId,
  catalogOpen,
  onCatalogOpenChange,
  onSelectTool,
  onClearTool,
}) => {
  const { locale, direction } = useLocaleContext();
  const t = useTranslation('tools');
  const toolTitle = (tool: SubjectInfo) => catalogToolTitle(tool, locale);
  const labFocused = Boolean(selectedToolId) && !catalogOpen;

  // — état mobile
  const [mobileView, setMobileView]         = useState<MobileView>(() => (selectedToolId && !catalogOpen ? 'active' : 'hub'));
  const [mobileCatKey, setMobileCatKey]     = useState<string>(MOBILE_CATS[0].key);
  // Vue à restaurer quand on quitte 'active' via le bouton retour du labo lui-même (pas via
  // « اختر مختبراً آخر », qui gère son propre retour) : 'list' si on venait de la liste d'une
  // catégorie, 'hub' par défaut (ex. reprise de session avec un outil déjà sélectionné au montage).
  const mobileReturnViewRef = useRef<'hub' | 'list'>('hub');

  // — état desktop (original)
  const [activeFilterCategory, setActiveFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery]                   = useState<string>('');
  const [isGridExpanded, setIsGridExpanded]             = useState<boolean>(catalogOpen);

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

  useEffect(() => {
    if (labFocused) {
      setMobileView('active');
      return;
    }
    // Catalogue rouvert (ex. bouton retour propre au labo) : revenir à la vue quittée avant
    // 'active' — 'list' si on venait de la liste d'une catégorie (mobileCatKey est déjà préservé),
    // sinon 'hub' (ex. reprise de session avec un outil déjà sélectionné au montage). Le bouton
    // explicite « اختر مختبراً آخر » gère lui-même son propre retour au hub (voir openCatalog),
    // donc mobileView y vaut déjà 'hub' quand cet effet s'exécute et ce cas reste un no-op.
    // Sans ça, mobileView reste sur 'active' alors que hub/list seuls sont rendus → écran vide.
    if (catalogOpen || !selectedToolId) {
      setMobileView((prev) => (prev === 'active' ? mobileReturnViewRef.current : prev));
    }
  }, [selectedToolId, catalogOpen, labFocused]);

  useEffect(() => {
    if (catalogOpen) setIsGridExpanded(true);
  }, [catalogOpen]);

  useEffect(() => {
    if (!catalogOpen || labFocused) return;
    const hub = document.getElementById('tools-hub-container');
    hub?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
  }, [catalogOpen, labFocused]);

  const scrollToTool = () => {
    setTimeout(() => {
      document.getElementById('active-interactive-tool-section')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const handleMobileSelect = (id: SubjectId) => {
    mobileReturnViewRef.current = 'list';
    onSelectTool(id);
    onCatalogOpenChange(false);
    setMobileView('active');
    scrollToTool();
  };

  const handleDesktopSelect = (id: SubjectId) => {
    onSelectTool(id);
    onCatalogOpenChange(false);
    scrollToTool();
  };

  const openCatalog = () => {
    onCatalogOpenChange(true);
    setMobileView('hub');
  };

  return (
    <div id="tools-hub-container" dir={direction} data-labs-layout="full" data-lab-focused={labFocused ? 'true' : 'false'}>

      {/* Bandeau compact — lab ouvert, catalogue masqué (P0) */}
      {labFocused && currentSelectedTool && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-3xl border-2 border-[var(--app-card-border)] bg-[var(--app-card-bg)] overflow-hidden">
          <div className="kids-hero-band w-full" />
          <div className="flex flex-wrap items-center justify-between gap-3 w-full px-4 pb-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl shrink-0">🔬</span>
            <div className="min-w-0">
              <p className="text-xs text-[var(--app-text-muted)]">{t('openLabLabel')}</p>
              <p className="text-sm font-black text-[var(--app-text)] truncate">{toolTitle(currentSelectedTool)}</p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={openCatalog}
            className="min-h-12 px-5 py-3 rounded-2xl bg-[var(--brand-emerald)] hover:bg-[var(--brand-emerald-dark)] text-white text-xs font-extrabold cursor-pointer shrink-0"
          >
            {t('chooseAnotherLabButton')}
          </motion.button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          MOBILE  (block md:hidden)
      ════════════════════════════════════════════════════════════════ */}
      <div className={`block md:hidden ${labFocused ? 'hidden' : ''}`}>
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
                <div className="w-10 h-10 rounded-2xl kids-cat-identity flex items-center justify-center text-lg shrink-0">
                  🔬
                </div>
                <div>
                  <h2 className="text-base font-black text-[var(--app-text)]">{t('interactiveLabsShortTitle')}</h2>
                  <p className="text-xs text-[var(--app-text-muted)] mt-0.5">{t('toolsCountChooseCategory', { count: availableTools.length })}</p>
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
                      className={`kids-pop relative overflow-hidden rounded-[22px] ${cat.cardClass} px-5 py-4 text-right text-white cursor-pointer flex items-center gap-4 min-h-[88px]`}
                    >
                      <CardBlobBackdrop />
                      <span className="icon3d-float shrink-0 relative z-10 w-[60px] h-[60px]"><Icon3d name={cat.icon3d} className="w-[60px] h-[60px] drop-shadow-[0_6px_6px_rgba(8,12,52,0.35)]" /></span>
                      <div className="flex-1 relative z-10 text-right">
                        <h3 className="text-sm font-black text-white">{t(cat.labelKey)}</h3>
                        <p className="text-xs text-white/70 mt-0.5">{t(cat.hintKey)}</p>
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
                  {direction === 'rtl' ? (
                    <ChevronRight className="w-4 h-4 text-[var(--app-text-muted)]" />
                  ) : (
                    <ChevronLeft className="w-4 h-4 text-[var(--app-text-muted)]" />
                  )}
                </motion.button>
                <div className={`w-9 h-9 rounded-2xl ${activeMobileCat.cardClass} flex items-center justify-center text-base shrink-0`}>
                  <Icon3d name={activeMobileCat.icon3d} className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-[var(--app-text)]">{t(activeMobileCat.labelKey)}</h2>
                  <p className="text-xs text-[var(--app-text-muted)]">{t('toolsAvailableInCategory', { count: mobileCatTools.length })}</p>
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
                      grade={grade}
                      isActive={selectedToolId === tool.id}
                      onSelect={() => handleMobileSelect(tool.id)}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          DESKTOP  (hidden md:block)
      ════════════════════════════════════════════════════════════════ */}
      {/* A plain runtime `hidden` can't override `md:block` here — Tailwind places every `md:`
          rule after the whole unprefixed layer (including `.hidden`) in the generated stylesheet,
          so `md:block` always won this tie at desktop widths regardless of labFocused, silently
          keeping the full catalog/search header rendered above the open lab. `md:hidden` is itself
          a media-scoped rule at the same breakpoint, ordered after `md:block` there for the same
          reason `.hidden` already correctly wins over plain `.block` below 768px — see the mobile
          wrapper's equivalent conditional a few dozen lines down. */}
      <div className={`hidden md:block space-y-4 ${labFocused ? 'md:hidden' : ''}`}>

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
                    {t('hubTitle')}
                  </h2>
                  <span className="bg-amber-500/15 text-amber-700 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-300/50">
                    {t('toolsAvailableBadge', { count: availableTools.length })}
                  </span>
                </div>
                <p className="text-xs text-[var(--app-text-muted)] mt-0.5">
                  {currentSelectedTool ? (
                    <span className="inline-flex items-center gap-1.5 flex-wrap">
                      <span>{t('currentlyOpenLabel')}</span>
                      <strong className="text-[var(--app-text)] font-black">{toolTitle(currentSelectedTool)}</strong>
                    </span>
                  ) : (
                    t('exploreDefaultDesc')
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
              {currentSelectedTool && (
                <button
                  onClick={scrollToTool}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[var(--brand-emerald)] hover:bg-[var(--brand-emerald-dark)] text-white transition-all cursor-pointer active:scale-95"
                >
                  {t('goToOpenToolButton')}
                </button>
              )}
              <button
                onClick={() => setIsGridExpanded(!isGridExpanded)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[var(--app-card-subtle)] text-[var(--app-text)] hover:bg-slate-200/60 transition-colors cursor-pointer border border-[var(--app-card-border)]"
              >
                <span>{isGridExpanded ? t('hideGuideButton') : t('showFullGuideButton')}</span>
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
                {t('allToolsButton', { count: availableTools.length })}
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
                    <span>{t(group.labelKey)}</span>
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
                placeholder={t('searchPlaceholder')}
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
                    <span>{t('searchResultsTitle', { query: searchQuery, count: filteredToolsBySearch.length })}</span>
                  </h3>
                  <button onClick={() => setSearchQuery('')} className="text-xs text-amber-600 font-bold hover:underline cursor-pointer">
                    {t('cancelSearchButton')}
                  </button>
                </div>
                {filteredToolsBySearch.length === 0 ? (
                  <div className="text-center py-8 text-[var(--app-text-muted)] text-xs">
                    {t('noSearchResultsMsg')}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredToolsBySearch.map(tool => (
                      <ToolCard key={tool.id} grade={grade} tool={tool} isActive={selectedToolId === tool.id} onSelect={() => handleDesktopSelect(tool.id)} />
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
                        <h3 className="text-sm font-black text-[var(--app-text)]">{t(group.labelKey)}</h3>
                      </div>
                      <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] border border-[var(--app-card-border)]">
                        {t('toolsCountBadge', { count: groupTools.length })}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {groupTools.map(tool => (
                        <ToolCard key={tool.id} grade={grade} tool={tool} isActive={selectedToolId === tool.id} onSelect={() => handleDesktopSelect(tool.id)} />
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

const KIDS_LAB_CARD: Partial<Record<SubjectId, string>> = {
  wilayas_map: 'kids-card-wilayas',
  history_museum: 'kids-card-histoire',
  algerian_market: 'kids-card-defis',
  souk_lab: 'kids-card-defis',
  world_flags_lab: 'kids-card-wilayas',
  cem_prep_lab: 'kids-card-histoire',
  cahiers_lab: 'kids-card-maths',
  wudu_lab: 'kids-card-islamique',
  salat_lab: 'kids-card-islamique',
  mosque_adab_lab: 'kids-card-islamique',
  road_code_lab: 'kids-card-histoire',
  topography_map: 'kids-card-islamique',
  quran_lab: 'kids-card-islamique',
  primary_math_ops: 'kids-card-maths',
  soroban: 'kids-card-maths-soft',
  multiplication: 'kids-card-maths-deep',
  educational_calculator: 'kids-card-maths',
  converter: 'kids-card-maths-soft',
  geometry: 'kids-card-maths-deep',
  fractions_lab: 'kids-card-maths',
  area_grid: 'kids-card-maths-soft',
  clock_trainer: 'kids-card-maths-deep',
  science_lab: 'kids-card-sciences',
  electricity: 'kids-card-sciences-deep',
  primary_discovery: 'kids-card-sciences-soft',
  human_anatomy: 'kids-card-histoire',
  earth_cycles: 'kids-card-sciences',
  french_projects: 'kids-card-francais',
  english_audio_dialogues: 'kids-card-english',
  touch_writing: 'kids-card-francais',
  arabic_conjugator: 'kids-card-arabe',
  french_lab: 'kids-card-francais',
  english_lab: 'kids-card-english',
  tamazight_lab: 'kids-card-amazigh',
  tamazight_curriculum: 'kids-card-amazigh',
  syllable_studio: 'kids-card-arabe',
  speed_reading: 'kids-card-arabe',
};

const springTap = { type: 'spring' as const, stiffness: 400, damping: 22 };

// ─── Tool Card — palette kids (commun mobile + desktop) ──────────────────────
interface ToolCardProps {
  tool: SubjectInfo;
  isActive: boolean;
  onSelect: () => void;
}

const ToolCard: React.FC<ToolCardProps & { grade: PrimaryGrade }> = ({ tool, isActive, onSelect }) => {
  const { locale } = useLocaleContext();
  const t = useTranslation('tools');
  const IconComp = ICON_MAP[tool.icon] || Sparkles;
  const cardClass = KIDS_LAB_CARD[tool.id] ?? 'kids-card-labs';
  const title = catalogToolTitle(tool, locale);

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileTap={{ scale: 0.95 }}
      transition={springTap}
      className={`kids-pop rounded-[22px] p-4 text-start text-white cursor-pointer ${cardClass} flex flex-col justify-between gap-3 relative overflow-hidden w-full min-h-[132px] ${
        isActive ? 'ring-4 ring-[var(--kids-sun-1)] ring-offset-2' : ''
      }`}
    >
      <CardBlobBackdrop />

      <div className="relative z-10 flex items-start justify-between w-full">
        <div className="w-[56px] h-[56px] flex items-center justify-center shrink-0">
          {LAB_ICON3D[tool.id]
            ? <Icon3d name={LAB_ICON3D[tool.id]} className="w-[56px] h-[56px] drop-shadow-[0_6px_6px_rgba(8,12,52,0.35)]" />
            : <span className="w-[42px] h-[42px] rounded-[14px] bg-white/25 flex items-center justify-center"><IconComp className="w-5 h-5 text-white" /></span>}
        </div>
        <div className="flex items-center gap-1.5">
          {tool.minGrade && (
            <span className="bg-white/20 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
              {tool.minGrade}
            </span>
          )}
          {isActive && (
            <span className="bg-gradient-to-l from-[var(--kids-sun-1)] to-[var(--kids-sun-2)] text-amber-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>{t('toolOpenBadge')}</span>
            </span>
          )}
        </div>
      </div>

      <div className="relative z-10 w-full">
        <h4 className="font-extrabold text-[15px] text-white mb-0.5 leading-snug">{title}</h4>
        <p className="text-[11.5px] text-white/90 line-clamp-2 leading-relaxed">
          {tool.description}
        </p>
      </div>
    </motion.button>
  );
};
