export type PeriodFilter = "today" | "7d" | "30d" | "60d" | "90d";
export type AnalyticsModalType = "users" | "sessions" | "time" | "engagement";

export interface ActiveUserListItem {
    id: string;
    name: string;
    email: string;
    microregiaoId: string;
    municipio: string;
    lastActivity: string;
}
