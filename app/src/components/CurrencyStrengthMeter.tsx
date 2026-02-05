'use client'

const currencies = [
    { code: 'GB', name: 'GBP', value: 0.68 },
    { code: 'NZ', name: 'NZD', value: 0.51 },
    { code: 'EU', name: 'EUR', value: 0.45 },
    { code: 'AU', name: 'AUD', value: 0.32 },
    { code: 'CA', name: 'CAD', value: 0.15 },
    { code: 'CH', name: 'CHF', value: -0.05 },
    { code: 'US', name: 'USD', value: -0.12 },
    { code: 'JP', name: 'JPY', value: -0.77 },
]

const getBarColor = (value: number) => {
    if (value > 0.3) return 'from-red-500 via-cyan-400 to-green-400'
    if (value > 0) return 'from-red-500 via-cyan-400 to-green-400'
    return 'from-red-500 to-orange-400'
}

export default function CurrencyStrengthMeter() {
    return (
        <div className="bg-slate-900/60 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">CURRENCY STRENGTH METER</h2>
                <span className="text-xs text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
                    MNT W1 D1 H4 📊
                </span>
            </div>

            <div className="space-y-4">
                {currencies.map((currency) => (
                    <div key={currency.code} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-slate-400 w-6">{currency.code}</span>
                                <span className="text-sm font-semibold text-white w-10">{currency.name}</span>
                            </div>
                            <span className={`text-sm font-bold ${currency.value > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {currency.value > 0 ? '+' : ''}{currency.value.toFixed(2)}
                            </span>
                        </div>
                        <div className="relative h-2 bg-slate-800/50 rounded-full overflow-hidden">
                            <div className="absolute inset-y-0 left-1/2 w-px bg-slate-600 z-10"></div>
                            <div
                                className={`absolute inset-y-0 h-full bg-gradient-to-r ${getBarColor(currency.value)} rounded-full transition-all duration-500 shadow-lg shadow-cyan-500/50`}
                                style={{
                                    left: currency.value < 0 ? `${50 + (currency.value * 50)}%` : '50%',
                                    width: `${Math.abs(currency.value) * 50}%`,
                                }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-between text-xs text-slate-500 mt-4 px-2">
                <span>-1.0</span>
                <span>-0.5</span>
                <span>0</span>
                <span>+0.5</span>
                <span>+1.0</span>
            </div>
        </div>
    )
}
