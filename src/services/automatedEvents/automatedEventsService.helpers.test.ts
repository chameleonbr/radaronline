import { describe, expect, it } from 'vitest';

import {
  buildAutomatedEventInsertPayload,
  mapAutomatedEventRow,
  timeSince,
} from './automatedEventsService.helpers';
import type { AutomatedEventRow } from './automatedEventsService.types';

describe('automatedEventsService.helpers', () => {
  it('calcula tempo relativo', () => {
    const now = new Date('2026-03-01T10:00:00Z');
    expect(timeSince(new Date('2026-03-01T09:00:00Z'), now)).toBe('1h atras');
    expect(timeSince(new Date('2026-03-01T09:58:00Z'), now)).toBe('2min atras');
  });

  it('mapeia evento do banco para dominio', () => {
    const row: AutomatedEventRow = {
      id: 'event-1',
      type: 'new_user',
      municipality: 'Belo Horizonte',
      title: 'Novo membro',
      details: null,
      image_gradient: 'from-a to-b',
      likes: 3,
      footer_context: null,
      created_at: '2026-03-01T09:00:00Z',
    };

    expect(mapAutomatedEventRow(row, new Date('2026-03-01T10:00:00Z'))).toEqual({
      id: 'event-1',
      type: 'new_user',
      municipality: 'Belo Horizonte',
      title: 'Novo membro',
      details: undefined,
      imageGradient: 'from-a to-b',
      likes: 3,
      footerContext: undefined,
      timestamp: '1h atras',
      created_at: '2026-03-01T09:00:00Z',
    });
  });

  it('monta payload de insert', () => {
    expect(
      buildAutomatedEventInsertPayload({
        type: 'plan_completed',
        municipality: 'Betim',
        title: 'Plano concluido',
        details: 'Detalhe',
        imageGradient: 'from-c to-d',
        footerContext: 'Marco',
      })
    ).toEqual({
      type: 'plan_completed',
      municipality: 'Betim',
      title: 'Plano concluido',
      details: 'Detalhe',
      image_gradient: 'from-c to-d',
      footer_context: 'Marco',
    });
  });
});
