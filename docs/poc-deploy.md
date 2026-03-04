# POC Deploy — Conta Estudante Azure

## O que este stack cria

| Recurso | SKU | Custo estimado/mês |
|---|---|---|
| Log Analytics | Pay-per-GB (ingestion gratuita inicial) | ~$0-2 |
| Application Insights | Baseado em Log Analytics | ~$0-1 |
| Key Vault | Standard (10k ops/mês gratuitas) | ~$0 |
| PostgreSQL Flexible Server | Burstable B1ms (1 vCore, 2GB RAM) | ~$14 |
| Service Bus | Basic namespace | ~$0.10 |
| Container Apps (API + Worker) | Consumption — scale to 0 | ~$0-3 |
| Static Web Apps | **Free tier** | $0 |
| **Total estimado POC** | | **~$15-20/mês** |

Nao entram no POC: API Management (~$50/mês) e Front Door Premium (~$30/mês).

---

## Pre-requisitos

```powershell
# 1. Instalar Azure CLI
winget install Microsoft.AzureCLI

# 2. Verificar instalacao
az version

# 3. Fazer login com a conta estudante
az login

# 4. Confirmar a subscription ativa
az account show
az account list --output table
```

---

## Passo 1 — Criar o Resource Group

```powershell
az group create `
  --name rg-radar-poc `
  --location brazilsouth
```

---

## Passo 2 — Deploy da infraestrutura

```powershell
# Entrar na pasta do bicep
cd "infra/bicep"

# Validar antes de criar (dry-run)
az deployment group what-if `
  --resource-group rg-radar-poc `
  --template-file main-poc.bicep `
  --parameters parameters/poc.bicepparam `
  --parameters postgresqlAdminPassword="SuaSenhaForte123!"

# Se a validacao passou, deploy real
az deployment group create `
  --resource-group rg-radar-poc `
  --template-file main-poc.bicep `
  --parameters parameters/poc.bicepparam `
  --parameters postgresqlAdminPassword="SuaSenhaForte123!" `
  --output table
```

> A senha deve ter pelo menos 8 caracteres com maiuscula, minuscula e numero.

---

## Passo 3 — Ver os outputs (URLs geradas)

```powershell
az deployment group show `
  --resource-group rg-radar-poc `
  --name workload-app-radar-poc `
  --query properties.outputs `
  --output table
```

Os outputs que importam:
- `apiIngressFqdn` — URL da API (Container App)
- `staticWebAppDefaultHostname` — URL do frontend (Static Web App)

---

## Passo 4 — Deploy do frontend (React/Vite)

O Static Web App tem integracao direta com GitHub Actions.

```powershell
# Pegar o deployment token
$swaName = az deployment group show `
  --resource-group rg-radar-poc `
  --name "swa-radar-poc" `
  --query properties.outputs.staticWebAppName.value -o tsv

az staticwebapp secrets list `
  --name $swaName `
  --resource-group rg-radar-poc
```

1. Copie o `apiKey` gerado
2. No repositório GitHub, vá em **Settings > Secrets > Actions**
3. Crie o secret: `AZURE_STATIC_WEB_APPS_API_TOKEN` com o valor copiado
4. Crie o workflow `.github/workflows/azure-swa-poc.yml`:

```yaml
name: Deploy POC to Azure Static Web Apps
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
        env:
          VITE_API_URL: https://<seu-apiIngressFqdn>
      - uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: upload
          app_location: /
          output_location: dist
          skip_app_build: true
```

---

## Passo 5 — Aplicar o schema do banco

```powershell
# Pegar o host do postgres nos outputs
$pgHost = az deployment group show `
  --resource-group rg-radar-poc `
  --name "workload-data-radar-poc" `
  --query properties.outputs.postgresqlHost.value -o tsv

# Rodar o schema (requer psql instalado)
psql "host=$pgHost port=5432 dbname=radar user=radaradmin sslmode=require" `
  -f database/schema.sql
```

---

## Desligar o POC (para nao gastar credito)

```powershell
# Parar Container Apps (scale to 0 ja e automatico, mas para garantir)
az containerapp update --name ca-api-radar-poc --resource-group rg-radar-poc --min-replicas 0

# OU deletar tudo quando nao precisar mais
az group delete --name rg-radar-poc --yes --no-wait
```

---

## Checklist para apresentar ao governo

- [ ] Frontend acessivel via HTTPS em `*.azurestaticapps.net`
- [ ] API respondendo em `*.azurecontainerapps.io`
- [ ] Banco PostgreSQL provisionado e schema aplicado
- [ ] Logs visiveis no Application Insights
- [ ] Demonstrar que a infra e 100% codigo (Bicep auditavel)
- [ ] Mostrar que APIM e Front Door Premium entram na versao de producao

---

## Proximo passo apos aprovacao do governo

1. Solicitar subscription de producao (EA Gov ou MCA Gov)
2. Habilitar `workload-apim.bicep` e `workload-edge.bicep` no `main.bicep`
3. Configurar Microsoft Entra ID institucional
4. Executar cutover do Supabase seguindo `docs/supabase-to-azure-mapping.md`
