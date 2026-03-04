import { ClipboardList } from "lucide-react";

import { getMicroregiaoById } from "../../../../data/microregioes";
import type { UserRequest } from "../../../../services/requestsService";

import { getRequestStatusBadge, getRoleBadgeClassName, getRoleLabel } from "./requestsManagement.utils";

interface RequestsManagementTableProps {
  loading: boolean;
  requests: UserRequest[];
  onOpenRequest: (request: UserRequest) => void;
}

export function RequestsManagementTable({
  loading,
  requests,
  onOpenRequest,
}: RequestsManagementTableProps) {
  return (
    <div className="flex-1 overflow-auto p-6">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
          <ClipboardList size={48} className="mb-4 opacity-50" />
          <p className="text-lg font-medium">Nenhuma solicitação encontrada</p>
          <p className="text-sm">Ajuste os filtros ou aguarde novas solicitações</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Usuário</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Micro</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Perfil</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Conteúdo</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Data</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {requests.map((request, index) => (
                <tr
                  key={request.id}
                  className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${index % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-slate-50/50 dark:bg-slate-900/30"}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-sm">
                        {(request.user?.nome || "U")[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-slate-800 dark:text-slate-100 text-sm">{request.user?.nome || "Usuário"}</div>
                        <div className="text-xs text-slate-500">{request.user?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      {request.user?.microregiao_id ? getMicroregiaoById(request.user.microregiao_id)?.nome || "-" : "-"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getRoleBadgeClassName(request.user?.role)}`}>
                      {getRoleLabel(request.user?.role)}
                    </span>
                  </td>
                  <td className="px-4 py-3 max-w-[300px]">
                    <p className="text-sm text-slate-700 dark:text-slate-300 truncate" title={request.content}>
                      {request.content}
                    </p>
                  </td>
                  <td className="px-4 py-3">{getRequestStatusBadge(request.status)}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-slate-500">
                      {new Date(request.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => onOpenRequest(request)}
                      className="px-3 py-1.5 text-xs font-bold text-teal-600 hover:text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg transition-colors"
                    >
                      Ver detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
