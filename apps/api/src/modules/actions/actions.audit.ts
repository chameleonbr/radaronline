import type { SessionUser } from '../../shared/auth/auth.types.js';
import { getSupabaseAdminClient, hasSupabaseAdminConfig } from '../../shared/persistence/supabase-admin.js';
import type { ActionRecord } from './actions.types.js';

export async function logActionsAdminEvent(args: {
  actor: SessionUser;
  actionType: string;
  targetAction: ActionRecord;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  if (!hasSupabaseAdminConfig()) {
    return;
  }

  const client = getSupabaseAdminClient();
  await client.from('activity_logs').insert({
    user_id: args.actor.id,
    action_type: args.actionType,
    entity_type: 'action',
    entity_id: args.targetAction.dbId,
    metadata: {
      actor_id: args.actor.id,
      actor_email: args.actor.email,
      actor_role: args.actor.role,
      action_uid: args.targetAction.uid,
      action_title: args.targetAction.title,
      microregion_id: args.targetAction.microregionId,
      ...args.metadata,
      timestamp: new Date().toISOString(),
    },
  });
}
