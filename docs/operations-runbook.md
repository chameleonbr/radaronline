# Operations Runbook

## Ambiente local

### Pre-requisitos

- Node.js 20
- npm 10+
- variaveis de ambiente configuradas

### Subida local

```bash
npm install
npm run dev
```

## Validacoes obrigatorias antes de merge

```bash
npm run lint
npm run test:run
npm run build
```

## Pipeline atual

Arquivo:

- `.github/workflows/ci.yml`

Etapas:

- install
- lint
- test
- build

## Homologacao do backend de transicao

### Smoke nao destrutivo

```bash
BACKEND_API_URL=https://api-hml.exemplo.gov.br \
BACKEND_BEARER_TOKEN=token \
npm run smoke:backend
```

### Smoke com mutacoes controladas

```bash
BACKEND_API_URL=https://api-hml.exemplo.gov.br \
BACKEND_BEARER_TOKEN=token \
BACKEND_SMOKE_MUTATIONS=true \
npm run smoke:backend
```

### Cutover administrativo de usuarios

```bash
BACKEND_API_URL=https://api-hml.exemplo.gov.br \
BACKEND_BEARER_TOKEN=token-superadmin \
BACKEND_SMOKE_TEST_USER_EMAIL=smoke.user@example.gov.br \
BACKEND_SMOKE_TEST_USER_NAME="Smoke User" \
BACKEND_SMOKE_TEST_USER_PASSWORD='TempPass123!' \
BACKEND_SMOKE_TEST_USER_MICROREGION=MR001 \
npm run smoke:users-cutover
```

### Endurecimento do cutover

Quando `users`, `reset-password`, `first-access` e `auth profile` estiverem homologados pelo backend, ativar:

```bash
VITE_BACKEND_API_URL=https://api-hml.exemplo.gov.br
VITE_USE_BACKEND_ADMIN_USERS=true
VITE_USE_BACKEND_AUTH_PROFILE=true
VITE_DISABLE_LEGACY_SUPABASE_ADMIN_FLOW=true
```

Essa combinacao impede fallback silencioso para `supabase-functions/*` no fluxo administrativo.

Esses scripts validam:

- `health` e `ready`
- `auth/session` e `auth/profile`
- dominios ja migrados para backend
- criacao, reset de senha, update e exclusao de usuario pelo backend

## Runbook de incidente basico

### Falha de login

1. validar `VITE_SUPABASE_URL`
2. validar `VITE_SUPABASE_ANON_KEY`
3. verificar sessao em `src/services/sessionService.ts`
4. verificar `profiles` e RLS no provider

### Falha em operacao administrativa

1. verificar `apps/api` e rodar `npm run smoke:users-cutover`
2. validar `VITE_DISABLE_LEGACY_SUPABASE_ADMIN_FLOW` e as feature flags do backend
3. revisar variaveis de ambiente do provider
4. revisar logs de erro no browser e no backend

### Falha em notificacoes/requests

1. verificar tabela `user_requests`
2. validar realtime/subscription
3. revisar `src/services/requestsService.ts`

### Falha em dashboards de analytics

1. verificar tabelas `user_analytics` e `user_sessions`
2. revisar `src/services/analyticsService.ts`
3. validar views/materializacoes usadas pelo dashboard

## Rollback operacional

Como o app e um frontend estatico:

1. reverter o deploy para o bundle anterior
2. se o problema for do cutover administrativo, desabilitar temporariamente `VITE_DISABLE_LEGACY_SUPABASE_ADMIN_FLOW`
3. se a regressao for de schema/policy, reverter migrations/policies no provider
4. se a regressao for de edge function, redeploy da versao anterior da function apenas enquanto o backend novo nao estiver estabilizado

## Evidencias operacionais

- CI verde
- build de producao concluido
- checklist de seguranca revisado
- smoke tests de login, dashboard, requests e admin executados
- observabilidade basica habilitada conforme `docs/observability.md`
