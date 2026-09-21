import type { Ticket, TicketStatus, TicketPriority, AuthUser } from "./types";

let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(handler: () => void) {
    onUnauthorized = handler;
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(url, init);

    if (res.status === 401 && !url.startsWith("/api/auth/")) {
        onUnauthorized?.();
    }

    if (!res.ok) {
        let message = `Ошибка ${res.status}`;
        try {
            const data = await res.json();
            if (data.error) message = data.error;
        } catch {
            /* тело не JSON */
        }
        throw new Error(message);
    }

    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
}

export function login(loginName: string, password: string): Promise<AuthUser> {
    return request<AuthUser>("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: loginName, password })
    });
}

export function logout(): Promise<void> {
    return request<void>("/api/auth/logout", { method: "POST" });
}

export function getMe(): Promise<AuthUser> {
    return request<AuthUser>("/api/auth/me");
}

export interface Filters {
    status: TicketStatus | "";
    priority: TicketPriority | "";
}

export function getTickets(filters: Filters): Promise<Ticket[]> {
    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.priority) params.set("priority", filters.priority);
    const query = params.toString();
    return request<Ticket[]>(`/api/tickets${query ? "?" + query : ""}`);
}

export function createTicket(data: FormData): Promise<Ticket> {
    return request<Ticket>("/api/tickets", { method: "POST", body: data });
}

export function updateTicket(
    id: number,
    patch: { status?: TicketStatus; priority?: TicketPriority }
): Promise<Ticket> {
    return request<Ticket>(`/api/tickets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch)
    });
}

export function deleteTicket(id: number): Promise<void> {
    return request<void>(`/api/tickets/${id}`, { method: "DELETE" });
}