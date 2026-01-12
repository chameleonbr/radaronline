import { useCallback } from 'react';
import { Action, RaciRole, ActionComment, Status } from '../types';
import { findActionByUid } from '../types';
import { useToast } from '../components/common';

interface UseActionHandlersProps {
  actions: Action[];
  setActions: React.Dispatch<React.SetStateAction<Action[]>>;
  setExpandedActionUid: (uid: string | null) => void;
  setIsSaving: (saving: boolean) => void;
  setConfirmModal: (modal: {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }) => void;
  checkCanEdit: (action: Action) => boolean;
  checkCanDelete: (action: Action) => boolean;
  checkCanCreate: () => boolean;
  checkCanManageTeam: (action: Action) => boolean;
  isViewingAllMicros: boolean;
  isAdmin: boolean;
  currentMicroId: string;
  allTeams: any[];
  currentTeam: any[];
}

export function useActionHandlers({
  actions,
  setActions,
  setExpandedActionUid,
  setIsSaving,
  setConfirmModal,
  checkCanEdit,
  checkCanDelete,
  checkCanCreate,
  checkCanManageTeam,
  isViewingAllMicros,
  isAdmin,
  currentMicroId,
  allTeams,
  currentTeam,
}: UseActionHandlersProps) {
  const { showToast } = useToast();

  type EditableActionField = 'title' | 'status' | 'startDate' | 'plannedEndDate' | 'endDate' | 'progress' | 'notes';

  const handleUpdateAction = useCallback((uid: string, field: EditableActionField | string, value: string | number) => {
    if (isViewingAllMicros && !isAdmin) {
      showToast('Selecione uma microrregião específica para editar', 'error');
      return;
    }

    const action = findActionByUid(actions, uid);
    if (!action) {
      showToast('Ação não encontrada', 'error');
      return;
    }

    if (!checkCanEdit(action)) {
      showToast('Você não tem permissão para editar esta ação', 'error');
      return;
    }

    setActions(prev => prev.map(a => {
      if (a.uid === uid) {
        const updates: Partial<Action> = {};
        if (field === 'title') updates.title = value as string;
        if (field === 'status') updates.status = value as Status;
        if (field === 'startDate') updates.startDate = value as string;
        if (field === 'plannedEndDate') updates.plannedEndDate = value as string;
        if (field === 'endDate') updates.endDate = value as string;
        if (field === 'progress') updates.progress = value as number;
        if (field === 'notes') updates.notes = value as string;
        return { ...a, ...updates };
      }
      return a;
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions, showToast, checkCanEdit, isViewingAllMicros, isAdmin]); // setActions é estável

  const handleSaveAction = useCallback(() => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast('Alterações salvas!', 'success');
    }, 500);
  }, [setIsSaving, showToast]);

  const handleCreateAction = useCallback(() => {
    if (!checkCanCreate()) {
      showToast('Você não tem permissão para criar ações', 'error');
      return;
    }

    if (isAdmin && isViewingAllMicros) {
      // Admin vendo todas as micros precisa escolher qual micro criar
      // Isso é tratado no App.tsx com modal
      return;
    }
    // Lógica de criação será implementada depois
    showToast('Criação de ação em breve', 'info');
  }, [checkCanCreate, showToast, isAdmin, isViewingAllMicros]);

  const handleDeleteAction = useCallback((uid: string) => {
    if (isViewingAllMicros && !isAdmin) {
      showToast('Selecione uma microrregião específica para excluir', 'error');
      return;
    }

    const action = findActionByUid(actions, uid);
    if (!action) {
      showToast('Ação não encontrada', 'error');
      return;
    }

    if (!isAdmin && action.microregiaoId !== currentMicroId) {
      showToast('Você não pode excluir ações de outra microrregião', 'error');
      return;
    }

    if (!checkCanDelete(action)) {
      showToast('Você não tem permissão para excluir esta ação', 'error');
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: 'Excluir Ação',
      message: `Tem certeza que deseja excluir "${action.title}"? Esta ação não pode ser desfeita.`,
      onConfirm: () => {
        setActions(prev => prev.filter(a => a.uid !== uid));
        setExpandedActionUid(null);
        showToast('Ação excluída!', 'success');
      }
    });
  }, [actions, showToast, checkCanDelete, currentMicroId, isViewingAllMicros, isAdmin, setConfirmModal, setActions, setExpandedActionUid]);

  const handleAddRaci = useCallback((uid: string, memberId: string, role: RaciRole) => {
    if (isViewingAllMicros && !isAdmin) {
      showToast('Selecione uma microrregião específica para gerenciar equipe', 'error');
      return;
    }

    const action = findActionByUid(actions, uid);
    if (!action) {
      showToast('Ação não encontrada', 'error');
      return;
    }

    if (!isAdmin && action.microregiaoId !== currentMicroId) {
      showToast('Você não pode editar ações de outra microrregião', 'error');
      return;
    }

    if (!checkCanManageTeam(action)) {
      showToast('Você não tem permissão para gerenciar a equipe desta ação', 'error');
      return;
    }

    const teamToSearch = isAdmin && isViewingAllMicros ? allTeams : currentTeam;
    const member = teamToSearch.find(m => m.id === parseInt(memberId));
    if (!member) {
      showToast('Membro não encontrado', 'error');
      return;
    }

    if (action.raci.some(r => r.name === member.name)) {
      showToast(`${member.name} já está na equipe desta ação`, 'warning');
      return;
    }

    setActions(prev => prev.map(a =>
      a.uid === uid 
        ? { ...a, raci: [...a.raci, { name: member.name, role }] } 
        : a
    ));
    showToast(`${member.name} adicionado à equipe!`, 'info');
  }, [currentTeam, showToast, actions, checkCanManageTeam, currentMicroId, isViewingAllMicros, isAdmin, allTeams, setActions]);

  const handleRemoveRaci = useCallback((uid: string, idx: number, memberName: string) => {
    if (isViewingAllMicros && !isAdmin) {
      showToast('Selecione uma microrregião específica', 'error');
      return;
    }

    const action = findActionByUid(actions, uid);
    if (!action) {
      showToast('Ação não encontrada', 'error');
      return;
    }

    if (!isAdmin && action.microregiaoId !== currentMicroId) {
      showToast('Você não pode editar ações de outra microrregião', 'error');
      return;
    }

    if (!checkCanManageTeam(action)) {
      showToast('Você não tem permissão para gerenciar a equipe desta ação', 'error');
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: 'Remover Membro',
      message: `Remover ${memberName} desta ação?`,
      onConfirm: () => {
        setActions(prev => prev.map(a =>
          a.uid === uid 
            ? { ...a, raci: a.raci.filter((_, i) => i !== idx) } 
            : a
        ));
        showToast('Membro removido!', 'info');
      }
    });
  }, [showToast, actions, checkCanManageTeam, currentMicroId, isViewingAllMicros, isAdmin, setConfirmModal, setActions]);

  const handleAddComment = useCallback((uid: string, comment: ActionComment) => {
    const action = findActionByUid(actions, uid);
    if (!action) {
      showToast('Ação não encontrada', 'error');
      return;
    }

    setActions(prev => prev.map(a =>
      a.uid === uid 
        ? { ...a, comments: [...(a.comments || []), comment] } 
        : a
    ));
  }, [actions, showToast, setActions]);

  return {
    handleUpdateAction,
    handleSaveAction,
    handleCreateAction,
    handleDeleteAction,
    handleAddRaci,
    handleRemoveRaci,
    handleAddComment,
  };
}


