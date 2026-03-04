import type { ReactNode } from "react";

interface AnalyticsKpiCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: ReactNode;
    trend?: { value: number; isPositive: boolean };
    color: "teal" | "blue" | "purple" | "amber" | "red";
    onClick?: () => void;
}

const COLOR_CLASSES = {
    teal: "bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800",
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
    amber: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    red: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800",
} as const;

export function AnalyticsKpiCard({
    title,
    value,
    subtitle,
    icon,
    trend,
    color,
    onClick,
}: AnalyticsKpiCardProps) {
    return (
        <div
            className={`p-6 rounded-xl border ${COLOR_CLASSES[color]} transition-all hover:shadow-md ${onClick ? "cursor-pointer hover:scale-[1.02] active:scale-[0.98]" : ""
                }`}
            onClick={onClick}
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${COLOR_CLASSES[color]}`}>{icon}</div>
                {trend ? (
                    <span className={`text-sm font-medium ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
                        {trend.isPositive ? "+" : ""}
                        {trend.value}%
                    </span>
                ) : null}
                {onClick ? <span className="text-xs text-gray-400 dark:text-gray-500">Clique para detalhes</span> : null}
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</h3>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            {subtitle ? <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{subtitle}</p> : null}
        </div>
    );
}
