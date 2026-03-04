# Programa de Entrega do Backend

## Objetivo

Industrializar o sistema para que a fabrica receba um backend proprio, operavel em Azure, com governanca, seguranca e deploy reproduzivel.

## Resultado esperado

Ao final do programa, a fabrica deve conseguir:

1. provisionar ambiente por pipeline
2. publicar frontend e backend sem usar portal manual
3. restaurar banco e reaplicar migrations
4. operar logs, alertas e dashboards
5. assumir manutencao sem depender de conhecimento tribal

## Workstreams

1. Arquitetura e governanca
2. Backend e contratos
3. Identidade e seguranca
4. Banco e migrations
5. Infraestrutura e deploy
6. Observabilidade e SRE
7. Handover operacional

## Fase 0 - Congelamento arquitetural

### Objetivo

Fechar decisoes de plataforma antes de qualquer migracao operacional.

### Entregaveis

- `docs/azure-target-architecture.md`
- `docs/supabase-to-azure-mapping.md`
- ADRs de backend, identidade e banco
- RACI do programa

### Responsaveis

- Principal Engineer
- Tech Lead Backend
- Arquiteto Cloud

### Aceite

- nenhuma decisao critica aberta
- patrocinio tecnico aprovado

## Fase 1 - Foundation de backend

### Objetivo

Criar a espinha dorsal do backend, contratos e padrao de erro.

### Entregaveis

- `apps/api`
- OpenAPI inicial
- rotas de health, auth, actions
- convencao de validacao, logging e authorization

### Responsaveis

- Tech Lead Backend
- Principal Engineer

### Aceite

- backend sobe localmente
- contrato OpenAPI versionado
- frontend ja pode integrar nos endpoints iniciais

## Fase 2 - Identidade e sessao

### Objetivo

Retirar Supabase Auth do caminho critico.

### Entregaveis

- adapter Entra
- middleware de autenticacao
- middleware de autorizacao
- substituicao das funcoes `create-user`, `delete-user`, `update-user-password`

### Responsaveis

- Backend
- Security focal

### Aceite

- login e sessao fora de Supabase
- trilha de auditoria de operacoes administrativas

## Fase 3 - Dominio e API oficial

### Objetivo

Substituir repositories provider-shaped por casos de uso de dominio.

### Entregaveis

- modulos de `profiles`, `teams`, `planning`, `actions`, `comments`, `requests`, `announcements`, `audit`
- DTOs de entrada/saida
- testes de integracao

### Aceite

- frontend chama API oficial para fluxos criticos
- regras de negocio nao ficam mais espalhadas no cliente

## Fase 4 - Banco profissional

### Objetivo

Unificar schema, migrations e governanca de dados.

### Entregaveis

- fonte unica de migrations
- dicionario de dados
- plano de rollback de schema
- evidencias de backup e restore

### Aceite

- ambiente novo sobe banco do zero
- restore testado em homologacao

## Fase 5 - Infraestrutura Azure

### Objetivo

Criar o workload Azure por codigo.

### Entregaveis

- `infra/bicep`
- parametros `dev`, `hml`, `prod`
- pipeline de provisionamento
- pipeline de deploy de frontend e backend

### Aceite

- sem bootstrap manual em portal
- dev e hml provisionados por pipeline

## Fase 6 - Observabilidade e operacao

### Objetivo

Entregar monitoramento operacional e resposta a incidente.

### Entregaveis

- dashboards
- alertas
- correlation id
- runbooks
- playbooks de rollback

### Aceite

- incidente pode ser diagnosticado sem abrir o codigo

## Fase 7 - Cutover e handover

### Objetivo

Executar a troca para Azure e entregar a operacao para a fabrica.

### Entregaveis

- plano de cutover
- plano de rollback
- smoke tests
- pacote final de handover

### Aceite

- fabrica consegue subir, operar e recuperar o sistema

## Cronograma base

### Sprint 1

- congelamento arquitetural
- scaffold de backend
- contrato OpenAPI inicial
- scaffold de IaC

### Sprint 2

- auth/session
- health checks
- user administration
- pipeline de backend

### Sprint 3

- actions
- teams
- planning
- testes de integracao iniciais

### Sprint 4

- comments
- requests
- announcements
- auditoria

### Sprint 5

- migrations unicas
- PostgreSQL Azure
- backup/restore

### Sprint 6

- APIM
- Front Door
- Container Apps
- Key Vault

### Sprint 7

- dashboards
- alertas
- observabilidade
- hardening

### Sprint 8

- cutover rehearsal
- handover
- aceite final

## Definicao de pronto

Uma fase so fecha quando:

- codigo passou em lint, testes e build
- documentacao da fase foi atualizada
- runbook aplicavel existe
- riscos residuais foram registrados
- rollback foi definido
