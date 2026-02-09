'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Save, Search, Upload, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CHF', 'JPY', 'AUD', 'CAD', 'NZD'];

export default function DailyResultPage() {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Dados do Resultado
    const [winner, setWinner] = useState('');
    const [config, setConfig] = useState('FORCA'); // FORCA ou FRAQUEZA
    const [profit, setProfit] = useState('');

    // Upload de Fotos
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [existingUrls, setExistingUrls] = useState<string[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

            // Carregar prints existentes
            if (data.print_resultado) {
                const urls = Array.isArray(data.print_resultado)
                    ? data.print_resultado
                    : [data.print_resultado].filter(Boolean);
                setExistingUrls(urls);
            } else {
                setExistingUrls([]);
            }

            setMessage('📝 Análise encontrada! Editando resultado...');
        } else {
            setMessage('⚠️ Nenhuma análise de slopes encontrada para esta data. Crie a análise primeiro!');
            setWinner('');
            setProfit('');
            setExistingUrls([]);
        }
        setUploadedFiles([]);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setUploadedFiles(prev => [...prev, ...newFiles]);
        }
    };

    // Drag and Drop
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const newFiles = Array.from(e.dataTransfer.files);
            setUploadedFiles(prev => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Função para remover URL existente (apenas visualmente antes de salvar, ou implementar lógica de delete no bucket se precisar)
    // Por simplicidade, vamos remover da lista que será salva. O arquivo fica no storage 'orfão' por enquanto, ou podemos deletar.
    const removeExistingUrl = (index: number) => {
        setExistingUrls(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log('Salvando resultado...', { date, winner, config, profit });

            // 1. Upload das novas imagens
            const newUrls: string[] = [];

            for (let i = 0; i < uploadedFiles.length; i++) {
                const file = uploadedFiles[i];
                const timestamp = Date.now();
                const fileName = `resultado_${date}_${timestamp}_${i}.${file.name.split('.').pop()}`;

                const { error: uploadError } = await supabase.storage
                    .from('prints')
                    .upload(fileName, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('prints')
                    .getPublicUrl(fileName);

                newUrls.push(publicUrl);
            }

            // Combinar URLs existentes (que não foram removidas) com as novas
            const finalUrls = [...existingUrls, ...newUrls];

            const { error } = await supabase
                .from('analises_diarias')
                .update({
                    moeda_vencedora: winner,
                    config_vencedora: config,
                    lucro_real: parseFloat(profit),
                    print_resultado: finalUrls
                })
                .eq('data', date);

            if (error) throw error;

            setUploadedFiles([]);
            setExistingUrls(finalUrls);
            setMessage('✅ Resultado e prints salvos com sucesso!');
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

                    {/* Área de Upload de Prints do Resultado */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Prints do Resultado
                        </label>
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${isDragging ? 'border-green-500 bg-green-500/10' : 'border-slate-700 hover:border-slate-500 bg-slate-900/50'
                                }`}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <div className="flex flex-col items-center gap-2 text-slate-400">
                                <Upload size={32} />
                                <p>Clique ou arraste prints aqui</p>
                            </div>
                        </div>

                        {/* Lista de Prévia de Uploads */}
                        {(uploadedFiles.length > 0 || existingUrls.length > 0) && (
                            <div className="mt-4 grid grid-cols-2 gap-4">
                                {/* URLs já salvas */}
                                {existingUrls.map((url, index) => (
                                    <div key={`existing-${index}`} className="relative group rounded-lg overflow-hidden border border-green-500/30">
                                        <div className="aspect-video relative">
                                            {/* Usando img normal para simplificar, idealmente Next Image com configuração de domain */}
                                            <img src={url} alt={`Resultado ${index}`} className="object-cover w-full h-full opacity-80" />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeExistingUrl(index)}
                                            className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={16} />
                                        </button>
                                        <div className="absolute bottom-0 w-full bg-black/60 text-xs py-1 text-center text-green-200">
                                            Salvo
                                        </div>
                                    </div>
                                ))}

                                {/* Novos Arquivos */}
                                {uploadedFiles.map((file, index) => (
                                    <div key={`new-${index}`} className="relative group rounded-lg overflow-hidden border border-slate-700">
                                        <div className="aspect-video relative bg-slate-800 flex items-center justify-center text-xs text-slate-500">
                                            {file.type.startsWith('image/') ? (
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt="Preview"
                                                    className="object-cover w-full h-full"
                                                    onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)}
                                                />
                                            ) : (
                                                <span>{file.name}</span>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={16} />
                                        </button>
                                        <div className="absolute bottom-0 w-full bg-blue-500/60 text-xs py-1 text-center text-white">
                                            Novo
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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
