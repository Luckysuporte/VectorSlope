'use client';

const CurrencyStrengthMeter = () => {
    const currencies = [
        { code: 'GB', name: 'GBP', value: 0.68 },
        { code: 'NZ', name: 'NZD', value: 0.51 },
        { code: 'EU', name: 'EUR', value: 0.45 },
        { code: 'AU', name: 'AUD', value: 0.32 },
        { code: 'CA', name: 'CAD', value: 0.15 },
        { code: 'CH', name: 'CHF', value: -0.05 },
        { code: 'US', name: 'USD', value: -0.12 },
        { code: 'JP', name: 'JPY', value: -0.77 },
    ];

    const getBarStyles = (value: number) => {
        const width = Math.abs(value) * 50;
        if (value >= 0) {
            return {
                left: '50%',
                width: `${width}%`,
                background: 'linear-gradient(90deg, #ef4444 0%, #22d3ee 50%, #22c55e 100%)',
                borderRadius: '0 4px 4px 0'
            };
        } else {
            return {
                right: '50%',
                width: `${width}%`,
                background: 'linear-gradient(270deg, #f97316 0%, #ef4444 100%)',
                borderRadius: '4px 0 0 4px'
            };
        }
    };

    return (
        <div className="w-full p-8 rounded-2xl bg-[#0f172a] border border-white/5 shadow-2xl text-white">
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-sm font-black tracking-wider uppercase">
                    FORÇA DAS MOEDAS
                </h2>
                <div className="flex items-center gap-2 bg-[#1e293b] border border-cyan-500/20 px-3 py-1.5 rounded-full">
                    <span className="text-[9px] font-bold text-cyan-400">MNT W1 D1 H4</span>
                    <span className="text-xs">📊</span>
                </div>
            </div>

            {/* Grid de Moedas - Espaçamento grande entre linhas */}
            <div className="space-y-8">
                {currencies.map((curr) => (
                    <div key={curr.name} className="relative">
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-4">
                                <span className="text-[11px] text-slate-500 font-bold uppercase">{curr.code}</span>
                                <span className="text-[15px] font-black">{curr.name}</span>
                            </div>
                            <span className={`text-[15px] font-black ${curr.value >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {curr.value >= 0 ? `+${curr.value.toFixed(2)}` : curr.value.toFixed(2)}
                            </span>
                        </div>

                        {/* Barra de Progresso */}
                        <div className="h-[5px] w-full bg-slate-800/50 rounded-full relative overflow-hidden">
                            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-slate-700 z-10"></div>
                            <div
                                className="absolute top-0 bottom-0 transition-all duration-500"
                                style={getBarStyles(curr.value)}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Escala */}
            <div className="flex justify-between mt-10 text-[11px] font-bold text-slate-600">
                <span>-1.0</span>
                <span>-0.5</span>
                <span className="text-slate-500">0</span>
                <span>+0.5</span>
                <span>+1.0</span>
            </div>
        </div>
    );
};

export default CurrencyStrengthMeter;
