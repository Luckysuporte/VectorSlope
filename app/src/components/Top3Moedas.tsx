'use client'

interface Top3MoedasProps {
    data?: { moeda: string; percent: number; color: string }[]
}

const defaultData = [
    { moeda: 'JPY', percent: 38, color: '#FF9800' },
    { moeda: 'GBP', percent: 18, color: '#9C27B0' },
    { moeda: 'NZD', percent: 16, color: '#8BC34A' },
    { moeda: 'OTHERS', percent: 28, color: '#64748B' },
]

export default function Top3Moedas({ data = defaultData }: Top3MoedasProps) {
    // Calculate SVG pie chart
    let cumulativePercent = 0

    const getCoordinatesForPercent = (percent: number) => {
        const x = Math.cos(2 * Math.PI * percent)
        const y = Math.sin(2 * Math.PI * percent)
        return [x, y]
    }

    return (
        <div className="card h-full">
            <h2 className="text-lg font-bold text-white mb-4">TOP 3 MOEDAS</h2>

            <div className="flex items-center justify-center gap-8">
                {/* Pie Chart */}
                <div className="relative">
                    <svg viewBox="-1 -1 2 2" className="w-32 h-32 transform -rotate-90">
                        {data.map((item, index) => {
                            const [startX, startY] = getCoordinatesForPercent(cumulativePercent)
                            cumulativePercent += item.percent / 100
                            const [endX, endY] = getCoordinatesForPercent(cumulativePercent)

                            const largeArcFlag = item.percent > 50 ? 1 : 0

                            const pathData = [
                                `M ${startX} ${startY}`,
                                `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                                `L 0 0`,
                            ].join(' ')

                            return (
                                <path
                                    key={item.moeda}
                                    d={pathData}
                                    fill={item.color}
                                    className="transition-all hover:opacity-80"
                                    style={{
                                        filter: index === 0 ? 'drop-shadow(0 0 8px rgba(255, 152, 0, 0.5))' : 'none'
                                    }}
                                />
                            )
                        })}
                    </svg>

                    {/* Center text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-[var(--bg-card)] flex items-center justify-center">
                            <span className="text-xs text-[var(--text-secondary)]">927 dias</span>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="space-y-2">
                    {data.map((item) => (
                        <div key={item.moeda} className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="text-white font-medium">{item.moeda}</span>
                            <span className="text-[var(--text-secondary)]">{item.percent}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
