param appName string
param environment string
param location string
param tags object
param postgresqlAdminLogin string
@secure()
param postgresqlAdminPassword string
param postgresqlDatabaseName string = 'radar'
param postgresqlVersion string = '16'
param postgresqlSkuName string = environment == 'prod' ? 'Standard_D2ds_v4' : 'Standard_B1ms'
param postgresqlSkuTier string = environment == 'prod' ? 'GeneralPurpose' : 'Burstable'
param postgresqlStorageSizeGb int = environment == 'prod' ? 128 : 32
param serviceBusQueueNames array = [
  'notifications'
  'audit'
  'jobs'
]

var suffix = toLower('${appName}-${environment}')
var postgresServerName = take('psql-${suffix}', 63)
var serviceBusNamespaceName = take('sb-${suffix}', 50)

resource postgresqlServer 'Microsoft.DBforPostgreSQL/flexibleServers@2023-06-01-preview' = {
  name: postgresServerName
  location: location
  tags: tags
  sku: {
    name: postgresqlSkuName
    tier: postgresqlSkuTier
  }
  properties: {
    administratorLogin: postgresqlAdminLogin
    administratorLoginPassword: postgresqlAdminPassword
    version: postgresqlVersion
    storage: {
      storageSizeGB: postgresqlStorageSizeGb
    }
    backup: {
      backupRetentionDays: environment == 'prod' ? 14 : 7
      geoRedundantBackup: environment == 'prod' ? 'Enabled' : 'Disabled'
    }
    network: {
      publicNetworkAccess: 'Enabled'
    }
    createMode: 'Default'
  }
}

resource postgresqlDatabase 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2023-06-01-preview' = {
  name: postgresqlDatabaseName
  parent: postgresqlServer
  properties: {}
}

resource serviceBusNamespace 'Microsoft.ServiceBus/namespaces@2024-01-01' = {
  name: serviceBusNamespaceName
  location: location
  tags: tags
  sku: {
    name: environment == 'prod' ? 'Standard' : 'Basic'
    tier: environment == 'prod' ? 'Standard' : 'Basic'
  }
  properties: {
    publicNetworkAccess: 'Enabled'
  }
}

resource serviceBusQueues 'Microsoft.ServiceBus/namespaces/queues@2024-01-01' = [for queueName in serviceBusQueueNames: {
  name: queueName
  parent: serviceBusNamespace
  properties: {
    maxDeliveryCount: 10
    deadLetteringOnMessageExpiration: true
    lockDuration: 'PT1M'
    defaultMessageTimeToLive: 'P14D'
  }
}]

output postgresqlServerName string = postgresqlServer.name
output postgresqlHost string = postgresqlServer.properties.fullyQualifiedDomainName
output postgresqlDatabaseName string = postgresqlDatabase.name
output serviceBusNamespaceName string = serviceBusNamespace.name
output serviceBusNamespaceId string = serviceBusNamespace.id
