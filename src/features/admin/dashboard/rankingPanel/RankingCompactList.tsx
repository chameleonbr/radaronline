import { getMedalColor } from './rankingPanel.utils';
import type { MicroRanking } from './rankingPanel.types';

interface RankingCompactListProps {
  rankings: MicroRanking[];
  onViewMicrorregiao: (microId: string) => void;
}

export function RankingCompactList({
  rankings,
  onViewMicrorregiao,
}: RankingCompactListProps) {
  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-700">
      {rankings.map((micro, index) => (
        <div
          key={micro.id}
          className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
          onClick={() => onViewMicrorregiao(micro.id)}
        >
          <span className={`text-sm font-bold w-5 ${getMedalColor(index)}`}>
            {index + 1}o
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
              {micro.nome}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 rounded-full"
                style={{ width: `${micro.progressoMedio}%` }}
              />
            </div>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 w-8 text-right">
              {Math.round(micro.progressoMedio)}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
