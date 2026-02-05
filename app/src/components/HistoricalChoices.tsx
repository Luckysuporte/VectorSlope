'use client';

const HistoricalChoices = () => {
    const history = [
        { date: '2026-02-04', pair: 'USDJPY', type: 'SELL', entry: 150.25, exit: 149.80, result: '+45', status: 'PROFIT', progress: 85 },
        { date: '2026-02-03', pair: 'EURJPY', type: 'SELL', entry: 160.50, exit: 159.90, result: '+60', status: 'PROFIT', progress: 95 },
        { date: '2026-02-02', pair: 'GBPJPY', type: 'SELL', entry: 188.30, exit: 187.85, result: '+45', status: 'PROFIT', progress: 85 },
        { date: '2026-02-01', pair: 'AUDJPY', type: 'SELL', entry: 97.45, exit: 97.90, result: '-45', status: 'LOSS', progress: 30 },
        { date: '2026-01-31', pair: 'NZDJPY', type: 'SELL', entry: 91.20, exit: 90.70, result: '+50', status: 'PROFIT', progress: 90 },
    ];

    return (
        <div className="bg-slate-900/60 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">BONOTO&apos;S HISTORICAL CHOICES</h2>
                <button className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
                    Ver todos <span>→</span>
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
                            <th className="text-center py-3 px-2 text-slate-400 font-medium w-16"></th>
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
                                <td className="py-3 px-2">
                                    {/* Progress Circle */}
                                    <div className="flex justify-center">
                                        <div className="relative w-8 h-8">
                                            <svg className="w-8 h-8 transform -rotate-90">
                                                <circle
                                                    cx="16"
                                                    cy="16"
                                                    r="12"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                    fill="transparent"
                                                    className="text-slate-700"
                                                />
                                                <circle
                                                    cx="16"
                                                    cy="16"
                                                    r="12"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                    fill="transparent"
                                                    strokeDasharray={75.4}
                                                    strokeDashoffset={75.4 - (75.4 * trade.progress / 100)}
                                                    className={trade.status === 'PROFIT' ? 'text-cyan-400' : 'text-red-400'}
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Scrollbar indicator */}
            <div className="mt-4 flex items-center justify-center gap-2">
                <button className="text-slate-500 hover:text-white transition-colors">◀</button>
                <div className="flex-1 max-w-xs h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="w-1/3 h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
                </div>
                <button className="text-slate-500 hover:text-white transition-colors">▶</button>
            </div>
        </div>
    );
};

export default HistoricalChoices;
