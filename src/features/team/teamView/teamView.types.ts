import type { TeamMember } from "../../../types";

export type TeamViewProps = {
    microId: string;
    onAddMember?: (member: Omit<TeamMember, "id">) => Promise<TeamMember | null>;
    onRemoveMember?: (memberId: string) => Promise<boolean>;
    onUpdateTeam?: (microId: string, team: TeamMember[]) => void;
    readOnly?: boolean;
    team: TeamMember[];
};

export type NewMember = Pick<TeamMember, "email" | "municipio" | "name" | "role">;

export const EMPTY_MEMBER: NewMember = {
    email: "",
    municipio: "",
    name: "",
    role: "",
};
