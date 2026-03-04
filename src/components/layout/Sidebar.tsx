import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, ChevronLeft, ChevronRight, Triangle } from 'lucide-react';

import { slideInLeft } from '../../lib/motion';
import { Objective } from '../../types';
import { UserRole } from '../../types/auth.types';
import { useStrategyViewHandlers } from '../../hooks/useStrategyViewHandlers';
import { useSidebarModalHandlers } from '../../hooks/useSidebarModalHandlers';
import { SidebarSecurityModals } from './sidebar/SidebarSecurityModals';
import { SidebarAdminNavigation } from './sidebar/SidebarAdminNavigation';
import { SidebarPlanningNavigation } from './sidebar/SidebarPlanningNavigation';
import { SidebarCommunityNavigation } from './sidebar/SidebarCommunityNavigation';
import { SidebarFooter } from './sidebar/SidebarFooter';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentNav: string;
  setCurrentNav: React.Dispatch<React.SetStateAction<string>> | ((nav: string) => void);
  selectedObjective: number | null;
  setSelectedObjective: React.Dispatch<React.SetStateAction<number>>;
  selectedActivity: string | null;
  setSelectedActivity: React.Dispatch<React.SetStateAction<string>>;
  viewMode?: 'table' | 'gantt' | 'team' | 'optimized' | 'calendar';
  setViewMode: React.Dispatch<React.SetStateAction<'table' | 'gantt' | 'team' | 'optimized' | 'calendar'>> | (() => void);
  objectives: Objective[];
  activities: Record<number, { id: string; title: string }[]>;
  onProfileClick?: () => void;
  onAdminClick?: () => void;
  isMobile?: boolean;
  userName?: string;
  userRole?: UserRole;
  userAvatarId?: string;
  onLogout?: () => void;
  isAdmin?: boolean;
  onOpenSettings?: (mode?: 'settings' | 'avatar') => void;
  onAddObjective?: () => void;
  onDeleteObjective?: (id: number) => void;
  onUpdateObjective?: (id: number, title: string) => void;
  onAddActivity?: (id: number) => void;
  onDeleteActivity?: (objId: number, actId: string) => void;
  onUpdateActivity?: (objId: number, actId: string, field: string, value: string | number | boolean) => void;
  isEditMode?: boolean;
  onToggleEditMode?: () => void;
  onSelectMicroregiao?: (id: string) => void;
  onViewAllMicroregioes?: () => void;
  showPlanningNavigation?: boolean;
  // Admin Panel Tab navigation
  adminActiveTab?: string;
  onAdminTabChange?: (tab: string) => void;
  showNotifications?: boolean;
  // Workspace mode
  currentWorkspace?: 'planning' | 'community';
  onSwitchWorkspace?: () => void;
}

