import type { SessionUser } from '../../shared/auth/auth.types.js';
import { getSupabaseAdminClient, hasSupabaseAdminConfig } from '../../shared/persistence/supabase-admin.js';
import type { AnnouncementRecord } from './announcements.types.js';

export async function logAnnouncementsAdminEvent(args: {
  actor: SessionUser;
  actionType: string;
  entityId: string;
  targetAnnouncement?: AnnouncementRecord | null;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  if (!hasSupabaseAdminConfig()) {
    return;
  }

  const client = getSupabaseAdminClient();
  await client.from('activity_logs').insert({
    user_id: args.actor.id,
    action_type: args.actionType,
    entity_type: 'announcement',
    entity_id: args.entityId,
    metadata: {
      actor_id: args.actor.id,
      actor_email: args.actor.email,
      actor_role: args.actor.role,
      announcement_title: args.targetAnnouncement?.title,
      announcement_type: args.targetAnnouncement?.type,
      announcement_priority: args.targetAnnouncement?.priority,
      target_micros: args.targetAnnouncement?.targetMicros,
      ...args.metadata,
      timestamp: new Date().toISOString(),
    },
  });
}
