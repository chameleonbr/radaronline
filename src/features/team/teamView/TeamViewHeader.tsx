import { User as UserIcon } from "lucide-react";

interface TeamViewHeaderProps {
    count: number;
    microName?: string;
}

export function TeamViewHeader({ count, microName }: TeamViewHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-700">
            <div className="space-y-1">
                <div className="flex items-center gap-2 text-teal-600 mb-1">
                    <UserIcon size={20} className="stroke-[2.5]" />
                    <span className="text-xs font-bold uppercase tracking-wider">Gestão de Equipe</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Membros & Atribuições</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-lg">
                    Gerencie quem faz o que. Mantenha os dados de contato e atribuições RACI atualizados para a microrregião.
                </p>
            </div>

            {microName ? (
                <div className="flex flex-col items-end gap-1">
                    <span className="px-3 py-1 rounded-full bg-slate-900 text-slate-50 text-xs font-medium shadow-sm">{microName}</span>
                    <span className="text-xs text-slate-400 font-medium">{count} {count === 1 ? "membro" : "membros"}</span>
                </div>
            ) : null}
        </div>
    );
}
