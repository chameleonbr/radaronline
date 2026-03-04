import { ChevronDown, Eye, TrendingUp } from 'lucide-react';

import type { MicroRanking, SortBy } from './rankingPanel.types';
import { getMedalColor, getProgressBarColor } from './rankingPanel.utils';

interface RankingTableProps {
  rankings: MicroRanking[];
  topRankings: MicroRanking[];
  showAll: boolean;
  sortBy: SortBy;
  onShowAll: () => void;
  onSortChange: (value: SortBy) => void;
  onViewMicrorregiao: (microId: string) => void;
}

export function RankingTable({
  rankings,
  topRankings,
  showAll,
  sortBy,
  onShowAll,
  onSortChange,
  onViewMicrorregiao,
}: RankingTableProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
      <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          Ranking Completo
        </h3>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {rankings.length} microrregioes com dados
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-700/50 text-xs text-slate-500 dark:text-slate-400 uppercase">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">#</th>
              <th className="px-4 py-3 text-left font-semibold">Microrregiao</th>
              <th className="px-4 py-3 text-center font-semibold">Acoes</th>
              <th className="px-4 py-3 text-center font-semibold">
                <button
                  onClick={() => onSortChange('concluidas')}
                  className={`hover:text-teal-600 dark:hover:text-teal-400 ${sortBy === 'concluidas' ? 'text-teal-600 dark:text-teal-400' : ''}`}
                >
                  Concluidas
                </button>
              </th>
              <th className="px-4 py-3 text-center font-semibold">
                <button
                  onClick={() => onSortChange('atraso')}
                  className={`hover:text-teal-600 dark:hover:text-teal-400 ${sortBy === 'atraso' ? 'text-teal-600 dark:text-teal-400' : ''}`}
                >
                  Atrasadas
                </button>
              </th>
              <th className="px-4 py-3 text-center font-semibold">
                <button
                  onClick={() => onSortChange('progresso')}
                  className={`hover:text-teal-600 dark:hover:text-teal-400 ${sortBy === 'progresso' ? 'text-teal-600 dark:text-teal-400' : ''}`}
                >
                  Progresso
                </button>
              </th>
              <th className="px-4 py-3 text-center font-semibold">Acao</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {topRankings.map((micro, index) => (
              <tr
                key={micro.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
              >
                <td className="px-4 py-3">
                  <span
                    className={`font-bold ${index < 3 ? getMedalColor(index) : 'text-slate-400 dark:text-slate-500'}`}
                  >
                    {index + 1}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">{micro.nome}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {micro.macrorregiao}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-sm text-slate-600 dark:text-slate-300">
                  {micro.totalAcoes}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full">
                    {micro.concluidas}
                    <span className="text-green-500">({micro.taxaConclusao}%)</span>
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {micro.atrasadas > 0 ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-full">
                      {micro.atrasadas}
                    </span>
                  ) : (
                    <span className="text-xs text-green-500">ok</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${getProgressBarColor(micro.progressoMedio)}`}
                        style={{ width: `${micro.progressoMedio}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300 w-10 text-right">
                      {micro.progressoMedio}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onViewMicrorregiao(micro.id)}
                    className="p-1.5 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-lg text-teal-600 dark:text-teal-400 transition-colors"
                    title="Visualizar painel"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rankings.length > 10 && !showAll && (
        <div className="p-3 border-t border-slate-100 dark:border-slate-700 text-center">
          <button
            onClick={onShowAll}
            className="flex items-center gap-1 mx-auto text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium"
          >
            <ChevronDown className="w-4 h-4" />
            Ver todas as {rankings.length} microrregioes
          </button>
        </div>
      )}
    </div>
  );
}
