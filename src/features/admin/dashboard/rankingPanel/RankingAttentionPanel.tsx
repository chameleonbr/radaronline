import { ArrowDown, TrendingDown } from 'lucide-react';

import type { MicroRanking } from './rankingPanel.types';

interface RankingAttentionPanelProps {
  rankings: MicroRanking[];
  bottomRankings: MicroRanking[];
  onViewMicrorregiao: (microId: string) => void;
}

export function RankingAttentionPanel({
  rankings,
  bottomRankings,
  onViewMicrorregiao,
}: RankingAttentionPanelProps) {
  if (bottomRankings.length === 0 || bottomRankings[0].progressoMedio >= 50) {
    return null;
  }

  return (
    <div className="bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-900/30 p-4 transition-colors">
      <div className="flex items-center gap-2 mb-4">
        <TrendingDown className="w-5 h-5 text-red-500" />
        <h3 className="font-semibold text-red-800 dark:text-red-300">Precisam de Atencao</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        {bottomRankings
          .filter((micro) => micro.progressoMedio < 50)
          .slice(0, 5)
          .map((micro, index) => (
            <button
              key={micro.id}
              onClick={() => onViewMicrorregiao(micro.id)}
              className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-red-200 dark:border-red-900/30 text-left hover:shadow-md transition-all hover:scale-105"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-red-400 font-mono">#{rankings.length - index}</span>
                <ArrowDown className="w-3 h-3 text-red-500" />
              </div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                {micro.nome}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                {micro.atrasadas} atrasadas
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-red-100 dark:bg-red-900/30 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500" style={{ width: `${micro.progressoMedio}%` }} />
                </div>
                <span className="text-xs font-bold text-red-600 dark:text-red-400">
                  {micro.progressoMedio}%
                </span>
              </div>
            </button>
          ))}
      </div>
    </div>
  );
}
