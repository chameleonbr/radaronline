import type { CreateUserRequestInput } from '../requestsService';
import type { Announcement } from '../../types/announcement.types';
import type {
  AnnouncementCreateInput,
  AnnouncementProfileRow,
  AnnouncementRow,
  AnnouncementUpdateInput,
} from './announcementsService.types';

export function mapAnnouncementRow(row: AnnouncementRow): Announcement {
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

export function filterAnnouncementsByMicro(
  announcements: Announcement[],
  microregiaoId?: string
): Announcement[] {
  if (!microregiaoId || microregiaoId === 'all') {
    return announcements;
  }

  return announcements.filter(
    (announcement) =>
      announcement.targetMicros.length === 0 ||
      announcement.targetMicros.includes('all') ||
      announcement.targetMicros.includes(microregiaoId)
  );
}

export function buildAnnouncementCreatePayload(
  data: AnnouncementCreateInput,
  currentUserId: string
): Record<string, unknown> {
  return {
    title: data.title,
    content: data.content,
    type: data.type,
    priority: data.priority,
    display_date: data.displayDate,
    expiration_date: data.expirationDate || null,
    target_micros: data.targetMicros,
    link_url: data.linkUrl || null,
    image_url: data.imageUrl || null,
    is_active: data.isActive,
    created_by: currentUserId,
  };
}

export function buildAnnouncementUpdatePayload(
  data: AnnouncementUpdateInput
): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  if (data.title !== undefined) payload.title = data.title;
  if (data.content !== undefined) payload.content = data.content;
  if (data.type !== undefined) payload.type = data.type;
  if (data.priority !== undefined) payload.priority = data.priority;
  if (data.displayDate !== undefined) payload.display_date = data.displayDate;
  if (data.expirationDate !== undefined) payload.expiration_date = data.expirationDate || null;
  if (data.targetMicros !== undefined) payload.target_micros = data.targetMicros;
  if (data.linkUrl !== undefined) payload.link_url = data.linkUrl || null;
  if (data.imageUrl !== undefined) payload.image_url = data.imageUrl || null;
  if (data.isActive !== undefined) payload.is_active = data.isActive;

  return payload;
}

export function buildAnnouncementNotifications(
  profiles: AnnouncementProfileRow[],
  announcementTitle: string,
  createdAt: string
): CreateUserRequestInput[] {
  return profiles.map((profile) => ({
    userId: profile.id,
    requestType: 'announcement',
    status: 'pending',
    content: announcementTitle,
    adminNotes: 'Visualizar no Mural',
    createdAt,
  }));
}
