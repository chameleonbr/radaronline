# Development Governance

## Fluxo minimo

1. branch curta por objetivo
2. PR pequeno e rastreavel
3. review obrigatorio
4. CI verde antes de merge

## Definition Of Done

Uma mudanca so deve ser considerada pronta quando:

- compila
- passa em `lint`
- passa em `test:run`
- passa em `build`
- nao aumenta acoplamento ao provider sem justificativa
- atualiza documentacao quando altera arquitetura, seguranca ou operacao

## Padroes do repositorio

- TypeScript
- servicos por dominio em `src/services/`
- hooks por caso de uso em `src/hooks/`
- componentes por feature em `src/features/`

## Regras de review

- evitar logica de dominio dentro de componentes grandes
- evitar acesso direto ao provider fora de `platformClient` e servicos
- justificar toda nova dependencia externa
- preferir extrações incrementais a reescritas amplas

## Testes minimos por tipo de mudanca

### UI/Hook

- teste unitario do hook ou helper afetado

### Servico

- teste de mapper, helper ou agregacao
- revisar impacto em portabilidade

### Auth / Request / Admin

- validação manual do fluxo principal
- confirmar autorizacao e erros esperados

## Donos recomendados

- arquitetura e servicos: principal engineer / backend lead
- seguranca: security reviewer
- UI/fluxo: frontend lead
- operacao: owner de plataforma
