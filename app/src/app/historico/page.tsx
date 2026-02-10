'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Moon, Sun, History as HistoryIcon, ChevronLeft, ChevronRight, X, Trash2, Trophy, Table as TableIcon, ChevronDown, ChevronUp, Edit } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface AnalysisRecord {
    id: string;
    data: string;
    moeda_vencedora: string | null;
    config_vencedora: string | null;
    lucro_real: number | null;
    print_noite: string | string[] | null;
    print_manha: string | string[] | null;
    print_resultado: string | string[] | null;
    slopes_json: Record<string, any> | null;
}

const ImageCarousel = ({
    images,
    title,
    icon,
    onDelete
}: {
    images: string[],
    title: string,
    icon: React.ReactNode,
    onDelete?: (index: number) => void
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    // Reset index se images mudar e atual for inválido
    useEffect(() => {
        if (currentIndex >= images.length && images.length > 0) {
            setCurrentIndex(0);
        }
    }, [images, currentIndex]);

    if (!images || images.length === 0) {
        return (
            <div className="flex-1 min-w-[200px]">
                <p className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1">
                    {icon} {title}
                </p>
                <div className="h-28 bg-slate-950/50 rounded-lg border border-slate-800/50 border-dashed flex items-center justify-center text-slate-700 text-xs text-center px-4">
                    Sem print
                </div>
            </div>
        );
    }

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Tem certeza que deseja excluir esta imagem?')) {
            onDelete?.(currentIndex);
        }
    };

    return (
        <div className="flex-1 min-w-[200px]">
            <p className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1 justify-between">
                <span className="flex items-center gap-1">{icon} {title}</span>
                {images.length > 1 && (
                    <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-cyan-400">
                        {currentIndex + 1}/{images.length}
                    </span>
                )}
            </p>

            <div className="relative group aspect-video bg-slate-950 rounded-lg overflow-hidden border border-slate-800 hover:border-cyan-500/50 transition-colors">
                <img
                    src={images[currentIndex]}
                    alt={`${title} - Imagem ${currentIndex + 1}`}
                    className="w-full h-full object-cover cursor-pointer opacity-80 group-hover:opacity-100 transition-opacity"
                    onClick={() => setIsLightboxOpen(true)}
                />

                {/* Controles de Navegação */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </>
                )}

                {/* Ações Overlay */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onDelete && (
                        <button
                            onClick={handleDelete}
                            className="bg-red-500/80 hover:bg-red-600 text-white p-1.5 rounded-full backdrop-blur-sm shadow-lg"
                            title="Excluir imagem"
                        >
                            <Trash2 size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* Lightbox Simples */}
            {isLightboxOpen && (
                <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsLightboxOpen(false)}>
                    <button
                        className="absolute top-4 right-4 text-slate-400 hover:text-white p-2"
                        onClick={() => setIsLightboxOpen(false)}
                    >
                        <X size={32} />
                    </button>

                    <div className="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={images[currentIndex]}
                            alt="Full size"
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl shadow-cyan-900/20"
                        />

                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute -left-12 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4"
                                >
                                    <ChevronLeft size={48} />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute -right-12 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4"
                                >
                                    <ChevronRight size={48} />
                                </button>

                                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-slate-400 font-mono">
                                    {currentIndex + 1} / {images.length}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const SlopesTable = ({ slopes }: { slopes: Record<string, any> }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (!slopes || Object.keys(slopes).length === 0) return null;

    const timeframes = ['MN1', 'W1', 'D1', 'H4', 'H1'];
    const currencies = Object.keys(slopes).sort();

    return (
        <div className="mt-4 border-t border-slate-800 pt-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-cyan-400 transition-colors mb-2 w-full"
            >
                <TableIcon size={14} />
                VER TABELA DE SLOPES
                {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {isOpen && (
                <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/50">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-slate-900 text-slate-400 font-bold uppercase">
                            <tr>
                                <th className="px-3 py-2">Moeda</th>
                                {timeframes.map(tf => <th key={tf} className="px-3 py-2 text-center">{tf}</th>)}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {currencies.map(curr => (
                                <tr key={curr} className="hover:bg-slate-800/30">
                                    <td className="px-3 py-2 font-bold text-slate-300">{curr}</td>
                                    {timeframes.map(tf => {
                                        let val = 0;
                                        // Tenta acessar slopes[curr][tf] ou slopes[curr].tf
                                        const rawVal = slopes[curr]?.[tf];
                                        if (rawVal !== undefined && rawVal !== null) {
                                            val = parseFloat(String(rawVal));
                                        }

                                        const color = val > 0 ? 'text-green-400' : val < 0 ? 'text-red-400' : 'text-slate-500';
                                        return (
                                            <td key={tf} className={`px-3 py-2 text-center font-mono ${color}`}>
                                                {val.toFixed(2)}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default function HistoryPage() {
    const [records, setRecords] = useState<AnalysisRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    // Atualiza lista quando recebe foco (útil se voltar do painel)
    useEffect(() => {
        const handleFocus = () => fetchHistory();
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    const fetchHistory = async () => {
        try {
            const { data, error } = await supabase
                .from('analises_diarias')
                .select('*')
                .order('data', { ascending: false });

            if (error) throw error;
            console.log('Dados do histórico:', data); // Log para debug
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

    const getNextDayFormatted = (dateString: string) => {
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        date.setDate(date.getDate() + 1);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    };

    const normalizeFiles = (files: string | string[] | null): string[] => {
        if (!files) return [];
        return Array.isArray(files) ? files : [files];
    };

    // Função para excluir imagem
    const deleteImage = async (recordId: string, field: 'print_noite' | 'print_manha' | 'print_resultado', imageIndex: number) => {
        const record = records.find(r => r.id === recordId);
        if (!record) return;

        const currentImages = normalizeFiles(record[field]);
        // Remove a imagem do array local
        const newImages = currentImages.filter((_, i) => i !== imageIndex);

        // Atualiza UI otimisticamente
        setRecords(prev => prev.map(r => {
            if (r.id === recordId) {
                return { ...r, [field]: newImages };
            }
            return r;
        }));

        // Atualiza no banco
        try {
            const { error } = await supabase
                .from('analises_diarias')
                .update({ [field]: newImages })
                .eq('id', recordId);

            if (error) throw error;
        } catch (err) {
            console.error("Erro ao deletar imagem:", err);
            alert("Erro ao excluir imagem. Recarregue a página.");
            fetchHistory(); // Reverte UI em caso de erro
        }
    }

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
                    <div className="grid grid-cols-1 gap-8">
                        {records.map((record) => (
                            <div key={record.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/30 transition-all shadow-lg hover:shadow-cyan-900/10">
                                {/* Cabeçalho do Card */}
                                <div className="flex flex-wrap justify-between items-start mb-6 gap-4">
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

                                    {/* Info do Resultado */}
                                    {record.moeda_vencedora ? (
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-xs text-slate-500 font-bold">VENCEDORA</p>
                                                <div className={`flex items-center gap-1 font-bold ${record.config_vencedora?.includes('FORÇA')
                                                    ? 'text-green-400'
                                                    : 'text-red-400'
                                                    }`}>
                                                    {record.moeda_vencedora}
                                                    <span className="text-lg">{record.config_vencedora?.includes('FORÇA') ? '🐂' : '🐻'}</span>
                                                </div>
                                            </div>
                                            <div className="h-8 w-px bg-slate-800"></div>
                                            <div className="text-right">
                                                <p className="text-xs text-slate-500 font-bold">RESULTADO</p>
                                                <p className={`font-mono font-bold ${(record.lucro_real || 0) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                    {(record.lucro_real || 0) > 0 ? '+' : ''}{record.lucro_real}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-slate-600 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                                            Resultado Pendente
                                        </span>
                                    )}
                                </div>

                                {/* Prints Section */}
                                <div className="flex flex-col md:flex-row gap-4 mb-4 overflow-x-auto pb-2">
                                    <ImageCarousel
                                        images={normalizeFiles(record.print_noite)}
                                        title="MFC NOITE"
                                        icon={<Moon size={12} />}
                                        onDelete={(index) => deleteImage(record.id, 'print_noite', index)}
                                    />
                                    <ImageCarousel
                                        images={normalizeFiles(record.print_manha)}
                                        title={`MFC MANHÃ (${getNextDayFormatted(record.data)})`}
                                        icon={<Sun size={12} />}
                                        onDelete={(index) => deleteImage(record.id, 'print_manha', index)}
                                    />
                                    <ImageCarousel
                                        images={normalizeFiles(record.print_resultado)}
                                        title="RESULTADO"
                                        icon={<Trophy size={12} className="text-yellow-500" />}
                                        onDelete={(index) => deleteImage(record.id, 'print_resultado', index)}
                                    />
                                </div>

                                {/* Tabela de Slopes (Dados da Análise) */}
                                {(() => {
                                    let slopesData = record.slopes_json;

                                    // Parse robusto
                                    if (typeof slopesData === 'string') {
                                        try {
                                            slopesData = JSON.parse(slopesData);
                                        } catch (e) {
                                            console.error('Falha no parse:', e);
                                        }
                                    }

                                    // Só renderiza se tiver dados válidos e não vazios
                                    if (slopesData && typeof slopesData === 'object' && Object.keys(slopesData).length > 0) {
                                        return (
                                            <div className="relative">
                                                <Link
                                                    href={`/analise-diaria?date=${record.data}`}
                                                    className="absolute right-0 top-4 z-10 flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors bg-slate-900/80 px-3 py-1.5 rounded-lg border border-cyan-500/20 hover:border-cyan-500/50"
                                                >
                                                    <Edit size={14} />
                                                    EDITAR SLOPES
                                                </Link>
                                                <SlopesTable slopes={slopesData} />
                                            </div>
                                        );
                                    }

                                    return null;
                                })()}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
