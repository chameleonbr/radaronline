# Security Model

## Identidade

O sistema usa Supabase Auth como provedor de identidade atual.

Pontos relevantes:

- sessao e tokens sao gerenciados no cliente
- operacoes administrativas criticas usam Edge Functions
- perfil de autorizacao fica em `profiles.role`

## Autorizacao

A autorizacao hoje e hibrida:

- UI aplica guardas por papel
- servicos validam parte das regras
- banco e policies RLS continuam sendo a barreira final para varias operacoes

Papéis em uso:

- `superadmin`
- `admin`
- `gestor`
- `usuario`

## Superficies sensiveis

### Auth e perfil

- `src/auth/AuthContext.tsx`
- `src/services/authService.ts`
- `src/services/sessionService.ts`

### Requests e realtime

- `src/services/requestsService.ts`
- tabela `user_requests`
- subscriptions realtime

### Operacoes administrativas

- Edge Functions para:
  - criar usuario
  - atualizar senha
  - excluir usuario

### Auditoria

- `src/services/loggingService.ts`
- tabela `activity_logs`

## Controles implementados

- `platformClient` centraliza acesso ao provider
- funcoes administrativas sairam do cliente direto
- testes unitarios foram adicionados para mapeadores e agregadores sensiveis
- pipeline CI valida `lint`, `test` e `build`

## Riscos atuais

- tokens e claims ainda participam do modelo de seguranca
- nao existe backend proprio mediando todo o dominio
- logs de auditoria ainda dependem de persistencia no proprio provider
- nao ha rastreamento distribuido de ponta a ponta
- verificacoes de seguranca ainda sao majoritariamente documentadas, nao automatizadas

## Evidencias a manter

- `docs/security-test-checklist.md`
- `docs/SUPABASE.md`
- implementacoes em `supabase-functions/`
- historico de CI em `.github/workflows/ci.yml`

## Minimo operacional exigido

- revisar RLS e Edge Functions a cada mudanca de auth
- nao expor secrets no frontend
- manter `.env` fora de versionamento
- validar permissoes de admin/superadmin em testes manuais e PR review
