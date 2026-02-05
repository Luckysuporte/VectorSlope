'use client';

const HistoricalChoices = () => {
    const history = [
        { date: '2026-02-04', pair: 'USDJPY', type: 'SELL', entry: 150.25, exit: 149.80, result: '+45', status: 'PROFIT' },
        { date: '2026-02-03', pair: 'EURJPY', type: 'SELL', entry: 160.50, exit: 159.90, result: '+60', status: 'PROFIT' },
        { date: '2026-02-02', pair: 'GBPJPY', type: 'SELL', entry: 188.30, exit: 187.85, result: '+45', status: 'PROFIT' },
        { date: '2026-02-01', pair: 'AUDJPY', type: 'SELL', entry: 97.45, exit: 97.90, result: '-45', status: 'LOSS' },
        { date: '2026-01-31', pair: 'NZDJPY', type: 'SELL', entry: 91.20, exit: 90.70, result: '+50', status: 'PROFIT' },
    ];

    return (
        <div className="bg-slate-900/60 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">BONOTO&apos;S HISTORICAL CHOICES</h2>
                <button className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                    Ver todos →
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="border-b border-slate-800">
                            <th className="text-left py-3 px-2 text-slate-400 font-medium">Data</th>
                            <th className="text-left py-3 px-2 text-slate-400 font-medium">Par</th>
                            <th className="text-left py-3 px-2 text-slate-400 font-medium">Tipo</th>
                            <th className="text-right py-3 px-2 text-slate-400 font-medium">Entrada</th>
                            <th className="text-right py-3 px-2 text-slate-400 font-medium">Saída</th>
                            <th className="text-right py-3 px-2 text-slate-400 font-medium">Result (Pips)</th>
                            <th className="text-center py-3 px-2 text-slate-400 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((trade, index) => (
                            <tr key={index} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                <td className="py-3 px-2 text-slate-300">{trade.date}</td>
                                <td className="py-3 px-2">
                                    <span className="text-cyan-400 font-semibold">{trade.pair}</span>
                                </td>
                                <td className="py-3 px-2">
                                    <span className="text-red-400 bg-red-500/10 px-2 py-1 rounded border border-red-500/30 font-semibold">
                                        {trade.type}
                                    </span>
                                </td>
                                <td className="py-3 px-2 text-right text-slate-300">{trade.entry}</td>
                                <td className="py-3 px-2 text-right text-slate-300">{trade.exit}</td>
                                <td className={`py-3 px-2 text-right font-bold ${trade.status === 'PROFIT' ? 'text-green-400' : 'text-red-400'}`}>
                                    {trade.result}
                                </td>
                                <td className="py-3 px-2 text-center">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${trade.status === 'PROFIT'
                                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                        }`}>
                                        {trade.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HistoricalChoices;
