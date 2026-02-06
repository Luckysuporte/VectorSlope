'use client';

import React from 'react';
import Link from 'next/link';
import { UploadCloud, Upload, FileText, Moon, Sun, BarChart } from 'lucide-react';

const UploadPanel = () => {
    return (
        <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 shadow-xl">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <UploadCloud className="w-6 h-6 text-cyan-400" />
                    Análise & Upload
                </h2>
            </div>

            <div className="space-y-4">
                {/* Botão Principal: Nova Análise Diária */}
                <Link
                    href="/analise-diaria"
                    className="flex items-center justify-center w-full p-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-cyan-900/20 group border border-cyan-400/20"
                >
                    <span className="flex items-center gap-2">
                        📝 Nova Análise (20:30)
                    </span>
                </Link>

                <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="bg-slate-800/50 p-3 rounded-lg flex flex-col items-center gap-2 text-center border border-slate-700 hover:border-cyan-500/30 transition-colors cursor-pointer">
                        <Moon size={20} className="text-purple-400" />
                        <span className="text-[10px] text-slate-400">MFC Noite</span>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded-lg flex flex-col items-center gap-2 text-center border border-slate-700 hover:border-yellow-500/30 transition-colors cursor-pointer">
                        <Sun size={20} className="text-yellow-400" />
                        <span className="text-[10px] text-slate-400">MFC Manhã</span>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded-lg flex flex-col items-center gap-2 text-center border border-slate-700 hover:border-green-500/30 transition-colors cursor-pointer">
                        <BarChart size={20} className="text-green-400" />
                        <span className="text-[10px] text-slate-400">Resultado</span>
                    </div>
                </div>

                {/* Área de Upload de Imagem (Placeholder) */}
                <div className="border-2 border-dashed border-slate-700/50 rounded-xl p-6 hover:border-cyan-500/50 transition-colors cursor-pointer group text-center bg-slate-800/20">
                    <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-slate-700 transition-colors">
                        <Upload className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                    </div>
                    <p className="text-slate-400 text-sm font-medium">Solte o print do gráfico aqui</p>
                </div>
            </div>
        </div>
    );
};

export default UploadPanel;
