import { AlertTriangle, Clock, Activity, Loader2, TrendingUp, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { logError } from "../../../lib/logger";
import { analyticsService } from "../../../services/analyticsService";
import type { AnalyticsSummary, ActionMetrics } from "../../../types/analytics.types";
import { AnalyticsDetailsModal } from "./analytics/AnalyticsDetailsModal";
import { AnalyticsHeader } from "./analytics/AnalyticsHeader";
import {
    AnalyticsActionMetricsCard,
    AnalyticsBarChart,
    AnalyticsHourlyChart,
    AnalyticsInactiveList,
    AnalyticsRegionTable,
    buildTopPagesChartData,
} from "./analytics/AnalyticsCharts";
import { formatMinutesFromSeconds, PERIOD_DAYS } from "./analytics/analyticsDashboard.constants";
import type { ActiveUserListItem, AnalyticsModalType, PeriodFilter } from "./analytics/analyticsDashboard.types";
import { AnalyticsKpiCard } from "./analytics/AnalyticsKpiCard";

export const AnalyticsDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState<PeriodFilter>("30d");
    const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
    const [actionMetrics, setActionMetrics] = useState<ActionMetrics | null>(null);
    const [openModal, setOpenModal] = useState<AnalyticsModalType | null>(null);
    const [activeUsersList, setActiveUsersList] = useState<ActiveUserListItem[]>([]);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            let startDate: Date;
            if (period === "today") {
                startDate = new Date();
                startDate.setHours(0, 0, 0, 0);
            } else {
                startDate = new Date(Date.now() - PERIOD_DAYS[period] * 24 * 60 * 60 * 1000);
            }

            const endDate = new Date();
            const [summaryData, actionData, usersData] = await Promise.all([
                analyticsService.getSummary({ startDate, endDate }),
                analyticsService.getActionMetrics(),
                analyticsService.getActiveUsersWithDetails(startDate, endDate),
            ]);

            setSummary(summaryData);
            setActionMetrics(actionData);
            setActiveUsersList(usersData);
        } catch (error) {
            logError("AnalyticsDashboard", "Erro ao carregar analytics", error);
        } finally {
            setLoading(false);
        }
    }, [period]);

    useEffect(() => {
        void loadData();
    }, [loadData]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-teal-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Carregando analytics...</p>
                </div>
            </div>
        );
    }

    if (!summary) {
        return (
            <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Erro ao carregar dados de analytics.</p>
                <button
                    onClick={() => void loadData()}
                    className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                >
                    Tentar novamente
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <AnalyticsHeader
                period={period}
                onPeriodChange={setPeriod}
                onRefresh={() => void loadData()}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <AnalyticsKpiCard
                    title="Usuários Ativos Hoje"
                    value={summary.activeUsersToday}
                    subtitle="Acessaram o sistema hoje"
                    icon={<Users className="w-6 h-6" />}
                    color="teal"
                    onClick={() => setOpenModal("users")}
                />
                <AnalyticsKpiCard
                    title="Sessões Hoje"
                    value={summary.sessionsToday}
                    subtitle="Sessões iniciadas"
                    icon={<Activity className="w-6 h-6" />}
                    color="blue"
                    onClick={() => setOpenModal("sessions")}
                />
                <AnalyticsKpiCard
                    title="Tempo Médio"
                    value={formatMinutesFromSeconds(summary.avgSessionDuration)}
                    subtitle="Duração média de sessão"
                    icon={<Clock className="w-6 h-6" />}
                    color="purple"
                    onClick={() => setOpenModal("time")}
                />
                <AnalyticsKpiCard
                    title="Taxa de Engajamento"
                    value={`${summary.engagementRate}%`}
                    subtitle="Usuários ativos / total"
                    icon={<TrendingUp className="w-6 h-6" />}
                    color="amber"
                    onClick={() => setOpenModal("engagement")}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnalyticsBarChart
                    title="Páginas Mais Acessadas"
                    data={buildTopPagesChartData(summary.topPages)}
                />
                <AnalyticsHourlyChart title="Uso por Hora do Dia" data={summary.hourlyUsage} />
            </div>

            {actionMetrics ? <AnalyticsActionMetricsCard metrics={actionMetrics} /> : null}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnalyticsInactiveList municipalities={summary.inactiveMunicipalities} />
                <AnalyticsRegionTable regions={summary.regionEngagement} />
            </div>

            <AnalyticsDetailsModal
                openModal={openModal}
                summary={summary}
                activeUsersList={activeUsersList}
                onClose={() => setOpenModal(null)}
            />
        </div>
    );
};

export default AnalyticsDashboard;
