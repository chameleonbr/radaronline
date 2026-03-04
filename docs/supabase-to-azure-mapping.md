# Mapa de Transicao Supabase -> Azure

## Objetivo

Registrar o que existe hoje, o alvo em Azure e o trabalho necessario para retirar o lock-in atual.

## Mapa

| Dependencia atual | Uso atual no repo | Alvo Azure | Acao obrigatoria | Risco |
| --- | --- | --- | --- | --- |
| `src/lib/supabase.ts` | cliente global do provider | cliente HTTP para API propria | remover acesso direto do frontend | alto |
| `src/services/platformClient.ts` | seam ainda exposto como Supabase API | adapters de dominio / cliente HTTP | redefinir contratos por modulo | alto |
| `src/services/sessionService.ts` | auth, sessao, evento de auth | Entra + backend session facade | reimplementar interface de sessao | critico |
| `supabase-functions/create-user/index.ts` | criacao de usuario | API backend + Graph/Entra | substituir por endpoint administrativo | critico |
| `supabase-functions/delete-user/index.ts` | exclusao de usuario | API backend + Graph/Entra | substituir por endpoint administrativo | critico |
| `supabase-functions/update-user-password/index.ts` | troca de senha | fluxo Entra ou operacao administrativa | reprojetar operacao | critico |
| `database/schema.sql` | schema e policies com `auth.uid()` | PostgreSQL Azure + autorizacao no backend | retirar dependencia de auth do provider | critico |
| `database/security.sql` | regras de seguranca no banco | politica explicita de autorizacao | consolidar com backend | alto |
| `src/services/requests/requestsService.repositories.ts` | `channel` e `postgres_changes` | polling controlado ou push via worker | remover realtime provider-specific | medio |

## Sequencia de retirada de lock-in

1. sessao e auth
2. funcoes administrativas
3. endpoints de dominio do backend
4. troca de leitura/escrita do frontend
5. consolidacao do banco
6. desativacao de realtime provider-specific

## Regras de transicao

- sem big bang
- coexistencia controlada por feature flag
- cada dominio migra com smoke test
- rollback por dominio e por ambiente

## Criterios para desligar Supabase

1. login e sessao em Entra
2. usuarios administrados pelo backend
3. CRUD critico servido pela API oficial
4. frontend sem chamadas diretas ao provider
5. banco oficial em Azure com restore testado
6. realtime critico substituido
