import { type Dispatch, type SetStateAction } from 'react';
import { Plus, Trash2, Users } from 'lucide-react';
import { Action, RaciRole, TeamMember } from '../../../types';
import { ActionRuleErrors } from '../../../lib/actionRules';
import { actionDetailRoleLabels, actionDetailRolePriority } from './actionDetail.constants';

interface ActionDetailMobileRaciSectionProps {
  action: Action;
  team: TeamMember[];
  userCanEdit: boolean;
  ruleErrors: ActionRuleErrors;
  selectedRaciMemberId: string;
  setSelectedRaciMemberId: Dispatch<SetStateAction<string>>;
  newRaciRole: RaciRole;
  setNewRaciRole: Dispatch<SetStateAction<RaciRole>>;
  handleAddRaci: () => void;
  handleRemoveRaci: (index: number) => void;
}

export function ActionDetailMobileRaciSection({
  action,
  team,
  userCanEdit,
  ruleErrors,
  selectedRaciMemberId,
  setSelectedRaciMemberId,
  newRaciRole,
  setNewRaciRole,
  handleAddRaci,
  handleRemoveRaci,
}: ActionDetailMobileRaciSectionProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-800">
      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600 flex justify-between items-center">
        <span className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
          <Users size={16} className="text-teal-600" />
          Equipe RACI
        </span>
        {ruleErrors.missingResponsible && (
          <span className="text-[10px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-2 py-0.5 rounded-full animate-pulse">
            Requer Responsavel
          </span>
        )}
        <span className="bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-400 text-xs px-2.5 py-1 rounded-full font-bold">
          {action.raci?.length || 0}
        </span>
      </div>

      <div className="flex-1 px-4 py-3 overflow-y-auto space-y-2">
        {action.raci?.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center h-full py-12">
            <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-full mb-3">
              <Users className="text-slate-300" size={32} />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Nenhum membro atribuido</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Adicione membros a equipe desta acao</p>
          </div>
        ) : (
          [...action.raci]
            .sort((left, right) => actionDetailRolePriority[left.role] - actionDetailRolePriority[right.role])
            .map((member, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${actionDetailRoleLabels[member.role].color}`}>
                  {member.name.split(' ').map((item) => item[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{member.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{actionDetailRoleLabels[member.role].label}</p>
                </div>
                <div className={`px-2 py-1 rounded-md text-xs font-bold text-white ${actionDetailRoleLabels[member.role].color}`}>
                  {member.role}
                </div>
                {userCanEdit && (
                  <button
                    onClick={() => handleRemoveRaci(index)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))
        )}
      </div>

      {userCanEdit && (
        <div className="p-4 bg-slate-50 dark:bg-slate-700 border-t border-slate-200 dark:border-slate-600 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <select
              value={selectedRaciMemberId}
              onChange={(event) => setSelectedRaciMemberId(event.target.value)}
              className="text-sm border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <option value="">Selecionar pessoa...</option>
              {team
                .filter((member) => !action.raci.some((raciMember) => raciMember.name === member.name))
                .map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
            </select>
            <select
              value={newRaciRole}
              onChange={(event) => setNewRaciRole(event.target.value as RaciRole)}
              className="text-sm border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <option value="R">R - Responsavel</option>
              <option value="A">A - Aprovador</option>
              <option value="I">I - Informado</option>
            </select>
          </div>
          <button
            onClick={handleAddRaci}
            disabled={!selectedRaciMemberId}
            className="w-full py-2.5 bg-teal-600 text-white rounded-lg font-bold text-sm hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            Adicionar Membro
          </button>
        </div>
      )}
    </div>
  );
}
