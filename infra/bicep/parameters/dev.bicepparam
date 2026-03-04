using '../main.bicep'

param environment = 'dev'
param appName = 'radar'
param location = 'brazilsouth'
param tags = {
  environment: 'dev'
  owner: 'radar-team'
  managedBy: 'bicep'
}
param webOriginHost = ''
param frontDoorCustomDomainResourceIds = []
