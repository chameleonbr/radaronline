import { useMemo } from 'react';
import { ActionComment } from '../../../types';

export function useThreadedComments(comments: ActionComment[]) {
  return useMemo(() => {
    const commentMap = new Map<string, ActionComment>();
    const rootComments: ActionComment[] = [];

    comments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    comments.forEach((comment) => {
      const currentComment = commentMap.get(comment.id);
      if (!currentComment) {
        return;
      }

      if (comment.parentId && commentMap.has(comment.parentId)) {
        const parentComment = commentMap.get(comment.parentId);
        if (parentComment) {
          parentComment.replies = [...(parentComment.replies || []), currentComment];
        }
        return;
      }

      rootComments.push(currentComment);
    });

    return rootComments;
  }, [comments]);
}
