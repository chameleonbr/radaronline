import { useMemo, useState } from "react";

import { ConfirmModal } from "../../components/common/ConfirmModal";
import { useToast } from "../../components/common/Toast";
import { getMicroregiaoById, getMunicipiosByMicro } from "../../data/microregioes";
import { logError } from "../../lib/logger";
import type { TeamMember } from "../../types";
import { TeamMemberCard } from "./teamView/TeamMemberCard";
import { TeamMemberFormCard } from "./teamView/TeamMemberFormCard";
import { TeamViewEmptyState } from "./teamView/TeamViewEmptyState";
import { TeamViewHeader } from "./teamView/TeamViewHeader";
import { TeamViewToolbar } from "./teamView/TeamViewToolbar";
import { ROLES_OPTIONS, TEAM_EMAIL_REGEX } from "./teamView/teamView.constants";
import { EMPTY_MEMBER, type NewMember, type TeamViewProps } from "./teamView/teamView.types";

export function TeamView({ team, microId, onUpdateTeam, onAddMember, onRemoveMember, readOnly = false }: TeamViewProps) {
    const { showToast } = useToast();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [form, setForm] = useState<NewMember>(EMPTY_MEMBER);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<NewMember>(EMPTY_MEMBER);
    const [removeConfirm, setRemoveConfirm] = useState<{ memberId: string | null; memberName?: string; open: boolean }>({ memberId: null, open: false });
    const [isAdding, setIsAdding] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("");

    const microMeta = microId ? getMicroregiaoById(microId) : undefined;

    const municipiosOrdenados = useMemo(() => {
        if (!microId) {
            return [];
        }

        return getMunicipiosByMicro(microId)
            .map((municipio) => municipio.nome)
            .sort((a, b) => a.localeCompare(b, "pt-BR"));
    }, [microId]);

    const filteredTeam = useMemo(() => {
        return team.filter((member) => {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch = !searchTerm
                || member.name.toLowerCase().includes(searchLower)
                || member.email.toLowerCase().includes(searchLower)
                || member.municipio.toLowerCase().includes(searchLower);
            const matchesRole = !roleFilter || member.role === roleFilter;

            return matchesSearch && matchesRole;
        });
    }, [roleFilter, searchTerm, team]);

    const handleAdd = async () => {
        if (readOnly || !microId) {
            return;
        }

        if (!form.name.trim() || !form.role.trim() || !form.email.trim()) {
            showToast("Por favor, preencha todos os campos obrigatórios: Nome, Cargo e Email.", "error");
            return;
        }

        if (!TEAM_EMAIL_REGEX.test(form.email.trim())) {
            showToast("Por favor, insira um endereço de email válido.", "error");
            return;
        }

        setIsAdding(true);
        try {
            if (onAddMember) {
                const newMember = await onAddMember({
                    email: form.email.trim(),
                    microregiaoId: microId,
                    municipio: form.municipio.trim(),
                    name: form.name.trim(),
                    role: form.role,
                });

                if (newMember) {
                    showToast("Membro adicionado com sucesso!", "success");
                    setForm(EMPTY_MEMBER);
                    setIsAddOpen(false);
                }

                return;
            }

            const nextMember: TeamMember = {
                email: form.email.trim(),
                id: crypto.randomUUID(),
                microregiaoId: microId,
                municipio: form.municipio.trim(),
                name: form.name.trim(),
                role: form.role,
            };
            onUpdateTeam?.(microId, [...team, nextMember]);
            setForm(EMPTY_MEMBER);
            setIsAddOpen(false);
        } catch (error) {
            logError("TeamView", "Erro ao adicionar membro", error);
        } finally {
            setIsAdding(false);
        }
    };

    const handleRemove = (memberId: string) => {
        if (readOnly || !microId) {
            return;
        }

        const member = team.find((teamMember) => teamMember.id === memberId);
        setRemoveConfirm({ memberId, memberName: member?.name, open: true });
    };

    const confirmRemove = async () => {
        if (!removeConfirm.memberId || !microId) {
            return;
        }

        setIsRemoving(true);
        try {
            if (onRemoveMember) {
                await onRemoveMember(removeConfirm.memberId);
            } else {
                onUpdateTeam?.(microId, team.filter((member) => member.id !== removeConfirm.memberId));
            }
        } catch (error) {
            logError("TeamView", "Erro ao remover membro", error);
        } finally {
            setIsRemoving(false);
            setRemoveConfirm({ memberId: null, open: false });
        }
    };

    const startEdit = (member: TeamMember) => {
        setEditingId(member.id);
        setEditForm({ email: member.email, municipio: member.municipio, name: member.name, role: member.role });
    };

    const saveEdit = (memberId: string) => {
        if (readOnly || !microId) {
            return;
        }

        onUpdateTeam?.(
            microId,
            team.map((member) => (member.id === memberId ? { ...member, ...editForm } : member)),
        );
        setEditingId(null);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-20">
            <TeamViewHeader count={filteredTeam.length} microName={microMeta?.nome} />

            <TeamViewToolbar
                isAddOpen={isAddOpen}
                onSearchChange={setSearchTerm}
                onToggleAdd={() => setIsAddOpen((current) => !current)}
                readOnly={readOnly}
                roleFilter={roleFilter}
                roles={ROLES_OPTIONS}
                searchTerm={searchTerm}
                setRoleFilter={setRoleFilter}
            />

            <TeamMemberFormCard
                form={form}
                isAdding={isAdding}
                isOpen={isAddOpen}
                municipios={municipiosOrdenados}
                onCancel={() => setIsAddOpen(false)}
                onChange={setForm}
                onSubmit={handleAdd}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTeam.map((member) => (
                    <TeamMemberCard
                        editForm={editForm}
                        isEditing={editingId === member.id}
                        key={member.id}
                        member={member}
                        municipios={municipiosOrdenados}
                        onCancelEdit={() => setEditingId(null)}
                        onChangeEditForm={setEditForm}
                        onEdit={() => startEdit(member)}
                        onRemove={() => handleRemove(member.id)}
                        onSaveEdit={() => saveEdit(member.id)}
                        readOnly={readOnly}
                    />
                ))}
            </div>

            {filteredTeam.length === 0 ? (
                <TeamViewEmptyState
                    onReset={!readOnly ? () => {
                        setSearchTerm("");
                        setRoleFilter("");
                        setIsAddOpen(true);
                    } : undefined}
                    readOnly={readOnly}
                />
            ) : null}

            <ConfirmModal
                cancelText="Cancelar"
                confirmText={isRemoving ? "Removendo..." : "Sim, Remover"}
                isOpen={removeConfirm.open}
                message={`Você está prestes a remover ${removeConfirm.memberName} da equipe. Esta ação não pode ser desfeita.`}
                onClose={() => setRemoveConfirm({ memberId: null, open: false })}
                onConfirm={confirmRemove}
                title="Remover Colaborador"
                type="danger"
            />
        </div>
    );
}
