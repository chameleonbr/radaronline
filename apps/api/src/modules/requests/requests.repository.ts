import { randomUUID } from 'node:crypto';

import type { CreateRequestInput, RequestRecord, RequestStatus, UpdateRequestInput } from './requests.types.js';

export interface RequestsRepository {
  listUserRequests(args: { userId: string; isAdmin: boolean; limit: number }): Promise<RequestRecord[]>;
  listNotificationRequests(args: { userId: string; isAdmin: boolean; limit: number }): Promise<RequestRecord[]>;
  countManagedRequests(args: { statusFilter?: RequestStatus | 'all'; typeFilter?: string | 'all' }): Promise<number>;
  listManagedRequests(args: { page: number; pageSize: number; statusFilter?: RequestStatus | 'all'; typeFilter?: string | 'all' }): Promise<RequestRecord[]>;
  countPendingRequests(args: { userId: string; isAdmin: boolean }): Promise<number>;
  createRequest(input: CreateRequestInput): Promise<RequestRecord>;
  updateRequest(requestId: string, input: UpdateRequestInput): Promise<boolean>;
  deleteRequest(requestId: string): Promise<boolean>;
}

const seedTime = new Date().toISOString();
const inMemoryRequests = new Map<string, RequestRecord>([
  [
    'seed-request-1',
    {
      id: 'seed-request-1',
      user_id: 'seed-admin',
      request_type: 'support',
      content: 'Validar migracao do backend administrativo',
      status: 'pending',
      admin_notes: null,
      created_at: seedTime,
    },
  ],
]);

function applyStatusAndTypeFilters(
  items: RequestRecord[],
  statusFilter?: RequestStatus | 'all',
  typeFilter?: string | 'all'
) {
  return items.filter((item) => {
    if (statusFilter && statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (typeFilter && typeFilter !== 'all' && item.request_type !== typeFilter) return false;
    return true;
  });
}

export class InMemoryRequestsRepository implements RequestsRepository {
  async listUserRequests(args: { userId: string; isAdmin: boolean; limit: number }): Promise<RequestRecord[]> {
    const items = Array.from(inMemoryRequests.values())
      .filter((item) => args.isAdmin || item.user_id === args.userId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
    return items.slice(0, args.limit);
  }

  async listNotificationRequests(args: { userId: string; isAdmin: boolean; limit: number }): Promise<RequestRecord[]> {
    return this.listUserRequests(args);
  }

  async countManagedRequests(args: { statusFilter?: RequestStatus | 'all'; typeFilter?: string | 'all' }): Promise<number> {
    return applyStatusAndTypeFilters(Array.from(inMemoryRequests.values()), args.statusFilter, args.typeFilter).length;
  }

  async listManagedRequests(args: { page: number; pageSize: number; statusFilter?: RequestStatus | 'all'; typeFilter?: string | 'all' }): Promise<RequestRecord[]> {
    const filtered = applyStatusAndTypeFilters(Array.from(inMemoryRequests.values()), args.statusFilter, args.typeFilter)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
    const start = (args.page - 1) * args.pageSize;
    return filtered.slice(start, start + args.pageSize);
  }

  async countPendingRequests(args: { userId: string; isAdmin: boolean }): Promise<number> {
    return Array.from(inMemoryRequests.values()).filter((item) => item.status === 'pending' && (args.isAdmin || item.user_id === args.userId)).length;
  }

  async createRequest(input: CreateRequestInput): Promise<RequestRecord> {
    const record: RequestRecord = {
      id: randomUUID(),
      user_id: input.userId,
      request_type: input.requestType,
      content: input.content.trim(),
      status: input.status || 'pending',
      admin_notes: input.adminNotes || null,
      created_at: input.createdAt || new Date().toISOString(),
    };

    inMemoryRequests.set(record.id, record);
    return record;
  }

  async updateRequest(requestId: string, input: UpdateRequestInput): Promise<boolean> {
    const current = inMemoryRequests.get(requestId);
    if (!current) return false;

    inMemoryRequests.set(requestId, {
      ...current,
      status: input.status,
      admin_notes: input.adminNotes ?? current.admin_notes,
      resolved_by: input.status !== 'pending' ? input.resolvedById || null : null,
      resolved_at: input.status !== 'pending' ? new Date().toISOString() : null,
    });
    return true;
  }

  async deleteRequest(requestId: string): Promise<boolean> {
    return inMemoryRequests.delete(requestId);
  }
}
