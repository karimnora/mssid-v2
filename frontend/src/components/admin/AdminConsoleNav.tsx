import React from 'react';
import { BarChart3, Sliders, Users, ShieldCheck, BookOpen, Mail, ArrowUpRight, Ticket } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MssidLogo } from '../MssidLogo';

export type AdminConsoleTabId = 'analytics' | 'content_review' | 'feature_flags' | 'users_roles' | 'technical_logs' | 'contact_messages' | 'activation_codes';
interface AdminConsoleNavProps {
  activeTab: AdminConsoleTabId;
  onSelectTab: (tab: AdminConsoleTabId) => void;
  onExitAdminConsole: () => void;
}
const TABS: { id: AdminConsoleTabId; labelAr: string; shortLabelAr: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'analytics', labelAr: 'الإحصائيات', shortLabelAr: 'إحصاء', icon: BarChart3 },
  { id: 'content_review', labelAr: 'مراقبة المحتوى', shortLabelAr: 'المحتوى', icon: BookOpen },
  { id: 'feature_flags', labelAr: 'إدارة المزايا', shortLabelAr: 'مزايا', icon: Sliders },
  { id: 'users_roles', labelAr: 'المستخدمون والصلاحيات', shortLabelAr: 'مستخدمون', icon: Users },
  { id: 'technical_logs', labelAr: 'السجلات التقنية', shortLabelAr: 'سجلات', icon: ShieldCheck },
  { id: 'contact_messages', labelAr: 'رسائل التواصل', shortLabelAr: 'رسائل', icon: Mail },
  { id: 'activation_codes', labelAr: 'أكواد التفعيل', shortLabelAr: 'أكواد', icon: Ticket },
];
export const AdminConsoleNav: React.FC<AdminConsoleNavProps> = ({ activeTab, onSelectTab, onExitAdminConsole }) => {
  const { authUser } = useAuth();
  return (
    <header dir="rtl" className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900 text-slate-100 pt-[env(safe-area-inset-top)] lg:fixed lg:start-0 lg:bottom-0 lg:w-64 lg:flex lg:flex-col lg:border-b-0 lg:border-e lg:overflow-y-auto">
      <div className="flex items-center justify-between gap-3 px-4 py-3 lg:px-5 lg:py-6">
        <div className="flex items-center gap-3 min-w-0">
          <MssidLogo size="sm" />
          <div className="min-w-0"><h1 className="text-sm font-black">مسيد · الإدارة</h1><p className="text-xs text-slate-400 mt-0.5">متابعة المنصة والمحتوى</p></div>
        </div>
        <button type="button" onClick={onExitAdminConsole} aria-label="معاينة منصة التلميذ" className="lg:hidden min-h-12 min-w-12 grid place-items-center rounded-xl border border-slate-700 text-emerald-200 hover:bg-slate-800"><ArrowUpRight className="w-5 h-5" /></button>
      </div>
      <nav aria-label="أقسام الإدارة" className="px-3 pb-2 overflow-x-auto lg:overflow-x-visible lg:px-4 lg:pt-4">
        <p className="hidden lg:block text-xs text-slate-400 px-3 pb-3">مساحة العمل</p>
        <div className="flex gap-1 w-max lg:w-auto lg:flex-col lg:gap-2">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} type="button" onClick={() => onSelectTab(tab.id)} aria-current={active ? 'page' : undefined} className={`min-h-12 flex items-center gap-2 lg:gap-3 rounded-xl border px-3 text-xs lg:text-sm font-bold whitespace-nowrap transition-colors ${active ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-200' : 'border-transparent text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                <Icon className="w-4 h-4 shrink-0" /><span className="lg:hidden">{tab.shortLabelAr}</span><span className="hidden lg:inline">{tab.labelAr}</span>
                {active && <span aria-hidden className="hidden lg:block ms-auto h-1.5 w-1.5 rounded-full bg-emerald-300" />}
              </button>
            );
          })}
        </div>
      </nav>
      <div className="hidden lg:block mt-auto px-4 pb-5 pt-8 space-y-4">
        <button type="button" onClick={onExitAdminConsole} aria-label="معاينة منصة التلميذ" className="min-h-12 w-full flex items-center justify-center gap-2 rounded-xl border border-slate-700 text-sm text-slate-200 font-bold hover:bg-slate-800"><ArrowUpRight className="w-4 h-4" />معاينة منصة التلميذ</button>
        <div className="border-t border-slate-800 pt-4 flex items-center gap-3">
          <div aria-hidden className="w-10 h-10 rounded-full bg-slate-800 text-emerald-200 grid place-items-center font-black shrink-0">{authUser?.nom?.trim().charAt(0) || 'م'}</div>
          <div className="min-w-0"><p className="text-sm font-bold truncate">{authUser?.nom || 'المسؤول'}</p><p className="text-xs text-slate-400 truncate" dir="ltr">{authUser?.email || ''}</p></div>
        </div>
      </div>
    </header>
  );
};
