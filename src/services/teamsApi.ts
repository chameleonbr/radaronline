import type { TeamMember } from '../types';

import { apiRequest } from './apiClient';
import type { PendingRegistration } from './teams/teamsService.types';

type BackendTeamMember = {
  id: string;
  microregionId: string;
  name: string;
  role: string;
  email: string;
  municipality: string;
  isRegistered: boolean;
};

type BackendPendingRegistration = {
  id: string;
  name: string;
  email: string | null;
  municipality: string | null;
  microregionId: string;
  role: string;
  createdAt: string;
};

function mapBackendTeamMember(member: BackendTeamMember): TeamMember {
  return {
    id: member.id,
    microregiaoId: member.microregionId,
    name: member.name,
    role: member.role,
    email: member.email,
    municipio: member.municipality,
    isRegistered: member.isRegistered,
  };
}

function mapPendingRegistration(item: BackendPendingRegistration): PendingRegistration {
  return {
    id: item.id,
    name: item.name,
    email: item.email,
    municipio: item.municipality,
    microregiaoId: item.microregionId,
    cargo: item.role,
    createdAt: item.createdAt,
  };
}

export async function loadTeamsViaBackendApi(microregiaoId?: string): Promise<Record<string, TeamMember[]>> {
  const search = new URLSearchParams();
  if (microregiaoId && microregiaoId !== 'all') {
    search.set('microregionId', microregiaoId);
  }

  const suffix = search.toString() ? `?${search.toString()}` : '';
  const response = await apiRequest<{ itemsByMicro: Record<string, BackendTeamMember[]> }>(
    `/v1/teams${suffix}`
  );

  return Object.fromEntries(
    Object.entries(response.itemsByMicro).map(([microId, members]) => [
      microId,
      members.map(mapBackendTeamMember),
    ])
  );
}

export async function getUserTeamStatusViaBackendApi(
  email: string
): Promise<{ exists: boolean; municipio: string | null }> {
  const response = await apiRequest<{ exists: boolean; municipality: string | null }>(
    `/v1/teams/status?email=${encodeURIComponent(email)}`
  );

  return {
    exists: response.exists,
    municipio: response.municipality,
  };
}

export async function saveUserMunicipalityViaBackendApi(args: {
  microregiaoId: string;
  email: string;
  municipio: string;
  userName: string;
}): Promise<void> {
  await apiRequest<void>('/v1/teams/user-municipality', {
    method: 'POST',
    body: {
      microregionId: args.microregiaoId,
      email: args.email,
      municipality: args.municipio,
      userName: args.userName,
    },
  });
}

export async function addTeamMemberViaBackendApi(input: {
  microregiaoId: string;
  name: string;
  role: string;
  email?: string;
  municipio?: string;
}): Promise<TeamMember> {
  const response = await apiRequest<BackendTeamMember>('/v1/teams', {
    method: 'POST',
    body: {
      microregionId: input.microregiaoId,
      name: input.name,
      role: input.role,
      email: input.email,
      municipality: input.municipio,
    },
  });

  return mapBackendTeamMember(response);
}

export async function removeTeamMemberViaBackendApi(memberId: string): Promise<void> {
  await apiRequest<void>(`/v1/teams/${encodeURIComponent(memberId)}`, {
    method: 'DELETE',
  });
}

export async function loadPendingRegistrationsViaBackendApi(): Promise<PendingRegistration[]> {
  const response = await apiRequest<{ items: BackendPendingRegistration[] }>(
    '/v1/teams/pending-registrations'
  );
  return response.items.map(mapPendingRegistration);
}

export async function deletePendingRegistrationViaBackendApi(id: string): Promise<void> {
  await apiRequest<void>(`/v1/teams/pending-registrations/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}
