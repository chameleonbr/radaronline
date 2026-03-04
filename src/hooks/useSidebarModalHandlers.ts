import { useCallback, useState } from 'react';

export interface EditModalState {
  isOpen: boolean;
  type: 'objective' | 'activity';
  id: number | string;
  parentId?: number;
  initialValue: string;
}

export interface DeleteModalState {
  isOpen: boolean;
  type: 'objective' | 'activity';
  id: number | string;
  parentId?: number;
  name: string;
}

interface UseSidebarModalHandlersProps {
  onUpdateObjective?: (id: number, title: string) => void;
  onUpdateActivity?: (objectiveId: number, activityId: string, field: string, value: string | number | boolean) => void;
  onDeleteObjective?: (id: number) => void;
  onDeleteActivity?: (objectiveId: number, activityId: string) => void;
}

const defaultEditModal: EditModalState = {
  isOpen: false,
  type: 'objective',
  id: 0,
  initialValue: '',
};

const defaultDeleteModal: DeleteModalState = {
  isOpen: false,
  type: 'objective',
  id: 0,
  name: '',
};

export function useSidebarModalHandlers({
  onUpdateObjective,
  onUpdateActivity,
  onDeleteObjective,
  onDeleteActivity,
}: UseSidebarModalHandlersProps) {
  const [editModal, setEditModal] = useState<EditModalState>(defaultEditModal);
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>(defaultDeleteModal);

  const closeEditModal = useCallback(() => {
    setEditModal(prev => ({ ...prev, isOpen: false }));
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeleteModal(prev => ({ ...prev, isOpen: false }));
  }, []);

  const saveEditModal = useCallback((newName: string) => {
    if (editModal.type === 'objective' && onUpdateObjective) {
      onUpdateObjective(editModal.id as number, newName);
    } else if (editModal.type === 'activity' && onUpdateActivity && editModal.parentId) {
      onUpdateActivity(editModal.parentId, editModal.id as string, 'title', newName);
    }
  }, [editModal, onUpdateActivity, onUpdateObjective]);

  const confirmDeleteModal = useCallback(() => {
    if (deleteModal.type === 'objective' && onDeleteObjective) {
      onDeleteObjective(deleteModal.id as number);
    } else if (deleteModal.type === 'activity' && onDeleteActivity && deleteModal.parentId) {
      onDeleteActivity(deleteModal.parentId, deleteModal.id as string);
    }

    closeDeleteModal();
  }, [closeDeleteModal, deleteModal, onDeleteActivity, onDeleteObjective]);

  const openObjectiveEdit = useCallback((objectiveId: number, initialValue: string) => {
    setEditModal({
      isOpen: true,
      type: 'objective',
      id: objectiveId,
      initialValue,
    });
  }, []);

  const openActivityEdit = useCallback((objectiveId: number, activityId: string, initialValue: string) => {
    setEditModal({
      isOpen: true,
      type: 'activity',
      id: activityId,
      parentId: objectiveId,
      initialValue,
    });
  }, []);

  const openObjectiveDelete = useCallback((objectiveId: number, name: string) => {
    setDeleteModal({
      isOpen: true,
      type: 'objective',
      id: objectiveId,
      name,
    });
  }, []);

  const openActivityDelete = useCallback((objectiveId: number, activityId: string, name: string) => {
    setDeleteModal({
      isOpen: true,
      type: 'activity',
      id: activityId,
      parentId: objectiveId,
      name,
    });
  }, []);

  return {
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
  };
}
