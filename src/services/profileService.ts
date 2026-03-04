
import { logError } from '../lib/logger';

import { getPlatformClient } from './platformClient';

const platformClient = getPlatformClient;

export async function updateUserAvatar(
    userId: string,
    avatarId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const { error } = await platformClient()
            .from('profiles')
            .update({
                avatar_id: avatarId,
                updated_at: new Date().toISOString(),
            })
            .eq('id', userId);

        if (error) {
            logError('profileService', 'Error updating avatar', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        logError('profileService', 'Unexpected error updating avatar', error);
        return { success: false, error: 'Erro inesperado' };
    }
}






