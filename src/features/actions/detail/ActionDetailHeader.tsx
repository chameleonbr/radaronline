import { Lock, X } from 'lucide-react';
import { Action } from '../../../types';
import { getActionDisplayId } from '../../../lib/text';

interface ActionDetailHeaderProps {
  action: Action;
  activityName: string;
  userCanEdit: boolean;
  onClose: () => void;
  onTitleChange: (title: string) => void;
}

export function ActionDetailHeader({
  action,
  activityName,
  userCanEdit,
  onClose,
  onTitleChange,
}: ActionDetailHeaderProps) {
  return (
    <header className="px-4 py-3 md:px-6 md:py-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:justify-between md:items-start gap-3 shrink-0 z-20">
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <div className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wide">
          <span>{activityName}</span>
          <span className="mx-2 text-slate-300">/</span>
          <span className="text-teal-600">{getActionDisplayId(action.id)}</span>
        </div>
        <div className="flex items-center gap-2">
          {userCanEdit ? (
            <>
              <input
                type="text"
                id="action-detail-title"
                value={action.title}
                onChange={(event) => onTitleChange(event.target.value)}
                className={`text-xl md:text-2xl font-bold leading-tight w-full bg-transparent border-b-2 outline-none transition-colors py-1 ${action.title === 'Nova A\u00E7\u00E3o'
                  ? 'border-amber-400 text-amber-600 dark:text-amber-400'
                  : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-teal-500 text-slate-900 dark:text-slate-100'
                  }`}
                placeholder="Digite o nome da a\u00E7\u00E3o..."
              />
              {action.title === 'Nova A\u00E7\u00E3o' && (
                <span className="text-xs text-amber-500 whitespace-nowrap">altere</span>
              )}
            </>
          ) : (
            <h1
              id="action-detail-title"
              className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight truncate flex items-center gap-2"
            >
              {action.title}
              <Lock size={16} className="text-slate-400" />
            </h1>
          )}
        </div>
      </div>

      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors self-start"
        aria-label="Fechar"
      >
        <X size={20} />
      </button>
    </header>
  );
}
