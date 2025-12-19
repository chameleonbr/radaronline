import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface ExpandableDescriptionProps {
  text: string;
}

export const ExpandableDescription: React.FC<ExpandableDescriptionProps> = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!text) return null;
  
  const isLong = text.length > 100;
  
  return (
    <div className="text-sm text-slate-600 mb-4 sm:mb-6 bg-white p-3 sm:p-4 rounded-lg border border-slate-200 shadow-sm">
      <p className={`${!isExpanded && isLong ? "line-clamp-2" : ""}`}>
        <span className="font-bold text-slate-900 mr-2">Descrição da Atividade:</span>
        {text}
      </p>
      {isLong && (
        <button 
          onClick={() => setIsExpanded(!isExpanded)} 
          className="text-blue-600 text-xs font-bold mt-2 flex items-center gap-1 hover:underline"
        >
          {isExpanded ? "Ver menos" : "Ler mais"} 
          <ChevronDown size={12} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}/>
        </button>
      )}
    </div>
  );
};

