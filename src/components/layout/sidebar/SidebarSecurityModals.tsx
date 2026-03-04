import { EditNameModal } from '../../common/EditNameModal';
import { SecureDeleteModal } from '../../common/SecureDeleteModal';
import type { DeleteModalState, EditModalState } from '../../../hooks/useSidebarModalHandlers';

interface SidebarSecurityModalsProps {
  editModal: EditModalState;
  deleteModal: DeleteModalState;
  closeEditModal: () => void;
  closeDeleteModal: () => void;
  saveEditModal: (newName: string) => void;
  confirmDeleteModal: () => void;
}

export function SidebarSecurityModals({
  editModal,
  deleteModal,
  closeEditModal,
  closeDeleteModal,
  saveEditModal,
  confirmDeleteModal,
}: SidebarSecurityModalsProps) {
  return (
    <>
      <EditNameModal
        isOpen={editModal.isOpen}
        onClose={closeEditModal}
        onSave={saveEditModal}
        title={`Editar ${editModal.type === 'objective' ? 'Objetivo' : 'Atividade'}`}
        initialValue={editModal.initialValue}
      />

      <SecureDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteModal}
        title={`Excluir ${deleteModal.type === 'objective' ? 'Objetivo' : 'Atividade'}`}
        itemName={deleteModal.name}
      />
    </>
  );
}
