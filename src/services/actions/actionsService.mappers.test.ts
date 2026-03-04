import { describe, expect, it, vi } from 'vitest';

import { mapLoadedActionRowToAction, toActionUpdatePayload } from './actionsService.mappers';

describe('actionsService.mappers', () => {
  it('maps list rows with nested tags and comment count to action', () => {
    const action = mapLoadedActionRowToAction({
      id: 'db-1',
      uid: 'MR001::1.1.1',
      action_id: '1.1.1',
      activity_id: '1.1',
      microregiao_id: 'MR001',
      title: 'Acao teste',
      status: 'Em Andamento',
      start_date: '2026-01-01',
      planned_end_date: '2026-02-01',
      end_date: null,
      progress: 45,
      notes: 'Obs',
      raci: [{ id: 'r1', action_id: 'db-1', member_name: 'Maria', role: 'R' }],
      comments: [{ count: 3 }],
      tags: [{ tag: { id: 'tag-1', name: 'Urgente', color: '#ff0000' } }],
    });

    expect(action).toEqual({
      uid: 'MR001::1.1.1',
      id: '1.1.1',
      activityId: '1.1',
      microregiaoId: 'MR001',
      title: 'Acao teste',
      status: 'Em Andamento',
      startDate: '2026-01-01',
      plannedEndDate: '2026-02-01',
      endDate: '',
      progress: 45,
      raci: [{ name: 'Maria', role: 'R' }],
      tags: [{ id: 'tag-1', name: 'Urgente', color: '#ff0000' }],
      notes: 'Obs',
      comments: [],
      commentCount: 3,
    });
  });

  it('builds db payload for partial action updates', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-01T15:00:00.000Z'));

    expect(
      toActionUpdatePayload({
        title: 'Nova acao',
        plannedEndDate: '',
        progress: 100,
      })
    ).toEqual({
      title: 'Nova acao',
      planned_end_date: null,
      progress: 100,
      updated_at: '2026-03-01T15:00:00.000Z',
    });

    vi.useRealTimers();
  });
});
