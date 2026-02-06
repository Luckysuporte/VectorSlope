'use client';

import React, { useState, useEffect } from 'react';
import { Save, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CHF', 'JPY', 'AUD', 'CAD', 'NZD'];

export default function DailyResultPage() {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Dados do Resultado
    const [winner, setWinner] = useState('');
    const [config, setConfig] = useState('FORCA'); // FORCA ou FRAQUEZA
    const [profit, setProfit] = useState('');

    // Verificar se já existe análise para o dia
    useEffect(() => {
        checkExistingAnalysis();
    }, [date]);

    const checkExistingAnalysis = async () => {
        const { data } = await supabase
            .from('analises_diarias')
            .select('*')
            .eq('data', date)
            .single();

        if (data) {
            if (data.moeda_vencedora) setWinner(data.moeda_vencedora);
            if (data.config_vencedora) setConfig(data.config_vencedora);
            if (data.lucro_real) setProfit(data.lucro_real.toString());
            setMessage('📝 Análise encontrada! Editando resultado...');
        } else {
            setMessage('⚠️ Nenhuma análise de slopes encontrada para esta data. Crie a análise primeiro!');
            setWinner('');
            setProfit('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log('Salvando resultado...', { date, winner, config, profit });

            const { error } = await supabase
                .from('analises_diarias')
                .update({
                    moeda_vencedora: winner,
                    config_vencedora: config,
                    lucro_real: parseFloat(profit)
                })
                .eq('data', date);

            if (error) throw error;

            setMessage('✅ Resultado salvo com sucesso! O sistema aprendeu um novo padrão.');
        } catch (error: any) {
            console.error(error);
            setMessage(`❌ Erro ao salvar: ${error.message || 'Erro desconhecido'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-2xl mx-auto">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                        Resultado do Dia
                    </h1>
                    <p className="text-slate-400 mt-2">
                        Quem foi a campeã? Alimente o sistema com o resultado real.
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/50 p-8 rounded-2xl border border-slate-800 shadow-xl">

                    {/* Seleção de Data */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Data do Resultado
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-green-500 outline-none"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Moeda Vencedora */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Moeda Vencedora
                            </label>
                            <select
                                value={winner}
                                onChange={(e) => setWinner(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-green-500 outline-none appearance-none"
                                required
                            >
                                <option value="">Selecione...</option>
                                {CURRENCIES.map(curr => (
                                    <option key={curr} value={curr}>{curr}</option>
                                ))}
                            </select>
                        </div>

                        {/* Configuração */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Configuração
                            </label>
                            <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-700">
                                <button
                                    type="button"
                                    onClick={() => setConfig('FORCA')}
                                    className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${config === 'FORCA'
                                            ? 'bg-green-500/20 text-green-400 shadow-lg'
                                            : 'text-slate-500 hover:text-slate-300'
                                        }`}
                                >
                                    FORÇA 🐂
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setConfig('FRAQUEZA')}
                                    className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${config === 'FRAQUEZA'
                                            ? 'bg-red-500/20 text-red-400 shadow-lg'
                                            : 'text-slate-500 hover:text-slate-300'
                                        }`}
                                >
                                    FRAQUEZA 🐻
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Lucro Real */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Lucro Real (Pontos/Financeiro)
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={profit}
                                onChange={(e) => setProfit(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-4 py-3 text-white focus:ring-2 focus:ring-green-500 outline-none font-mono text-lg"
                            />
                        </div>
                    </div>

                    {/* Feedback Message */}
                    {message && (
                        <div className={`p-4 rounded-lg text-sm border ${message.includes('Erro') || message.includes('Nenhuma')
                                ? 'bg-red-900/20 border-red-500/30 text-red-400'
                                : message.includes('encontrada')
                                    ? 'bg-blue-900/20 border-blue-500/30 text-blue-400'
                                    : 'bg-green-900/20 border-green-500/30 text-green-400'
                            }`}>
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !winner}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <Save size={24} />
                        {loading ? 'Salvando...' : 'Confirmar Resultado'}
                    </button>

                </form>
            </div>
        </div>
    );
}
