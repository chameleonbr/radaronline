import { useMemo } from 'react';
import { Action, Activity, Objective, TeamMember, filterActionsByMicro } from '../types';
import { Microrregiao, User } from '../types/auth.types';

interface UseScopedAppDataProps {
  actions: Action[];
  objectives: Objective[];
  activities: Record<number, Activity[]>;
  teamsByMicro: Record<string, TeamMember[]>;
  selectedObjective: number;
  selectedActivity: string;
  currentMicrorregiao: Microrregiao | null;
  viewingMicroregiaoId: string | null;
  user: User | null;
  isAdmin: boolean;
}

export function useScopedAppData({
  actions,
  objectives,
  activities,
  teamsByMicro,
  selectedObjective,
  selectedActivity,
  currentMicrorregiao,
  viewingMicroregiaoId,
  user,
  isAdmin,
}: UseScopedAppDataProps) {
  const currentMicroId = useMemo(() => {
    if (viewingMicroregiaoId) {
      return viewingMicroregiaoId;
    }

    return user?.microregiaoId || '';
  }, [viewingMicroregiaoId, user?.microregiaoId]);

  const isViewingAllMicros = useMemo(() => {
    if (isAdmin && !viewingMicroregiaoId) {
      return true;
    }

    if (!isAdmin && !viewingMicroregiaoId && !user?.microregiaoId) {
      return true;
    }

    return false;
  }, [isAdmin, viewingMicroregiaoId, user?.microregiaoId]);

  const allTeams = useMemo(() => Object.values(teamsByMicro).flat(), [teamsByMicro]);

  const currentTeam = useMemo(() => {
    if (isViewingAllMicros) {
      return allTeams;
    }

    return teamsByMicro[currentMicroId] || [];
  }, [allTeams, currentMicroId, isViewingAllMicros, teamsByMicro]);

  const microActions = useMemo(() => {
    if (isViewingAllMicros) {
      return actions;
    }

    return filterActionsByMicro(actions, currentMicroId);
  }, [actions, currentMicroId, isViewingAllMicros]);

  const filteredObjectives = useMemo(() => {
    if (isViewingAllMicros) {
      return objectives;
    }

    return objectives.filter(objective => !objective.microregiaoId || objective.microregiaoId === currentMicroId);
  }, [currentMicroId, isViewingAllMicros, objectives]);

  const filteredActivities = useMemo(() => {
    if (isViewingAllMicros) {
      return activities;
    }

    const filteredObjectiveIds = new Set(filteredObjectives.map(objective => objective.id));
    const nextActivities: Record<number, Activity[]> = {};

    for (const [objectiveId, scopedActivities] of Object.entries(activities)) {
      const numericObjectiveId = Number(objectiveId);

      if (filteredObjectiveIds.has(numericObjectiveId)) {
        nextActivities[numericObjectiveId] = scopedActivities;
      }
    }

    return nextActivities;
  }, [activities, filteredObjectives, isViewingAllMicros]);

  const ganttActions = useMemo(() => {
    const objectiveActivityIds = filteredActivities[selectedObjective]?.map(activity => activity.id) || [];

    return microActions
      .filter(action => objectiveActivityIds.includes(action.activityId))
      .sort((left, right) => left.id.localeCompare(right.id, undefined, { numeric: true }));
  }, [filteredActivities, microActions, selectedObjective]);

  const currentActivity = useMemo(() => {
    const scopedActivities = filteredActivities[selectedObjective] || [];

    return scopedActivities.find(activity => activity.id === selectedActivity) || scopedActivities[0];
  }, [filteredActivities, selectedActivity, selectedObjective]);

  const microregiaoNome = currentMicrorregiao
    ? currentMicrorregiao.nome
    : isViewingAllMicros
      ? 'Todas as microrregiões'
      : '';

  const macrorregiaoNome = currentMicrorregiao
    ? currentMicrorregiao.macrorregiao
    : '';

  return {
    allTeams,
    currentActivity,
    currentMicroId,
    currentTeam,
    filteredActivities,
    filteredObjectives,
    ganttActions,
    isViewingAllMicros,
    macrorregiaoNome,
    microActions,
    microregiaoNome,
    readOnly: isViewingAllMicros && !isAdmin,
  };
}
