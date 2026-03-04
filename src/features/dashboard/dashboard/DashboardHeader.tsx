import { Calendar, FileText } from "lucide-react";

interface DashboardHeaderProps {
    onOpenReport: () => void;
    userName?: string | null;
}

export function DashboardHeader({ onOpenReport, userName }: DashboardHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    Visão Geral <span className="text-teal-600 dark:text-teal-400">Estratégica</span>
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Olá, <strong>{userName || "Gestor"}</strong>! Aqui está o resumo atualizado da sua microrregião.
                </p>
            </div>
            <div className="flex items-center gap-2">
                <button
                    className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl shadow-sm text-sm font-medium transition-colors"
                    onClick={onOpenReport}
                >
                    <FileText size={16} />
                    Exportar Relatório
                </button>
                <div className="hidden sm:flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium">
                    <Calendar size={16} className="text-teal-600 dark:text-teal-400" />
                    {new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "long", weekday: "long" })}
                </div>
            </div>
        </div>
    );
}
