# Database Governance

## Autoridade formal da trilha de schema

Arquivo:

- `database/migration-authority.json`

Decisao atual:

- a trilha autoritativa para alteracoes permanentes de schema e `supabase/migrations/`
- `database/schema.sql`, `database/security.sql`, `database/setup.sql` e `database/seed.sql` ficam como artefatos de bootstrap e referencia
- `database/migrations/` e `database/fixes/` sao trilhas suplementares legadas e devem ser consolidadas ou aposentadas

## Fontes de verdade atuais

### Estrutura e bootstrap

- `database/schema.sql`
- `database/security.sql`
- `database/setup.sql`
- `database/seed.sql`

### Migrations operacionais

- `supabase/migrations/`
- `database/migrations/`

## Estado atual

- existem migrations versionadas no diretorio do provider atual
- existem scripts SQL auxiliares fora do fluxo versionado principal
- a autoridade da trilha foi formalizada em `database/migration-authority.json`
- isso ajuda em recuperacao, mas cria risco de drift se nao houver disciplina operacional

## Riscos identificados

- duas trilhas de SQL podem divergir
- scripts em `database/fixes/` podem virar fonte paralela de mudanca
- sem processo formal, o ambiente pode ficar diferente do repositorio

## Regras recomendadas para operacao

- toda mudanca de schema permanente deve entrar primeiro em `supabase/migrations/`
- scripts de fix temporario devem ser promovidos ou descartados explicitamente
- rollback precisa ser definido por migration, nao por execucao manual ad hoc
- toda policy de seguranca deve ser revisada junto com auth/roles
- `database/schema.sql` nao deve receber mudanca manual sem a migration correspondente

## Evidencias a manter

- hash ou versao da migration aplicada por ambiente
- resultado de smoke tests apos migration
- aprovacao de seguranca quando mudar RLS e policies
- registro de quais scripts legados ainda nao foram consolidados
- `docs/database-legacy-inventory.md` atualizado via `npm run report:legacy-migrations`

## Itens para handover

- qual e a trilha autoritativa definida em `database/migration-authority.json`
- quais migrations estao em producao
- quais scripts fora de migration ainda precisam ser consolidados
- quais tabelas e views dependem de RLS para seguranca efetiva
