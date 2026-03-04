import type { SupabaseClient } from '@supabase/supabase-js';

import { getSupabaseAdminClient } from '../../shared/persistence/supabase-admin.js';
import type { ActionRecord, CreateActionInput, UpdateActionInput } from './actions.types.js';
import type { ActionsRepository } from './actions.repository.js';

type ActionRow = {
  id: string;
  uid: string;
  action_id: string;
  activity_id: string;
  microregiao_id: string;
  title: string;
  status: string;
  start_date: string | null;
  planned_end_date: string | null;
  end_date: string | null;
  progress: number;
  notes: string;
};

function normalizeStatus(value: string): ActionRecord['status'] {
  if (value === 'Concluido' || value === 'Em Andamento' || value === 'Nao Iniciado' || value === 'Atrasado') {
    return value;
  }

  if (value === 'Concluído') return 'Concluido';
  if (value === 'Não Iniciado') return 'Nao Iniciado';

  return 'Nao Iniciado';
}

function mapActionRow(row: ActionRow): ActionRecord {
  return {
    dbId: row.id,
    uid: row.uid,
    actionId: row.action_id,
    activityId: row.activity_id,
    microregionId: row.microregiao_id,
    title: row.title,
    status: normalizeStatus(row.status),
    startDate: row.start_date,
    plannedEndDate: row.planned_end_date,
    endDate: row.end_date,
    progress: row.progress,
    notes: row.notes,
  };
}

function toDatabaseStatus(value: ActionRecord['status']): string {
  if (value === 'Concluido') return 'Concluído';
  if (value === 'Nao Iniciado') return 'Não Iniciado';
  return value;
}

export class SupabaseActionsRepository implements ActionsRepository {
  constructor(private readonly client: SupabaseClient = getSupabaseAdminClient()) {}

  async list(microregionId?: string): Promise<ActionRecord[]> {
    let query = this.client
      .from('actions')
      .select('id, uid, action_id, activity_id, microregiao_id, title, status, start_date, planned_end_date, end_date, progress, notes')
      .order('action_id', { ascending: true });

    if (microregionId && microregionId !== 'all') {
      query = query.eq('microregiao_id', microregionId);
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(error.message || 'Failed to list actions');
    }

    return ((data || []) as ActionRow[]).map(mapActionRow);
  }

  async getByUid(uid: string): Promise<ActionRecord | null> {
    const { data, error } = await this.client
      .from('actions')
      .select('id, uid, action_id, activity_id, microregiao_id, title, status, start_date, planned_end_date, end_date, progress, notes')
      .eq('uid', uid)
      .maybeSingle();

    if (error) {
      throw new Error(error.message || 'Failed to get action');
    }

    return data ? mapActionRow(data as ActionRow) : null;
  }

  async create(input: CreateActionInput): Promise<ActionRecord> {
    const actionId = `${input.activityId}.${input.actionNumber}`;
    const uid = `${input.microregionId}::${actionId}`;

    const { data, error } = await this.client
      .from('actions')
      .insert({
        uid,
        action_id: actionId,
        activity_id: input.activityId,
        microregiao_id: input.microregionId,
        title: input.title,
        status: 'Não Iniciado',
        progress: 0,
        notes: '',
        created_by: input.createdBy,
      })
      .select('id, uid, action_id, activity_id, microregiao_id, title, status, start_date, planned_end_date, end_date, progress, notes')
      .single();

    if (error || !data) {
      throw new Error(error?.message || 'Failed to create action');
    }

    return mapActionRow(data as ActionRow);
  }

  async update(uid: string, input: UpdateActionInput): Promise<ActionRecord | null> {
    const payload: Record<string, unknown> = {};
    if (input.title !== undefined) payload.title = input.title;
    if (input.status !== undefined) payload.status = toDatabaseStatus(input.status);
    if (input.startDate !== undefined) payload.start_date = input.startDate;
    if (input.plannedEndDate !== undefined) payload.planned_end_date = input.plannedEndDate;
    if (input.endDate !== undefined) payload.end_date = input.endDate;
    if (input.progress !== undefined) payload.progress = input.progress;
    if (input.notes !== undefined) payload.notes = input.notes;

    const { data, error } = await this.client
      .from('actions')
      .update(payload)
      .eq('uid', uid)
      .select('id, uid, action_id, activity_id, microregiao_id, title, status, start_date, planned_end_date, end_date, progress, notes')
      .maybeSingle();

    if (error) {
      throw new Error(error.message || 'Failed to update action');
    }

    return data ? mapActionRow(data as ActionRow) : null;
  }

  async delete(uid: string): Promise<boolean> {
    const { error } = await this.client.from('actions').delete().eq('uid', uid);

    if (error) {
      throw new Error(error.message || 'Failed to delete action');
    }

    return true;
  }
}
