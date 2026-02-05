'use client';

const TopCurrencies = () => {
    const data = [
        { name: 'JPY', value: 38, color: '#f97316' },
        { name: 'GBP', value: 18, color: '#a855f7' },
        { name: 'NZD', value: 16, color: '#22c55e' },
        { name: 'OTHERS', value: 28, color: '#64748b' },
    ];

    return (
        <div className="w-full p-6 rounded-[24px] bg-[#0f172a] border border-white/5 shadow-2xl text-white">
            <h2 className="text-[15px] font-black tracking-widest mb-8 uppercase">TOP 3 MOEDAS</h2>

            <div className="flex items-center gap-8">
                {/* Donut Chart */}
                <div className="relative w-36 h-36 flex-shrink-0">
                    <svg viewBox="0 0 200 200" className="w-36 h-36 transform -rotate-90">
                        {data.map((item, index) => {
                            const radius = 80;
                            const circumference = 2 * Math.PI * radius;
                            const previousValues = data.slice(0, index).reduce((sum, d) => sum + d.value, 0);
                            const offset = (previousValues / 100) * circumference;
                            const length = (item.value / 100) * circumference;

                            return (
                                <circle
                                    key={item.name}
                                    cx="100"
                                    cy="100"
                                    r={radius}
                                    fill="transparent"
                                    stroke={item.color}
                                    strokeWidth="24"
                                    strokeDasharray={`${length} ${circumference}`}
                                    strokeDashoffset={-offset}
                                    className="transition-all duration-500"
                                />
                            );
                        })}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-2xl font-black text-white leading-none">927</p>
                            <p className="text-[11px] text-slate-500 font-bold uppercase mt-1">dias</p>
                        </div>
                    </div>
                </div>

                {/* Legend - Com ajuste de distribuição para criar o vão central */}
                <div className="flex-1 space-y-4 pr-1">
                    {data.map((item) => (
                        <div key={item.name} className="flex items-center justify-between group cursor-default">
                            {/* Nome e Icone */}
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-3.5 h-3.5 rounded-full shadow-lg transition-transform group-hover:scale-110"
                                    style={{ backgroundColor: item.color }}
                                ></div>
                                <span className="text-[13px] font-black text-white tracking-tight">{item.name}</span>
                            </div>

                            {/* Porcentagem colada na direita (conforme seta vermelha) */}
                            <span className="text-[13px] font-black text-cyan-400 text-right min-w-[40px]">
                                {item.value}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopCurrencies;
