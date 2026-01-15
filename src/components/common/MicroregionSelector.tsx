import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Search, 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  X
} from 'lucide-react';
import { MICROREGIOES, getMacrorregioes, getMicroregioesByMacro } from '../../data/microregioes';
import { Action } from '../../types';

interface MicroregionSelectorProps {
  selectedMicroId: string | null;
  onSelect: (microId: string) => void;
  actions?: Action[];
  isOpen: boolean;
  onClose: () => void;
}

interface MicroStats {
  total: number;
  completed: number;
  inProgress: number;
  delayed: number;
  progress: number;
}

const getMicroStats = (microId: string, actions: Action[]): MicroStats => {
  const microActions = actions.filter(a => a.microregiaoId === microId);
  const total = microActions.length;
  const completed = microActions.filter(a => a.status === 'Concluído').length;
  const inProgress = microActions.filter(a => a.status === 'Em Andamento').length;
  const delayed = microActions.filter(a => {
    if (a.status === 'Concluído') return false;
    const hoje = new Date();
    const prazo = new Date(a.plannedEndDate);
    return prazo < hoje;
  }).length;
  
  const progress = total > 0 
    ? Math.round((completed / total) * 100 + (inProgress / total) * 50 * (inProgress > 0 ? 0.5 : 0))
    : 0;
  
  return { total, completed, inProgress, delayed, progress };
};

const getStatusColor = (progress: number, delayed: number) => {
  if (delayed > 0) return 'text-amber-500';
  if (progress >= 80) return 'text-emerald-500';
  if (progress >= 50) return 'text-blue-500';
  return 'text-slate-400';
};

const getStatusBg = (progress: number, delayed: number) => {
  if (delayed > 0) return 'bg-amber-500';
  if (progress >= 80) return 'bg-emerald-500';
  if (progress >= 50) return 'bg-blue-500';
  return 'bg-slate-300 dark:bg-slate-600';
};

export const MicroregionSelector: React.FC<MicroregionSelectorProps> = ({
  selectedMicroId,
  onSelect,
  actions = [],
  isOpen,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedMacros, setExpandedMacros] = useState<Set<string>>(new Set());
  
  const macrorregioes = useMemo(() => getMacrorregioes(), []);
  
  const filteredMicros = useMemo(() => {
    if (!searchTerm.trim()) return null;
    
    const term = searchTerm.toLowerCase();
    return MICROREGIOES.filter(m => 
      m.nome.toLowerCase().includes(term) ||
      m.macrorregiao.toLowerCase().includes(term)
    );
  }, [searchTerm]);
  
  const toggleMacro = (macro: string) => {
    setExpandedMacros(prev => {
      const next = new Set(prev);
      if (next.has(macro)) {
        next.delete(macro);
      } else {
        next.add(macro);
      }
      return next;
    });
  };
  
  const handleSelect = (microId: string) => {
    onSelect(microId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="absolute bottom-0 left-0 right-0 max-h-[85vh] bg-white dark:bg-slate-800 rounded-t-3xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
          </div>
          
          {/* Header */}
          <div className="px-4 pb-3 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-teal-500" />
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  Selecionar Microrregião
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 -mr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar microrregião..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400"
                autoFocus
              />
            </div>
          </div>
          
          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(85vh-140px)] overscroll-contain">
            {/* Search Results */}
            {filteredMicros ? (
              <div className="p-3 space-y-1">
                {filteredMicros.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    Nenhuma microrregião encontrada
                  </div>
                ) : (
                  filteredMicros.map(micro => {
                    const stats = getMicroStats(micro.id, actions);
                    const isSelected = selectedMicroId === micro.id;
                    
                    return (
                      <button
                        key={micro.id}
                        onClick={() => handleSelect(micro.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                          isSelected
                            ? 'bg-teal-50 dark:bg-teal-900/30 border-2 border-teal-500'
                            : 'bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 border-2 border-transparent'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-800 dark:text-slate-100 truncate">
                              {micro.nome}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                            )}
                          </div>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {micro.macrorregiao}
                          </span>
                        </div>
                        
                        {stats.total > 0 && (
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${getStatusBg(stats.progress, stats.delayed)}`}
                                style={{ width: `${stats.progress}%` }}
                              />
                            </div>
                            <span className={`text-xs font-medium ${getStatusColor(stats.progress, stats.delayed)}`}>
                              {stats.progress}%
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            ) : (
              /* Grouped by Macro */
              <div className="p-3 space-y-2">
                {macrorregioes.map(macro => {
                  const micros = getMicroregioesByMacro(macro);
                  const isExpanded = expandedMacros.has(macro);
                  
                  // Stats agregados da macro
                  const macroStats = micros.reduce((acc, m) => {
                    const s = getMicroStats(m.id, actions);
                    return {
                      total: acc.total + s.total,
                      completed: acc.completed + s.completed,
                      delayed: acc.delayed + s.delayed,
                    };
                  }, { total: 0, completed: 0, delayed: 0 });
                  
                  const macroProgress = macroStats.total > 0 
                    ? Math.round((macroStats.completed / macroStats.total) * 100)
                    : 0;
                  
                  return (
                    <div key={macro} className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                      {/* Macro Header */}
                      <button
                        onClick={() => toggleMacro(macro)}
                        className="w-full flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <motion.div
                          animate={{ rotate: isExpanded ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </motion.div>
                        
                        <div className="flex-1 min-w-0 text-left">
                          <span className="font-semibold text-slate-700 dark:text-slate-200">
                            {macro}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                            {micros.length} micros
                          </span>
                        </div>
                        
                        {macroStats.total > 0 && (
                          <div className="flex items-center gap-2 shrink-0">
                            {macroStats.delayed > 0 && (
                              <AlertCircle className="w-4 h-4 text-amber-500" />
                            )}
                            <span className={`text-sm font-medium ${getStatusColor(macroProgress, macroStats.delayed)}`}>
                              {macroProgress}%
                            </span>
                          </div>
                        )}
                      </button>
                      
                      {/* Micros List */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="p-2 space-y-1 bg-white dark:bg-slate-800">
                              {micros.map(micro => {
                                const stats = getMicroStats(micro.id, actions);
                                const isSelected = selectedMicroId === micro.id;
                                
                                return (
                                  <button
                                    key={micro.id}
                                    onClick={() => handleSelect(micro.id)}
                                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-all ${
                                      isSelected
                                        ? 'bg-teal-50 dark:bg-teal-900/30 border border-teal-500'
                                        : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 border border-transparent'
                                    }`}
                                  >
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className={`text-sm truncate ${
                                          isSelected 
                                            ? 'font-semibold text-teal-700 dark:text-teal-300'
                                            : 'text-slate-700 dark:text-slate-200'
                                        }`}>
                                          {micro.nome}
                                        </span>
                                        {isSelected && (
                                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                                        )}
                                      </div>
                                    </div>
                                    
                                    {stats.total > 0 ? (
                                      <div className="flex items-center gap-2 shrink-0">
                                        <div className="w-10 h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                                          <div 
                                            className={`h-full rounded-full ${getStatusBg(stats.progress, stats.delayed)}`}
                                            style={{ width: `${stats.progress}%` }}
                                          />
                                        </div>
                                        <span className={`text-xs font-medium w-7 text-right ${getStatusColor(stats.progress, stats.delayed)}`}>
                                          {stats.progress}%
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="text-xs text-slate-400">
                                        Sem ações
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MicroregionSelector;
