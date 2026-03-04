import { Download, Maximize, Minimize, RefreshCw, Shield } from 'lucide-react';
import { NotificationBell } from '../../../components/common/NotificationBell';
import { ThemeToggle } from '../../../components/common/ThemeToggle';
import { ZoomControl } from '../../../components/common/ZoomControl';

interface AdminDesktopHeaderProps {
  isSuperAdmin: boolean;
  isLoading: boolean;
  isFullscreen: boolean;
  microregionsCount: number;
  onRefreshUsers: () => void | Promise<void>;
  onToggleFullscreen: () => void;
}

export function AdminDesktopHeader({
  isSuperAdmin,
  isLoading,
  isFullscreen,
  microregionsCount,
  onRefreshUsers,
  onToggleFullscreen,
}: AdminDesktopHeaderProps) {
  return (
    <header className="bg-white dark:bg-slate-900 sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  Painel Administrativo
                </h1>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border ${
                    isSuperAdmin
                      ? 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800'
                      : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                  }`}
                >
                  {isSuperAdmin ? 'Super Admin' : 'Admin'}
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 ml-1">
                Gerenciando {microregionsCount} microrregioes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/50 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
              <ZoomControl />

              <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />

              <button
                onClick={onRefreshUsers}
                className="p-2 text-slate-500 hover:text-teal-600 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-all"
                title="Atualizar dados"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>

              <button
                className="p-2 text-slate-500 hover:text-teal-600 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-all"
                title="Exportar relatorio"
              >
                <Download className="w-4 h-4" />
              </button>

              <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />

              <button
                onClick={onToggleFullscreen}
                className="p-2 text-slate-500 hover:text-teal-600 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-all"
                title={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>

            <div className="pl-3 border-l border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <NotificationBell />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
