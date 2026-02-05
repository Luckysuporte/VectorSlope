'use client'

interface MoedaSugeridaProps {
    moeda?: string
    config?: 'FORÇA' | 'FRAQUEZA'
    confianca?: number
}

const pares = {
    'JPY': ['AUDJPY', 'CADJPY', 'CHFJPY', 'EURJPY', 'GBPJPY', 'NZDJPY', 'USDJPY'],
    'USD': ['AUDUSD', 'EURUSD', 'GBPUSD', 'NZDUSD', 'USDCAD', 'USDCHF', 'USDJPY'],
    'EUR': ['EURAUD', 'EURCAD', 'EURCHF', 'EURGBP', 'EURJPY', 'EURNZD', 'EURUSD'],
    'GBP': ['EURGBP', 'GBPAUD', 'GBPCAD', 'GBPCHF', 'GBPJPY', 'GBPNZD', 'GBPUSD'],
    'AUD': ['AUDCAD', 'AUDCHF', 'AUDJPY', 'AUDNZD', 'AUDUSD', 'EURAUD', 'GBPAUD'],
    'NZD': ['AUDNZD', 'EURNZD', 'GBPNZD', 'NZDCAD', 'NZDCHF', 'NZDJPY', 'NZDUSD'],
    'CAD': ['AUDCAD', 'CADCHF', 'CADJPY', 'EURCAD', 'GBPCAD', 'NZDCAD', 'USDCAD'],
    'CHF': ['AUDCHF', 'CADCHF', 'CHFJPY', 'EURCHF', 'GBPCHF', 'NZDCHF', 'USDCHF'],
}

export default function MoedaSugerida({
    moeda = 'JPY',
    config = 'FRAQUEZA',
    confianca = 87
}: MoedaSugeridaProps) {
    const moedaPares = pares[moeda as keyof typeof pares] || []

    // Determinar se é compra ou venda baseado na config e posição no par
    const getOperacao = (par: string) => {
        const isBase = par.startsWith(moeda)
        if (config === 'FORÇA') {
            return isBase ? 'BUY' : 'SELL'
        } else {
            return isBase ? 'SELL' : 'BUY'
        }
    }

    return (
        <div className="card moeda-card h-full relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">MOEDA SUGERIDA</h2>
                <span className="text-[var(--text-secondary)] text-sm">Hoje</span>
            </div>

            {/* Main content */}
            <div className="flex items-center justify-between mb-6">
                {/* Moeda */}
                <div className="text-center">
                    <h3 className="text-5xl font-bold text-white glow-text mb-2">{moeda}</h3>
                    <span className={`inline-block px-4 py-1 rounded-full text-sm font-bold
            ${config === 'FORÇA'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                            : 'bg-red-500/20 text-red-400 border border-red-500/50'
                        }`}>
                        ⚡ {config}
                    </span>
                </div>

                {/* Confidence Circle */}
                <div className="relative">
                    <svg className="w-28 h-28 transform -rotate-90">
                        <circle
                            cx="56"
                            cy="56"
                            r="48"
                            fill="none"
                            stroke="rgba(0, 212, 255, 0.2)"
                            strokeWidth="8"
                        />
                        <circle
                            cx="56"
                            cy="56"
                            r="48"
                            fill="none"
                            stroke="var(--primary)"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={`${confianca * 3.01} 301`}
                            className="drop-shadow-[0_0_10px_var(--primary)]"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-[var(--primary)]">{confianca}%</span>
                    </div>
                </div>
            </div>

            {/* Pares sugeridos */}
            <div>
                <h4 className="text-sm text-[var(--text-secondary)] mb-2">Pares Sugeridos ({config === 'FORÇA' ? 'COMPRA/VENDA' : 'VENDA/COMPRA'})</h4>
                <div className="space-y-2">
                    {moedaPares.map((par) => {
                        const operacao = getOperacao(par)
                        return (
                            <div
                                key={par}
                                className="flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--bg-dark)] border border-[var(--border-color)]"
                            >
                                <span className="text-white font-medium text-sm">{par}</span>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded
                  ${operacao === 'BUY'
                                        ? 'bg-green-500/20 text-green-400'
                                        : 'bg-red-500/20 text-red-400'
                                    }`}>
                                    {operacao}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
