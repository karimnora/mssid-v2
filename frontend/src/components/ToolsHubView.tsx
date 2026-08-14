import React from 'react';
import { SubjectInfo, SubjectId, PrimaryGrade } from '../types';
import { isToolAvailableForGrade } from '../data/subjectsData';
import { Calculator, BookOpen, FlaskConical, Sparkles, Languages, Globe, Zap, Compass, Grid } from 'lucide-react';

interface ToolsHubViewProps {
  grade: PrimaryGrade;
  /** Pass INTERACTIVE_LABS_LIST — grade-filtering happens internally per group so an empty group can be hidden entirely. */
  tools: SubjectInfo[];
  selectedToolId: SubjectId | null;
  onSelectTool: (id: SubjectId) => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Calculator, BookOpen, FlaskConical, Sparkles, Languages, Globe, Zap, Compass, Grid,
};

// Groups the flat INTERACTIVE_LABS_LIST into the 3 families requested for the tools hub —
// purely a presentation grouping, doesn't change what subjectsData.ts considers a "tool".
const CATEGORY_GROUPS: { key: string; labelAr: string; toolIds: SubjectId[] }[] = [
  { key: 'math', labelAr: '📐 الرياضيات والحساب الذهني', toolIds: ['soroban', 'educational_calculator', 'multiplication', 'converter', 'geometry'] },
  { key: 'science', labelAr: '🧪 المختبرات العلمية', toolIds: ['electricity'] },
  { key: 'language', labelAr: '🗣️ تصريف اللغات والحوارات', toolIds: ['arabic_conjugator', 'french_lab', 'english_lab'] },
];

// Categorized card grid replacing the old horizontal-scroll tool tabs — same selection model
// (a tool is always active, clicking a card switches it) just re-skinned to the app's tactile
// card-based design system, grouped by Math/Science/Language like the rest of the harmonized UI.
export const ToolsHubView: React.FC<ToolsHubViewProps> = ({ grade, tools, selectedToolId, onSelectTool }) => {
  return (
    <div className="space-y-5 dir-rtl" dir="rtl">
      {CATEGORY_GROUPS.map((group) => {
        const groupTools = group.toolIds
          .map((id) => tools.find((t) => t.id === id))
          .filter((t): t is SubjectInfo => !!t && isToolAvailableForGrade(t, grade));
        if (groupTools.length === 0) return null;
        return (
          <div key={group.key} className="space-y-2.5">
            <h3 className="text-xs font-extrabold uppercase text-[var(--app-text-muted)] tracking-wider px-1">{group.labelAr}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {groupTools.map((tool) => {
                const IconComp = ICON_MAP[tool.icon] || Sparkles;
                const isActive = selectedToolId === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => onSelectTool(tool.id)}
                    className={`rounded-3xl p-4 min-h-32 text-white shadow-md cursor-pointer bg-gradient-to-br ${tool.color} flex flex-col items-center justify-center gap-2 text-center transition-all ${
                      isActive ? 'ring-4 ring-white/70 scale-[1.02]' : 'hover:scale-[1.03] active:scale-[0.98]'
                    }`}
                  >
                    <IconComp className="w-7 h-7" />
                    <span className="font-black text-xs leading-tight">{tool.nameAr}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
