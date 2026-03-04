import { useAdminPanelController } from './useAdminPanelController';
import { Sidebar } from '../../components/layout/Sidebar';
import { MICROREGIOES } from '../../data/microregioes';
import type { Action, TeamMember, Objective, Activity as ActivityType } from '../../types';
import { AdminAccessDenied } from './components/AdminAccessDenied';
import { AdminDesktopContent } from './components/AdminDesktopContent';
import { AdminDesktopHeader } from './components/AdminDesktopHeader';
import { AdminMobileLayout } from './components/AdminMobileLayout';
import { AdminPanelDialogs } from './components/AdminPanelDialogs';
import type { AdminPanelTab as TabType } from './adminPanel.types';

interface AdminPanelProps {
  onBack?: () => void;
  actions?: Action[];
  teams?: Record<string, TeamMember[]>;
  objectives?: Objective[];
  activities?: Record<number, ActivityType[]>;
}

export function AdminPanel(props: AdminPanelProps) {
  const { onBack, actions = [], teams = {}, objectives = [], activities = {} } = props;
  const controller = useAdminPanelController({ activities, objectives, onBack });

  if (!controller.isAdmin && controller.currentUser?.role !== 'gestor') {
    return <AdminAccessDenied onBack={onBack} />;
  }

  if (controller.isCompactLayout) {
    return (
      <>
        <AdminMobileLayout
          actions={actions}
          activeTab={controller.activeTab}
          dashboardFilters={controller.dashboardFilters}
          expandedUserId={controller.expandedUserId}
          filteredUsers={controller.filteredUsers}
          getRoleBadge={controller.getRoleBadge}
          isLoading={controller.isLoading}
          isSuperAdmin={controller.isSuperAdmin}
          onCreatePendingUser={controller.handleOpenPendingUserCreation}
          onCreateUser={controller.handleCreateUser}
          onEditUser={(user) => {
            controller.setEditingUser(user);
            controller.setShowUserModal(true);
            controller.setExpandedUserId(null);
          }}
          onMapMicroSelect={controller.setSelectedMobileMicroId}
          onOpenMicroSelector={() => controller.setShowMicroSelector(true)}
          onRefreshUsers={controller.loadUsers}
          onRequestDeleteUser={(user) => {
            controller.setConfirmDelete({ open: true, user });
            controller.setExpandedUserId(null);
          }}
          onRequestToggleUserStatus={(user) => {
            controller.setConfirmToggle({ open: true, user, nextStatus: user.ativo === false });
            controller.setExpandedUserId(null);
          }}
          onSearchTermChange={controller.setSearchTerm}
          onTabChange={controller.setActiveTab}
          onToggleExpandedUser={(userId) => controller.setExpandedUserId(controller.expandedUserId === userId ? null : userId)}
          onUserFilterMacroChange={(value) => {
            controller.handleDesktopUserFilterMacroChange(value);
          }}
          onViewMicrorregiao={controller.handleViewMicrorregiao}
          pendingRegistrations={controller.pendingRegistrations}
          searchTerm={controller.searchTerm}
          setDashboardFilters={controller.setDashboardFilters}
          userFilterMacro={controller.userFilterMacro}
          users={controller.users}
        />
        <AdminPanelDialogs
          actions={actions}
          confirmDelete={controller.confirmDelete}
          confirmToggle={controller.confirmToggle}
          dashboardSelectedMicroId={controller.dashboardFilters.selectedMicroId}
          editingUser={controller.editingUser}
          isSavingUser={controller.actionLoadingId === 'save-user'}
          isSettingsModalOpen={controller.isSettingsModalOpen}
          onCloseConfirmDelete={() => controller.setConfirmDelete({ open: false })}
          onCloseConfirmToggle={() => controller.setConfirmToggle({ open: false })}
          onCloseMicroSelector={() => controller.setShowMicroSelector(false)}
          onCloseMobileMicro={() => controller.setSelectedMobileMicroId(null)}
          onCloseSettings={() => controller.setIsSettingsModalOpen(false)}
          onCloseUserModal={controller.handleCloseUserModal}
          onConfirmDelete={controller.handleConfirmDeleteUser}
          onConfirmToggle={controller.handleConfirmToggleStatus}
          onOpenMobileMicroPanel={(microId) => {
            controller.handleViewMicrorregiao(microId);
            controller.setSelectedMobileMicroId(null);
          }}
          onSaveUser={controller.handleSaveUserFromModal}
          onSelectMicroregion={controller.handleViewMicrorregiao}
          pendingUserData={controller.pendingUserData}
          selectedMobileMicroId={controller.selectedMobileMicroId}
          settingsInitialTab={controller.settingsInitialTab}
          settingsMode={controller.settingsMode}
          showMicroSelector={controller.showMicroSelector}
          showUserModal={controller.showUserModal}
          users={controller.users}
          variant="mobile"
        />
      </>
    );
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-900 overflow-hidden transition-colors duration-200">
      <Sidebar
        activities={activities}
        adminActiveTab={controller.activeTab}
        currentNav={controller.currentNav}
        isAdmin={controller.isAdmin}
        isEditMode={false}
        isOpen={controller.isSidebarOpen}
        objectives={objectives}
        onAdminTabChange={(tab: string) => controller.setActiveTab(tab as TabType)}
        onLogout={controller.logout}
        onOpenSettings={(mode) => {
          if (mode === 'avatar') {
            controller.setSettingsInitialTab('profile');
            controller.setSettingsMode('avatar');
          } else {
            controller.setSettingsInitialTab('appearance');
            controller.setSettingsMode('settings');
          }
          controller.setIsSettingsModalOpen(true);
        }}
        onProfileClick={() => {
          controller.setSettingsInitialTab('profile');
          controller.setSettingsMode('avatar');
          controller.setIsSettingsModalOpen(true);
        }}
        onSelectMicroregiao={controller.handleViewMicrorregiao}
        onToggle={() => controller.setIsSidebarOpen(!controller.isSidebarOpen)}
        onViewAllMicroregioes={() => controller.setActiveTab('microregioes')}
        selectedActivity={controller.selectedActivity}
        selectedObjective={controller.selectedObjective}
        setCurrentNav={(nav: string) => controller.setCurrentNav(nav as 'strategy' | 'home' | 'settings')}
        setSelectedActivity={controller.setSelectedActivity}
        setSelectedObjective={controller.setSelectedObjective}
        setViewMode={() => {}}
        showPlanningNavigation={false}
        userAvatarId={controller.currentUser?.avatarId}
        userName={controller.currentUser?.nome}
        userRole={controller.currentUser?.role}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminDesktopHeader
          isFullscreen={controller.isFullscreen}
          isLoading={controller.isLoading}
          isSuperAdmin={controller.isSuperAdmin}
          microregionsCount={MICROREGIOES.length}
          onRefreshUsers={controller.loadUsers}
          onToggleFullscreen={controller.toggleFullscreen}
        />

        <AdminDesktopContent
          actionLoadingId={controller.actionLoadingId}
          actions={actions}
          activeTab={controller.activeTab}
          dashboardFilters={controller.dashboardFilters}
          dropdownPosition={controller.dropdownPosition}
          expandedUserId={controller.expandedUserId}
          filterRole={controller.filterRole}
          filteredMicroregioes={controller.filteredMicroregioes}
          filteredUsers={controller.filteredUsers}
          getRoleBadge={controller.getRoleBadge}
          isLoading={controller.isLoading}
          isSuperAdmin={controller.isSuperAdmin}
          microregionsFilterMacro={controller.filterMacro}
          onCreatePendingUser={controller.handleOpenPendingUserCreation}
          onCreateUser={controller.handleCreateUser}
          onDeletePendingRegistration={controller.handleDeletePendingRegistrationRequest}
          onEditUser={controller.handleEditDesktopUser}
          onFilterRoleChange={controller.setFilterRole}
          onMicroregionsFilterMacroChange={controller.setFilterMacro}
          onMicroregionsSearchTermChange={controller.setSearchTerm}
          onRequestDeleteUser={controller.handleRequestDesktopUserDelete}
          onSearchTermChange={controller.setSearchTerm}
          onTabChange={controller.setActiveTab}
          onToggleExpandedUserMenu={controller.handleToggleDesktopUserMenu}
          onToggleUserStatus={controller.handleToggleDesktopUserStatus}
          onUserFilterMacroChange={controller.handleDesktopUserFilterMacroChange}
          onUserFilterMicroChange={controller.handleDesktopUserFilterMicroChange}
          onViewMicrorregiao={controller.handleViewMicrorregiao}
          onViewUserMicrorregiao={controller.handleViewDesktopUserMicroregion}
          pendingLoading={controller.pendingLoading}
          pendingRegistrations={controller.pendingRegistrations}
          searchTerm={controller.searchTerm}
          setDashboardFilters={controller.setDashboardFilters}
          teams={teams}
          userFilterMacro={controller.userFilterMacro}
          userFilterMicro={controller.userFilterMicro}
          users={controller.users}
        />

        <AdminPanelDialogs
          actions={actions}
          confirmDelete={controller.confirmDelete}
          confirmToggle={controller.confirmToggle}
          editingUser={controller.editingUser}
          isSavingUser={controller.actionLoadingId === 'save-user'}
          isSettingsModalOpen={controller.isSettingsModalOpen}
          onCloseConfirmDelete={() => controller.setConfirmDelete({ open: false })}
          onCloseConfirmToggle={() => controller.setConfirmToggle({ open: false })}
          onCloseExpandedUserOverlay={() => controller.setExpandedUserId(null)}
          onCloseSettings={() => controller.setIsSettingsModalOpen(false)}
          onCloseUserModal={controller.handleCloseUserModal}
          onConfirmDelete={controller.handleConfirmDeleteUser}
          onConfirmToggle={controller.handleConfirmToggleStatus}
          onSaveUser={controller.handleSaveUserFromModal}
          pendingUserData={controller.pendingUserData}
          settingsInitialTab={controller.settingsInitialTab}
          settingsMode={controller.settingsMode}
          showExpandedUserOverlay={!!controller.expandedUserId}
          showUserModal={controller.showUserModal}
          users={controller.users}
          variant="desktop"
        />
      </div>
    </div>
  );
}


