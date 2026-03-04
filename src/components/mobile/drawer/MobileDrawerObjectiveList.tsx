import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Objective } from '../../../types';
import { getObjectiveTitleWithoutNumber } from '../../../lib/text';

interface MobileDrawerObjectiveListProps {
  objectives: Objective[];
  activities: Record<number, { id: string; title: string }[]>;
  selectedObjective: number;
  selectedActivity: string;
  onSelectActivity: (objectiveId: number, activityId: string) => void;
}

export function MobileDrawerObjectiveList({
  objectives,
  activities,
  selectedObjective,
  selectedActivity,
  onSelectActivity,
}: MobileDrawerObjectiveListProps) {
  const [expandedObjectives, setExpandedObjectives] = useState<Set<number>>(
    new Set([selectedObjective])
  );

  useEffect(() => {
    setExpandedObjectives(prev => {
      if (prev.has(selectedObjective)) {
        return prev;
      }

      const next = new Set(prev);
      next.add(selectedObjective);
      return next;
    });
  }, [selectedObjective]);

  const toggleObjective = (id: number) => {
    setExpandedObjectives(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      <div className="space-y-2">
        {objectives.map((obj, objIndex) => {
          const isExpanded = expandedObjectives.has(obj.id);
          const objActivities = activities[obj.id] || [];

          return (
            <div key={obj.id} className="bg-white/5 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleObjective(obj.id)}
                className={`w-full flex items-center gap-2 p-3 text-left transition-colors ${selectedObjective === obj.id
                  ? 'bg-emerald-500/20 text-white'
                  : 'text-white/80 hover:bg-white/5'
                  }`}
              >
                <span className={`transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`}>
                  <ChevronDown size={16} />
                </span>
                <span className="w-6 h-6 rounded-lg bg-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-300">
                  {objIndex + 1}
                </span>
                <span className="flex-1 text-sm font-medium truncate">
                  {getObjectiveTitleWithoutNumber(obj.title)}
                </span>
              </button>

              <AnimatePresence>
                {isExpanded && objActivities.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-white/5"
                  >
                    <div className="p-2 pl-8 space-y-1">
                      {objActivities.map((act) => (
                        <button
                          key={act.id}
                          onClick={() => onSelectActivity(obj.id, act.id)}
                          className={`w-full flex items-center gap-2 p-2 rounded-lg text-left text-sm transition-colors ${selectedObjective === obj.id && selectedActivity === act.id
                            ? 'bg-teal-500/30 text-white font-medium'
                            : 'text-white/60 hover:bg-white/5 hover:text-white/80'
                            }`}
                        >
                          <ChevronRight size={14} className="text-teal-400/50" />
                          <span className="truncate">{act.title}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
