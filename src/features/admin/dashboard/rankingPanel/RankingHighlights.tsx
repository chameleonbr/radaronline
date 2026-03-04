import { motion } from 'framer-motion';
import { Eye, Medal, Trophy } from 'lucide-react';

import { cardHover, staggerContainer, staggerItem } from '../../../../lib/motion';
import type { MicroRanking, SortBy } from './rankingPanel.types';
import { getMedalBg, getMedalColor } from './rankingPanel.utils';

interface RankingHighlightsProps {
  rankings: MicroRanking[];
  sortBy: SortBy;
  onSortChange: (value: SortBy) => void;
  onViewMicrorregiao: (microId: string) => void;
}

export function RankingHighlights({
  rankings,
  sortBy,
  onSortChange,
  onViewMicrorregiao,
}: RankingHighlightsProps) {
  return (
    <div className="bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-xl border border-teal-100 dark:border-teal-800/50 p-6 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
            Top 3 Microrregioes
          </h3>
        </div>
        <select
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value as SortBy)}
          className="text-sm border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="progresso">Por Progresso</option>
          <option value="concluidas">Por Taxa de Conclusao</option>
          <option value="atraso">Por Menos Atrasos</option>
        </select>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {rankings.slice(0, 3).map((micro, index) => (
          <motion.div
            key={micro.id}
            variants={staggerItem}
            whileHover={cardHover}
            className={`relative p-4 rounded-xl border-2 ${getMedalBg(index)} cursor-pointer`}
          >
            <div className="absolute -top-3 -left-2">
              <div className={`p-1.5 rounded-full bg-white shadow-md ${getMedalColor(index)}`}>
                <Medal className="w-5 h-5" />
              </div>
            </div>

            <div className="absolute top-2 right-3 text-3xl font-bold opacity-10">#{index + 1}</div>

            <div className="mt-2">
              <h4
                className="font-semibold text-slate-800 dark:text-slate-100 truncate"
                title={micro.nome}
              >
                {micro.nome}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">{micro.macrorregiao}</p>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Progresso</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200">
                    {micro.progressoMedio}%
                  </span>
                </div>
                <div className="h-2 bg-white/80 dark:bg-slate-700/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-500 transition-all"
                    style={{ width: `${micro.progressoMedio}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>
                    {micro.concluidas}/{micro.totalAcoes} concluidas
                  </span>
                  {micro.atrasadas > 0 && (
                    <span className="text-red-500 dark:text-red-400">
                      {micro.atrasadas} atrasadas
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => onViewMicrorregiao(micro.id)}
                className="mt-3 w-full flex items-center justify-center gap-1 py-2 text-xs font-medium text-teal-600 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-900/30 rounded-lg transition-colors"
              >
                <Eye className="w-3 h-3" />
                Visualizar
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
