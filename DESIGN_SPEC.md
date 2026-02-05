# 🎨 DESIGN SPEC - VectorSlope Dashboard (Blue Neon Theme)

## 📐 LAYOUT GERAL

### Grid Structure
- **3 colunas** de largura igual
- Gap entre colunas: 24px (gap-6)
- Padding externo: 24px
- Max-width: 1280px (max-w-7xl) centralizado

```
┌─────────────────────────────────────────────────────────────┐
│                         HEADER                              │
└─────────────────────────────────────────────────────────────┘
┌──────────────┬──────────────┬──────────────┐
│   COLUNA 1   │   COLUNA 2   │   COLUNA 3   │
│              │              │              │
│ Currency     │ Top Stats    │ Upload       │
│ Strength     │ (3 cards)    │ Panel        │
│ Meter        │              │              │
│              ├──────────────┤              │
│              │ Moeda        │              │
│              │ Sugerida     │              │
├──────────────┤ (JPY 87%)    ├──────────────┤
│ Top 3        │              │ Padrões      │
│ Moedas       ├──────────────┤ Similares    │
│ (Pizza)      │ Historical   │ (23 matches) │
│              │ Choices      │              │
└──────────────┴──────────────┴──────────────┘
```

---

## 🎨 PALETA DE CORES

