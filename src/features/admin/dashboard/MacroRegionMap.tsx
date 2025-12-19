import { useMemo, useState } from 'react';
import { 
  ChevronRight,
  Building2,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Eye
} from 'lucide-react';
import { Action } from '../../../types';
import { MICROREGIOES, getMacrorregioes, Microrregiao } from '../../../data/microregioes';

interface MacroRegionMapProps {
  actions: Action[];
  onViewMicrorregiao: (microId: string) => void;
}

interface MicroStats {
  micro: Microrregiao;
  totalAcoes: number;
  concluidas: number;
  andamento: number;
  atrasadas: number;
  progressoMedio: number;
}

export function MacroRegionMap({ actions, onViewMicrorregiao }: MacroRegionMapProps) {
  const [expandedMacro, setExpandedMacro] = useState<string | null>(null);
  const [hoveredMicro, setHoveredMicro] = useState<string | null>(null);

  // Calcular estatísticas por macrorregião e microrregião
  const macroStats = useMemo(() => {
    const macrorregioes = getMacrorregioes();
    
    return macrorregioes.map(macro => {
      const micros = MICROREGIOES.filter(m => m.macrorregiao === macro);
      
      const microsStats: MicroStats[] = micros.map(micro => {
        const microAcoes = actions.filter(a => a.microregiaoId === micro.id);
        const concluidas = microAcoes.filter(a => a.status === 'Concluído').length;
        const andamento = microAcoes.filter(a => a.status === 'Em Andamento').length;
        const atrasadas = microAcoes.filter(a => {
          if (a.status === 'Concluído') return false;
          const hoje = new Date();
          const prazo = new Date(a.plannedEndDate);
          return prazo < hoje;
        }).length;
        const progressoMedio = microAcoes.length > 0
          ? Math.round(microAcoes.reduce((sum, a) => sum + a.progress, 0) / microAcoes.length)
          : 0;

        return {
          micro,
          totalAcoes: microAcoes.length,
          concluidas,
          andamento,
          atrasadas,
          progressoMedio,
        };
      });

      const totalAcoes = microsStats.reduce((sum, m) => sum + m.totalAcoes, 0);
      const concluidas = microsStats.reduce((sum, m) => sum + m.concluidas, 0);
      const atrasadas = microsStats.reduce((sum, m) => sum + m.atrasadas, 0);
      const progressoMedio = microsStats.length > 0
        ? Math.round(microsStats.reduce((sum, m) => sum + m.progressoMedio, 0) / microsStats.filter(m => m.totalAcoes > 0).length || 0)
        : 0;

      return {
        nome: macro,
        micros: microsStats,
        totalMicros: micros.length,
        totalAcoes,
        concluidas,
        atrasadas,
        progressoMedio,
      };
    });
  }, [actions]);

  // Cores baseadas no progresso
  const getProgressColor = (progresso: number, temAcoes: boolean) => {
    if (!temAcoes) return 'bg-slate-100 border-slate-200 text-slate-400';
    if (progresso >= 75) return 'bg-green-100 border-green-300 text-green-700';
    if (progresso >= 50) return 'bg-blue-100 border-blue-300 text-blue-700';
    if (progresso >= 25) return 'bg-amber-100 border-amber-300 text-amber-700';
    return 'bg-red-100 border-red-300 text-red-700';
  };

  const getProgressBg = (progresso: number, temAcoes: boolean) => {
    if (!temAcoes) return 'bg-slate-200';
    if (progresso >= 75) return 'bg-green-500';
    if (progresso >= 50) return 'bg-blue-500';
    if (progresso >= 25) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Mapa de Microrregiões</h2>
          <p className="text-sm text-slate-500">Clique em uma macrorregião para expandir</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span className="text-slate-600">≥75%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-blue-500" />
            <span className="text-slate-600">≥50%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-amber-500" />
            <span className="text-slate-600">≥25%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-red-500" />
            <span className="text-slate-600">&lt;25%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-slate-200" />
            <span className="text-slate-600">Sem dados</span>
          </div>
        </div>
      </div>

      {/* Lista de Macrorregiões */}
      <div className="space-y-3">
        {macroStats.map(macro => {
          const isExpanded = expandedMacro === macro.nome;
          
          return (
            <div 
              key={macro.nome}
              className="bg-white rounded-xl border border-slate-200 overflow-visible"
            >
              {/* Header da Macrorregião */}
              <button
                onClick={() => setExpandedMacro(isExpanded ? null : macro.nome)}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${getProgressColor(macro.progressoMedio, macro.totalAcoes > 0)}`}>
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-slate-800">{macro.nome}</h3>
                    <p className="text-xs text-slate-500">
                      {macro.totalMicros} microrregiões • {macro.totalAcoes} ações
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Mini stats */}
                  <div className="hidden md:flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{macro.concluidas}</span>
                    </div>
                    {macro.atrasadas > 0 && (
                      <div className="flex items-center gap-1 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span>{macro.atrasadas}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-slate-600">
                      <TrendingUp className="w-4 h-4" />
                      <span>{macro.progressoMedio}%</span>
                    </div>
                  </div>

                  {/* Progress bar mini */}
                  <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${getProgressBg(macro.progressoMedio, macro.totalAcoes > 0)}`}
                      style={{ width: `${macro.progressoMedio}%` }}
                    />
                  </div>

                  <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </div>
              </button>

              {/* Grid de Microrregiões */}
              {isExpanded && (
                <div className="border-t border-slate-100 p-4 bg-slate-50">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {macro.micros.map(({ micro, totalAcoes, concluidas, atrasadas, progressoMedio }) => {
                      const isHovered = hoveredMicro === micro.id;
                      
                      return (
                        <div
                          key={micro.id}
                          className="relative"
                          onMouseEnter={() => setHoveredMicro(micro.id)}
                          onMouseLeave={() => setHoveredMicro(null)}
                        >
                          <button
                            onClick={() => onViewMicrorregiao(micro.id)}
                            className={`
                              w-full p-3 rounded-lg border-2 transition-all text-left
                              ${getProgressColor(progressoMedio, totalAcoes > 0)}
                              hover:shadow-md hover:scale-105
                            `}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-mono opacity-60">{micro.codigo}</span>
                              {atrasadas > 0 && (
                                <AlertCircle className="w-3 h-3 text-red-500" />
                              )}
                            </div>
                            <p className="text-xs font-semibold truncate" title={micro.nome}>
                              {micro.nome}
                            </p>
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-[10px] opacity-75">
                                {totalAcoes} ações
                              </span>
                              <span className="text-xs font-bold">
                                {totalAcoes > 0 ? `${progressoMedio}%` : '-'}
                              </span>
                            </div>
                            {/* Mini progress bar */}
                            <div className="mt-1 h-1 bg-white/50 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-current opacity-50"
                                style={{ width: `${progressoMedio}%` }}
                              />
                            </div>
                          </button>

                          {/* Tooltip com detalhes */}
                          {isHovered && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-30 pointer-events-none max-w-[240px]">
                              <div className="bg-slate-800 text-white text-xs rounded-lg p-3 shadow-xl min-w-[180px] max-w-full">
                                <p className="font-semibold mb-2">{micro.nome}</p>
                                <div className="space-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-slate-300">Total de ações:</span>
                                    <span className="font-medium">{totalAcoes}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-300">Concluídas:</span>
                                    <span className="font-medium text-green-400">{concluidas}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-300">Atrasadas:</span>
                                    <span className="font-medium text-red-400">{atrasadas}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-300">Progresso:</span>
                                    <span className="font-medium">{progressoMedio}%</span>
                                  </div>
                                </div>
                                <div className="mt-2 pt-2 border-t border-slate-700 flex items-center gap-1 text-teal-400">
                                  <Eye className="w-3 h-3" />
                                  <span>Clique para visualizar</span>
                                </div>
                                {/* Arrow */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-slate-800" />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}



