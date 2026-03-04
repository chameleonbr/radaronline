
import type { Announcement } from '../types/announcement.types';
import { log, logError, logWarn } from '../lib/logger';
import { requireCurrentUserId } from './sessionService';
import { shouldUseBackendAnnouncementsApi } from './apiClient';
import {
  createAnnouncementViaBackendApi,
  deleteAnnouncementViaBackendApi,
  listAdminAnnouncementsViaBackendApi,
  listAnnouncementsViaBackendApi,
  toggleAnnouncementViaBackendApi,
  updateAnnouncementViaBackendApi,
} from './announcementsApi';
import { createUserRequestsBatch } from './requestsService';
import {
  buildAnnouncementCreatePayload,
  buildAnnouncementNotifications,
  buildAnnouncementUpdatePayload,
  filterAnnouncementsByMicro,
  mapAnnouncementRow,
} from './announcements/announcementsService.helpers';
import {
  deleteAnnouncementRecord,
  insertAnnouncementRecord,
  listActiveAnnouncements,
  listAllAnnouncements,
  listAnnouncementProfiles,
  toggleAnnouncementActiveRecord,
  updateAnnouncementRecord,
} from './announcements/announcementsService.repositories';
import type {
  AnnouncementCreateInput,
  AnnouncementUpdateInput,
} from './announcements/announcementsService.types';

export async function loadAnnouncements(microregiaoId?: string): Promise<Announcement[]> {
  try {
    if (shouldUseBackendAnnouncementsApi()) {
      return listAnnouncementsViaBackendApi(microregiaoId);
    }
    const today = new Date().toISOString().split('T')[0];
    return filterAnnouncementsByMicro(
      (await listActiveAnnouncements(today)).map(mapAnnouncementRow),
      microregiaoId
    );
  } catch (error) {
    logError('announcementsService', 'Erro inesperado ao carregar anuncios', error);
    return [];
  }
}

export async function loadAllAnnouncementsForAdmin(): Promise<Announcement[]> {
  try {
    if (shouldUseBackendAnnouncementsApi()) {
      return listAdminAnnouncementsViaBackendApi();
    }
    return (await listAllAnnouncements()).map(mapAnnouncementRow);
  } catch (error) {
    logError('announcementsService', 'Erro ao carregar anuncios para admin', error);
    return [];
  }
}

export async function createAnnouncement(data: AnnouncementCreateInput): Promise<Announcement | null> {
  try {
    if (shouldUseBackendAnnouncementsApi()) {
      return createAnnouncementViaBackendApi(data);
    }
    const currentUserId = await requireCurrentUserId('Usuario nao autenticado');
    const result = await insertAnnouncementRecord(
      buildAnnouncementCreatePayload(data, currentUserId)
    );

    try {
      log('announcementsService', 'Iniciando criacao de notificacoes para anuncio', {
        announcementTitle: result.title,
        targetMicros: result.target_micros,
      });

      if (!result.target_micros?.includes('all')) {
        log('announcementsService', 'Filtrando notificacoes por microrregioes', {
          targetMicros: result.target_micros,
        });
      } else {
        log('announcementsService', 'Notificacao global para todos os usuarios');
      }

      const targetMicros = result.target_micros || [];
      const profiles = await listAnnouncementProfiles(targetMicros);

      log('announcementsService', 'Perfis elegiveis para notificacao', { count: profiles.length });

      if (profiles.length > 0) {
        const notifications = buildAnnouncementNotifications(
          profiles,
          result.title,
          new Date().toISOString()
        );

        const { success, error: notifError, insertedIds } = await createUserRequestsBatch(notifications);
        if (!success) {
          logError('announcementsService', 'Falha critica ao criar notificacoes de anuncio', notifError);
          throw new Error(
            `Erro ao criar notificacoes: ${notifError || 'Erro desconhecido'} (Verifique RLS/Constraint)`
          );
        }

        log('announcementsService', 'Notificacoes de anuncio criadas com sucesso', {
          count: notifications.length,
          insertedIds,
        });
      } else {
        logWarn('announcementsService', 'Nenhum perfil encontrado para alvo do anuncio', {
          targetMicros: result.target_micros,
        });
      }
    } catch (err) {
      logError('announcementsService', 'Erro inesperado na logica de notificacao de anuncio', err);
      throw err;
    }

    return mapAnnouncementRow(result);
  } catch (error) {
    logError('announcementsService', 'Erro ao criar anuncio', error);
    throw error;
  }
}

export async function updateAnnouncement(
  id: string,
  data: AnnouncementUpdateInput
): Promise<void> {
  try {
    if (shouldUseBackendAnnouncementsApi()) {
      await updateAnnouncementViaBackendApi(id, data);
      return;
    }
    await updateAnnouncementRecord(id, buildAnnouncementUpdatePayload(data));
  } catch (error) {
    logError('announcementsService', 'Erro ao atualizar anuncio', error);
    throw error;
  }
}

export async function deleteAnnouncement(id: string): Promise<void> {
  try {
    if (shouldUseBackendAnnouncementsApi()) {
      await deleteAnnouncementViaBackendApi(id);
      return;
    }
    await deleteAnnouncementRecord(id);
  } catch (error) {
    logError('announcementsService', 'Erro ao deletar anÃºncio', error);
    throw error;
  }
}

export async function toggleAnnouncementActive(id: string, currentState: boolean): Promise<void> {
  try {
    if (shouldUseBackendAnnouncementsApi()) {
      await toggleAnnouncementViaBackendApi(id, currentState);
      return;
    }
    await toggleAnnouncementActiveRecord(id, currentState);
  } catch (error) {
    logError('announcementsService', 'Erro ao alternar anuncio ativo', error);
    throw error;
  }
}






