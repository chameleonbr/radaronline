import { getPlatformClient } from '../platformClient';
import type {
  AutomatedEventRow,
} from './automatedEventsService.types';

const platformClient = getPlatformClient;

export async function listAutomatedEventRows(limit: number): Promise<AutomatedEventRow[]> {
  const { data, error } = await platformClient()
    .from('automated_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return (data as AutomatedEventRow[] | null) || [];
}

export async function insertAutomatedEventRecord(
  payload: Record<string, unknown>
): Promise<void> {
  const { error } = await platformClient()
    .from('automated_events')
    .insert(payload);

  if (error) {
    throw error;
  }
}
