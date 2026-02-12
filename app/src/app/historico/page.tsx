'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Moon, Sun, History as HistoryIcon, ChevronLeft, ChevronRight, X, Trash2, Trophy, Table as TableIcon, ChevronDown, ChevronUp, Edit, Upload, Plus } from 'lucide-react';
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
    onDelete,
    onUpload
}: {
    images: string[],
    title: string,
    icon: React.ReactNode,
    onDelete?: (index: number) => void,
    onUpload?: (file: File) => void
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && onUpload) {
            setIsUploading(true);
            try {
                await onUpload(e.target.files[0]);
            } finally {
                setIsUploading(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        }
    };

    const triggerUpload = () => fileInputRef.current?.click();

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
                <div
                    className={`h-28 bg-slate-950/50 rounded-lg border border-slate-800/50 border-dashed flex flex-col items-center justify-center text-slate-700 text-xs text-center px-4 transition-colors ${onUpload ? 'cursor-pointer hover:border-cyan-500/50 hover:bg-slate-900/50' : ''}`}
                    onClick={onUpload ? triggerUpload : undefined}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />

                    {isUploading ? (
                        <div className="animate-spin w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full mb-2"></div>
                    ) : onUpload ? (
                        <>
                            <Plus size={24} className="mb-2 opacity-50" />
                            <span>Clique para adicionar print</span>
                        </>
                    ) : (
                        <span>Sem print</span>
                    )}
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
                <div className="flex gap-2">
                    {onUpload && (
                        <>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <button
                                onClick={triggerUpload}
                                disabled={isUploading}
                                className="text-[10px] bg-slate-800 hover:bg-slate-700 px-1.5 py-0.5 rounded text-cyan-400 flex items-center gap-1 transition-colors"
                                title="Adicionar imagem"
                            >
                                {isUploading ? (
                                    <div className="animate-spin w-3 h-3 border-2 border-cyan-500 border-t-transparent rounded-full"></div>
                                ) : (
                                    <Plus size={10} />
                                )}
                            </button>
                        </>
                    )}
                    {images.length > 1 && (
                        <div className="flex items-center gap-1 bg-slate-800/80 rounded border border-slate-700/50 px-1 py-0.5 ml-2">
                            <button
                                onClick={prevImage}
                                className="p-1 text-cyan-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                                title="Imagem anterior"
                            >
                                <ChevronLeft size={16} style={{ strokeWidth: 3 }} />
                            </button>
                            <span className="text-[11px] font-bold text-cyan-400 font-mono mx-1 min-w-[20px] text-center">
                                {currentIndex + 1}/{images.length}
                            </span>
                            <button
                                onClick={nextImage}
                                className="p-1 text-cyan-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                                title="Próxima imagem"
                            >
                                <ChevronRight size={16} style={{ strokeWidth: 3 }} />
                            </button>
                        </div>
                    )}
                </div>
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
    const [activeTab, setActiveTab] = useState<'official' | 'lab'>('official');
    const [records, setRecords] = useState<AnalysisRecord[]>([]);
    const [extras, setExtras] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
        fetchExtras();
    }, []);

    // Atualiza lista quando recebe foco
    useEffect(() => {
        const handleFocus = () => {
            fetchHistory();
            fetchExtras();
        };
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    // Realtime subscription (simplificado para focar na tabela certa)
    useEffect(() => {
        const channel = supabase
            .channel('realtime-history')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'analises_diarias' }, () => fetchHistory())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'analises_extras' }, () => fetchExtras())
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchHistory = async () => {
        try {
            const { data, error } = await supabase
                .from('analises_diarias')
                .select('*')
                .order('data', { ascending: false });
            if (error) throw error;
            setRecords(data || []);
        } catch (error) { console.error('Erro history:', error); } finally { setLoading(false); }
    };

    const fetchExtras = async () => {
        try {
            const { data, error } = await supabase
                .from('analises_extras')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            setExtras(data || []);
        } catch (error) { console.error('Erro extras:', error); }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    const formatDateTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleString('pt-BR', {
            day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
        });
    };

    const getNextDayFormatted = (dateString: string) => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        date.setDate(date.getDate() + 1);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    };

    const normalizeFiles = (files: string | string[] | null): string[] => {
        if (!files) return [];
        return Array.isArray(files) ? files : [files];
    };

    const deleteImage = async (recordId: string, field: 'print_noite' | 'print_manha' | 'print_resultado', imageIndex: number) => {
        const record = records.find(r => r.id === recordId);
        if (!record) return;
        const currentImages = normalizeFiles(record[field]);
        const newImages = currentImages.filter((_, i) => i !== imageIndex);
        setRecords(prev => prev.map(r => r.id === recordId ? { ...r, [field]: newImages } : r));
        try {
            await supabase.from('analises_diarias').update({ [field]: newImages }).eq('id', recordId);
        } catch (err) { fetchHistory(); }
    };

    const handleUpload = async (file: File, recordId: string, field: 'print_noite' | 'print_manha' | 'print_resultado') => {
        try {
            const record = records.find(r => r.id === recordId);
            if (!record) return;
            const timestamp = Date.now();
            const date = record.data;
            const type = field.replace('print_', '');
            const fileName = `${date}_${type}_${timestamp}_uploaded.${file.name.split('.').pop()}`;
            await supabase.storage.from('prints').upload(fileName, file);
            const { data: { publicUrl } } = supabase.storage.from('prints').getPublicUrl(fileName);
            const currentImages = normalizeFiles(record[field]);
            const newImages = [...currentImages, publicUrl];
            await supabase.from('analises_diarias').update({ [field]: newImages }).eq('id', recordId);
            setRecords(prev => prev.map(r => r.id === recordId ? { ...r, [field]: newImages } : r));
        } catch (error: any) { alert(`Erro: ${error.message}`); }
    };

    const deleteExtra = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este experimento?')) return;

        try {
            const { error } = await supabase
                .from('analises_extras')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setExtras(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            console.error('Erro ao excluir:', error);
            alert('Erro ao excluir experimento.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
            <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
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

            {/* Tabs */}
            <div className="max-w-7xl mx-auto mb-8 flex gap-4 border-b border-slate-800">
                <button
                    onClick={() => setActiveTab('official')}
                    className={`pb-4 px-4 font-bold text-sm transition-colors relative ${activeTab === 'official' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    OFICIAL (ROTINA)
                    {activeTab === 'official' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400"></span>}
                </button>
                <button
                    onClick={() => setActiveTab('lab')}
                    className={`pb-4 px-4 font-bold text-sm transition-colors relative ${activeTab === 'lab' ? 'text-purple-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    LABORATÓRIO (EXTRAS)
                    {activeTab === 'lab' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-400"></span>}
                </button>
            </div>

            <div className="max-w-7xl mx-auto">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-slate-500">Carregando histórico...</p>
                    </div>
                ) : activeTab === 'official' ? (
                    // Conteúdo Aba Oficial
                    records.length === 0 ? (
                        <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-slate-800">
                            <HistoryIcon size={48} className="mx-auto text-slate-600 mb-4" />
                            <h3 className="text-xl font-semibold text-slate-300">Nenhum registro oficial</h3>
                            <p className="text-slate-500 mt-2 mb-6">Comece fazendo uma nova análise de rotina.</p>
                            <Link href="/analise-diaria" className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all">
                                Criar Nova Análise
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8">
                            {records.map((record) => (
                                <div key={record.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/30 transition-all shadow-lg hover:shadow-cyan-900/10">
                                    {/* Cabeçalho do Card (Original) */}
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
                                                    <div className={`flex items-center gap-1 font-bold ${record.config_vencedora?.includes('FORÇA') ? 'text-green-400' : 'text-red-400'}`}>
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
                                            onUpload={(file) => handleUpload(file, record.id, 'print_noite')}
                                        />
                                        <ImageCarousel
                                            images={normalizeFiles(record.print_manha)}
                                            title={`MFC MANHÃ (${getNextDayFormatted(record.data)})`}
                                            icon={<Sun size={12} />}
                                            onDelete={(index) => deleteImage(record.id, 'print_manha', index)}
                                            onUpload={(file) => handleUpload(file, record.id, 'print_manha')}
                                        />
                                        <ImageCarousel
                                            images={normalizeFiles(record.print_resultado)}
                                            title="RESULTADO"
                                            icon={<Trophy size={12} className="text-yellow-500" />}
                                            onDelete={(index) => deleteImage(record.id, 'print_resultado', index)}
                                            onUpload={(file) => handleUpload(file, record.id, 'print_resultado')}
                                        />
                                    </div>

                                    {/* Tabela de Slopes */}
                                    {record.slopes_json && (
                                        <div className="relative">
                                            <Link
                                                href={`/analise-diaria?date=${record.data}`}
                                                className="absolute right-0 top-4 z-10 flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors bg-slate-900/80 px-3 py-1.5 rounded-lg border border-cyan-500/20 hover:border-cyan-500/50"
                                            >
                                                <Edit size={14} />
                                                EDITAR SLOPES
                                            </Link>
                                            {/* @ts-ignore - Supabase type safety workaround */}
                                            <SlopesTable slopes={typeof record.slopes_json === 'string' ? JSON.parse(record.slopes_json) : record.slopes_json} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    // Conteúdo Aba Laboratório
                    extras.length === 0 ? (
                        <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-slate-800">
                            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🧪</span>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-300">Laboratório Vazio</h3>
                            <p className="text-slate-500 mt-2 mb-6">Nenhuma análise experimental registrada.</p>
                            <Link href="/analise-extra" className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all">
                                Criar Experimento
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8">
                            {extras.map((extra) => (
                                <div key={extra.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-purple-500/30 transition-all shadow-lg">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-xs text-purple-400 font-bold uppercase tracking-wider">EXPERIMENTO</p>
                                            <p className="text-slate-300 font-medium">{formatDateTime(extra.created_at)}</p>
                                            {extra.description && <p className="text-sm text-slate-400 mt-1 italic">"{extra.description}"</p>}
                                        </div>
                                        <button
                                            onClick={() => deleteExtra(extra.id)}
                                            className="text-slate-500 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                                            title="Excluir Experimento"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    {/* Tabela de Slopes (Extra) */}
                                    {extra.slopes_json && (
                                        // @ts-ignore
                                        <SlopesTable slopes={typeof extra.slopes_json === 'string' ? JSON.parse(extra.slopes_json) : extra.slopes_json} />
                                    )}
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
