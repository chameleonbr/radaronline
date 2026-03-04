import { describe, expect, it } from 'vitest';

import {
  buildAnnouncementCreatePayload,
  buildAnnouncementNotifications,
  buildAnnouncementUpdatePayload,
  filterAnnouncementsByMicro,
  mapAnnouncementRow,
} from './announcementsService.helpers';
import type {
  AnnouncementProfileRow,
  AnnouncementRow,
} from './announcementsService.types';

describe('announcementsService.helpers', () => {
  it('mapeia row do banco para announcement de dominio', () => {
    const row: AnnouncementRow = {
      id: 'announcement-1',
      title: 'Aviso',
      content: 'Conteudo',
      type: 'news',
      priority: 'high',
      display_date: '2026-03-01',
      target_micros: ['micro-1'],
      link_url: null,
      image_url: 'https://image',
      is_active: true,
      expiration_date: null,
      created_by: 'user-1',
      created_at: '2026-03-01T00:00:00Z',
    };

    expect(mapAnnouncementRow(row)).toEqual({
      id: 'announcement-1',
      title: 'Aviso',
      content: 'Conteudo',
      type: 'news',
      priority: 'high',
      displayDate: '2026-03-01',
      targetMicros: ['micro-1'],
      linkUrl: undefined,
      imageUrl: 'https://image',
      isActive: true,
      expirationDate: null,
      createdBy: 'user-1',
      createdAt: '2026-03-01T00:00:00Z',
    });
  });

  it('filtra anuncios por microrregiao respeitando alvo global e vazio', () => {
    const announcements = [
      mapAnnouncementRow({
        id: '1',
        title: 'Global',
        content: '',
        type: 'news',
        priority: 'normal',
        display_date: '2026-03-01',
        target_micros: ['all'],
        link_url: null,
        image_url: null,
        is_active: true,
        expiration_date: null,
        created_by: null,
        created_at: '2026-03-01T00:00:00Z',
      }),
      mapAnnouncementRow({
        id: '2',
        title: 'Micro 2',
        content: '',
        type: 'news',
        priority: 'normal',
        display_date: '2026-03-01',
        target_micros: ['micro-2'],
        link_url: null,
        image_url: null,
        is_active: true,
        expiration_date: null,
        created_by: null,
        created_at: '2026-03-01T00:00:00Z',
      }),
      mapAnnouncementRow({
        id: '3',
        title: 'Sem alvo',
        content: '',
        type: 'news',
        priority: 'normal',
        display_date: '2026-03-01',
        target_micros: [],
        link_url: null,
        image_url: null,
        is_active: true,
        expiration_date: null,
        created_by: null,
        created_at: '2026-03-01T00:00:00Z',
      }),
    ];

    expect(filterAnnouncementsByMicro(announcements, 'micro-1').map((item) => item.id)).toEqual([
      '1',
      '3',
    ]);
  });

  it('monta payloads de create, update e notificacoes', () => {
    const profiles: AnnouncementProfileRow[] = [
      { id: 'user-1', nome: 'Ana', email: 'ana@example.com', role: 'user', microregiao_id: 'micro-1' },
    ];

    expect(
      buildAnnouncementCreatePayload(
        {
          title: 'Titulo',
          content: 'Conteudo',
          type: 'alert',
          priority: 'high',
          displayDate: '2026-03-01',
          targetMicros: ['micro-1'],
          linkUrl: '',
          imageUrl: undefined,
          isActive: true,
          expirationDate: '',
        },
        'admin-1'
      )
    ).toMatchObject({
      title: 'Titulo',
      link_url: null,
      image_url: null,
      created_by: 'admin-1',
    });

    expect(
      buildAnnouncementUpdatePayload({
        title: 'Novo titulo',
        linkUrl: '',
        isActive: false,
      })
    ).toEqual({
      title: 'Novo titulo',
      link_url: null,
      is_active: false,
    });

    expect(buildAnnouncementNotifications(profiles, 'Titulo', '2026-03-01T00:00:00Z')).toEqual([
      {
        userId: 'user-1',
        requestType: 'announcement',
        status: 'pending',
        content: 'Titulo',
        adminNotes: 'Visualizar no Mural',
        createdAt: '2026-03-01T00:00:00Z',
      },
    ]);
  });
});
