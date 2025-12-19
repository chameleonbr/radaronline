import React from 'react';
import { Status } from '../../types';

const styles: Record<Status, string> = {
  "Concluído": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Em Andamento": "bg-blue-100 text-blue-800 border-blue-200",
  "Não Iniciado": "bg-slate-100 text-slate-600 border-slate-200",
  "Atrasado": "bg-rose-100 text-rose-800 border-rose-200"
};

interface StatusBadgeProps {
  status: Status;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wide ${styles[status] || styles["Não Iniciado"]}`}>
      {status}
    </span>
  );
};

