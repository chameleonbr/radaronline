import { type Dispatch, type MouseEvent, type SetStateAction, useCallback, useEffect, useState } from 'react';
import { Action, ActionTag } from '../../../types';
import { createTag, deleteTag, loadTags, toggleTagFavorite } from '../../../services/tagsService';

interface UseActionDetailTagsParams {
  draftAction: Action | null;
  setDraftAction: Dispatch<SetStateAction<Action | null>>;
  setIsDirty: Dispatch<SetStateAction<boolean>>;
}

export function useActionDetailTags({ draftAction, setDraftAction, setIsDirty }: UseActionDetailTagsParams) {
  const [showTagPopover, setShowTagPopover] = useState(false);
  const [availableTags, setAvailableTags] = useState<ActionTag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<ActionTag | null>(null);
  const [tagStatusMsg, setTagStatusMsg] = useState('');

  useEffect(() => {
    if (showTagPopover) {
      setIsLoadingTags(true);
      loadTags(draftAction?.microregiaoId)
        .then((tags) => setAvailableTags(tags))
        .catch(() => setAvailableTags([]))
        .finally(() => setIsLoadingTags(false));
      return;
    }

    setTagToDelete(null);
  }, [showTagPopover, draftAction?.microregiaoId]);

  const toggleTagSelection = useCallback((tag: ActionTag, event?: MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!draftAction) return;

    const currentTags = draftAction.tags || [];
    const hasTag = currentTags.some((item) => item.id === tag.id);

    if (hasTag) {
      setDraftAction((previous) => {
        if (!previous) return null;
        const safeTags = previous.tags || [];
        return { ...previous, tags: safeTags.filter((item) => item.id !== tag.id) };
      });
    } else {
      setDraftAction((previous) => {
        if (!previous) return null;
        const safeTags = previous.tags || [];
        if (safeTags.some((item) => item.id === tag.id)) return previous;
        return { ...previous, tags: [...safeTags, tag] };
      });
    }

    setIsDirty(true);
  }, [draftAction, setDraftAction, setIsDirty]);

  const handleCreateTag = useCallback(async () => {
    if (!newTagName.trim()) return;

    try {
      const createdTag = await createTag(newTagName.trim());
      setNewTagName('');
      setAvailableTags((previous) => [...previous, createdTag].sort((left, right) => left.name.localeCompare(right.name)));
    } catch {
      // no-op for now; UI keeps previous state
    }
  }, [newTagName]);

  const handleDeleteTag = useCallback((tag: ActionTag) => {
    setTagToDelete(tag);
  }, []);

  const confirmDeleteTag = useCallback(async () => {
    if (!tagToDelete) return;

    try {
      await deleteTag(tagToDelete.id);
      setAvailableTags((previous) => previous.filter((item) => item.id !== tagToDelete.id));
      setDraftAction((previous) => {
        if (!previous) return null;
        const hasTag = previous.tags.some((item) => item.id === tagToDelete.id);
        if (!hasTag) return previous;
        setIsDirty(true);
        return { ...previous, tags: previous.tags.filter((item) => item.id !== tagToDelete.id) };
      });
    } finally {
      setTagToDelete(null);
    }
  }, [setDraftAction, setIsDirty, tagToDelete]);

  const handleToggleFavorite = useCallback(async (tag: ActionTag, event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!draftAction?.microregiaoId) {
      setTagStatusMsg('Erro: Sem ID');
      return;
    }

    setTagStatusMsg('Salvando...');

    try {
      setAvailableTags((previous) =>
        previous.map((item) => (item.id === tag.id ? { ...item, isFavorite: !item.isFavorite } : item))
      );
      await toggleTagFavorite(tag.id, draftAction.microregiaoId);
      setTagStatusMsg('Salvo!');
      setTimeout(() => setTagStatusMsg(''), 1500);
    } catch (error) {
      setTagStatusMsg(`Erro: ${error instanceof Error ? error.message : 'Falha'}`);
      const freshTags = await loadTags(draftAction.microregiaoId);
      setAvailableTags(freshTags);
    }
  }, [draftAction?.microregiaoId]);

  return {
    showTagPopover,
    setShowTagPopover,
    availableTags,
    newTagName,
    setNewTagName,
    isLoadingTags,
    tagToDelete,
    setTagToDelete,
    tagStatusMsg,
    toggleTagSelection,
    handleCreateTag,
    handleDeleteTag,
    confirmDeleteTag,
    handleToggleFavorite,
  };
}
