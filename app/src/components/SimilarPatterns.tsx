'use client';

import { Database } from 'lucide-react';

const SimilarPatterns = () => {
    return (
        <div className="w-full p-6 rounded-2xl bg-gradient-to-b from-[#0f1f3f] to-[#0a1530] border border-cyan-500/10 shadow-2xl text-white">
            <div className="flex items-center justify-between mb-2">
                <h2 className="font-bold text-sm tracking-widest text-slate-200">PADRÕES SIMILARES</h2>
                <div className="flex items-center gap-1.5">
                    <span className="text-2xl font-bold text-cyan-400">23</span>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">matches</span>
                </div>
            </div>
            <p className="text-[11px] text-slate-500 mb-6 italic">Detectados na base histórica</p>

            <div className="flex items-center justify-center p-10 border border-cyan-500/10 rounded-xl bg-[#122b55]/30 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
                {/* Glow animado no fundo */}
                <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <Database className="w-14 h-14 text-cyan-400/30 group-hover:text-cyan-400 group-hover:scale-110 transition-all duration-500" />
            </div>
        </div>
    );
};

export default SimilarPatterns;
