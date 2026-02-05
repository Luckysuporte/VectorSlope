# Referência MFC - Currency Strength Meter

## Conceitos Principais

### Força vs Fraqueza
- **Linha ACIMA do canal** = Moeda **FORTE** (crescimento)
- **Linha ABAIXO do canal** = Moeda **FRACA** (queda)
- **Linha DENTRO do canal** = Movimento sem direção clara

### Valores de Slope
- **Slope POSITIVO (+)** = Moeda em tendência de alta
- **Slope NEGATIVO (-)** = Moeda em tendência de baixa
- Quanto MAIOR o valor absoluto, mais FORTE o movimento

### Sinais de Trading
1. **Comprar** par quando: Moeda BASE forte + Moeda COTADA fraca
2. **Vender** par quando: Moeda BASE fraca + Moeda COTADA forte

### Timeframes Utilizados
| Código | Nome |
|--------|------|
| MN1 | Mensal |
| W1 | Semanal |
| D1 | Diário |
| H4 | 4 horas |
| H1 | 1 hora |

### Moedas Analisadas
USD, EUR, GBP, CHF, JPY, AUD, CAD, NZD

## Lógica de Previsão

1. Analisar slopes em TODOS os 5 timeframes
2. Identificar moeda com maior slope positivo consistente = **FORÇA**
3. Identificar moeda com maior slope negativo consistente = **FRAQUEZA**
4. Comparar padrão atual com histórico para validar previsão
5. Sugerir pares para BUY/SELL baseado na combinação força/fraqueza

## Fonte
[LiteFinance - Currency Strength Meter](https://www.litefinance.org/pt/blog/for-beginners/melhores-indicadores-para-forex/indicator-de-forca-de-moedas/)
