import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Target, 
  ChevronDown, 
  ChevronRight, 
  Shield, 
  Settings, 
  LogOut,
  User,
  Triangle,
  Calendar,
  Edit2
} from 'lucide-react';
import { Objective } from '../../types';
import { getObjectiveTitleWithoutNumber } from '../../lib/text';
import { UserRole } from '../../types/auth.types';
import { getAvatarUrl } from '../../features/settings/UserSettingsModal';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  objectives: Objective[];
  activities: Record<number, { id: string; title: string }[]>;
  selectedObjective: number;
  selectedActivity: string;
  onSelectObjective: (id: number) => void;
  onSelectActivity: (id: string) => void;
  onGoToStrategy: () => void;
  // User info
  userName?: string;
  userRole?: UserRole;
  userAvatarId?: string;
  // Actions
  isAdmin?: boolean;
  onAdminClick?: () => void;
  onSettingsClick?: () => void;
  onAvatarClick?: () => void;
  onCalendarClick?: () => void;
  onLogout?: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  objectives,
  activities,
  selectedObjective,
  selectedActivity,
  onSelectObjective,
  onSelectActivity,
  onGoToStrategy,
  userName,
  userRole,
  userAvatarId,
  isAdmin,
  onAdminClick,
  onSettingsClick,
  onAvatarClick,
  onCalendarClick,
  onLogout,
}) => {
  const [expandedObjectives, setExpandedObjectives] = useState<Set<number>>(
    new Set([selectedObjective])
  );

  const toggleObjective = (id: number) => {
    setExpandedObjectives(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectActivity = (objId: number, actId: string) => {
    onSelectObjective(objId);
    onSelectActivity(actId);
    onGoToStrategy();
    onClose();
  };

  const getRoleLabel = (role?: UserRole) => {
    if (!role) return 'Usuário';
    const labels: Record<UserRole, string> = {
      superadmin: 'Super Admin',
      admin: 'Administrador',
      gestor: 'Gestor Regional',
      usuario: 'Usuário',
    };
    return labels[role];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-y-0 left-0 w-[85vw] max-w-[320px] bg-gradient-to-b from-[#0e7490] to-[#047857] dark:from-slate-900 dark:to-slate-950 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-5 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Triangle size={22} fill="currentColor" className="text-white" />
                </div>
                <div>
                  <div className="font-bold text-white text-lg">RADAR</div>
                  <div className="text-[10px] text-teal-100/70 uppercase tracking-wider">Menu</div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 text-white/80 hover:bg-white/20 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* User Profile Card - Clicável para editar avatar */}
            <button
              onClick={() => {
                if (onAvatarClick) {
                  onAvatarClick();
                  onClose();
                }
              }}
              className="mx-4 mt-4 p-4 bg-white/10 rounded-xl w-[calc(100%-2rem)] text-left hover:bg-white/15 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/30">
                    {userAvatarId ? (
                      <img 
                        src={getAvatarUrl(userAvatarId)} 
                        alt="" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
                        <User size={24} className="text-white" />
                      </div>
                    )}
                  </div>
                  {/* Edit indicator */}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Edit2 size={10} className="text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">{userName || 'Usuário'}</p>
                  <p className="text-xs text-teal-100/70">{getRoleLabel(userRole)}</p>
                </div>
              </div>
            </button>

            {/* Admin Button - If applicable */}
            {isAdmin && onAdminClick && (
              <div className="px-4 mt-3">
                <button
                  onClick={() => {
                    onAdminClick();
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-indigo-500/30 to-purple-500/30 border border-indigo-400/30 text-white hover:from-indigo-500/50 hover:to-purple-500/50 transition-all"
                >
                  <Shield size={20} />
                  <span className="font-semibold">Painel Administrativo</span>
                </button>
              </div>
            )}

            {/* Objectives Section */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="space-y-2">
                {objectives.map((obj, objIndex) => {
                  const isExpanded = expandedObjectives.has(obj.id);
                  const objActivities = activities[obj.id] || [];

                  return (
                    <div key={obj.id} className="bg-white/5 rounded-xl overflow-hidden">
                      {/* Objective Header */}
                      <button
                        onClick={() => toggleObjective(obj.id)}
                        className={`w-full flex items-center gap-2 p-3 text-left transition-colors ${
                          selectedObjective === obj.id 
                            ? 'bg-emerald-500/20 text-white' 
                            : 'text-white/80 hover:bg-white/5'
                        }`}
                      >
                        <span className={`transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`}>
                          <ChevronDown size={16} />
                        </span>
                        <span className="w-6 h-6 rounded-lg bg-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-300">
                          {objIndex + 1}
                        </span>
                        <span className="flex-1 text-sm font-medium truncate">
                          {getObjectiveTitleWithoutNumber(obj.title)}
                        </span>
                      </button>

                      {/* Activities List */}
                      <AnimatePresence>
                        {isExpanded && objActivities.length > 0 && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-white/5"
                          >
                            <div className="p-2 pl-8 space-y-1">
                              {objActivities.map((act) => (
                                <button
                                  key={act.id}
                                  onClick={() => handleSelectActivity(obj.id, act.id)}
                                  className={`w-full flex items-center gap-2 p-2 rounded-lg text-left text-sm transition-colors ${
                                    selectedObjective === obj.id && selectedActivity === act.id
                                      ? 'bg-teal-500/30 text-white font-medium'
                                      : 'text-white/60 hover:bg-white/5 hover:text-white/80'
                                  }`}
                                >
                                  <ChevronRight size={14} className="text-teal-400/50" />
                                  <span className="truncate">{act.title}</span>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-white/10 space-y-2">
              {onSettingsClick && (
                <button
                  onClick={() => {
                    onSettingsClick();
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-white/70 hover:bg-white/10 transition-colors"
                >
                  <Settings size={20} />
                  <span className="font-medium">Configurações</span>
                </button>
              )}
              {onLogout && (
                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-rose-300 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Sair</span>
                </button>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileDrawer;
