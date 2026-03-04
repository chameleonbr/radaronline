using '../main.bicep'

param environment = 'hml'
param appName = 'radar'
param location = 'brazilsouth'
param tags = {
  environment: 'hml'
  owner: 'radar-team'
  managedBy: 'bicep'
}
param webOriginHost = ''
param frontDoorCustomDomainResourceIds = []
