import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Action } from '../../../types';
import { useActionDetailDraft } from './useActionDetailDraft';

function createAction(overrides: Partial<Action> = {}): Action {
  return {
    uid: 'MR001::1.1.1',
    id: '1.1.1',
    activityId: '1.1',
    microregiaoId: 'MR001',
    title: 'Acao teste',
    status: 'Concluído',
    startDate: '2025-01-10',
    plannedEndDate: '2025-01-20',
    endDate: '2025-01-21',
    progress: 100,
    raci: [],
    tags: [],
    notes: '',
    comments: [],
    ...overrides,
  };
}

describe('useActionDetailDraft', () => {
  it('opens a reopen confirmation before mutating a concluded action', async () => {
    const initialAction = createAction();

    const { result } = renderHook(() =>
      useActionDetailDraft({
        initialAction,
        isOpen: true,
      })
    );

    await waitFor(() => expect(result.current.draftAction).not.toBeNull());

    act(() => {
      result.current.handleFieldChange('progress', 90);
    });

    expect(result.current.reopenConfig.isOpen).toBe(true);
    expect(result.current.draftAction?.progress).toBe(100);

    act(() => {
      result.current.confirmReopen();
    });

    expect(result.current.reopenConfig.isOpen).toBe(false);
    expect(result.current.draftAction?.progress).toBe(90);
    expect(result.current.draftAction?.endDate).toBe('');
    expect(result.current.draftAction?.status).toBe('Em Andamento');
  });

  it('auto-fills endDate when saving a completed action without completion date', async () => {
    const initialAction = createAction({ endDate: '' });
    const onSaveFullAction = vi.fn();

    const { result } = renderHook(() =>
      useActionDetailDraft({
        initialAction,
        isOpen: true,
        onSaveFullAction,
      })
    );

    await waitFor(() => expect(result.current.draftAction).not.toBeNull());

    act(() => {
      result.current.updateDraftField('title', 'Acao teste atualizada');
    });

    act(() => {
      result.current.handleSaveDirty();
    });

    expect(onSaveFullAction).toHaveBeenCalledTimes(1);
    expect(result.current.isDirty).toBe(false);

    const savedAction = onSaveFullAction.mock.calls[0][0] as Action;
    expect(savedAction.title).toBe('Acao teste atualizada');
    expect(savedAction.status).toBe('Concluído');
    expect(savedAction.progress).toBe(100);
    expect(savedAction.endDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
