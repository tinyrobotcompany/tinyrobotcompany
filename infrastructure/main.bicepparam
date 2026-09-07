using './main.bicep'

param location           = 'westeurope'
param resourceGroupName  = 'rg-tinyrobotcompany'
param staticWebAppName   = 'swa-tinyrobotcompany'

param tags = {
  project:     'tinyrobotcompany'
  environment: 'prod'
  managedBy:   'bicep'
  costOwner:   'simonholmes'
}
