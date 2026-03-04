import type { ActionComment } from "../../../types";
import { getAvatarUrl } from "../../settings/avatarUtils";

import { formatRelativeTime } from "./actionTable.utils";

export function ActionTableCommentItem({ comment }: { comment: ActionComment }) {
  return (
    <div className="flex gap-3 py-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
      <img
        src={getAvatarUrl(comment.authorAvatarId || "zg10")}
        alt={comment.authorName}
        className="w-8 h-8 rounded-full bg-white border border-slate-200 shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">{comment.authorName}</span>
          <span className="text-xs text-slate-400 flex items-center gap-1">{comment.authorMunicipio}</span>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs text-slate-400">{formatRelativeTime(comment.createdAt)}</span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 whitespace-pre-wrap">{comment.content}</p>
      </div>
    </div>
  );
}
