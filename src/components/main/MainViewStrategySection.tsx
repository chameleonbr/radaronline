import React, { RefObject, Suspense, lazy } from 'react';
import { Plus, Target } from 'lucide-react';
import { Activity } from '../../types';

const ActivityTabs = lazy(() => import('../../features/actions/ActivityTabs').then(m => ({ default: m.ActivityTabs })));

const sectionFallback = (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full" />
  </div>
);

interface MainViewStrategySectionProps {
  activityTabsRef: RefObject<HTMLDivElement>;
  canCreateObjective: boolean;
  filteredActivities: Record<number, Activity[]>;
  filteredObjectives: { id: number }[];
  isEditMode: boolean;
  selectedActivity: string;
  selectedObjective: number;
  onAddObjective: () => void;
  onSetSelectedActivity: (activityId: string) => void;
  onUpdateActivity: (id: string, field: 'title' | 'description', value: string) => void;
}

export function MainViewStrategySection({
  activityTabsRef,
  canCreateObjective,
  filteredActivities,
  filteredObjectives,
  isEditMode,
  selectedActivity,
  selectedObjective,
  onAddObjective,
  onSetSelectedActivity,
  onUpdateActivity,
}: MainViewStrategySectionProps) {
  return (
    <div ref={activityTabsRef}>
      {filteredObjectives.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
          <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-full mb-4">
            <Target size={32} className="text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">
            Nenhum objetivo definido
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-center max-w-md mb-6">
            É necessário criar um objetivo estratégico e atividades relacionadas antes de adicionar ações.
          </p>
          {canCreateObjective && (
            <button
              onClick={onAddObjective}
              className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-teal-700 transition-colors shadow-sm"
            >
              <Plus size={18} /> Criar Primeiro Objetivo
            </button>
          )}
        </div>
      ) : (
        <Suspense fallback={sectionFallback}>
          <ActivityTabs
            activities={filteredActivities[selectedObjective] || []}
            selectedActivity={selectedActivity}
            setSelectedActivity={onSetSelectedActivity}
            isEditMode={isEditMode}
            onUpdateActivity={onUpdateActivity}
          />
        </Suspense>
      )}
    </div>
  );
}
