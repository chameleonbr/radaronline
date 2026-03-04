# Handover Checklist

## Codigo e build

- [ ] `npm ci`
- [ ] `npm run lint`
- [ ] `npm run test:run`
- [ ] `npm run build`

## Ambiente

- [ ] `.env.example` revisado
- [ ] variaveis de producao inventariadas
- [ ] acesso ao provider atual validado

## Arquitetura

- [ ] ler `docs/architecture-overview.md`
- [ ] ler `docs/portability-and-provider-seams.md`
- [ ] validar `src/services/platformClient.ts`

## Seguranca

- [ ] ler `docs/security-model.md`
- [ ] executar `docs/security-test-checklist.md`
- [ ] revisar Edge Functions em `supabase-functions/`

## Operacao

- [ ] ler `docs/operations-runbook.md`
- [ ] validar workflow em `.github/workflows/ci.yml`
- [ ] confirmar procedimento de rollback

## Riscos que precisam de aceite explicito

- [ ] dependencia corrente de Supabase Auth
- [ ] dependencia corrente de realtime do provider
- [ ] ausencia de BFF/API propria completa
- [ ] observabilidade ainda em nivel basico
