import { ArrowLeft, Shield } from 'lucide-react';

interface AdminAccessDeniedProps {
  onBack?: () => void;
}

export function AdminAccessDenied({ onBack }: AdminAccessDeniedProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm text-center max-w-sm">
        <Shield className="w-10 h-10 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Acesso restrito</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Apenas administradores podem acessar este painel.
        </p>
        <button
          onClick={onBack}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-lg text-sm hover:bg-slate-900 dark:hover:bg-slate-600"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
      </div>
    </div>
  );
}
