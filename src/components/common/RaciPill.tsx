import React from 'react';
import { X } from 'lucide-react';
import { RaciMember } from '../../types';
import { getInitials } from '../../lib/text';

const RACI_COLORS = {
  R: "bg-blue-100 text-blue-800 border-blue-200",
  A: "bg-purple-100 text-purple-800 border-purple-200",
  C: "bg-orange-100 text-orange-800 border-orange-200",
  I: "bg-slate-100 text-slate-700 border-slate-200",
};

interface RaciCompactPillProps {
  person: RaciMember;
}

export const RaciCompactPill: React.FC<RaciCompactPillProps> = ({ person }) => {
  return (
    <div 
      className={`flex items-center text-[10px] border rounded-sm overflow-hidden whitespace-nowrap shadow-sm shrink-0 ${RACI_COLORS[person.role] || RACI_COLORS.I}`} 
      title={`${person.role}: ${person.name}`}
    >
      <span className="font-bold px-1.5 py-0.5 border-r border-black/10 bg-white/40">{person.role}</span>
      <span className="px-1.5 py-0.5 font-medium">{getInitials(person.name)}</span>
    </div>
  );
};

interface RaciTagProps {
  person: RaciMember;
  onRemove?: () => void;
}

export const RaciTag: React.FC<RaciTagProps> = ({ person, onRemove }) => {
  return (
    <div className={`flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-medium ${RACI_COLORS[person.role] || RACI_COLORS.I}`}>
      <span className="font-bold opacity-80">{person.role}</span>
      <span>{person.name}</span>
      {onRemove && (
        <button 
          onClick={onRemove} 
          aria-label={`Remover ${person.name || 'membro'}`} 
          className="ml-1 hover:text-red-600 opacity-60 hover:opacity-100"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
};

