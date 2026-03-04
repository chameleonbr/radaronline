import { beforeEach, describe, expect, it } from 'vitest';

import {
  captureException,
  captureLog,
  clearBufferedObservabilityEvents,
  getBufferedObservabilityEvents,
  setObservabilityUserContext,
} from './observability';

describe('observability', () => {
  beforeEach(() => {
    clearBufferedObservabilityEvents();
    setObservabilityUserContext(null);
  });

  it('buffers structured log events', () => {
    captureLog('warn', 'test-source', 'warning message', { detail: 'x' });

    const events = getBufferedObservabilityEvents();
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      level: 'warn',
      source: 'test-source',
      message: 'warning message',
      details: { detail: 'x' },
    });
  });

  it('adds user context to captured exceptions', () => {
    setObservabilityUserContext({
      id: 'user-1',
      role: 'admin',
      microregiaoId: 'MR001',
    });

    captureException('boundary', new Error('boom'), { route: '/dashboard' });

    const events = getBufferedObservabilityEvents();
    expect(events[0]).toMatchObject({
      level: 'error',
      source: 'boundary',
      message: 'boom',
      user: {
        id: 'user-1',
        role: 'admin',
        microregiaoId: 'MR001',
      },
      details: {
        route: '/dashboard',
      },
    });
  });
});
