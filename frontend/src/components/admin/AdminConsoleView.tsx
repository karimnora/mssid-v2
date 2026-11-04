import React, { lazy, Suspense, useState } from 'react';
import { AdminConsoleNav, AdminConsoleTabId } from './AdminConsoleNav';
import { AnalyticsModule } from './AnalyticsModule';
import { FeatureFlagsModule } from './FeatureFlagsModule';
import { UsersRolesModule } from './UsersRolesModule';
import { TechnicalLogsModule } from './TechnicalLogsModule';
import { ContactMessagesModule } from './ContactMessagesModule';
import { ActivationCodesModule } from './ActivationCodesModule';

const ContentReviewModule = lazy(() => import('./ContentReviewModule').then(module => ({ default: module.ContentReviewModule })));

interface AdminConsoleViewProps {
  onExitAdminConsole: () => void;
}

// Each module owns its data. The read-only course catalog loads only when its tab is opened.
export const AdminConsoleView: React.FC<AdminConsoleViewProps> = ({ onExitAdminConsole }) => {
  const [activeTab, setActiveTab] = useState<AdminConsoleTabId>('analytics');

  return (
    <div dir="rtl" className="min-h-dvh min-h-screen bg-slate-950 font-sans text-slate-100 overflow-x-hidden pb-[max(4rem,env(safe-area-inset-bottom))]">
      <AdminConsoleNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onExitAdminConsole={onExitAdminConsole}
      />

      <main className="lg:ms-64 min-w-0"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-8">
        {activeTab === 'analytics' && <AnalyticsModule />}
        {activeTab === 'content_review' && <Suspense fallback={<p role="status">جاري تحميل كتالوج الدروس...</p>}><ContentReviewModule /></Suspense>}
        {activeTab === 'feature_flags' && <FeatureFlagsModule />}
        {activeTab === 'users_roles' && <UsersRolesModule />}
        {activeTab === 'technical_logs' && <TechnicalLogsModule />}
        {activeTab === 'contact_messages' && <ContactMessagesModule />}
        {activeTab === 'activation_codes' && <ActivationCodesModule />}
      </div></main>
    </div>
  );
};
