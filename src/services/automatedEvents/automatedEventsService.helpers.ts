import type {
  AutomatedEvent,
  AutomatedEventRow,
  RecordAutomatedEventInput,
} from './automatedEventsService.types';

export function timeSince(date: Date, now: Date = new Date()): string {
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  let interval = seconds / 3600;
  if (interval >= 1) {
    return `${Math.floor(interval)}h atras`;
  }

  interval = seconds / 60;
  if (interval >= 1) {
    return `${Math.floor(interval)}min atras`;
  }

  return 'agora mesmo';
}

export function mapAutomatedEventRow(row: AutomatedEventRow, now: Date = new Date()): AutomatedEvent {
  return {
    id: row.id,
    type: row.type,
    municipality: row.municipality,
    title: row.title,
    details: row.details || undefined,
    imageGradient: row.image_gradient,
    likes: row.likes,
    footerContext: row.footer_context || undefined,
    timestamp: timeSince(new Date(row.created_at), now),
    created_at: row.created_at,
  };
}

export function buildAutomatedEventInsertPayload(
  event: RecordAutomatedEventInput
): Record<string, unknown> {
  return {
    type: event.type,
    municipality: event.municipality,
    title: event.title,
    details: event.details,
    image_gradient: event.imageGradient,
    footer_context: event.footerContext,
  };
}
