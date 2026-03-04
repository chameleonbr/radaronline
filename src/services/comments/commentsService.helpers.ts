import type { ActionComment } from '../../types';
import type {
  ActionCommentDTO,
  CommentAuthorProfile,
  InsertedCommentRow,
} from './commentsService.types';

const MENTION_REGEX = /@([^\s@]+(?:\s+[A-ZÀ-Ý][^\s@]*)?)/g;

export function mapActionCommentDTO(dto: ActionCommentDTO): ActionComment {
  const author = Array.isArray(dto.author) ? dto.author[0] : dto.author;

  return {
    id: dto.id,
    parentId: dto.parent_id || null,
    authorId: dto.author_id,
    authorName: author?.nome || 'Usuario',
    authorMunicipio: author?.municipio || author?.microregiao_id || '',
    authorAvatarId: author?.avatar_id || 'zg10',
    authorRole: author?.role || undefined,
    content: dto.content,
    createdAt: dto.created_at,
    replies: [],
  };
}

export function buildInsertedCommentModel(
  row: InsertedCommentRow,
  authorId: string,
  profile: CommentAuthorProfile | null
): ActionComment {
  return {
    id: row.id,
    parentId: row.parent_id || null,
    authorId,
    authorName: profile?.nome || 'Usuario',
    authorMunicipio: profile?.municipio || profile?.microregiao_id || '',
    authorAvatarId: profile?.avatar_id || 'zg10',
    authorRole: profile?.role || undefined,
    content: row.content,
    createdAt: row.created_at,
    replies: [],
  };
}

export function extractMentionedNames(commentContent: string): string[] {
  const mentions: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = MENTION_REGEX.exec(commentContent)) !== null) {
    mentions.push(match[1]);
  }

  return [...new Set(mentions)];
}

export function filterMentionTargets(
  mentionedNames: string[],
  authorName: string
): string[] {
  const normalizedAuthorName = authorName.trim().toLowerCase();
  return mentionedNames.filter(
    (mentionedName) => mentionedName.trim().toLowerCase() !== normalizedAuthorName
  );
}
