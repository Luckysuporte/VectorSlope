# Script para analisar dados MFC
$arquivo = "dados_mfc.txt"

$linhas = Select-String -Path $arquivo -Pattern "Moeda:.+Pontos:" | ForEach-Object { $_.Line }

$stats = @{}
foreach ($m in @("USD", "EUR", "GBP", "CHF", "JPY", "AUD", "CAD", "NZD")) {
    $stats[$m] = @{ "Forca" = 0; "Fraqueza" = 0; "PontosForca" = 0; "PontosFraqueza" = 0; "MaiorPontos" = 0 }
}

$vezesGanhou = @{}
foreach ($m in @("USD", "EUR", "GBP", "CHF", "JPY", "AUD", "CAD", "NZD")) {
    $vezesGanhou[$m] = 0
}

$totalDias = 0

for ($i = 0; $i -lt $linhas.Count; $i += 8) {
    $totalDias++
    $maiorPontosDia = 0
    $moedaVencedora = ""
    
    for ($j = 0; $j -lt 8; $j++) {
        if ($i + $j -ge $linhas.Count) { break }
        
        $linha = $linhas[$i + $j]
        
        if ($linha -match "Moeda: (\w+) \| Melhor configura.+: (For.a|Fraqueza)\s+\| Pontos: (\d+)") {
            $moeda = $matches[1]
            $config = $matches[2]
            $pontos = [int]$matches[3]
            
            if ($config -match "For") {
                $stats[$moeda]["Forca"]++
                $stats[$moeda]["PontosForca"] += $pontos
            } else {
                $stats[$moeda]["Fraqueza"]++
                $stats[$moeda]["PontosFraqueza"] += $pontos
            }
            
            if ($pontos -gt $stats[$moeda]["MaiorPontos"]) {
                $stats[$moeda]["MaiorPontos"] = $pontos
            }
            
            if ($pontos -gt $maiorPontosDia) {
                $maiorPontosDia = $pontos
                $moedaVencedora = $moeda
            }
        }
    }
    
    if ($moedaVencedora -ne "") {
        $vezesGanhou[$moedaVencedora]++
    }
}

Write-Host ""
Write-Host "================================================================================"
Write-Host "                    ANALISE COMPLETA MFC - $totalDias DIAS"
Write-Host "================================================================================"
Write-Host ""

Write-Host "VEZES QUE CADA MOEDA FOI A MELHOR DO DIA:"
Write-Host "--------------------------------------------------"
$sorted = $vezesGanhou.GetEnumerator() | Sort-Object -Property Value -Descending
foreach ($item in $sorted) {
    $pct = [math]::Round(($item.Value / $totalDias) * 100, 1)
    Write-Host "$($item.Key) : $($item.Value) vezes ($pct por cento)"
}

Write-Host ""
Write-Host "ESTATISTICAS POR MOEDA:"
Write-Host "--------------------------------------------------"

foreach ($moeda in @("USD", "EUR", "GBP", "CHF", "JPY", "AUD", "CAD", "NZD")) {
    $forca = $stats[$moeda]["Forca"]
    $fraqueza = $stats[$moeda]["Fraqueza"]
    $total = $forca + $fraqueza
    $pctForca = if ($total -gt 0) { [math]::Round(($forca / $total) * 100, 1) } else { 0 }
    $pctFraqueza = if ($total -gt 0) { [math]::Round(($fraqueza / $total) * 100, 1) } else { 0 }
    $mediaForca = if ($forca -gt 0) { [math]::Round($stats[$moeda]["PontosForca"] / $forca, 0) } else { 0 }
    $mediaFraqueza = if ($fraqueza -gt 0) { [math]::Round($stats[$moeda]["PontosFraqueza"] / $fraqueza, 0) } else { 0 }
    
    Write-Host ""
    Write-Host "$moeda :"
    Write-Host "  Forca:    $forca vezes ($pctForca por cento) - Media: $mediaForca pts"
    Write-Host "  Fraqueza: $fraqueza vezes ($pctFraqueza por cento) - Media: $mediaFraqueza pts"
    Write-Host "  Maior pontuacao: $($stats[$moeda]['MaiorPontos']) pts"
}

Write-Host ""
Write-Host "================================================================================"
