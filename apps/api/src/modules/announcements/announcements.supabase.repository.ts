import type { SupabaseClient } from '@supabase/supabase-js';

import { getSupabaseAdminClient } from '../../shared/persistence/supabase-admin.js';
import type { AnnouncementRecord, CreateAnnouncementInput, UpdateAnnouncementInput } from './announcements.types.js';
import type { AnnouncementsRepository } from './announcements.repository.js';

type AnnouncementRow = {
  id: string;
  title: string;
  content: string;
  type: AnnouncementRecord['type'];
  priority: AnnouncementRecord['priority'];
  display_date: string;
  target_micros: string[] | null;
  link_url: string | null;
  image_url: string | null;
  is_active: boolean;
  expiration_date: string | null;
  created_by: string | null;
  created_at: string;
};

type AnnouncementProfileRow = {
  id: string;
  nome: string | null;
  email: string | null;
  role: string | null;
  microregiao_id: string | null;
};

function mapAnnouncementRow(row: AnnouncementRow): AnnouncementRecord {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    type: row.type,
    priority: row.priority,
    displayDate: row.display_date,
    targetMicros: row.target_micros || [],
    linkUrl: row.link_url || undefined,
    imageUrl: row.image_url || undefined,
    isActive: row.is_active,
    expirationDate: row.expiration_date,
    createdBy: row.created_by || undefined,
    createdAt: row.created_at,
  };
}

function toCreatePayload(input: CreateAnnouncementInput & { createdBy: string }) {
  return {
    title: input.title,
    content: input.content,
    type: input.type,
    priority: input.priority,
    display_date: input.displayDate,
    expiration_date: input.expirationDate || null,
    target_micros: input.targetMicros,
    link_url: input.linkUrl || null,
    image_url: input.imageUrl || null,
    is_active: input.isActive,
    created_by: input.createdBy,
  };
}

function toUpdatePayload(input: UpdateAnnouncementInput) {
  const payload: Record<string, unknown> = {};
  if (input.title !== undefined) payload.title = input.title;
  if (input.content !== undefined) payload.content = input.content;
  if (input.type !== undefined) payload.type = input.type;
  if (input.priority !== undefined) payload.priority = input.priority;
  if (input.displayDate !== undefined) payload.display_date = input.displayDate;
  if (input.expirationDate !== undefined) payload.expiration_date = input.expirationDate || null;
  if (input.targetMicros !== undefined) payload.target_micros = input.targetMicros;
  if (input.linkUrl !== undefined) payload.link_url = input.linkUrl || null;
  if (input.imageUrl !== undefined) payload.image_url = input.imageUrl || null;
  if (input.isActive !== undefined) payload.is_active = input.isActive;
  return payload;
}

function buildAnnouncementNotifications(profiles: AnnouncementProfileRow[], title: string, createdAt: string) {
  return profiles.map((profile) => ({
    user_id: profile.id,
    request_type: 'announcement',
    content: title.trim(),
    status: 'pending',
    admin_notes: 'Visualizar no Mural',
    created_at: createdAt,
  }));
}

export class SupabaseAnnouncementsRepository implements AnnouncementsRepository {
  constructor(private readonly client: SupabaseClient = getSupabaseAdminClient()) {}

  async listActive(microregionId?: string): Promise<AnnouncementRecord[]> {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await this.client
      .from('announcements')
      .select('*')
      .eq('is_active', true)
      .or(`expiration_date.is.null,expiration_date.gte.${today}`)
      .order('display_date', { ascending: false })
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message || 'Failed to list active announcements');
    const items = ((data || []) as AnnouncementRow[]).map(mapAnnouncementRow);
    if (!microregionId || microregionId === 'all') return items;
    return items.filter((item) => item.targetMicros.length === 0 || item.targetMicros.includes('all') || item.targetMicros.includes(microregionId));
  }

  async listAll(): Promise<AnnouncementRecord[]> {
    const { data, error } = await this.client.from('announcements').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message || 'Failed to list announcements');
    return ((data || []) as AnnouncementRow[]).map(mapAnnouncementRow);
  }

  async create(input: CreateAnnouncementInput & { createdBy: string }): Promise<AnnouncementRecord> {
    const { data, error } = await this.client.from('announcements').insert(toCreatePayload(input)).select('*').single();
    if (error || !data) throw new Error(error?.message || 'Failed to create announcement');
    const created = mapAnnouncementRow(data as AnnouncementRow);

    let profilesQuery = this.client.from('profiles').select('id, nome, email, role, microregiao_id');
    if (!created.targetMicros.includes('all')) {
      profilesQuery = profilesQuery.in('microregiao_id', created.targetMicros);
    }

    const { data: profiles, error: profilesError } = await profilesQuery;
    if (!profilesError && profiles && profiles.length > 0) {
      await this.client.from('user_requests').insert(buildAnnouncementNotifications(profiles as AnnouncementProfileRow[], created.title, new Date().toISOString()));
    }

    return created;
  }

  async update(id: string, input: UpdateAnnouncementInput): Promise<boolean> {
    const { error } = await this.client.from('announcements').update(toUpdatePayload(input)).eq('id', id);
    if (error) throw new Error(error.message || 'Failed to update announcement');
    return true;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.client.from('announcements').delete().eq('id', id);
    if (error) throw new Error(error.message || 'Failed to delete announcement');
    return true;
  }

  async toggleActive(id: string, currentState: boolean): Promise<boolean> {
    const { error } = await this.client.from('announcements').update({ is_active: !currentState }).eq('id', id);
    if (error) throw new Error(error.message || 'Failed to toggle announcement');
    return true;
  }
}
