'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

interface CurrencyData {
    code: string;
    name: string;
    value: number;
}

interface CurrencyStrengthMeterProps {
    customSlopes?: Record<string, Record<string, string>>;
}

const CurrencyStrengthMeter = ({ customSlopes }: CurrencyStrengthMeterProps) => {
    const [currencies, setCurrencies] = useState<CurrencyData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (customSlopes) {
            calculateStrength(customSlopes);
            setLoading(false);
        } else {
            fetchStrengthData();
        }
    }, [customSlopes]);

    const calculateStrength = (slopes: Record<string, Record<string, string>>) => {
        const calculatedCurrencies: CurrencyData[] = [];
        const targetCurrencies = ['USD', 'EUR', 'GBP', 'CHF', 'JPY', 'AUD', 'CAD', 'NZD'];

        targetCurrencies.forEach(curr => {
            const currencySlopes = slopes[curr];
            if (currencySlopes) {
                const values = Object.values(currencySlopes).map(v => parseFloat(v)).filter(v => !isNaN(v));

                if (values.length > 0) {
                    const total = values.reduce((acc, val) => acc + val, 0);
                    const avg = total / values.length;

                    calculatedCurrencies.push({
                        code: curr.substring(0, 2),
                        name: curr,
                        value: avg
                    });
                }
            }
        });

        calculatedCurrencies.sort((a, b) => b.value - a.value);
        setCurrencies(calculatedCurrencies);
    };

    const fetchStrengthData = async () => {
        try {
            const { data: analysis, error } = await supabase
                .from('analises_diarias')
                .select('slopes_json')
                .order('data', { ascending: false })
                .limit(1)
                .single();

            if (error || !analysis || !analysis.slopes_json) {
                setLoading(false);
                return;
            }

            calculateStrength(analysis.slopes_json as Record<string, Record<string, string>>);

        } catch (error) {
            console.error('Erro ao buscar força das moedas:', error);
            setLoading(false);
        }
    };

    const getBarStyles = (value: number) => {
        const width = Math.min(100, Math.abs(value) * 50);
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

    if (loading) {
        return (
            <div className="w-full p-8 rounded-2xl bg-[#0f172a] border border-white/5 shadow-2xl text-white flex justify-center items-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            </div>
        )
    }

    if (currencies.length === 0) {
        return (
            <div className="w-full p-8 rounded-2xl bg-[#0f172a] border border-white/5 shadow-2xl text-white flex flex-col justify-center items-center min-h-[400px] text-center">
                <p className="text-slate-400 mb-4">Aguardando dados da análise...</p>
            </div>
        )
    }

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
                <span>-2.0</span>
                <span>-1.0</span>
                <span className="text-slate-500">0</span>
                <span>+1.0</span>
                <span>+2.0</span>
            </div>
        </div>
    );
};

export default CurrencyStrengthMeter;
