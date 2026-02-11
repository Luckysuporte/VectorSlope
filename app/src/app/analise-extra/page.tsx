'use client';

import React, { useState } from 'react';
import { Save, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import SimilarPatterns from '../../components/SimilarPatterns';
import CurrencyStrengthMeter from '../../components/CurrencyStrengthMeter';
import SuggestedCurrency from '../../components/SuggestedCurrency';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CHF', 'JPY', 'AUD', 'CAD', 'NZD'];
const TIMEFRAMES = ['MN1', 'W1', 'D1', 'H4', 'H1'];

export default function ExtraAnalysisPage() {
    const [slopes, setSlopes] = useState<Record<string, Record<string, string>>>({});
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSlopeChange = (currency: string, tf: string, value: string) => {
        setSlopes(prev => ({
            ...prev,
            [currency]: {
                ...prev[currency],
                [tf]: value
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const { error } = await supabase
                .from('analises_extras')
                .insert({
                    slopes_json: slopes,
                    description: description || 'Sem descrição'
                });

            if (error) throw error;

            setMessage('✅ Análise de Laboratório salva com sucesso!');
        } catch (error: any) {
            console.error('Erro detalhado:', error);
            setMessage(`❌ Erro ao salvar: ${error.message || JSON.stringify(error)}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex flex-col gap-4">
                    <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm w-fit">
                        <ArrowLeft size={16} />
                        Voltar ao Painel
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                            Laboratório de Análise
                        </h1>
                        <p className="text-slate-400 mt-2">
                            Crie análises experimentais a qualquer momento sem afetar o histórico oficial.
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Coluna da Esquerda - Inputs */}
                    <div className="space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Descrição / Nota */}
                            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Descrição / Nota da Análise
                                </label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Ex: Teste da manhã, Validação de estratégia X..."
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                            </div>

                            {/* Tabela de Slopes */}
                            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 overflow-x-auto">
                                <h2 className="text-xl font-semibold mb-4 text-purple-400">Valores de Slope</h2>

                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-800">
                                            <th className="text-left py-2 px-3 text-slate-400">Moeda</th>
                                            {TIMEFRAMES.map(tf => (
                                                <th key={tf} className="text-center py-2 px-3 text-purple-300 font-mono">
                                                    {tf}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {CURRENCIES.map(currency => (
                                            <tr key={currency} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                                                <td className="py-2 px-3 font-bold">
                                                    {currency}
                                                </td>
                                                {TIMEFRAMES.map(tf => (
                                                    <td key={`${currency}-${tf}`} className="p-1">
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            value={slopes[currency]?.[tf] || ''}
                                                            onChange={(e) => handleSlopeChange(currency, tf, e.target.value)}
                                                            className={`w-full min-w-[50px] bg-slate-950/50 border border-slate-700 rounded px-1 py-1 text-center focus:border-purple-500 outline-none
                                    ${Number(slopes[currency]?.[tf]) > 0.25 ? 'text-green-400 border-green-500/30' : ''}
                                    ${Number(slopes[currency]?.[tf]) < -0.25 ? 'text-red-400 border-red-500/30' : ''}
                                  `}
                                                        />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex items-center justify-end gap-4 pb-4">
                                {message && (
                                    <span className={`text-sm ${message.includes('Erro') ? 'text-red-400' : 'text-green-400'}`}>
                                        {message}
                                    </span>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-2 rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-purple-900/20"
                                >
                                    <Save size={18} />
                                    {loading ? 'Salvando...' : 'Salvar Experimento'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Coluna da Direita - Visualização em Tempo Real */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-cyan-400">
                                📊 Força em Tempo Real
                            </h2>
                            <p className="text-xs text-slate-500 mb-4">Baseado nos valores digitados ao lado</p>
                            <CurrencyStrengthMeter customSlopes={slopes} />
                        </div>

                        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-yellow-400">
                                💡 Sugestão IA
                            </h2>
                            <SuggestedCurrency customSlopes={slopes} />
                        </div>

                        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                            <SimilarPatterns currentSlopes={slopes} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
