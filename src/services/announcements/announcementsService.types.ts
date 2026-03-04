import type { Announcement } from '../../types/announcement.types';

export interface AnnouncementRow {
  id: string;
  title: string;
  content: string;
  type: Announcement['type'];
  priority: Announcement['priority'];
  display_date: string;
  target_micros: string[] | null;
  link_url: string | null;
  image_url: string | null;
  is_active: boolean;
  expiration_date: string | null;
  created_by: string | null;
  created_at: string;
}

export interface AnnouncementProfileRow {
  id: string;
  nome: string | null;
  email: string | null;
  role: string | null;
  microregiao_id: string | null;
}

export type AnnouncementCreateInput = Omit<Announcement, 'id' | 'createdAt' | 'createdBy'>;
export type AnnouncementUpdateInput = Partial<AnnouncementCreateInput>;
