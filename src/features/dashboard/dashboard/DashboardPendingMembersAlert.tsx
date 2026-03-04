import { UserPlus } from "lucide-react";

import type { TeamMember } from "../../../types";

interface DashboardPendingMembersAlertProps {
    onNavigateTeam: () => void;
    pendingMembers: TeamMember[];
}

export function DashboardPendingMembersAlert({ onNavigateTeam, pendingMembers }: DashboardPendingMembersAlertProps) {
    return (
        <div
            className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4 flex items-start gap-3 cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
            onClick={onNavigateTeam}
            role="button"
            tabIndex={0}
            title="Clique para gerenciar a equipe"
        >
            <div className="p-2 bg-amber-100 dark:bg-amber-800/50 rounded-lg shrink-0">
                <UserPlus className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
                <h4 className="font-semibold text-amber-800 dark:text-amber-300 text-sm">
                    {pendingMembers.length} membro{pendingMembers.length > 1 ? "s" : ""} aguardando cadastro
                </h4>
                <p className="text-amber-700 dark:text-amber-400 text-xs mt-0.5">
                    {pendingMembers.map((member) => member.name).slice(0, 3).join(", ")}
                    {pendingMembers.length > 3 ? ` e mais ${pendingMembers.length - 3}...` : null}
                </p>
                <p className="text-amber-600 dark:text-amber-500 text-xs mt-1 font-medium">
                    Clique para gerenciar aprovações na aba Equipe.
                </p>
            </div>
        </div>
    );
}
