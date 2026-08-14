import React from 'react';
import { BarChart3, Sliders, Users, ShieldCheck, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export type AdminConsoleTabId = 'analytics' | 'feature_flags' | 'users_roles' | 'technical_logs';

interface AdminConsoleNavProps {
  activeTab: AdminConsoleTabId;
  onSelectTab: (tab: AdminConsoleTabId) => void;
  onExitAdminConsole: () => void;
}

const TABS: { id: AdminConsoleTabId; labelAr: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'analytics', labelAr: '📊 الإحصائيات', icon: BarChart3 },
  { id: 'feature_flags', labelAr: '⚙️ إدارة المزايا', icon: Sliders },
  { id: 'users_roles', labelAr: '👥 المستخدمون والصلاحيات', icon: Users },
  { id: 'technical_logs', labelAr: '🛠️ السجلات التقنية', icon: ShieldCheck },
];

// Replaces the old CmsHeaderNav's fake CmsUser role-switcher <select> with the real logged-in
// admin's identity (via useAuth()) — read-only, no impersonation of another role from here.
export const AdminConsoleNav: React.FC<AdminConsoleNavProps> = ({ activeTab, onSelectTab, onExitAdminConsole }) => {
  const { authUser } = useAuth();

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-lg dir-rtl" dir="rtl">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 p-0.5 shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-amber-400 font-mono text-sm">
              ⚙️
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-sm tracking-tight font-sans text-white">
                لوحة تحكم الإدارة (Admin Console)
              </h1>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                Supervision Only
              </span>
            </div>
          </div>
        </div>

        {/* Real logged-in admin identity — no role switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs">
            <div className="text-right leading-tight">
              <div className="font-bold text-white">{authUser?.nom || '—'}</div>
              <div className="text-[10px] text-slate-400 font-mono" dir="ltr">{authUser?.email || ''}</div>
            </div>
            <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              ROLE_ADMIN
            </span>
          </div>

          <button
            onClick={onExitAdminConsole}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-950" />
            <span>معاينة منصة التلميذ</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-x-auto py-1.5">
        <div className="flex items-center gap-1 min-w-[520px]">
          {TABS.map((tab) => {
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
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
