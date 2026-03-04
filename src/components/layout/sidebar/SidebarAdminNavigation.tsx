import { useMemo, useState } from 'react';
import { Activity as ActivityIcon, ClipboardList, LayoutDashboard, MapPin, Megaphone, Search, Trophy, Users } from 'lucide-react';
import { getMacrorregioes, getMicroregioesByMacro } from '../../../data/microregioes';
import { SidebarItem } from './SidebarItem';
import { SidebarSectionTitle } from './SidebarSectionTitle';

interface SidebarAdminNavigationProps {
  isOpen: boolean;
  adminActiveTab?: string;
  onAdminTabChange: (tab: string) => void;
  onSelectMicroregiao?: (id: string) => void;
}

function scrollToSection(sectionId: string) {
  setTimeout(() => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }, 100);
}

export function SidebarAdminNavigation({
  isOpen,
  adminActiveTab,
  onAdminTabChange,
  onSelectMicroregiao,
}: SidebarAdminNavigationProps) {
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);
  const [microSearchTerm, setMicroSearchTerm] = useState('');

  const filteredMicrosByMacro = useMemo(() => {
    const search = microSearchTerm.toLowerCase();

    return getMacrorregioes().map(macro => ({
      macro,
      micros: getMicroregioesByMacro(macro).filter(micro =>
        micro.nome.toLowerCase().includes(search)
      ),
    })).filter(group => group.micros.length > 0);
  }, [microSearchTerm]);

  const showEmptyState = microSearchTerm.length > 0 && filteredMicrosByMacro.length === 0;

  return (
    <>
      <SidebarSectionTitle collapsed={!isOpen}>Painel Admin</SidebarSectionTitle>

      <div className="relative">
        <SidebarItem
          icon={LayoutDashboard}
          label="Dashboard"
          isActive={adminActiveTab === 'dashboard' || adminActiveTab === 'ranking'}
          onClick={() => onAdminTabChange('dashboard')}
          collapsed={!isOpen}
        />

        {isOpen && (adminActiveTab === 'dashboard' || adminActiveTab === 'ranking') && (
          <div className="ml-4 pl-3 border-l-2 border-indigo-500/30 space-y-1 mt-1 mb-2 animate-fade-in">
            <button
              onClick={() => {
                onAdminTabChange('dashboard');
                scrollToSection('analytics-section');
              }}
              className={`flex items-center gap-2 w-full text-left py-2 px-3 text-xs rounded-lg transition-all ${adminActiveTab === 'dashboard'
                ? 'bg-indigo-500/20 text-white font-bold ring-1 ring-indigo-500/30'
                : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
            >
              <ActivityIcon size={14} />
              <span>Analytics</span>
            </button>

            <button
              onClick={() => {
                onAdminTabChange('ranking');
                scrollToSection('ranking-section');
              }}
              className={`flex items-center gap-2 w-full text-left py-2 px-3 text-xs rounded-lg transition-all ${adminActiveTab === 'ranking'
                ? 'bg-amber-500/20 text-white font-bold ring-1 ring-amber-500/30'
                : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
            >
              <Trophy size={14} />
              <span>Ranking</span>
            </button>
          </div>
        )}
      </div>

      <div
        className="relative group isolate"
        onMouseEnter={() => setIsFlyoutOpen(true)}
        onMouseLeave={() => setIsFlyoutOpen(false)}
      >
        <SidebarItem
          icon={MapPin}
          label="Microrregiões"
          isActive={adminActiveTab === 'microregioes'}
          onClick={() => onAdminTabChange('microregioes')}
          collapsed={!isOpen}
        />

        <div className={`fixed ${isOpen ? 'left-[280px]' : 'left-[80px]'} top-1/2 -translate-y-1/2 w-72 h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-0 ${!isFlyoutOpen ? 'invisible opacity-0 translate-x-[-10px]' : 'visible opacity-100 translate-x-0'} transition-all duration-200 z-[9999] origin-left`}>
          <div className="sticky top-0 bg-slate-50 dark:bg-slate-800 p-3 border-b border-slate-200 dark:border-slate-700 rounded-t-xl z-10 shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                <MapPin size={18} className="text-teal-600 dark:text-teal-400" />
              </div>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Microrregiões</span>
            </div>

            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar micro..."
                value={microSearchTerm}
                onChange={(e) => setMicroSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-slate-700 dark:text-slate-200 placeholder-slate-400"
              />
            </div>
          </div>

          <div className="p-2">
            {filteredMicrosByMacro.map(({ macro, micros }) => (
              <div key={macro} className="mb-2">
                <div className="px-3 py-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{macro}</div>
                <div className="space-y-0.5">
                  {micros.map(micro => (
                    <button
                      key={micro.id}
                      onClick={() => {
                        onSelectMicroregiao?.(micro.id);
                        setIsFlyoutOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs rounded-lg text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-700 dark:hover:text-teal-400 transition-colors flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                      {micro.nome}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {showEmptyState && (
              <div className="text-center py-8 text-slate-400 text-xs">
                Nenhuma microrregião encontrada
              </div>
            )}
          </div>
        </div>
      </div>

      <SidebarItem
        icon={Users}
        label="Usuários"
        isActive={adminActiveTab === 'usuarios'}
        onClick={() => onAdminTabChange('usuarios')}
        collapsed={!isOpen}
      />
      <SidebarItem
        icon={ActivityIcon}
        label="Atividades"
        isActive={adminActiveTab === 'atividades'}
        onClick={() => onAdminTabChange('atividades')}
        collapsed={!isOpen}
      />
      <SidebarItem
        icon={ClipboardList}
        label="Solicitações"
        isActive={adminActiveTab === 'requests'}
        onClick={() => onAdminTabChange('requests')}
        collapsed={!isOpen}
      />
      <SidebarItem
        icon={Megaphone}
        label="Mural"
        isActive={adminActiveTab === 'communication'}
        onClick={() => onAdminTabChange('communication')}
        collapsed={!isOpen}
      />
    </>
  );
}
