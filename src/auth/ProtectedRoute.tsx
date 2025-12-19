import { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

// =====================================
// Nota: Como não usamos rotas, esse componente
// não é mais necessário. O App.tsx controla
// a navegação por estado.
// Mantido para referência futura.
// =====================================

type ProtectedRouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-slate-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // App.tsx vai mostrar LoginPage
  }

  if (user && !user.lgpdConsentimento) {
    return null; // App.tsx vai mostrar LgpdConsent
  }

  return <>{children}</>;
}

type AdminRouteProps = {
  children: ReactNode;
};

export function AdminRoute({ children }: AdminRouteProps) {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-slate-600">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null; // App.tsx controla a navegação
  }

  return <>{children}</>;
}




