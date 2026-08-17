import React, { useState } from 'react';
import { AdminConsoleNav, AdminConsoleTabId } from './AdminConsoleNav';
import { AnalyticsModule } from './AnalyticsModule';
import { FeatureFlagsModule } from './FeatureFlagsModule';
import { UsersRolesModule } from './UsersRolesModule';
import { TechnicalLogsModule } from './TechnicalLogsModule';
import { ContactMessagesModule } from './ContactMessagesModule';

interface AdminConsoleViewProps {
  onExitAdminConsole: () => void;
}

// Replaces the old content-creation CmsMainView: a lightweight supervision-only shell over exactly
// 5 modules. Unlike CmsMainView, this shell does NOT fetch any curriculum/course/exercise/exam data
// itself — each module owns and fetches its own data independently.
export const AdminConsoleView: React.FC<AdminConsoleViewProps> = ({ onExitAdminConsole }) => {
  const [activeTab, setActiveTab] = useState<AdminConsoleTabId>('analytics');

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 pb-16">
      <AdminConsoleNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onExitAdminConsole={onExitAdminConsole}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {activeTab === 'analytics' && <AnalyticsModule />}
        {activeTab === 'feature_flags' && <FeatureFlagsModule />}
        {activeTab === 'users_roles' && <UsersRolesModule />}
        {activeTab === 'technical_logs' && <TechnicalLogsModule />}
        {activeTab === 'contact_messages' && <ContactMessagesModule />}
      </main>
    </div>
  );
};
