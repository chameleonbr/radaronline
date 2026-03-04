import { useCallback, useState, type ChangeEvent, type Dispatch, type KeyboardEvent, type RefObject, type SetStateAction } from 'react';
import { Action, ActionComment, TeamMember } from '../../../types';

type ActionDetailUser = {
  id: string;
  nome: string;
  municipio?: string;
  avatarId?: string;
  role?: string;
} | null;

interface UseActionDetailCommentsParams {
  team: TeamMember[];
  user: ActionDetailUser;
  draftAction: Action | null;
  setDraftAction: Dispatch<SetStateAction<Action | null>>;
  setIsDirty: Dispatch<SetStateAction<boolean>>;
  onAddComment?: (
    uid: string,
    content: string,
    parentId?: string | null
  ) => Promise<ActionComment | null | void> | ActionComment | null | void;
  commentInputRef: RefObject<HTMLTextAreaElement>;
}

export function useActionDetailComments({
  team,
  user,
  draftAction,
  setDraftAction,
  setIsDirty,
  onAddComment,
  commentInputRef,
}: UseActionDetailCommentsParams) {
  const [commentDraft, setCommentDraft] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [mentionIndex, setMentionIndex] = useState(0);
  const [cursorPos, setCursorPos] = useState(0);
  const [replyingTo, setReplyingTo] = useState<{ id: string; authorName: string } | null>(null);

  const filteredMentions = team
    .filter((member) => member.name.toLowerCase().includes(mentionSearch.toLowerCase()))
    .slice(0, 8);

  const handleReply = useCallback((commentId: string, authorName: string) => {
    setReplyingTo({ id: commentId, authorName });
    setCommentDraft(`@${authorName} `);
    commentInputRef.current?.focus();
  }, [commentInputRef]);

  const handleAddComment = useCallback(async () => {
    const trimmedContent = commentDraft.trim();
    if (!trimmedContent || !user || !draftAction) {
      return;
    }

    let newComment: ActionComment | null = null;

    if (onAddComment) {
      try {
        const persistedComment = await onAddComment(
          draftAction.uid,
          trimmedContent,
          replyingTo?.id || null
        );

        if (!persistedComment) {
          return;
        }

        newComment = persistedComment;
      } catch {
        return;
      }
    } else {
      newComment = {
        id: `temp-${Date.now()}`,
        parentId: replyingTo?.id || null,
        authorId: user.id,
        authorName: user.nome,
        authorMunicipio: user.municipio || '',
        authorAvatarId: user.avatarId || 'zg10',
        authorRole: user.role,
        content: trimmedContent,
        createdAt: new Date().toISOString(),
      };
      setIsDirty(true);
    }

    setDraftAction((previousAction) => {
      if (!previousAction || !newComment) {
        return previousAction;
      }

      return {
        ...previousAction,
        comments: [...(previousAction.comments || []), newComment],
      };
    });

    setCommentDraft('');
    setShowMentions(false);
    setReplyingTo(null);
  }, [commentDraft, user, draftAction, onAddComment, replyingTo, setDraftAction, setIsDirty]);

  const handleEditComment = useCallback((commentId: string, content: string) => {
    setDraftAction((previousAction) => {
      if (!previousAction) {
        return null;
      }

      const updatedComments = previousAction.comments?.map((comment) =>
        comment.id === commentId ? { ...comment, content } : comment
      ) || [];

      return { ...previousAction, comments: updatedComments };
    });
    setIsDirty(true);
  }, [setDraftAction, setIsDirty]);

  const handleCommentChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    const cursor = event.target.selectionStart || 0;
    setCommentDraft(value);
    setCursorPos(cursor);

    const textBefore = value.slice(0, cursor);
    const atIndex = textBefore.lastIndexOf('@');

    if (atIndex !== -1) {
      const afterAt = textBefore.slice(atIndex + 1);
      if (!afterAt.includes(' ') && !afterAt.includes('\n')) {
        setMentionSearch(afterAt);
        setShowMentions(true);
        setMentionIndex(0);
        return;
      }
    }

    setShowMentions(false);
  }, []);

  const selectMention = useCallback((member: TeamMember) => {
    const textBefore = commentDraft.slice(0, cursorPos);
    const textAfter = commentDraft.slice(cursorPos);
    const atIndex = textBefore.lastIndexOf('@');

    if (atIndex === -1) {
      return;
    }

    const newValue = textBefore.slice(0, atIndex) + `@${member.name} ` + textAfter;
    setCommentDraft(newValue);
    setShowMentions(false);

    setTimeout(() => {
      if (!commentInputRef.current) {
        return;
      }

      const newPosition = atIndex + member.name.length + 2;
      commentInputRef.current.setSelectionRange(newPosition, newPosition);
      commentInputRef.current.focus();
    }, 0);
  }, [commentDraft, cursorPos, commentInputRef]);

  const handleCommentKeyDown = useCallback((event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (showMentions && filteredMentions.length > 0) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setMentionIndex((previousIndex) => (previousIndex + 1) % filteredMentions.length);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setMentionIndex((previousIndex) => (previousIndex - 1 + filteredMentions.length) % filteredMentions.length);
      } else if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        selectMention(filteredMentions[mentionIndex]);
      } else if (event.key === 'Escape') {
        setShowMentions(false);
      }
      return;
    }

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void handleAddComment();
    }
  }, [filteredMentions, handleAddComment, mentionIndex, selectMention, showMentions]);

  return {
    commentDraft,
    setCommentDraft,
    filteredMentions,
    handleAddComment,
    handleCommentChange,
    handleCommentKeyDown,
    handleEditComment,
    handleReply,
    mentionIndex,
    replyingTo,
    selectMention,
    setReplyingTo,
    showMentions,
  };
}
