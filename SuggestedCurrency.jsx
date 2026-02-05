// components/SuggestedCurrency.jsx
import React from 'react';

const SuggestedCurrency = () => {
  const pairs = [
    'AUDJPY', 'CADJPY', 'CHFJPY', 'EURJPY', 'GBPJPY', 'NZDJPY', 'USDJPY'
  ];

  return (
    <div className="bg-slate-900/60 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white">MOEDA SUGERIDA</h2>
        <span className="text-xs text-slate-400">Hoje</span>
      </div>

      <div className="text-center mb-6">
        <h3 className="text-5xl font-bold text-white mb-3">JPY</h3>
        <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-lg border border-red-500/30">
          <span className="text-xs">⚡</span>
          <span className="text-sm font-semibold">FRAQUEZA</span>
        </div>
      </div>

      <div className="flex justify-center mb-8">
        <div className="relative w-40 h-40">
          <svg className="transform -rotate-90 w-40 h-40">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-slate-800"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={440}
              strokeDashoffset={440 - (440 * 0.87)}
              className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-cyan-400">87%</span>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-xs text-slate-400 mb-3">Pares Sugeridos (VENDA/COMPRA)</p>
        {pairs.map((pair) => (
          <div key={pair} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-800/30 transition-colors border border-transparent hover:border-cyan-500/20">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50"></span>
              <span className="text-sm font-medium text-white">{pair}</span>
            </div>
            <span className="text-xs font-semibold text-green-400 bg-green-500/10 px-3 py-1 rounded border border-green-500/30">
              BUY
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedCurrency;
