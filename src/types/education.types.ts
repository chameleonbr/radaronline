// =====================================================
// TIPOS DO MÓDULO DE EDUCAÇÃO
// =====================================================

export type CourseLevel = 'basico' | 'intermediario' | 'avancado';
export type CourseFormat = 'online' | 'presencial' | 'hibrido';
export type CourseCategory = 'e-SUS' | 'RNDS' | 'Telessaúde' | 'Gestão' | 'Segurança' | 'Saúde Digital';

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  enrolled: number;
  category: CourseCategory;
  level: CourseLevel;
  format: CourseFormat;
  url: string | null;
  progress: number;
  createdAt: string;
}

export interface Trail {
  id: string;
  title: string;
  description: string;
  coursesCount: number;
  totalHours: number;
  enrolled: number;
  progress: number;
  createdAt: string;
}

export interface EducationStats {
  totalCourses: number;
  totalTrails: number;
  inProgress: number;
  completed: number;
}

// =====================================================
// CONFIGURAÇÕES DE DISPLAY
// =====================================================

export const LEVEL_CONFIG: Record<CourseLevel, {
  label: string;
  color: string;
  bg: string;
}> = {
  basico: {
    label: 'Básico',
    color: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
  intermediario: {
    label: 'Intermediário',
    color: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-100 dark:bg-amber-900/30',
  },
  avancado: {
    label: 'Avançado',
    color: 'text-rose-700 dark:text-rose-300',
    bg: 'bg-rose-100 dark:bg-rose-900/30',
  },
};

export const FORMAT_CONFIG: Record<CourseFormat, {
  label: string;
  color: string;
  bg: string;
}> = {
  online: {
    label: 'Online',
    color: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
  },
  presencial: {
    label: 'Presencial',
    color: 'text-purple-700 dark:text-purple-300',
    bg: 'bg-purple-100 dark:bg-purple-900/30',
  },
  hibrido: {
    label: 'Híbrido',
    color: 'text-cyan-700 dark:text-cyan-300',
    bg: 'bg-cyan-100 dark:bg-cyan-900/30',
  },
};

export const CATEGORIES: CourseCategory[] = [
  'e-SUS',
  'RNDS',
  'Telessaúde',
  'Gestão',
  'Segurança',
  'Saúde Digital',
];
