import { ChevronDown, Filter, Plus, Search, X } from "lucide-react";

interface TeamViewToolbarProps {
    isAddOpen: boolean;
    onSearchChange: (value: string) => void;
    onToggleAdd: () => void;
    readOnly: boolean;
    roleFilter: string;
    roles: string[];
    searchTerm: string;
    setRoleFilter: (value: string) => void;
}

export function TeamViewToolbar({
    isAddOpen,
    onSearchChange,
    onToggleAdd,
    readOnly,
    roleFilter,
    roles,
    searchTerm,
    setRoleFilter,
}: TeamViewToolbarProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" size={18} />
                <input
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-800 focus:border-teal-400 transition-all shadow-sm"
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Buscar por nome, email ou cidade..."
                    type="text"
                    value={searchTerm}
                />
                {searchTerm ? (
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500" onClick={() => onSearchChange("")}>
                        <X size={14} />
                    </button>
                ) : null}
            </div>

            <div className="relative min-w-[160px]">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <select
                    className="w-full pl-9 pr-8 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-600 dark:text-slate-300 appearance-none focus:outline-none focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-800 focus:border-teal-400 shadow-sm cursor-pointer"
                    onChange={(event) => setRoleFilter(event.target.value)}
                    value={roleFilter}
                >
                    <option value="">Todos Cargos</option>
                    {roles.map((role) => <option key={role} value={role}>{role}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            </div>

            {!readOnly ? (
                <button
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-95 ${isAddOpen ? "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600" : "bg-teal-600 text-white hover:bg-teal-700 shadow-teal-200"}`}
                    onClick={onToggleAdd}
                >
                    {isAddOpen ? <X size={18} /> : <Plus size={18} />}
                    <span className="hidden sm:inline">{isAddOpen ? "Cancelar" : "Novo Membro"}</span>
                    <span className="sm:hidden">{isAddOpen ? "Fechar" : "Novo"}</span>
                </button>
            ) : null}
        </div>
    );
}
