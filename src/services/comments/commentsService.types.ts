import type { ActionComment } from '../../types';

export interface CommentAuthorDTO {
  nome: string;
  microregiao_id: string | null;
  avatar_id: string | null;
  role: string | null;
  municipio: string | null;
}

export interface ActionCommentDTO {
  id: string;
  action_id: string;
  author_id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
  author?: CommentAuthorDTO | CommentAuthorDTO[] | null;
}

export type CommentAuthorProfile = CommentAuthorDTO;

export interface InsertCommentInput {
  action_id: string;
  author_id: string;
  parent_id: string | null;
  content: string;
}

export interface InsertedCommentRow {
  id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
}

export type ActionCommentModel = ActionComment;
