import { useCallback, type Dispatch, type SetStateAction } from 'react';
import type { TeamMember } from '../types';
import { logError } from '../lib/logger';
import { addTeamMember, removeTeamMember } from '../services/teamsService';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface UseTeamHandlersProps {
  setTeamsByMicro: Dispatch<SetStateAction<Record<string, TeamMember[]>>>;
  showToast: (message: string, type?: ToastType) => void;
}

export function useTeamHandlers({
  setTeamsByMicro,
  showToast,
}: UseTeamHandlersProps) {
  const handleUpdateTeam = useCallback((microId: string, updatedTeam: TeamMember[]) => {
    if (!microId) return;

    setTeamsByMicro(prev => ({
      ...prev,
      [microId]: updatedTeam,
    }));
  }, [setTeamsByMicro]);

  const handleAddMember = useCallback(async (member: Omit<TeamMember, 'id'>) => {
    try {
      const newMember = await addTeamMember({
        microregiaoId: member.microregiaoId,
        name: member.name,
        role: member.role,
        email: member.email,
        municipio: member.municipio,
      });

      setTeamsByMicro(prev => ({
        ...prev,
        [member.microregiaoId]: [...(prev[member.microregiaoId] || []), newMember],
      }));

      showToast(`${member.name} adicionado a equipe!`, 'success');
      return newMember;
    } catch (error: any) {
      logError('useTeamHandlers', 'Erro ao adicionar membro', error);
      showToast(`Erro ao adicionar membro: ${error.message}`, 'error');
      return null;
    }
  }, [setTeamsByMicro, showToast]);

  const handleRemoveMember = useCallback(async (memberId: string) => {
    try {
      await removeTeamMember(String(memberId));

      setTeamsByMicro(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(microId => {
          updated[microId] = updated[microId].filter(member => member.id !== memberId);
        });
        return updated;
      });

      showToast('Membro removido da equipe!', 'success');
      return true;
    } catch (error: any) {
      logError('useTeamHandlers', 'Erro ao remover membro', error);
      showToast(`Erro ao remover membro: ${error.message}`, 'error');
      return false;
    }
  }, [setTeamsByMicro, showToast]);

  return {
    handleUpdateTeam,
    handleAddMember,
    handleRemoveMember,
  };
}
