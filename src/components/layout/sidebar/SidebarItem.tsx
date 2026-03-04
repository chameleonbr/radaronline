import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { buttonTap, staggerItem } from '../../../lib/motion';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
  collapsed: boolean;
  badge?: string;
}

export const SidebarItem: React.FC<SidebarItemProps> = React.memo(({
  icon: Icon,
  label,
  isActive,
  onClick,
  collapsed,
  badge,
}) => (
  <motion.button
    variants={staggerItem}
    whileTap={buttonTap}
    onClick={onClick}
    className={`group flex items-center gap-3 px-3 py-3 rounded-xl w-full transition-all duration-200 mb-1.5 ${isActive ? 'bg-white/20 text-white font-bold shadow-lg ring-1 ring-white/20' : 'text-white/70 hover:bg-white/10 hover:text-white font-medium'} ${collapsed ? 'justify-center' : ''}`}
    title={collapsed ? label : ''}
  >
    <Icon size={20} className="shrink-0" />
    {!collapsed && (
      <span className="truncate text-sm flex-1 text-left">{label}</span>
    )}
    {!collapsed && badge && (
      <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-500 text-white rounded-full shadow-sm">
        {badge}
      </span>
    )}
  </motion.button>
));
