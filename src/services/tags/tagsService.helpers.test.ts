import { describe, expect, it } from 'vitest';

import {
  buildNextFavoriteState,
  generateTagColor,
  mapActionTagAssignments,
  mapLoadedTags,
} from './tagsService.helpers';
import type {
  ActionTagAssignmentRow,
  ActionTagRow,
} from './tagsService.types';

describe('tagsService.helpers', () => {
  it('gera cor deterministica para a tag', () => {
    expect(generateTagColor('Governanca')).toBe(generateTagColor('Governanca'));
  });

  it('mescla favoritos locais e do banco ao carregar tags', () => {
    const rows: ActionTagRow[] = [
      { id: '1', name: 'A', color: 'red', favorite_micros: ['micro-1'] },
      { id: '2', name: 'B', color: 'blue', favorite_micros: [] },
    ];

    expect(mapLoadedTags(rows, 'micro-1', []).map((tag) => [tag.id, tag.isFavorite])).toEqual([
      ['1', true],
      ['2', false],
    ]);
  });

  it('calcula proximo estado local de favorito', () => {
    expect(buildNextFavoriteState(['1'], '1')).toEqual({
      localFavorites: ['1'],
      nextLocalFavorites: [],
      isFavorite: false,
    });
    expect(buildNextFavoriteState([], '2')).toEqual({
      localFavorites: [],
      nextLocalFavorites: ['2'],
      isFavorite: true,
    });
  });

  it('mapeia atribuicoes de tag para dominio', () => {
    const rows: ActionTagAssignmentRow[] = [
      { tag_id: '1', tag: { id: '1', name: 'A', color: 'red' } },
      { tag_id: '2', tag: null },
    ];

    expect(mapActionTagAssignments(rows)).toEqual([
      { id: '1', name: 'A', color: 'red' },
    ]);
  });
});
