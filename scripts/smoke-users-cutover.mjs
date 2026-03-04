const baseUrl = (process.env.BACKEND_API_URL || process.env.VITE_BACKEND_API_URL || '').trim().replace(/\/+$/, '')
const bearerToken = (process.env.BACKEND_BEARER_TOKEN || process.env.SUPABASE_ACCESS_TOKEN || '').trim()
const userEmail = (process.env.BACKEND_SMOKE_TEST_USER_EMAIL || '').trim().toLowerCase()
const userName = (process.env.BACKEND_SMOKE_TEST_USER_NAME || 'Smoke Cutover User').trim()
const userPassword = (process.env.BACKEND_SMOKE_TEST_USER_PASSWORD || 'TempPass123!').trim()
const userRole = (process.env.BACKEND_SMOKE_TEST_USER_ROLE || 'usuario').trim()
const microregionId = (process.env.BACKEND_SMOKE_TEST_USER_MICROREGION || 'MR001').trim()

if (!baseUrl || !bearerToken || !userEmail) {
  console.error('BACKEND_API_URL, BACKEND_BEARER_TOKEN e BACKEND_SMOKE_TEST_USER_EMAIL sao obrigatorios.')
  process.exit(1)
}

function logStep(message) {
  console.log(`[smoke-users-cutover] ${message}`)
}

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: options.method || 'GET',
    headers: {
      Authorization: `Bearer ${bearerToken}`,
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

async function main() {
  let createdUser = null

  try {
    logStep('criando usuario via backend')
    createdUser = await request('/v1/users', {
      method: 'POST',
      body: {
        email: userEmail,
        password: userPassword,
        name: userName,
        role: userRole,
        microregionId: userRole === 'admin' || userRole === 'superadmin' ? null : microregionId,
      },
    })

    logStep(`usuario criado: ${createdUser.id}`)

    logStep('resetando senha via backend')
    await request(`/v1/users/${encodeURIComponent(createdUser.id)}/reset-password`, {
      method: 'POST',
      body: {
        password: `${userPassword}X`,
      },
    })

    logStep('atualizando usuario via backend')
    await request(`/v1/users/${encodeURIComponent(createdUser.id)}`, {
      method: 'PATCH',
      body: {
        name: `${userName} Updated`,
      },
    })

    logStep('buscando usuario via backend')
    await request(`/v1/users/${encodeURIComponent(createdUser.id)}`)

    logStep('removendo usuario via backend')
    await request(`/v1/users/${encodeURIComponent(createdUser.id)}`, {
      method: 'DELETE',
    })

    logStep('cutover administrativo validado com sucesso')
  } catch (error) {
    if (createdUser?.id) {
      console.error(`[smoke-users-cutover] falha apos criar usuario ${createdUser.id}; executar limpeza manual se necessario`)
    }
    console.error(`[smoke-users-cutover] ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }
}

main()
