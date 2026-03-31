import type {
  CreateUserRequestInput,
  ProfileSummary,
  RequestStatus,
  UserRequest,
} from './requestsService.types';

function hasOwnProperty<Value extends object>(value: Value, key: PropertyKey): boolean {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function mergeRequestUsers(
  primary?: UserRequest['user'],
  secondary?: UserRequest['user']
): UserRequest['user'] | undefined {
  if (!primary) {
    return secondary;
  }

  if (!secondary) {
    return primary;
  }

  return {
    ...secondary,
    ...primary,
  };
}

export function getUniqueRequestProfileIds(requests: UserRequest[]): string[] {
  const profileIds = new Set<string>();

  requests.forEach((request) => {
    if (request.user_id) {
      profileIds.add(request.user_id);
    }

    if (request.resolved_by) {
      profileIds.add(request.resolved_by);
    }
  });

  return [...profileIds];
}

export function getMissingRequestProfileIds(requests: UserRequest[]): string[] {
  const profileIds = new Set<string>();

  requests.forEach((request) => {
    const requester = request.user;
    const hasRequesterProfile = requester
      ? hasOwnProperty(requester, 'nome')
        && hasOwnProperty(requester, 'email')
        && hasOwnProperty(requester, 'role')
        && hasOwnProperty(requester, 'municipio')
        && hasOwnProperty(requester, 'microregiao_id')
      : false;

    if (!hasRequesterProfile && request.user_id) {
      profileIds.add(request.user_id);
    }

    if (request.resolved_by && !request.resolved_by_name) {
      profileIds.add(request.resolved_by);
    }
  });

  return [...profileIds];
}

export function mergeRequestsWithProfiles(
  requests: UserRequest[],
  profilesMap: Map<string, ProfileSummary>
): UserRequest[] {
  return requests.map((request) => {
    const requesterProfile = profilesMap.get(request.user_id);
    const resolverProfile = request.resolved_by
      ? profilesMap.get(request.resolved_by)
      : undefined;

    const resolvedByName = resolverProfile?.nome ?? request.resolved_by_name ?? null;
    const mergedUser = requesterProfile ? {
      ...request.user,
      nome: requesterProfile.nome,
      email: requesterProfile.email,
      role: requesterProfile.role,
      cargo: request.user?.cargo ?? requesterProfile.cargo,
      municipio: requesterProfile.municipio,
      microregiao_id: requesterProfile.microregiao_id,
    } : request.user;

    return {
      ...request,
      resolved_by_name: resolvedByName,
      ...(mergedUser ? { user: mergedUser } : {}),
    };
  });
}

export function dedupeRequestsById(requests: UserRequest[]): UserRequest[] {
  const requestsById = new Map<string, UserRequest>();

  requests.forEach((request) => {
    const existing = requestsById.get(request.id);

    if (!existing) {
      requestsById.set(request.id, request);
      return;
    }

    requestsById.set(request.id, {
      ...request,
      ...existing,
      resolved_by_name: existing.resolved_by_name ?? request.resolved_by_name ?? null,
      user: mergeRequestUsers(existing.user, request.user),
    });
  });

  return [...requestsById.values()].sort((left, right) => (
    new Date(right.created_at).getTime() - new Date(left.created_at).getTime()
  ));
}

function shortId(id?: string | null): string | null {
  if (!id) {
    return null;
  }

  return id.slice(0, 8);
}

export function getRequestRequesterLabel(request: Pick<UserRequest, 'user' | 'user_id'>): string {
  return request.user?.nome?.trim() || `Usuario ${shortId(request.user_id) || 'sem-id'}`;
}

export function getRequestResponderLabel(
  request: Pick<UserRequest, 'resolved_by' | 'resolved_by_name'>
): string {
  return request.resolved_by_name?.trim()
    || (request.resolved_by ? `Admin ${shortId(request.resolved_by)}` : 'Administracao');
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

export function shouldCreateOwnRequestViaBackend(args: {
  backendRequestsEnabled: boolean;
  currentUserId: string | null;
  targetUserId: string;
}): boolean {
  return (
    args.backendRequestsEnabled &&
    Boolean(args.currentUserId) &&
    args.currentUserId === args.targetUserId
  );
}
