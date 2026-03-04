import { Action } from '../../../types';
import { User } from '../../../types/auth.types';
import { MicroregionSelector } from '../../../components/common/MicroregionSelector';
import { ConfirmModal } from '../../../components/common/ConfirmModal';
import { UserSettingsModal } from '../../settings/UserSettingsModal';
import MicroDetailModal from '../dashboard/MicroDetailModal';
import { UserFormModal } from '../UserFormModal';
import {
  AdminDeleteState,
  AdminToggleState,
  AdminUserPayload,
  PendingUserData,
} from '../adminPanel.types';

interface AdminPanelDialogsProps {
  variant: 'mobile' | 'desktop';
  showUserModal: boolean;
  editingUser: User | null;
  pendingUserData: PendingUserData | null;
  isSavingUser: boolean;
  confirmToggle: AdminToggleState;
  confirmDelete: AdminDeleteState;
  isSettingsModalOpen: boolean;
  settingsInitialTab: 'profile' | 'appearance';
  settingsMode: 'settings' | 'avatar';
  selectedMobileMicroId?: string | null;
  showMicroSelector?: boolean;
  dashboardSelectedMicroId?: string | null;
  actions?: Action[];
  users?: User[];
  showExpandedUserOverlay?: boolean;
  onCloseUserModal: () => void;
  onSaveUser: (userData: AdminUserPayload) => Promise<void>;
  onCloseConfirmToggle: () => void;
  onConfirmToggle: () => Promise<void>;
  onCloseConfirmDelete: () => void;
  onConfirmDelete: () => Promise<void>;
  onCloseSettings: () => void;
  onCloseExpandedUserOverlay?: () => void;
  onCloseMobileMicro?: () => void;
  onOpenMobileMicroPanel?: (microId: string) => void;
  onCloseMicroSelector?: () => void;
  onSelectMicroregion?: (microId: string) => void;
}

export function AdminPanelDialogs({
  variant,
  showUserModal,
  editingUser,
  pendingUserData,
  isSavingUser,
  confirmToggle,
  confirmDelete,
  isSettingsModalOpen,
  settingsInitialTab,
  settingsMode,
  selectedMobileMicroId,
  showMicroSelector,
  dashboardSelectedMicroId,
  actions = [],
  users = [],
  showExpandedUserOverlay = false,
  onCloseUserModal,
  onSaveUser,
  onCloseConfirmToggle,
  onConfirmToggle,
  onCloseConfirmDelete,
  onConfirmDelete,
  onCloseSettings,
  onCloseExpandedUserOverlay,
  onCloseMobileMicro,
  onOpenMobileMicroPanel,
  onCloseMicroSelector,
  onSelectMicroregion,
}: AdminPanelDialogsProps) {
  const nextStatus = confirmToggle.nextStatus ?? false;
  const toggleTitle = nextStatus ? 'Ativar usuario' : 'Desativar usuario';
  const toggleMessage = confirmToggle.user
    ? variant === 'mobile'
      ? `Deseja ${nextStatus ? 'ativar' : 'desativar'} "${confirmToggle.user.nome}"?`
      : `Tem certeza que deseja ${nextStatus ? 'ativar' : 'desativar'} ${confirmToggle.user.nome}?`
    : '';

  const deleteTitle =
    variant === 'mobile' ? 'Excluir usuario' : 'Excluir usuario permanentemente';
  const deleteMessage = confirmDelete.user
    ? variant === 'mobile'
      ? `Excluir "${confirmDelete.user.nome}" permanentemente?`
      : `ATENCAO: Esta acao e irreversivel. O usuario "${confirmDelete.user.nome}" sera excluido permanentemente do sistema. Tem certeza?`
    : '';

  return (
    <>
      {showUserModal && (
        <UserFormModal
          user={editingUser}
          onClose={onCloseUserModal}
          onSave={onSaveUser}
          isSaving={isSavingUser}
          fullScreen={variant === 'mobile'}
          initialData={pendingUserData || undefined}
        />
      )}

      <ConfirmModal
        isOpen={confirmToggle.open}
        onClose={onCloseConfirmToggle}
        onConfirm={onConfirmToggle}
        title={toggleTitle}
        message={toggleMessage}
        confirmText={nextStatus ? 'Ativar' : 'Desativar'}
        confirmType={nextStatus ? 'info' : variant === 'mobile' ? 'warning' : 'danger'}
      />

      <ConfirmModal
        isOpen={confirmDelete.open}
        onClose={onCloseConfirmDelete}
        onConfirm={onConfirmDelete}
        title={deleteTitle}
        message={deleteMessage}
        confirmText={variant === 'mobile' ? 'Excluir' : 'Sim, excluir permanentemente'}
        confirmType="danger"
      />

      {!!selectedMobileMicroId && onCloseMobileMicro && onOpenMobileMicroPanel && (
        <MicroDetailModal
          isOpen={!!selectedMobileMicroId}
          microId={selectedMobileMicroId}
          onClose={onCloseMobileMicro}
          onOpenPanel={(microId) => onOpenMobileMicroPanel(microId)}
          actions={actions}
          users={users}
        />
      )}

      {typeof showMicroSelector === 'boolean' && onCloseMicroSelector && onSelectMicroregion && (
        <MicroregionSelector
          selectedMicroId={dashboardSelectedMicroId ?? null}
          onSelect={onSelectMicroregion}
          actions={actions}
          isOpen={showMicroSelector}
          onClose={onCloseMicroSelector}
        />
      )}

      {showExpandedUserOverlay && onCloseExpandedUserOverlay && (
        <div className="fixed inset-0 z-0" onClick={onCloseExpandedUserOverlay} />
      )}

      <UserSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={onCloseSettings}
        initialTab={settingsInitialTab}
        mode={settingsMode}
      />
    </>
  );
}
