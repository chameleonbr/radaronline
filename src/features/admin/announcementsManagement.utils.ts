import { AlertTriangle, CheckCircle, Clock, Megaphone, type LucideIcon } from 'lucide-react';
import type { Announcement } from '../../types/announcement.types';
import type { AnnouncementFormData } from './announcementsManagement.types';

export function createEmptyAnnouncementFormData(): AnnouncementFormData {
  return {
    title: '',
    content: '',
    type: 'news',
    priority: 'normal',
    displayDate: new Date().toISOString().split('T')[0],
    targetMicros: ['all'],
    linkUrl: '',
    imageUrl: '',
    expirationDate: '',
  };
}

export function mapAnnouncementToFormData(item: Announcement): AnnouncementFormData {
  return {
    title: item.title,
    content: item.content,
    type: item.type,
    priority: item.priority,
    displayDate: item.displayDate.split('T')[0],
    targetMicros: item.targetMicros,
    linkUrl: item.linkUrl || '',
    imageUrl: item.imageUrl || '',
    expirationDate: item.expirationDate ? item.expirationDate.split('T')[0] : '',
  };
}

export function getAnnouncementTypeDetails(type: string): {
  color: string;
  icon: LucideIcon;
  label: string;
} {
  const map: Record<string, { color: string; icon: LucideIcon; label: string }> = {
    news: {
      label: 'Novidade',
      color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
      icon: Megaphone,
    },
    alert: {
      label: 'Alerta',
      color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
      icon: AlertTriangle,
    },
    maintenance: {
      label: 'Manutencao',
      color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
      icon: Clock,
    },
    tutorial: {
      label: 'Tutorial',
      color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
      icon: CheckCircle,
    },
  };

  return map[type] || map.news;
}
