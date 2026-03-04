export type AutomatedEventType =
  | 'plan_completed'
  | 'goal_reached'
  | 'new_user'
  | 'system_milestone';

export interface AutomatedEvent {
  id: string;
  type: AutomatedEventType;
  municipality: string;
  title: string;
  details?: string;
  imageGradient: string;
  likes: number;
  footerContext?: string;
  timestamp: string;
  created_at: string;
}

export interface AutomatedEventRow {
  id: string;
  type: AutomatedEventType;
  municipality: string;
  title: string;
  details: string | null;
  image_gradient: string;
  likes: number;
  footer_context: string | null;
  created_at: string;
}

export type RecordAutomatedEventInput = Omit<
  AutomatedEvent,
  'id' | 'timestamp' | 'created_at' | 'likes'
>;
