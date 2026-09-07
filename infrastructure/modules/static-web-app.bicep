// ---------------------------------------------------------------------------
// Static Web App (Free tier).
//
// Detached from GitHub — we do not set repositoryUrl / branch here because
// the deploy is driven by the site's own GitHub Actions workflow using the
// SWA API token (see .github/workflows/deploy-site.yml). This keeps
// infrastructure and content deploys cleanly separated.
// ---------------------------------------------------------------------------

@description('Static Web App name (unique within the subscription).')
param name string

@description('Azure region. Must be a region that supports the SWA Free tier.')
param location string

@description('Tags applied to the resource.')
param tags object = {}

resource staticWebApp 'Microsoft.Web/staticSites@2024-04-01' = {
  name: name
  location: location
  tags: tags
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    // Detached deploy — no linked GitHub repo, no build orchestration here.
    provider: 'None'
    stagingEnvironmentPolicy: 'Enabled'
    allowConfigFileUpdates: true
    enterpriseGradeCdnStatus: 'Disabled'
  }
}

output name string = staticWebApp.name
output defaultHostname string = staticWebApp.properties.defaultHostname
output resourceId string = staticWebApp.id
