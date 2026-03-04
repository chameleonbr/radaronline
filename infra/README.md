# Infraestrutura Azure

## Objetivo

Definir a base de infraestrutura como codigo para `dev`, `hml` e `prod`.

## Escolha atual

- Bicep como linguagem de IaC
- modulos separados por concern
- parametros por ambiente

## Estrutura

```text
infra/
  bicep/
    main.bicep
    modules/
      workload-core.bicep
      workload-data.bicep
      workload-app.bicep
      workload-apim.bicep
      workload-edge.bicep
    parameters/
      dev.bicepparam
      hml.bicepparam
      prod.bicepparam
```

## Recursos alvo

- Front Door + WAF
- API Management
- Container Apps Environment
- Container Apps para API e workers
- PostgreSQL Flexible Server
- Key Vault
- Service Bus
- Log Analytics
- Application Insights

## Modulos atuais

- `workload-core.bicep`
  - Log Analytics
  - Application Insights
  - Key Vault
- `workload-data.bicep`
  - PostgreSQL Flexible Server
  - banco principal
  - Service Bus namespace e filas base
- `workload-app.bicep`
  - Container Apps Environment
  - Container App da API
  - Container App de worker
- `workload-apim.bicep`
  - API Management
- `workload-edge.bicep`
  - Front Door Premium
  - endpoint publico
  - rotas para web e API
  - WAF pronto para associacao a custom domains

## Parametros obrigatorios de deploy

- `postgresqlAdminPassword`
- `publisherEmail`
- `publisherName` se o valor padrao nao for aceito
- `apiImage`
- `workerImage`

## Parametros de transicao

- `bridgeSupabaseUrl`
- `bridgeSupabaseServiceRoleKey`
- `entraTenantId`
- `entraAudience`
- `entraIssuer`
- `entraJwksUri`
- `webOriginHost`
- `frontDoorCustomDomainResourceIds`

## Regra operacional

- nada de criar recurso manual no portal como passo obrigatorio
- segredo fora de parametro plano
- naming e tags obrigatorios
- validacao local com `bicep build` e deploy por pipeline antes de qualquer uso em `prod`

## Pipelines esperados

- `.github/workflows/deploy-infra.yml`
- `.github/workflows/deploy-api.yml`
- `.github/workflows/deploy-web.yml`

Secrets minimos:

- `AZURE_CLIENT_ID`
- `AZURE_TENANT_ID`
- `AZURE_SUBSCRIPTION_ID`
- `AZURE_RESOURCE_GROUP`
- `POSTGRESQL_ADMIN_PASSWORD`
- `BRIDGE_SUPABASE_SERVICE_ROLE_KEY`
- `ACR_LOGIN_SERVER`
- `ACR_USERNAME`
- `ACR_PASSWORD`
- `AZURE_STATIC_WEB_APPS_API_TOKEN`

Variaveis recomendadas por ambiente:

- `APIM_PUBLISHER_NAME`
- `BRIDGE_SUPABASE_URL`
- `ENTRA_TENANT_ID`
- `ENTRA_AUDIENCE`
- `ENTRA_ISSUER`
- `ENTRA_JWKS_URI`
- `API_CONTAINER_APP_NAME`
- `API_IMAGE`
- `WORKER_IMAGE`
- `WEB_ORIGIN_HOST`
- `FRONT_DOOR_CUSTOM_DOMAIN_RESOURCE_IDS`

Observacao:

- `FRONT_DOOR_CUSTOM_DOMAIN_RESOURCE_IDS` deve ser fornecido como array Bicep/JSON, por exemplo `["/subscriptions/.../customDomains/domain1"]`
