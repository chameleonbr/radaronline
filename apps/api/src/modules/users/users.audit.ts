import type { SessionUser } from '../../shared/auth/auth.types.js';
import { hasSupabaseAdminConfig, getSupabaseAdminClient } from '../../shared/persistence/supabase-admin.js';
import type { UserRecord } from './users.types.js';

export async function logUsersAdminEvent(args: {
  actor: SessionUser;
  actionType: string;
  entityId: string;
  targetUser?: UserRecord | null;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  if (!hasSupabaseAdminConfig()) {
    return;
  }

  const client = getSupabaseAdminClient();
  await client.from('activity_logs').insert({
    user_id: args.actor.id,
    action_type: args.actionType,
    entity_type: 'user',
    entity_id: args.entityId,
    metadata: {
      actor_id: args.actor.id,
      actor_email: args.actor.email,
      actor_role: args.actor.role,
      target_user_email: args.targetUser?.email,
      target_user_role: args.targetUser?.role,
      ...args.metadata,
      timestamp: new Date().toISOString(),
    },
  });
}
