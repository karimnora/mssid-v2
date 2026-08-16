import React, { useState, useMemo } from 'react';
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
  Search,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkle,
} from 'lucide-react';

interface ToolsHubViewProps {
  grade: PrimaryGrade;
  /** Pass INTERACTIVE_LABS_LIST — grade-filtering happens internally per group */
  tools: SubjectInfo[];
  selectedToolId: SubjectId | null;
  onSelectTool: (id: SubjectId) => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
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
};

// Perfectly organized into 4 distinct pedagogical families covering all 21 tools
const CATEGORY_GROUPS: {
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
    toolIds: ['acquis_5ap', 'wilayas_map', 'history_museum', 'algerian_market'],
  },
  {
    key: 'math_logic',
    labelAr: '📐 الرياضيات، الحساب الذهني والمقادير',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    icon: Calculator,
    toolIds: ['primary_math_ops', 'soroban', 'multiplication', 'educational_calculator', 'converter', 'geometry'],
  },
  {
    key: 'science_discovery',
    labelAr: '🧪 العلوم، التجارب والإيقاظ العلمي',
    badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
    icon: FlaskConical,
    toolIds: ['science_lab', 'electricity', 'primary_discovery'],
  },
  {
    key: 'languages_expression',
    labelAr: '🗣️ اللغات، المشاريع، الخط والتصريف',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    icon: Languages,
    toolIds: ['french_projects', 'english_audio_dialogues', 'touch_writing', 'arabic_conjugator', 'french_lab', 'english_lab', 'tamazight_lab', 'tamazight_curriculum'],
  },
];

export const ToolsHubView: React.FC<ToolsHubViewProps> = ({ grade, tools, selectedToolId, onSelectTool }) => {
  const [activeFilterCategory, setActiveFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isGridExpanded, setIsGridExpanded] = useState<boolean>(true);

  // Available tools for current grade
  const availableTools = useMemo(() => {
    return tools.filter((t) => isToolAvailableForGrade(t, grade));
  }, [tools, grade]);

  const currentSelectedTool = useMemo(() => {
    return tools.find((t) => t.id === selectedToolId);
  }, [tools, selectedToolId]);

  // Filtered by search & active category
  const filteredToolsBySearch = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();
    return availableTools.filter(
      (t) =>
        t.nameAr.toLowerCase().includes(q) ||
        t.nameFr?.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    );
  }, [availableTools, searchQuery]);

  const handleSelectAndScroll = (toolId: SubjectId) => {
    onSelectTool(toolId);
    setTimeout(() => {
      const targetElement = document.getElementById('active-interactive-tool-section');
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  const handleScrollToTool = () => {
    const targetElement = document.getElementById('active-interactive-tool-section');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div id="tools-hub-container" className="space-y-4 dir-rtl" dir="rtl">
      {/* Top Header & Compact Navigation Banner (No Horizontal Scroll) */}
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
                onClick={handleScrollToTool}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <span>انتقل للأداة المفتوحة 👇</span>
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

        {/* Search Input & Category Filter Tabs (Wrap layout, NO horizontal scrolling) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Category Filter Pills — Flex Wrap (No scroll) */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => {
                setActiveFilterCategory('all');
                setSearchQuery('');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeFilterCategory === 'all' && !searchQuery
                  ? 'bg-amber-600 text-white shadow-sm scale-[1.02]'
                  : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-slate-200/50'
              }`}
            >
              🌟 جميع الأدوات ({availableTools.length})
            </button>

            {CATEGORY_GROUPS.map((group) => {
              const count = group.toolIds
                .map((id) => tools.find((t) => t.id === id))
                .filter((t): t is SubjectInfo => !!t && isToolAvailableForGrade(t, grade)).length;
              if (count === 0) return null;
              const isSelected = activeFilterCategory === group.key && !searchQuery;

              return (
                <button
                  key={group.key}
                  onClick={() => {
                    setActiveFilterCategory(group.key);
                    setSearchQuery('');
                  }}
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

          {/* Quick Instant Search */}
          <div className="relative min-w-[200px] sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن أداة أو مختبر..."
              className="w-full pl-3 pr-9 py-1.5 text-xs rounded-xl border border-[var(--app-card-border)] bg-[var(--app-card-subtle)] text-[var(--app-text)] focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
            />
            <Search className="w-3.5 h-3.5 text-[var(--app-text-muted)] absolute right-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Structured Categorized Hub (No horizontal scroll) */}
      {isGridExpanded && (
        <div className="space-y-6">
          {/* If search query is active */}
          {filteredToolsBySearch !== null ? (
            <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-[var(--app-text)] flex items-center gap-2">
                  <Search className="w-4 h-4 text-amber-600" />
                  <span>نتائج البحث عن: "{searchQuery}" ({filteredToolsBySearch.length})</span>
                </h3>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-amber-600 font-bold hover:underline cursor-pointer"
                >
                  إلغاء البحث
                </button>
              </div>

              {filteredToolsBySearch.length === 0 ? (
                <div className="text-center py-8 text-[var(--app-text-muted)] text-xs">
                  لم يتم العثور على أداة مطابقة لبحثك. جرب كتابة اسم آخر.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredToolsBySearch.map((tool) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      isActive={selectedToolId === tool.id}
                      onSelect={() => handleSelectAndScroll(tool.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Normal Organized View by Category */
            CATEGORY_GROUPS.filter(
              (g) => activeFilterCategory === 'all' || g.key === activeFilterCategory
            ).map((group) => {
              const groupTools = group.toolIds
                .map((id) => tools.find((t) => t.id === id))
                .filter((t): t is SubjectInfo => !!t && isToolAvailableForGrade(t, grade));

              if (groupTools.length === 0) return null;
              const GroupIcon = group.icon;

              return (
                <div
                  key={group.key}
                  className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-5 shadow-sm space-y-4"
                >
                  {/* Category Header */}
                  <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[var(--app-card-border)] pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-amber-500/10 text-amber-700">
                        <GroupIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-[var(--app-text)]">
                          {group.labelAr}
                        </h3>
                      </div>
                    </div>
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] border border-[var(--app-card-border)]">
                      {groupTools.length} أدوات
                    </span>
                  </div>

                  {/* Clean 3-Column Responsive Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {groupTools.map((tool) => (
                      <ToolCard
                        key={tool.id}
                        tool={tool}
                        isActive={selectedToolId === tool.id}
                        onSelect={() => handleSelectAndScroll(tool.id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

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
      className={`rounded-2xl p-4 text-right text-white shadow-md cursor-pointer bg-gradient-to-br ${tool.color} flex flex-col justify-between gap-3 transition-all relative overflow-hidden group ${
        isActive
          ? 'ring-4 ring-amber-300 ring-offset-2 scale-[1.02] shadow-xl'
          : 'hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]'
      }`}
    >
      <div className="flex items-start justify-between w-full">
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

      <div className="w-full">
        <h4 className="font-black text-sm text-white mb-1 leading-snug">{tool.nameAr}</h4>
        {tool.nameFr && (
          <p className="text-[10px] text-white/70 font-sans tracking-wide mb-1.5 line-clamp-1">{tool.nameFr}</p>
        )}
        <p className="text-[11px] text-white/85 line-clamp-2 leading-relaxed font-arabic">
          {tool.description}
        </p>
      </div>

      <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[11px] font-black text-white/90">
        <span>{isActive ? 'الأداة المعروضة بالأسفل ✨' : 'انقر لفتح واستكشاف الأداة'}</span>
        <span className="text-sm">←</span>
      </div>
    </button>
  );
};


