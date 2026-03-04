import type { RefObject } from 'react';
import { motion } from 'framer-motion';
import type { UserRequest } from '../../../services/requestsService';
import type { User } from '../../../types/auth.types';
import type { Suggestion, UserSettingsTab } from '../userSettings.types';
import { UserSettingsAppearanceTab } from './UserSettingsAppearanceTab';
import { UserSettingsModalNav } from './UserSettingsModalNav';
import { UserSettingsNotificationsTab } from './UserSettingsNotificationsTab';
import { UserSettingsProfileTab } from './UserSettingsProfileTab';
import { UserSettingsRoadmapTab } from './UserSettingsRoadmapTab';
import { UserSettingsSupportTab } from './UserSettingsSupportTab';

interface UserSettingsSettingsModeProps {
  activeTab: UserSettingsTab;
  changeRequest: string;
  chatContainerRef: RefObject<HTMLDivElement>;
  handleSendRequest: () => void | Promise<void>;
  isAdmin: boolean;
  isSendingRequest: boolean;
  isUnread: (request: UserRequest) => boolean;
  loadRequests: () => void | Promise<void>;
  loadingNotifications: boolean;
  markAsRead: (requestId: string) => void;
  onClose: () => void;
  onOpenSuggestionModal: () => void;
  onVote: (id: string) => void;
  requests: UserRequest[];
  setActiveTab: (tab: UserSettingsTab) => void;
  setChangeRequest: (value: string) => void;
  suggestions: Suggestion[];
  theme: 'light' | 'dark' | 'system';
  toggleTheme: (theme: 'light' | 'dark' | 'system') => void;
  user: User;
}

export function UserSettingsSettingsMode({
  activeTab,
  changeRequest,
  chatContainerRef,
  handleSendRequest,
  isAdmin,
  isSendingRequest,
  isUnread,
  loadRequests,
  loadingNotifications,
  markAsRead,
  onClose,
  onOpenSuggestionModal,
  onVote,
  requests,
  setActiveTab,
  setChangeRequest,
  suggestions,
  theme,
  toggleTheme,
  user,
}: UserSettingsSettingsModeProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200 dark:border-slate-800"
      style={{ fontSize: '16px' }}
    >
      <UserSettingsModalNav activeTab={activeTab} onClose={onClose} setActiveTab={setActiveTab} />

      <div className="flex-1 overflow-y-auto bg-slate-50/30 dark:bg-slate-900/50 p-6 md:p-8 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        {activeTab === 'profile' && <UserSettingsProfileTab user={user} />}

        {activeTab === 'roadmap' && (
          <UserSettingsRoadmapTab
            onOpenSuggestionModal={onOpenSuggestionModal}
            onVote={onVote}
            suggestions={suggestions}
          />
        )}

        {activeTab === 'appearance' && (
          <UserSettingsAppearanceTab
            theme={theme}
            toggleTheme={toggleTheme}
          />
        )}

        {activeTab === 'notifications' && (
          <UserSettingsNotificationsTab
            isAdmin={isAdmin}
            isUnread={isUnread}
            loadRequests={loadRequests}
            loadingNotifications={loadingNotifications}
            markAsRead={markAsRead}
            requests={requests}
          />
        )}

        {activeTab === 'security' && (
          <UserSettingsSupportTab
            changeRequest={changeRequest}
            chatContainerRef={chatContainerRef}
            currentUserId={user.id}
            handleSendRequest={handleSendRequest}
            isSendingRequest={isSendingRequest}
            loadingNotifications={loadingNotifications}
            requests={requests}
            setChangeRequest={setChangeRequest}
          />
        )}
      </div>
    </motion.div>
  );
}
