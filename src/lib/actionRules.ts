import { Action } from "../types";

/**
 * Parses a local date string (YYYY-MM-DD) correctly avoiding timezone offsets
 */
export const parseDateLocal = (dateStr?: string | null): Date | null => {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
};

export const formatISODate = (date: Date): string => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
};

export const clampProgress = (val: number) => Math.min(100, Math.max(0, val));

export type ActionRuleErrors = {
    startAfterPlanned?: string;
    endBeforeStart?: string;
    lateNeedsPlanned?: string;
    missingResponsible?: string;
};

export interface ActionRulesResult {
    next: Action;
    errors: ActionRuleErrors;
    ui: {
        progressDisabled: boolean;
        progressDisabledReason: string;
        isOverdue: boolean;
    };
}

export function applyActionRules(
    prev: Action,
    patch: Partial<Action>,
    now = new Date()
): ActionRulesResult {
    const next: Action = { ...prev, ...patch };

    // 1. Clamp progress
    if (next.progress !== undefined) {
        next.progress = clampProgress(next.progress);
    }

    // 2. Parse dates for logic
    const start = parseDateLocal(next.startDate);
    const planned = parseDateLocal(next.plannedEndDate); // Fim planejado
    const end = parseDateLocal(next.endDate); // Fim real

    const errors: ActionRuleErrors = {};

    // 3. Date Validations
    if (start && planned && planned < start) {
        errors.startAfterPlanned = "Fim planejado deve ser igual ou depois do início.";
    }
    if (start && end && end < start) {
        errors.endBeforeStart = "Fim real deve ser igual ou depois do início.";
    }
    if (next.status === "Atrasado" && !next.plannedEndDate) {
        errors.lateNeedsPlanned = 'Para status "Atrasado", defina o fim planejado.';
    }

    // 4. Automatisms (Hierarchy of Truth)

    // X. Manual Status Unlock
    // If status changed FROM "Concluído" TO something else, ensure progress is not 100%
    // Otherwise Rule C will force it back to "Concluído".
    if (prev.status === "Concluído" && next.status !== "Concluído" && next.progress === 100) {
        next.progress = 0; // Reset to 0 (user implies re-starting or at least not done)
        // Alternative: 99? 0 feels safer for "Em Andamento" usually starting fresh or user will drag.
        // Let's use 0 because if they choose "Em Andamento" usually it means "Still working", 100% is effectively done.
        // Actually, let's use 50? No, 0 is standard for "Started but no progress recorded".
        // Wait, if I choose "Em Andamento" for a bug fix, maybe I want 90?
        // Let's set to 0. It encourages the user to set the real progress.
    }

    // A. Fim Real PREVALECE -> Concluído & 100%
    if (next.endDate) {
        next.status = "Concluído";
        next.progress = 100;
    }

    // B. Status Concluído -> Força 100%
    if (next.status === "Concluído" && next.progress < 100) {
        next.progress = 100;
    }

    // C. Progresso 100% -> Força Concluído
    if (next.progress === 100 && next.status !== "Concluído") {
        next.status = "Concluído";
    }

    // D. Progresso > 0 -> Tira de "Não Iniciado"
    if (next.progress > 0 && next.status === "Não Iniciado") {
        next.status = "Em Andamento";
    }

    // 5. UX Logic (Blocking & Feedback)

    // Has any date set?
    const hasAnyDate = !!next.startDate || !!next.plannedEndDate || !!next.endDate;

    // Is Progress Slider Disabled?
    // Disabled if:
    // - Status is "Não Iniciado" AND no dates are set -> Prevent premature progress
    // Note: We DO NOT disable for Concluded/EndDate anymore, to allow user interaction (which triggers Reopen Confirmation)
    let progressDisabled = false;
    let progressDisabledReason = '';

    if (next.status === "Não Iniciado" && !hasAnyDate) {
        progressDisabled = true;
        progressDisabledReason = "Defina status ou datas para liberar o progresso.";
    }

    // 6. Overdue Detection (Visual Badge only)
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const isOverdue = !!planned && planned < today && !end && next.progress < 100;

    // 7. Responsible Validation
    // Check if there is at least one "Responsável" (R) in the RACI list
    // logic: raci array exists AND has at least one item with role === 'R'
    const hasResponsible = next.raci && next.raci.some(m => m.role === 'R');
    if (!hasResponsible) {
        errors.missingResponsible = "Defina pelo menos um Responsável.";
    }

    return {
        next,
        errors,
        ui: {
            progressDisabled,
            progressDisabledReason: progressDisabledReason || '',
            isOverdue: !!isOverdue
        }
    };
}

export function canSaveAction(action: Action, errors: ActionRuleErrors): boolean {
    // 1. Title required and distinct from default
    if (!action.title || action.title.trim() === "" || action.title === "Nova Ação") {
        return false;
    }

    // 2. Must have no validation errors
    if (Object.keys(errors).length > 0) {
        return false;
    }

    return true;
}
