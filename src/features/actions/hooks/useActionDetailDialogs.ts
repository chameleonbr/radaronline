import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { Action } from '../../../types';

interface ConfirmConfig {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'warning' | 'danger' | 'info';
  confirmText: string;
  onConfirm: () => void;
}

interface UseActionDetailDialogsParams {
  isDirty: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSaveShortcut: () => void;
  setDraftAction: Dispatch<SetStateAction<Action | null>>;
  setIsDirty: Dispatch<SetStateAction<boolean>>;
  userCanEdit: boolean;
}

const initialConfirmConfig: ConfirmConfig = {
  isOpen: false,
  title: '',
  message: '',
  type: 'warning',
  confirmText: 'Confirmar',
  onConfirm: () => {},
};

export function useActionDetailDialogs({
  isDirty,
  isOpen,
  onClose,
  onSaveShortcut,
  setDraftAction,
  setIsDirty,
  userCanEdit,
}: UseActionDetailDialogsParams) {
  const [confirmConfig, setConfirmConfig] = useState<ConfirmConfig>(initialConfirmConfig);

  const closeConfirmModal = useCallback(() => {
    setConfirmConfig((previousConfig) => ({ ...previousConfig, isOpen: false }));
  }, []);

  const handleDeleteComment = useCallback((commentId: string) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Excluir Comentário',
      message: 'Tem certeza que deseja excluir este comentário? Esta ação não pode ser desfeita.',
      type: 'danger',
      confirmText: 'Excluir',
      onConfirm: () => {
        setDraftAction((previousAction) => {
          if (!previousAction) {
            return null;
          }

          return {
            ...previousAction,
            comments: previousAction.comments?.filter((comment) => comment.id !== commentId) || [],
          };
        });
        setIsDirty(true);
        closeConfirmModal();
      },
    });
  }, [closeConfirmModal, setDraftAction, setIsDirty]);

  const handleCloseDirty = useCallback(() => {
    if (!isDirty) {
      onClose();
      return;
    }

    setConfirmConfig({
      isOpen: true,
      title: 'Alterações não salvas',
      message: 'Existem alterações no rascunho que não foram salvas. Deseja sair e perder essas alterações?',
      type: 'warning',
      confirmText: 'Sair sem salvar',
      onConfirm: () => {
        closeConfirmModal();
        onClose();
      },
    });
  }, [closeConfirmModal, isDirty, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCloseDirty();
      }

      if (event.key === 's' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        if (userCanEdit) {
          onSaveShortcut();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleCloseDirty, isOpen, onSaveShortcut, userCanEdit]);

  return {
    closeConfirmModal,
    confirmConfig,
    handleCloseDirty,
    handleDeleteComment,
  };
}
