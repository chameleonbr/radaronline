import { Plus, Save, Trash2 } from 'lucide-react';
import { Action } from '../../../types';
import { LoadingButton } from '../../../components/common/LoadingSpinner';
import { canSaveAction } from '../../../lib/actionRules';

interface ActionDetailFooterProps {
  action: Action;
  draftAction: Action;
  handleCloseDirty: () => void;
  handleSaveAndNewDirty: () => Promise<void>;
  handleSaveDirty: () => void;
  isSaving?: boolean;
  isSavingAndNew: boolean;
  onDeleteAction: (uid: string) => void;
  onSaveAndNew?: (updatedAction: Action) => Promise<void>;
  ruleErrors: {
    missingResponsible?: string;
  } & Record<string, string | undefined>;
  userCanDelete: boolean;
  userCanEdit: boolean;
}

export function ActionDetailFooter({
  action,
  draftAction,
  handleCloseDirty,
  handleSaveAndNewDirty,
  handleSaveDirty,
  isSaving,
  isSavingAndNew,
  onDeleteAction,
  onSaveAndNew,
  ruleErrors,
  userCanDelete,
  userCanEdit,
}: ActionDetailFooterProps) {
  if (!userCanEdit) {
    return null;
  }

  const canSave = canSaveAction(draftAction, ruleErrors as any);

  return (
    <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shrink-0">
      <div className="flex items-center justify-between">
        <div>
          {userCanDelete && (
            <button
              onClick={() => onDeleteAction(action.uid)}
              className="text-sm text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 transition-colors"
            >
              <Trash2 size={14} />
              <span>Excluir</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCloseDirty}
            className="px-4 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl transition-all"
          >
            Cancelar
          </button>

          {onSaveAndNew && (
            <LoadingButton
              onClick={() => void handleSaveAndNewDirty()}
              isLoading={isSavingAndNew}
              disabled={isSaving || !canSave}
              loadingText="Salvando..."
              className={`px-4 py-2 text-sm font-medium rounded-xl border transition-all flex items-center gap-2 ${!canSave
                ? 'bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700 cursor-not-allowed opacity-70'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Salvar e Nova</span>
              <span className="sm:hidden">S. e Nova</span>
            </LoadingButton>
          )}

          <div className="flex flex-col items-end">
            <LoadingButton
              onClick={handleSaveDirty}
              isLoading={isSaving}
              disabled={!canSave}
              loadingText="Salvando..."
              className={`px-6 py-2 text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 ${!canSave
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-200/50 dark:shadow-none'}`}
            >
              <Save size={16} />
              Salvar
            </LoadingButton>
            {ruleErrors.missingResponsible && (
              <span className="text-[9px] text-rose-500 font-medium mt-1 mr-1">
                Quem é responsável?
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

