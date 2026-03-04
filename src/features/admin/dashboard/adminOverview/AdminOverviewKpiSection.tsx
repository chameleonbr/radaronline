import { motion } from "framer-motion";
import { AlertOctagon, BarChart3, Briefcase, CalendarClock, MapPin, Target, UserPlus } from "lucide-react";

import { MICROREGIOES } from "../../../../data/microregioes";
import { staggerContainer } from "../../../../lib/motion";
import { MetricCard } from "./MetricCard";
import type { AdminOverviewMetrics } from "./adminOverview.types";

interface AdminOverviewKpiSectionProps {
  metrics: AdminOverviewMetrics;
  pendingCount?: number;
  onOpenModal: (key: "conclusao" | "risco" | "cobertura" | "reprogramadas") => void;
  onTabChange?: (tab: "usuarios" | "ranking") => void;
}

export function AdminOverviewKpiSection({
  metrics,
  pendingCount,
  onOpenModal,
  onTabChange,
}: AdminOverviewKpiSectionProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Visão Geral</h2>
      </div>

      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Taxa de Conclusão"
          value={`${metrics.taxaConclusao}%`}
          subtitle="Meta anual: 85%"
          icon={<Target className="w-6 h-6" />}
          trend={{ value: 2.5, isPositive: true, label: "vs. mês anterior" }}
          onClick={() => onOpenModal("conclusao")}
          variant="primary"
        />

        <MetricCard
          title="Ações em Risco"
          value={metrics.atrasadas}
          subtitle="Necessitam atenção imediata"
          icon={<AlertOctagon className="w-6 h-6" />}
          trend={{ value: 12, isPositive: false, label: "vs. semana passada" }}
          onClick={() => onOpenModal("risco")}
          variant={metrics.atrasadas > 0 ? "danger" : "default"}
        />

        <MetricCard
          title="Reprogramadas"
          value={metrics.concluidasComAtraso + metrics.concluidasAntes}
          subtitle={`${metrics.concluidasAntes} antes • ${metrics.concluidasComAtraso} após o prazo`}
          icon={<CalendarClock className="w-6 h-6" />}
          onClick={() => onOpenModal("reprogramadas")}
          variant={metrics.concluidasComAtraso > 0 ? "warning" : "default"}
        />

        {pendingCount !== undefined && pendingCount > 0 ? (
          <MetricCard
            title="Cadastros Pendentes"
            value={pendingCount}
            subtitle="Aprovação necessária"
            icon={<UserPlus className="w-6 h-6" />}
            onClick={() => onTabChange?.("usuarios")}
            variant="warning"
          />
        ) : (
          <MetricCard
            title="Força de Trabalho"
            value={metrics.usuariosAtivos}
            subtitle="Usuários ativos na plataforma"
            icon={<Briefcase className="w-6 h-6" />}
            onClick={() => onTabChange?.("usuarios")}
            variant="default"
          />
        )}

        <MetricCard
          title="Cobertura Regional"
          value={`${metrics.taxaCobertura}%`}
          subtitle={`${MICROREGIOES.length} Microrregiões`}
          icon={<MapPin className="w-6 h-6" />}
          onClick={() => onOpenModal("cobertura")}
          variant="info"
        />
      </motion.div>
    </section>
  );
}