const SidebarContent: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  currentNav,
  setCurrentNav,
  selectedObjective,
  setSelectedObjective,
  selectedActivity,
  setSelectedActivity,
  viewMode,
  setViewMode,
  objectives,
  activities,
  isMobile = false,
  userName,
  userRole,
  userAvatarId,
  onLogout,
  isAdmin = false,
  onOpenSettings,
  onAddObjective,
  onDeleteObjective,
  onUpdateObjective,
  onAddActivity,
  onDeleteActivity,
  onUpdateActivity,
  isEditMode = false,
  onToggleEditMode: _onToggleEditMode,
  onSelectMicroregiao,
  onViewAllMicroregioes: _onViewAllMicroregioes,
  showPlanningNavigation = true,
  adminActiveTab,
  onAdminTabChange,
  onAdminClick,
  showNotifications = true,
  currentWorkspace = 'planning',
  onSwitchWorkspace,
}) => {
  // No mobile, sidebar começa fechada e é overlay - memoizado para evitar recálculos
  const sidebarClasses = useMemo(() => isMobile
    ? `fixed inset-y-0 left-0 z-50 ${isOpen ? 'w-[280px]' : 'w-0 overflow-hidden'}`
    : `${isOpen ? 'w-[280px]' : 'w-[80px]'} shrink-0`, [isMobile, isOpen]);



  const {
    editModal,
    deleteModal,
    closeEditModal,
    closeDeleteModal,
    saveEditModal,
    confirmDeleteModal,
    openObjectiveEdit,
    openActivityEdit,
    openObjectiveDelete,
    openActivityDelete,
  } = useSidebarModalHandlers({
    onUpdateObjective,
    onUpdateActivity,
    onDeleteObjective,
    onDeleteActivity,
  });

  const {
    openNewsFeed,
    openDashboard,
    openStrategyObjective,
    openStrategyRoot,
    openStrategyTeam,
    openStrategyCalendar,
  } = useStrategyViewHandlers({
    objectives,
    activities,
    setCurrentNav,
    setSelectedObjective,
    setSelectedActivity,
    setViewMode: setViewMode as (mode: 'table' | 'gantt' | 'team' | 'optimized' | 'calendar') => void,
  });

  return (
    <>
      {/* Overlay mobile - Com animação fade */}
      {isMobile && isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/60 z-40"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Modais de seguranca */}
      <SidebarSecurityModals
        editModal={editModal}
        deleteModal={deleteModal}
        closeEditModal={closeEditModal}
        closeDeleteModal={closeDeleteModal}
        saveEditModal={saveEditModal}
        confirmDeleteModal={confirmDeleteModal}
      />

      <motion.aside
        data-tour="sidebar"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={slideInLeft}
        drag={isMobile ? "x" : false}
        dragConstraints={{ left: -280, right: 0 }}
        dragElastic={0.1}
        onDragEnd={(_, info) => {
          if (isMobile && info.offset.x < -100) {
            onToggle();
          }
        }}
        className={`${sidebarClasses} flex flex-col z-50 transition-all duration-300 ease-out relative shadow-2xl bg-gradient-to-b from-[#0e7490] to-[#047857] dark:from-slate-900 dark:to-slate-950 dark:border-r dark:border-slate-800 text-white touch-pan-y`}
      >
        {/* Mobile drag handle */}
        {isMobile && isOpen && (
          <div className="absolute top-1/2 -translate-y-1/2 right-2 flex flex-col gap-1 opacity-40">
            <div className="w-1 h-8 bg-white/50 rounded-full" />
          </div>
        )}

        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-[-50px] left-[-50px] w-[200px] h-[200px] bg-white rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-[-50px] right-[-50px] w-[200px] h-[200px] bg-emerald-400 rounded-full blur-3xl opacity-20" />
        </div>

        {!isMobile && (
          <button
            onClick={onToggle}
            aria-label={isOpen ? "Recolher menu lateral" : "Expandir menu lateral"}
            className="absolute -right-3 top-8 bg-white text-[#0e7490] rounded-full p-1.5 border border-slate-200 shadow-lg hover:scale-110 hover:bg-slate-50 transition-all z-50 group"
          >
            {isOpen ? <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> : <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />}
          </button>
        )}

        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className={`p-6 flex items-center gap-4 ${!isOpen && 'justify-center'}`}>
            <div className={`rounded-xl bg-white/30 flex items-center justify-center text-white shadow-inner border border-white/30 transition-all duration-150 ${isOpen ? 'w-10 h-10' : 'w-10 h-10 p-2'}`}>
              <Triangle size={isOpen ? 22 : 24} fill="currentColor" className="text-white" />
            </div>
            {isOpen && (
              <div className="flex flex-col animate-fade-in">
                <div className="font-extrabold text-xl tracking-tight leading-none text-white drop-shadow-sm flex items-center gap-1">
                  RADAR <span className="font-light opacity-80">NSDIGI</span>
                </div>
                <div className="text-[9px] font-medium text-teal-100/70 tracking-[0.2em] uppercase mt-1">
                  Transformação Digital
                </div>
              </div>
            )}
          </div>

          {/* Unified Navigation - "Planejamento" Flow */}
          <div className={`flex-1 px-4 py-3 space-y-1 ${isOpen ? 'overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30' : 'overflow-visible'} relative z-20`}>

            {/* Admin Panel Navigation - Only visible when in Admin Panel view */}
            {!showPlanningNavigation && onAdminTabChange && (
              <SidebarAdminNavigation
                isOpen={isOpen}
                adminActiveTab={adminActiveTab}
                onAdminTabChange={onAdminTabChange}
                onSelectMicroregiao={onSelectMicroregiao}
              />
            )}
            {/* Planning Navigation - Only visible when in Planning workspace */}
            {showPlanningNavigation && currentWorkspace === 'planning' && (
              <>
                {onSwitchWorkspace && (
                  <button
                    onClick={onSwitchWorkspace}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl w-full transition-all duration-200 mb-3 text-white/70 hover:bg-white/10 hover:text-white font-medium border border-white/10 ${isOpen ? '' : 'justify-center'}`}
                    title={isOpen ? '' : 'Ir para o Hub'}
                  >
                    <ArrowLeftRight size={16} className="shrink-0" />
                    {isOpen && <span className="text-xs truncate">Ir para o Hub</span>}
                  </button>
                )}

                <SidebarPlanningNavigation
                  isOpen={isOpen}
                  isAdmin={isAdmin}
                  userRole={userRole}
                  isEditMode={isEditMode}
                  currentNav={currentNav}
                  viewMode={viewMode}
                  selectedObjective={selectedObjective}
                  selectedActivity={selectedActivity}
                  objectives={objectives}
                  activities={activities}
                  onAdminClick={onAdminClick}
                  onAddObjective={onAddObjective}
                  onDeleteObjective={onDeleteObjective}
                  onUpdateObjective={onUpdateObjective}
                  onAddActivity={onAddActivity}
                  onDeleteActivity={onDeleteActivity}
                  onUpdateActivity={onUpdateActivity}
                  showNotifications={showNotifications}
                  onAdminTabChange={onAdminTabChange}
                  openNewsFeed={openNewsFeed}
                  openDashboard={openDashboard}
                  openStrategyRoot={openStrategyRoot}
                  openStrategyObjective={openStrategyObjective}
                  openStrategyTeam={openStrategyTeam}
                  openStrategyCalendar={openStrategyCalendar}
                  openObjectiveEdit={openObjectiveEdit}
                  openActivityEdit={openActivityEdit}
                  openObjectiveDelete={openObjectiveDelete}
                  openActivityDelete={openActivityDelete}
                />
              </>
            )}
            {/* Community Navigation - Only visible when in Community workspace */}
            {showPlanningNavigation && currentWorkspace === 'community' && onSwitchWorkspace && (
              <SidebarCommunityNavigation
                isOpen={isOpen}
                currentNav={currentNav}
                onNavigate={(nav: string) => setCurrentNav(nav)}
                onSwitchWorkspace={onSwitchWorkspace}
              />
            )}
          </div>

          <SidebarFooter
            isOpen={isOpen}
            currentNav={currentNav}
            userName={userName}
            userRole={userRole}
            userAvatarId={userAvatarId}
            onOpenSettings={onOpenSettings}
            onLogout={onLogout}
          />
        </div>
      </motion.aside>
    </>
  );
};

export const Sidebar = React.memo(SidebarContent);
