import { createContext, useContext, type ReactNode } from 'react';

import type { AuthContextType } from '../types/auth.types';
import { useAuthController } from './useAuthController';

export interface ExtendedAuthContextType extends AuthContextType {
  refreshUser: () => Promise<void>;
  isDemoMode: boolean;
  loginAsDemo: () => void;
  hasSession: boolean;
  profileLoadError: string | null;
}

const AuthContext = createContext<ExtendedAuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const value = useAuthController();
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

export function useAuthSafe() {
  return useContext(AuthContext);
}

export { AuthContext };
