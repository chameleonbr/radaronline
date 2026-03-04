import { useCallback } from 'react';
import type { Objective } from '../types';

type ViewMode = 'table' | 'gantt' | 'team' | 'optimized' | 'calendar';
type ActivitySummary = { id: string; title: string };

interface UseStrategyViewHandlersProps {
  objectives: Objective[];
  activities: Record<number, ActivitySummary[]>;
  setCurrentNav: (nav: string) => void;
  setSelectedObjective: (objectiveId: number) => void;
  setSelectedActivity: (activityId: string) => void;
  setViewMode: (mode: ViewMode) => void;
}

export function useStrategyViewHandlers({
  objectives,
  activities,
  setCurrentNav,
  setSelectedObjective,
  setSelectedActivity,
  setViewMode,
}: UseStrategyViewHandlersProps) {
  const openNewsFeed = useCallback(() => {
    setCurrentNav('news');
  }, [setCurrentNav]);

  const openDashboard = useCallback(() => {
    setCurrentNav('dashboard');
  }, [setCurrentNav]);

  const openStrategyObjective = useCallback((objectiveId: number, activityId?: string) => {
    setCurrentNav('strategy');
    setSelectedObjective(objectiveId);
    setSelectedActivity(activityId ?? activities[objectiveId]?.[0]?.id ?? '');
    setViewMode('table');
  }, [activities, setCurrentNav, setSelectedActivity, setSelectedObjective, setViewMode]);

  const openStrategyRoot = useCallback(() => {
    setCurrentNav('strategy');

    if (objectives.length > 0) {
      const firstObjective = objectives[0];
      setSelectedObjective(firstObjective.id);
      setSelectedActivity(activities[firstObjective.id]?.[0]?.id ?? '');
    }

    setViewMode('table');
  }, [activities, objectives, setCurrentNav, setSelectedActivity, setSelectedObjective, setViewMode]);

  const openStrategyTeam = useCallback(() => {
    setCurrentNav('strategy');
    setViewMode('team');
  }, [setCurrentNav, setViewMode]);

  const openStrategyCalendar = useCallback(() => {
    setCurrentNav('strategy');
    setViewMode('calendar');
  }, [setCurrentNav, setViewMode]);

  return {
    openNewsFeed,
    openDashboard,
    openStrategyObjective,
    openStrategyRoot,
    openStrategyTeam,
    openStrategyCalendar,
  };
}
