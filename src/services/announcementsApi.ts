import type { Announcement } from '../types/announcement.types';

import { apiRequest } from './apiClient';
import type { AnnouncementCreateInput, AnnouncementUpdateInput } from './announcements/announcementsService.types';

function buildQuery(params: Record<string, string | undefined>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.set(key, value);
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

export async function listAnnouncementsViaBackendApi(microregiaoId?: string): Promise<Announcement[]> {
  const response = await apiRequest<{ items: Announcement[] }>(
    `/v1/announcements${buildQuery({ scope: 'active', microregionId: microregiaoId })}`
  );
  return response.items;
}

export async function listAdminAnnouncementsViaBackendApi(): Promise<Announcement[]> {
  const response = await apiRequest<{ items: Announcement[] }>(
    `/v1/announcements${buildQuery({ scope: 'admin' })}`
  );
  return response.items;
}

export async function createAnnouncementViaBackendApi(input: AnnouncementCreateInput): Promise<Announcement> {
  return apiRequest<Announcement>('/v1/announcements', {
    method: 'POST',
    body: input,
  });
}

export async function updateAnnouncementViaBackendApi(id: string, input: AnnouncementUpdateInput): Promise<void> {
  await apiRequest<void>(`/v1/announcements/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: input,
  });
}

export async function deleteAnnouncementViaBackendApi(id: string): Promise<void> {
  await apiRequest<void>(`/v1/announcements/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export async function toggleAnnouncementViaBackendApi(id: string, currentState: boolean): Promise<void> {
  await apiRequest<void>(`/v1/announcements/${encodeURIComponent(id)}/toggle-active`, {
    method: 'POST',
    body: { currentState },
  });
}
