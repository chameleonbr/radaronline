# Architecture Overview

## Contexto

O sistema e um SPA React + TypeScript que hoje consome diretamente uma plataforma gerenciada para:

- autenticacao
- persistencia relacional
- realtime
- edge functions administrativas

Nao existe ainda um backend proprio separado como BFF ou API de dominio completa.

## Containers

### Web App

- entrada principal: `src/index.tsx`
- shell principal: `src/App.tsx`
- gate de entrada: `src/components/app/AppEntryGate.tsx`
- autenticacao e sessao: `src/auth/AuthContext.tsx`

### Servicos de dominio no frontend

Principais pontos:

- `src/services/authService.ts`
- `src/services/actionsService.ts`
- `src/services/analyticsService.ts`
- `src/services/requestsService.ts`
- `src/services/teamsService.ts`
- `src/services/objectivesActivitiesService.ts`

Esses servicos encapsulam regras de acesso a dados e hoje funcionam como camada de adaptacao entre UI e provider.

### Provider atual

- cliente central: `src/lib/supabase.ts`
- seam de provider: `src/services/platformClient.ts`

O objetivo desse seam e concentrar o acesso ao provider concreto num ponto unico.

## Fronteiras atuais

### UI

- `src/features/`
- `src/components/`
- `src/hooks/`

### Dominio aplicado no frontend

- handlers de acao, objetivo, atividade, requests, analytics e auth
- parte relevante das regras de negocio ainda vive nos servicos do frontend e no banco

### Persistencia

- acesso feito via servicos
- sem BFF
- dependencia direta do schema do provider

## Fluxos principais

### Login e sessao

1. UI chama `AuthContext`
2. `AuthContext` delega para `authService` e `sessionService`
3. `sessionService` usa `platformClient().auth`
4. perfil e permissoes sao carregados de `profiles`

### Gestao de acoes

1. UI chama hooks de acoes
2. hooks chamam `actionsService`
3. `actionsService` coordena `actions`, `action_raci`, `action_comments`, `action_tag_assignments`

### Requests e notificacoes

1. UI carrega requests por `requestsService`
2. subscriptions usam realtime em `user_requests`
3. notificacoes dependem do estado de requests e enriquecimento com `profiles`

### Admin

1. UI usa `useAdminPanelController`
2. controller coordena `authService`, `teamsService`, `announcementsService` e outros servicos
3. operacoes criticas usam Edge Functions para create/update/delete de usuarios

## Decisoes relevantes em vigor

- modularizacao pesada do frontend e componentes grandes
- servicos separados por dominio
- introducao de `platformClient` para reduzir acoplamento direto ao provider
- manutencao de `src/services/dataService.ts` como fachada legada para compatibilidade

## Limitacoes atuais

- ausencia de API de dominio propria
- lock-in funcional ainda forte em auth, realtime e edge functions
- observabilidade centralizada ainda nao implementada
- parte da seguranca continua dependente de RLS e policies do provider
