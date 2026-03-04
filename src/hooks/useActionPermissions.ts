import { useMemo } from 'react';
import { canCreateAction, canDeleteAction, canEditAction, canManageTeam } from '../auth';
import { Action } from '../types';
import { User } from '../types/auth.types';

interface UseActionPermissionsProps {
  user: User | null;
  isAdmin: boolean;
  isViewingAllMicros: boolean;
  currentMicroId: string;
  selectedActivity: string;
}

export function useActionPermissions({
  user,
  isAdmin,
  isViewingAllMicros,
  currentMicroId,
  selectedActivity,
}: UseActionPermissionsProps) {
  return useMemo(() => {
    const checkCanEdit = (action: Action) => {
      if (!user) return false;
      if (isAdmin) return true;
      if (isViewingAllMicros) return false;
      if (action.microregiaoId !== currentMicroId) return false;

      return canEditAction(user, action);
    };

    const checkCanDelete = (action: Action) => {
      if (!user) return false;
      if (isAdmin) return true;
      if (isViewingAllMicros) return false;
      if (action.microregiaoId !== currentMicroId) return false;

      return canDeleteAction(user, action);
    };

    const checkCanCreate = () => {
      if (!user) return false;
      if (!selectedActivity) return false;
      if (isAdmin) return true;
      if (isViewingAllMicros) return false;
      if (!currentMicroId) return false;

      return canCreateAction(user);
    };

    const checkCanManageTeam = (action: Action) => {
      if (!user) return false;
      if (isAdmin) return true;
      if (isViewingAllMicros) return false;
      if (action.microregiaoId !== currentMicroId) return false;

      return canManageTeam(user, action);
    };

    return {
      checkCanCreate,
      checkCanDelete,
      checkCanEdit,
      checkCanManageTeam,
    };
  }, [currentMicroId, isAdmin, isViewingAllMicros, selectedActivity, user]);
}
