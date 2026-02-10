'use client';

import { useEffect, useState } from 'react';
import { Database, Loader2 } from 'lucide-react';
import { findSimilarPatterns, PatternMatch } from '@/lib/patternAnalysis';

interface SimilarPatternsProps {
    currentSlopes?: Record<string, Record<string, string>>;
}

const SimilarPatterns = ({ currentSlopes }: SimilarPatternsProps) => {
    const [matches, setMatches] = useState<PatternMatch[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPatterns = async () => {
            // 1. Se receber slopes via props (tempo real na tela de análise), usa eles
            if (currentSlopes && Object.keys(currentSlopes).length > 0) {
                setLoading(true);
                try {
                    // Pequeno delay para debounce manual simples
                    const timer = setTimeout(async () => {
                        const results = await findSimilarPatterns(currentSlopes);
                        setMatches(results);
                        setLoading(false);
                    }, 1000);

                    return () => clearTimeout(timer);
                } catch (error) {
                    console.error("Erro ao buscar padrões:", error);
                    setLoading(false);
                }
            }
            // 2. Se não receber props (Dashboard), busca do banco o dia de hoje
            else {
                setLoading(true);
                try {
                    const { supabase } = await import('@/lib/supabase');
                    // Alteração: Buscar o registro MAIS RECENTE, independente da data exata.
                    // Isso mantém a consistência com "Moeda Sugerida" e "Força das Moedas".
                    const { data: analysis, error } = await supabase
                        .from('analises_diarias')
                        .select('slopes_json')
                        .order('data', { ascending: false })
                        .limit(1)
                        .single();

                    if (error || !analysis || !analysis.slopes_json) {
                        setMatches([]);
                        setLoading(false);
                        return;
                    }

                    let savedSlopes = analysis.slopes_json;
                    if (typeof savedSlopes === 'string') {
                        try {
                            savedSlopes = JSON.parse(savedSlopes);
                        } catch (e) {
                            console.error("Erro ao fazer parse de slopes_json:", e);
                            setMatches([]);
                            setLoading(false);
                            return;
                        }
                    }

                    const results = await findSimilarPatterns(savedSlopes as Record<string, Record<string, string>>);
                    setMatches(results);

                } catch (error) {
                    console.error("Erro ao buscar padrões (dashboard):", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchPatterns();
    }, [currentSlopes]);

    return (
        <div className="w-full p-6 rounded-2xl bg-gradient-to-b from-[#0f1f3f] to-[#0a1530] border border-cyan-500/10 shadow-2xl text-white">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-sm tracking-widest text-slate-200">PADRÕES SIMILARES</h2>
                <div className="flex items-center gap-1.5">
                    <span className="text-2xl font-bold text-cyan-400">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : matches.length}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">matches</span>
                </div>
            </div>

            <div className="space-y-3">
                {matches.length > 0 ? (
                    matches.map((match, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-800 hover:border-cyan-500/30 transition-colors">
                            <span className="text-sm font-mono text-cyan-300">
                                {new Date(match.date).toLocaleDateString('pt-BR')}
                            </span>
                            <div className="flex items-center gap-2">
                                <div className="h-1.5 w-16 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-cyan-600 to-blue-500"
                                        style={{ width: `${match.similarity}%` }}
                                    />
                                </div>
                                <span className="text-xs font-bold text-slate-400">{match.similarity}%</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-6">
                        <p className="text-[11px] text-slate-500 italic mb-2">
                            {currentSlopes && Object.keys(currentSlopes).length > 0
                                ? "Nenhum padrão similar encontrado"
                                : "Aguardando dados da análise..."}
                        </p>
                    </div>
                )}
            </div>

            {matches.length === 0 && (
                <div className="flex items-center justify-center p-6 mt-4 border border-cyan-500/10 rounded-xl bg-[#122b55]/30 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
                    <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Database className="w-10 h-10 text-cyan-400/30 group-hover:text-cyan-400 group-hover:scale-110 transition-all duration-500" />
                </div>
            )}
        </div>
    );
};

export default SimilarPatterns;
