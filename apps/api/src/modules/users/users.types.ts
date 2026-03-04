import type { UserRole } from '../../shared/auth/auth.types.js';

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  microregionId: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  microregionId: string | null;
  createdBy?: string;
}

export interface UpdateUserInput {
  name?: string;
  role?: UserRole;
  microregionId?: string | null;
  active?: boolean;
}

export interface ResetPasswordInput {
  password: string;
}
