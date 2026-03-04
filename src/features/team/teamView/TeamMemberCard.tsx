import { AlertTriangle, ChevronDown, Edit3, Mail, MapPin, Trash2 } from "lucide-react";

import type { TeamMember } from "../../../types";
import type { NewMember } from "./teamView.types";
import { getInitials, getRoleBadgeColor } from "./teamView.utils";

interface TeamMemberCardProps {
    editForm: NewMember;
    isEditing: boolean;
    member: TeamMember;
    municipios: string[];
    onCancelEdit: () => void;
    onChangeEditForm: (form: NewMember) => void;
    onEdit: () => void;
    onRemove: () => void;
    onSaveEdit: () => void;
    readOnly: boolean;
}

export function TeamMemberCard({
    editForm,
    isEditing,
    member,
    municipios,
    onCancelEdit,
    onChangeEditForm,
    onEdit,
    onRemove,
    onSaveEdit,
    readOnly,
}: TeamMemberCardProps) {
    const isPending = member.isRegistered === false && member.role.toLowerCase() !== "membro";

    if (isEditing) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-lg border-2 border-teal-100 dark:border-teal-800 ring-2 ring-teal-50 dark:ring-teal-900 relative animate-in fade-in zoom-in-95 duration-200">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-teal-600 uppercase tracking-wide">Editando Membro</h4>
                    </div>
                    <input className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-700" onChange={(event) => onChangeEditForm({ ...editForm, name: event.target.value })} placeholder="Nome" value={editForm.name} />
                    <input className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-700" onChange={(event) => onChangeEditForm({ ...editForm, role: event.target.value })} placeholder="Cargo" value={editForm.role} />
                    <input className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-700" onChange={(event) => onChangeEditForm({ ...editForm, email: event.target.value })} placeholder="Email" value={editForm.email} />
                    <div className="relative">
                        <select className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-700 appearance-none cursor-pointer" onChange={(event) => onChangeEditForm({ ...editForm, municipio: event.target.value })} value={editForm.municipio}>
                            <option value="">Selecione o município...</option>
                            {municipios.map((municipio) => <option key={municipio} value={municipio}>{municipio}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button className="flex-1 bg-teal-600 text-white py-1.5 rounded-lg text-sm font-medium hover:bg-teal-700" onClick={onSaveEdit}>Salvar</button>
                        <button className="flex-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-600" onClick={onCancelEdit}>Cancelar</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`group bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border transition-all duration-300 relative ${isPending ? "border-amber-300 dark:border-amber-700/50 ring-1 ring-amber-100 dark:ring-amber-900/20" : "border-slate-100 dark:border-slate-700 hover:shadow-md hover:border-teal-100 dark:hover:border-teal-800"}`}>
            {isPending ? (
                <div className="absolute top-0 right-0">
                    <div className="bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-400 text-[10px] font-bold px-3 py-1.5 rounded-bl-xl rounded-tr-xl flex items-center gap-1.5 shadow-sm border-b border-l border-amber-200 dark:border-amber-800/50">
                        <AlertTriangle size={12} className="stroke-[2.5]" />
                        <span>CADASTRO PENDENTE</span>
                    </div>
                </div>
            ) : null}

            <div className="flex items-start justify-between mb-4 mt-2">
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl text-lg font-bold flex items-center justify-center shadow-inner ${isPending ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" : "bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 text-slate-600 dark:text-slate-200"}`}>
                        {getInitials(member.name)}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base leading-tight group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">{member.name}</h3>
                        <div className={`inline-flex items-center px-2 py-0.5 mt-1 rounded-md border text-[10px] font-bold uppercase tracking-wider ${getRoleBadgeColor(member.role)}`}>
                            {member.role}
                        </div>
                    </div>
                </div>

                {!readOnly ? (
                    <div className="flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/40 rounded-lg transition-colors" onClick={onEdit}>
                            <Edit3 size={16} />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/40 rounded-lg transition-colors" onClick={onRemove}>
                            <Trash2 size={16} />
                        </button>
                    </div>
                ) : null}
            </div>

            <div className="space-y-2">
                {member.email ? (
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                        <div className="p-1.5 bg-slate-50 dark:bg-slate-700 rounded-md text-slate-400 dark:text-slate-500"><Mail size={14} /></div>
                        <span className="truncate">{member.email}</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-sm text-slate-300 dark:text-slate-500 italic">
                        <div className="p-1.5 bg-slate-50 dark:bg-slate-700 rounded-md"><Mail size={14} /></div>
                        Sem email
                    </div>
                )}

                {member.municipio ? (
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                        <div className="p-1.5 bg-slate-50 dark:bg-slate-700 rounded-md text-slate-400 dark:text-slate-500"><MapPin size={14} /></div>
                        <span className="truncate">{member.municipio}</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-sm text-slate-300 dark:text-slate-500 italic">
                        <div className="p-1.5 bg-slate-50 dark:bg-slate-700 rounded-md"><MapPin size={14} /></div>
                        Sem município
                    </div>
                )}

                {isPending ? (
                    <p className="text-[10px] text-amber-600 dark:text-amber-500 font-medium pt-2 border-t border-slate-100 dark:border-slate-700 mt-2">Aguardando cadastro pelo administrador</p>
                ) : null}
            </div>
        </div>
    );
}
