import { Activity, AlertTriangle, BarChart3, ChevronDown, Clock, MapPin } from "lucide-react";
import { Fragment, useState } from "react";

import { getMicroregiaoById } from "../../../../data/microregioes";
import type {
    ActionMetrics,
    HourlyUsage,
    InactiveMunicipality,
    RegionEngagement,
} from "../../../../types/analytics.types";
import { formatPageName } from "./analyticsDashboard.constants";

export function AnalyticsBarChart({
    data,
    title,
    maxValue,
}: {
    data: { label: string; value: number; percentage?: number }[];
    title: string;
    maxValue?: number;
}) {
    const max = maxValue || Math.max(...data.map((item) => item.value), 1);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-teal-500" />
                {title}
            </h3>
            <div className="space-y-3">
                {data.map((item, index) => (
                    <div key={`${item.label}-${index}`} className="group">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700 dark:text-gray-300 truncate max-w-[200px]" title={item.label}>
                                {item.label}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 ml-2">
                                {item.value} {item.percentage ? `(${item.percentage}%)` : ""}
                            </span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all group-hover:from-teal-400 group-hover:to-cyan-400"
                                style={{ width: `${(item.value / max) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function AnalyticsHourlyChart({ data, title }: { data: HourlyUsage[]; title: string }) {
    const maxValue = Math.max(...data.map((item) => item.count), 1);
    const chartHeight = 120;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                {title}
            </h3>
            <div className="relative" style={{ height: chartHeight + 40 }}>
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    {[0, 1, 2, 3].map((index) => (
                        <div key={index} className="border-b border-gray-100 dark:border-gray-700" />
                    ))}
                </div>

                <div className="absolute inset-0 flex items-end justify-between px-1" style={{ bottom: 20 }}>
                    {data.map((item, index) => (
                        <div
                            key={`${item.hour}-${index}`}
                            className="flex flex-col items-center group cursor-pointer"
                            style={{ width: `${100 / 24}%` }}
                        >
                            <div
                                className="w-full max-w-[12px] bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t transition-all group-hover:from-blue-400 group-hover:to-cyan-300"
                                style={{
                                    height: `${(item.count / maxValue) * chartHeight}px`,
                                    minHeight: item.count > 0 ? 4 : 0,
                                }}
                            />
                            <span className="text-[10px] text-gray-400 mt-1">{item.hour}</span>
                            <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                                {item.hour}h: {item.count} eventos
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function AnalyticsInactiveList({ municipalities }: { municipalities: InactiveMunicipality[] }) {
    if (municipalities.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    Municípios Inativos
                </h3>
                <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">Todos os municípios ativos.</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Nenhum município está inativo há mais de 7 dias.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Municípios Inativos
                <span className="ml-2 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-xs font-medium">
                    {municipalities.length}
                </span>
            </h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {municipalities.slice(0, 10).map((municipality, index) => (
                    <div
                        key={`${municipality.municipio}-${index}`}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white text-sm">{municipality.municipio}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{municipality.microregiaoId}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className={`text-sm font-medium ${municipality.daysSinceLogin > 14 ? "text-red-500" : "text-amber-500"}`}>
                                {municipality.daysSinceLogin} dias
                            </span>
                            <p className="text-xs text-gray-500">{municipality.userCount} usuário(s)</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function AnalyticsRegionTable({ regions }: { regions: RegionEngagement[] }) {
    const [expanded, setExpanded] = useState<string | null>(null);
    const validRegions = regions.filter((region) => region.microregiaoId && region.microregiaoId !== "null");
    const grouped = validRegions.reduce((accumulator, region) => {
        if (!accumulator[region.microregiaoId]) {
            accumulator[region.microregiaoId] = [];
        }
        accumulator[region.microregiaoId].push(region);
        return accumulator;
    }, {} as Record<string, RegionEngagement[]>);

    const getMicroName = (microId: string): string => {
        const micro = getMicroregiaoById(microId);
        return micro?.nome || microId;
    };

    if (Object.keys(grouped).length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-purple-500" />
                    Engajamento por Região
                </h3>
                <div className="text-center py-8">
                    <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">Nenhum dado de região disponível ainda.</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Os dados aparecerão após usuários navegarem pelo sistema.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-500" />
                Engajamento por Região
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Região</th>
                            <th className="text-center py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Usuários Ativos</th>
                            <th className="text-center py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Visualizações</th>
                            <th className="text-center py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Sessões</th>
                            <th className="text-center py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Tempo Médio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(grouped).map(([microId, municipalities]) => {
                            const total = municipalities.reduce(
                                (accumulator, municipality) => ({
                                    activeUsers: accumulator.activeUsers + municipality.activeUsers,
                                    totalViews: accumulator.totalViews + municipality.totalViews,
                                    totalSessions: accumulator.totalSessions + municipality.totalSessions,
                                    avgDuration: accumulator.avgDuration + (municipality.avgSessionDuration || 0),
                                }),
                                { activeUsers: 0, totalViews: 0, totalSessions: 0, avgDuration: 0 },
                            );
                            const avgMinutes = municipalities.length > 0 ? Math.round(total.avgDuration / municipalities.length / 60) : 0;

                            return (
                                <Fragment key={microId}>
                                    <tr
                                        className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                                        onClick={() => setExpanded(expanded === microId ? null : microId)}
                                    >
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expanded === microId ? "rotate-180" : ""}`} />
                                                <span className="font-medium text-gray-900 dark:text-white">{getMicroName(microId)}</span>
                                            </div>
                                        </td>
                                        <td className="text-center py-3 px-4 text-gray-700 dark:text-gray-300">{total.activeUsers}</td>
                                        <td className="text-center py-3 px-4 text-gray-700 dark:text-gray-300">{total.totalViews}</td>
                                        <td className="text-center py-3 px-4 text-gray-700 dark:text-gray-300">{total.totalSessions}</td>
                                        <td className="text-center py-3 px-4 text-gray-700 dark:text-gray-300">
                                            {avgMinutes > 0 ? `${avgMinutes}min` : "<1min"}
                                        </td>
                                    </tr>
                                    {expanded === microId
                                        ? municipalities
                                            .filter((municipality) => municipality.municipio)
                                            .map((municipality, index) => (
                                                <tr key={`${microId}-${municipality.municipio}-${index}`} className="bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700">
                                                    <td className="py-2 px-4 pl-10 text-sm text-gray-600 dark:text-gray-400">{municipality.municipio}</td>
                                                    <td className="text-center py-2 px-4 text-sm text-gray-600 dark:text-gray-400">{municipality.activeUsers}</td>
                                                    <td className="text-center py-2 px-4 text-sm text-gray-600 dark:text-gray-400">{municipality.totalViews}</td>
                                                    <td className="text-center py-2 px-4 text-sm text-gray-600 dark:text-gray-400">{municipality.totalSessions}</td>
                                                    <td className="text-center py-2 px-4 text-sm text-gray-600 dark:text-gray-400">
                                                        {municipality.avgSessionDuration > 0 ? `${Math.round(municipality.avgSessionDuration / 60)}min` : "<1min"}
                                                    </td>
                                                </tr>
                                            ))
                                        : null}
                                </Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function AnalyticsActionMetricsCard({ metrics }: { metrics: ActionMetrics }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-500" />
                Métricas de Ações (30 dias)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{metrics.totalCreated}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Criadas</p>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{metrics.totalUpdated}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Atualizadas</p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{metrics.totalCompleted}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Concluídas</p>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{metrics.avgCompletionDays}d</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tempo Médio</p>
                </div>
            </div>
        </div>
    );
}

export function buildTopPagesChartData(topPages: { page: string; views: number; percentage: number }[]) {
    return topPages.map((page) => ({
        label: formatPageName(page.page),
        value: page.views,
        percentage: page.percentage,
    }));
}
