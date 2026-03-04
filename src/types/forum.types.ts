// =====================================================
// FORUM DOMAIN TYPES
// =====================================================

export type ForumTopicType = 'problem_solution' | 'best_practice' | 'qa' | 'announcement';
export type ForumTopicStatus = 'open' | 'resolved' | 'awaiting_feedback' | 'validated' | 'archived';

export interface Forum {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  moderatorId: string | null;
  faqContent: string | null;
  rules: string | null;
  slaHours: number;
  topicsCount: number;
  membersCount: number;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ForumTag {
  id: string;
  forumId: string;
  name: string;
  slug: string;
  color: string;
  usageCount: number;
  createdAt: string;
}

export interface ForumTopic {
  id: string;
  forumId: string;
  authorId: string;
  title: string;
  content: string;
  topicType: ForumTopicType;
  status: ForumTopicStatus;
  isPinned: boolean;
  isFeatured: boolean;
  isLocked: boolean;
  bestReplyId: string | null;
  viewsCount: number;
  repliesCount: number;
  votesScore: number;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  author?: ForumAuthor;
  tags?: ForumTag[];
}

export interface ForumReply {
  id: string;
  topicId: string;
  authorId: string;
  parentReplyId: string | null;
  content: string;
  isAccepted: boolean;
  votesScore: number;
  createdAt: string;
  updatedAt: string;
  author?: ForumAuthor;
}

export interface ForumAuthor {
  id: string;
  fullName: string | null;
  avatarId?: string | null;
  avatarUrl: string | null;
}

export interface ForumVote {
  id: string;
  userId: string;
  topicId: string | null;
  replyId: string | null;
  voteValue: -1 | 1;
  createdAt: string;
}

export interface ForumExpert {
  id: string;
  userId: string;
  forumId: string;
  helpfulRepliesCount: number;
  acceptanceRate: number;
  isVerified: boolean;
  createdAt: string;
  user?: ForumAuthor;
}

export interface ForumMember {
  id: string;
  userId: string;
  forumId: string;
  acceptedRules: boolean;
  acceptedRulesAt: string | null;
  createdAt: string;
}

// =====================================================
// DISPLAY CONFIG
// =====================================================

export const TOPIC_TYPE_CONFIG: Record<ForumTopicType, {
  label: string;
  icon: string;
  color: string;
  bgLight: string;
  bgDark: string;
}> = {
  problem_solution: {
    label: 'Problema e solucao',
    icon: 'PS',
    color: 'text-amber-700 dark:text-amber-300',
    bgLight: 'bg-amber-50',
    bgDark: 'dark:bg-amber-900/20',
  },
  best_practice: {
    label: 'Boa pratica',
    icon: 'BP',
    color: 'text-emerald-700 dark:text-emerald-300',
    bgLight: 'bg-emerald-50',
    bgDark: 'dark:bg-emerald-900/20',
  },
  qa: {
    label: 'Pergunta',
    icon: 'QA',
    color: 'text-sky-700 dark:text-sky-300',
    bgLight: 'bg-sky-50',
    bgDark: 'dark:bg-sky-900/20',
  },
  announcement: {
    label: 'Aviso',
    icon: 'AV',
    color: 'text-violet-700 dark:text-violet-300',
    bgLight: 'bg-violet-50',
    bgDark: 'dark:bg-violet-900/20',
  },
};

export const TOPIC_STATUS_CONFIG: Record<ForumTopicStatus, {
  label: string;
  color: string;
  bg: string;
}> = {
  open: {
    label: 'Aberto',
    color: 'text-sky-700 dark:text-sky-300',
    bg: 'bg-sky-100 dark:bg-sky-900/30',
  },
  resolved: {
    label: 'Resolvido',
    color: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
  awaiting_feedback: {
    label: 'Aguardando retorno',
    color: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-100 dark:bg-amber-900/30',
  },
  validated: {
    label: 'Validado',
    color: 'text-teal-700 dark:text-teal-300',
    bg: 'bg-teal-100 dark:bg-teal-900/30',
  },
  archived: {
    label: 'Arquivado',
    color: 'text-slate-500 dark:text-slate-400',
    bg: 'bg-slate-100 dark:bg-slate-800',
  },
};
