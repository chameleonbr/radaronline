import type { UserRole } from '../../shared/auth/auth.types.js';

export interface CompleteFirstAccessInput {
  userId: string;
  userEmail: string;
  municipio: string;
  newPassword: string;
  microregionId: string;
}

export interface AuthProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  microregionId: string | null;
  active: boolean;
  lgpdAccepted: boolean;
  lgpdAcceptedAt: string | null;
  avatarId: string | null;
  municipality: string | null;
  firstAccess: boolean;
  createdAt: string;
}

export interface AuthProfileRepository {
  getProfile(userId: string): Promise<AuthProfile | null>;
  acceptLgpd(userId: string): Promise<void>;
  completeFirstAccess(input: CompleteFirstAccessInput): Promise<void>;
}

export class InMemoryAuthProfileRepository implements AuthProfileRepository {
  async getProfile(_userId: string): Promise<AuthProfile | null> {
    return null;
  }

  async acceptLgpd(_userId: string): Promise<void> {}

  async completeFirstAccess(_input: CompleteFirstAccessInput): Promise<void> {}
}
