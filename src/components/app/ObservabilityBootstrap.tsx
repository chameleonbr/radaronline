import { useEffect } from 'react';

import { useAuthSafe } from '../../auth/AuthContext';
import {
  installObservabilityGlobalHandlers,
  setObservabilityUserContext,
} from '../../lib/observability';

export function ObservabilityBootstrap() {
  const authContext = useAuthSafe();
  const user = authContext?.user ?? null;

  useEffect(() => installObservabilityGlobalHandlers(), []);

  useEffect(() => {
    if (!user) {
      setObservabilityUserContext(null);
      return;
    }

    setObservabilityUserContext({
      id: user.id,
      role: user.role,
      microregiaoId: user.microregiaoId,
    });
  }, [user]);

  return null;
}
