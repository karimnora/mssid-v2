import React from 'react';
import { BarChart3, Sliders, Users, ShieldCheck, BookOpen, Mail, Clapperboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export type AdminConsoleTabId = 'analytics' | 'feature_flags' | 'users_roles' | 'technical_logs' | 'contact_messages' | 'reels_studio';

interface AdminConsoleNavProps {
  activeTab: AdminConsoleTabId;
  onSelectTab: (tab: AdminConsoleTabId) => void;
  onExitAdminConsole: () => void;
}

const TABS: { id: AdminConsoleTabId; labelAr: string; shortLabelAr: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'analytics', labelAr: 'الإحصائيات', shortLabelAr: 'إحصاء', icon: BarChart3 },
  { id: 'feature_flags', labelAr: 'إدارة المزايا', shortLabelAr: 'مزايا', icon: Sliders },
  { id: 'users_roles', labelAr: 'المستخدمون والصلاحيات', shortLabelAr: 'مستخدمون', icon: Users },
  { id: 'technical_logs', labelAr: 'السجلات التقنية', shortLabelAr: 'سجلات', icon: ShieldCheck },
  { id: 'contact_messages', labelAr: 'رسائل التواصل', shortLabelAr: 'رسائل', icon: Mail },
  { id: 'reels_studio', labelAr: 'استوديو الإعلانات', shortLabelAr: 'إعلانات', icon: Clapperboard },
];

// Replaces the old CmsHeaderNav's fake CmsUser role-switcher <select> with the real logged-in
// admin's identity (via useAuth()) — read-only, no impersonation of another role from here.
export const AdminConsoleNav: React.FC<AdminConsoleNavProps> = ({ activeTab, onSelectTab, onExitAdminConsole }) => {
  const { authUser } = useAuth();

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-lg dir-rtl pt-[env(safe-area-inset-top)]" dir="rtl">
      {/* Top Banner Bar — stacks identity under the title on a phone so nothing overflows. */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 min-h-[var(--hit)] py-2 flex items-center justify-between gap-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 p-0.5 shadow-md shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-amber-400 font-mono text-sm">
              ⚙️
            </div>
          </div>
          <div className="min-w-0">
            <h1 className="font-black text-sm tracking-tight font-sans text-white truncate">
              <span className="sm:hidden">الإدارة</span>
              <span className="hidden sm:inline">لوحة تحكم الإدارة (Admin Console)</span>
            </h1>
            <span className="hidden sm:inline-block bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
              Supervision Only
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs">
            <div className="text-right leading-tight">
              <div className="font-bold text-white">{authUser?.nom || '—'}</div>
              <div className="text-[10px] text-slate-300 font-mono" dir="ltr">{authUser?.email || ''}</div>
            </div>
            <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              ROLE_ADMIN
            </span>
          </div>

          <button
            type="button"
            onClick={onExitAdminConsole}
            className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs min-h-[var(--hit)] min-w-[var(--hit)] sm:min-w-0 px-3 rounded-xl transition-all shadow-xs cursor-pointer"
            aria-label="معاينة منصة التلميذ"
          >
            <BookOpen className="w-4 h-4 text-slate-950" />
            <span className="hidden sm:inline">معاينة منصة التلميذ</span>
          </button>
        </div>
      </div>

      {/* Tabs: swipe horizontally on a phone (48px hits), no forced 520px min-width. */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 overflow-x-auto overscroll-x-contain py-1.5 [-webkit-overflow-scrolling:touch]">
        <div className="flex items-center gap-1 w-max sm:w-auto">
          {TABS.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center justify-center gap-1.5 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap min-h-[var(--hit)] ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <IconComponent className="w-4 h-4 shrink-0" />
                <span className="sm:hidden">{tab.shortLabelAr}</span>
                <span className="hidden sm:inline">{tab.labelAr}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
