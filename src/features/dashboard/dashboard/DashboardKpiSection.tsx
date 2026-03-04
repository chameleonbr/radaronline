import { Activity as ActivityIcon, AlertTriangle, Clock, Target } from "lucide-react";

import { MobileKpiCard } from "../../../components/mobile";
import type { DashboardMetrics } from "./dashboard.types";
import { DashboardKpiCard } from "./DashboardKpiCard";

interface DashboardKpiSectionProps {
    isMobile: boolean;
    metrics: DashboardMetrics;
    onCardClick: (status?: string) => void;
    onNavigateToList: () => void;
}

export function DashboardKpiSection({ isMobile, metrics, onCardClick, onNavigateToList }: DashboardKpiSectionProps) {
    if (isMobile) {
        return (
            <div className="grid grid-cols-2 gap-3">
                <MobileKpiCard
                    color="slate"
                    icon={<Target size={20} />}
                    onClick={onNavigateToList}
                    subtitle="Ações"
                    title="Total"
                    value={metrics.total}
                />
                <MobileKpiCard
                    color="teal"
                    icon={<ActivityIcon size={20} />}
                    onClick={() => onCardClick("Concluído")}
                    subtitle={`${metrics.concluidos} ações`}
                    title="Concluído"
                    trend="up"
                    value={`${metrics.percentConcluido}%`}
                />
                <MobileKpiCard
                    color="blue"
                    icon={<Clock size={20} />}
                    onClick={() => onCardClick("Em Andamento")}
                    subtitle="Ativas"
                    title="Em Execução"
                    value={metrics.emAndamento}
                />
                <MobileKpiCard
                    color={metrics.atrasados > 0 ? "rose" : "slate"}
                    icon={<AlertTriangle size={20} />}
                    onClick={() => onCardClick("Atrasado")}
                    subtitle={metrics.atrasados > 0 ? "Atrasadas" : "OK!"}
                    title="Atenção"
                    trend={metrics.atrasados > 0 ? "down" : "neutral"}
                    value={metrics.atrasados}
                />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardKpiCard
                gradient="from-slate-700 to-slate-800"
                icon={<Target size={24} className="text-white" />}
                onClick={onNavigateToList}
                subtext="Nos objetivos"
                title="Total de Ações"
                value={metrics.total}
            />
            <DashboardKpiCard
                gradient="from-teal-500 to-emerald-500"
                icon={<ActivityIcon size={24} className="text-white" />}
                onClick={() => onCardClick("Concluído")}
                subtext={`${metrics.concluidos} concluídas`}
                title="Conclusão Geral"
                trend="up"
                value={`${metrics.percentConcluido}%`}
            />
            <DashboardKpiCard
                gradient="from-blue-500 to-indigo-500"
                icon={<Clock size={24} className="text-white" />}
                onClick={() => onCardClick("Em Andamento")}
                subtext="Ações ativas agora"
                title="Em Execução"
                value={metrics.emAndamento}
            />
            <DashboardKpiCard
                gradient={metrics.atrasados > 0 ? "from-rose-500 to-red-600" : "from-slate-400 to-slate-500"}
                icon={<AlertTriangle size={24} className="text-white" />}
                onClick={() => onCardClick("Atrasado")}
                subtext={metrics.atrasados > 0 ? "Ações atrasadas" : "Tudo dentro do prazo!"}
                title="Atenção Necessária"
                trend={metrics.atrasados > 0 ? "down" : "neutral"}
                value={metrics.atrasados}
            />
        </div>
    );
}
