import type {
  CreateUserRequestInput,
  ProfileSummary,
  RequestStatus,
  UserRequest,
} from './requestsService.types';

export function getUniqueRequestUserIds(requests: UserRequest[]): string[] {
  return [...new Set(requests.map((request) => request.user_id).filter(Boolean))];
}

export function mergeRequestsWithProfiles(
  requests: UserRequest[],
  profilesMap: Map<string, ProfileSummary>
): UserRequest[] {
  return requests.map((request) => {
    const profile = profilesMap.get(request.user_id);
    if (!profile) {
      return request;
    }

    return {
      ...request,
      user: {
        nome: profile.nome,
        email: profile.email,
        role: profile.role,
        cargo: profile.cargo,
        municipio: profile.municipio,
        microregiao_id: profile.microregiao_id,
      },
    };
  });
}

export function buildUpdateRequestPayload(
  status: RequestStatus,
  adminNotes?: string,
  resolvedById?: string,
  nowIso: string = new Date().toISOString()
): Record<string, unknown> {
  const updateData: Record<string, unknown> = {
    status,
    updated_at: nowIso,
  };

  if (status !== 'pending') {
    updateData.resolved_by = resolvedById || null;
    updateData.resolved_at = nowIso;
  } else {
    updateData.resolved_by = null;
    updateData.resolved_at = null;
  }

  if (adminNotes !== undefined) {
    updateData.admin_notes = adminNotes;
  }

  return updateData;
}

export function buildCreateRequestPayload(
  userId: string,
  requestType: string,
  content: string
): Record<string, unknown> {
  return {
    user_id: userId,
    request_type: requestType,
    content: content.trim(),
    status: 'pending',
  };
}

export function buildCreateRequestBatchPayload(
  requests: CreateUserRequestInput[]
): Array<Record<string, unknown>> {
  return requests.map((request) => ({
    user_id: request.userId,
    request_type: request.requestType,
    content: request.content.trim(),
    status: request.status || 'pending',
    admin_notes: request.adminNotes ?? null,
    ...(request.createdAt ? { created_at: request.createdAt } : {}),
  }));
}
