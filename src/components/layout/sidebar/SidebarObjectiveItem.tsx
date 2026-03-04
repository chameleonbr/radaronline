import React from 'react';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import { getObjectiveTitleWithoutNumber } from '../../../lib/text';
import { SidebarActivityItem } from './SidebarActivityItem';

interface SidebarObjectiveItemProps {
  obj: { id: number; title: string };
  objIndex: number;
  isActive: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  activities?: { id: string; title: string }[];
  selectedActivity: string | null;
  onSelectActivity: (actId: string) => void;
  onEditActivity?: (actId: string, initialTitle: string) => void;
  onDeleteActivity?: (actId: string, actTitle: string) => void;
  onAddActivity?: () => void;
  isEditMode: boolean;
}

export const SidebarObjectiveItem = React.memo<SidebarObjectiveItemProps>(({
  obj,
  objIndex,
  isActive,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  activities,
  selectedActivity,
  onSelectActivity,
  onEditActivity,
  onDeleteActivity,
  onAddActivity,
  isEditMode,
}) => (
  <div className="group/obj">
    <div className="flex items-center gap-1 group-hover/obj:bg-white/5 rounded-lg pr-1 transition-colors">
      <button
        onClick={onToggle}
        className={`flex-1 text-left py-2 px-2.5 text-[11px] rounded-lg transition-all truncate leading-snug ${isActive
          ? 'bg-emerald-500/20 font-bold text-white shadow-sm ring-1 ring-emerald-500/30'
          : 'text-white/70 hover:text-white'
          }`}
      >
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full transition-all ${isActive ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] scale-110' : 'bg-white/30'
            }`}></div>
          <span className="truncate">Obj {objIndex + 1}. {getObjectiveTitleWithoutNumber(obj.title)}</span>
        </div>
      </button>

      {isEditMode && (
        <div className="flex items-center opacity-0 group-hover/obj:opacity-100 transition-opacity px-1">
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-1.5 rounded hover:bg-white/20 text-white/50 hover:text-white transition-colors"
              title="Renomear objetivo"
            >
              <Edit2 size={12} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-1.5 rounded hover:bg-red-500/20 text-red-300 hover:text-red-200 transition-colors"
              title="Excluir objetivo"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      )}
    </div>

    {isExpanded && activities && (
      <div className="ml-3 pl-3 border-l border-white/10 space-y-1 mt-1 mb-2 animate-fade-in relative">
        {activities.map(act => (
          <SidebarActivityItem
            key={act.id}
            id={act.id}
            title={act.title}
            isActive={isActive && act.id === selectedActivity}
            isEditMode={isEditMode}
            onSelect={() => onSelectActivity(act.id)}
            onEdit={onEditActivity ? (e) => { e.stopPropagation(); onEditActivity(act.id, act.title); } : undefined}
            onDelete={onDeleteActivity ? (e) => { e.stopPropagation(); onDeleteActivity(act.id, act.title); } : undefined}
          />
        ))}

        {isEditMode && onAddActivity && (
          <button
            onClick={onAddActivity}
            className="flex items-center gap-1.5 py-1 px-2 text-[10px] text-emerald-300/70 hover:text-emerald-200 transition-colors hover:bg-emerald-500/10 rounded-md w-full"
          >
            <Plus size={10} />
            <span>Nova Atividade</span>
          </button>
        )}
      </div>
    )}
  </div>
));
