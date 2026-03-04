import type { Forum, ForumExpert, ForumReply, ForumTopic, ForumTopicType, ForumVote } from '../types/forum.types';

const STORAGE_KEY = 'hub:forum:fallback-store';
const UPDATE_EVENT = 'hub:forum:fallback-updated';

interface ForumFallbackStore {
  version: 1;
  forums: Forum[];
  topics: ForumTopic[];
  replies: ForumReply[];
  votes: ForumVote[];
}

function nowIso(): string {
  return new Date().toISOString();
}

function generateId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function buildSeedForums(): Forum[] {
  const now = nowIso();

  return [
    {
      id: 'forum-global',
      name: 'Radar Estado',
      slug: 'global-radar-estado',
      description: 'Comunicados amplos, duvidas transversais e boas praticas de interesse estadual.',
      icon: 'GL',
      color: '#0ea5e9',
      moderatorId: null,
      faqContent: null,
      rules: null,
      slaHours: 24,
      topicsCount: 0,
      membersCount: 0,
      isActive: true,
      displayOrder: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'forum-micro',
      name: 'Colaboracao da Microrregiao',
      slug: 'micro-colaboracao-territorial',
      description: 'Troca regional entre municipios da mesma microrregiao para apoio de implantacao e alinhamento.',
      icon: 'MR',
      color: '#14b8a6',
      moderatorId: null,
      faqContent: null,
      rules: null,
      slaHours: 24,
      topicsCount: 0,
      membersCount: 0,
      isActive: true,
      displayOrder: 2,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'forum-municipality',
      name: 'Operacao do Municipio',
      slug: 'municipio-operacao-local',
      description: 'Espaco curto para combinados locais, duvidas operacionais e alinhamento da equipe municipal.',
      icon: 'MU',
      color: '#f59e0b',
      moderatorId: null,
      faqContent: null,
      rules: null,
      slaHours: 12,
      topicsCount: 0,
      membersCount: 0,
      isActive: true,
      displayOrder: 3,
      createdAt: now,
      updatedAt: now,
    },
  ];
}

function createInitialStore(): ForumFallbackStore {
  return {
    version: 1,
    forums: buildSeedForums(),
    topics: [],
    replies: [],
    votes: [],
  };
}

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function cloneStore(store: ForumFallbackStore): ForumFallbackStore {
  return {
    version: 1,
    forums: store.forums.map(forum => ({ ...forum })),
    topics: store.topics.map(topic => ({ ...topic, author: undefined, tags: undefined })),
    replies: store.replies.map(reply => ({ ...reply, author: undefined })),
    votes: store.votes.map(vote => ({ ...vote })),
  };
}

function withDerivedCounts(store: ForumFallbackStore): ForumFallbackStore {
  const forumTopicsMap = new Map<string, ForumTopic[]>();

  for (const topic of store.topics) {
    const bucket = forumTopicsMap.get(topic.forumId) || [];
    bucket.push(topic);
    forumTopicsMap.set(topic.forumId, bucket);
  }

  const nextForums = store.forums.map(forum => {
    const topics = forumTopicsMap.get(forum.id) || [];
    const topicIds = new Set(topics.map(topic => topic.id));
    const members = new Set<string>();

    for (const topic of topics) {
      if (topic.authorId) {
        members.add(topic.authorId);
      }
    }

    for (const reply of store.replies) {
      if (topicIds.has(reply.topicId) && reply.authorId) {
        members.add(reply.authorId);
      }
    }

    const topicUpdates = topics
      .map(topic => topic.updatedAt || topic.createdAt)
      .sort();
    const latestTopicUpdate = topicUpdates[topicUpdates.length - 1];

    return {
      ...forum,
      topicsCount: topics.length,
      membersCount: members.size,
      updatedAt: latestTopicUpdate || forum.updatedAt,
    };
  });

  return {
    ...store,
    forums: nextForums,
  };
}

