param appName string
param environment string
param tags object
param apiOriginHost string
param webOriginHost string = ''
param frontDoorSkuName string = 'Premium_AzureFrontDoor'
param frontDoorCustomDomainResourceIds array = []

var suffix = toLower('${appName}-${environment}')
var frontDoorProfileName = take('fd-${suffix}', 50)
var frontDoorEndpointName = take('ep-${suffix}', 50)
var apiOriginGroupName = 'api-origin-group'
var apiOriginName = 'api-origin'
var webOriginGroupName = 'web-origin-group'
var webOriginName = 'web-origin'
var frontDoorWafPolicyName = take('fdwaf-${suffix}', 128)
var frontDoorSecurityPolicyName = 'waf-default'

resource frontDoorProfile 'Microsoft.Cdn/profiles@2021-06-01' = {
  name: frontDoorProfileName
  location: 'global'
  tags: tags
  sku: {
    name: frontDoorSkuName
  }
  properties: {
    originResponseTimeoutSeconds: 120
  }
}

resource frontDoorEndpoint 'Microsoft.Cdn/profiles/afdEndpoints@2021-06-01' = {
  parent: frontDoorProfile
  name: frontDoorEndpointName
  location: 'global'
  tags: tags
  properties: {
    enabledState: 'Enabled'
  }
}

resource apiOriginGroup 'Microsoft.Cdn/profiles/originGroups@2021-06-01' = {
  parent: frontDoorProfile
  name: apiOriginGroupName
  properties: {
    healthProbeSettings: {
      probeIntervalInSeconds: 120
      probePath: '/health'
      probeProtocol: 'Https'
      probeRequestType: 'GET'
    }
    loadBalancingSettings: {
      additionalLatencyInMilliseconds: 0
      sampleSize: 4
      successfulSamplesRequired: 3
    }
    sessionAffinityState: 'Disabled'
    trafficRestorationTimeToHealedOrNewEndpointsInMinutes: 10
  }
}

resource apiOrigin 'Microsoft.Cdn/profiles/originGroups/origins@2021-06-01' = {
  parent: apiOriginGroup
  name: apiOriginName
  properties: {
    enabledState: 'Enabled'
    enforceCertificateNameCheck: true
    hostName: apiOriginHost
    httpPort: 80
    httpsPort: 443
    originHostHeader: apiOriginHost
    priority: 1
    weight: 1000
  }
}

resource apiRoute 'Microsoft.Cdn/profiles/afdEndpoints/routes@2021-06-01' = {
  parent: frontDoorEndpoint
  name: 'api-route'
  properties: {
    enabledState: 'Enabled'
    forwardingProtocol: 'HttpsOnly'
    httpsRedirect: 'Enabled'
    linkToDefaultDomain: 'Enabled'
    originGroup: {
      id: apiOriginGroup.id
    }
    patternsToMatch: [
      '/v1/*'
      '/health'
      '/ready'
      '/docs/*'
      '/openapi/*'
    ]
    supportedProtocols: [
      'Http'
      'Https'
    ]
  }
}

resource webOriginGroup 'Microsoft.Cdn/profiles/originGroups@2021-06-01' = if (!empty(webOriginHost)) {
  parent: frontDoorProfile
  name: webOriginGroupName
  properties: {
    healthProbeSettings: {
      probeIntervalInSeconds: 120
      probePath: '/'
      probeProtocol: 'Https'
      probeRequestType: 'HEAD'
    }
    loadBalancingSettings: {
      additionalLatencyInMilliseconds: 0
      sampleSize: 4
      successfulSamplesRequired: 3
    }
    sessionAffinityState: 'Disabled'
    trafficRestorationTimeToHealedOrNewEndpointsInMinutes: 10
  }
}

resource webOrigin 'Microsoft.Cdn/profiles/originGroups/origins@2021-06-01' = if (!empty(webOriginHost)) {
  parent: webOriginGroup
  name: webOriginName
  properties: {
    enabledState: 'Enabled'
    enforceCertificateNameCheck: true
    hostName: webOriginHost
    httpPort: 80
    httpsPort: 443
    originHostHeader: webOriginHost
    priority: 1
    weight: 1000
  }
}

resource webRoute 'Microsoft.Cdn/profiles/afdEndpoints/routes@2021-06-01' = if (!empty(webOriginHost)) {
  parent: frontDoorEndpoint
  name: 'web-route'
  properties: {
    enabledState: 'Enabled'
    forwardingProtocol: 'HttpsOnly'
    httpsRedirect: 'Enabled'
    linkToDefaultDomain: 'Enabled'
    originGroup: {
      id: webOriginGroup.id
    }
    patternsToMatch: [
      '/*'
    ]
    supportedProtocols: [
      'Http'
      'Https'
    ]
  }
}

resource frontDoorWafPolicy 'Microsoft.Network/FrontDoorWebApplicationFirewallPolicies@2021-06-01' = {
  name: frontDoorWafPolicyName
  location: 'global'
  tags: tags
  properties: {
    managedRules: {
      managedRuleSets: [
        {
          ruleSetAction: 'Block'
          ruleSetType: 'DefaultRuleSet'
          ruleSetVersion: '2.1'
        }
      ]
    }
    policySettings: {
      customBlockResponseStatusCode: 403
      enabledState: 'Enabled'
      mode: environment == 'prod' ? 'Prevention' : 'Detection'
      requestBodyCheck: 'Enabled'
    }
  }
  sku: {
    name: frontDoorSkuName
  }
}

resource frontDoorSecurityPolicy 'Microsoft.Cdn/profiles/securityPolicies@2021-06-01' = if (!empty(frontDoorCustomDomainResourceIds)) {
  parent: frontDoorProfile
  name: frontDoorSecurityPolicyName
  properties: {
    parameters: {
      associations: [
        {
          domains: [for id in frontDoorCustomDomainResourceIds: {
            id: id
          }]
          patternsToMatch: [
            '/*'
          ]
        }
      ]
      type: 'WebApplicationFirewall'
      wafPolicy: {
        id: frontDoorWafPolicy.id
      }
    }
  }
}

output frontDoorProfileName string = frontDoorProfile.name
output frontDoorEndpointName string = frontDoorEndpoint.name
output frontDoorEndpointHostName string = frontDoorEndpoint.properties.hostName
output frontDoorWafPolicyName string = frontDoorWafPolicy.name
