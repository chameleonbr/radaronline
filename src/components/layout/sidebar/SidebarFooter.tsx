import { Settings } from 'lucide-react';
import { UserRole } from '../../../types/auth.types';
import { SidebarItem } from './SidebarItem';
import { SidebarProfileSection } from './SidebarProfileSection';

interface SidebarFooterProps {
  isOpen: boolean;
  currentNav: string;
  userName?: string;
  userRole?: UserRole;
  userAvatarId?: string;
  onOpenSettings?: (mode?: 'settings' | 'avatar') => void;
  onLogout?: () => void;
}

export function SidebarFooter({
  isOpen,
  currentNav,
  userName,
  userRole,
  userAvatarId,
  onOpenSettings,
  onLogout,
}: SidebarFooterProps) {
  return (
    <div className="p-4 bg-black/30 mt-auto relative z-30 space-y-3 shadow-[0_-10px_20px_rgba(0,0,0,0.1)] border-t border-white/10">
      <div className="space-y-1">
        <SidebarItem
          icon={Settings}
          label="Configurações"
          isActive={currentNav === 'settings'}
          onClick={() => onOpenSettings?.('settings')}
          collapsed={!isOpen}
        />
      </div>

      <div className="h-px bg-white/10 w-full" />
      <SidebarProfileSection
        isOpen={isOpen}
        userName={userName}
        userRole={userRole}
        userAvatarId={userAvatarId}
        onOpenAvatarSettings={() => onOpenSettings?.('avatar')}
        onLogout={onLogout}
      />
    </div>
  );
}
