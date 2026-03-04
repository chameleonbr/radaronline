import { LogOut } from 'lucide-react';
import type { UserRole } from '../../../types/auth.types';
import { getAvatarUrl } from '../../../features/settings/avatarUtils';
import { getUserRoleLabel } from '../../../lib/userRole';

interface SidebarProfileSectionProps {
  isOpen: boolean;
  userName?: string;
  userRole?: UserRole;
  userAvatarId?: string;
  onOpenAvatarSettings?: () => void;
  onLogout?: () => void;
}

export function SidebarProfileSection({
  isOpen,
  userName,
  userRole,
  userAvatarId,
  onOpenAvatarSettings,
  onLogout,
}: SidebarProfileSectionProps) {
  if (isOpen) {
    return (
      <div className="flex items-center justify-between gap-2 pt-1">
        <button
          onClick={onOpenAvatarSettings}
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 cursor-pointer text-left flex-1 group contain-layout"
          title="Meu Perfil"
        >
          <div className="relative shrink-0">
            <img
              src={getAvatarUrl(userAvatarId || 'zg10')}
              alt="User"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full bg-white border-2 border-white/30 group-hover:border-white shadow-md"
              loading="lazy"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#047857] rounded-full shadow-sm"></div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold truncate text-white leading-tight">{userName || 'Usuário'}</div>
            <div className="text-[10px] font-medium opacity-70 truncate text-white/90 uppercase tracking-wider">
              {getUserRoleLabel(userRole)}
            </div>
          </div>
        </button>

        {onLogout && (
          <button
            onClick={onLogout}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/20 transition-all text-white/60 hover:text-white hover:scale-105 border border-transparent hover:border-white/20 shadow-sm"
            title="Sair do Sistema"
          >
            <LogOut size={18} strokeWidth={2.5} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <button
        onClick={onOpenAvatarSettings}
        className="relative group outline-none"
        title="Meu Perfil"
      >
        <img
          src={getAvatarUrl(userAvatarId || 'zg10')}
          alt="User"
          width={40}
          height={40}
          className="w-10 h-10 rounded-full bg-white border-2 border-white/30 group-hover:border-white shadow-md transition-all"
          loading="lazy"
        />
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#047857] rounded-full"></div>
      </button>
    </div>
  );
}
