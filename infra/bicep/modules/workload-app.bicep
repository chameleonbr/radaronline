param appName string
param environment string
param location string
param tags object
param apiImage string
param workerImage string
param keyVaultName string
param logAnalyticsWorkspaceName string
param logAnalyticsCustomerId string
param appInsightsConnectionString string
param serviceBusNamespace string
param postgresqlHost string
param postgresqlDatabaseName string
param postgresqlAdminLogin string
@secure()
param postgresqlAdminPassword string
param bridgeSupabaseUrl string = ''
@secure()
param bridgeSupabaseServiceRoleKey string = ''
param entraTenantId string = ''
param entraAudience string = ''
param entraIssuer string = ''
param entraJwksUri string = ''
param apiMinReplicas int = environment == 'prod' ? 2 : 1
param apiMaxReplicas int = environment == 'prod' ? 5 : 2
param workerMinReplicas int = 0
param workerMaxReplicas int = environment == 'prod' ? 3 : 1

var suffix = toLower('${appName}-${environment}')
var managedEnvironmentName = take('cae-${suffix}', 32)
var apiAppName = take('ca-api-${suffix}', 32)
var workerAppName = take('ca-worker-${suffix}', 32)

resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2023-09-01' existing = {
  name: logAnalyticsWorkspaceName
}

resource managedEnvironment 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: managedEnvironmentName
  location: location
  tags: tags
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalyticsCustomerId
        sharedKey: logAnalyticsWorkspace.listKeys().primarySharedKey
      }
    }
  }
}

resource apiApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: apiAppName
  location: location
  tags: tags
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    managedEnvironmentId: managedEnvironment.id
    configuration: {
      activeRevisionsMode: 'Single'
      ingress: {
        external: true
        allowInsecure: false
        targetPort: 3001
        transport: 'auto'
      }
      secrets: [
        {
          name: 'postgres-admin-password'
          value: postgresqlAdminPassword
        }
        {
          name: 'bridge-supabase-service-role-key'
          value: bridgeSupabaseServiceRoleKey
        }
      ]
    }
    template: {
      containers: [
        {
          name: 'api'
          image: apiImage
          env: [
            {
              name: 'APP_NAME'
              value: '${appName}-api'
            }
            {
              name: 'NODE_ENV'
              value: environment == 'prod' ? 'production' : 'development'
            }
            {
              name: 'HOST'
              value: '0.0.0.0'
            }
            {
              name: 'PORT'
              value: '3001'
            }
            {
              name: 'APPINSIGHTS_CONNECTION_STRING'
              value: appInsightsConnectionString
            }
            {
              name: 'KEY_VAULT_NAME'
              value: keyVaultName
            }
            {
              name: 'SERVICE_BUS_NAMESPACE'
              value: serviceBusNamespace
            }
            {
              name: 'POSTGRES_HOST'
              value: postgresqlHost
            }
            {
              name: 'POSTGRES_DB'
              value: postgresqlDatabaseName
            }
            {
              name: 'POSTGRES_USER'
              value: postgresqlAdminLogin
            }
            {
              name: 'POSTGRES_PASSWORD'
              secretRef: 'postgres-admin-password'
            }
            {
              name: 'SUPABASE_URL'
              value: bridgeSupabaseUrl
            }
            {
              name: 'SUPABASE_SERVICE_ROLE_KEY'
              secretRef: 'bridge-supabase-service-role-key'
            }
            {
              name: 'ENTRA_TENANT_ID'
              value: entraTenantId
            }
            {
              name: 'ENTRA_AUDIENCE'
              value: entraAudience
            }
            {
              name: 'ENTRA_ISSUER'
              value: entraIssuer
            }
            {
              name: 'ENTRA_JWKS_URI'
              value: entraJwksUri
            }
          ]
          resources: {
            cpu: environment == 'prod' ? json('1.0') : json('0.5')
            memory: environment == 'prod' ? '2Gi' : '1Gi'
          }
        }
      ]
      scale: {
        minReplicas: apiMinReplicas
        maxReplicas: apiMaxReplicas
      }
    }
  }
}

resource workerApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: workerAppName
  location: location
  tags: tags
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    managedEnvironmentId: managedEnvironment.id
    configuration: {
      activeRevisionsMode: 'Single'
      secrets: [
        {
          name: 'postgres-admin-password'
          value: postgresqlAdminPassword
        }
        {
          name: 'bridge-supabase-service-role-key'
          value: bridgeSupabaseServiceRoleKey
        }
      ]
    }
    template: {
      containers: [
        {
          name: 'worker'
          image: workerImage
          env: [
            {
              name: 'APP_NAME'
              value: '${appName}-worker'
            }
            {
              name: 'NODE_ENV'
              value: environment == 'prod' ? 'production' : 'development'
            }
            {
              name: 'APPINSIGHTS_CONNECTION_STRING'
              value: appInsightsConnectionString
            }
            {
              name: 'SERVICE_BUS_NAMESPACE'
              value: serviceBusNamespace
            }
            {
              name: 'POSTGRES_HOST'
              value: postgresqlHost
            }
            {
              name: 'POSTGRES_DB'
              value: postgresqlDatabaseName
            }
            {
              name: 'POSTGRES_USER'
              value: postgresqlAdminLogin
            }
            {
              name: 'POSTGRES_PASSWORD'
              secretRef: 'postgres-admin-password'
            }
            {
              name: 'SUPABASE_SERVICE_ROLE_KEY'
              secretRef: 'bridge-supabase-service-role-key'
            }
          ]
          resources: {
            cpu: environment == 'prod' ? json('0.5') : json('0.25')
            memory: '0.5Gi'
          }
        }
      ]
      scale: {
        minReplicas: workerMinReplicas
        maxReplicas: workerMaxReplicas
      }
    }
  }
}

output containerAppsEnvironmentName string = managedEnvironment.name
output apiContainerAppName string = apiApp.name
output workerContainerAppName string = workerApp.name
output apiIngressFqdn string = apiApp.properties.configuration.ingress.fqdn
