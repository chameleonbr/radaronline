import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface DashboardKpiCardProps {
    gradient: string;
    icon: ReactNode;
    onClick?: () => void;
    subtext: string;
    title: string;
    trend?: "down" | "neutral" | "up";
    value: number | string;
}

export function DashboardKpiCard({ title, value, icon, gradient, subtext, trend, onClick }: DashboardKpiCardProps) {
    return (
        <div
            onClick={onClick}
            className={`p-5 rounded-2xl shadow-lg bg-gradient-to-br ${gradient} text-white relative overflow-hidden group hover:scale-[1.02] transition-transform ${onClick ? "cursor-pointer active:scale-95" : ""}`}
        >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none will-change-transform" />

            <div className="flex justify-between items-start relative z-10">
                <div>
                    <p className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">{title}</p>
                    <h3 className="text-3xl font-bold">{value}</h3>
                </div>
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    {icon}
                </div>
            </div>

            <div className="mt-4 flex items-center gap-2 relative z-10">
                {trend === "up" ? <div className="bg-emerald-500/20 p-0.5 rounded text-emerald-100"><ArrowUpRight size={14} /></div> : null}
                {trend === "down" ? <div className="bg-rose-500/20 p-0.5 rounded text-rose-100"><ArrowDownRight size={14} /></div> : null}
                <p className="text-xs text-white/70 font-medium">{subtext}</p>
            </div>
        </div>
    );
}
