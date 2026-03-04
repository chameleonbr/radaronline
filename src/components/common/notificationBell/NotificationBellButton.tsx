import { Bell } from 'lucide-react';
import type { RefObject } from 'react';

interface NotificationBellButtonProps {
  buttonRef: RefObject<HTMLButtonElement>;
  className?: string;
  collapsed?: boolean;
  isOpen: boolean;
  notificationCount: number;
  onOpen: () => void;
}

export function NotificationBellButton({
  buttonRef,
  className = '',
  collapsed = false,
  isOpen,
  notificationCount,
  onOpen,
}: NotificationBellButtonProps) {
  return (
    <button
      onClick={onOpen}
      className={`
        group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 
        ${isOpen ? 'bg-white/20 text-white font-bold shadow-lg ring-1 ring-white/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-700 dark:hover:text-white font-medium'}
        ${collapsed ? 'justify-center relative w-full' : ''}
        ${className}
      `}
      title={collapsed ? 'Notificacoes' : ''}
      ref={buttonRef}
    >
      <div className="relative">
        <Bell size={20} className={collapsed ? '' : 'shrink-0'} />
        {notificationCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5 shadow-sm border border-white dark:border-slate-900">
            {notificationCount > 9 ? '9+' : notificationCount}
          </span>
        )}
      </div>
      {!collapsed && (
        <span className="truncate text-sm flex-1 text-left">Notificacoes</span>
      )}
    </button>
  );
}
