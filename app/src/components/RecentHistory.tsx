'use client'

interface HistoryItem {
    data: string
    par: string
    tipo: 'BUY' | 'SELL'
    entrada: number
    saida: number
    resultado: number
    status: 'PROFIT' | 'LOSS'
}

const mockHistory: HistoryItem[] = [
    { data: '2026-02-04', par: 'USDJPY', tipo: 'SELL', entrada: 150.25, saida: 149.80, resultado: 45, status: 'PROFIT' },
    { data: '2026-02-03', par: 'EURJPY', tipo: 'SELL', entrada: 160.50, saida: 159.90, resultado: 60, status: 'PROFIT' },
    { data: '2026-02-02', par: 'GBPJPY', tipo: 'SELL', entrada: 188.30, saida: 187.85, resultado: 45, status: 'PROFIT' },
    { data: '2026-02-01', par: 'AUDJPY', tipo: 'SELL', entrada: 97.45, saida: 97.90, resultado: -45, status: 'LOSS' },
    { data: '2026-01-31', par: 'NZDJPY', tipo: 'SELL', entrada: 91.20, saida: 90.70, resultado: 50, status: 'PROFIT' },
]

export default function RecentHistory() {
    return (
        <div className="card h-full">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">BONOTO'S HISTORICAL CHOICES</h2>
                <a href="/history" className="text-sm text-[var(--primary)] hover:underline">Ver todos →</a>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-[var(--text-secondary)] text-sm border-b border-[var(--border-color)]">
                            <th className="pb-3 pr-4">Data</th>
                            <th className="pb-3 pr-4">Par</th>
                            <th className="pb-3 pr-4">Tipo</th>
                            <th className="pb-3 pr-4">Entrada</th>
                            <th className="pb-3 pr-4">Saída</th>
                            <th className="pb-3 pr-4">Result (Pips)</th>
                            <th className="pb-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockHistory.map((item, index) => (
                            <tr
                                key={index}
                                className="border-b border-[var(--border-color)] border-opacity-50 hover:bg-[var(--bg-card-hover)] transition-colors"
                            >
                                <td className="py-3 pr-4 text-white">{item.data}</td>
                                <td className="py-3 pr-4">
                                    <span className="font-medium text-[var(--primary)]">{item.par}</span>
                                </td>
                                <td className="py-3 pr-4">
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold
                    ${item.tipo === 'BUY'
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-red-500/20 text-red-400'
                                        }`}>
                                        {item.tipo}
                                    </span>
                                </td>
                                <td className="py-3 pr-4 text-[var(--text-secondary)] font-mono">{item.entrada.toFixed(2)}</td>
                                <td className="py-3 pr-4 text-[var(--text-secondary)] font-mono">{item.saida.toFixed(2)}</td>
                                <td className="py-3 pr-4">
                                    <span className={`font-bold font-mono
                    ${item.resultado >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {item.resultado >= 0 ? '+' : ''}{item.resultado}
                                    </span>
                                </td>
                                <td className="py-3">
                                    <span className={`px-2 py-1 rounded text-xs font-medium
                    ${item.status === 'PROFIT'
                                            ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                                            : 'bg-red-500/10 text-red-400 border border-red-500/30'
                                        }`}>
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