### Background
- **Gradiente principal**: linear-gradient(135deg, #020617 0%, #172554 50%, #020617 100%)
- Cores: from-slate-950 → via-blue-950 → to-slate-900

### Elementos Primários
- **Cyan Neon**: #22d3ee (rgb(34, 211, 238))
- **Cyan Escuro**: #06b6d4
- **Blue Neon**: #3b82f6

### Cards
- Background: rgba(15, 23, 42, 0.6) - slate-900 com 60% opacidade
- Backdrop blur: 8px (backdrop-blur-sm)
- Borda: rgba(34, 211, 238, 0.2) - cyan-500 com 20% opacidade
- Borda Hover: rgba(34, 211, 238, 0.4) - cyan-500 com 40% opacidade
- Border radius: 16px (rounded-2xl)

### Texto
- **Títulos**: #ffffff (white)
- **Subtítulos**: #94a3b8 (slate-400)
- **Texto secundário**: #cbd5e1 (slate-300)

### Status Colors
- **Success/Profit**: #4ade80 (green-400)
- **Error/Loss**: #f87171 (red-400)
- **Warning**: #fb923c (orange-400)
- **Info**: #22d3ee (cyan-400)

### Efeitos de Glow
- Shadow Cyan: 0 0 10px rgba(34, 211, 238, 0.5)
- Shadow Cyan Large: 0 0 20px rgba(34, 211, 238, 0.6)
- Drop shadow: drop-shadow(0 0 8px rgba(34, 211, 238, 0.6))

---

## 📦 COMPONENTES DETALHADOS

### 1. TOP STATS CARDS (3 cards horizontais)

**Estrutura**: Grid de 3 colunas com gap de 16px

#### Card 1 - Padrões Detectados
```
┌─────────────┐
│   🗄️ Icon   │  ← Database icon (cyan)
│             │
│  Padrões    │  ← Label (slate-400, 12px)
│ Detectados  │
│             │
│     23      │  ← Value (cyan-400, 18px bold)
└─────────────┘
```
- Icon: Database (Lucide), 24px
- Background: slate-900/60 com backdrop-blur
- Border: cyan-500/20
- Hover: border cyan-500/40
- Padding: 16px

#### Card 2 - Confiança
```
┌─────────────┐
│  ╭─────╮    │  ← Circular progress ring
│  │ 78% │    │  ← Percentage inside (cyan-400)
│  ╰─────╯    │
│             │
│ Confiança   │  ← Label (slate-400, 12px)
└─────────────┘
```
- Circle: 48px diameter
- Border: 4px, cyan-500/30
- Font: 18px bold

#### Card 3 - Acertos
```
┌─────────────┐
│   ✓ Icon    │  ← CheckCircle icon (cyan)
│             │
│   Acertos   │  ← Label (slate-400, 12px)
│             │
│     89%     │  ← Value (cyan-400, 18px bold)
└─────────────┘
```

---

### 2. CURRENCY STRENGTH METER

**Card principal**: slate-900/60, border cyan-500/20, rounded-2xl, padding 24px

#### Header
```
CURRENCY STRENGTH METER          MNT W1 D1 H4 📊
(white, 18px bold)               (cyan-400, pill badge)
```

#### Barras (8 moedas)
```
GB  GBP  ▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░  +0.68
NZ  NZD  ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░  +0.51
EU  EUR  ▓▓▓▓▓▓▓▓░░░░░░░░░░░░  +0.45
AU  AUD  ▓▓▓▓▓░░░░░░░░░░░░░░░  +0.32
CA  CAD  ▓▓░░░░░░░░░░░░░░░░░░  +0.15
CH  CHF  ░░░░░░░░░░░░░░░░▓░░░  -0.05
US  USD  ░░░░░░░░░░░░░░▓▓░░░░  -0.12
JP  JPY  ░░░░░░░░▓▓▓▓▓▓▓▓▓▓▓▓  -0.77
```

**Especificações das barras:**
- Altura: 8px
- Background: slate-800/50
- Border radius: full (rounded-full)
- Linha central: 1px, slate-600 (50% da largura)
- Gradiente positivo: from-red-500 via-cyan-400 to-green-400
- Gradiente negativo: from-red-500 to-orange-400
- Glow: shadow-lg shadow-cyan-500/50

**Layout de cada linha:**
- Code (2 letras): slate-400, 12px, width 24px
- Name (3 letras): white, 14px semibold, width 40px
- Barra: flex-1
- Value: green-400 ou red-400, 14px bold

**Escala inferior:**
```
-1.0    -0.5     0     +0.5    +1.0
(slate-500, 12px, espaçamento igual)
```

---

### 3. MOEDA SUGERIDA

#### Header
```
MOEDA SUGERIDA                   Hoje
(white, 18px bold)               (slate-400, 12px)
```

#### Moeda destacada
```
        JPY
    (72px bold)
    
    ⚡ FRAQUEZA
   (badge vermelho)
```

**Badge specs:**
- Background: red-500/20
- Text: red-400, 14px semibold
- Border: 1px red-500/30
- Padding: 8px 16px
- Rounded: 8px

#### Círculo de confiança
```
    ╭────────╮
    │        │
    │  87%   │  ← Cyan-400, 36px bold
    │        │
    ╰────────╯
```

**SVG Circle specs:**
- Raio: 70px
- Stroke width: 8px
- Background circle: slate-800
- Progress circle: cyan-400
- Dasharray: 440 (circunferência total)
- Dashoffset: 57.2 (87% = 440 - (440 * 0.87))
- Drop shadow: 0 0 8px rgba(34, 211, 238, 0.6)
- Transform: rotate(-90deg)

#### Lista de pares
```
Pares Sugeridos (VENDA/COMPRA)
(slate-400, 12px)

● AUDJPY                        BUY
● CADJPY                        BUY
● CHFJPY                        BUY
● EURJPY                        BUY
● GBPJPY                        BUY
● NZDJPY                        BUY
● USDJPY                        BUY
```

**Cada linha:**
- Dot: 6px, cyan-400, rounded-full, glow shadow
- Pair name: white, 14px medium
- BUY badge: green-400, bg green-500/10, border green-500/30
- Padding: 8px 12px
- Hover: bg slate-800/30, border cyan-500/20

---

### 4. TOP 3 MOEDAS (Gráfico de Pizza)

**Layout:** Flexbox horizontal com gap 32px

#### Gráfico (esquerda)
```
    ╭─────────╮
    │    927  │  ← Center text (white, 24px bold)
    │   dias  │  ← Subtitle (slate-400, 12px)
    ╰─────────╯
```

**Donut chart specs:**
- Dimensões: 160x160px (w-40 h-40)
- ViewBox: 0 0 200 200
- Raio: 80px
- Stroke width: 20px
- Transform: rotate(-90deg)

**Segmentos:**
1. JPY: 38% - Laranja (#f97316)
2. GBP: 18% - Roxo (#a855f7)
3. NZD: 16% - Verde (#22c55e)
4. OTHERS: 28% - Cinza (#64748b)

**Cálculo dos segmentos:**
- Circumference = 2 * π * 80 = 502.4
- Cada % = 502.4 / 100 = 5.024 por %
- JPY: length = 190.9, offset = 0
- GBP: length = 90.4, offset = -190.9
- NZD: length = 80.4, offset = -281.3
- OTHERS: length = 140.7, offset = -361.7

#### Legenda (direita)
```
⚫ JPY     38%
⚫ GBP     18%
⚫ NZD     16%
⚫ OTHERS  28%
```

**Cada linha:**
- Dot: 12px, cor correspondente, rounded-full
- Name: white, 14px semibold
- Percentage: cyan-400, 14px bold
- Gap: 12px entre linhas

---

### 5. UPLOAD PANEL

#### Cards de arquivo (3 cards)
```
┌──────────────────────────────┐
│ 🌙  MFC Noite                │
│     Upload às 20:30        📄│
└──────────────────────────────┘
┌──────────────────────────────┐
│ ☀️  MFC Manhã                │
│     Upload às 06:30        📄│
└──────────────────────────────┘
┌──────────────────────────────┐
│ 📊  Resultado Bonoto         │
│     Portfolio do dia       📄│
└──────────────────────────────┘
```

**Card specs:**
- Background: gradient from-slate-800/50 to-slate-800/30
- Border: cyan-500/10
- Hover: border cyan-500/30, background darker
- Padding: 16px
- Rounded: 12px (rounded-xl)

**Icon box (emoji):**
- Size: 48x48px
- Background: gradient from-cyan-500 to-blue-600
- Rounded: 8px
- Shadow: 0 4px 14px rgba(6, 182, 212, 0.4)

**Textos:**
- Title: white, 14px semibold
- Subtitle: slate-400, 12px

**FileText icon (direita):**
- Size: 20px
- Color: cyan-400
- Opacity: 50% → 100% on hover

#### Área de upload
```
┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐
│                               │
│          ↑ Upload             │
│                               │
│  Arraste arquivos ou clique   │
│      para selecionar          │
│                               │
└─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘
```

**Specs:**
- Border: 2px dashed cyan-500/30
- Hover: cyan-500/50
- Padding: 32px (p-8)
- Rounded: 12px
- Icon: 32px, cyan-400, scale 110% on hover
- Text: slate-400, 14px

---

### 6. PADRÕES SIMILARES

```
┌──────────────────────────────┐
│ Padrões Similares        23  │
│                        matches│
│ Detectados na base histórica  │
│                               │
│       ┌───────────┐          │
│       │           │          │
│       │  🗄️ Icon  │          │
│       │           │          │
│       └───────────┘          │
└──────────────────────────────┘
```

**Specs:**
- Header flex: space-between
- Number "23": cyan-400, 36px bold
- "matches": slate-400, 12px
- Icon area: border cyan-500/20, bg cyan-500/5, padding 32px
- Database icon: 48px, cyan-400/50

---

### 7. HISTORICAL CHOICES

**Tabela com 7 colunas:**

```
┌────────────────────────────────────────────────────────────────┐
│ BONOTO'S HISTORICAL CHOICES               Ver todos →         │
├─────────┬────────┬──────┬─────────┬─────────┬───────┬────────┤
│ Data    │ Par    │ Tipo │ Entrada │ Saída   │Result │ Status │
├─────────┼────────┼──────┼─────────┼─────────┼───────┼────────┤
│2026-02-04│USDJPY │SELL  │ 150.25  │ 149.80  │  +45  │PROFIT  │
│2026-02-03│EURJPY │SELL  │ 160.50  │ 159.90  │  +60  │PROFIT  │
│2026-02-02│GBPJPY │SELL  │ 188.30  │ 187.85  │  +45  │PROFIT  │
│2026-02-01│AUDJPY │SELL  │  97.45  │  97.90  │  -45  │ LOSS   │
│2026-01-31│NZDJPY │SELL  │  91.20  │  90.70  │  +50  │PROFIT  │
└─────────┴────────┴──────┴─────────┴─────────┴───────┴────────┘
```

**Especificações:**

**Header:**
- Title: white, 18px bold
- "Ver todos →": cyan-400, 12px, hover cyan-300

**Table header:**
- Background: transparent
- Border bottom: 1px slate-800
- Text: slate-400, 12px medium
- Padding: 12px 8px

**Table rows:**
- Border bottom: 1px slate-800/50
- Hover: bg slate-800/30
- Padding: 12px 8px
- Font: 12px

**Colunas:**
1. Data: slate-300, left aligned
2. Par: cyan-400 semibold, left aligned
3. Tipo: 
   - Badge: bg red-500/10, text red-400, border red-500/30
   - Padding: 4px 8px, rounded
4. Entrada: slate-300, right aligned
5. Saída: slate-300, right aligned
6. Result: 
   - PROFIT: green-400 bold
   - LOSS: red-400 bold
   - Right aligned
7. Status:
   - PROFIT badge: bg green-500/20, text green-400, border green-500/30
   - LOSS badge: bg red-500/20, text red-400, border red-500/30
   - Padding: 4px 12px, rounded-full
   - Center aligned

---

## 🎭 INTERAÇÕES E ANIMAÇÕES

### Hover States
- **Cards**: border opacity 20% → 40%, duração 200ms
- **Buttons/Links**: text opacity 100% → 80%, duração 150ms
- **Upload icon**: scale 1 → 1.1, duração 200ms
- **Table rows**: bg transparent → slate-800/30, duração 150ms

### Transitions
- All: `transition-all duration-200 ease-in-out`
- Colors: `transition-colors duration-150`
- Transform: `transition-transform duration-200`

### Loading States (opcional)
- Skeleton: bg slate-800/50, animate pulse
- Shimmer effect: linear gradient moving

---

## 📱 RESPONSIVIDADE

### Breakpoints
- Mobile: < 768px → stack vertical (grid-cols-1)
- Tablet: 768-1024px → 2 colunas (grid-cols-2)
- Desktop: > 1024px → 3 colunas (grid-cols-3)

### Mobile adaptations
- Font sizes: reduzir 2px
- Padding: reduzir para 16px (p-4)
- Cards: full width
- Table: horizontal scroll

---

## 🔤 TIPOGRAFIA

### Font Family
- Primary: 'Inter', system-ui, sans-serif
- Fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI'

### Font Sizes
- Huge: 72px (text-7xl) - JPY title
- Title: 48px (text-5xl)
- Large: 36px (text-4xl) - Circle percentage
- H1: 24px (text-2xl) - Card center text
- H2: 18px (text-lg) - Card titles
- Body: 14px (text-sm) - Regular text
- Small: 12px (text-xs) - Labels, subtitles
- Tiny: 10px - Not used

### Font Weights
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700
- Extra Bold: 800

---

## 🎨 ÍCONES (Lucide React)

### Utilizados
- `Database` - 24px, 48px
- `CheckCircle` - 24px
- `Upload` - 32px
- `FileText` - 20px

### Estilos
- Color: cyan-400 (padrão)
- Stroke width: 2px
- Line cap: round
- Line join: round

---

## 📐 ESPAÇAMENTOS

### Padding
- Container: 24px (p-6)
- Cards: 24px (p-6)
- Small cards: 16px (p-4)
- Buttons: 8px 16px (py-2 px-4)
- Table cells: 12px 8px (py-3 px-2)

### Margins
- Section bottom: 24px (mb-6)
- Element bottom: 12px (mb-3)
- Small bottom: 8px (mb-2)

### Gaps
- Grid columns: 24px (gap-6)
- Card grid: 16px (gap-4)
- Flex items: 12px (gap-3)
- Small gaps: 8px (gap-2)

---

## 🎯 ACESSIBILIDADE

### Contraste
- Texto principal (white) em fundo escuro: 21:1 (AAA)
- Cyan (#22d3ee) em fundo escuro: 7.5:1 (AA)
- Slate-400 (#94a3b8) em fundo escuro: 4.8:1 (AA)

### Focus states
- Outline: 2px solid cyan-400
- Outline offset: 2px
- Aplicar em todos elementos interativos

### ARIA labels
- Buttons: aria-label descritivo
- Icons: aria-hidden="true" (decorativos)
- Tables: scope="col" nos headers

---

## 💾 DADOS DE EXEMPLO

### Currency Strength
```javascript
const currencies = [
  { code: 'GB', name: 'GBP', value: 0.68 },
  { code: 'NZ', name: 'NZD', value: 0.51 },
  { code: 'EU', name: 'EUR', value: 0.45 },
  { code: 'AU', name: 'AUD', value: 0.32 },
  { code: 'CA', name: 'CAD', value: 0.15 },
  { code: 'CH', name: 'CHF', value: -0.05 },
  { code: 'US', name: 'USD', value: -0.12 },
  { code: 'JP', name: 'JPY', value: -0.77 }
];
```

### Top Stats
```javascript
const stats = {
  patterns: 23,
  confidence: 78,
  accuracy: 89
};
```

### Suggested Pairs
```javascript
const pairs = [
  'AUDJPY', 'CADJPY', 'CHFJPY', 
  'EURJPY', 'GBPJPY', 'NZDJPY', 'USDJPY'
];
```

### Top Currencies
```javascript
const topCurrencies = [
  { name: 'JPY', value: 38, color: '#f97316' },
  { name: 'GBP', value: 18, color: '#a855f7' },
  { name: 'NZD', value: 16, color: '#22c55e' },
  { name: 'OTHERS', value: 28, color: '#64748b' }
];
```

### Historical Data
```javascript
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
  // ... more trades
];
```

---

## 🚀 PERFORMANCE

### Otimizações
- Use React.memo() para componentes que não mudam frequentemente
- Lazy load componentes não visíveis inicialmente
- Debounce em inputs de busca/filtros
- Virtual scrolling para tabelas grandes

### Assets
- Ícones: SVG inline (menor bundle)
- Fontes: Subsetting para reduzir tamanho
- Imagens: WebP com fallback PNG

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Instalar dependências (React, Tailwind, Lucide)
- [ ] Configurar Tailwind com cores customizadas
- [ ] Criar estrutura de pastas (components/)
- [ ] Implementar componente Dashboard principal
- [ ] Implementar TopStatsCards
- [ ] Implementar CurrencyStrengthMeter
- [ ] Implementar SuggestedCurrency com círculo SVG
- [ ] Implementar TopCurrencies com gráfico pizza
- [ ] Implementar UploadPanel
- [ ] Implementar SimilarPatterns
- [ ] Implementar HistoricalChoices com tabela
- [ ] Adicionar hover states e transições
- [ ] Testar responsividade
- [ ] Adicionar focus states para acessibilidade
- [ ] Conectar com dados reais (API)
- [ ] Otimizar performance

---

## 📝 NOTAS FINAIS

Este design é otimizado para:
- ✅ Visual futurista e tech
- ✅ Alta legibilidade com fundo escuro
- ✅ Efeitos neon sem poluição visual
- ✅ Hierarquia clara de informação
- ✅ Fácil manutenção e escalabilidade

**Cores podem ser ajustadas via Tailwind config para manter consistência em todo o projeto.**
