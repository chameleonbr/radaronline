import type { SessionUser } from '../../shared/auth/auth.types.js';
import { getSupabaseAdminClient, hasSupabaseAdminConfig } from '../../shared/persistence/supabase-admin.js';
import type { TagRecord } from './tags.types.js';

export async function logTagsAdminEvent(args: {
  actor: SessionUser;
  actionType: string;
  targetTag?: TagRecord | null;
  entityId: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  if (!hasSupabaseAdminConfig()) return;

  await getSupabaseAdminClient().from('activity_logs').insert({
    user_id: args.actor.id,
    action_type: args.actionType,
    entity_type: 'tag',
    entity_id: args.entityId,
    metadata: {
      actor_id: args.actor.id,
      actor_email: args.actor.email,
      actor_role: args.actor.role,
      tag_name: args.targetTag?.name,
      ...args.metadata,
      timestamp: new Date().toISOString(),
    },
  });
}
