import { describe, expect, it } from 'vitest';

import {
  aggregateHourlyUsage,
  aggregateInactiveMunicipalities,
  aggregatePageStats,
  aggregateTopPages,
  computeActionMetrics,
  countUniqueUsers,
} from './analyticsService.aggregations';

describe('analyticsService.aggregations', () => {
  it('counts unique users ignoring null ids', () => {
    expect(
      countUniqueUsers([
        { user_id: 'u1' },
        { user_id: 'u1' },
        { user_id: 'u2' },
        { user_id: null },
      ])
    ).toBe(2);
  });

  it('aggregates top pages with percentages', () => {
    expect(
      aggregateTopPages(
        [
          { page: '/a' },
          { page: '/a' },
          { page: '/b' },
        ],
        2
      )
    ).toEqual([
      { page: '/a', views: 2, percentage: 66.7 },
      { page: '/b', views: 1, percentage: 33.3 },
    ]);
  });

  it('aggregates hourly usage into 24 buckets', () => {
    const result = aggregateHourlyUsage([
      { created_at: '2026-03-01T03:10:00' },
      { created_at: '2026-03-01T03:50:00' },
      { created_at: '2026-03-01T05:00:00' },
    ]);

    expect(result).toHaveLength(24);
    expect(result.find((item) => item.hour === 3)?.count).toBe(2);
    expect(result.find((item) => item.hour === 5)?.count).toBe(1);
  });

  it('identifies inactive municipalities from last activity', () => {
    const result = aggregateInactiveMunicipalities(
      [
        { microregiao_id: 'MR1', municipio: 'A' },
        { microregiao_id: 'MR1', municipio: 'B' },
      ],
      [
        {
          user_id: 'u1',
          created_at: '2026-02-25T00:00:00.000Z',
          profiles: { microregiao_id: 'MR1', municipio: 'A' },
        },
      ],
      new Date('2026-02-27T00:00:00.000Z'),
      new Date('2026-03-01T00:00:00.000Z')
    );

    expect(result[0]).toMatchObject({
      microregiaoId: 'MR1',
      municipio: 'B',
      userCount: 0,
    });
  });

  it('aggregates page stats rows by page', () => {
    expect(
      aggregatePageStats([
        {
          page: '/dashboard',
          view_count: 5,
          avg_time_seconds: 10,
          avg_scroll_depth: 20,
          unique_users: 2,
        },
        {
          page: '/dashboard',
          view_count: 3,
          avg_time_seconds: 5,
          avg_scroll_depth: 10,
          unique_users: 1,
        },
      ])
    ).toEqual([
      {
        page: '/dashboard',
        viewCount: 8,
        avgTimeSeconds: 15,
        avgScrollDepth: 30,
        uniqueUsers: 3,
      },
    ]);
  });

  it('computes action metrics from counts and completed rows', () => {
    expect(
      computeActionMetrics(
        { created: 10, updated: 8, completed: 4 },
        [
          {
            start_date: '2026-02-01T00:00:00.000Z',
            end_date: '2026-02-05T00:00:00.000Z',
          },
          {
            start_date: '2026-02-10T00:00:00.000Z',
            end_date: '2026-02-12T00:00:00.000Z',
          },
        ]
      )
    ).toEqual({
      totalCreated: 10,
      totalUpdated: 8,
      totalCompleted: 4,
      avgCompletionDays: 3,
    });
  });
});
