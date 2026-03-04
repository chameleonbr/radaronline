import type { LucideIcon } from "lucide-react";
import { AlertOctagon, Calendar, MapPin, PieChart as PieChartIcon, Target } from "lucide-react";

import type { KpiType } from "./kpiDetailModal.types";

export interface KpiModalConfig {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  bgGradient: string;
}

export const KPI_MODAL_CONFIGS: Record<KpiType, KpiModalConfig> = {
  conclusao: {
    title: "Taxa de Conclusão",
    subtitle: "Análise detalhada do progresso por objetivo",
    icon: Target,
    bgGradient: "from-teal-500 to-emerald-500",
  },
  risco: {
    title: "Risco de Prazo",
    subtitle: "Ações que precisam de atenção urgente",
    icon: AlertOctagon,
    bgGradient: "from-rose-500 to-red-500",
  },
  cobertura: {
    title: "Cobertura Regional",
    subtitle: "Distribuição de ações por microrregião",
    icon: MapPin,
    bgGradient: "from-blue-500 to-indigo-500",
  },
  horizonte: {
    title: "Horizonte de Prazos",
    subtitle: "Clique em cada período para ver as ações",
    icon: Calendar,
    bgGradient: "from-amber-500 to-orange-500",
  },
  status: {
    title: "Status Global",
    subtitle: "Clique em cada status para ver as ações",
    icon: PieChartIcon,
    bgGradient: "from-violet-500 to-purple-500",
  },
};
