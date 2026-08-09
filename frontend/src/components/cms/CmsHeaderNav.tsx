import React from 'react';
import { CmsUser, CmsRole } from '../../types/cms';
import {
  LayoutDashboard,
  GitFork,
  FileEdit,
  CheckSquare,
  Award,
  FileUp,
  Sparkles,
  Image as ImageIcon,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  Eye,
  LogOut,
  Sliders,
  ChevronRight,
  BookOpen
} from 'lucide-react';

export type CmsTabId =
  | 'dashboard'
  | 'curriculum'
  | 'courses'
  | 'exercises'
  | 'exams'
  | 'import_pdf'
  | 'ai_generator'
  | 'media_library'
  | 'audit'
  | 'analytics';

interface CmsHeaderNavProps {
  activeTab: CmsTabId;
  onSelectTab: (tab: CmsTabId) => void;
  currentUser: CmsUser;
  onChangeUser: (user: CmsUser) => void;
  allUsers: CmsUser[];
  onExitCms: () => void;
}

export const CmsHeaderNav: React.FC<CmsHeaderNavProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  onChangeUser,
  allUsers,
  onExitCms,
}) => {
  const tabs: { id: CmsTabId; labelAr: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', labelAr: 'لوحة القيادة', icon: LayoutDashboard },
    { id: 'curriculum', labelAr: 'البرنامج والمنهاج', icon: GitFork },
    { id: 'courses', labelAr: 'إدارة الدروس', icon: FileEdit },
    { id: 'exercises', labelAr: 'بنك التمارين', icon: CheckSquare },
    { id: 'exams', labelAr: 'منشئ الامتحانات', icon: Award },
    { id: 'import_pdf', labelAr: 'مستورد PDF والوثائق', icon: FileUp, badge: 'IA' },
    { id: 'ai_generator', labelAr: 'المولّد الذكي', icon: Sparkles, badge: 'Gemini' },
    { id: 'media_library', labelAr: 'المكتبة الوسائطية', icon: ImageIcon },
    { id: 'audit', labelAr: 'التقرير الفني والتدقيق', icon: ShieldCheck, badge: 'Live' },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-lg dir-rtl" dir="rtl">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3 border-b border-slate-800/80">
        
        {/* Brand Badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 p-0.5 shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-amber-400 font-mono text-sm">
              CMS
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-sm tracking-tight font-sans text-white">
                نظام إدارة المحتوى البيداغوجي (CMS Mssid)
              </h1>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                Back Office v2.0
              </span>
            </div>
          </div>
        </div>

        {/* User Role Switcher Controls */}
        <div className="flex items-center gap-3">
          
          {/* Active Role Selector */}
          <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 px-2.5 py-1 rounded-xl text-xs">
            <span className="text-slate-400 hidden sm:inline">الرتبة:</span>
            <select
              value={currentUser.id}
              onChange={(e) => {
                const found = allUsers.find((u) => u.id === e.target.value);
                if (found) onChangeUser(found);
              }}
              className="bg-transparent text-amber-300 font-bold focus:outline-none cursor-pointer"
            >
              {allUsers.map((u) => (
                <option key={u.id} value={u.id} className="bg-slate-900 text-white">
                  {u.avatar} {u.name} ({u.role.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Exit CMS to Student App View */}
          <button
            onClick={onExitCms}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-950" />
            <span>معاينة منصة التلميذ</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-x-auto py-1.5">
        <div className="flex items-center gap-1 min-w-[700px]">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <IconComponent className="w-4 h-4 shrink-0" />
                <span>{tab.labelAr}</span>
                {tab.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-black ${
                    isActive ? 'bg-slate-950 text-amber-300' : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
