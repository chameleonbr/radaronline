param appName string
param environment string
param location string
param tags object
param publisherName string
param publisherEmail string
param apiManagementSkuName string = environment == 'prod' ? 'Standard' : 'Developer'

var suffix = toLower('${appName}-${environment}')
var apiManagementName = take('apim-${suffix}', 50)

resource apiManagement 'Microsoft.ApiManagement/service@2022-08-01' = {
  name: apiManagementName
  location: location
  tags: tags
  sku: {
    name: apiManagementSkuName
    capacity: 1
  }
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    publisherEmail: publisherEmail
    publisherName: publisherName
    publicNetworkAccess: 'Enabled'
    virtualNetworkType: 'None'
  }
}

output apiManagementName string = apiManagement.name
output apiManagementGatewayUrl string = 'https://${apiManagement.name}.azure-api.net'
