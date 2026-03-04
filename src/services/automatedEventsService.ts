
import { logError } from '../lib/logger';
import {
  buildAutomatedEventInsertPayload,
  mapAutomatedEventRow,
} from './automatedEvents/automatedEventsService.helpers';
import {
  insertAutomatedEventRecord,
  listAutomatedEventRows,
} from './automatedEvents/automatedEventsService.repositories';
export type {
  AutomatedEventType,
  AutomatedEvent,
} from './automatedEvents/automatedEventsService.types';
import type { AutomatedEvent, RecordAutomatedEventInput } from './automatedEvents/automatedEventsService.types';

export async function loadAutomatedEvents(limit: number = 6): Promise<AutomatedEvent[]> {
  try {
    return (await listAutomatedEventRows(limit)).map((row) => mapAutomatedEventRow(row));
  } catch (error) {
    logError('automatedEventsService', 'Erro ao carregar eventos automaticos', error);
    return [];
  }
}

export async function recordAutomatedEvent(
  event: RecordAutomatedEventInput
): Promise<void> {
  try {
    await insertAutomatedEventRecord(buildAutomatedEventInsertPayload(event));
  } catch (error) {
    logError('automatedEventsService', 'Falha ao registrar evento automatico', error);
  }
}





