export type TicketStatus = "new" | "in-progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "critical";

export interface Ticket {
    id: number;
    title: string;
    description: string;
    category: string;
    priority: TicketPriority;
    status: TicketStatus;
    createdAt: string;
    deadline?: string;
    file?: string;
}

export interface AuthUser {
    id: number;
    login: string;
}