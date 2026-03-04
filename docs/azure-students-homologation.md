# Azure for Students - Homologacao

## Objetivo

Subir um ambiente de homologacao pessoal para provar:

- infra por Bicep
- backend proprio
- deploy do frontend
- fluxo administrativo backend-first
- trilha de identidade pronta para Entra

## O que ja foi feito nesta maquina

- `az login` concluido
- subscription `Azure for Students` validada
- resource group `rg-radar-students-hml` criado em `brazilsouth`
- `az bicep build` validado no template principal

## Passo 1. Entrar na pasta correta

```powershell
cd "C:\Users\clevi\Desktop\Refatorar\radar 2.0 - Copia (2)"
```

## Passo 2. Rodar o bootstrap local

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\bootstrap-azure-students.ps1
```

## Passo 3. Configurar GitHub Actions

### Secrets

- `AZURE_CLIENT_ID`
- `AZURE_TENANT_ID`
- `AZURE_SUBSCRIPTION_ID`
- `AZURE_RESOURCE_GROUP`
- `POSTGRESQL_ADMIN_PASSWORD`
- `BRIDGE_SUPABASE_SERVICE_ROLE_KEY`
- `APIM_PUBLISHER_EMAIL`
- `ACR_LOGIN_SERVER`
- `ACR_USERNAME`
- `ACR_PASSWORD`
- `AZURE_STATIC_WEB_APPS_API_TOKEN`

### Variables

- `APIM_PUBLISHER_NAME`
- `BRIDGE_SUPABASE_URL`
- `ENTRA_TENANT_ID`
- `ENTRA_AUDIENCE`
- `ENTRA_ISSUER`
- `ENTRA_JWKS_URI`
- `API_CONTAINER_APP_NAME`
- `API_IMAGE`
- `WORKER_IMAGE`
- `WEB_ORIGIN_HOST`
- `FRONT_DOOR_CUSTOM_DOMAIN_RESOURCE_IDS`

## Passo 4. Rodar os workflows

Na aba `Actions` do GitHub:

1. `Deploy Infra`
2. `Deploy API`
3. `Deploy Web`

Ambiente recomendado:

- `hml`

## Passo 5. Ligar as feature flags do frontend

No frontend de homologacao:

- `VITE_BACKEND_API_URL`
- `VITE_USE_BACKEND_ADMIN_USERS=true`
- `VITE_USE_BACKEND_ACTIONS=true`
- `VITE_USE_BACKEND_REQUESTS=true`
- `VITE_USE_BACKEND_ANNOUNCEMENTS=true`
- `VITE_USE_BACKEND_COMMENTS=true`
- `VITE_USE_BACKEND_TAGS=true`
- `VITE_USE_BACKEND_TEAMS=true`
- `VITE_USE_BACKEND_OBJECTIVES_ACTIVITIES=true`
- `VITE_USE_BACKEND_AUTH_PROFILE=true`
- `VITE_USE_BACKEND_AUTH_SESSION=true`

Inicialmente manter:

- `VITE_DISABLE_LEGACY_SUPABASE_ADMIN_FLOW=false`

## Passo 6. Rodar os smoke tests

```powershell
npm run smoke:backend
npm run smoke:users-cutover
```

## Passo 7. Fazer o cutover do admin

Quando `users`, `profile` e `first-access` estiverem validados:

- `VITE_DISABLE_LEGACY_SUPABASE_ADMIN_FLOW=true`

Depois repetir:

```powershell
npm run smoke:users-cutover
```

## Passo 8. Validar Entra

No backend:

- `AUTH_PROVIDER=entra-jwt`
- `ENTRA_TENANT_ID`
- `ENTRA_AUDIENCE`
- `ENTRA_ISSUER`
- `ENTRA_JWKS_URI`

Depois validar:

- `GET /v1/auth/session`
- `GET /v1/auth/profile`

## Passo 9. Fechar passivo de banco

```powershell
npm run report:legacy-migrations
```

Revisar:

- `docs/database-legacy-inventory.md`

## Resultado esperado

Ao final da homologacao:

- backend e frontend sobem por pipeline
- auth backend-first validado
- fluxo administrativo nao depende de `supabase-functions/*`
- template Azure esta pronto para ser repetido no ambiente institucional
