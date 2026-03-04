targetScope = 'resourceGroup'

@description('Nome da aplicacao')
param appName string = 'radar'

@description('Ambiente de deploy')
@allowed([
  'dev'
  'hml'
  'prod'
])
param environment string

@description('Localizacao dos recursos')
param location string = resourceGroup().location

@description('Tags obrigatorias')
param tags object = {}

@description('Nome do publisher do API Management')
param publisherName string = 'Radar Platform Team'

@description('Email do publisher do API Management')
param publisherEmail string = 'radar@example.gov.br'

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

@description('URL do provider atual para bridge de transicao')
param bridgeSupabaseUrl string = ''

@description('Service role key do provider atual para bridge de transicao')
@secure()
param bridgeSupabaseServiceRoleKey string = ''

@description('Tenant do Entra para a trilha final de identidade')
param entraTenantId string = ''

@description('Audience do Entra para validacao de token')
param entraAudience string = ''

@description('Issuer do Entra para validacao de token')
param entraIssuer string = ''

@description('JWKS URI do Entra para validacao de token')
param entraJwksUri string = ''

@description('Hostname do frontend publicado para uso no Front Door')
param webOriginHost string = ''

@description('Ids de custom domains do Front Door para associacao do WAF')
param frontDoorCustomDomainResourceIds array = []

module workload './modules/workload-core.bicep' = {
  name: 'workload-core-${appName}-${environment}'
  params: {
    appName: appName
    environment: environment
    location: location
    tags: tags
  }
}

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
    entraTenantId: entraTenantId
    entraAudience: entraAudience
    entraIssuer: entraIssuer
    entraJwksUri: entraJwksUri
  }
}

module gateway './modules/workload-apim.bicep' = {
  name: 'workload-apim-${appName}-${environment}'
  params: {
    appName: appName
    environment: environment
    location: location
    tags: tags
    publisherName: publisherName
    publisherEmail: publisherEmail
  }
}

module edge './modules/workload-edge.bicep' = {
  name: 'workload-edge-${appName}-${environment}'
  params: {
    appName: appName
    environment: environment
    tags: tags
    apiOriginHost: replace(gateway.outputs.apiManagementGatewayUrl, 'https://', '')
    webOriginHost: webOriginHost
    frontDoorCustomDomainResourceIds: frontDoorCustomDomainResourceIds
  }
}

output appInsightsName string = workload.outputs.appInsightsName
output logAnalyticsName string = workload.outputs.logAnalyticsName
output keyVaultName string = workload.outputs.keyVaultName
output apiManagementName string = gateway.outputs.apiManagementName
output apiManagementGatewayUrl string = gateway.outputs.apiManagementGatewayUrl
output frontDoorProfileName string = edge.outputs.frontDoorProfileName
output frontDoorEndpointName string = edge.outputs.frontDoorEndpointName
output frontDoorEndpointHostName string = edge.outputs.frontDoorEndpointHostName
output frontDoorWafPolicyName string = edge.outputs.frontDoorWafPolicyName
output containerAppsEnvironmentName string = app.outputs.containerAppsEnvironmentName
output apiContainerAppName string = app.outputs.apiContainerAppName
output workerContainerAppName string = app.outputs.workerContainerAppName
output apiIngressFqdn string = app.outputs.apiIngressFqdn
output postgresqlServerName string = data.outputs.postgresqlServerName
output postgresqlHost string = data.outputs.postgresqlHost
output serviceBusNamespaceName string = data.outputs.serviceBusNamespaceName
