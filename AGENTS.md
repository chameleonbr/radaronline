# AGENTS.md

## Objetivo deste repositório

Transformar o Radar 2.0 em um workload Azure assumivel por fabrica de software, com:

- backend proprio
- PostgreSQL governado
- identidade fora do Supabase
- infraestrutura como codigo
- CI/CD reproduzivel
- observabilidade e auditoria
- handover operacional formal

## Regra principal para qualquer agente

Nao tratar este projeto como apenas uma aplicacao React.

O frontend estrutural ja foi refatorado. O trabalho prioritario agora e:

1. backend proprio
2. migracao de identidade
3. retirada de lock-in de Supabase
4. infraestrutura Azure
5. operacao enterprise

## O que ja foi feito

- frontend modularizado
- services modularizados por dominio
- seam inicial em `src/services/platformClient.ts`
- testes, lint e build verdes
- documentacao base de handover criada
- scaffold inicial de backend em `apps/api`
- scaffold inicial de IaC em `infra/bicep`

## O que ainda falta

### Bloco 1

- implementar `apps/api` de verdade
- auth/session
- users administration
- actions dominio inicial

### Bloco 2

- mover frontend para cliente HTTP oficial
- matar dependencia de `src/services/sessionService.ts`
- substituir `supabase-functions/*`

### Bloco 3

- expandir `infra/bicep` para APIM, Container Apps, PostgreSQL, Front Door, Service Bus
- pipeline de deploy Azure

### Bloco 4

- consolidar migrations em uma unica trilha
- validar restore e rollback

## Regra operacional de banco

- quando a tarefa for criar ou recriar o banco local, usar `npm run db:reset`
- quando a tarefa for subir o stack local do banco, usar `npm run db:start`
- quando a tarefa for apenas inspecionar estado local, usar `npm run db:status`
- `supabase/migrations/` e a trilha autoritativa de schema
- `database/seed.sql` e o seed de desenvolvimento aplicado pelo Supabase CLI
- nao usar MCP como fluxo primario para criar banco neste projeto
- nao usar `database/schema.sql` para mudanca permanente de schema
- `database/schema.sql` fica reservado para bootstrap/manual de Azure PostgreSQL ou referencia legada
- se o usuario pedir banco remoto no Supabase, primeiro executar `supabase link --project-ref <ref>` e depois `npm run db:push`
- se o usuario nao especificar ambiente, assumir banco local via Supabase CLI

## O que nao fazer

- nao criar endpoints 1:1 de tabela sem semantica de dominio
- nao deixar metade do frontend em Supabase e metade na API sem controle por feature flag
- nao usar AKS nesta fase
- nao introduzir banco multimodelo como core
- nao tratar realtime como prioridade antes de auth, API e governanca

## Sequencia obrigatoria

1. `apps/api` auth/session
2. `apps/api` users administration
3. `apps/api` actions inicial
4. cliente HTTP do frontend
5. troca do fluxo administrativo que hoje usa `supabase-functions`
6. IaC Azure completo
7. consolidacao de banco
8. cutover e handover

## Arquivos de referencia obrigatoria

- `docs/azure-target-architecture.md`
- `docs/supabase-to-azure-mapping.md`
- `docs/backend-delivery-program.md`
- `docs/backend-domain-backlog.md`
- `docs/program-status.md`
- `docs/immediate-execution-backlog.md`

## Validacao minima antes de encerrar uma rodada

No projeto principal:

```bash
npm run lint
npm run test:run
npm run build
```

Quando mexer em `apps/api`:

```bash
npm --prefix apps/api run build
```

## Definition of Done

Uma etapa so esta pronta quando:

1. o codigo existe
2. a documentacao da etapa existe
3. a validacao local foi executada
4. o proximo passo ficou registrado em `docs/program-status.md`
