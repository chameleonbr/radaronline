import { describe, expect, it } from 'vitest';

import {
  buildObjectiveUpdatePayload,
  groupActivitiesByObjective,
  mapObjectiveDTOToObjective,
} from './objectivesActivitiesService.helpers';
import type {
  ActivityDTO,
  ObjectiveDTO,
} from './objectivesActivitiesService.types';

describe('objectivesActivitiesService.helpers', () => {
  it('mapeia objetivo do banco para dominio', () => {
    const dto: ObjectiveDTO = {
      id: 1,
      title: 'Objetivo',
      status: 'delayed',
      microregiao_id: 'micro-1',
      created_at: '2026-03-01T00:00:00Z',
      eixo: 2,
      description: 'Descricao',
      eixo_label: 'Governanca',
      eixo_color: 'amber',
    };

    expect(mapObjectiveDTOToObjective(dto)).toEqual({
      id: 1,
      title: 'Objetivo',
      status: 'delayed',
      microregiaoId: 'micro-1',
      eixo: 2,
      description: 'Descricao',
      eixoLabel: 'Governanca',
      eixoColor: 'amber',
    });
  });

  it('agrupa atividades por objetivo', () => {
    const data: ActivityDTO[] = [
      {
        id: '1.1',
        objective_id: 1,
        title: 'Atividade 1',
        description: null,
        microregiao_id: 'micro-1',
        created_at: '2026-03-01T00:00:00Z',
      },
      {
        id: '2.1',
        objective_id: 2,
        title: 'Atividade 2',
        description: 'Detalhe',
        microregiao_id: 'micro-2',
        created_at: '2026-03-01T00:00:00Z',
      },
    ];

    expect(groupActivitiesByObjective(data)).toEqual({
      1: [
        {
          id: '1.1',
          title: 'Atividade 1',
          description: '',
          microregiaoId: 'micro-1',
        },
      ],
      2: [
        {
          id: '2.1',
          title: 'Atividade 2',
          description: 'Detalhe',
          microregiaoId: 'micro-2',
        },
      ],
    });
  });

  it('monta payload parcial de update de objetivo', () => {
    expect(
      buildObjectiveUpdatePayload({
        title: 'Novo objetivo',
        eixoLabel: 'Saude Digital',
      })
    ).toEqual({
      title: 'Novo objetivo',
      eixo_label: 'Saude Digital',
    });
  });
});
