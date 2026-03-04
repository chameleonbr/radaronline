import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, Cell, Tooltip, XAxis, YAxis } from 'recharts';

import { SafeResponsiveContainer } from '../adminOverview/SafeResponsiveContainer';
import type { MicroRanking } from './rankingPanel.types';
import { getChartBarColor, truncateMicroName } from './rankingPanel.utils';

interface RankingBarChartProps {
  rankings: MicroRanking[];
  onViewMicrorregiao: (microId: string) => void;
}

export function RankingBarChart({ rankings, onViewMicrorregiao }: RankingBarChartProps) {
  const chartData = rankings.slice(0, 10).map((micro) => ({
    name: truncateMicroName(micro.nome),
    fullName: micro.nome,
    progresso: micro.progressoMedio,
    id: micro.id,
    concluidas: micro.concluidas,
    atrasadas: micro.atrasadas,
  }));

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-teal-500" />
          Top 10 por Progresso
        </h3>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Clique na barra para ver detalhes
        </span>
      </div>
      <div className="h-80" style={{ minHeight: '320px' }}>
        <SafeResponsiveContainer minHeight={320}>
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
            <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
            <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || payload.length === 0) {
                  return null;
                }

                const data = payload[0].payload;

                return (
                  <div className="bg-slate-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg">
                    <p className="font-semibold">{data.fullName}</p>
                    <p className="text-teal-300">Progresso: {data.progresso}%</p>
                    <p className="text-green-300">Concluidas: {data.concluidas}</p>
                    {data.atrasadas > 0 && (
                      <p className="text-red-300">Atrasadas: {data.atrasadas}</p>
                    )}
                  </div>
                );
              }}
            />
            <Bar
              dataKey="progresso"
              radius={[0, 4, 4, 0]}
              onClick={(data) => data?.id && onViewMicrorregiao(data.id)}
              style={{ cursor: 'pointer' }}
            >
              {rankings.slice(0, 10).map((entry, index) => (
                <Cell key={`ranking-chart-cell-${index}`} fill={getChartBarColor(entry.progressoMedio)} />
              ))}
            </Bar>
          </BarChart>
        </SafeResponsiveContainer>
      </div>
    </div>
  );
}
