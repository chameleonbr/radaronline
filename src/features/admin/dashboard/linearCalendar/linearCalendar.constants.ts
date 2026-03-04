export const OBJECTIVE_COLORS: Record<number, { bg: string; border: string; bar: string; text: string }> = {
    1: { bg: "bg-cyan-50 dark:bg-cyan-900/30", border: "border-cyan-200 dark:border-cyan-800", bar: "bg-cyan-500", text: "text-cyan-600 dark:text-cyan-400" },
    2: { bg: "bg-indigo-50 dark:bg-indigo-900/30", border: "border-indigo-200 dark:border-indigo-800", bar: "bg-indigo-500", text: "text-indigo-600 dark:text-indigo-400" },
    3: { bg: "bg-amber-50 dark:bg-amber-900/30", border: "border-amber-200 dark:border-amber-800", bar: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
};

export const STATUS_COLORS: Record<string, string> = {
    Concluído: "bg-emerald-500",
    "Em Andamento": "bg-blue-500",
    Atrasado: "bg-rose-500",
    "Não Iniciado": "bg-slate-400",
};

export const MONTH_NAMES_SHORT = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
export const WEEK_NAMES = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
