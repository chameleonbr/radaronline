using '../main.bicep'

param environment = 'prod'
param appName = 'radar'
param location = 'brazilsouth'
param tags = {
  environment: 'prod'
  owner: 'radar-team'
  managedBy: 'bicep'
}
param webOriginHost = ''
param frontDoorCustomDomainResourceIds = []
