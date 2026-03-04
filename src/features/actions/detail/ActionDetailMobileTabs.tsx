import { MessageCircle, Target, Users } from 'lucide-react';
import { Action } from '../../../types';

interface ActionDetailMobileTabsProps {
  action: Action;
  mobileSection: 'details' | 'raci' | 'comments';
  onSectionChange: (section: 'details' | 'raci' | 'comments') => void;
}

export function ActionDetailMobileTabs({
  action,
  mobileSection,
  onSectionChange,
}: ActionDetailMobileTabsProps) {
  return (
    <div className="flex bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shrink-0">
      <button
        onClick={() => onSectionChange('details')}
        className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${mobileSection === 'details'
          ? 'text-teal-600 dark:text-teal-400 border-b-2 border-teal-500'
          : 'text-slate-500 dark:text-slate-400'}`}
      >
        <Target size={14} />
        Detalhes
      </button>
      <button
        onClick={() => onSectionChange('raci')}
        className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${mobileSection === 'raci'
          ? 'text-teal-600 dark:text-teal-400 border-b-2 border-teal-500'
          : 'text-slate-500 dark:text-slate-400'}`}
      >
        <Users size={14} />
        Equipe
        {action.raci?.length > 0 && (
          <span className="ml-1 bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 text-[10px] px-1.5 rounded-full">
            {action.raci.length}
          </span>
        )}
      </button>
      <button
        onClick={() => onSectionChange('comments')}
        className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${mobileSection === 'comments'
          ? 'text-teal-600 dark:text-teal-400 border-b-2 border-teal-500'
          : 'text-slate-500 dark:text-slate-400'}`}
      >
        <MessageCircle size={14} />
        Comentários
        {action.comments?.length > 0 && (
          <span className="ml-1 bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-400 text-[10px] px-1.5 rounded-full">
            {action.comments.length}
          </span>
        )}
      </button>
    </div>
  );
}
