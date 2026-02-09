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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 w-full mb-10">

      {/* Coluna Esquerda - Espaçamento aumentado entre blocos */}
      <div className="flex flex-col gap-10">
        <CurrencyStrengthMeter />
        <TopCurrencies />
      </div>

      {/* Coluna Central - Espaçamento aumentado entre blocos */}
      <div className="flex flex-col gap-10">
        <TopStatsCards />
        <SuggestedCurrency />
        <HistoricalChoices />
      </div>

      {/* Coluna Direita - Espaçamento aumentado entre blocos */}
      <div className="flex flex-col gap-10">
        <UploadPanel />
        <SimilarPatterns />
      </div>
    </div>
  );
}
