import React from 'react';
import { Activity } from '../../types';

interface ActivityTabsProps {
  activities: Activity[];
  selectedActivity: string;
  setSelectedActivity: (id: string) => void;
}

export const ActivityTabs: React.FC<ActivityTabsProps> = ({
  activities,
  selectedActivity,
  setSelectedActivity,
}) => {
  return (
    <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4 flex gap-3 sm:gap-4 overflow-x-auto shrink-0 items-start">
      {activities?.map(act => {
        const isActive = selectedActivity === act.id;
        return (
          <button 
            key={act.id} 
            onClick={() => setSelectedActivity(act.id)} 
            className={`
              group flex flex-col text-left p-2 sm:p-3 rounded-xl border transition-all duration-200 
              min-w-[180px] sm:min-w-[240px] max-w-[180px] sm:max-w-[240px] relative overflow-hidden shrink-0
              ${isActive 
                ? "bg-white border-teal-500 shadow-md ring-1 ring-teal-500/20 z-10" 
                : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm opacity-80 hover:opacity-100"
              }
            `}
          >
            {isActive && <div className="absolute top-0 left-0 w-1 h-full bg-teal-500"></div>}
            
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isActive ? 'bg-teal-50 text-teal-700' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
                Atividade {act.id}
              </span>
              {isActive && <span className="text-[9px] font-bold text-teal-600 uppercase tracking-wider hidden sm:inline">Selecionado</span>}
            </div>
            
            <div className={`text-xs font-bold leading-snug ${isActive ? 'text-slate-800' : 'text-slate-600'}`}>
              {act.title}
            </div>
            
            <div className="mt-2 text-[10px] text-slate-400 line-clamp-2 hidden sm:block">
              {act.description}
            </div>
          </button>
        );
      })}
    </div>
  );
};

