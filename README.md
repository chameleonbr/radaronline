# RADAR 2.0

Aplicacao web React + TypeScript para gestao de planejamento regional, execucao de acoes, equipes, comunicados e requests operacionais.

## Stack atual

- Frontend: React 18, TypeScript, Vite
- UI: Tailwind CSS, Framer Motion, Recharts, Leaflet
- Backend atual: Supabase
- Persistencia: PostgreSQL gerenciado via Supabase
- Auth: Supabase Auth
- Funcoes administrativas: Supabase Edge Functions
- Testes: Vitest + Testing Library

## Comandos principais

```bash
npm install
npm run dev
npm run lint
npm run test:run
npm run build
```

## Banco local via CLI

Prerequisito:

- Docker Desktop ativo

Comandos:

```bash
npm run db:start
npm run db:reset
npm run db:status
npm run db:types
npm run db:stop
```

Regras:

- use `npm run db:reset` como comando padrao para criar ou recriar o banco local
- `supabase/migrations/` e a fonte autoritativa de schema
- `database/seed.sql` e aplicado automaticamente no reset local
- para ambiente remoto Supabase, execute `supabase link --project-ref <ref>` e depois `npm run db:push`
- `database/schema.sql` deve ficar restrito a bootstrap/manual de Azure PostgreSQL e referencia

## Backend proprio em transicao

```bash
cd apps/api
npm install
npm run dev
npm run build
```

## Variaveis de ambiente

Use `.env.example` como base.

Obrigatorias:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Opcional:

- `VITE_API_TIMEOUT`
- `VITE_OBSERVABILITY_BEACON_URL`
- `VITE_BACKEND_API_URL`
- `VITE_DISABLE_LEGACY_SUPABASE_ADMIN_FLOW`
- `VITE_USE_BACKEND_ADMIN_USERS`
- `VITE_USE_BACKEND_ACTIONS`
- `VITE_USE_BACKEND_REQUESTS`
- `VITE_USE_BACKEND_ANNOUNCEMENTS`
- `VITE_USE_BACKEND_COMMENTS`
- `VITE_USE_BACKEND_TAGS`
- `VITE_USE_BACKEND_TEAMS`
- `VITE_USE_BACKEND_OBJECTIVES_ACTIVITIES`
- `VITE_USE_BACKEND_AUTH_SESSION`
- `VITE_USE_BACKEND_AUTH_PROFILE`

## Documentacao

- `docs/README.md`
- `docs/architecture-overview.md`
- `docs/azure-target-architecture.md`
- `docs/supabase-to-azure-mapping.md`
- `docs/backend-delivery-program.md`
- `docs/backend-domain-backlog.md`
- `docs/program-status.md`
- `docs/immediate-execution-backlog.md`
- `docs/security-model.md`
- `docs/operations-runbook.md`
- `docs/portability-and-provider-seams.md`
- `docs/development-governance.md`
- `docs/handover-checklist.md`
- `docs/azure-readiness.md`
- `docs/enterprise-readiness-final.md`
- `docs/SUPABASE.md`

## Estado atual

- frontend estruturalmente modularizado
- camada de servicos parcialmente desacoplada via `src/services/platformClient.ts`
- CI com `lint`, `test`, `build`, `verify:readiness` e `apps/api build`
- documentacao operacional e de handover inicializada
- backend de transicao implementado para `users`, `actions`, `requests`, `announcements`, `comments`, `tags` e partes de `auth profile`
- backend de transicao implementado para `teams`, `objectives/activities` e `auth session`
- `infra/bicep` ja cobre observabilidade, Key Vault, PostgreSQL, Service Bus, Container Apps e API Management
- workflows de deploy para `infra`, `api` e `web` adicionados em `.github/workflows/`

## Riscos ainda abertos

- dependencia funcional de Supabase continua presente em auth, realtime, edge functions e schema
- observabilidade ainda esta em nivel basico de aplicacao
- nao existe backend proprio intermediando todo o dominio
- a prontidao de migracao para outro provider ainda depende de novas costuras na camada de servicos e auth
