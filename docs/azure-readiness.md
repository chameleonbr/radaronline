# Azure Readiness

## Objetivo

Registrar o estado atual da aplicacao para migracao incremental para Azure sem perder rastreabilidade tecnica.

## Estado atual

### O que ja esta favoravel

- frontend desacoplado em servicos por dominio
- `src/services/platformClient.ts` centraliza o client do provider atual
- funcoes administrativas ja estao isoladas por servico
- camada de requests, auth, analytics e acoes foi modularizada
- CI valida `lint`, `test` e `build`
- documentacao operacional e de seguranca existe
- `infra/bicep` ja cobre core, data, app, APIM e borda Front Door/WAF no repositorio

### O que ainda prende no provider atual

- `platformClient` ainda representa capacidades do Supabase
- auth depende de `platformClient().auth`
- realtime depende de `channel` e `postgres_changes`
- Edge Functions fazem parte do fluxo de administracao de usuarios
- RLS e policies continuam sendo parte da seguranca efetiva

## Mapeamento de preocupacoes para migracao

### Frontend

- baixo risco de migracao estrutural
- medio risco em sessao, notificacoes e requests em tempo real

### Banco

- schema ja possui migrations versionadas em `supabase/migrations/`
- risco medio/alto se o destino nao suportar o mesmo modelo de RLS

### Identidade

- risco alto
- fluxos de create/update/delete de usuario estao amarrados a Edge Functions e ao modelo de auth atual

### Observabilidade

- risco medio
- ha base local no frontend, mas ainda sem collector central e sem stack operacional de producao

## Critérios minimos de prontidao para migrar

- contratos de auth desacoplados do provider
- adapter de realtime separado
- estrategia de migracao de RLS/policies para camada de API ou mecanismo equivalente
- plano de cutover de Edge Functions administrativas
- evidencias de backup, rollback e smoke tests

## Sequencia recomendada de transicao

1. estabilizar contratos de dominio fora do schema
2. separar auth provider e realtime provider
3. definir estrategia de banco e autorizacao
4. preparar ambiente paralelo
5. executar cutover com smoke tests e rollback definido

## Resultado honesto hoje

O projeto esta preparado para uma migracao incremental planejada, mas ainda nao para uma troca imediata e transparente de provider.
