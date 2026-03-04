import { randomUUID } from 'node:crypto';

import type {
  CreateUserInput,
  ResetPasswordInput,
  UpdateUserInput,
  UserRecord,
} from './users.types.js';

export interface UsersRepository {
  list(): Promise<UserRecord[]>;
  getById(userId: string): Promise<UserRecord | null>;
  getByEmail(email: string): Promise<UserRecord | null>;
  create(input: CreateUserInput): Promise<UserRecord>;
  update(userId: string, input: UpdateUserInput): Promise<UserRecord | null>;
  delete(userId: string): Promise<boolean>;
  resetPassword(userId: string, input: ResetPasswordInput): Promise<boolean>;
}

const seedTime = new Date().toISOString();
const records = new Map<string, UserRecord>([
  [
    'seed-superadmin',
    {
      id: 'seed-superadmin',
      email: 'superadmin@radar.mg.gov.br',
      name: 'Super Admin',
      role: 'superadmin',
      microregionId: null,
      active: true,
      createdAt: seedTime,
      updatedAt: seedTime,
    },
  ],
  [
    'seed-admin',
    {
      id: 'seed-admin',
      email: 'admin@radar.mg.gov.br',
      name: 'Admin Radar',
      role: 'admin',
      microregionId: null,
      active: true,
      createdAt: seedTime,
      updatedAt: seedTime,
    },
  ],
]);

export class InMemoryUsersRepository implements UsersRepository {
  async list(): Promise<UserRecord[]> {
    return Array.from(records.values()).sort((a, b) => a.email.localeCompare(b.email));
  }

  async getById(userId: string): Promise<UserRecord | null> {
    return records.get(userId) || null;
  }

  async getByEmail(email: string): Promise<UserRecord | null> {
    const normalizedEmail = email.toLowerCase();
    return Array.from(records.values()).find((record) => record.email === normalizedEmail) || null;
  }

  async create(input: CreateUserInput): Promise<UserRecord> {
    const now = new Date().toISOString();
    const record: UserRecord = {
      id: randomUUID(),
      email: input.email.toLowerCase(),
      name: input.name,
      role: input.role,
      microregionId: input.microregionId,
      active: true,
      createdAt: now,
      updatedAt: now,
    };

    records.set(record.id, record);
    return record;
  }

  async update(userId: string, input: UpdateUserInput): Promise<UserRecord | null> {
    const current = records.get(userId);
    if (!current) {
      return null;
    }

    const next: UserRecord = {
      ...current,
      ...input,
      updatedAt: new Date().toISOString(),
    };

    records.set(userId, next);
    return next;
  }

  async delete(userId: string): Promise<boolean> {
    return records.delete(userId);
  }

  async resetPassword(userId: string, _input: ResetPasswordInput): Promise<boolean> {
    return records.has(userId);
  }
}
