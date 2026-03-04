import type { Action } from '../../../../types';

export interface RankingPanelProps {
  actions: Action[];
  onViewMicrorregiao: (microId: string) => void;
  compact?: boolean;
}

export type SortBy = 'progresso' | 'concluidas' | 'atraso';

export interface MicroRanking {
  id: string;
  nome: string;
  macrorregiao: string;
  totalAcoes: number;
  concluidas: number;
  andamento: number;
  atrasadas: number;
  progressoMedio: number;
  taxaConclusao: number;
}
