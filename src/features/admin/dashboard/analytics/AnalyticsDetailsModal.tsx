import { Activity, Timer, UserCheck, X, Zap } from "lucide-react";

import { getMicroregiaoById } from "../../../../data/microregioes";
import type { AnalyticsSummary } from "../../../../types/analytics.types";
import {
    formatMinutesFromSeconds,
    formatPageName,
    getEstimatedRegisteredUsers,
    MODAL_CONFIG,
} from "./analyticsDashboard.constants";
import type { ActiveUserListItem, AnalyticsModalType } from "./analyticsDashboard.types";

interface AnalyticsDetailsModalProps {
    openModal: AnalyticsModalType | null;
    summary: AnalyticsSummary;
    activeUsersList: ActiveUserListItem[];
    onClose: () => void;
}

function AnalyticsModalHero({ openModal, summary }: { openModal: AnalyticsModalType; summary: AnalyticsSummary }) {
    switch (openModal) {
        case "users":
            return (
                <>
                    <span className="text-5xl font-bold">{summary.activeUsersToday}</span>
                    <span className="text-white/70 mb-2">usuários hoje | {summary.activeUsersTotal} no período</span>
                </>
            );
        case "sessions":
            return (
                <>
                    <span className="text-5xl font-bold">{summary.sessionsToday}</span>
                    <span className="text-white/70 mb-2">sessões iniciadas hoje</span>
                </>
            );
        case "time":
            return (
                <>
                    <span className="text-5xl font-bold">{formatMinutesFromSeconds(summary.avgSessionDuration)}</span>
                    <span className="text-white/70 mb-2">tempo médio por sessão</span>
                </>
            );
        case "engagement":
            return (
                <>
                    <span className="text-5xl font-bold">{summary.engagementRate}%</span>
                    <span className="text-white/70 mb-2">dos usuários estão ativos</span>
                </>
            );
    }
}

function AnalyticsUsersDetail({ summary, activeUsersList }: { summary: AnalyticsSummary; activeUsersList: ActiveUserListItem[] }) {
    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-teal-600" />
                Distribuição de Usuários
            </h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl text-center">
                    <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">{summary.activeUsersToday}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Ativos Hoje</p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{activeUsersList.length}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Ativos no Período</p>
                </div>
            </div>

            <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Usuários Ativos ({activeUsersList.length})
                </h4>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {activeUsersList.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                            Nenhum usuário ativo no período selecionado.
                        </p>
                    ) : (
                        activeUsersList.map((user, index) => (
                            <div
                                key={user.id || index}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center">
                                        <span className="text-teal-700 dark:text-teal-300 font-medium text-sm">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-gray-100 text-sm">{user.name}</p>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                            <span className="bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded">
                                                {getMicroregiaoById(user.microregiaoId)?.nome || user.microregiaoId || "N/A"}
                                            </span>
                                            {user.municipio ? <span className="text-gray-400">• {user.municipio}</span> : null}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {user.lastActivity
                                            ? new Date(user.lastActivity).toLocaleString("pt-BR", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })
                                            : "-"}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

function AnalyticsSessionsDetail({ summary }: { summary: AnalyticsSummary }) {
    const hourlyMax = Math.max(...summary.hourlyUsage.map((item) => item.count), 1);

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                Análise de Sessões
            </h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{summary.sessionsToday}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Sessões Hoje</p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-center">
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{formatMinutesFromSeconds(summary.avgSessionDuration)}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Duração Média</p>
                </div>
            </div>
            <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Pico de Uso por Hora</h4>
                <div className="flex items-end gap-1 h-24">
                    {summary.hourlyUsage.map((item, index) => {
                        const height = (item.count / hourlyMax) * 100;
                        return (
                            <div key={`${item.hour}-${index}`} className="flex-1 flex flex-col items-center">
                                <div
                                    className="w-full bg-blue-500 rounded-t transition-all"
                                    style={{ height: `${height}%`, minHeight: item.count > 0 ? 4 : 0 }}
                                />
                                {index % 4 === 0 ? <span className="text-[10px] text-gray-400 mt-1">{item.hour}h</span> : null}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function AnalyticsTimeDetail({ summary }: { summary: AnalyticsSummary }) {
    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Timer className="w-4 h-4 text-purple-600" />
                Análise de Tempo
            </h3>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Tempo médio de sessão</span>
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{formatMinutesFromSeconds(summary.avgSessionDuration)}</span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full"
                        style={{ width: `${Math.min((summary.avgSessionDuration / 60 / 30) * 100, 100)}%` }}
                    />
                </div>
                <p className="text-xs text-gray-500 mt-2">Meta: 30 minutos por sessão</p>
            </div>
            <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Páginas Mais Visitadas</h4>
                {summary.topPages.slice(0, 5).map((page, index) => (
                    <div key={`${page.page}-${index}`} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{formatPageName(page.page)}</span>
                        <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                            {page.views} views ({page.percentage}%)
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function AnalyticsEngagementDetail({ summary }: { summary: AnalyticsSummary }) {
    const estimatedRegisteredUsers = getEstimatedRegisteredUsers(summary.activeUsersTotal, summary.engagementRate);

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-600" />
                Análise de Engajamento
            </h3>
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Taxa de Engajamento</span>
                    <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{summary.engagementRate}%</span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" style={{ width: `${summary.engagementRate}%` }} />
                </div>
                <p className="text-xs text-gray-500 mt-2">Usuários ativos / total de usuários cadastrados</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">{summary.activeUsersTotal}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Usuários Ativos</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                    <p className="text-xl font-bold text-gray-600 dark:text-gray-400">{estimatedRegisteredUsers}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Total Cadastrados</p>
                </div>
            </div>
            {summary.inactiveMunicipalities.length > 0 ? (
                <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg">
                    <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
                        {summary.inactiveMunicipalities.length} município(s) inativo(s)
                    </p>
                    <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">Sem acesso nos últimos 7 dias</p>
                </div>
            ) : null}
        </div>
    );
}

function AnalyticsModalContent({
    openModal,
    summary,
    activeUsersList,
}: {
    openModal: AnalyticsModalType;
    summary: AnalyticsSummary;
    activeUsersList: ActiveUserListItem[];
}) {
    switch (openModal) {
        case "users":
            return <AnalyticsUsersDetail summary={summary} activeUsersList={activeUsersList} />;
        case "sessions":
            return <AnalyticsSessionsDetail summary={summary} />;
        case "time":
            return <AnalyticsTimeDetail summary={summary} />;
        case "engagement":
            return <AnalyticsEngagementDetail summary={summary} />;
    }
}

export function AnalyticsDetailsModal({
    openModal,
    summary,
    activeUsersList,
    onClose,
}: AnalyticsDetailsModalProps) {
    if (!openModal) {
        return null;
    }

    const modal = MODAL_CONFIG[openModal];
    const ModalIcon = modal.icon;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200">
                <div className={`p-6 text-white relative overflow-hidden ${modal.gradient}`}>
                    <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    <div className="relative flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                <ModalIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">{modal.title}</h2>
                                <p className="text-white/80 text-sm mt-1">{modal.description}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="mt-6 flex items-end gap-2">
                        <AnalyticsModalHero openModal={openModal} summary={summary} />
                    </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-[50vh]">
                    <AnalyticsModalContent openModal={openModal} summary={summary} activeUsersList={activeUsersList} />
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-lg font-semibold transition-colors"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}

