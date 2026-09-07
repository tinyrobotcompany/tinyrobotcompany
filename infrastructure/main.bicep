// ---------------------------------------------------------------------------
// Tiny Robot Company — subscription-scope entry point.
//
// Owns everything below:
//   • Resource group
//   • Static Web App (Free tier)
//
// The User-Assigned Managed Identity that this pipeline authenticates as
// lives in the Portal (see infrastructure/README.md). It has to — a pipeline
// can't create the identity it uses to run.
// ---------------------------------------------------------------------------

targetScope = 'subscription'

@description('Azure region for all resources.')
@allowed([
  'westeurope'
  'northeurope'
  'eastus2'
  'centralus'
  'westus2'
  'eastasia'
])
param location string = 'westeurope'

@description('Resource group name.')
param resourceGroupName string = 'rg-tinyrobotcompany'

@description('Static Web App resource name.')
param staticWebAppName string = 'swa-tinyrobotcompany'

@description('Tags applied to every resource.')
param tags object = {
  project:     'tinyrobotcompany'
  environment: 'prod'
  managedBy:   'bicep'
  costOwner:   'simonholmes'
}

// ---------------------------------------------------------------------------
// Resource group — declared here so Bicep is the owner of record going
// forward. Idempotent: if the group already exists (which it will after the
// Portal bootstrap, since the UAMI has to live somewhere), Bicep just
// verifies state.
// ---------------------------------------------------------------------------
resource rg 'Microsoft.Resources/resourceGroups@2024-11-01' = {
  name: resourceGroupName
  location: location
  tags: tags
}

// ---------------------------------------------------------------------------
// Static Web App
// ---------------------------------------------------------------------------
module staticWebApp 'modules/static-web-app.bicep' = {
  name: 'deploy-static-web-app'
  scope: rg
  params: {
    name:     staticWebAppName
    location: location
    tags:     tags
  }
}

output resourceGroupName      string = rg.name
output staticWebAppName       string = staticWebApp.outputs.name
output staticWebAppHostname   string = staticWebApp.outputs.defaultHostname
output staticWebAppResourceId string = staticWebApp.outputs.resourceId
