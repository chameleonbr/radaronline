import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';

// =============================================
// MOBILE-FRIENDLY CHART COMPONENTS
// Substitui gráficos Recharts complexos em mobile
// =============================================

interface StatusData {
  name: string;
  value: number;
  color: string;
}

interface ProgressData {
  name: string;
  fullName: string;
  progress: number;
  count: number;
}

// =============================================
// DONUT CHART SIMPLIFICADO (Lista de barras)
// =============================================
interface MobileStatusChartProps {
  data: StatusData[];
  total: number;
  onItemClick?: (status: string) => void;
}

export const MobileStatusChart: React.FC<MobileStatusChartProps> = ({
  data,
  total,
  onItemClick,
}) => {
  return (
    <div className="space-y-3">
      {data.map((item, idx) => {
        const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
        
        return (
          <motion.button
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => onItemClick?.(item.name)}
            className="w-full flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow active:scale-[0.98]"
          >
            {/* Color indicator */}
            <div 
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            
            {/* Label and count */}
            <div className="flex-1 min-w-0 text-left">
              <div className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                {item.name}
              </div>
              <div className="text-xs text-slate-400">
                {item.value} {item.value === 1 ? 'ação' : 'ações'}
              </div>
            </div>
            
            {/* Percentage */}
            <div className="shrink-0 text-right">
              <span className="text-lg font-bold" style={{ color: item.color }}>
                {percentage}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-700 rounded-b-xl overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ delay: idx * 0.05 + 0.2, duration: 0.5 }}
                className="h-full"
                style={{ backgroundColor: item.color }}
              />
            </div>
          </motion.button>
        );
      })}

      {data.length === 0 && (
        <div className="text-center py-8 text-slate-400 text-sm">
          Nenhum dado disponível
        </div>
      )}
    </div>
  );
};

// =============================================
// BAR CHART SIMPLIFICADO (Barras horizontais)
// =============================================
interface MobileProgressChartProps {
  data: ProgressData[];
  onItemClick?: (objectiveId: number) => void;
}

export const MobileProgressChart: React.FC<MobileProgressChartProps> = ({
  data,
  onItemClick,
}) => {
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-emerald-500';
    if (progress >= 50) return 'bg-teal-500';
    if (progress >= 25) return 'bg-amber-500';
    return 'bg-slate-400';
  };

  const getTrend = (progress: number) => {
    if (progress >= 70) return <TrendingUp size={14} className="text-emerald-500" />;
    if (progress <= 30) return <TrendingDown size={14} className="text-rose-500" />;
    return <Minus size={14} className="text-slate-400" />;
  };

  return (
    <div className="space-y-3">
      {data.map((item, idx) => (
        <motion.button
          key={item.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          onClick={() => {
            const objId = parseInt(item.name.replace('Obj ', ''), 10);
            onItemClick?.(objId);
          }}
          className="w-full text-left p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow active:scale-[0.98]"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase shrink-0">
                {item.name}
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-300 truncate">
                {item.fullName}
              </span>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              {getTrend(item.progress)}
              <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {item.progress}%
              </span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${item.progress}%` }}
              transition={{ delay: idx * 0.05 + 0.2, duration: 0.5 }}
              className={`h-full rounded-full ${getProgressColor(item.progress)}`}
            />
          </div>
          
          <div className="flex items-center justify-between mt-1.5 text-[11px] text-slate-400">
            <span>{item.count} {item.count === 1 ? 'ação' : 'ações'}</span>
            <ChevronRight size={12} />
          </div>
        </motion.button>
      ))}

      {data.length === 0 && (
        <div className="text-center py-8 text-slate-400 text-sm">
          Nenhum objetivo encontrado
        </div>
      )}
    </div>
  );
};

// =============================================
// KPI CARD MOBILE (Compacto)
// =============================================
interface MobileKpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color?: 'teal' | 'blue' | 'rose' | 'amber' | 'slate';
  trend?: 'up' | 'down' | 'neutral';
  onClick?: () => void;
}

const colorClasses = {
  teal: 'from-teal-500 to-emerald-500 text-teal-600',
  blue: 'from-blue-500 to-indigo-500 text-blue-600',
  rose: 'from-rose-500 to-red-500 text-rose-600',
  amber: 'from-amber-500 to-orange-500 text-amber-600',
  slate: 'from-slate-600 to-slate-800 text-slate-600',
};

export const MobileKpiCard: React.FC<MobileKpiCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'teal',
  trend,
  onClick,
}) => {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full text-left p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">
            {title}
          </p>
          <p className={`text-2xl font-bold ${colorClasses[color].split(' ')[2]} dark:text-white`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
              {subtitle}
            </p>
          )}
        </div>
        
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${colorClasses[color].split(' ').slice(0, 2).join(' ')} text-white shrink-0`}>
          {icon}
        </div>
      </div>

      {trend && (
        <div className="mt-2 flex items-center gap-1 text-xs">
          {trend === 'up' && <TrendingUp size={12} className="text-emerald-500" />}
          {trend === 'down' && <TrendingDown size={12} className="text-rose-500" />}
          <span className={trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-rose-600' : 'text-slate-400'}>
            {trend === 'up' ? 'Em alta' : trend === 'down' ? 'Atenção' : 'Estável'}
          </span>
        </div>
      )}
    </motion.button>
  );
};

// =============================================
// RING PROGRESS (Alternativa ao Donut)
// =============================================
interface MobileRingProgressProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  sublabel?: string;
  color?: string;
}

export const MobileRingProgress: React.FC<MobileRingProgressProps> = ({
  value,
  size = 'md',
  label,
  sublabel,
  color = '#14b8a6',
}) => {
  const sizeConfig = {
    sm: { width: 60, stroke: 6 },
    md: { width: 80, stroke: 8 },
    lg: { width: 100, stroke: 10 },
  };

  const { width, stroke } = sizeConfig[size];
  const radius = (width - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width, height: width }}>
        {/* Background circle */}
        <svg className="transform -rotate-90" width={width} height={width}>
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-slate-100 dark:text-slate-700"
          />
          <motion.circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        
        {/* Center value */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${size === 'sm' ? 'text-sm' : size === 'md' ? 'text-lg' : 'text-2xl'}`}>
            {value}%
          </span>
        </div>
      </div>
      
      {label && (
        <span className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
        </span>
      )}
      {sublabel && (
        <span className="text-xs text-slate-400">
          {sublabel}
        </span>
      )}
    </div>
  );
};

export default {
  MobileStatusChart,
  MobileProgressChart,
  MobileKpiCard,
  MobileRingProgress,
};
