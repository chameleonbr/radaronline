import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    Tooltip as RechartsTooltip,
    XAxis,
    YAxis,
} from "recharts";
import { BarChart2, PieChart as PieChartIcon, Target } from "lucide-react";

import { MobileProgressChart, MobileRingProgress, MobileStatusChart } from "../../../components/mobile";
import { DASHBOARD_COLORS } from "./dashboard.constants";
import { DashboardSafeResponsiveContainer } from "./DashboardSafeResponsiveContainer";
import type { DashboardMetrics, DashboardObjectiveProgressDatum } from "./dashboard.types";

interface DashboardChartsSectionProps {
    isMobile: boolean;
    metrics: DashboardMetrics;
    onNavigateObjective: (objectiveId: number) => void;
    onStatusClick: (status?: string) => void;
}

function DashboardStatusTooltip({ active, label, payload }: any) {
    if (!active || !payload?.length) {
        return null;
    }

    return (
        <div className="bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700 shadow-lg rounded-lg text-xs">
            <p className="font-bold text-slate-800 dark:text-slate-100">{label || payload[0].name}</p>
            <p className="text-slate-600 dark:text-slate-400">{payload[0].value} {payload[0].dataKey === "progress" ? "%" : "ações"}</p>
        </div>
    );
}

function DashboardObjectiveTooltip({ active, payload }: any) {
    if (!active || !payload?.[0]) {
        return null;
    }

    const data = payload[0].payload as DashboardObjectiveProgressDatum;
    return (
        <div className="bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700 shadow-xl rounded-lg text-xs max-w-[200px]">
            <p className="font-bold text-slate-800 dark:text-slate-100 mb-1">{data.fullName}</p>
            <div className="flex justify-between gap-4">
                <span>Progresso:</span>
                <span className="font-bold text-teal-600 dark:text-teal-400">{data.progress}%</span>
            </div>
            <div className="flex justify-between gap-4">
                <span>Ações:</span>
                <span className="font-bold">{data.count}</span>
            </div>
        </div>
    );
}

export function DashboardChartsSection({ isMobile, metrics, onNavigateObjective, onStatusClick }: DashboardChartsSectionProps) {
    if (isMobile) {
        return (
            <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                        <PieChartIcon size={16} className="text-teal-500" />
                        Progresso Geral
                    </h3>
                    <div className="flex items-center justify-around">
                        <MobileRingProgress
                            color={DASHBOARD_COLORS.teal}
                            label="Conclusão"
                            size="lg"
                            sublabel={`${metrics.concluidos}/${metrics.total} ações`}
                            value={metrics.percentConcluido}
                        />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                        <BarChart2 size={16} className="text-slate-400" />
                        Status das Ações
                    </h3>
                    <MobileStatusChart data={metrics.statusData} onItemClick={onStatusClick} total={metrics.total} />
                </div>

                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                        <Target size={16} className="text-teal-500" />
                        Por Objetivo
                    </h3>
                    <MobileProgressChart data={metrics.progressoPorObjetivo} onItemClick={onNavigateObjective} />
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2 w-full flex items-center gap-2">
                    <PieChartIcon size={18} className="text-slate-400" />
                    Distribuição de Status
                </h3>
                <div className="w-full h-[250px] relative">
                    {metrics.statusData.length > 0 ? (
                        <DashboardSafeResponsiveContainer>
                            <PieChart>
                                <Pie
                                    className="cursor-pointer"
                                    cx="50%"
                                    cy="50%"
                                    data={metrics.statusData}
                                    dataKey="value"
                                    innerRadius={60}
                                    outerRadius={80}
                                    onClick={(data) => onStatusClick(data.name)}
                                    paddingAngle={5}
                                    stroke="none"
                                >
                                    {metrics.statusData.map((entry, index) => (
                                        <Cell key={`status-${index}`} className="hover:opacity-80 transition-opacity cursor-pointer" fill={entry.color} />
                                    ))}
                                </Pie>
                                <RechartsTooltip content={<DashboardStatusTooltip />} />
                                <Legend height={36} iconType="circle" verticalAlign="bottom" />
                            </PieChart>
                        </DashboardSafeResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center text-slate-400 text-sm">Sem dados para exibir</div>
                    )}

                    {metrics.statusData.length > 0 ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                            <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">{metrics.total}</span>
                            <span className="text-xs text-slate-400 font-medium uppercase">Ações</span>
                        </div>
                    ) : null}
                </div>
            </div>

            <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-6 w-full flex items-center gap-2">
                    <BarChart2 size={18} className="text-slate-400" />
                    Performance por Objetivo
                </h3>
                <div className="w-full h-[250px]">
                    {metrics.progressoPorObjetivo.length > 0 ? (
                        <DashboardSafeResponsiveContainer>
                            <BarChart
                                className="cursor-pointer"
                                data={metrics.progressoPorObjetivo}
                                layout="vertical"
                                margin={{ bottom: 5, left: 20, right: 30, top: 5 }}
                                onClick={(data: any) => {
                                    const objectiveId = data?.activePayload?.[0]?.payload?.id;
                                    if (objectiveId) {
                                        onNavigateObjective(objectiveId);
                                    }
                                }}
                            >
                                <CartesianGrid horizontal={false} stroke="rgba(148, 163, 184, 0.2)" strokeDasharray="3 3" />
                                <XAxis domain={[0, 100]} hide type="number" />
                                <YAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} type="category" width={50} />
                                <RechartsTooltip content={<DashboardObjectiveTooltip />} cursor={{ fill: "rgba(148, 163, 184, 0.1)" }} />
                                <Bar barSize={20} className="cursor-pointer" dataKey="progress" radius={[0, 4, 4, 0]}>
                                    {metrics.progressoPorObjetivo.map((entry, index) => (
                                        <Cell
                                            key={`objective-${index}`}
                                            className="hover:opacity-80 transition-opacity"
                                            fill={entry.progress === 100 ? DASHBOARD_COLORS.concluido : DASHBOARD_COLORS.teal}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </DashboardSafeResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center text-slate-400 text-sm">Sem dados para exibir</div>
                    )}
                </div>
            </div>
        </div>
    );
}
