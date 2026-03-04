import React from 'react';
import { MessagesSquare, Users, GraduationCap, FolderOpen, ArrowLeftRight } from 'lucide-react';
import { SidebarItem } from './SidebarItem';
import { SidebarSectionTitle } from './SidebarSectionTitle';

interface SidebarCommunityNavigationProps {
  isOpen: boolean;
  currentNav: string;
  onNavigate: (nav: string) => void;
  onSwitchWorkspace: () => void;
}

export const SidebarCommunityNavigation = React.memo<SidebarCommunityNavigationProps>(({
  isOpen,
  currentNav,
  onNavigate,
  onSwitchWorkspace,
}) => {
  return (
    <>
      {/* Workspace switch button */}
      <button
        onClick={onSwitchWorkspace}
        className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl w-full transition-all duration-200 mb-3 text-white/60 hover:bg-white/10 hover:text-white font-medium border border-white/10 ${isOpen ? '' : 'justify-center'}`}
        title={isOpen ? '' : 'Voltar ao Planejamento'}
      >
        <ArrowLeftRight size={16} className="shrink-0" />
        {isOpen && <span className="text-xs truncate">Voltar ao Planejamento</span>}
      </button>

      <SidebarSectionTitle collapsed={!isOpen}>Hub</SidebarSectionTitle>

      <SidebarItem
        icon={MessagesSquare}
        label="Fóruns"
        isActive={currentNav === 'forums'}
        onClick={() => onNavigate('forums')}
        collapsed={!isOpen}
      />
      <SidebarItem
        icon={Users}
        label="Mentorias"
        isActive={currentNav === 'mentorship'}
        onClick={() => onNavigate('mentorship')}
        collapsed={!isOpen}
      />
      <SidebarItem
        icon={GraduationCap}
        label="Educação"
        isActive={currentNav === 'education'}
        onClick={() => onNavigate('education')}
        collapsed={!isOpen}
      />
      <SidebarItem
        icon={FolderOpen}
        label="Repositório"
        isActive={currentNav === 'repository'}
        onClick={() => onNavigate('repository')}
        collapsed={!isOpen}
      />
    </>
  );
});
