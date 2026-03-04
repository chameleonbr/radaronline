import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { getActivityDisplayId } from '../../../lib/text';

interface SidebarActivityItemProps {
  id: string;
  title: string;
  isActive: boolean;
  isEditMode: boolean;
  onSelect: () => void;
  onEdit?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
}

export const SidebarActivityItem = React.memo<SidebarActivityItemProps>(({
  id,
  title,
  isActive,
  isEditMode,
  onSelect,
  onEdit,
  onDelete,
}) => (
  <div className="flex items-center gap-1 group/act">
    <button
      onClick={onSelect}
      className={`flex-1 text-left py-1.5 px-2 text-[10px] rounded-md transition-colors truncate ${isActive
        ? (isEditMode ? 'text-white font-bold bg-white/10' : 'bg-emerald-500/10 text-white font-bold border border-emerald-500/20')
        : 'text-white/50 hover:bg-white/5 hover:text-white'
        }`}
    >
      Atv {getActivityDisplayId(id)} - {title}
    </button>

    {isEditMode && (
      <div className="flex items-center opacity-0 group-hover/act:opacity-100 transition-opacity">
        {onEdit && (
          <button
            onClick={onEdit}
            className="p-1 rounded hover:bg-white/20 text-white/50 hover:text-white transition-colors"
            title="Renomear atividade"
          >
            <Edit2 size={10} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="p-1 rounded hover:bg-red-500/20 text-red-300/50 hover:text-red-200 transition-colors"
            title="Excluir atividade"
          >
            <Trash2 size={10} />
          </button>
        )}
      </div>
    )}
  </div>
));
