import { RefreshCw } from "lucide-react";

import {
    PERIOD_LABELS,
    PERIOD_OPTIONS,
} from "./analyticsDashboard.constants";
import type { PeriodFilter } from "./analyticsDashboard.types";

interface AnalyticsHeaderProps {
    period: PeriodFilter;
    onPeriodChange: (period: PeriodFilter) => void;
    onRefresh: () => void;
}

export function AnalyticsHeader({ period, onPeriodChange, onRefresh }: AnalyticsHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h2>
                <p className="text-gray-600 dark:text-gray-400">Métricas de uso do sistema</p>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex flex-wrap bg-gray-100 dark:bg-gray-700 rounded-lg p-1 gap-1">
                    {PERIOD_OPTIONS.map((option) => (
                        <button
                            key={option}
                            onClick={() => onPeriodChange(option)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${period === option
                                ? "bg-white dark:bg-gray-600 text-teal-600 dark:text-teal-400 shadow"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                }`}
                        >
                            {PERIOD_LABELS[option]}
                        </button>
                    ))}
                </div>
                <button
                    onClick={onRefresh}
                    className="p-2 text-gray-500 hover:text-teal-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Atualizar"
                >
                    <RefreshCw className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
