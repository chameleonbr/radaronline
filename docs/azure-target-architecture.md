# Arquitetura Alvo Azure

## Objetivo

Definir a arquitetura alvo que a fabrica de software deve implementar, operar e evoluir sem depender de Supabase como backend oficial.

## Principios

- backend proprio obrigatorio
- PostgreSQL como system of record
- seguranca por identidade corporativa e autorizacao explicita
- infraestrutura criada por codigo
- observabilidade e auditoria habilitadas desde o primeiro deploy
- contratos de API como fronteira oficial

## Decisoes fechadas

1. Frontend
- React/Vite continua como SPA
- hospedagem alvo: Azure Static Web Apps

2. Borda
- Azure Front Door Premium
- WAF habilitado
- roteamento unico para frontend e API

3. Governanca de API
- Azure API Management
- versionamento, politicas, throttling e controle de acesso centralizados

4. Compute de backend
- Azure Container Apps
- um servico API HTTP e workers separados quando houver jobs assincronos

5. Identidade
- Microsoft Entra ID para usuarios internos
- Microsoft Entra External ID apenas se houver publico externo confirmado

6. Banco
- Azure Database for PostgreSQL Flexible Server
- migrations unicas e versionadas

7. Segredos e identidade tecnica
- Azure Key Vault
- Managed Identity

8. Mensageria
- Azure Service Bus

9. Observabilidade
- Azure Monitor
- Application Insights
- Log Analytics

## Desenho logico

```text
Usuarios
  |
  v
Azure Front Door + WAF
  |------------------------------|
  v                              v
Azure Static Web Apps            Azure API Management
                                     |
                                     v
                              Azure Container Apps
                               |        |        |
                               v        v        v
                        PostgreSQL   Service Bus  Key Vault
                               |
                               v
                       Backup / PITR / Restore

Observabilidade transversal:
Front Door -> APIM -> API -> Workers -> PostgreSQL -> Log Analytics / App Insights
```

## Responsabilidade por camada

### Frontend

- autenticacao por OIDC/OAuth com Entra
- chamadas apenas para a API oficial
- nenhum acesso direto ao banco
- nenhum uso direto de Supabase SDK em producao alvo

### API

- aplica regras de negocio
- valida permissao
- publica auditoria
- controla retries e idempotencia
- expoe contratos OpenAPI

### Banco

- persiste dados relacionais
- garante integridade referencial
- nao concentra a seguranca principal da aplicacao
- RLS pode existir como camada adicional, nunca como unica camada de autorizacao

### Plataforma

- entrega por pipeline
- segredos fora do codigo
- ambientes dev, hml e prod separados
- dashboards e alertas ativos

## Zonas de seguranca

1. Zona publica
- Front Door
- WAF
- certificados

2. Zona de aplicacao
- APIM
- Container Apps
- Managed Identity

3. Zona de dados
- PostgreSQL
- Key Vault
- storage operacional

4. Zona de operacao
- App Insights
- Log Analytics
- alertas e dashboards

## Requisitos nao negociaveis

- nenhuma operacao critica depende de Edge Functions Supabase
- nenhuma autenticacao depende de Supabase Auth
- nenhuma feature critica depende de `channel` ou `postgres_changes`
- nenhum segredo fica em `.env` de producao
- toda mudanca de schema e reproduzivel por migration

## Criteria de aceite da arquitetura alvo

1. ambiente novo nasce por IaC
2. frontend autentica por Entra
3. API documentada e versionada em OpenAPI
4. PostgreSQL sobe e recebe migrations sem passos manuais
5. logs, metricas e traces podem ser correlacionados
6. rollback de app e restore de banco possuem runbook

## Fora de escopo da fase inicial

- AKS
- multi-cloud ativo
- banco multimodelo como core
- event streaming complexo
- realtime full duplex como requisito estrutural
