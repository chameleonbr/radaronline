import { useMemo } from "react";

import { isAdminLike } from "../../../lib/authHelpers";
import { getTodayStr, parseDateLocal } from "../../../lib/date";
import { DASHBOARD_COLORS } from "./dashboard.constants";
import type { DashboardMetrics, DashboardProps } from "./dashboard.types";

interface DashboardUserLike {
    role?: string | null;
}

interface UseDashboardMetricsParams {
    actions: DashboardProps["actions"];
    activities: DashboardProps["activities"];
    objectives: DashboardProps["objectives"];
    team: DashboardProps["team"];
    user: DashboardUserLike | null;
}

export function useDashboardMetrics({ actions, activities, objectives, team, user }: UseDashboardMetricsParams) {
    const pendingMembers = useMemo(() => {
        return team.filter((member) => member.isRegistered === false);
    }, [team]);

    const metrics = useMemo<DashboardMetrics>(() => {
        const total = actions.length;
        const concluidos = actions.filter((action) => action.status === "Concluído").length;
        const emAndamento = actions.filter((action) => action.status === "Em Andamento").length;
        const naoIniciados = actions.filter((action) => action.status === "Não Iniciado").length;
        const atrasados = actions.filter((action) => action.status === "Atrasado").length;

        const statusData = [
            { color: DASHBOARD_COLORS.concluido, name: "Concluído", value: concluidos },
            { color: DASHBOARD_COLORS.emAndamento, name: "Em Andamento", value: emAndamento },
            { color: DASHBOARD_COLORS.naoIniciado, name: "Não Iniciado", value: naoIniciados },
            { color: DASHBOARD_COLORS.atrasado, name: "Atrasado", value: atrasados },
        ].filter((item) => item.value > 0);

        const progressoPorObjetivo = objectives.map((objective, index) => {
            const activityIds = activities[objective.id]?.map((activity) => activity.id) || [];
            const objectiveActions = actions.filter((action) => activityIds.includes(action.activityId));
            const progress = objectiveActions.length > 0
                ? Math.round(objectiveActions.reduce((sum, action) => sum + action.progress, 0) / objectiveActions.length)
                : 0;

            return {
                count: objectiveActions.length,
                fullName: objective.title,
                id: objective.id,
                name: `Obj ${index + 1}`,
                progress,
            };
        });

        const today = parseDateLocal(getTodayStr());
        const upcomingDeadlines = actions
            .filter((action) => {
                const endDate = parseDateLocal(action.plannedEndDate || action.endDate);
                if (!endDate || !today) {
                    return false;
                }

                const diffDays = (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
                return diffDays >= 0 && diffDays <= 7 && action.status !== "Concluído";
            })
            .sort((a, b) => {
                const dateA = parseDateLocal(a.plannedEndDate || a.endDate)?.getTime() || 0;
                const dateB = parseDateLocal(b.plannedEndDate || b.endDate)?.getTime() || 0;
                return dateA - dateB;
            })
            .slice(0, 5);

        const actionsByMember = team
            .map((member) => {
                const count = actions.filter((action) => {
                    return action.raci.some((entry: { name: string; role: string }) => entry.name === member.name && entry.role === "R")
                        && action.status !== "Concluído";
                }).length;

                return {
                    count,
                    fullName: member.name,
                    name: member.name.split(" ")[0],
                };
            })
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        return {
            actionsByMember,
            atrasados,
            concluidos,
            emAndamento,
            naoIniciados,
            percentConcluido: total > 0 ? Math.round((concluidos / total) * 100) : 0,
            progressoPorObjetivo,
            statusData,
            total,
            upcomingDeadlines,
        };
    }, [actions, activities, objectives, team]);

    const showPendingMembers = pendingMembers.length > 0 && (isAdminLike(user?.role ?? undefined) || user?.role === "gestor");

    return {
        metrics,
        pendingMembers,
        showPendingMembers,
    };
}
