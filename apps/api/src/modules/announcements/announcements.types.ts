export type AnnouncementType = 'news' | 'alert' | 'maintenance' | 'tutorial';
export type AnnouncementPriority = 'normal' | 'high';

export interface AnnouncementRecord {
  id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  priority: AnnouncementPriority;
  displayDate: string;
  targetMicros: string[];
  linkUrl?: string;
  imageUrl?: string;
  isActive: boolean;
  createdBy?: string;
  createdAt: string;
  expirationDate?: string | null;
}

export type CreateAnnouncementInput = Omit<AnnouncementRecord, 'id' | 'createdAt' | 'createdBy'>;
export type UpdateAnnouncementInput = Partial<CreateAnnouncementInput>;
