import React, { RefObject } from 'react';
import { Eye, Lock, MessageCircle, Reply, Send, X } from 'lucide-react';
import { Action, ActionComment, TeamMember } from '../../../types';
import { getAvatarUrl } from '../../settings/avatarUtils';
import { ActionDetailCommentItem } from './ActionDetailCommentItem';

interface ActionDetailCommentsPanelProps {
  action: Action;
  commentDraft: string;
  commentInputRef: RefObject<HTMLTextAreaElement>;
  filteredMentions: TeamMember[];
  handleAddComment: () => void;
  handleCommentChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleCommentKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleDeleteComment: (commentId: string) => void;
  handleEditComment: (commentId: string, content: string) => void;
  handleReply: (commentId: string, authorName: string) => void;
  isAdmin: boolean;
  isMobile: boolean;
  isSuperAdmin: boolean;
  mentionIndex: number;
  mobileSection: 'details' | 'raci' | 'comments';
  readOnly?: boolean;
  replyingTo: { id: string; authorName: string } | null;
  selectMention: (member: TeamMember) => void;
  setCommentDraft: (value: string) => void;
  setReplyingTo: (value: { id: string; authorName: string } | null) => void;
  showMentions: boolean;
  threadedComments: ActionComment[];
  user: { id?: string; nome?: string; avatarId?: string } | null;
  userCanEdit: boolean;
}

export function ActionDetailCommentsPanel({
  action,
  commentDraft,
  commentInputRef,
  filteredMentions,
  handleAddComment,
  handleCommentChange,
  handleCommentKeyDown,
  handleDeleteComment,
  handleEditComment,
  handleReply,
  isAdmin,
  isMobile,
  isSuperAdmin,
  mentionIndex,
  mobileSection,
  readOnly,
  replyingTo,
  selectMention,
  setCommentDraft,
  setReplyingTo,
  showMentions,
  threadedComments,
  user,
  userCanEdit,
}: ActionDetailCommentsPanelProps) {
  return (
    <div className={`flex-1 flex flex-col overflow-hidden relative bg-white dark:bg-slate-800 ${isMobile && mobileSection !== 'comments' ? 'hidden' : ''}`}>
      {!userCanEdit && (
        <div className="mx-4 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-amber-700 text-sm">
          {readOnly ? <Eye size={16} /> : <Lock size={16} />}
          <span>
            {readOnly
              ? 'Modo somente leitura. Selecione uma microrregião para editar.'
              : 'Você não tem permissão para editar esta ação.'}
          </span>
        </div>
      )}

      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600 flex justify-between items-center">
        <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <MessageCircle size={16} className="text-teal-600" />
          Comentários
        </span>
        <span className="bg-teal-100 text-teal-700 text-xs px-2.5 py-1 rounded-full font-bold">
          {action.comments?.length || 0}
        </span>
      </div>

      <div className="flex-1 px-4 md:px-6 overflow-y-auto">
        {threadedComments.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center h-full py-12">
            <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-full mb-3">
              <MessageCircle className="text-slate-300" size={32} />
            </div>
            <p className="text-slate-500 text-base font-medium">Nenhum comentário ainda</p>
            <p className="text-slate-400 text-sm mt-1">Seja o primeiro a comentar!</p>
          </div>
        ) : (
          <div className="py-4 max-w-2xl mx-auto">
            {threadedComments.map(comment => {
              const isAuthor = user?.id === comment.authorId;
              const createdAt = new Date(comment.createdAt);
              const now = new Date();
              const diffHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
              const withinTimeLimit = diffHours <= 2;

              return (
                <ActionDetailCommentItem
                  key={comment.id}
                  comment={comment}
                  onReply={handleReply}
                  onEdit={handleEditComment}
                  onDelete={handleDeleteComment}
                  canEditComment={isAdmin || isSuperAdmin || (isAuthor && withinTimeLimit)}
                />
              );
            })}
          </div>
        )}
      </div>

      <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
        <div className="max-w-2xl mx-auto">
          {replyingTo && (
            <div className="flex items-center gap-2 mb-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
              <Reply size={14} className="text-blue-500" />
              <span className="text-xs text-blue-700 dark:text-blue-300">
                Respondendo a <strong>{replyingTo.authorName}</strong>
              </span>
              <button
                onClick={() => {
                  setReplyingTo(null);
                  setCommentDraft('');
                }}
                className="ml-auto text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div className="relative flex items-start gap-3">
            <img
              src={getAvatarUrl(user?.avatarId || 'zg10')}
              alt={user?.nome || 'Usuário'}
              className="w-10 h-10 rounded-full bg-white dark:bg-slate-600 border-2 border-teal-400 shrink-0 shadow-sm"
            />
            <div className="flex-1 relative">
              {showMentions && filteredMentions.length > 0 && (
                <div className="absolute bottom-full left-0 right-0 mb-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg max-h-48 overflow-y-auto z-50">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase border-b border-slate-100 dark:border-slate-700">
                    Mencionar (@)
                  </div>
                  {filteredMentions.map((member, index) => (
                    <button
                      key={member.id}
                      onClick={() => selectMention(member)}
                      className={`w-full px-3 py-2 text-left flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${index === mentionIndex ? 'bg-slate-50 dark:bg-slate-700' : ''}`}
                    >
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-200">
                        {member.name.split(' ').map(name => name[0]).slice(0, 2).join('').toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                          {member.name}
                        </div>
                        <div className="text-xs text-slate-400 dark:text-slate-500 truncate">
                          {member.municipio || 'Sem município'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <textarea
                ref={commentInputRef}
                value={commentDraft}
                onChange={handleCommentChange}
                onKeyDown={handleCommentKeyDown}
                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl py-3 pl-4 pr-12 text-sm text-slate-600 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-600 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none transition-all"
                placeholder="Escreva um comentário... Use @ para mencionar"
                rows={2}
                style={{ minHeight: '60px', maxHeight: '120px' }}
              />
              <button
                onClick={handleAddComment}
                disabled={!commentDraft.trim() || !user}
                className={`absolute right-3 bottom-3 p-2 rounded-lg transition-all ${commentDraft.trim()
                  ? 'text-white bg-teal-500 hover:bg-teal-600 shadow-sm'
                  : 'text-slate-300 dark:text-slate-500 bg-slate-100 dark:bg-slate-600'}`}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
