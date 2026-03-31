import {
  Bell,
  LifeBuoy,
  Lightbulb,
  Palette,
  User as UserIcon,
  Users,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { UserSettingsTab } from '../userSettings.types';

interface UserSettingsModalNavProps {
  activeTab: UserSettingsTab;
  onClose: () => void;
  setActiveTab: (tab: UserSettingsTab) => void;
}

const SETTINGS_ITEMS: Array<{
  id: UserSettingsTab;
  label: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    id: 'profile',
    label: 'Perfil',
    description: 'Dados pessoais, micro e identificacao da conta.',
    icon: UserIcon,
  },
  {
    id: 'appearance',
    label: 'Aparencia',
    description: 'Tema, contraste e preferencia visual do app.',
    icon: Palette,
  },
  {
    id: 'notifications',
    label: 'Notificacoes',
    description: 'Alertas, retornos e recados que chegaram para voce.',
    icon: Bell,
  },
  {
    id: 'security',
    label: 'Suporte',
    description: 'Pedidos de ajuda, ajustes e contato com o time.',
    icon: LifeBuoy,
  },
  {
    id: 'roadmap',
    label: 'Roadmap',
    description: 'Sugestoes, votos e evolucao do produto.',
    icon: Lightbulb,
  },
  {
    id: 'nsdigi',
    label: 'NSDIGI',
    description: 'Equipe e creditos do Radar Minas Digital.',
    icon: Users,
  },
];

export function UserSettingsModalNav({
  activeTab,
  onClose,
  setActiveTab,
}: UserSettingsModalNavProps) {
  return (
    <div className="flex h-full flex-col border-r border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.10),_transparent_40%),linear-gradient(180deg,_rgba(248,250,252,0.96),_rgba(255,255,255,0.92))] p-2 dark:border-slate-800 dark:bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.12),_transparent_38%),linear-gradient(180deg,_rgba(2,6,23,0.98),_rgba(15,23,42,0.96))] md:p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="hidden text-[11px] font-black uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500 md:block">
          Configuracoes
        </p>

        <button
          onClick={onClose}
          aria-label="Fechar configuracoes"
          className="shrink-0 rounded-2xl border border-slate-200 bg-white/80 p-2 text-slate-400 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-500 dark:hover:border-red-900/40 dark:hover:bg-red-950/30 dark:hover:text-red-300 md:p-2.5"
          title="Fechar"
        >
          <X className="h-4 w-4 md:h-5 md:w-5" />
        </button>
      </div>

      <nav aria-label="Secoes de configuracoes" className="mt-4 flex flex-col gap-2">
        {SETTINGS_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`group w-full rounded-2xl border px-2 py-2.5 text-left transition-all md:px-3.5 md:py-3 ${
                isActive
                  ? 'border-teal-200 bg-white text-slate-900 shadow-[0_10px_30px_rgba(15,23,42,0.08)] ring-1 ring-teal-100 dark:border-teal-900/50 dark:bg-slate-900 dark:text-slate-100 dark:ring-teal-900/30'
                  : 'border-transparent bg-white/55 text-slate-600 hover:border-slate-200 hover:bg-white hover:text-slate-900 dark:bg-slate-900/35 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-900/80 dark:hover:text-slate-100'
              }`}
            >
              <div className="flex items-center justify-center gap-3 md:justify-start">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition-colors md:h-9 md:w-9 ${
                    isActive
                      ? 'border-teal-100 bg-teal-50 text-teal-600 dark:border-teal-900/40 dark:bg-teal-950/40 dark:text-teal-300'
                      : 'border-slate-200 bg-slate-50 text-slate-400 group-hover:border-slate-300 group-hover:bg-slate-100 group-hover:text-slate-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-500 dark:group-hover:border-slate-600 dark:group-hover:bg-slate-800 dark:group-hover:text-slate-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <div className="hidden min-w-0 flex-1 md:block">
                  <span className="block text-[13px] font-bold leading-5 md:text-sm">{item.label}</span>
                </div>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
