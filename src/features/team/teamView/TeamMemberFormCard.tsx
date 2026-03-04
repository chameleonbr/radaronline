import { ChevronDown, Loader2, Plus, X } from "lucide-react";

import type { NewMember } from "./teamView.types";

interface TeamMemberFormCardProps {
    form: NewMember;
    isAdding: boolean;
    isOpen: boolean;
    municipios: string[];
    onCancel: () => void;
    onChange: (form: NewMember) => void;
    onSubmit: () => void;
}

export function TeamMemberFormCard({ form, isAdding, isOpen, municipios, onCancel, onChange, onSubmit }: TeamMemberFormCardProps) {
    return (
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 border-l-4 border-l-teal-500 rounded-2xl p-6 shadow-xl mb-6 relative">
                <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors" onClick={onCancel}>
                    <X size={20} />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-teal-50 dark:bg-teal-900/40 flex items-center justify-center text-teal-600 dark:text-teal-400">
                        <Plus size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Novo Colaborador</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Preencha os dados abaixo para adicionar um membro.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Nome Completo <span className="text-rose-500">*</span></label>
                        <input className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400" onChange={(event) => onChange({ ...form, name: event.target.value })} placeholder="Ex: Maria Silva" value={form.name} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Cargo / Função <span className="text-rose-500">*</span></label>
                        <input className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400" onChange={(event) => onChange({ ...form, role: event.target.value })} placeholder="Ex: Gestor" value={form.role} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Email <span className="text-rose-500">*</span></label>
                        <input className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400" onChange={(event) => onChange({ ...form, email: event.target.value })} placeholder="maria@exemplo.com" value={form.email} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Município</label>
                        <div className="relative">
                            <select className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all appearance-none cursor-pointer" onChange={(event) => onChange({ ...form, municipio: event.target.value })} value={form.municipio}>
                                <option value="">Selecione...</option>
                                {municipios.map((municipio) => <option key={municipio} value={municipio}>{municipio}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <button className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors" onClick={onCancel}>Cancelar</button>
                    <button className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-lg shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 transform active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center gap-2" disabled={!form.name.trim() || !form.role.trim() || !form.email.trim() || isAdding} onClick={onSubmit}>
                        {isAdding ? <Loader2 size={16} className="animate-spin" /> : null}
                        {isAdding ? "Salvando..." : "Confirmar Adição"}
                    </button>
                </div>
            </div>
        </div>
    );
}
