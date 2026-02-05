'use client'

interface PadroesSimilaresProps {
    count: number
}

export default function PadroesSimilares({ count }: PadroesSimilaresProps) {
    return (
        <div className="card flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/20 flex items-center justify-center">
                    <span className="text-xl">🔍</span>
                </div>
                <div>
                    <p className="text-white font-medium">Padrões Similares</p>
                    <p className="text-xs text-[var(--text-muted)]">Detectados na base histórica</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-2xl font-bold text-[var(--primary)] glow-text">{count}</p>
                <p className="text-xs text-[var(--text-muted)]">matches</p>
            </div>
        </div>
    )
}
