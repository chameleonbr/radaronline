export type AnnouncementType = 'news' | 'alert' | 'maintenance' | 'tutorial';
export type AnnouncementPriority = 'normal' | 'high';

export interface Announcement {
    id: string; // db uuid
    title: string;
    content: string;
    type: AnnouncementType;
    priority: AnnouncementPriority;
    displayDate: string; // YYYY-MM-DD
    targetMicros: string[]; // ['all'] or ['micro_id_1', 'micro_id_2']
    linkUrl?: string; // Optional call-to-action
    imageUrl?: string; // Optional banner
    isActive: boolean;
    createdBy?: string; // user id
    createdAt: string;
    expirationDate?: string | null; // Optional: YYYY-MM-DD
}
