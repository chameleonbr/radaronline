import { Activity, Clock, TrendingUp, Users, type LucideIcon } from "lucide-react";

import type { AnalyticsModalType, PeriodFilter } from "./analyticsDashboard.types";

export const PERIOD_DAYS: Record<PeriodFilter, number> = {
    today: 0,
    "7d": 7,
    "30d": 30,
    "60d": 60,
    "90d": 90,
};

export const PERIOD_LABELS: Record<PeriodFilter, string> = {
    today: "Hoje",
    "7d": "7 dias",
    "30d": "30 dias",
    "60d": "60 dias",
    "90d": "90 dias",
};

export const PERIOD_OPTIONS: PeriodFilter[] = ["today", "7d", "30d", "60d", "90d"];

export const MODAL_CONFIG: Record<
    AnalyticsModalType,
    {
        title: string;
        description: string;
        gradient: string;
        icon: LucideIcon;
    }
> = {
    users: {
        title: "Usuários Ativos",
        description: "Detalhes dos usuários ativos",
        gradient: "bg-gradient-to-r from-teal-500 to-emerald-500",
        icon: Users,
    },
    sessions: {
        title: "Sessões",
        description: "Análise de sessões do sistema",
        gradient: "bg-gradient-to-r from-blue-500 to-indigo-500",
        icon: Activity,
    },
    time: {
        title: "Tempo de Uso",
        description: "Análise de tempo médio de uso",
        gradient: "bg-gradient-to-r from-purple-500 to-violet-500",
        icon: Clock,
    },
    engagement: {
        title: "Engajamento",
        description: "Taxa de engajamento detalhada",
        gradient: "bg-gradient-to-r from-amber-500 to-orange-500",
        icon: TrendingUp,
    },
};

export function formatPageName(page: string): string {
    const names: Record<string, string> = {
        "/": "Dashboard",
        "/dashboard": "Dashboard",
        "/actions": "Ações",
        "/team": "Equipe",
        "/gantt": "Cronograma",
        "/settings": "Configurações",
        "/admin": "Admin",
        "/login": "Login",
    };

    return names[page] || page.replace(/^\//, "").replace(/-/g, " ") || "Home";
}

export function formatMinutesFromSeconds(seconds: number): string {
    return `${Math.round(seconds / 60)}min`;
}

export function getEstimatedRegisteredUsers(activeUsersTotal: number, engagementRate: number): number {
    if (engagementRate <= 0) {
        return 0;
    }

    return Math.round(activeUsersTotal / (engagementRate / 100));
}
