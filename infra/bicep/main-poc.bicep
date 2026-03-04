// ---------------------------------------------------------------------------
// main-poc.bicep
// Stack minima para POC / demonstracao governamental
// Exclui: API Management, Front Door/WAF (caros)
// Inclui: Log Analytics, App Insights, Key Vault, PostgreSQL, Service Bus,
//         Container Apps (API + Worker), Static Web App
// ---------------------------------------------------------------------------

targetScope = 'resourceGroup'

@description('Nome da aplicacao')
param appName string = 'radar'

@description('Ambiente')
param environment string = 'poc'

@description('Localizacao dos recursos')
param location string = resourceGroup().location

@description('Tags')
param tags object = {}

@description('Imagem do container da API')
param apiImage string = 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest'

@description('Imagem do container do worker')
param workerImage string = 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest'

@description('Login administrador do PostgreSQL')
param postgresqlAdminLogin string = 'radaradmin'

@description('Senha administradora do PostgreSQL')
@secure()
param postgresqlAdminPassword string

@description('Nome do banco principal')
param postgresqlDatabaseName string = 'radar'

@description('URL do Supabase atual (bridge de transicao, opcional)')
param bridgeSupabaseUrl string = ''

@description('Service role key do Supabase atual (bridge, opcional)')
@secure()
param bridgeSupabaseServiceRoleKey string = ''

// ---------------------------------------------------------------------------
// Core: Log Analytics + App Insights + Key Vault
// ---------------------------------------------------------------------------
module workload './modules/workload-core.bicep' = {
  name: 'workload-core-${appName}-${environment}'
  params: {
    appName: appName
    environment: environment
    location: location
    tags: tags
  }
}

// ---------------------------------------------------------------------------
// Data: PostgreSQL Flexible B1ms + Service Bus Basic
// ---------------------------------------------------------------------------
module data './modules/workload-data.bicep' = {
  name: 'workload-data-${appName}-${environment}'
  params: {
    appName: appName
    environment: environment
    location: location
    tags: tags
    postgresqlAdminLogin: postgresqlAdminLogin
    postgresqlAdminPassword: postgresqlAdminPassword
    postgresqlDatabaseName: postgresqlDatabaseName
  }
}

// ---------------------------------------------------------------------------
// App: Container Apps (API + Worker)
// ---------------------------------------------------------------------------
module app './modules/workload-app.bicep' = {
  name: 'workload-app-${appName}-${environment}'
  params: {
    appName: appName
    environment: environment
    location: location
    tags: tags
    apiImage: apiImage
    workerImage: workerImage
    keyVaultName: workload.outputs.keyVaultName
    logAnalyticsWorkspaceName: workload.outputs.logAnalyticsName
    logAnalyticsCustomerId: workload.outputs.logAnalyticsCustomerId
    appInsightsConnectionString: workload.outputs.appInsightsConnectionString
    serviceBusNamespace: data.outputs.serviceBusNamespaceName
    postgresqlHost: data.outputs.postgresqlHost
    postgresqlDatabaseName: data.outputs.postgresqlDatabaseName
    postgresqlAdminLogin: postgresqlAdminLogin
    postgresqlAdminPassword: postgresqlAdminPassword
    bridgeSupabaseUrl: bridgeSupabaseUrl
    bridgeSupabaseServiceRoleKey: bridgeSupabaseServiceRoleKey
  }
}

// ---------------------------------------------------------------------------
// Frontend: Azure Static Web Apps (free tier)
// ---------------------------------------------------------------------------
resource staticWebApp 'Microsoft.Web/staticSites@2023-01-01' = {
  name: take('swa-${toLower(appName)}-${environment}', 40)
  location: location
  tags: tags
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    stagingEnvironmentPolicy: 'Disabled'
    allowConfigFileUpdates: true
    buildProperties: {
      appLocation: '/'
      outputLocation: 'dist'
      appBuildCommand: 'npm run build'
    }
  }
}

// ---------------------------------------------------------------------------
// Outputs
// ---------------------------------------------------------------------------
output appInsightsName string = workload.outputs.appInsightsName
output logAnalyticsName string = workload.outputs.logAnalyticsName
output keyVaultName string = workload.outputs.keyVaultName
output containerAppsEnvironmentName string = app.outputs.containerAppsEnvironmentName
output apiContainerAppName string = app.outputs.apiContainerAppName
output workerContainerAppName string = app.outputs.workerContainerAppName
output apiIngressFqdn string = app.outputs.apiIngressFqdn
output postgresqlServerName string = data.outputs.postgresqlServerName
output postgresqlHost string = data.outputs.postgresqlHost
output serviceBusNamespaceName string = data.outputs.serviceBusNamespaceName
output staticWebAppName string = staticWebApp.name
output staticWebAppDefaultHostname string = staticWebApp.properties.defaultHostname
