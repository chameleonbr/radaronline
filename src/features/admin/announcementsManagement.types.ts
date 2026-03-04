import type { AnnouncementPriority, AnnouncementType } from '../../types/announcement.types';

export interface AnnouncementFormData {
  title: string;
  content: string;
  type: AnnouncementType;
  priority: AnnouncementPriority;
  displayDate: string;
  targetMicros: string[];
  linkUrl: string;
  imageUrl: string;
  expirationDate: string;
}

export type AnnouncementValidityMode = 'forever' | 'scheduled';
