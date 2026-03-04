import { useCallback, useEffect, useState } from 'react';
import { Action, Status } from '../../../types';
import { applyActionRules, type ActionRuleErrors } from '../../../lib/actionRules';

interface ReopenConfig {
  isOpen: boolean;
  pendingPatch: Partial<Action> | null;
}

interface ActionDetailUiState {
  progressDisabled: boolean;
  progressDisabledReason: string;
  isOverdue: boolean;
}

interface UseActionDetailDraftParams {
  initialAction: Action | null;
  isOpen: boolean;
  onSaveFullAction?: (action: Action) => void;
  onSaveAndNew?: (updatedAction: Action) => Promise<void>;
}

export function useActionDetailDraft({
  initialAction,
  isOpen,
  onSaveFullAction,
  onSaveAndNew,
}: UseActionDetailDraftParams) {
  const [draftAction, setDraftAction] = useState<Action | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSavingAndNew, setIsSavingAndNew] = useState(false);
  const [ruleErrors, setRuleErrors] = useState<ActionRuleErrors>({});
  const [uiState, setUiState] = useState<ActionDetailUiState>({
    progressDisabled: false,
    progressDisabledReason: '',
    isOverdue: false,
  });
  const [reopenConfig, setReopenConfig] = useState<ReopenConfig>({
    isOpen: false,
    pendingPatch: null,
  });

  useEffect(() => {
    if (initialAction) {
      setDraftAction(JSON.parse(JSON.stringify(initialAction)));
      setIsDirty(false);
      return;
    }

    setDraftAction(null);
  }, [initialAction, isOpen]);

  useEffect(() => {
    if (!draftAction) {
      return;
    }

    const { errors, ui } = applyActionRules(draftAction, {});
    setRuleErrors(errors);
    setUiState(ui);
  }, [draftAction]);

  const updateDraftField = useCallback((field: keyof Action, value: Action[keyof Action]) => {
    setDraftAction((previousAction) => {
      if (!previousAction) {
        return null;
      }

      const { next, errors, ui } = applyActionRules(previousAction, { [field]: value });
      setRuleErrors(errors);
      setUiState(ui);
      return next;
    });
    setIsDirty(true);
  }, []);

  const handleFieldChange = useCallback((field: keyof Action, value: any) => {
    if (!draftAction) {
      return;
    }

    const isConcluded = !!draftAction.endDate;
    let impliesReopen = false;

    if (isConcluded) {
      if (field === 'progress' && value < 100) impliesReopen = true;
      if (field === 'status' && value !== 'Concluído') impliesReopen = true;
      if (field === 'endDate' && !value) impliesReopen = true;
    }

    if (impliesReopen) {
      setReopenConfig({
        isOpen: true,
        pendingPatch: { [field]: value },
      });
      return;
    }

    updateDraftField(field, value);
  }, [draftAction, updateDraftField]);

  const confirmReopen = useCallback(() => {
    if (!reopenConfig.pendingPatch) {
      return;
    }

    setDraftAction((previousAction) => {
      if (!previousAction) {
        return null;
      }

      const reopenPatch: Partial<Action> = {
        endDate: '',
        status: 'Em Andamento',
        ...reopenConfig.pendingPatch,
      };

      const { next, errors, ui } = applyActionRules(previousAction, reopenPatch);
      setRuleErrors(errors);
      setUiState(ui);
      return next;
    });

    setReopenConfig({ isOpen: false, pendingPatch: null });
    setIsDirty(true);
  }, [reopenConfig.pendingPatch]);

  const cancelReopen = useCallback(() => {
    setReopenConfig({ isOpen: false, pendingPatch: null });
  }, []);

  const setDateShortcut = useCallback((field: 'startDate' | 'plannedEndDate' | 'endDate', daysToAdd: number = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    const isoDate = date.toISOString().split('T')[0];
    updateDraftField(field, isoDate);
  }, [updateDraftField]);

  const handleSaveDirty = useCallback(() => {
    if (!draftAction) {
      return;
    }

    const needsEndDate = (draftAction.status === 'Concluído' || draftAction.progress === 100) && !draftAction.endDate;
    const actionToSave = needsEndDate ? {
      ...draftAction,
      endDate: new Date().toLocaleDateString('sv').split('T')[0],
      status: 'Concluído' as Status,
      progress: 100,
    } : draftAction;

    if (onSaveFullAction) {
      onSaveFullAction(actionToSave);
    }

    setIsDirty(false);
  }, [draftAction, onSaveFullAction]);

  const handleSaveAndNewDirty = useCallback(async () => {
    if (!draftAction || !onSaveAndNew) {
      return;
    }

    setIsSavingAndNew(true);
    try {
      await onSaveAndNew(draftAction);
      setIsDirty(false);
    } finally {
      setIsSavingAndNew(false);
    }
  }, [draftAction, onSaveAndNew]);

  return {
    draftAction,
    setDraftAction,
    isDirty,
    setIsDirty,
    isSavingAndNew,
    ruleErrors,
    uiState,
    reopenConfig,
    updateDraftField,
    handleFieldChange,
    confirmReopen,
    cancelReopen,
    setDateShortcut,
    handleSaveDirty,
    handleSaveAndNewDirty,
  };
}
