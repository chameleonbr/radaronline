import { getPlatformClient } from '../platformClient';
import type {
  AnnouncementProfileRow,
  AnnouncementRow,
} from './announcementsService.types';

const platformClient = getPlatformClient;

export async function listActiveAnnouncements(today: string): Promise<AnnouncementRow[]> {
  const { data, error } = await platformClient()
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .or(`expiration_date.is.null,expiration_date.gte.${today}`)
    .order('display_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data as AnnouncementRow[] | null) || [];
}

export async function listAllAnnouncements(): Promise<AnnouncementRow[]> {
  const { data, error } = await platformClient()
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data as AnnouncementRow[] | null) || [];
}

export async function insertAnnouncementRecord(
  payload: Record<string, unknown>
): Promise<AnnouncementRow> {
  const { data, error } = await platformClient()
    .from('announcements')
    .insert(payload)
    .select('*')
    .single();

  if (error || !data) {
    throw error || new Error('Falha ao criar anuncio');
  }

  return data as AnnouncementRow;
}

export async function listAnnouncementProfiles(
  targetMicros: string[]
): Promise<AnnouncementProfileRow[]> {
  let profilesQuery = platformClient()
    .from('profiles')
    .select('id, nome, email, role, microregiao_id');

  if (!targetMicros.includes('all')) {
    profilesQuery = profilesQuery.in('microregiao_id', targetMicros);
  }

  const { data, error } = await profilesQuery;
  if (error) {
    throw error;
  }

  return (data as AnnouncementProfileRow[] | null) || [];
}

export async function updateAnnouncementRecord(
  id: string,
  payload: Record<string, unknown>
): Promise<void> {
  const { error } = await platformClient()
    .from('announcements')
    .update(payload)
    .eq('id', id);

  if (error) {
    throw error;
  }
}

export async function deleteAnnouncementRecord(id: string): Promise<void> {
  const { error } = await platformClient()
    .from('announcements')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
}

export async function toggleAnnouncementActiveRecord(
  id: string,
  currentState: boolean
): Promise<void> {
  const { error } = await platformClient()
    .from('announcements')
    .update({ is_active: !currentState })
    .eq('id', id);

  if (error) {
    throw error;
  }
}
