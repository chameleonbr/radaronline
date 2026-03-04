# Compliance And Audit Checklist

## Dados e acesso

- [ ] classificacao de dados por sensibilidade
- [ ] mapeamento de dados pessoais em `profiles`, `teams`, `user_requests`, `activity_logs`
- [ ] revisao de minimizacao de dados em logs e analytics
- [ ] inventario de roles e privilegios

## LGPD

- [ ] fluxo de consentimento documentado
- [ ] evidencias de consentimento armazenadas
- [ ] procedimento de revogacao/revisao definido
- [ ] politica de retencao e descarte documentada

## Seguranca

- [ ] revisar `docs/security-model.md`
- [ ] executar `docs/security-test-checklist.md`
- [ ] revisar Edge Functions administrativas
- [ ] revisar secrets e variaveis de ambiente

## Auditoria

- [ ] confirmar escrita de `activity_logs`
- [ ] confirmar quais eventos administrativos sao obrigatorios
- [ ] confirmar trilha de requests e alteracoes de usuario
- [ ] validar quem pode consultar logs e por quanto tempo

## Operacao

- [ ] evidencias de CI verde
- [ ] runbook de incidente revisado
- [ ] rollback de deploy validado
- [ ] rollback de migration definido

## Portabilidade

- [ ] revisar `docs/portability-and-provider-seams.md`
- [ ] listar dependencias ainda exclusivas do provider
- [ ] registrar decisoes de excecao aceitas pelo time
