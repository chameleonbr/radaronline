# Portability And Provider Seams

## Estado atual

O sistema continua funcionalmente dependente de Supabase, mas o acoplamento direto foi reduzido em boa parte da camada de servicos.

## Seams implementados

### Cliente de provider

- `src/services/platformClient.ts`

Esse arquivo passou a ser o ponto central de acesso ao provider concreto.

### Servicos ja ajustados para usar o seam

- `src/services/authService.ts`
- `src/services/actionsService.ts`
- `src/services/analyticsService.ts`
- `src/services/requestsService.ts`
- `src/services/commentsService.ts`
- `src/services/objectivesActivitiesService.ts`
- `src/services/teamsService.ts`
- `src/services/tagsService.ts`
- `src/services/announcementsService.ts`
- `src/services/loggingService.ts`

## Lock-ins ainda presentes

### Auth

- fluxo de sessao em `platformClient().auth`
- dependencia de `profiles`
- funcoes administrativas acopladas ao modelo de usuario do provider

### Realtime

- requests e notificacoes usam `channel` e `postgres_changes`

### Edge Functions

- create-user
- update-user-password
- delete-user

### Banco e schema

- servicos ainda conhecem tabelas e colunas concretas
- RLS continua assumida como camada de seguranca

## O que ja melhorou

- UI nao depende mais de um grande `dataService` com regras misturadas
- servicos maiores foram quebrados em:
  - facade publica
  - repositories
  - mappers
  - helpers/aggregations
- isso reduz custo de troca do adapter de persistencia

## O que ainda bloqueia portabilidade completa

- falta de contratos neutros de dominio separados do schema
- falta de provider adapters formais por capability
- auth ainda sem camada independente do provedor
- storage e realtime ainda sem abstracao equivalente

## Resultado pratico

Hoje o sistema esta mais preparado para migracao incremental, mas ainda nao esta pronto para trocar provider sem retrabalho relevante em auth, realtime e persistencia.
