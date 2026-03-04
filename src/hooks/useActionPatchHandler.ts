import { useCallback } from 'react';
import type { Action } from '../types';

type EditableActionPatch = Partial<Pick<
  Action,
  'title' | 'status' | 'startDate' | 'plannedEndDate' | 'endDate' | 'progress' | 'notes'
>>;

export function useActionPatchHandler(
  onUpdateAction: (uid: string, field: string, value: string | number) => void
) {
  return useCallback((uid: string, updates: EditableActionPatch) => {
    (
      Object.entries(updates) as Array<
        [keyof EditableActionPatch, EditableActionPatch[keyof EditableActionPatch]]
      >
    ).forEach(([field, value]) => {
      if (value !== undefined) {
        onUpdateAction(uid, field, value);
      }
    });
  }, [onUpdateAction]);
}
