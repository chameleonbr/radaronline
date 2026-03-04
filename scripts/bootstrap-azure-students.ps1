param(
  [string]$SubscriptionId = '10407553-696d-4996-9d23-9b13da3ea4df',
  [string]$ResourceGroupName = 'rg-radar-students-hml',
  [string]$Location = 'brazilsouth'
)

$ErrorActionPreference = 'Stop'

function Assert-Command($name) {
  if (-not (Get-Command $name -ErrorAction SilentlyContinue)) {
    throw "Comando ausente: $name"
  }
}

Write-Host 'Validando Azure CLI...'
Assert-Command az

Write-Host 'Definindo subscription...'
az account set --subscription $SubscriptionId | Out-Null

Write-Host 'Validando Bicep no Azure CLI...'
az bicep install | Out-Null
az bicep build --file '.\infra\bicep\main.bicep' | Out-Null

Write-Host "Garantindo resource group $ResourceGroupName..."
$exists = az group exists --name $ResourceGroupName
if ($exists -eq 'false') {
  az group create `
    --name $ResourceGroupName `
    --location $Location `
    --tags environment=hml owner=clevio managedBy=azcli workload=radar | Out-Null
}

Write-Host ''
Write-Host 'Bootstrap local concluido.'
Write-Host 'Proximos passos:'
Write-Host '1. Configurar secrets e variables no GitHub Actions.'
Write-Host '2. Rodar .github/workflows/deploy-infra.yml.'
Write-Host '3. Rodar .github/workflows/deploy-api.yml.'
Write-Host '4. Rodar .github/workflows/deploy-web.yml.'
