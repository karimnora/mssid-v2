import React, { useState } from 'react';
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
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ToolsHubViewProps {
  grade: PrimaryGrade;
  /** Pass INTERACTIVE_LABS_LIST — grade-filtering happens internally per group so an empty group can be hidden entirely. */
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
};

// Groups the flat INTERACTIVE_LABS_LIST into families requested for the tools hub
const CATEGORY_GROUPS: { key: string; labelAr: string; icon: string; toolIds: SubjectId[] }[] = [
  {
    key: 'algerian_identity',
    labelAr: '🇩🇿 الهوية الوطنية والتاريخ والبيئة الجزائرية',
    icon: 'Shield',
    toolIds: ['algerian_market', 'wilayas_map', 'history_museum', 'tamazight_lab'],
  },
  {
    key: 'math',
    labelAr: '📐 الرياضيات والحساب الذهني والمقادير',
    icon: 'Calculator',
    toolIds: ['soroban', 'educational_calculator', 'multiplication', 'converter', 'geometry'],
  },
  {
    key: 'science',
    labelAr: '🧪 المختبرات العلمية والتجارب والإيقاظ',
    icon: 'FlaskConical',
    toolIds: ['science_lab', 'electricity'],
  },
  {
    key: 'language',
    labelAr: '🗣️ الخط والكتابة وتصريف اللغات والأمازيغية',
    icon: 'Languages',
    toolIds: ['tamazight_curriculum', 'touch_writing', 'tamazight_lab', 'arabic_conjugator', 'french_lab', 'english_lab'],
  },
];

export const ToolsHubView: React.FC<ToolsHubViewProps> = ({ grade, tools, selectedToolId, onSelectTool }) => {
  const [activeFilterCategory, setActiveFilterCategory] = useState<string>('all');
  const [isGridExpanded, setIsGridExpanded] = useState<boolean>(true);

  // Available tools for this grade
  const availableTools = tools.filter((t) => isToolAvailableForGrade(t, grade));
  const currentSelectedTool = tools.find((t) => t.id === selectedToolId);

  // Filter groups
  const filteredGroups = CATEGORY_GROUPS.filter((g) => activeFilterCategory === 'all' || g.key === activeFilterCategory);

  return (
    <div className="space-y-4 dir-rtl" dir="rtl">
      {/* Sticky / Compact Tool Navigation Bar */}
      <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-3 sm:p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black text-sm">
              ⚡
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-black text-[var(--app-text)]">
                المختبرات والأدوات التفاعلية ({availableTools.length})
              </h2>
              <p className="text-[11px] text-[var(--app-text-muted)]">
                {currentSelectedTool ? `الأداة المفتوحة حالياً: ${currentSelectedTool.nameAr}` : 'اختر أداة لبدء التجربة والتعلم التفاعلي'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsGridExpanded(!isGridExpanded)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[var(--app-card-subtle)] text-[var(--app-text)] hover:bg-slate-200/50 transition-colors cursor-pointer border border-[var(--app-card-border)]"
            >
              <span>{isGridExpanded ? 'طي شبكة الأدوات' : 'عرض شبكة الأدوات'}</span>
              {isGridExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Quick Horizontal Scrollable Strip for Instant Tool Switching */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-thin">
          {availableTools.map((tool) => {
            const IconComp = ICON_MAP[tool.icon] || Sparkles;
            const isSelected = selectedToolId === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => {
                  onSelectTool(tool.id);
                  // On mobile, keep it accessible
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-black transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? `bg-gradient-to-r ${tool.color} text-white shadow-md ring-2 ring-amber-400 scale-[1.03]`
                    : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] border border-[var(--app-card-border)] hover:border-amber-300'
                }`}
              >
                <IconComp className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">{tool.nameAr}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Expanded Categorized Visual Hub */}
      {isGridExpanded && (
        <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-4 sm:p-5 shadow-sm space-y-5">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveFilterCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-colors cursor-pointer whitespace-nowrap ${
                activeFilterCategory === 'all'
                  ? 'bg-[var(--brand-emerald)] text-white shadow-sm'
                  : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
              }`}
            >
              🌟 جميع الفئات ({availableTools.length})
            </button>
            {CATEGORY_GROUPS.map((group) => {
              const count = group.toolIds
                .map((id) => tools.find((t) => t.id === id))
                .filter((t): t is SubjectInfo => !!t && isToolAvailableForGrade(t, grade)).length;
              if (count === 0) return null;
              return (
                <button
                  key={group.key}
                  onClick={() => setActiveFilterCategory(group.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-colors cursor-pointer whitespace-nowrap ${
                    activeFilterCategory === group.key
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
                  }`}
                >
                  {group.labelAr.split(' ')[0]} {group.labelAr.split(' ')[1]} ({count})
                </button>
              );
            })}
          </div>

          {/* Grouped Grids */}
          <div className="space-y-6">
            {filteredGroups.map((group) => {
              const groupTools = group.toolIds
                .map((id) => tools.find((t) => t.id === id))
                .filter((t): t is SubjectInfo => !!t && isToolAvailableForGrade(t, grade));
              if (groupTools.length === 0) return null;

              return (
                <div key={group.key} className="space-y-3">
                  <h3 className="text-xs font-black text-[var(--app-text)] flex items-center gap-2">
                    <span>{group.labelAr}</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {groupTools.map((tool) => {
                      const IconComp = ICON_MAP[tool.icon] || Sparkles;
                      const isActive = selectedToolId === tool.id;
                      return (
                        <button
                          key={tool.id}
                          onClick={() => {
                            onSelectTool(tool.id);
                          }}
                          className={`rounded-2xl p-4 text-right text-white shadow-md cursor-pointer bg-gradient-to-br ${tool.color} flex flex-col justify-between gap-3 transition-all relative overflow-hidden group ${
                            isActive
                              ? 'ring-4 ring-amber-300 scale-[1.02] shadow-xl'
                              : 'hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                              <IconComp className="w-5 h-5 text-white" />
                            </div>
                            {isActive && (
                              <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
                                الأداة النشطة ✨
                              </span>
                            )}
                          </div>
                          <div>
                            <h4 className="font-black text-sm text-white mb-1 leading-snug">{tool.nameAr}</h4>
                            <p className="text-[11px] text-white/85 line-clamp-2 leading-relaxed">{tool.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

