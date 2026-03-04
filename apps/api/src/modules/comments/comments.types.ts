export interface ActionCommentRecord {
  id: string;
  actionUid: string;
  parentId: string | null;
  authorId: string;
  authorName: string;
  authorMunicipio: string;
  authorAvatarId: string;
  authorRole?: string;
  content: string;
  createdAt: string;
}

export interface CreateCommentInput {
  actionUid: string;
  parentId?: string | null;
  content: string;
  authorId: string;
}
