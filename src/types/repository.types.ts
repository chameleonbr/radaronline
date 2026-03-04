// =====================================================
// TIPOS DO MÓDULO DE REPOSITÓRIO
// =====================================================

export type MaterialType = 'video' | 'manual' | 'faq' | 'template' | 'legislacao';
export type MaterialCategory = 'e-SUS' | 'RNDS' | 'Telessaúde' | 'Gestão' | 'Legislação';

export interface Material {
  id: string;
  title: string;
  description: string;
  type: MaterialType;
  category: MaterialCategory;
  author: string;
  fileUrl: string | null;
  fileSize: number | null;
  downloads: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export const MATERIAL_TYPE_CONFIG: Record<MaterialType, {
  label: string;
  icon: string;
  color: string;
  bg: string;
}> = {
  video: {
    label: 'Vídeo',
    icon: 'Video',
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-100 dark:bg-rose-900/30',
  },
  manual: {
    label: 'Manual',
    icon: 'FileText',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
  },
  faq: {
    label: 'FAQ',
    icon: 'HelpCircle',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-900/30',
  },
  template: {
    label: 'Template',
    icon: 'FileCheck',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
  legislacao: {
    label: 'Legislação',
    icon: 'BookOpen',
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-100 dark:bg-purple-900/30',
  },
};

export const MATERIAL_CATEGORIES: MaterialCategory[] = [
  'e-SUS',
  'RNDS',
  'Telessaúde',
  'Gestão',
  'Legislação',
];
