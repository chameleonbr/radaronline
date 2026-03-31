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
import { UserSettingsNsdigiTab } from './UserSettingsNsdigiTab';

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
      className="relative flex max-h-[92vh] w-full max-w-5xl flex-row overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
      style={{ fontSize: '16px' }}
    >
      <div className="shrink-0 w-[60px] md:w-[230px] self-stretch">
        <UserSettingsModalNav activeTab={activeTab} onClose={onClose} setActiveTab={setActiveTab} />
      </div>

      <div className="relative min-h-0 flex-1 overflow-y-auto bg-slate-50/30 p-6 dark:bg-slate-900/50 md:p-8">
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

        {activeTab === 'nsdigi' && <UserSettingsNsdigiTab />}
      </div>
    </motion.div>
  );
}
