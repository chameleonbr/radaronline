// ---------------------------------------------------------------------------
// poc.bicepparam
// Parametros para deploy de POC com conta estudante Azure
//
// COMO USAR:
//   az deployment group create \
//     --resource-group rg-radar-poc \
//     --template-file main-poc.bicep \
//     --parameters poc.bicepparam \
//     --parameters postgresqlAdminPassword="SuaSenhaForte123!"
//
// NOTA: postgresqlAdminPassword NAO fica aqui por seguranca.
//       Passe como --parameters na linha de comando ou via Key Vault reference.
// ---------------------------------------------------------------------------

using '../main-poc.bicep'

param environment = 'poc'
param appName = 'radar'

// brazilsouth tem disponibilidade de todos os servicos necessarios
// eastus2 e alternativa caso algum servico nao esteja disponivel em BR
param location = 'brazilsouth'

param tags = {
  environment: 'poc'
  owner: 'radar-team'
  purpose: 'demonstracao-governo'
  managedBy: 'bicep'
}

param postgresqlAdminLogin = 'radaradmin'
param postgresqlAdminPassword = readEnvironmentVariable('POSTGRESQL_ADMIN_PASSWORD')
param postgresqlDatabaseName = 'radar'

// Imagens publicas de hello-world enquanto a API propria nao esta pronta
// Troque pelo seu registry quando tiver a imagem publicada
param apiImage = 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest'
param workerImage = 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest'

// Se ainda estiver usando Supabase como bridge, preencha abaixo
// Se nao, deixe vazios
param bridgeSupabaseUrl = ''
