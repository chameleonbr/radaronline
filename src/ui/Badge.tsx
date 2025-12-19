import React from "react";

type BadgeProps = {
  tone?: 'default' | 'success' | 'info' | 'warning' | 'danger';
  children: React.ReactNode;
  className?: string;
};

const tones = {
  default: "bg-slate-100 text-slate-700 border border-slate-200",
  success: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  info: "bg-blue-100 text-blue-800 border border-blue-200",
  warning: "bg-amber-100 text-amber-800 border border-amber-200",
  danger: "bg-rose-100 text-rose-800 border border-rose-200",
};

export const Badge: React.FC<BadgeProps> = ({ tone = 'default', children, className = "" }) => (
  <span className={`px-2 py-1 rounded text-[11px] font-semibold inline-flex items-center gap-1 ${tones[tone]} ${className}`}>
    {children}
  </span>
);

