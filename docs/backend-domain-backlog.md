# Backlog Tecnico do Backend

## Estrutura alvo

```text
apps/api
  src/
    config/
    modules/
      auth/
      profiles/
      teams/
      planning/
      actions/
      comments/
      tags/
      announcements/
      requests/
      audit/
    shared/
      auth/
      domain/
      http/
      observability/
      persistence/
```

## Principios de implementacao

- endpoint de dominio, nao endpoint de tabela
- validacao server-side obrigatoria
- autorizacao explicita no backend
- payloads versionados
- erros em formato padrao

## Ordem de implementacao

### Bloco 1 - Foundation

1. `GET /health`
2. `GET /ready`
3. `GET /v1/auth/session`
4. `POST /v1/auth/login`
5. `POST /v1/auth/logout`

### Bloco 2 - Administracao de usuarios

1. `GET /v1/users`
2. `GET /v1/users/{userId}`
3. `POST /v1/users`
4. `PATCH /v1/users/{userId}`
5. `DELETE /v1/users/{userId}`
6. `POST /v1/users/{userId}/reset-password`

### Bloco 3 - Perfis e equipes

1. `GET /v1/profiles/me`
2. `PATCH /v1/profiles/me`
3. `GET /v1/teams`
4. `GET /v1/teams/{teamId}`
5. `POST /v1/teams/{teamId}/members`
6. `DELETE /v1/teams/{teamId}/members/{memberId}`

### Bloco 4 - Planejamento

1. `GET /v1/objectives`
2. `POST /v1/objectives`
3. `PATCH /v1/objectives/{objectiveId}`
4. `DELETE /v1/objectives/{objectiveId}`
5. `GET /v1/activities`
6. `POST /v1/activities`
7. `PATCH /v1/activities/{activityId}`
8. `DELETE /v1/activities/{activityId}`

### Bloco 5 - Acoes

1. `GET /v1/actions`
2. `GET /v1/actions/{actionId}`
3. `POST /v1/actions`
4. `PATCH /v1/actions/{actionId}`
5. `DELETE /v1/actions/{actionId}`
6. `POST /v1/actions/{actionId}/raci`
7. `PUT /v1/actions/{actionId}/tags`
8. `POST /v1/actions/{actionId}/comments`

### Bloco 6 - Requests e comunicados

1. `GET /v1/requests`
2. `POST /v1/requests`
3. `PATCH /v1/requests/{requestId}`
4. `DELETE /v1/requests/{requestId}`
5. `GET /v1/announcements`
6. `POST /v1/announcements`
7. `PATCH /v1/announcements/{announcementId}`
8. `DELETE /v1/announcements/{announcementId}`

### Bloco 7 - Auditoria

1. `GET /v1/audit/logs`
2. `POST /v1/audit/events`

## Regras obrigatorias por modulo

### Auth

- integracao com Entra
- mapeamento de identidade externa para perfil interno
- logout invalida sessao local

### Users

- criacao e exclusao sao auditadas
- alteracoes de role exigem permissao administrativa

### Actions

- update parcial validado
- RACI validado contra equipe e permissao
- tags e comments com ownership claro

### Requests

- historico de status
- notificacao desacoplada do CRUD principal

## Testes minimos

### Unitarios

- validadores
- mapeadores
- regras de autorizacao

### Integracao

- auth/session
- users administration
- actions CRUD
- requests moderation

### E2E

- login
- criar usuario
- criar acao
- aprovar request

## Definition of Done por endpoint

Um endpoint so entra em producao quando:

1. existe contrato OpenAPI
2. existe validacao de entrada
3. existe autorizacao explicita
4. existe log de auditoria quando aplicavel
5. existe teste de sucesso e teste de erro
6. existe documentacao operacional se impactar rotina administrativa