export function readForumFallbackStore(): ForumFallbackStore {
  if (!canUseStorage()) {
    return createInitialStore();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      const seededStore = createInitialStore();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seededStore));
      return seededStore;
    }

    const parsed = JSON.parse(raw) as Partial<ForumFallbackStore>;

    if (!Array.isArray(parsed.forums) || !Array.isArray(parsed.topics) || !Array.isArray(parsed.replies) || !Array.isArray(parsed.votes)) {
      const seededStore = createInitialStore();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seededStore));
      return seededStore;
    }

    return withDerivedCounts({
      version: 1,
      forums: parsed.forums as Forum[],
      topics: parsed.topics as ForumTopic[],
      replies: parsed.replies as ForumReply[],
      votes: parsed.votes as ForumVote[],
    });
  } catch {
    return createInitialStore();
  }
}

function notifyForumFallbackUpdated() {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
}

export function writeForumFallbackStore(store: ForumFallbackStore, options?: { notify?: boolean }) {
  const nextStore = withDerivedCounts(cloneStore(store));

  if (canUseStorage()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextStore));
  }

  if (options?.notify !== false) {
    notifyForumFallbackUpdated();
  }
}

export function subscribeToForumFallbackUpdates(callback: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const handleUpdate = () => callback();
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      callback();
    }
  };

  window.addEventListener(UPDATE_EVENT, handleUpdate);
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener(UPDATE_EVENT, handleUpdate);
    window.removeEventListener('storage', handleStorage);
  };
}

export function getFallbackForums(): Forum[] {
  return readForumFallbackStore().forums
    .filter(forum => forum.isActive)
    .sort((left, right) => left.displayOrder - right.displayOrder);
}

export function getFallbackForumBySlug(slug: string): Forum | null {
  return readForumFallbackStore().forums.find(forum => forum.slug === slug) || null;
}

export function getFallbackTopics(forumId: string): ForumTopic[] {
  return readForumFallbackStore().topics
    .filter(topic => topic.forumId === forumId)
    .sort((left, right) => new Date(right.updatedAt || right.createdAt).getTime() - new Date(left.updatedAt || left.createdAt).getTime());
}

export function getFallbackTopic(topicId: string): ForumTopic | null {
  return readForumFallbackStore().topics.find(topic => topic.id === topicId) || null;
}

export function getFallbackReplies(topicId: string): ForumReply[] {
  return readForumFallbackStore().replies
    .filter(reply => reply.topicId === topicId)
    .sort((left, right) => {
      if (left.isAccepted !== right.isAccepted) {
        return Number(right.isAccepted) - Number(left.isAccepted);
      }

      if (left.votesScore !== right.votesScore) {
        return right.votesScore - left.votesScore;
      }

      return new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
    });
}

export function incrementFallbackTopicViews(topicId: string) {
  const store = readForumFallbackStore();
  const topic = store.topics.find(entry => entry.id === topicId);

  if (!topic) {
    return;
  }

  topic.viewsCount += 1;
  topic.updatedAt = nowIso();
  writeForumFallbackStore(store, { notify: false });
}

export function getFallbackExperts(forumId: string): ForumExpert[] {
  const store = readForumFallbackStore();
  const forumTopics = store.topics.filter(topic => topic.forumId === forumId);
  const topicIds = new Set(forumTopics.map(topic => topic.id));
  const expertMap = new Map<string, ForumExpert>();

  for (const reply of store.replies) {
    if (!topicIds.has(reply.topicId)) {
      continue;
    }

    const existing = expertMap.get(reply.authorId);
    const helpfulRepliesCount = (existing?.helpfulRepliesCount || 0) + 1;
    const acceptedRepliesCount = (existing?.acceptanceRate || 0) + (reply.isAccepted ? 1 : 0);

    expertMap.set(reply.authorId, {
      id: `expert-${forumId}-${reply.authorId}`,
      userId: reply.authorId,
      forumId,
      helpfulRepliesCount,
      acceptanceRate: acceptedRepliesCount,
      isVerified: helpfulRepliesCount >= 2 || reply.isAccepted,
      createdAt: reply.createdAt,
    });
  }

  return [...expertMap.values()]
    .filter(expert => expert.isVerified)
    .sort((left, right) => right.helpfulRepliesCount - left.helpfulRepliesCount)
    .slice(0, 10);
}

