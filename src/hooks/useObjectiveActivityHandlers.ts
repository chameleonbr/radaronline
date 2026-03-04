import { useCallback, type Dispatch, type SetStateAction } from 'react';
import { Action, Activity, Objective } from '../types';
import { log, logError } from '../lib/logger';
import { getActivityDisplayId, getObjectiveTitleWithoutNumber } from '../lib/text';
import * as actionsService from '../services/actionsService';
import * as objectivesActivitiesService from '../services/objectivesActivitiesService';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface UseObjectiveActivityHandlersProps {
  userRole?: string;
  userMicroregiaoId?: string;
  currentMicroId: string;
  isViewingAllMicros: boolean;

  filteredObjectives: Objective[];
  objectives: Objective[];
  activities: Record<number, Activity[]>;
  actions: Action[];
  selectedObjective: number;
  selectedActivity: string;

  setObjectives: Dispatch<SetStateAction<Objective[]>>;
  setActivities: Dispatch<SetStateAction<Record<number, Activity[]>>>;
  setActions: Dispatch<SetStateAction<Action[]>>;
  setSelectedObjective: (value: number) => void;
  setSelectedActivity: (value: string) => void;

  showToast: (message: string, type?: ToastType) => void;
}

export function useObjectiveActivityHandlers({
  userRole,
  userMicroregiaoId,
  currentMicroId,
  isViewingAllMicros,

  filteredObjectives,
  objectives,
  activities,
  actions,
  selectedObjective,
  selectedActivity,

  setObjectives,
  setActivities,
  setActions,
  setSelectedObjective,
  setSelectedActivity,

  showToast,
}: UseObjectiveActivityHandlersProps) {
  const isAdminRole = userRole === 'admin' || userRole === 'superadmin';

  const renumberObjectivesAndActivities = useCallback(async (currentObjectives: Objective[]) => {
    try {
      for (let i = 0; i < currentObjectives.length; i++) {
        const obj = currentObjectives[i];
        const targetNumber = i + 1;

        const cleanTitle = getObjectiveTitleWithoutNumber(obj.title);
        const newTitle = `${targetNumber}. ${cleanTitle}`;

        if (!obj.title.startsWith(`${targetNumber}.`)) {
          await objectivesActivitiesService.updateObjective(obj.id, { title: newTitle });
          setObjectives(prev => prev.map(o => (o.id === obj.id ? { ...o, title: newTitle } : o)));
        }

        const objActivities = activities[obj.id] || [];
        let activitiesChanged = false;

        for (const act of objActivities) {
          const displayId = getActivityDisplayId(act.id);
          const parts = displayId.split('.');
          const actNum = parts.length > 1 ? parts[1] : parts[0];
          const correctDisplayId = `${targetNumber}.${actNum}`;

          if (!displayId.startsWith(`${targetNumber}.`)) {
            activitiesChanged = true;

            let microregiaoId = '';
            let newFullId = correctDisplayId;

            if (act.id.includes('_')) {
              const idParts = act.id.split('_');
              microregiaoId = idParts[0];
              newFullId = `${microregiaoId}_${correctDisplayId}`;
            } else {
              microregiaoId = currentMicroId && currentMicroId !== 'all' ? currentMicroId : (userMicroregiaoId || '');
              newFullId = correctDisplayId;
            }

            log('useObjectiveActivityHandlers', `Renumerando atividade: ${act.id} -> ${newFullId}`);

            await objectivesActivitiesService.createActivity(
              obj.id,
              newFullId,
              act.title,
              microregiaoId,
              act.description
            );

            const relatedActions = actions.filter(a => a.activityId === act.id);
            for (const action of relatedActions) {
              await objectivesActivitiesService.updateActionActivityId(action.uid, newFullId);
            }

            await objectivesActivitiesService.deleteActivity(act.id);
          }
        }

        if (activitiesChanged) {
          const freshActivities = await objectivesActivitiesService.loadActivities();
          const freshActions = await actionsService.loadActions();
          setActivities(freshActivities);
          setActions(freshActions);
        }
      }

      showToast('Numeração atualizada com sucesso!', 'success');
    } catch (error: any) {
      logError('useObjectiveActivityHandlers', 'Erro ao renumerar objetivos/atividades', error);
      showToast(`Erro na renumeração: ${error.message}`, 'error');
    }
  }, [
    activities,
    actions,
    currentMicroId,
    setActions,
    setActivities,
    setObjectives,
    showToast,
    userMicroregiaoId,
  ]);

  const renumberActivitiesOfObjective = useCallback(async (objectiveId: number) => {
    try {
      const objectiveIndex = filteredObjectives.findIndex(o => o.id === objectiveId);
      if (objectiveIndex === -1) return;

      const targetObjNumber = objectiveIndex + 1;
      const freshActivitiesMap = await objectivesActivitiesService.loadActivities();
      const objActivities = freshActivitiesMap[objectiveId] || [];

      const sortedActivities = [...objActivities].sort((a, b) => {
        const getSuffix = (id: string) => {
          const parts = id.split('.');
          return parseInt(parts[parts.length - 1], 10) || 0;
        };
        return getSuffix(a.id) - getSuffix(b.id);
      });

      let activitiesChanged = false;

      for (let i = 0; i < sortedActivities.length; i++) {
        const act = sortedActivities[i];
        const targetSuffix = i + 1;

        let prefix = '';
        if (act.id.includes('_')) {
          prefix = `${act.id.split('_')[0]}_`;
        }

        const targetDisplayId = `${targetObjNumber}.${targetSuffix}`;
        const targetFullId = `${prefix}${targetDisplayId}`;

        if (act.id !== targetFullId) {
          activitiesChanged = true;
          log('useObjectiveActivityHandlers', `Auto-renumber atividade: ${act.id} -> ${targetFullId}`);

          const microToUse = prefix ? prefix.replace('_', '') : (currentMicroId || userMicroregiaoId || '');

          await objectivesActivitiesService.createActivity(
            objectiveId,
            targetFullId,
            act.title,
            microToUse,
            act.description
          );

          const relatedActions = actions.filter(a => a.activityId === act.id);
          for (const action of relatedActions) {
            await objectivesActivitiesService.updateActionActivityId(action.uid, targetFullId);
          }

          await objectivesActivitiesService.deleteActivity(act.id);
        }
      }

      if (activitiesChanged) {
        const finalActivities = await objectivesActivitiesService.loadActivities();
        const finalActions = await actionsService.loadActions();
        setActivities(finalActivities);
        setActions(finalActions);
        showToast('Atividades renumeradas automaticamente.', 'success');
      }
    } catch (error) {
      logError('useObjectiveActivityHandlers', 'Erro ao renumerar atividades do objetivo', error);
    }
  }, [
    actions,
    currentMicroId,
    filteredObjectives,
    setActions,
    setActivities,
    showToast,
    userMicroregiaoId,
  ]);

  const handleAddObjective = useCallback(async () => {
    if (!isAdminRole) {
      showToast('Apenas administradores podem adicionar objetivos', 'error');
      return;
    }

    const targetMicroId = currentMicroId || userMicroregiaoId || 'all';
    if (!targetMicroId || targetMicroId === 'all') {
      showToast('Selecione uma microrregião específica para criar o objetivo', 'error');
      return;
    }

    try {
      const nextDisplayNumber = filteredObjectives.length + 1;
      const newTitle = `${nextDisplayNumber}. Novo Objetivo`;
      const newObjective = await objectivesActivitiesService.createObjective(newTitle, targetMicroId);

      const firstActivityId = `${targetMicroId}_${nextDisplayNumber}.1`;
      const firstActivity = await objectivesActivitiesService.createActivity(
        newObjective.id,
        firstActivityId,
        'Nova Atividade',
        targetMicroId,
        'Descrição da atividade.'
      );

      setObjectives(prev => [...prev, newObjective]);
      setActivities(prev => ({
        ...prev,
        [newObjective.id]: [firstActivity],
      }));
      showToast('Objetivo e atividade criados!', 'success');
    } catch (error: any) {
      logError('useObjectiveActivityHandlers', 'Erro ao criar objetivo', error);
      showToast(`Erro ao criar objetivo: ${error.message}`, 'error');
    }
  }, [
    currentMicroId,
    filteredObjectives,
    isAdminRole,
    setActivities,
    setObjectives,
    showToast,
    userMicroregiaoId,
  ]);

  const handleDeleteObjective = useCallback(async (id: number) => {
    if (!isAdminRole) {
      showToast('Apenas administradores podem excluir objetivos', 'error');
      return;
    }

    const objectiveActivities = activities[id] || [];
    const relatedActions = actions.filter(a => objectiveActivities.some(act => act.id === a.activityId));
    if (relatedActions.length > 0) {
      showToast(`Não é possível excluir: existem ${relatedActions.length} ações vinculadas a este objetivo`, 'error');
      return;
    }

    try {
      await objectivesActivitiesService.deleteObjective(id);

      setObjectives(prev => prev.filter(o => o.id !== id));
      setActivities(prev => {
        const nextActivities = { ...prev };
        delete nextActivities[id];
        return nextActivities;
      });

      if (selectedObjective === id) {
        const remaining = objectives.filter(o => o.id !== id);
        if (remaining.length > 0) {
          setSelectedObjective(remaining[0].id);
          const firstActivity = activities[remaining[0].id]?.[0];
          if (firstActivity) {
            setSelectedActivity(firstActivity.id);
          }
        } else {
          setSelectedActivity('');
        }
      }

      showToast('Objetivo excluído! Renumerando...', 'info');

      setTimeout(() => {
        if (isViewingAllMicros) {
          log('useObjectiveActivityHandlers', 'Pulando renumeração automática em modo "Ver Todas" por segurança');
          return;
        }

        const listToRenumber = filteredObjectives.filter(o => o.id !== id);
        void renumberObjectivesAndActivities(listToRenumber);
      }, 500);
    } catch (error: any) {
      logError('useObjectiveActivityHandlers', 'Erro ao excluir objetivo', error);
      showToast(`Erro ao excluir objetivo: ${error.message}`, 'error');
    }
  }, [
    actions,
    activities,
    filteredObjectives,
    isAdminRole,
    isViewingAllMicros,
    objectives,
    renumberObjectivesAndActivities,
    selectedObjective,
    setActivities,
    setObjectives,
    setSelectedActivity,
    setSelectedObjective,
    showToast,
  ]);

  const handleAddActivity = useCallback(async (objectiveId: number) => {
    if (!isAdminRole) {
      showToast('Apenas administradores podem adicionar atividades', 'error');
      return;
    }

    const targetMicroId =
      currentMicroId && currentMicroId !== 'all'
        ? currentMicroId
        : (userMicroregiaoId || '');

    if (!targetMicroId) {
      showToast('Selecione uma microrregião para criar atividades', 'error');
      return;
    }

    const currentActivities = activities[objectiveId] || [];
    const objectiveIndex = filteredObjectives.findIndex(o => o.id === objectiveId);
    const objectiveDisplayNumber = objectiveIndex >= 0 ? objectiveIndex + 1 : objectiveId;

    const activityNumbers = currentActivities.map(a => {
      const parts = a.id.split('.');
      const lastPart = parts[parts.length - 1];
      const num = parseInt(lastPart, 10);
      return Number.isNaN(num) ? 0 : num;
    });

    const nextNum = activityNumbers.length > 0 ? Math.max(...activityNumbers) + 1 : 1;
    const newActivityId = `${targetMicroId}_${objectiveDisplayNumber}.${nextNum}`;

    try {
      const newActivity = await objectivesActivitiesService.createActivity(
        objectiveId,
        newActivityId,
        `Nova Atividade ${nextNum}`,
        targetMicroId,
        'Descrição da nova atividade.'
      );

      setActivities(prev => ({
        ...prev,
        [objectiveId]: [...(prev[objectiveId] || []), newActivity],
      }));

      showToast('Atividade adicionada!', 'success');
    } catch (error: any) {
      logError('useObjectiveActivityHandlers', 'Erro ao criar atividade', error);
      showToast(`Erro ao criar atividade: ${error.message}`, 'error');
    }
  }, [
    activities,
    currentMicroId,
    filteredObjectives,
    isAdminRole,
    setActivities,
    showToast,
    userMicroregiaoId,
  ]);

  const handleDeleteActivity = useCallback(async (objectiveId: number, activityId: string) => {
    if (!isAdminRole) {
      showToast('Apenas administradores podem excluir atividades', 'error');
      return;
    }

    const relatedActions = actions.filter(a => a.activityId === activityId);
    if (relatedActions.length > 0) {
      showToast(`Não é possível excluir: existem ${relatedActions.length} ações vinculadas a esta atividade`, 'error');
      return;
    }

    try {
      await objectivesActivitiesService.deleteActivity(activityId);

      setActivities(prev => ({
        ...prev,
        [objectiveId]: (prev[objectiveId] || []).filter(a => a.id !== activityId),
      }));

      if (selectedActivity === activityId) {
        const remaining = (activities[objectiveId] || []).filter(a => a.id !== activityId);
        setSelectedActivity(remaining.length > 0 ? remaining[0].id : '');
      }

      showToast('Atividade excluída!', 'success');

      setTimeout(() => {
        void renumberActivitiesOfObjective(objectiveId);
      }, 500);
    } catch (error: any) {
      logError('useObjectiveActivityHandlers', 'Erro ao excluir atividade', error);
      showToast(`Erro ao excluir atividade: ${error.message}`, 'error');
    }
  }, [
    actions,
    activities,
    isAdminRole,
    renumberActivitiesOfObjective,
    selectedActivity,
    setActivities,
    setSelectedActivity,
    showToast,
  ]);

  const handleUpdateObjective = useCallback(async (id: number, newTitle: string) => {
    if (!isAdminRole) {
      showToast('Apenas administradores podem editar objetivos', 'error');
      return;
    }

    try {
      await objectivesActivitiesService.updateObjective(id, { title: newTitle });
      setObjectives(prev => prev.map(o => (o.id === id ? { ...o, title: newTitle } : o)));
      showToast('Objetivo atualizado!', 'success');
    } catch (error: any) {
      logError('useObjectiveActivityHandlers', 'Erro ao atualizar objetivo', error);
      showToast(`Erro ao atualizar objetivo: ${error.message}`, 'error');
    }
  }, [isAdminRole, setObjectives, showToast]);

  const handleUpdateActivity = useCallback(async (
    objectiveId: number,
    activityId: string,
    field: 'title' | 'description',
    value: string
  ) => {
    if (!isAdminRole) {
      showToast('Apenas administradores podem editar atividades', 'error');
      return;
    }

    try {
      await objectivesActivitiesService.updateActivity(activityId, { [field]: value });
      setActivities(prev => ({
        ...prev,
        [objectiveId]: prev[objectiveId]?.map(a => (a.id === activityId ? { ...a, [field]: value } : a)) || [],
      }));
      showToast('Atividade atualizada!', 'success');
    } catch (error: any) {
      logError('useObjectiveActivityHandlers', 'Erro ao atualizar atividade', error);
      showToast(`Erro ao atualizar atividade: ${error.message}`, 'error');
    }
  }, [isAdminRole, setActivities, showToast]);

  const handleUpdateObjectiveField = useCallback(async (
    id: number,
    field: 'eixo' | 'description' | 'eixoLabel' | 'eixoColor',
    value: string | number
  ) => {
    if (!isAdminRole && userRole !== 'gestor') {
      showToast('Você não tem permissão para editar objetivos', 'error');
      return;
    }

    setObjectives(prev => prev.map(o => (o.id === id ? { ...o, [field]: value } : o)));

    try {
      await objectivesActivitiesService.updateObjective(id, { [field]: value } as Partial<Objective>);
      showToast('Objetivo atualizado!', 'success');
    } catch (error: any) {
      logError('useObjectiveActivityHandlers', 'Erro ao atualizar campo do objetivo', error);
      showToast(`Erro ao atualizar: ${error.message}`, 'error');
    }
  }, [isAdminRole, setObjectives, showToast, userRole]);

  return {
    handleAddObjective,
    handleDeleteObjective,
    handleAddActivity,
    handleDeleteActivity,
    handleUpdateObjective,
    handleUpdateActivity,
    handleUpdateObjectiveField,
  };
}
