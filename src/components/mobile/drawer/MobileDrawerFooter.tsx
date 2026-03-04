import { Calendar, LogOut, Settings } from 'lucide-react';

interface MobileDrawerFooterProps {
  onCalendarClick?: () => void;
  onSettingsClick?: () => void;
  onLogout?: () => void;
}

export function MobileDrawerFooter({
  onCalendarClick,
  onSettingsClick,
  onLogout,
}: MobileDrawerFooterProps) {
  return (
    <div className="p-4 border-t border-white/10 space-y-2">
      {onCalendarClick && (
        <button
          onClick={onCalendarClick}
          className="w-full flex items-center gap-3 p-3 rounded-xl text-white/70 hover:bg-white/10 transition-colors"
        >
          <Calendar size={20} />
          <span className="font-medium">Cronograma</span>
        </button>
      )}
      {onSettingsClick && (
        <button
          onClick={onSettingsClick}
          className="w-full flex items-center gap-3 p-3 rounded-xl text-white/70 hover:bg-white/10 transition-colors"
        >
          <Settings size={20} />
          <span className="font-medium">Configurações</span>
        </button>
      )}
      {onLogout && (
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 p-3 rounded-xl text-rose-300 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Sair</span>
        </button>
      )}
    </div>
  );
}
