import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Palette, Save, X } from 'lucide-react';
import type { UserRequest } from '../../../services/requestsService';
import type { User } from '../../../types/auth.types';
import { getAvatarUrl } from '../avatarUtils';
import { USER_SETTINGS_CATEGORIES } from '../userSettings.constants';
import type { UserSettingsTab } from '../userSettings.types';

interface UserSettingsAvatarModeProps {
  activeTab: UserSettingsTab;
  filteredAvatars: Array<{ id: string; label: string }>;
  isSaving: boolean;
  loadingNotifications: boolean;
  markAsRead: (requestId: string) => void;
  onClose: () => void;
  onSaveProfile: () => void | Promise<void>;
  requests: UserRequest[];
  selectedAvatar: string;
  selectedCategory: string;
  setActiveTab: (tab: UserSettingsTab) => void;
  setSelectedAvatar: (avatarId: string) => void;
  setSelectedCategory: (categoryId: string) => void;
  user: User;
  isUnread: (request: UserRequest) => boolean;
}

export function UserSettingsAvatarMode({
  activeTab,
  filteredAvatars,
  isSaving,
  loadingNotifications,
  markAsRead,
  onClose,
  onSaveProfile,
  requests,
  selectedAvatar,
  selectedCategory,
  setActiveTab,
  setSelectedAvatar,
  setSelectedCategory,
  user,
  isUnread,
}: UserSettingsAvatarModeProps) {
  const unreadCount = requests.filter((request) => isUnread(request)).length;

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[32px] shadow-2xl overflow-hidden border border-white/20 dark:border-slate-700/50 flex flex-col max-h-[85vh]"
      style={{ fontSize: '16px' }}
    >
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-teal-500/20 via-blue-500/20 to-purple-500/20 blur-xl pointer-events-none" />

      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 p-2 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-full backdrop-blur-md transition-all"
      >
        <X className="w-5 h-5 text-slate-700 dark:text-slate-200" />
      </button>

      <div className="relative pt-10 pb-6 text-center z-10 px-6">
        <div className="relative inline-block group">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative p-1 rounded-full bg-gradient-to-tr from-teal-400 to-blue-500 shadow-lg"
          >
            <img
              src={getAvatarUrl(user.avatarId || 'zg10')}
              alt="Avatar"
              className="w-28 h-28 rounded-full border-4 border-white dark:border-slate-800 object-cover bg-white"
            />
            <button
              onClick={() => setActiveTab(activeTab === 'profile' ? 'notifications' : 'profile')}
              className="absolute bottom-1 right-1 bg-slate-900 text-white p-2 rounded-full shadow-lg hover:bg-slate-700 transition-colors border-2 border-white dark:border-slate-800"
              title="Alterar avatar"
            >
              <Palette className="w-4 h-4" />
            </button>
          </motion.div>
        </div>

        <h2 className="mt-4 text-2xl font-bold text-slate-800 dark:text-white">{user.nome}</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{user.email}</p>
        <div className="mt-3 flex justify-center gap-2">
          <span className="px-3 py-1 rounded-full bg-teal-100/50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-wider border border-teal-200/50 dark:border-teal-800/50">
            {user.role}
          </span>
        </div>
      </div>

      <div className="flex border-b border-slate-200/60 dark:border-slate-700/60 mx-6">
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex-1 pb-3 text-sm font-bold transition-all relative ${activeTab === 'notifications'
            ? 'text-teal-600 dark:text-teal-400'
            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
        >
          Notificacoes
          {unreadCount > 0 && (
            <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full">
              {unreadCount}
            </span>
          )}
          {activeTab === 'notifications' && (
            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 pb-3 text-sm font-bold transition-all relative ${activeTab === 'profile'
            ? 'text-teal-600 dark:text-teal-400'
            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
        >
          Alterar Avatar
          {activeTab === 'profile' && (
            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500 rounded-full" />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
        <AnimatePresence mode="wait">
          {activeTab === 'profile' ? (
            <motion.div
              key="avatar-grid"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 text-xs font-bold rounded-full transition-all whitespace-nowrap snap-start ${selectedCategory === 'all'
                    ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900 shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                >
                  Tudo
                </button>
                {USER_SETTINGS_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 text-xs font-bold rounded-full transition-all whitespace-nowrap snap-start ${selectedCategory === category.id
                      ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900 shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {filteredAvatars.map((avatar) => (
                  <motion.button
                    key={avatar.id}
                    layoutId={`avatar-${avatar.id}`}
                    onClick={() => setSelectedAvatar(avatar.id)}
                    className={`relative aspect-square rounded-2xl overflow-hidden transition-all ${selectedAvatar === avatar.id
                      ? 'ring-4 ring-teal-500 shadow-lg scale-105 z-10'
                      : 'opacity-80 hover:opacity-100 hover:scale-105'
                      }`}
                  >
                    <img
                      src={getAvatarUrl(avatar.id)}
                      alt={avatar.label}
                      className="w-full h-full object-cover bg-white"
                      loading="lazy"
                    />
                  </motion.button>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => void onSaveProfile()}
                disabled={isSaving || selectedAvatar === user.avatarId}
                className="w-full mt-4 py-3 bg-teal-600 text-white rounded-xl font-bold shadow-lg shadow-teal-600/20 disabled:opacity-50 disabled:shadow-none hover:bg-teal-500 transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Atualizando...' : 'Confirmar Novo Avatar'}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="notifications-list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              {loadingNotifications ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <div className="w-8 h-8 border-4 border-slate-200 border-t-teal-500 rounded-full animate-spin mb-3" />
                  <span className="text-xs font-medium uppercase tracking-widest">Carregando</span>
                </div>
              ) : requests.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-600">
                    <Bell className="w-8 h-8" />
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">Tudo limpo por aqui!</p>
                  <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Nenhuma notificacao nova.</p>
                </div>
              ) : (
                requests.map((request) => {
                  const unread = isUnread(request);
                  return (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => markAsRead(request.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${unread
                        ? 'bg-white dark:bg-slate-800 border-teal-200 dark:border-teal-900 shadow-lg shadow-teal-900/5'
                        : 'bg-slate-50 dark:bg-slate-900/50 border-transparent opacity-75 hover:opacity-100'
                        }`}
                    >
                      <div className="flex gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${unread ? 'bg-teal-500' : 'bg-transparent'}`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs font-bold uppercase tracking-wider ${request.status === 'pending'
                              ? 'text-amber-500'
                              : request.status === 'resolved'
                                ? 'text-green-500'
                                : 'text-red-500'
                              }`}
                            >
                              {request.status === 'pending'
                                ? 'Analise'
                                : request.status === 'resolved'
                                  ? 'Resolvido'
                                  : 'Rejeitado'}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(request.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-slate-700 dark:text-slate-300 leading-snug mb-1.5">
                            {request.content}
                          </p>
                          {request.admin_notes && (
                            <div className="bg-slate-100 dark:bg-slate-950 rounded-lg p-2.5 text-xs text-slate-600 dark:text-slate-400 mt-2 border-l-2 border-teal-500">
                              <span className="block font-bold text-teal-600 dark:text-teal-400 mb-0.5">Admin:</span>
                              {request.admin_notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
