import React, { useState } from 'react';
import { Check, CornerDownRight, Pencil, Reply, Trash2 } from 'lucide-react';
import { ActionComment } from '../../../types';
import { getAvatarUrl } from '../../settings/avatarUtils';
import { formatRelativeTime } from '../ActionTable';
import { renderCommentWithMentions } from '../../../components/common/MentionInput';

const getRoleLabel = (role?: string): { label: string; style: string } | null => {
  if (!role) return null;

  const normalizedRole = role.toLowerCase();
  if (normalizedRole === 'superadmin' || normalizedRole === 'admin') {
    return { label: 'Adm', style: 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300' };
  }
  if (normalizedRole === 'gestor') {
    return { label: 'Gestor', style: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' };
  }
  if (normalizedRole === 'usuario') {
    return { label: 'Usuário', style: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300' };
  }

  return null;
};

interface ActionDetailCommentItemProps {
  canEditComment?: boolean;
  comment: ActionComment;
  depth?: number;
  onDelete?: (commentId: string) => void;
  onEdit?: (commentId: string, content: string) => void;
  onReply?: (commentId: string, authorName: string) => void;
}

export function ActionDetailCommentItem({
  canEditComment,
  comment,
  depth = 0,
  onDelete,
  onEdit,
  onReply,
}: ActionDetailCommentItemProps) {
  const roleInfo = getRoleLabel(comment.authorRole);
  const isReply = depth > 0;
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const handleSaveEdit = () => {
    if (editContent.trim() && onEdit) {
      onEdit(comment.id, editContent.trim());
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  return (
    <div className={depth === 0 ? 'py-3 border-b border-slate-100 dark:border-slate-700/50 last:border-0' : 'mt-3'}>
      {isReply && (
        <div className="flex items-center gap-2 mb-2 ml-4">
          <CornerDownRight size={14} className="text-teal-500" />
          <span className="text-[10px] font-medium text-teal-600 dark:text-teal-400 uppercase tracking-wide">
            Resposta
          </span>
        </div>
      )}

      <div className={`flex gap-3 ${isReply ? 'ml-6 pl-4 py-3 rounded-xl bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent border-l-3 border-l-teal-500' : ''}`}>
        <img
          src={getAvatarUrl(comment.authorAvatarId || 'zg10')}
          alt={comment.authorName}
          className={`rounded-full bg-white dark:bg-slate-600 border-2 shrink-0 ${isReply ? 'w-7 h-7 border-teal-400/50' : 'w-9 h-9 border-slate-200 dark:border-slate-500'}`}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-semibold text-slate-800 dark:text-slate-100 ${isReply ? 'text-xs' : 'text-sm'}`}>
              {comment.authorName}
            </span>
            {roleInfo && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${roleInfo.style}`}>
                {roleInfo.label}
              </span>
            )}
            <span className="text-xs text-slate-400 dark:text-slate-500">{comment.authorMunicipio}</span>
            <span className="text-xs text-slate-300 dark:text-slate-600">•</span>
            <span className="text-xs text-slate-400 dark:text-slate-500">{formatRelativeTime(comment.createdAt)}</span>

            <div className="ml-auto flex items-center gap-1">
              {onReply && !isEditing && (
                <button
                  onClick={() => onReply(comment.id, comment.authorName)}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:text-teal-400 dark:hover:bg-teal-900/30 rounded-lg transition-all"
                  title="Responder"
                >
                  <Reply size={12} />
                  <span className="hidden sm:inline">Responder</span>
                </button>
              )}
              {canEditComment && !isEditing && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-900/30 rounded transition-all"
                    title="Editar"
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    onClick={() => onDelete?.(comment.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:text-rose-400 dark:hover:bg-rose-900/30 rounded transition-all"
                    title="Excluir"
                  >
                    <Trash2 size={12} />
                  </button>
                </>
              )}
            </div>
          </div>

          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editContent}
                onChange={(event) => setEditContent(event.target.value)}
                className="w-full p-2 text-sm bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none"
                rows={2}
                autoFocus
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleSaveEdit}
                  disabled={!editContent.trim()}
                  className="px-3 py-1 text-xs font-medium bg-teal-600 hover:bg-teal-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <Check size={12} />
                  Salvar
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <p className={`text-slate-600 dark:text-slate-300 mt-1.5 whitespace-pre-wrap leading-relaxed ${isReply ? 'text-xs' : 'text-sm'}`}>
              {renderCommentWithMentions(comment.content)}
            </p>
          )}
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-1">
          {comment.replies.map(reply => (
            <ActionDetailCommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              canEditComment={canEditComment}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
