import type { Action, ActionComment, RaciMember } from '../../types';
import type {
  ActionCommentDTO,
  ActionDTO,
  ActionRaciDTO,
  ActionTagDTO,
  LoadedActionRow,
} from './actionsService.types';

export function mapActionDTOToAction(
  dto: ActionDTO,
  raci: ActionRaciDTO[],
  comments: ActionCommentDTO[],
  tags: ActionTagDTO[] = [],
  commentCount = 0
): Action {
  return {
    uid: dto.uid,
    id: dto.action_id,
    activityId: dto.activity_id,
    microregiaoId: dto.microregiao_id,
    title: dto.title,
    status: dto.status as Action['status'],
    startDate: dto.start_date || '',
    plannedEndDate: dto.planned_end_date || '',
    endDate: dto.end_date || '',
    progress: dto.progress,
    raci: raci.map((item) => ({
      name: item.member_name,
      role: item.role as RaciMember['role'],
    })),
    tags: tags.map((item) => ({
      id: item.id,
      name: item.name,
      color: item.color,
    })),
    notes: dto.notes || '',
    comments: comments.map(mapActionCommentDTOToComment),
    commentCount: commentCount || comments.length,
  };
}

export function mapActionCommentDTOToComment(comment: ActionCommentDTO): ActionComment {
  const author = Array.isArray(comment.author) ? comment.author[0] : comment.author;

  return {
    id: comment.id,
    parentId: comment.parent_id || null,
    authorId: comment.author_id,
    authorName: author?.nome || 'Usuario',
    authorMunicipio: author?.municipio || author?.microregiao_id || '',
    authorAvatarId: author?.avatar_id || 'zg10',
    authorRole: author?.role || undefined,
    content: comment.content,
    createdAt: comment.created_at,
  };
}

export function mapLoadedActionRowToAction(row: LoadedActionRow): Action {
  const rawTags = row.tags || [];
  const tags = Array.isArray(rawTags)
    ? rawTags.map((item) => item.tag).filter(Boolean)
    : rawTags.tag
      ? [rawTags.tag]
      : [];

  const commentCount = row.comments?.[0]?.count || 0;

  return mapActionDTOToAction(
    row,
    row.raci || [],
    [],
    tags as ActionTagDTO[],
    commentCount
  );
}

export function toActionUpdatePayload(
  updates: Partial<Omit<Action, 'uid' | 'id' | 'activityId' | 'microregiaoId' | 'comments' | 'raci'>>
): Record<string, unknown> {
  const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.startDate !== undefined) updateData.start_date = updates.startDate || null;
  if (updates.plannedEndDate !== undefined) updateData.planned_end_date = updates.plannedEndDate || null;
  if (updates.endDate !== undefined) updateData.end_date = updates.endDate || null;
  if (updates.progress !== undefined) updateData.progress = updates.progress;
  if (updates.notes !== undefined) updateData.notes = updates.notes;

  return updateData;
}
