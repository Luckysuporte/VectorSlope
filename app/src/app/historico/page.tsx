'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Calendar, TrendingUp, TrendingDown, Moon, Sun, Search, ExternalLink, History as HistoryIcon } from 'lucide-react';
import Link from 'next/link';

interface AnalysisRecord {
    id: string;
    data: string;
    moeda_vencedora: string | null;
    config_vencedora: string | null;
    lucro_real: number | null;
    print_noite: string | null;
    print_manha: string | null;
    slopes_json: Record<string, unknown>;
}

export default function HistoryPage() {
    const [records, setRecords] = useState<AnalysisRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const { data, error } = await supabase
                .from('analises_diarias')
                .select('*')
                .order('data', { ascending: false });

            if (error) throw error;
            setRecords(data || []);
        } catch (error) {
            console.error('Erro ao buscar histórico:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
            <header className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
                        Galeria de Análises
                    </h1>
                    <p className="text-slate-400">
                        Histórico completo das operações, resultados e prints diários.
                    </p>
                </div>

                <div className="flex gap-4">
                    <Link href="/" className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white bg-slate-900 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition-all">
                        Voltar ao Painel
                    </Link>
                </div>
            </header>

            <div className="max-w-7xl mx-auto">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-slate-500">Carregando histórico...</p>
                    </div>
                ) : records.length === 0 ? (
                    <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-slate-800">
                        <HistoryIcon size={48} className="mx-auto text-slate-600 mb-4" />
                        <h3 className="text-xl font-semibold text-slate-300">Nenhum registro encontrado</h3>
                        <p className="text-slate-500 mt-2 mb-6">Comece fazendo uma nova análise no painel.</p>
                        <Link href="/analise-diaria" className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all">
                            Criar Nova Análise
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {records.map((record) => (
                            <div key={record.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/30 transition-all group shadow-lg hover:shadow-cyan-900/10">
                                {/* Cabeçalho do Card */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-cyan-400 font-bold text-lg shadow-inner">
                                            {record.data.split('-')[2]}
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">{
                                                new Date(record.data).toLocaleDateString('pt-BR', { weekday: 'long' })
                                            }</p>
                                            <p className="text-slate-300 font-medium">{formatDate(record.data)}</p>
                                        </div>
                                    </div>

                                    {record.moeda_vencedora ? (
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${record.config_vencedora?.includes('FORÇA')
                                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                                            }`}>
                                            {record.moeda_vencedora} {record.config_vencedora?.includes('FORÇA') ? '🐂' : '🐻'}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-slate-600 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                                            Pendente
                                        </span>
                                    )}
                                </div>

                                {/* Prints Section */}
                                <div className="flex gap-4 mb-6">
                                    {/* Print Noite */}
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1">
                                            <Moon size={12} /> MFC NOITE
                                        </p>
                                        {record.print_noite ? (
                                            <a href={record.print_noite} target="_blank" rel="noopener noreferrer" className="block relative aspect-video bg-slate-950 rounded-lg overflow-hidden border border-slate-800 group-hover:border-cyan-900 transition-colors">
                                                <img src={record.print_noite} alt="Print Noite" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity">
                                                    <ExternalLink size={16} />
                                                </div>
                                            </a>
                                        ) : (
                                            <div className="h-20 bg-slate-950/50 rounded-lg border border-slate-800/50 border-dashed flex items-center justify-center text-slate-700 text-xs">
                                                Sem print
                                            </div>
                                        )}
                                    </div>

                                    {/* Print Manhã */}
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1">
                                            <Sun size={12} /> MFC MANHÃ
                                        </p>
                                        {record.print_manha ? (
                                            <a href={record.print_manha} target="_blank" rel="noopener noreferrer" className="block relative aspect-video bg-slate-950 rounded-lg overflow-hidden border border-slate-800 group-hover:border-orange-900 transition-colors">
                                                <img src={record.print_manha} alt="Print Manhã" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity">
                                                    <ExternalLink size={16} />
                                                </div>
                                            </a>
                                        ) : (
                                            <div className="h-20 bg-slate-950/50 rounded-lg border border-slate-800/50 border-dashed flex items-center justify-center text-slate-700 text-xs">
                                                Sem print
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Resultado Footer */}
                                <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                                    <div className="text-xs text-slate-500">
                                        <p>Lucro Realizado</p>
                                    </div>
                                    <div className={`text-lg font-mono font-bold ${(record.lucro_real || 0) > 0 ? 'text-green-400' :
                                        (record.lucro_real || 0) < 0 ? 'text-red-400' : 'text-slate-600'
                                        }`}>
                                        {record.lucro_real ? (record.lucro_real > 0 ? '+' : '') + record.lucro_real : '--'} pts
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
