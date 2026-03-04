import { useMemo, useState } from "react";

import type { Action, TeamMember } from "../../../types";
import type { User } from "../../../types/auth.types";
import { MICROREGIOES, MACRORREGIOES, getMicroregioesByMacro } from "../../../data/microregioes";
import type { DashboardFiltersState } from "./DashboardFilters";
import { KpiDetailModal } from "./KpiDetailModal";
import { AdminOverviewChartsSection } from "./adminOverview/AdminOverviewChartsSection";
import { AdminOverviewKpiSection } from "./adminOverview/AdminOverviewKpiSection";
import { ReprogrammedActionsModal } from "./adminOverview/ReprogrammedActionsModal";
import type { AdminOverviewDetailedData, AdminOverviewMetrics } from "./adminOverview/adminOverview.types";

interface AdminOverviewProps {
  actions: Action[];
  users: User[];
  teams: Record<string, TeamMember[]>;
  filters?: DashboardFiltersState;
  children?: React.ReactNode;
  onTabChange?: (tab: "usuarios" | "ranking") => void;
  pendingCount?: number;
  onViewMicro?: (id: string) => void;
}

type OverviewModalKey = "conclusao" | "risco" | "cobertura" | "horizonte" | "status" | "reprogramadas" | null;

export function AdminOverview({
  actions,
  users,
  filters,
  children,
  onTabChange,
  pendingCount,
  onViewMicro,
}: AdminOverviewProps) {
  const filteredData = useMemo(() => {
    let filteredActions = actions;
    let filteredUsers = users;

    if (filters?.selectedMacroId && filters.selectedMacroId !== "all") {
      const macro = MACRORREGIOES.find((item) => item.id === filters.selectedMacroId);
      if (macro) {
        const micros = getMicroregioesByMacro(macro.nome);
        const microIds = new Set(micros.map((micro) => micro.id));
        filteredActions = filteredActions.filter((action) => microIds.has(action.microregiaoId));
        filteredUsers = filteredUsers.filter((user) => user.microregiaoId && microIds.has(user.microregiaoId));
      }
    }

    if (filters?.selectedMicroId && filters.selectedMicroId !== "all") {
      filteredActions = filteredActions.filter((action) => action.microregiaoId === filters.selectedMicroId);
      filteredUsers = filteredUsers.filter((user) => user.microregiaoId === filters.selectedMicroId);
    }

    return { actions: filteredActions, users: filteredUsers };
  }, [actions, filters, users]);

  const metrics = useMemo<AdminOverviewMetrics>(() => {
    const { actions: filteredActions, users: filteredUsers } = filteredData;
    const totalMicros = MICROREGIOES.length;
    const microsComAcoes = new Set(filteredActions.map((action) => action.microregiaoId)).size;
    const taxaCobertura = Math.round((microsComAcoes / totalMicros) * 100);

    const totalAcoes = filteredActions.length;
    const concluidas = filteredActions.filter((action) => action.status === "Concluído").length;
    const andamento = filteredActions.filter((action) => action.status === "Em Andamento").length;
    const naoIniciadas = filteredActions.filter((action) => action.status === "Não Iniciado").length;

    const hoje = new Date();
    const em7Dias = new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000);
    const em30Dias = new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000);

    const atrasadas = filteredActions.filter((action) => {
      if (action.status === "Concluído") return false;
      return new Date(action.plannedEndDate) < hoje;
    }).length;

    const vencendoHoje = filteredActions.filter((action) => {
      if (action.status === "Concluído") return false;
      const prazo = new Date(action.plannedEndDate);
      return prazo >= hoje && prazo < new Date(hoje.getTime() + 24 * 60 * 60 * 1000);
    }).length;

    const vencendo7Dias = filteredActions.filter((action) => {
      if (action.status === "Concluído") return false;
      const prazo = new Date(action.plannedEndDate);
      return prazo >= hoje && prazo <= em7Dias;
    }).length;

    const vencendo30Dias = filteredActions.filter((action) => {
      if (action.status === "Concluído") return false;
      const prazo = new Date(action.plannedEndDate);
      return prazo > em7Dias && prazo <= em30Dias;
    }).length;

    const futuro = filteredActions.filter((action) => {
      if (action.status === "Concluído") return false;
      return new Date(action.plannedEndDate) > em30Dias;
    }).length;

    const taxaConclusao = totalAcoes > 0 ? Math.round((concluidas / totalAcoes) * 100) : 0;
    const usuariosAtivos = filteredUsers.filter((user) => user.ativo).length;

    const concluidasComAtraso = filteredActions.filter((action) => {
      if (action.status !== "Concluído") return false;
      if (!action.endDate || !action.plannedEndDate) return false;
      return new Date(action.endDate) > new Date(action.plannedEndDate);
    }).length;

    const concluidasAntes = filteredActions.filter((action) => {
      if (action.status !== "Concluído") return false;
      if (!action.endDate || !action.plannedEndDate) return false;
      return new Date(action.endDate) < new Date(action.plannedEndDate);
    }).length;

    return {
      totalAcoes,
      concluidas,
      andamento,
      naoIniciadas,
      atrasadas,
      taxaConclusao,
      taxaCobertura,
      usuariosAtivos,
      concluidasComAtraso,
      concluidasAntes,
      deadlineHorizon: [
        { name: "Atrasadas", value: atrasadas, color: "#f43f5e" },
        { name: "Hoje", value: vencendoHoje, color: "#f59e0b" },
        { name: "7 Dias", value: vencendo7Dias, color: "#3b82f6" },
        { name: "30 Dias", value: vencendo30Dias, color: "#64748b" },
        { name: "Futuro", value: futuro, color: "#94a3b8" },
      ],
    };
  }, [filteredData]);

  const statusData = useMemo(
    () => [
      { name: "Concluídas", value: metrics.concluidas, color: "#10b981" },
      { name: "Em Andamento", value: metrics.andamento, color: "#3b82f6" },
      { name: "Não Iniciadas", value: metrics.naoIniciadas, color: "#94a3b8" },
      { name: "Atrasadas", value: metrics.atrasadas, color: "#f43f5e" },
    ].filter((item) => item.value > 0),
    [metrics.andamento, metrics.atrasadas, metrics.concluidas, metrics.naoIniciadas],
  );

  const [openModal, setOpenModal] = useState<OverviewModalKey>(null);

  const detailedData = useMemo<AdminOverviewDetailedData>(() => {
    const { actions: filteredActions } = filteredData;
    const hoje = new Date();

    const actionCountByMicro = new Map<string, number>();
    filteredActions.forEach((action) => {
      actionCountByMicro.set(action.microregiaoId, (actionCountByMicro.get(action.microregiaoId) || 0) + 1);
    });

    const microCoverage = MICROREGIOES.map((micro) => ({
      id: micro.id,
      nome: micro.nome,
      macrorregiao: micro.macrorregiao,
      hasActions: actionCountByMicro.has(micro.id),
      actionCount: actionCountByMicro.get(micro.id) || 0,
    })).sort((a, b) => (a.hasActions !== b.hasActions ? (a.hasActions ? -1 : 1) : a.nome.localeCompare(b.nome)));

    const objectiveProgress = [
      { id: 1, name: "Objetivo 1 - Atenção Primária", total: 0, completed: 0, percentage: 0 },
      { id: 2, name: "Objetivo 2 - Gestão Regional", total: 0, completed: 0, percentage: 0 },
      { id: 3, name: "Objetivo 3 - Transformação Digital", total: 0, completed: 0, percentage: 0 },
      { id: 4, name: "Objetivo 4 - Capacitação", total: 0, completed: 0, percentage: 0 },
    ];

    filteredActions.forEach((action) => {
      const objectiveNumber = parseInt(String(action.activityId || "1").split(".")[0], 10) || 1;
      const objectiveIndex = objectiveNumber - 1;
      if (objectiveIndex >= 0 && objectiveIndex < objectiveProgress.length) {
        objectiveProgress[objectiveIndex].total += 1;
        if (action.status === "Concluído") {
          objectiveProgress[objectiveIndex].completed += 1;
        }
      }
    });

    objectiveProgress.forEach((objective) => {
      objective.percentage = objective.total > 0 ? Math.round((objective.completed / objective.total) * 100) : 0;
    });

    const overdueActions = filteredActions
      .filter((action) => action.status !== "Concluído" && new Date(action.plannedEndDate) < hoje)
      .map((action) => ({
        uid: action.uid,
        id: action.id,
        title: action.title,
        plannedEndDate: new Date(action.plannedEndDate).toLocaleDateString("pt-BR"),
        responsible: action.raci?.find((person) => person.role === "R")?.name || "",
        daysOverdue: Math.floor((hoje.getTime() - new Date(action.plannedEndDate).getTime()) / (1000 * 60 * 60 * 24)),
      }))
      .sort((a, b) => b.daysOverdue - a.daysOverdue);

    const lateCompletions = filteredActions
      .filter((action) => {
        if (action.status !== "Concluído") return false;
        if (!action.endDate || !action.plannedEndDate) return false;
        return new Date(action.endDate) > new Date(action.plannedEndDate);
      })
      .map((action) => ({
        uid: action.uid,
        id: action.id,
        title: action.title,
        plannedEndDate: new Date(action.plannedEndDate).toLocaleDateString("pt-BR"),
        actualEndDate: new Date(action.endDate).toLocaleDateString("pt-BR"),
        responsible: action.raci?.find((person) => person.role === "R")?.name || "",
        daysLate: Math.floor((new Date(action.endDate).getTime() - new Date(action.plannedEndDate).getTime()) / (1000 * 60 * 60 * 24)),
      }))
      .sort((a, b) => (b.daysLate || 0) - (a.daysLate || 0));

    const earlyCompletions = filteredActions
      .filter((action) => {
        if (action.status !== "Concluído") return false;
        if (!action.endDate || !action.plannedEndDate) return false;
        return new Date(action.endDate) < new Date(action.plannedEndDate);
      })
      .map((action) => ({
        uid: action.uid,
        id: action.id,
        title: action.title,
        plannedEndDate: new Date(action.plannedEndDate).toLocaleDateString("pt-BR"),
        actualEndDate: new Date(action.endDate).toLocaleDateString("pt-BR"),
        responsible: action.raci?.find((person) => person.role === "R")?.name || "",
        daysEarly: Math.floor((new Date(action.plannedEndDate).getTime() - new Date(action.endDate).getTime()) / (1000 * 60 * 60 * 24)),
      }))
      .sort((a, b) => (b.daysEarly || 0) - (a.daysEarly || 0));

    return {
      objectiveProgress: objectiveProgress.filter((objective) => objective.total > 0),
      overdueActions,
      microCoverage,
      deadlineHorizonWithActions: [],
      statusWithActions: [],
      lateCompletions,
      earlyCompletions,
    };
  }, [filteredData]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <AdminOverviewKpiSection metrics={metrics} pendingCount={pendingCount} onOpenModal={setOpenModal} onTabChange={onTabChange} />

      <AdminOverviewChartsSection metrics={metrics} statusData={statusData} onOpenModal={setOpenModal}>
        {children}
      </AdminOverviewChartsSection>

      <KpiDetailModal
        type="conclusao"
        isOpen={openModal === "conclusao"}
        onClose={() => setOpenModal(null)}
        objectiveProgress={detailedData.objectiveProgress}
        totalActions={metrics.totalAcoes}
        completedActions={metrics.concluidas}
        completionRate={metrics.taxaConclusao}
      />
      <KpiDetailModal
        type="risco"
        isOpen={openModal === "risco"}
        onClose={() => setOpenModal(null)}
        overdueActions={detailedData.overdueActions}
      />
      <KpiDetailModal
        type="cobertura"
        isOpen={openModal === "cobertura"}
        onClose={() => setOpenModal(null)}
        microCoverage={detailedData.microCoverage}
        coverageRate={metrics.taxaCobertura}
        onViewMicro={onViewMicro}
      />
      <KpiDetailModal
        type="horizonte"
        isOpen={openModal === "horizonte"}
        onClose={() => setOpenModal(null)}
        deadlineHorizon={detailedData.deadlineHorizonWithActions}
      />
      <KpiDetailModal
        type="status"
        isOpen={openModal === "status"}
        onClose={() => setOpenModal(null)}
        statusData={detailedData.statusWithActions}
        totalActions={metrics.totalAcoes}
      />

      <ReprogrammedActionsModal
        isOpen={openModal === "reprogramadas"}
        onClose={() => setOpenModal(null)}
        metrics={metrics}
        detailedData={detailedData}
      />
    </div>
  );
}
