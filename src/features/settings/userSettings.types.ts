export type UserSettingsTab = 'profile' | 'appearance' | 'notifications' | 'security' | 'roadmap';

export interface Suggestion {
  id: string;
  authorMunicipality: string;
  title: string;
  description: string;
  votes: number;
  status: 'voting' | 'under_review' | 'planned' | 'completed';
  category: 'feature' | 'usability' | 'content';
  hasVoted?: boolean;
}
