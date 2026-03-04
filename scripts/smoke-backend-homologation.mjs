const baseUrl = (process.env.BACKEND_API_URL || process.env.VITE_BACKEND_API_URL || '').trim().replace(/\/+$/, '')
const bearerToken = (process.env.BACKEND_BEARER_TOKEN || process.env.SUPABASE_ACCESS_TOKEN || '').trim()
const mutationMode = String(process.env.BACKEND_SMOKE_MUTATIONS || 'false').toLowerCase() === 'true'

if (!baseUrl) {
  console.error('BACKEND_API_URL nao configurado.')
  process.exit(1)
}

function logStep(message) {
  console.log(`[smoke-backend] ${message}`)
}

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: options.method || 'GET',
    headers: {
      ...(options.auth !== false && bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
      ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  })

  const text = await response.text()
  let payload = null
  if (text) {
    try {
      payload = JSON.parse(text)
    } catch {
      payload = text
    }
  }

  if (!response.ok) {
    throw new Error(`${options.method || 'GET'} ${path} falhou com status ${response.status}: ${JSON.stringify(payload)}`)
  }

  return payload
}

async function assertGet(path, label, auth = true) {
  logStep(`validando ${label}`)
  await request(path, { auth })
}

async function runMutationSmoke() {
  logStep('modo mutacao ativo')

  const tag = await request('/v1/tags', {
    method: 'POST',
    body: { name: `SMOKE-${Date.now()}` },
  })
  await request(`/v1/tags/${encodeURIComponent(tag.id)}`, {
    method: 'DELETE',
  })

  const member = await request('/v1/teams', {
    method: 'POST',
    body: {
      microregionId: 'MR001',
      name: 'Smoke Team Member',
      role: 'Membro',
      email: `smoke-team-${Date.now()}@example.gov.br`,
      municipality: 'Belo Horizonte',
    },
  })
  await request(`/v1/teams/${encodeURIComponent(member.id)}`, {
    method: 'DELETE',
  })

  const objective = await request('/v1/objectives', {
    method: 'POST',
    body: {
      title: `Objetivo Smoke ${Date.now()}`,
      microregionId: 'MR001',
    },
  })

  const activity = await request('/v1/activities', {
    method: 'POST',
    body: {
      objectiveId: objective.id,
      id: `${objective.id}.999`,
      title: 'Atividade Smoke',
      microregionId: 'MR001',
      description: 'Validacao automatizada',
    },
  })

  await request(`/v1/activities/${encodeURIComponent(activity.id)}`, {
    method: 'DELETE',
  })
  await request(`/v1/objectives/${objective.id}`, {
    method: 'DELETE',
  })
}

async function main() {
  logStep(`baseUrl=${baseUrl}`)

  await assertGet('/health', 'health', false)
  await assertGet('/ready', 'ready', false)
  await assertGet('/v1/auth/session', 'auth/session', false)

  if (!bearerToken) {
    logStep('sem BACKEND_BEARER_TOKEN; validacao autenticada sera ignorada')
    return
  }

  await assertGet('/v1/auth/session', 'auth/session autenticado')
  await assertGet('/v1/auth/profile', 'auth/profile')
  await assertGet('/v1/users', 'users')
  await assertGet('/v1/actions', 'actions')
  await assertGet('/v1/requests?scope=user&limit=5', 'requests')
  await assertGet('/v1/announcements', 'announcements')
  await assertGet('/v1/tags', 'tags')
  await assertGet('/v1/teams', 'teams')
  await assertGet('/v1/objectives', 'objectives')
  await assertGet('/v1/activities', 'activities')

  if (mutationMode) {
    await runMutationSmoke()
  }

  logStep('validacao concluida com sucesso')
}

main().catch((error) => {
  console.error(`[smoke-backend] ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
})
