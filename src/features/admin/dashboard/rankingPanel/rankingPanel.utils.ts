import { MICROREGIOES } from '../../../../data/microregioes';
import type { Action } from '../../../../types';
import type { MicroRanking, SortBy } from './rankingPanel.types';

export function buildMicroRankings(actions: Action[], sortBy: SortBy): MicroRanking[] {
  const microStats: MicroRanking[] = MICROREGIOES.map((micro) => {
    const microAcoes = actions.filter((action) => action.microregiaoId === micro.id);
    const concluidas = microAcoes.filter((action) => action.status === 'Conclu\u00EDdo').length;
    const andamento = microAcoes.filter((action) => action.status === 'Em Andamento').length;
    const atrasadas = microAcoes.filter((action) => {
      if (action.status === 'Conclu\u00EDdo') {
        return false;
      }

      return new Date(action.plannedEndDate) < new Date();
    }).length;

    const progressoMedio =
      microAcoes.length > 0
        ? Math.round(
            microAcoes.reduce((sum, action) => sum + action.progress, 0) / microAcoes.length
          )
        : 0;

    const taxaConclusao =
      microAcoes.length > 0 ? Math.round((concluidas / microAcoes.length) * 100) : 0;

    return {
      id: micro.id,
      nome: micro.nome,
      macrorregiao: micro.macrorregiao,
      totalAcoes: microAcoes.length,
      concluidas,
      andamento,
      atrasadas,
      progressoMedio,
      taxaConclusao,
    };
  }).filter((micro) => micro.totalAcoes > 0);

  return microStats.sort((a, b) => {
    switch (sortBy) {
      case 'progresso':
        return b.progressoMedio - a.progressoMedio;
      case 'concluidas':
        return b.taxaConclusao - a.taxaConclusao;
      case 'atraso':
        return a.atrasadas - b.atrasadas;
      default:
        return 0;
    }
  });
}

export function getMedalColor(position: number): string {
  if (position === 0) return 'text-yellow-500';
  if (position === 1) return 'text-slate-400';
  if (position === 2) return 'text-amber-600';
  return 'text-slate-300';
}

export function getMedalBg(position: number): string {
  if (position === 0) {
    return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700';
  }
  if (position === 1) {
    return 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-600';
  }
  if (position === 2) {
    return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700';
  }
  return 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700';
}

export function getProgressBarColor(progress: number): string {
  if (progress >= 75) return 'bg-green-500';
  if (progress >= 50) return 'bg-blue-500';
  if (progress >= 25) return 'bg-amber-500';
  return 'bg-red-500';
}

export function getChartBarColor(progress: number): string {
  if (progress >= 75) return '#10b981';
  if (progress >= 50) return '#3b82f6';
  if (progress >= 25) return '#f59e0b';
  return '#ef4444';
}

export function truncateMicroName(name: string, maxLength = 15): string {
  return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
}
