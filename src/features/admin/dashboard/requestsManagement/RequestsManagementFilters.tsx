import { RotateCcw, Search } from "lucide-react";

import { MICROREGIOES } from "../../../../data/microregioes";

import type { StatusFilter, TypeFilter } from "./requestsManagement.types";

interface RequestsManagementFiltersProps {
  statusFilter: StatusFilter;
  typeFilter: TypeFilter;
  microFilter: string;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onMicroFilterChange: (value: string) => void;
  onStatusFilterChange: (value: StatusFilter) => void;
  onTypeFilterChange: (value: TypeFilter) => void;
  onRefresh: () => void;
}

export function RequestsManagementFilters({
  statusFilter,
  typeFilter,
  microFilter,
  searchQuery,
  onSearchQueryChange,
  onMicroFilterChange,
  onStatusFilterChange,
  onTypeFilterChange,
  onRefresh,
}: RequestsManagementFiltersProps) {
  return (
    <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-3 flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px] max-w-[300px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar por nome, email ou conteúdo..."
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
        />
      </div>

      <select
        value={microFilter}
        onChange={(event) => onMicroFilterChange(event.target.value)}
        className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500/20"
      >
        <option value="all">Todas Microrregiões</option>
        {MICROREGIOES.map((micro) => (
          <option key={micro.id} value={micro.id}>
            {micro.nome}
          </option>
        ))}
      </select>

      <div className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
        {(["all", "pending", "resolved", "rejected"] as StatusFilter[]).map((status) => (
          <button
            key={status}
            onClick={() => onStatusFilterChange(status)}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
              statusFilter === status
                ? "bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {status === "all" ? "Todos" : status === "pending" ? "Pendentes" : status === "resolved" ? "Resolvidos" : "Rejeitados"}
          </button>
        ))}
      </div>

      <select
        value={typeFilter}
        onChange={(event) => onTypeFilterChange(event.target.value as TypeFilter)}
        className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500/20"
      >
        <option value="all">Todos os Tipos</option>
        <option value="profile_change">Alteração de Perfil</option>
        <option value="mention">Menção</option>
        <option value="system">Sistema</option>
      </select>

      <button
        onClick={onRefresh}
        className="p-2 text-slate-500 hover:text-teal-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        title="Atualizar"
      >
        <RotateCcw size={18} />
      </button>
    </div>
  );
}
