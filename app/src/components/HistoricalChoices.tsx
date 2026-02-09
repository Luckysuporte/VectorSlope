'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface HistoricalRecord {
    id: string;
    data: string;
    moeda_vencedora: string;
    config_vencedora: string;
    lucro_real: number;
}

const HistoricalChoices = () => {
    const [history, setHistory] = useState<HistoricalRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    // Recarregar quando obter foco (para atualizar se usuário voltar da tela de resultado)
    useEffect(() => {
        const handleFocus = () => fetchHistory();
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    const fetchHistory = async () => {
        try {
            const { data, error } = await supabase
                .from('analises_diarias')
                .select('id, data, moeda_vencedora, config_vencedora, lucro_real')
                .not('moeda_vencedora', 'is', null) // Apenas registros com resultado definido
                .order('data', { ascending: false })
                .limit(10); // Limitar aos últimos 10

            if (error) throw error;
            setHistory(data || []);
        } catch (error) {
            console.error('Erro ao buscar histórico do Bonoto:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}`;
    };

    return (
        <div className="bg-slate-900/60 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white uppercase">Histórico do Bonoto</h2>
                <Link href="/historico" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
                    Ver todos <span>→</span>
                </Link>
            </div>

            <div className="overflow-x-auto flex-1">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="border-b border-slate-800">
                            <th className="text-left py-3 px-2 text-slate-400 font-medium">Data</th>
                            <th className="text-left py-3 px-2 text-slate-400 font-medium">Moeda</th>
                            <th className="text-center py-3 px-2 text-slate-400 font-medium">Configuração</th>
                            <th className="text-right py-3 px-2 text-slate-400 font-medium">Resultado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="text-center py-8 text-slate-500">
                                    Carregando histórico...
                                </td>
                            </tr>
                        ) : history.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-8 text-slate-500">
                                    Nenhum resultado registrado ainda.
                                </td>
                            </tr>
                        ) : (
                            history.map((trade) => {
                                const isProfit = (trade.lucro_real || 0) > 0;
                                const isForca = trade.config_vencedora?.includes('FORÇA');

                                return (
                                    <tr key={trade.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                        <td className="py-3 px-2 text-slate-300">{formatDate(trade.data)}</td>
                                        <td className="py-3 px-2">
                                            <span className="text-cyan-400 font-semibold">{trade.moeda_vencedora}</span>
                                        </td>
                                        <td className="py-3 px-2 text-center">
                                            <span className={`px-2 py-1 rounded border font-bold text-[10px] ${isForca
                                                    ? 'text-green-400 bg-green-500/10 border-green-500/30'
                                                    : 'text-red-400 bg-red-500/10 border-red-500/30'
                                                }`}>
                                                {trade.config_vencedora || '-'}
                                            </span>
                                        </td>
                                        <td className={`py-3 px-2 text-right font-bold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                                            {isProfit ? '+' : ''}{trade.lucro_real}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HistoricalChoices;
