import { Trophy } from 'lucide-react';

export function RankingEmptyState() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
      <Trophy className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
      <h3 className="font-semibold text-slate-600 dark:text-slate-400 mb-2">
        Nenhum ranking disponivel
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-500">
        Ainda nao ha acoes cadastradas para gerar o ranking das microrregioes.
      </p>
    </div>
  );
}
