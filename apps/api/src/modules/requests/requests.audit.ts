import type { SessionUser } from '../../shared/auth/auth.types.js';
import { getSupabaseAdminClient, hasSupabaseAdminConfig } from '../../shared/persistence/supabase-admin.js';

export async function logRequestAdminEvent(args: {
  actor: SessionUser;
  actionType: string;
  requestId: string;
  metadata?: Record<string, unknown>;
}) {
  if (!hasSupabaseAdminConfig()) {
    return;
  }

  await getSupabaseAdminClient().from('activity_logs').insert({
    user_id: args.actor.id,
    action_type: args.actionType,
    entity_type: 'request',
    entity_id: args.requestId,
    metadata: {
      actor_id: args.actor.id,
      actor_email: args.actor.email,
      actor_role: args.actor.role,
      ...args.metadata,
      timestamp: new Date().toISOString(),
    },
  });
}
