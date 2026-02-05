'use client';

import CurrencyStrengthMeter from '../components/CurrencyStrengthMeter';
import TopStatsCards from '../components/TopStatsCards';
import SuggestedCurrency from '../components/SuggestedCurrency';
import TopCurrencies from '../components/TopCurrencies';
import UploadPanel from '../components/UploadPanel';
import SimilarPatterns from '../components/SimilarPatterns';
import HistoricalChoices from '../components/HistoricalChoices';

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">

      {/* Coluna Esquerda */}
      <div className="space-y-6">
        <CurrencyStrengthMeter />
        <TopCurrencies />
      </div>

      {/* Coluna Central */}
      <div className="space-y-6">
        <TopStatsCards />
        <SuggestedCurrency />
        <HistoricalChoices />
      </div>

      {/* Coluna Direita */}
      <div className="space-y-6">
        <UploadPanel />
        <SimilarPatterns />
      </div>
    </div>
  );
}
