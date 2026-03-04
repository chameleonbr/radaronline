import { AlertTriangle, Building2, ChevronDown, Search } from 'lucide-react';
import { getMacrorregioes, Microrregiao } from '../../../data/microregioes';
import { Action } from '../../../types';
import { User } from '../../../types/auth.types';

interface AdminMicroregionsTabProps {
  filteredMicroregioes: Microrregiao[];
  filterMacro: string;
  searchTerm: string;
  users: User[];
  actions: Action[];
  onFilterMacroChange: (value: string) => void;
  onSearchTermChange: (value: string) => void;
  onViewMicrorregiao: (microId: string) => void;
}

export function AdminMicroregionsTab({
  filteredMicroregioes,
  filterMacro,
  searchTerm,
  users,
  actions,
  onFilterMacroChange,
  onSearchTermChange,
  onViewMicrorregiao,
}: AdminMicroregionsTabProps) {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative min-w-[200px]">
          <select
            value={filterMacro}
            onChange={(event) => onFilterMacroChange(event.target.value)}
            className="w-full appearance-none pl-4 pr-10 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
          >
            <option value="all">Todas Macrorregioes</option>
            {getMacrorregioes().map((macro) => (
              <option key={macro} value={macro}>
                {macro}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar microrregiao..."
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400"
          />
        </div>
      </div>

      <div className="space-y-8">
        {Array.from(new Set(filteredMicroregioes.map((micro) => micro.macrorregiao))).map((macroName) => {
          const microsInMacro = filteredMicroregioes.filter((micro) => micro.macrorregiao === macroName);
          if (microsInMacro.length === 0) return null;

          return (
            <div key={macroName} className="animate-in fade-in duration-500">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 px-1 border-l-4 border-teal-500 pl-3 flex items-center gap-2">
                {macroName}
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  {microsInMacro.length}
                </span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {microsInMacro.map((micro) => {
                  const usersCount = users.filter((user) => user.microregiaoId === micro.id).length;
                  const microActions = actions.filter((action) => action.microregiaoId === micro.id);
                  const progressoMedio =
                    microActions.length > 0
                      ? Math.round(
                          microActions.reduce((sum, action) => sum + action.progress, 0) / microActions.length
                        )
                      : 0;
                  const atrasadas = microActions.filter((action) => {
                    if (action.status === 'Conclu\u00EDdo') return false;
                    return new Date(action.plannedEndDate) < new Date();
                  }).length;

                  return (
                    <div
                      key={micro.id}
                      className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-lg transition-all hover:scale-[1.02] group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-medium text-slate-800 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                              {micro.nome}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{micro.macrorregiao}</p>
                          </div>
                        </div>
                        <span className="text-xs font-mono text-slate-400 dark:text-slate-500">{micro.codigo}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg py-1.5">
                          <p className="text-xs text-slate-500 dark:text-slate-400">Acoes</p>
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{microActions.length}</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg py-1.5">
                          <p className="text-xs text-slate-500 dark:text-slate-400">Progresso</p>
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                            {microActions.length > 0 ? `${progressoMedio}%` : '-'}
                          </p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg py-1.5">
                          <p className="text-xs text-slate-500 dark:text-slate-400">Usuarios</p>
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{usersCount}</p>
                        </div>
                      </div>

                      {microActions.length > 0 && (
                        <div className="mb-3">
                          <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full transition-all bg-teal-500"
                              style={{ width: `${progressoMedio}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {atrasadas > 0 && (
                        <div className="mb-3 flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded">
                          <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-500" />
                          {atrasadas} acao(oes) atrasada(s)
                        </div>
                      )}

                      <button
                        onClick={() => onViewMicrorregiao(micro.id)}
                        className="w-full text-xs text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/30 font-medium py-2 rounded-lg transition-colors"
                      >
                        Visualizar painel -&gt;
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
