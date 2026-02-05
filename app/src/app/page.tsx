'use client'

import CurrencyStrengthMeter from '@/components/CurrencyStrengthMeter'
import TopStatsCards from '@/components/TopStatsCards'
import SuggestedCurrency from '@/components/SuggestedCurrency'
import TopCurrencies from '@/components/TopCurrencies'
import UploadPanel from '@/components/UploadPanel'
import SimilarPatterns from '@/components/SimilarPatterns'
import HistoricalChoices from '@/components/HistoricalChoices'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Grid Superior - 3 colunas */}
        <div className="grid grid-cols-3 gap-6">

          {/* Coluna Esquerda */}
          <div className="space-y-6">
            <CurrencyStrengthMeter />
            <TopCurrencies />
          </div>

          {/* Coluna Central */}
          <div className="space-y-6">
            <TopStatsCards />
            <SuggestedCurrency />
          </div>

          {/* Coluna Direita */}
          <div className="space-y-6">
            <UploadPanel />
            <SimilarPatterns />
          </div>
        </div>

        {/* Historical Choices - Ocupa toda a largura */}
        <HistoricalChoices />

      </div>
    </div>
  )
}
