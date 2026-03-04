import { BarChart2, Calendar, CheckCircle, Menu, MessageCircle, Rocket, Sparkles, Target, Users } from 'lucide-react';

import type { OnboardingStep } from './onboardingTour.types';

export const ONBOARDING_TOUR_STEPS: OnboardingStep[] = [
  {
    description: 'Este é o seu painel de gestão estratégica. Vamos fazer um tour rápido pelas principais funcionalidades.',
    icon: <Sparkles className="text-amber-500" size={28} />,
    id: 'welcome',
    position: 'center',
    title: 'Bem-vindo ao Radar! 🎯',
  },
  {
    action: 'Clique nos objetivos para expandir as atividades.',
    description: 'Aqui você encontra os Objetivos e Atividades organizados. Clique para navegar entre diferentes níveis do planejamento.',
    icon: <Menu className="text-teal-500" size={28} />,
    id: 'sidebar',
    position: 'right',
    targetSelector: '[data-tour="sidebar"], aside, .sidebar-container',
    title: 'Menu de Navegação',
  },
  {
    description: 'Alterne entre visualizações (Ações, Cronograma, Equipe), filtre dados e acesse configurações.',
    icon: <Target className="text-blue-500" size={28} />,
    id: 'header',
    position: 'bottom',
    targetSelector: '[data-tour="header"], header',
    title: 'Barra de Controle',
  },
  {
    action: 'Clique em qualquer ação para expandir detalhes.',
    description: 'Cada linha representa uma ação. Clique para ver detalhes, editar progresso ou adicionar comentários.',
    icon: <CheckCircle className="text-emerald-500" size={28} />,
    id: 'actions',
    position: 'top',
    targetSelector: '[data-tour="actions-table"], table, .action-table',
    title: 'Tabela de Ações',
  },
  {
    action: 'Use o seletor de visualização para alternar.',
    description: 'Mude para o modo Cronograma para ver as ações em formato de timeline visual.',
    icon: <Calendar className="text-indigo-500" size={28} />,
    id: 'gantt',
    position: 'bottom',
    targetSelector: '[data-tour="view-mode"]',
    title: 'Visualização Cronograma',
  },
  {
    description: 'Visualize sua equipe e atribua responsabilidades usando a matriz RAI (Responsável, Aprovador, Informado).',
    icon: <Users className="text-purple-500" size={28} />,
    id: 'team',
    position: 'center',
    title: 'Gestão de Equipe',
  },
  {
    description: 'Acompanhe o progresso geral com gráficos interativos. Identifique rapidamente ações atrasadas.',
    icon: <BarChart2 className="text-rose-500" size={28} />,
    id: 'dashboard',
    position: 'center',
    title: 'Dashboard de Métricas',
  },
  {
    description: 'Adicione comentários nas ações e mencione colegas usando @nome para notificá-los.',
    icon: <MessageCircle className="text-teal-500" size={28} />,
    id: 'comments',
    position: 'center',
    title: 'Sistema de Comentários',
  },
  {
    description: 'Agora você conhece as principais funcionalidades. Explore o sistema e qualquer dúvida, procure seu gestor!',
    icon: <Rocket className="text-teal-500" size={28} />,
    id: 'complete',
    position: 'center',
    title: 'Pronto para começar! 🚀',
  },
];

export const ONBOARDING_TOUR_STYLES = `
  .onboarding-highlight {
    position: relative !important;
    z-index: 9998 !important;
    pointer-events: auto !important;
  }

  @keyframes onboarding-pulse {
    0%, 100% {
      box-shadow: 0 0 0 4px rgba(20, 184, 166, 0.3), 0 0 40px rgba(20, 184, 166, 0.5), inset 0 0 20px rgba(20, 184, 166, 0.1);
      transform: scale(1);
    }
    50% {
      box-shadow: 0 0 0 8px rgba(20, 184, 166, 0.15), 0 0 60px rgba(20, 184, 166, 0.7), inset 0 0 30px rgba(20, 184, 166, 0.15);
      transform: scale(1.01);
    }
  }
`;
