'use client'

const data = [
    { name: 'JPY', value: 38, color: '#f97316' },
    { name: 'GBP', value: 18, color: '#a855f7' },
    { name: 'NZD', value: 16, color: '#22c55e' },
    { name: 'OTHERS', value: 28, color: '#64748b' },
]

export default function TopCurrencies() {
    return (
        <div className="bg-slate-900/60 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-6">TOP 3 MOEDAS</h2>

            <div className="flex items-center gap-8">
                <div className="relative w-40 h-40">
                    <svg viewBox="0 0 200 200" className="w-40 h-40 transform -rotate-90">
                        {data.map((item, index) => {
                            const radius = 80
                            const circumference = 2 * Math.PI * radius
                            const previousValues = data.slice(0, index).reduce((sum, d) => sum + d.value, 0)
                            const offset = (previousValues / 100) * circumference
                            const length = (item.value / 100) * circumference

                            return (
                                <circle
                                    key={item.name}
                                    cx="100"
                                    cy="100"
                                    r={radius}
                                    fill="transparent"
                                    stroke={item.color}
                                    strokeWidth="20"
                                    strokeDasharray={`${length} ${circumference}`}
                                    strokeDashoffset={-offset}
                                    className="transition-all duration-500"
                                />
                            )
                        })}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-white">927</p>
                            <p className="text-xs text-slate-400">dias</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 flex-1">
                    {data.map((item) => (
                        <div key={item.name} className="flex items-center gap-3">
                            <div
                                className="w-3 h-3 rounded-full shadow-lg"
                                style={{ backgroundColor: item.color }}
                            ></div>
                            <span className="text-sm font-semibold text-white flex-1">{item.name}</span>
                            <span className="text-sm font-bold text-cyan-400">{item.value}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
