'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { findSimilarPatterns, getSuggestionFromPatterns, PredictionResult } from '@/lib/patternAnalysis';
import { Loader2 } from 'lucide-react';

const SuggestedCurrency = () => {
    const [prediction, setPrediction] = useState<PredictionResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [pairs, setPairs] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Buscar análise de hoje ou a mais recente
                const today = new Date().toISOString().split('T')[0];
                const { data: analysis, error } = await supabase
                    .from('analises_diarias')
                    .select('*')
                    .eq('data', today)
                    .single();

                if (error || !analysis) {
                    console.log('Nenhuma análise encontrada para hoje ainda.');
                    setLoading(false);
                    return;
                }

                // 2. Se tiver análise, buscar padrões
                if (analysis.slopes_json) {
                    const matches = await findSimilarPatterns(analysis.slopes_json);
                    const result = getSuggestionFromPatterns(matches);

                    if (result) {
                        setPrediction(result);
                        // Gerar pares sugeridos baseados na moeda
                        const newPairs = ['AUD', 'CAD', 'CHF', 'EUR', 'GBP', 'NZD', 'USD', 'JPY']
                            .filter(c => c !== result.currency)
                            .map(c => `${c}${result.currency}`) // Simplificado
                            .slice(0, 5);
                        setPairs(newPairs);
                    }
                }
            } catch (err) {
                console.error('Erro ao gerar sugestão:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="bg-slate-900/60 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6 min-h-[300px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            </div>
        );
    }

    if (!prediction) {
        return (
            <div className="bg-slate-900/60 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6 min-h-[300px] flex flex-col items-center justify-center text-center">
                <h2 className="text-lg font-bold text-white mb-2">MOEDA SUGERIDA</h2>
                <p className="text-slate-400 text-sm">Aguardando análise do dia...</p>
                <a href="/analise-diaria" className="mt-4 text-cyan-400 hover:text-cyan-300 text-sm font-semibold">
                    Preencher Análise &to;
                </a>
            </div>
        );
    }

    return (
        <div className="bg-slate-900/60 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">MOEDA SUGERIDA</h2>
                <div className="text-right">
                    <span className="text-xs text-slate-400 block">Baseado no histórico</span>
                </div>
            </div>

            <div className="text-center mb-6">
                <h3 className="text-5xl font-bold text-white mb-3">{prediction.currency}</h3>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border 
                    ${prediction.direction === 'COMPRA' || prediction.confidence > 50 ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}
                `}>
                    <span className="text-xs">
                        {prediction.direction === 'COMPRA' || prediction.confidence > 50 ? '🚀' : '⚡'}
                    </span>
                    <span className="text-sm font-semibold">
                        {prediction.direction === 'NEUTRO' ? 'POTENCIAL' : prediction.direction}
                    </span>
                </div>
            </div>

            <div className="flex justify-center mb-8">
                <div className="relative w-40 h-40">
                    <svg className="transform -rotate-90 w-40 h-40">
                        <circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-slate-800"
                        />
                        <circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={440}
                            strokeDashoffset={440 - (440 * (prediction.confidence / 100))}
                            className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-cyan-400">{prediction.confidence}%</span>
                        <span className="text-[10px] text-slate-500 text-center px-4 leading-tight mt-1">
                            {prediction.reason}
                        </span>
                    </div>
                </div>
            </div>

            <div className="space-y-1">
                <p className="text-xs text-slate-400 mb-3">Pares Relacionados</p>
                {pairs.map((pair) => (
                    <div key={pair} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-800/30 transition-colors border border-transparent hover:border-cyan-500/20">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50"></span>
                            <span className="text-sm font-medium text-white">{pair}</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-400 bg-slate-500/10 px-3 py-1 rounded border border-slate-500/30">
                            OBSERVAR
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SuggestedCurrency;
