import type { SessionUser } from '../../shared/auth/auth.types.js';
import { getSupabaseAdminClient, hasSupabaseAdminConfig } from '../../shared/persistence/supabase-admin.js';
import type { ActionCommentRecord } from './comments.types.js';

export async function logCommentsAdminEvent(args: {
  actor: SessionUser;
  actionType: string;
  targetComment: ActionCommentRecord;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  if (!hasSupabaseAdminConfig()) {
    return;
  }

  await getSupabaseAdminClient().from('activity_logs').insert({
    user_id: args.actor.id,
    action_type: args.actionType,
    entity_type: 'comment',
    entity_id: args.targetComment.id,
    metadata: {
      actor_id: args.actor.id,
      actor_email: args.actor.email,
      actor_role: args.actor.role,
      action_uid: args.targetComment.actionUid,
      parent_id: args.targetComment.parentId,
      ...args.metadata,
      timestamp: new Date().toISOString(),
    },
  });
}
