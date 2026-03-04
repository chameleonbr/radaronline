import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { TrendingDown, TrendingUp } from "lucide-react";

import { staggerItem } from "../../../../lib/motion";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: { value: number; isPositive: boolean; label?: string };
  onClick?: () => void;
  variant?: "default" | "primary" | "danger" | "warning" | "info";
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  onClick,
  variant = "default",
}: MetricCardProps) {
  const variants = {
    default: "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100",
    primary: "bg-gradient-to-br from-teal-500 to-emerald-600 border-transparent text-white",
    danger: "bg-white dark:bg-slate-800 border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400",
    warning: "bg-gradient-to-br from-amber-400 to-orange-500 border-transparent text-white",
    info: "bg-white dark:bg-slate-800 border-blue-100 dark:border-blue-900/30 text-blue-600 dark:text-blue-400",
  };

  const isSolid = variant === "primary" || variant === "warning";

  return (
    <motion.div
      variants={staggerItem}
      whileHover={onClick ? { y: -4, transition: { duration: 0.2 } } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border p-5 shadow-sm transition-all ${variants[variant]} ${onClick ? "cursor-pointer hover:shadow-md" : ""}`}
    >
      {isSolid ? <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl pointer-events-none" /> : null}

      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-xl ${isSolid ? "bg-white/20 text-white" : "bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400"}`}>
          {icon}
        </div>

        {trend ? (
          <div
            className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
              isSolid
                ? "bg-white/20 text-white"
                : trend.isPositive
                  ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                  : "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400"
            }`}
          >
            {trend.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend.value}%
          </div>
        ) : null}
      </div>

      <div className="relative z-10">
        <h3 className={`text-4xl font-bold tracking-tight mb-1 ${isSolid ? "text-white" : ""}`}>{value}</h3>
        <p className={`text-xs font-bold uppercase tracking-wider ${isSolid ? "text-white/80" : "text-slate-400 dark:text-slate-500"}`}>{title}</p>

        {subtitle || trend?.label ? (
          <div className={`mt-3 pt-3 border-t text-xs flex items-center gap-1 ${isSolid ? "border-white/20 text-white/90" : "border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400"}`}>
            {subtitle || trend?.label}
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
