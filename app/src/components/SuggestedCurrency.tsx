'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { findSimilarPatterns, getSuggestionFromPatterns, PredictionResult } from '@/lib/patternAnalysis';
import { Loader2 } from 'lucide-react';

const STANDARD_PAIRS = [
    'AUDCAD', 'AUDCHF', 'AUDJPY', 'AUDNZD', 'AUDUSD',
    'CADCHF', 'CADJPY',
    'CHFJPY',
    'EURAUD', 'EURCAD', 'EURCHF', 'EURGBP', 'EURJPY', 'EURNZD', 'EURUSD',
    'GBPAUD', 'GBPCAD', 'GBPCHF', 'GBPJPY', 'GBPNZD', 'GBPUSD',
    'NZDCAD', 'NZDCHF', 'NZDJPY', 'NZDUSD',
    'USDCAD', 'USDCHF', 'USDJPY'
];

interface PairSuggestion {
    pair: string;
    action: 'COMPRA' | 'VENDA';
}

const SuggestedCurrency = () => {
    const [prediction, setPrediction] = useState<PredictionResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [pairSuggestions, setPairSuggestions] = useState<PairSuggestion[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Buscar análise de hoje ou a mais recente
                // Usar data local (YYYY-MM-DD)
                // const today = new Date().toLocaleDateString('en-CA');

                // Alteração: Buscar o registro MAIS RECENTE, independente da data exata.
                // Isso garante que se o usuário preencheu ontem, continua aparecendo hoje.
                // E se preencher hoje à noite (20:30), já atualiza.
                const { data: analysis, error } = await supabase
                    .from('analises_diarias')
                    .select('*')
                    .order('data', { ascending: false })
                    .limit(1)
                    .single();

                if (error || !analysis) {
                    console.log('Nenhuma análise encontrada no histórico.');
                    setLoading(false);
                    return;
                }

                // 2. Se tiver análise, buscar padrões
                if (analysis.slopes_json) {
                    let savedSlopes = analysis.slopes_json;
                    if (typeof savedSlopes === 'string') {
                        try {
                            savedSlopes = JSON.parse(savedSlopes);
                        } catch (e) {
                            console.error("Erro ao parsear slopes para sugestão:", e);
                            setLoading(false);
                            return;
                        }
                    }

                    const matches = await findSimilarPatterns(savedSlopes as Record<string, Record<string, string>>);
                    const result = getSuggestionFromPatterns(matches);

                    if (result) {
                        setPrediction(result);

                        // Gerar pares com lógica de direção (Compra/Venda)
                        const suggestions: PairSuggestion[] = [];
                        const otherCurrencies = ['AUD', 'CAD', 'CHF', 'EUR', 'GBP', 'NZD', 'USD', 'JPY']
                            .filter(c => c !== result.currency);

                        otherCurrencies.forEach(other => {
                            // Tentar formar o par padrão
                            let pairName = '';
                            let isBase = false;

                            if (STANDARD_PAIRS.includes(`${result.currency}${other}`)) {
                                pairName = `${result.currency}${other}`;
                                isBase = true;
                            } else if (STANDARD_PAIRS.includes(`${other}${result.currency}`)) {
                                pairName = `${other}${result.currency}`;
                                isBase = false;
                            }

                            if (pairName) {
                                // Lógica de Força/Fraqueza
                                // Se FORÇA (Compra da moeda base):
                                //   - Base: Pair SOBE (Compra)
                                //   - Quote: Pair DESCE (Venda)
                                // Se FRAQUEZA (Venda da moeda base):
                                //   - Base: Pair DESCE (Venda)
                                //   - Quote: Pair SOBE (Compra)

                                let action: 'COMPRA' | 'VENDA' = 'COMPRA';

                                if (result.direction === 'COMPRA') { // Moeda forte
                                    action = isBase ? 'COMPRA' : 'VENDA';
                                } else { // Moeda fraca (VENDA)
                                    action = isBase ? 'VENDA' : 'COMPRA';
                                }

                                suggestions.push({ pair: pairName, action });
                            }
                        });

                        setPairSuggestions(suggestions.slice(0, 6));
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

    // Tradução do conceito principal
    const mainLabel = prediction.direction === 'COMPRA' ? 'FORÇA' : (prediction.direction === 'VENDA' ? 'FRAQUEZA' : 'NEUTRO');
    const mainColorClass = prediction.direction === 'COMPRA' ? 'bg-green-500/20 text-green-400 border-green-500/30' : (prediction.direction === 'VENDA' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-slate-500/20 text-slate-400 border-slate-500/30');

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
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${mainColorClass}`}>
                    <span className="text-xs">
                        {prediction.direction === 'COMPRA' ? '🚀' : (prediction.direction === 'VENDA' ? '📉' : '⚡')}
                    </span>
                    <span className="text-lg font-bold tracking-wider">
                        {mainLabel}
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
                <p className="text-xs text-slate-400 mb-3 font-bold uppercase tracking-wider">Pares Relacionados</p>
                {pairSuggestions.map((item) => (
                    <div key={item.pair} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-800/30 transition-colors border border-transparent hover:border-cyan-500/20">
                        <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full shadow-lg ${item.action === 'COMPRA' ? 'bg-green-400 shadow-green-400/50' : 'bg-red-400 shadow-red-400/50'}`}></span>
                            <span className="text-sm font-bold text-white">{item.pair}</span>
                        </div>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded border 
                            ${item.action === 'COMPRA'
                                ? 'bg-green-500/10 text-green-400 border-green-500/30'
                                : 'bg-red-500/10 text-red-400 border-red-500/30'
                            }`}>
                            {item.action}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SuggestedCurrency;
