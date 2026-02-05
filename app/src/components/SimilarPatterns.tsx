'use client'

import { Database } from 'lucide-react'

export default function SimilarPatterns() {
    return (
        <div className="bg-slate-900/60 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Padrões Similares</h2>
                <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-cyan-400">23</span>
                    <span className="text-xs text-slate-400">matches</span>
                </div>
            </div>
            <p className="text-xs text-slate-400">Detectados na base histórica</p>

            <div className="mt-6 flex items-center justify-center p-8 border border-cyan-500/20 rounded-xl bg-cyan-500/5">
                <Database className="w-12 h-12 text-cyan-400/50" />
            </div>
        </div>
    )
}
