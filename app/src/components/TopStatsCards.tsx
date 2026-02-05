'use client'

import { Database, CheckCircle } from 'lucide-react'

interface StatCardProps {
    icon: React.ReactNode
    label: string
    value?: string
    hideValue?: boolean
}

const StatCard = ({ icon, label, value, hideValue }: StatCardProps) => {
    return (
        <div className="bg-slate-900/60 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-4 hover:border-cyan-500/40 transition-all group">
            <div className="flex items-center justify-center mb-2 text-cyan-400 group-hover:text-cyan-300 transition-colors">
                {icon}
            </div>
            <div className="text-center">
                <p className="text-xs text-slate-400 mb-1">{label}</p>
                {!hideValue && <p className="text-lg font-bold text-cyan-400">{value}</p>}
            </div>
        </div>
    )
}

export default function TopStatsCards() {
    return (
        <div className="grid grid-cols-3 gap-4">
            <StatCard
                icon={<Database className="w-6 h-6" />}
                label="Padrões Detectados"
                value="23"
            />
            <StatCard
                icon={
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full border-4 border-cyan-500/30 flex items-center justify-center">
                            <span className="text-lg font-bold text-cyan-400">78%</span>
                        </div>
                    </div>
                }
                label="Confiança"
                hideValue
            />
            <StatCard
                icon={<CheckCircle className="w-6 h-6" />}
                label="Acertos"
                value="89%"
            />
        </div>
    )
}
