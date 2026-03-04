# Backlog de Execucao Imediata

## Objetivo

Dar continuidade sem rediscutir arquitetura.

## Prioridade P0

### 1. Homologacao real do backend de transicao

Arquivos alvo:

- `apps/api/src/modules/users`
- `apps/api/src/modules/auth`
- `apps/api/src/modules/actions`
- `apps/api/src/modules/requests`
- `apps/api/src/modules/announcements`
- `apps/api/src/modules/comments`
- `apps/api/src/modules/tags`
- `apps/api/src/modules/teams`
- `apps/api/src/modules/objectivesActivities`
- `src/services/apiClient.ts`

Entregas:

- execucao de `npm run smoke:backend`
- execucao de `npm run smoke:users-cutover`
- validacao de todos os feature flags em homologacao
- registro de gaps de payload, permissao e latencia

Aceite:

- `VITE_USE_BACKEND_ADMIN_USERS=true` validado
- `VITE_USE_BACKEND_ACTIONS=true` validado
- `VITE_USE_BACKEND_REQUESTS=true` validado
- `VITE_USE_BACKEND_ANNOUNCEMENTS=true` validado
- `VITE_USE_BACKEND_COMMENTS=true` validado
- `VITE_USE_BACKEND_TAGS=true` validado
- `VITE_USE_BACKEND_TEAMS=true` validado
- `VITE_USE_BACKEND_OBJECTIVES_ACTIVITIES=true` validado
- `VITE_USE_BACKEND_AUTH_PROFILE=true` validado
- `VITE_USE_BACKEND_AUTH_SESSION=true` validado
- `VITE_DISABLE_LEGACY_SUPABASE_ADMIN_FLOW=true` validado em homologacao

### 2. Validacao real da trilha Entra

Arquivos alvo:

- `apps/api/src/shared/auth/auth-provider.factory.ts`
- `apps/api/src/shared/auth/entra-jwt.provider.ts`
- `apps/api/src/config/env.ts`
- `infra/bicep/modules/workload-app.bicep`

Entregas:

- `AUTH_PROVIDER=entra-jwt` validado com tenant real
- claims e roles mapeados em ambiente
- `GET /v1/auth/session` e `GET /v1/auth/profile` validados com token real

Aceite:

- issuer, audience e JWKS corretos em homologacao
- token invalido retorna anonimo ou 401 de forma previsivel
- role administrativa chega ao backend por claim ou estrategia formal equivalente

### 3. Substituicao efetiva de `supabase-functions/*`

Arquivos alvo:

- `src/services/authService.ts`
- `src/services/backendApiConfig.ts`
- `apps/api/src/modules/users`
- `docs/operations-runbook.md`

Entregas:

- fluxo administrativo opera pelo backend novo
- fallback legado so existe para rollback controlado
- documentacao de desativacao do legado atualizada

Aceite:

- criacao, exclusao e reset de senha passam pela API
- primeiro acesso nao depende do caminho legado quando o cutover estiver ativo
- edge functions deixam de ser dependencia obrigatoria do fluxo administrativo

## Prioridade P1

### 4. IaC validado em Azure

Entregas:

- `bicep build` verde
- deploy real dos modulos:
  - core
  - data
  - app
  - apim
- outputs revisados por ambiente

### 5. Consolidacao de migrations

Entregas:

- inventario dos scripts legados em `database/migrations` e `database/fixes`
- consolidacao na trilha autoritativa
- runbook de rollback de schema

## Regra de execucao

Cada rodada deve:

1. implementar um corte vertical de verdade
2. atualizar `docs/program-status.md`
3. validar `lint`, `test:run`, `build`
4. se mexer no backend, validar `npm --prefix apps/api run test` e `npm --prefix apps/api run build`
5. registrar o proximo corte sem ambiguidade
