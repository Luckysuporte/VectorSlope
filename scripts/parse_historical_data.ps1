# Script para parsear dados historicos do MFC e exportar para CSV
# Arquivo de entrada esta em UTF-16

$inputFile = "Backtest_Relatorio_Diario_Completo.txt"
$outputFile = "database\historico_parsed.csv"

Write-Host "Lendo arquivo de dados historicos..."
$content = Get-Content -Path $inputFile -Encoding Unicode -Raw

# Regex para encontrar cada dia com seus resultados
$dayPattern = "DIA: (\d{4}\.\d{2}\.\d{2})"
$resultPattern = "Moeda: (\w+) \| Melhor configura.+?: (For.a|Fraqueza)\s+\| Pontos: (\d+)"

# Encontrar todas as datas
$days = [regex]::Matches($content, $dayPattern)
Write-Host "Encontrados $($days.Count) dias de dados"

# Array para armazenar resultados
$results = @()

foreach ($dayMatch in $days) {
    $date = $dayMatch.Groups[1].Value
    $dateFormatted = $date -replace '\.', '-'
    
    # Encontrar a posicao do dia no conteudo
    $startIndex = $dayMatch.Index
    
    # Encontrar a proxima ocorrencia de "ETAPA 2" apos este dia
    $etapa2Index = $content.IndexOf("ETAPA 2:", $startIndex)
    if ($etapa2Index -lt 0) { continue }
    
    # Encontrar o proximo dia ou fim do arquivo
    $nextDayMatch = $days | Where-Object { $_.Index -gt $startIndex } | Select-Object -First 1
    $endIndex = if ($nextDayMatch) { $nextDayMatch.Index } else { $content.Length }
    
    # Extrair a secao de resultados
    $section = $content.Substring($etapa2Index, [Math]::Min(2000, $endIndex - $etapa2Index))
    
    # Encontrar todas as moedas com seus resultados
    $moedaMatches = [regex]::Matches($section, $resultPattern)
    
    # Encontrar a moeda com mais pontos
    $bestMoeda = $null
    $bestPontos = 0
    $bestConfig = ""
    
    foreach ($m in $moedaMatches) {
        $moeda = $m.Groups[1].Value
        $config = $m.Groups[2].Value
        $pontos = [int]$m.Groups[3].Value
        
        if ($pontos -gt $bestPontos) {
            $bestPontos = $pontos
            $bestMoeda = $moeda
            $bestConfig = $config
        }
    }
    
    if ($bestMoeda) {
        $results += [PSCustomObject]@{
            Data         = $dateFormatted
            Moeda        = $bestMoeda
            Configuracao = $bestConfig
            Pontos       = $bestPontos
        }
    }
}

Write-Host "Exportando $($results.Count) registros para CSV..."
$results | Export-Csv -Path $outputFile -NoTypeInformation -Encoding UTF8

Write-Host "Concluido! Arquivo salvo em: $outputFile"

# Mostrar alguns exemplos
Write-Host ""
Write-Host "Primeiros 10 registros:"
$results | Select-Object -First 10 | Format-Table

Write-Host ""
Write-Host "Ultimos 10 registros:"
$results | Select-Object -Last 10 | Format-Table
