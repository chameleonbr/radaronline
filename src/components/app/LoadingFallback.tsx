import { useEffect, useState } from 'react';
import { logError } from '../../lib/logger';

export function LoadingFallback() {
  const [showRetry, setShowRetry] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    const retryTimer = setTimeout(() => setShowRetry(true), 5000);
    const logoutTimer = setTimeout(() => setShowLogout(true), 10000);

    return () => {
      clearTimeout(retryTimer);
      clearTimeout(logoutTimer);
    };
  }, []);

  const handleLogout = () => {
    try {
      const keysToRemove: string[] = [];
      for (let index = 0; index < localStorage.length; index += 1) {
        const key = localStorage.key(index);
        if (key && (key.startsWith('sb-') || key.includes('supabase'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      logError('LoadingFallback', 'Erro ao limpar sessão', error);
    }
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-teal-50 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-slate-100">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>

        <h2 className="text-xl font-bold text-slate-800 mb-2">Carregando aplicação...</h2>
        <p className="text-slate-600 mb-6">Aguarde enquanto verificamos sua sessão.</p>

        <div className="w-full bg-slate-100 rounded-full h-2 mb-6 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full animate-pulse" style={{ width: '60%' }} />
        </div>

        <div className="space-y-3">
          {showRetry && (
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
            >
              Tentar novamente
            </button>
          )}

          {showLogout && (
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              Limpar sessão e recarregar
            </button>
          )}
        </div>

        {!showRetry && (
          <p className="text-xs text-slate-400 mt-4">
            Se demorar mais que alguns segundos, verifique sua conexão.
          </p>
        )}
      </div>
    </div>
  );
}
