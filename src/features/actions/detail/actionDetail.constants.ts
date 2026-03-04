import { RaciRole, Status } from '../../../types';

export const actionDetailRolePriority: Record<RaciRole, number> = {
  R: 0,
  A: 1,
  I: 2,
};

export const actionDetailRoleLabels: Record<RaciRole, { label: string; color: string }> = {
  R: { label: 'Respons\u00E1vel', color: 'bg-purple-600' },
  A: { label: 'Aprovador', color: 'bg-blue-600' },
  I: { label: 'Informado', color: 'bg-amber-500' },
};

export const actionDetailStatusColors: Record<Status, { bg: string; text: string; dot: string }> = {
  'N\u00E3o Iniciado': { bg: 'bg-slate-50', text: 'text-slate-600', dot: 'bg-slate-400' },
  'Em Andamento': { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  'Conclu\u00EDdo': { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'Atrasado': { bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500' },
};
