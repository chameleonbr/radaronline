import { Edit2, User } from 'lucide-react';
import { UserRole } from '../../../types/auth.types';
import { getAvatarUrl } from '../../../features/settings/avatarUtils';
import { getUserRoleLabel } from '../../../lib/userRole';

interface MobileDrawerProfileCardProps {
  userName?: string;
  userRole?: UserRole;
  userAvatarId?: string;
  onClick: () => void;
}

export function MobileDrawerProfileCard({
  userName,
  userRole,
  userAvatarId,
  onClick,
}: MobileDrawerProfileCardProps) {
  return (
    <button
      onClick={onClick}
      className="mx-4 mt-4 p-4 bg-white/10 rounded-xl w-[calc(100%-2rem)] text-left hover:bg-white/15 transition-colors group"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/30">
            {userAvatarId ? (
              <img
                src={getAvatarUrl(userAvatarId)}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
                <User size={24} className="text-white" />
              </div>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Edit2 size={10} className="text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold truncate">{userName || 'Usuário'}</p>
          <p className="text-xs text-teal-100/70">{getUserRoleLabel(userRole)}</p>
        </div>
      </div>
    </button>
  );
}
