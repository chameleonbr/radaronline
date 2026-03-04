import { randomUUID } from 'node:crypto';

import type { AnnouncementRecord, CreateAnnouncementInput, UpdateAnnouncementInput } from './announcements.types.js';

export interface AnnouncementsRepository {
  listActive(microregionId?: string): Promise<AnnouncementRecord[]>;
  listAll(): Promise<AnnouncementRecord[]>;
  create(input: CreateAnnouncementInput & { createdBy: string }): Promise<AnnouncementRecord>;
  update(id: string, input: UpdateAnnouncementInput): Promise<boolean>;
  delete(id: string): Promise<boolean>;
  toggleActive(id: string, currentState: boolean): Promise<boolean>;
}

const seedAnnouncementTime = new Date().toISOString();
const inMemoryAnnouncements = new Map<string, AnnouncementRecord>([
  [
    'seed-announcement-1',
    {
      id: 'seed-announcement-1',
      title: 'Inicio da migracao de plataforma',
      content: 'Backend proprio em andamento.',
      type: 'news',
      priority: 'normal',
      displayDate: seedAnnouncementTime.slice(0, 10),
      targetMicros: ['all'],
      isActive: true,
      createdAt: seedAnnouncementTime,
    },
  ],
]);

function matchesMicro(item: AnnouncementRecord, microregionId?: string) {
  if (!microregionId || microregionId === 'all') return true;
  return item.targetMicros.length === 0 || item.targetMicros.includes('all') || item.targetMicros.includes(microregionId);
}

export class InMemoryAnnouncementsRepository implements AnnouncementsRepository {
  async listActive(microregionId?: string): Promise<AnnouncementRecord[]> {
    return Array.from(inMemoryAnnouncements.values())
      .filter((item) => item.isActive)
      .filter((item) => matchesMicro(item, microregionId))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async listAll(): Promise<AnnouncementRecord[]> {
    return Array.from(inMemoryAnnouncements.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async create(input: CreateAnnouncementInput & { createdBy: string }): Promise<AnnouncementRecord> {
    const record: AnnouncementRecord = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      ...input,
    };
    inMemoryAnnouncements.set(record.id, record);
    return record;
  }

  async update(id: string, input: UpdateAnnouncementInput): Promise<boolean> {
    const current = inMemoryAnnouncements.get(id);
    if (!current) return false;
    inMemoryAnnouncements.set(id, { ...current, ...input });
    return true;
  }

  async delete(id: string): Promise<boolean> {
    return inMemoryAnnouncements.delete(id);
  }

  async toggleActive(id: string, currentState: boolean): Promise<boolean> {
    const current = inMemoryAnnouncements.get(id);
    if (!current) return false;
    inMemoryAnnouncements.set(id, { ...current, isActive: !currentState });
    return true;
  }
}
