import { useMemo, useState } from 'react';

import { RankingAttentionPanel } from './rankingPanel/RankingAttentionPanel';
import { RankingBarChart } from './rankingPanel/RankingBarChart';
import { RankingCompactList } from './rankingPanel/RankingCompactList';
import { RankingEmptyState } from './rankingPanel/RankingEmptyState';
import { RankingHighlights } from './rankingPanel/RankingHighlights';
import { RankingTable } from './rankingPanel/RankingTable';
import type { RankingPanelProps, SortBy } from './rankingPanel/rankingPanel.types';
import { buildMicroRankings } from './rankingPanel/rankingPanel.utils';

export function RankingPanel({
  actions,
  onViewMicrorregiao,
  compact = false,
}: RankingPanelProps) {
  const [sortBy, setSortBy] = useState<SortBy>('progresso');
  const [showAll, setShowAll] = useState(false);

  const rankings = useMemo(() => buildMicroRankings(actions, sortBy), [actions, sortBy]);

  if (rankings.length === 0) {
    return <RankingEmptyState />;
  }

  const maxItems = compact ? 5 : showAll ? undefined : 10;
  const topRankings = maxItems ? rankings.slice(0, maxItems) : rankings;
  const bottomRankings = rankings.slice(-5).reverse();

  if (compact) {
    return (
      <RankingCompactList
        rankings={topRankings}
        onViewMicrorregiao={onViewMicrorregiao}
      />
    );
  }

  return (
    <div className="space-y-6">
      <RankingHighlights
        rankings={rankings}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onViewMicrorregiao={onViewMicrorregiao}
      />

      <RankingBarChart rankings={rankings} onViewMicrorregiao={onViewMicrorregiao} />

      <RankingTable
        rankings={rankings}
        topRankings={topRankings}
        showAll={showAll}
        sortBy={sortBy}
        onShowAll={() => setShowAll(true)}
        onSortChange={setSortBy}
        onViewMicrorregiao={onViewMicrorregiao}
      />

      <RankingAttentionPanel
        rankings={rankings}
        bottomRankings={bottomRankings}
        onViewMicrorregiao={onViewMicrorregiao}
      />
    </div>
  );
}
