import React from 'react';
import { List, BarChart2, Users, Target, Menu, Shield, MapPin, Zap } from 'lucide-react';
import { Objective } from '../../types';

interface HeaderProps {
  macro: string;
  micro?: string;
  currentNav: 'strategy' | 'home' | 'settings';
  selectedObjective: number;
  objectives: Objective[];
  viewMode: 'table' | 'gantt' | 'team' | 'optimized';
  setViewMode: (mode: 'table' | 'gantt' | 'team' | 'optimized') => void;
  onMenuClick?: () => void;
  isMobile?: boolean;
  isAdmin?: boolean;
  onAdminClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  macro,
  micro,
  currentNav,
  selectedObjective,
  objectives,
  viewMode,
  setViewMode,
  onMenuClick,
  isMobile = false,
  isAdmin = false,
  onAdminClick,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center shrink-0 shadow-sm z-20">
      <div className="flex items-center gap-3">
        {/* Menu hamburger mobile */}
        {isMobile && onMenuClick && (
          <button 
            onClick={onMenuClick}
            className="p-2 -ml-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            aria-label="Abrir menu"
          >
            <Menu size={20} />
          </button>
        )}
        
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
            {micro ? (
              <>
                <span className="flex items-center gap-1 text-teal-600">
                  <MapPin size={10} />
                  {micro}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-semibold">{macro}</span>
              </>
            ) : (
              <span className="text-teal-600">{macro}</span>
            )}
          </div>
          {currentNav === 'strategy' ? (
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-0.5 flex items-center gap-1 hidden sm:flex">
                <Target size={10} /> Objetivo Estratégico
              </span>
              <h1 className="text-base sm:text-xl font-bold text-slate-800 leading-tight line-clamp-1">
                {objectives.find(o => o.id === selectedObjective)?.title}
              </h1>
            </div>
          ) : (
            <h1 className="text-base sm:text-lg font-bold text-slate-800">
              {currentNav === 'home' ? 'Visão Geral' : 'Configurações'}
            </h1>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Botão Admin (desktop) */}
        {isAdmin && !isMobile && onAdminClick && (
          <button
            onClick={onAdminClick}
            className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-xs font-medium transition-colors"
          >
            <Shield size={14} />
            Admin
          </button>
        )}

        {/* View mode tabs - responsivo - só mostra quando na estratégia */}
        {currentNav === 'strategy' && (
          <div className="flex bg-slate-100 p-0.5 sm:p-1 rounded-lg border border-slate-200" role="tablist" aria-label="Modo de visualização">
            <button 
              onClick={() => setViewMode('table')} 
              role="tab"
              aria-selected={viewMode === 'table'}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs font-medium flex items-center gap-1 sm:gap-2 transition-all ${viewMode === 'table' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <List size={14}/>
              <span className="hidden sm:inline">Tabela</span>
            </button>
            <button 
              onClick={() => setViewMode('gantt')} 
              role="tab"
              aria-selected={viewMode === 'gantt'}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs font-medium flex items-center gap-1 sm:gap-2 transition-all ${viewMode === 'gantt' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <BarChart2 size={14}/>
              <span className="hidden sm:inline">Cronograma</span>
            </button>
            <button 
              onClick={() => setViewMode('team')} 
              role="tab"
              aria-selected={viewMode === 'team'}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs font-medium flex items-center gap-1 sm:gap-2 transition-all ${viewMode === 'team' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Users size={14}/>
              <span className="hidden sm:inline">Equipe</span>
            </button>
            <button 
              onClick={() => setViewMode('optimized')} 
              role="tab"
              aria-selected={viewMode === 'optimized'}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs font-medium flex items-center gap-1 sm:gap-2 transition-all ${viewMode === 'optimized' ? 'bg-white shadow text-teal-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Zap size={14}/>
              <span className="hidden sm:inline">Visão Rápida</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
