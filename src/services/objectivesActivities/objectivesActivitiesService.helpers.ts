import type { Activity } from '../../types';
import type {
  ActivityDTO,
  ObjectiveDTO,
  ObjectiveRecord,
  ObjectiveUpdateInput,
} from './objectivesActivitiesService.types';

export function mapObjectiveDTOToObjective(dto: ObjectiveDTO): ObjectiveRecord {
  return {
    id: dto.id,
    title: dto.title,
    status: dto.status === 'delayed' ? 'delayed' : 'on-track',
    microregiaoId: dto.microregiao_id,
    eixo: dto.eixo,
    description: dto.description,
    eixoLabel: dto.eixo_label,
    eixoColor: dto.eixo_color,
  };
}

export function groupActivitiesByObjective(data: ActivityDTO[]): Record<number, Activity[]> {
  const grouped: Record<number, Activity[]> = {};

  data.forEach((activity) => {
    if (!grouped[activity.objective_id]) {
      grouped[activity.objective_id] = [];
    }

    grouped[activity.objective_id].push({
      id: activity.id,
      title: activity.title,
      description: activity.description || '',
      microregiaoId: activity.microregiao_id,
    });
  });

  return grouped;
}

export function buildObjectiveUpdatePayload(
  updates: ObjectiveUpdateInput
): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.eixo !== undefined) payload.eixo = updates.eixo;
  if (updates.description !== undefined) payload.description = updates.description;
  if (updates.eixoLabel !== undefined) payload.eixo_label = updates.eixoLabel;
  if (updates.eixoColor !== undefined) payload.eixo_color = updates.eixoColor;

  return payload;
}