export function createFallbackTopic(input: {
  forumId: string;
  authorId: string;
  title: string;
  content: string;
  topicType: ForumTopicType;
}): string {
  const store = readForumFallbackStore();
  const now = nowIso();
  const topicId = generateId('topic');

  store.topics.unshift({
    id: topicId,
    forumId: input.forumId,
    authorId: input.authorId,
    title: input.title,
    content: input.content,
    topicType: input.topicType,
    status: 'open',
    isPinned: false,
    isFeatured: false,
    isLocked: false,
    bestReplyId: null,
    viewsCount: 0,
    repliesCount: 0,
    votesScore: 0,
    expiresAt: null,
    createdAt: now,
    updatedAt: now,
  });

  writeForumFallbackStore(store);
  return topicId;
}

export function createFallbackReply(input: {
  topicId: string;
  authorId: string;
  content: string;
  parentReplyId?: string;
}): boolean {
  const store = readForumFallbackStore();
  const topic = store.topics.find(entry => entry.id === input.topicId);

  if (!topic) {
    return false;
  }

  const now = nowIso();

  store.replies.push({
    id: generateId('reply'),
    topicId: input.topicId,
    authorId: input.authorId,
    parentReplyId: input.parentReplyId || null,
    content: input.content,
    isAccepted: false,
    votesScore: 0,
    createdAt: now,
    updatedAt: now,
  });

  topic.repliesCount += 1;
  topic.updatedAt = now;
  writeForumFallbackStore(store);
  return true;
}

export function acceptFallbackReply(topicId: string, replyId: string): boolean {
  const store = readForumFallbackStore();
  const topic = store.topics.find(entry => entry.id === topicId);

  if (!topic) {
    return false;
  }

  let found = false;

  for (const reply of store.replies) {
    if (reply.topicId !== topicId) {
      continue;
    }

    reply.isAccepted = reply.id === replyId;
    if (reply.id === replyId) {
      found = true;
      reply.updatedAt = nowIso();
    }
  }

  if (!found) {
    return false;
  }

  topic.bestReplyId = replyId;
  topic.status = 'resolved';
  topic.updatedAt = nowIso();
  writeForumFallbackStore(store);
  return true;
}

export function voteFallback(
  userId: string,
  value: 1 | -1,
  target: { topicId?: string; replyId?: string },
): boolean {
  const store = readForumFallbackStore();
  const existingVote = store.votes.find(vote => (
    vote.userId === userId &&
    vote.topicId === (target.topicId || null) &&
    vote.replyId === (target.replyId || null)
  ));

  const previousValue = existingVote?.voteValue || 0;
  const nextDelta = value - previousValue;

  if (existingVote) {
    existingVote.voteValue = value;
  } else {
    store.votes.push({
      id: generateId('vote'),
      userId,
      topicId: target.topicId || null,
      replyId: target.replyId || null,
      voteValue: value,
      createdAt: nowIso(),
    });
  }

  if (target.topicId) {
    const topic = store.topics.find(entry => entry.id === target.topicId);
    if (topic) {
      topic.votesScore += nextDelta;
      topic.updatedAt = nowIso();
    }
  }

  if (target.replyId) {
    const reply = store.replies.find(entry => entry.id === target.replyId);
    if (reply) {
      reply.votesScore += nextDelta;
      reply.updatedAt = nowIso();
    }
  }

  writeForumFallbackStore(store);
  return true;
}
