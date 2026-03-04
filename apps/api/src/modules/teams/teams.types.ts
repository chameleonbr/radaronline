export interface TeamMemberRecord {
  id: string;
  microregionId: string;
  name: string;
  role: string;
  email: string;
  municipality: string;
  isRegistered: boolean;
}

export interface PendingRegistrationRecord {
  id: string;
  name: string;
  email: string | null;
  municipality: string | null;
  microregionId: string;
  role: string;
  createdAt: string;
}

export interface SaveUserMunicipalityInput {
  microregionId: string;
  email: string;
  municipality: string;
  userName: string;
}

export interface CreateTeamMemberInput {
  microregionId: string;
  name: string;
  role: string;
  email?: string;
  municipality?: string;
}
