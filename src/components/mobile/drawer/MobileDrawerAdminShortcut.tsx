import { Shield } from 'lucide-react';

interface MobileDrawerAdminShortcutProps {
  onClick: () => void;
}

export function MobileDrawerAdminShortcut({ onClick }: MobileDrawerAdminShortcutProps) {
  return (
    <div className="px-4 mt-3">
      <button
        onClick={onClick}
        className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-indigo-500/30 to-purple-500/30 border border-indigo-400/30 text-white hover:from-indigo-500/50 hover:to-purple-500/50 transition-all"
      >
        <Shield size={20} />
        <span className="font-semibold">Painel Administrativo</span>
      </button>
    </div>
  );
}
