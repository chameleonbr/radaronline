import React, { useState } from "react";

import { useAuth } from "../../auth";
import { useResponsive } from "../../hooks/useMediaQuery";
import { StrategicReportGenerator } from "../../components/reports/StrategicReportGenerator";
import { DashboardChartsSection } from "./dashboard/DashboardChartsSection";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { DashboardKpiSection } from "./dashboard/DashboardKpiSection";
import { DashboardPendingMembersAlert } from "./dashboard/DashboardPendingMembersAlert";
import { DashboardSummaryPanels } from "./dashboard/DashboardSummaryPanels";
import type { DashboardProps } from "./dashboard/dashboard.types";
import { useDashboardMetrics } from "./dashboard/useDashboardMetrics";

export const Dashboard: React.FC<DashboardProps> = ({
    actions,
    activities,
    objectives,
    onNavigate,
    team,
}) => {
    const { user } = useAuth();
    const { isMobile } = useResponsive();
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const { metrics, pendingMembers, showPendingMembers } = useDashboardMetrics({
        actions,
        activities,
        objectives,
        team,
        user,
    });

    const handleCardClick = (status?: string) => {
        onNavigate("list", { status });
    };

    return (
        <div className="space-y-6 pb-8 animate-fade-in">
            {showPendingMembers ? (
                <DashboardPendingMembersAlert
                    onNavigateTeam={() => onNavigate("team")}
                    pendingMembers={pendingMembers}
                />
            ) : null}

            <DashboardHeader
                onOpenReport={() => setIsReportModalOpen(true)}
                userName={user?.nome}
            />

            <DashboardKpiSection
                isMobile={isMobile}
                metrics={metrics}
                onCardClick={handleCardClick}
                onNavigateToList={() => onNavigate("list", {})}
            />

            <DashboardChartsSection
                isMobile={isMobile}
                metrics={metrics}
                onNavigateObjective={(objectiveId) => onNavigate("list", { objectiveId })}
                onStatusClick={handleCardClick}
            />

            <DashboardSummaryPanels
                isMobile={isMobile}
                metrics={metrics}
            />

            <StrategicReportGenerator
                actions={actions}
                activities={activities}
                isOpen={isReportModalOpen}
                microName={user?.microregiaoId || "Microrregião"}
                objectives={objectives}
                onClose={() => setIsReportModalOpen(false)}
                team={team}
                userName={user?.nome || "Gestor"}
            />
        </div>
    );
};
