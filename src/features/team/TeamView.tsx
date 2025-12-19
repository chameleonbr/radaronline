import React, { useMemo, useState } from 'react';
import { TeamMember } from '../../types';
import { getMicroregiaoById } from '../../data/microregioes';
import { ConfirmModal } from '../../components/common';
import { Mail, MapPin, Edit3, Trash2, Plus, User as UserIcon, Search, X } from 'lucide-react';

type TeamViewProps = {
  team: TeamMember[];
  microId: string;
  onUpdateTeam?: (microId: string, team: TeamMember[]) => void;
  readOnly?: boolean;
};

type NewMember = Pick<TeamMember, 'name' | 'role' | 'email' | 'municipio'>;

const emptyMember: NewMember = { name: '', role: '', email: '', municipio: '' };

const getInitials = (name: string) => {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Permite visualizar e editar (adicionar/remover) membros da equipe da microrregião atual.
 * Mantém compatibilidade com fluxo RACI: novos membros entram no array `team`.
 */
export function TeamView({ team, microId, onUpdateTeam, readOnly = false }: TeamViewProps) {
  const [form, setForm] = useState<NewMember>(emptyMember);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<NewMember>(emptyMember);
  const [removeConfirm, setRemoveConfirm] = useState<{ open: boolean; memberId: number | null; memberName?: string }>({ open: false, memberId: null });
  
  // Filtros de pesquisa
  const [searchFilters, setSearchFilters] = useState({
    nome: '',
    micro: '',
    municipio: '',
    email: '',
    role: ''
  });

  const microMeta = microId ? getMicroregiaoById(microId) : undefined;

  // Filtrar membros baseado nos filtros
  const filteredTeam = useMemo(() => {
    return team.filter(member => {
      const nomeMatch = !searchFilters.nome || 
        member.name.toLowerCase().includes(searchFilters.nome.toLowerCase());
      
      const microMatch = !searchFilters.micro || 
        (() => {
          const microMeta = getMicroregiaoById(member.microregiaoId);
          return microMeta?.nome.toLowerCase().includes(searchFilters.micro.toLowerCase()) ||
                 member.microregiaoId.toLowerCase().includes(searchFilters.micro.toLowerCase());
        })();
      
      const municipioMatch = !searchFilters.municipio || 
        member.municipio.toLowerCase().includes(searchFilters.municipio.toLowerCase());
      
      const emailMatch = !searchFilters.email || 
        member.email.toLowerCase().includes(searchFilters.email.toLowerCase());
      
      const roleMatch = !searchFilters.role || 
        member.role.toLowerCase().includes(searchFilters.role.toLowerCase());
      
      return nomeMatch && microMatch && municipioMatch && emailMatch && roleMatch;
    });
  }, [team, searchFilters]);

  const groupedByMicro = useMemo(() => {
    return filteredTeam.reduce<Record<string, TeamMember[]>>((acc, member) => {
      const key = member.microregiaoId || microId || 'N/D';
      if (!acc[key]) acc[key] = [];
      acc[key].push(member);
      return acc;
    }, {});
  }, [filteredTeam, microId]);

  const microIds = Object.keys(groupedByMicro);

  const handleAdd = () => {
    if (readOnly || !microId) return;
    if (!form.name.trim()) return;
    const next: TeamMember = {
      id: Date.now(),
      name: form.name.trim(),
      role: form.role.trim() || 'Membro',
      email: form.email.trim(),
      municipio: form.municipio.trim(),
      microregiaoId: microId,
    };
    onUpdateTeam?.(microId, [...team, next]);
    setForm(emptyMember);
  };

  const handleRemove = (memberId: number) => {
    if (readOnly || !microId) return;
    const member = team.find(m => m.id === memberId);
    setRemoveConfirm({ open: true, memberId, memberName: member?.name });
  };

  const startEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setEditForm({
      name: member.name,
      role: member.role,
      email: member.email,
      municipio: member.municipio,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(emptyMember);
  };

  const saveEdit = (memberId: number, micro: string) => {
    if (readOnly || !microId) return;
    const updated = team.map(m =>
      m.id === memberId
        ? { ...m, ...editForm }
        : m
    );
    onUpdateTeam?.(micro, updated);
    setEditingId(null);
    setEditForm(emptyMember);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white shadow-sm">
            <UserIcon size={18} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Equipe</h2>
            <p className="text-sm text-slate-500">
              Gerencie membros para atribuição RACI por microrregião
            </p>
          </div>
        </div>
        {microMeta && (
          <div className="flex items-center gap-2 text-sm text-slate-600 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-slate-900 text-white shadow-sm">
              {microMeta.nome}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              Macrorregião: {microMeta.macrorregiao}
            </span>
          </div>
        )}
      </div>

      {!readOnly && microId && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
              <Plus size={14} />
            </div>
            Adicionar membro
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 font-semibold">Nome</label>
              <input
                className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
                value={form.name}
                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome completo"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 font-semibold">Papel</label>
              <input
                className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
                value={form.role}
                onChange={e => setForm(prev => ({ ...prev, role: e.target.value }))}
                placeholder="Ex: Responsável, Apoio"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 font-semibold">Email</label>
              <input
                className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
                value={form.email}
                onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@exemplo.com"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 font-semibold">Município</label>
              <input
                className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
                value={form.municipio}
                onChange={e => setForm(prev => ({ ...prev, municipio: e.target.value }))}
                placeholder="Cidade"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 shadow-sm"
              disabled={!form.name.trim()}
            >
              Adicionar
            </button>
          </div>
        </div>
      )}

      {/* Filtros de Pesquisa */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
            <Search size={16} />
          </div>
          <h3 className="text-sm font-semibold text-slate-700">Filtros de Pesquisa</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-slate-500 font-semibold mb-1 block">Nome</label>
            <div className="relative">
              <input
                className="w-full border border-slate-200 rounded-lg px-3 py-2 pl-9 text-sm focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
                value={searchFilters.nome}
                onChange={e => setSearchFilters(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Buscar por nome..."
              />
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              {searchFilters.nome && (
                <button
                  onClick={() => setSearchFilters(prev => ({ ...prev, nome: '' }))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 font-semibold mb-1 block">Microrregião</label>
            <div className="relative">
              <input
                className="w-full border border-slate-200 rounded-lg px-3 py-2 pl-9 text-sm focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
                value={searchFilters.micro}
                onChange={e => setSearchFilters(prev => ({ ...prev, micro: e.target.value }))}
                placeholder="Buscar por microrregião..."
              />
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              {searchFilters.micro && (
                <button
                  onClick={() => setSearchFilters(prev => ({ ...prev, micro: '' }))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 font-semibold mb-1 block">Município</label>
            <div className="relative">
              <input
                className="w-full border border-slate-200 rounded-lg px-3 py-2 pl-9 text-sm focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
                value={searchFilters.municipio}
                onChange={e => setSearchFilters(prev => ({ ...prev, municipio: e.target.value }))}
                placeholder="Buscar por município..."
              />
              <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              {searchFilters.municipio && (
                <button
                  onClick={() => setSearchFilters(prev => ({ ...prev, municipio: '' }))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 font-semibold mb-1 block">Email</label>
            <div className="relative">
              <input
                className="w-full border border-slate-200 rounded-lg px-3 py-2 pl-9 text-sm focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
                value={searchFilters.email}
                onChange={e => setSearchFilters(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Buscar por email..."
              />
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              {searchFilters.email && (
                <button
                  onClick={() => setSearchFilters(prev => ({ ...prev, email: '' }))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 font-semibold mb-1 block">Papel/Função</label>
            <div className="relative">
              <input
                className="w-full border border-slate-200 rounded-lg px-3 py-2 pl-9 text-sm focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
                value={searchFilters.role}
                onChange={e => setSearchFilters(prev => ({ ...prev, role: e.target.value }))}
                placeholder="Buscar por papel..."
              />
              <UserIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              {searchFilters.role && (
                <button
                  onClick={() => setSearchFilters(prev => ({ ...prev, role: '' }))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setSearchFilters({ nome: '', micro: '', municipio: '', email: '', role: '' })}
              className="w-full px-4 py-2 text-sm text-slate-600 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <X size={14} />
              Limpar Filtros
            </button>
          </div>
        </div>
        {(searchFilters.nome || searchFilters.micro || searchFilters.municipio || searchFilters.email || searchFilters.role) && (
          <div className="mt-3 text-xs text-slate-500">
            Mostrando {filteredTeam.length} de {team.length} membro(s)
          </div>
        )}
      </div>

      {microIds.map(micro => {
        const meta = getMicroregiaoById(micro);
        return (
          <div key={micro} className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="border-b border-slate-200 px-4 py-3 flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="text-xs uppercase font-semibold text-slate-500">Microrregião</p>
                <p className="text-base font-semibold text-slate-800">
                  {meta?.nome || micro}
                </p>
                {meta && (
                  <p className="text-xs text-slate-500">
                    Código {meta.codigo} • Macrorregião: {meta.macrorregiao}
                  </p>
                )}
              </div>
              <span className="text-xs text-slate-500">
                {groupedByMicro[micro].length} membro(s)
              </span>
            </div>

            <div className="divide-y divide-slate-200">
              {groupedByMicro[micro].map(member => {
                const isEditing = editingId === member.id;
                return (
                  <div key={member.id} className="px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1 space-y-1">
                      {isEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <label className="text-[11px] text-slate-500 font-semibold">Nome</label>
                            <input
                              className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
                              value={editForm.name}
                              onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-slate-500 font-semibold">Papel</label>
                            <input
                              className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
                              value={editForm.role}
                              onChange={e => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-slate-500 font-semibold">Email</label>
                            <input
                              className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
                              value={editForm.email}
                              onChange={e => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-slate-500 font-semibold">Município</label>
                            <input
                              className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
                              value={editForm.municipio}
                              onChange={e => setEditForm(prev => ({ ...prev, municipio: e.target.value }))}
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center text-slate-600 font-semibold">
                              {getInitials(member.name || '') || '??'}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{member.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                                  {member.role || 'Membro'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-slate-500 flex flex-wrap gap-3">
                            {member.email && (
                              <span className="flex items-center gap-1 font-medium text-slate-600">
                                <Mail size={12} /> {member.email}
                              </span>
                            )}
                            {member.municipio && (
                              <span className="flex items-center gap-1">
                                <MapPin size={12} /> {member.municipio}
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                    {!readOnly && microId === member.microregiaoId && (
                      <div className="flex gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => saveEdit(member.id, micro)}
                              className="text-xs text-white bg-teal-600 hover:bg-teal-700 px-3 py-1.5 rounded-lg shadow-sm"
                            >
                              Salvar
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-xs text-slate-600 hover:text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg"
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(member)}
                              className="text-xs text-slate-700 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1"
                            >
                              <Edit3 size={14} /> Editar
                            </button>
                            <button
                              onClick={() => handleRemove(member.id)}
                              className="text-xs text-red-600 hover:text-red-700 border border-red-100 bg-red-50 px-3 py-1.5 rounded-lg flex items-center gap-1"
                            >
                              <Trash2 size={14} /> Remover
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              {groupedByMicro[micro].length === 0 && (
                <div className="px-4 py-3 text-sm text-slate-500">Nenhum membro cadastrado.</div>
              )}
            </div>
          </div>
        );
      })}

      <ConfirmModal
        isOpen={removeConfirm.open}
        onClose={() => setRemoveConfirm({ open: false, memberId: null })}
        onConfirm={() => {
          if (!removeConfirm.memberId || !microId) return;
          onUpdateTeam?.(microId, team.filter(m => m.id !== removeConfirm.memberId));
          setRemoveConfirm({ open: false, memberId: null });
        }}
        title="Remover membro"
        message={`Tem certeza que deseja remover "${removeConfirm.memberName || 'este membro'}" da equipe?`}
        confirmText="Remover"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
}
