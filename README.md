# 🚀 VectorSlope Dashboard - Blue Neon Theme

Dashboard completo para análise de forex com tema azul neon/cyan futurista.

## 📦 Instalação

```bash
# Instalar dependências
npm install

# ou com yarn
yarn install
```

## 🎨 Estrutura de Arquivos

```
src/
├── Dashboard.jsx                 # Componente principal
└── components/
    ├── TopStatsCards.jsx         # Cards de estatísticas (topo)
    ├── CurrencyStrengthMeter.jsx # Medidor de força das moedas
    ├── SuggestedCurrency.jsx     # Moeda sugerida (JPY)
    ├── TopCurrencies.jsx         # Top 3 moedas (gráfico pizza)
    ├── UploadPanel.jsx           # Painel de upload
    ├── SimilarPatterns.jsx       # Padrões similares
    └── HistoricalChoices.jsx     # Histórico de escolhas
```

## 🎯 Características

### Layout
- **Grid 3 colunas** responsivo
- **Cards semi-transparentes** com backdrop blur
- **Efeitos neon** em cyan (#22d3ee)
- **Transições suaves** em hover

### Componentes

#### 1. Currency Strength Meter (Esquerda - Topo)
- Barras horizontais com gradientes
- Valores de -1.0 a +1.0
- 8 moedas principais (GBP, NZD, EUR, AUD, CAD, CHF, USD, JPY)

#### 2. Top Stats Cards (Centro - Topo)
- 3 cards: Padrões Detectados (23), Confiança (78%), Acertos (89%)
- Ícones com efeitos hover
- Bordas com glow cyan

#### 3. Moeda Sugerida (Centro - Meio)
- JPY destacado
- Círculo de progresso 87%
- Badge de "FRAQUEZA"
- Lista de 7 pares sugeridos (AUDJPY, CADJPY, etc.)
- Botões BUY em verde

#### 4. Top 3 Moedas (Esquerda - Baixo)
- Gráfico de pizza (donut)
- JPY 38%, GBP 18%, NZD 16%, OTHERS 28%
- Centro mostra "927 dias"

#### 5. Upload Panel (Direita - Topo)
- 3 cards de arquivos com emojis
- Área de drag & drop
- Efeitos hover

#### 6. Padrões Similares (Direita - Baixo)
- Card mostrando "23 matches"
- Ícone de database

#### 7. Historical Choices (Centro - Baixo)
- Tabela com histórico de trades
- Colunas: Data, Par, Tipo, Entrada, Saída, Result, Status
- Status colorido (PROFIT verde, LOSS vermelho)

## 🎨 Paleta de Cores

```css
Background: gradient from-slate-950 via-blue-950 to-slate-900
Primária: Cyan (#22d3ee)
Secundária: Blue (#3b82f6)
Cards: slate-900/60 com backdrop-blur
Bordas: cyan-500/20 (hover: /40)
Texto: white, slate-400, slate-300
Success: green-400
Error: red-400
Warning: orange-400
```

## 🔧 Como Usar

### 1. Importar o Dashboard principal

```jsx
import Dashboard from './Dashboard';

function App() {
  return <Dashboard />;
}
```

### 2. Customizar dados (opcional)

Cada componente tem seus dados mockados. Para conectar com API real, modifique os arrays de dados dentro de cada componente:

**Exemplo - CurrencyStrengthMeter.jsx:**
```jsx
const currencies = [
  { code: 'GB', name: 'GBP', value: 0.68 },
  // ... seus dados da API
];
```

**Exemplo - HistoricalChoices.jsx:**
```jsx
const history = [
  { 
    date: '2026-02-04', 
    pair: 'USDJPY', 
    type: 'SELL', 
    entry: 150.25, 
    exit: 149.80, 
    result: '+45', 
    status: 'PROFIT' 
  },
  // ... seus dados da API
];
```

## 📱 Responsividade

O layout usa `grid-cols-3` do Tailwind. Para tornar responsivo, adicione:

```jsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
```

## 🎯 Próximos Passos

1. Conectar com API real de dados forex
2. Adicionar gráficos interativos (recharts/chart.js)
3. Implementar filtros por data/moeda
4. Adicionar animações de loading
5. Criar sistema de notificações
6. Implementar dark/light mode toggle

## 🛠️ Tecnologias

- React 18
- Tailwind CSS 3.4
- Lucide React (ícones)

## 📄 Licença

MIT

---

Criado com 💙 para VectorSlope
