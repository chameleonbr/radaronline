import { Search } from "lucide-react";

interface TeamViewEmptyStateProps {
    onReset?: () => void;
    readOnly: boolean;
}

export function TeamViewEmptyState({ onReset, readOnly }: TeamViewEmptyStateProps) {
    return (
        <div className="text-center py-16 bg-slate-50/50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
            <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 rounded-full flex items-center justify-center mb-4">
                <Search size={24} />
            </div>
            <h3 className="text-slate-900 dark:text-slate-100 font-semibold text-lg">Nenhum membro encontrado</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-1">
                Tente ajustar seus filtros ou adicione um novo colaborador à equipe.
            </p>
            {!readOnly && onReset ? (
                <button className="mt-4 text-teal-600 dark:text-teal-400 font-semibold text-sm hover:underline" onClick={onReset}>
                    Limpar filtros e adicionar novo
                </button>
            ) : null}
        </div>
    );
}
