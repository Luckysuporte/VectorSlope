# Script para gerar SQL de INSERT para os dados do CSV

$csvFile = "database\historico_parsed.csv"
$sqlFile = "database\insert_historico.sql"

Write-Host "Lendo CSV..."
$data = Import-Csv -Path $csvFile -Encoding UTF8

Write-Host "Gerando SQL para $($data.Count) registros..."

$sqlLines = @()
$sqlLines += "-- Inserir dados historicos do backtest"
$sqlLines += "INSERT INTO historico_resultados (data, moeda, configuracao, pontos) VALUES"

$values = @()
foreach ($row in $data) {
    $date = $row.Data
    $moeda = $row.Moeda
    # Corrigir encoding de "Força"
    $config = $row.Configuracao -replace 'For.a', 'Força'
    $pontos = $row.Pontos
    
    $values += "('$date', '$moeda', '$config', $pontos)"
}

$sqlLines += ($values -join ",`n")
$sqlLines += "ON CONFLICT (data) DO UPDATE SET"
$sqlLines += "  moeda = EXCLUDED.moeda,"
$sqlLines += "  configuracao = EXCLUDED.configuracao,"
$sqlLines += "  pontos = EXCLUDED.pontos;"

$sqlContent = $sqlLines -join "`n"

Write-Host "Salvando SQL em $sqlFile..."
Set-Content -Path $sqlFile -Value $sqlContent -Encoding UTF8

Write-Host "Pronto! Arquivo SQL gerado com $($data.Count) registros."
