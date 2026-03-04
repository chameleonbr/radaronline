import type { Action, Activity, Objective, TeamMember } from "../../../types";
import type { StrategicReportMetrics } from "./strategicReport.types";

export function calculateStrategicReportMetrics(
    actions: Action[],
    objectives: Objective[],
    activities: Record<number, Activity[]>,
    team: TeamMember[],
): StrategicReportMetrics {
    const total = actions.length;
    const concluidos = actions.filter((action) => action.status === "Concluído").length;
    const emAndamento = actions.filter((action) => action.status === "Em Andamento").length;
    const naoIniciados = actions.filter((action) => action.status === "Não Iniciado").length;
    const atrasados = actions.filter((action) => action.status === "Atrasado").length;

    const statusData = [
        { color: "#10b981", name: "Concluído", value: concluidos },
        { color: "#3b82f6", name: "Em Andamento", value: emAndamento },
        { color: "#94a3b8", name: "Não Iniciado", value: naoIniciados },
        { color: "#f43f5e", name: "Atrasado", value: atrasados },
    ].filter((datum) => datum.value > 0);

    const progressoPorObjetivo = objectives.map((objective) => {
        const activityIds = activities[objective.id]?.map((activity) => activity.id) || [];
        const objectiveActions = actions.filter((action) => activityIds.includes(action.activityId));
        const completed = objectiveActions.filter((action) => action.status === "Concluído").length;
        const progress = objectiveActions.length > 0
            ? Math.round(objectiveActions.reduce((sum, action) => sum + action.progress, 0) / objectiveActions.length)
            : 0;

        return {
            completed,
            count: objectiveActions.length,
            fullName: objective.title,
            id: objective.id,
            name: `Obj ${objective.id}`,
            progress,
        };
    });

    const today = new Date();
    const upcomingDeadlines = actions
        .filter((action) => {
            if (!action.plannedEndDate && !action.endDate) {
                return false;
            }

            const endDate = new Date(action.plannedEndDate || action.endDate);
            const diffDays = (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
            return diffDays >= 0 && diffDays <= 7 && action.status !== "Concluído";
        })
        .sort((actionA, actionB) => {
            const dateA = new Date(actionA.plannedEndDate || actionA.endDate).getTime();
            const dateB = new Date(actionB.plannedEndDate || actionB.endDate).getTime();
            return dateA - dateB;
        })
        .slice(0, 5);

    const actionsByMember = team
        .map((member) => {
            const count = actions.filter((action) => {
                return action.raci.some((entry) => entry.name === member.name && entry.role === "R")
                    && action.status !== "Concluído";
            }).length;

            return {
                count,
                fullName: member.name,
                name: member.name.split(" ")[0],
            };
        })
        .sort((memberA, memberB) => memberB.count - memberA.count)
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
}
