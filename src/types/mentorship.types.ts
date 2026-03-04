// =====================================================
// TIPOS DO MÓDULO DE MENTORIAS
// =====================================================

export type MentorshipSessionStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type MentorshipSessionType = 'diagnostic' | 'practical' | 'evaluation';

export type MentorshipSpecialty =
  | 'esus_ab'
  | 'esus_regulacao'
  | 'telessaude'
  | 'seguranca_lgpd'
  | 'rnds'
  | 'implementacao'
  | 'outros';

export type MatchStatus = 'pending' | 'active' | 'paused' | 'completed' | 'cancelled';
export type JourneyPhase = 'diagnostic' | 'practical' | 'evaluation';

// =====================================================
// INTERFACES
// =====================================================

export interface MentorProfile {
  id: string;
  fullName: string | null;
  avatarUrl: string | null;
  jobTitle: string | null;
}

export interface Mentor {
  id: string;
  userId: string;
  bio: string | null;
  yearsExperience: number;
  municipality: string | null;
  organization: string | null;
  specialties: MentorshipSpecialty[];
  maxMentees: number;
  currentMentees: number;
  isActive: boolean;
  isVerified: boolean;
  totalSessions: number;
  totalHours: number;
  avgRating: number;
  ratingCount: number;
  linkedinUrl: string | null;
  availabilityNotes: string | null;
  createdAt: string;
  updatedAt: string;
  profile?: MentorProfile;
  availability?: MentorAvailability[];
}

export interface MentorAvailability {
  id: string;
  mentorId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface Mentee {
  id: string;
  userId: string;
  municipality: string | null;
  organization: string | null;
  jobRole: string | null;
  experienceLevel: string;
  learningGoals: string | null;
  knowledgeGaps: MentorshipSpecialty[];
  totalSessions: number;
  totalHours: number;
  createdAt: string;
  profile?: MentorProfile;
}

export interface MentorshipMatch {
  id: string;
  mentorId: string;
  menteeId: string;
  status: MatchStatus;
  matchScore: number | null;
  matchedSpecialties: MentorshipSpecialty[];
  startDate: string | null;
  endDate: string | null;
  goals: string | null;
  currentPhase: JourneyPhase;
  phaseProgress: number;
  createdAt: string;
  mentor?: Mentor;
  mentee?: Mentee;
  sessions?: MentorshipSession[];
  goalsList?: MentorshipGoal[];
}

export interface MentorshipSession {
  id: string;
  matchId: string;
  sessionType: MentorshipSessionType;
  sessionNumber: number;
  scheduledAt: string;
  durationMinutes: number;
  status: MentorshipSessionStatus;
  meetingLink: string | null;
  agenda: string | null;
  notes: string | null;
  rating: number | null;
  skillsPracticed: MentorshipSpecialty[];
  actionItems: string[];
  completedAt: string | null;
  createdAt: string;
}

export interface MentorshipGoal {
  id: string;
  matchId: string;
  title: string;
  description: string | null;
  specialty: MentorshipSpecialty | null;
  targetDate: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  progressPercentage: number;
  completedAt: string | null;
  createdAt: string;
}

export interface MentorshipBadge {
  id: string;
  userId: string;
  badgeType: string;
  badgeName: string;
  badgeDescription: string | null;
  badgeIcon: string | null;
  earnedAt: string;
  specialty: MentorshipSpecialty | null;
}

// =====================================================
// CONFIGURAÇÕES DE DISPLAY
// =====================================================

export const SPECIALTY_CONFIG: Record<MentorshipSpecialty, {
  label: string;
  icon: string;
  color: string;
  bg: string;
  description: string;
}> = {
  esus_ab: {
    label: 'e-SUS AB',
    icon: '🏥',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    description: 'Implementação e uso do e-SUS AB',
  },
  esus_regulacao: {
    label: 'e-SUS Regulação',
    icon: '📋',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    description: 'Regulação de consultas e agendamentos',
  },
  telessaude: {
    label: 'Telessaúde',
    icon: '🖥️',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    description: 'Teleconsultoria e telemedicina',
  },
  seguranca_lgpd: {
    label: 'Segurança & LGPD',
    icon: '🔒',
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-100 dark:bg-rose-900/30',
    description: 'Proteção de dados e conformidade',
  },
  rnds: {
    label: 'RNDS',
    icon: '🔗',
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    description: 'Rede Nacional de Dados em Saúde',
  },
  implementacao: {
    label: 'Implementação',
    icon: '📈',
    color: 'text-cyan-600 dark:text-cyan-400',
    bg: 'bg-cyan-100 dark:bg-cyan-900/30',
    description: 'Gestão de mudança e capacitação',
  },
  outros: {
    label: 'Outros',
    icon: '📌',
    color: 'text-slate-600 dark:text-slate-400',
    bg: 'bg-slate-100 dark:bg-slate-800',
    description: 'Outras especialidades',
  },
};

export const JOURNEY_PHASE_CONFIG: Record<JourneyPhase, {
  label: string;
  icon: string;
  color: string;
  bg: string;
  description: string;
  duration: string;
}> = {
  diagnostic: {
    label: 'Diagnóstico',
    icon: '🔍',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    description: 'Identificação de lacunas e definição de metas',
    duration: '1-2 sessões',
  },
  practical: {
    label: 'Capacitação Prática',
    icon: '💪',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    description: 'Hands-on nos sistemas e-SUS',
    duration: '4-8 sessões',
  },
  evaluation: {
    label: 'Avaliação Final',
    icon: '🎯',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    description: 'Medição do progresso e feedback',
    duration: '1-2 sessões',
  },
};

export const BADGE_CONFIG: Record<string, {
  name: string;
  icon: string;
  description: string;
  requirement: string;
}> = {
  first_session: { name: 'Primeira Sessão', icon: '🎉', description: 'Completou sua primeira sessão', requirement: '1 sessão' },
  five_sessions: { name: 'Dedicado', icon: '⭐', description: 'Completou 5 sessões', requirement: '5 sessões' },
  ten_sessions: { name: 'Experiente', icon: '🌟', description: 'Completou 10 sessões', requirement: '10 sessões' },
  first_goal: { name: 'Objetivo Alcançado', icon: '🎯', description: 'Completou sua primeira meta', requirement: '1 meta' },
  high_rating: { name: 'Excelência', icon: '💎', description: 'Avaliação 5 estrelas', requirement: '5.0' },
  journey_complete: { name: 'Jornada Completa', icon: '🏆', description: 'Completou toda a jornada', requirement: '3 fases' },
  mentor_verified: { name: 'Verificado', icon: '✅', description: 'Mentor verificado', requirement: 'Verificação' },
  specialty_master: { name: 'Especialista', icon: '🎓', description: 'Dominou uma especialidade', requirement: 'Aprovação' },
};

export const SESSION_STATUS_CONFIG: Record<MentorshipSessionStatus, {
  label: string;
  color: string;
  bg: string;
}> = {
  pending: { label: 'Pendente', color: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  confirmed: { label: 'Confirmada', color: 'text-blue-700 dark:text-blue-300', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  in_progress: { label: 'Em Andamento', color: 'text-purple-700 dark:text-purple-300', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  completed: { label: 'Concluída', color: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  cancelled: { label: 'Cancelada', color: 'text-slate-500 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800' },
  no_show: { label: 'Não Compareceu', color: 'text-rose-700 dark:text-rose-300', bg: 'bg-rose-100 dark:bg-rose-900/30' },
};

export const DAY_OF_WEEK_LABELS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
