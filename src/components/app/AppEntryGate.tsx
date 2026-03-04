import { ReactNode, lazy } from 'react';
import { AlertTriangle } from 'lucide-react';
import { ExtendedAuthContextType } from '../../auth/AuthContext';
import { Action, Activity, Objective, TeamMember } from '../../types';
import { User } from '../../types/auth.types';
import { LoadingFallback } from './LoadingFallback';
import { WorkspaceSelector } from './WorkspaceSelector';
import type { Workspace } from './WorkspaceSelector';

const LoginPage = lazy(() => import('../../features/login/LoginPage').then(m => ({ default: m.LoginPage })));
const LgpdConsent = lazy(() => import('../../features/login/LgpdConsent').then(m => ({ default: m.LgpdConsent })));
const LandingOnboarding = lazy(() => import('../../features/login/LandingOnboarding').then(m => ({ default: m.LandingOnboarding })));
const AdminPanel = lazy(() => import('../../features/admin').then(m => ({ default: m.AdminPanel })));

interface AppEntryGateProps {
  authContext: ExtendedAuthContextType | null;
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  viewingMicroregiaoId: string | null;
  hasViewedLanding: boolean;
  currentPage: 'main' | 'admin' | 'lgpd';
  actions: Action[];
  teamsByMicro: Record<string, TeamMember[]>;
  objectives: Objective[];
  activities: Record<number, Activity[]>;
  onLandingComplete: () => void;
  onLgpdAccepted: () => void;
  onLogout: () => void | Promise<void>;
  onRefreshProfile: () => Promise<void>;
  onBackFromAdmin: () => void;
  currentWorkspace: Workspace | null;
  onWorkspaceSelect: (ws: Workspace) => void;
  children: ReactNode;
}

export function AppEntryGate({
  authContext,
  user,
  isAuthenticated,
  isAdmin,
  viewingMicroregiaoId,
  hasViewedLanding,
  currentPage,
  actions,
  teamsByMicro,
  objectives,
  activities,
  onLandingComplete,
  onLgpdAccepted,
  onLogout,
  onRefreshProfile,
  onBackFromAdmin,
  currentWorkspace,
  onWorkspaceSelect,
  children,
}: AppEntryGateProps) {
  const shouldShowWorkspaceSelector = !currentWorkspace;
  const shouldShowPlanningAdminPanel = isAdmin && currentWorkspace === 'planning' && !viewingMicroregiaoId;
  const shouldShowAdminPanel = shouldShowPlanningAdminPanel || (currentPage === 'admin' && isAdmin);

  if (!authContext) {
    return <LoadingFallback />;
  }

  if (authContext.hasSession && !user) {
    if (authContext.profileLoadError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center border border-rose-100">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-rose-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Erro ao carregar perfil</h2>
            <p className="text-slate-600 mb-6 text-sm">{authContext.profileLoadError}</p>
            <div className="p-4 bg-slate-50 rounded-lg mb-6 text-left text-xs text-slate-500 font-mono overflow-auto max-h-32">
              Dica: Verifique sua conex�o ou se suas permiss�es de acesso (RLS) est�o corretas.
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => void onRefreshProfile()}
                className="w-full px-4 py-3 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span>Tentar Novamente</span>
              </button>

              <button
                onClick={() => void onLogout()}
                className="w-full px-4 py-3 bg-white border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors"
              >
                Fazer Logout e Limpar Cache
              </button>
            </div>
          </div>
        </div>
      );
    }

    return <LoadingFallback />;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (user && !user.lgpdConsentimento) {
    if (!hasViewedLanding) {
      return <LandingOnboarding onComplete={onLandingComplete} />;
    }

    return <LgpdConsent onAccepted={onLgpdAccepted} />;
  }

  if (shouldShowWorkspaceSelector) {
    return (
      <WorkspaceSelector
        userName={user?.nome ?? ''}
        onSelect={onWorkspaceSelect}
      />
    );
  }

  if (shouldShowAdminPanel) {
    return (
      <AdminPanel
        onBack={onBackFromAdmin}
        actions={actions}
        teams={teamsByMicro}
        objectives={objectives}
        activities={activities}
      />
    );
  }

  return <>{children}</>;
}
