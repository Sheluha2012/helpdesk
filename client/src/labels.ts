import type { TicketStatus, TicketPriority } from "./types";

export const STATUS_LABELS: Record<TicketStatus, string> = {
    "new": "Новая",
    "in-progress": "В работе",
    "resolved": "Решена",
    "closed": "Закрыта"
};

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
    low: "Низкий",
    medium: "Средний",
    high: "Высокий",
    critical: "Критический"
};

export const CATEGORIES = [
    "Компьютеры", "Принтеры", "Сеть",
    "Программное обеспечение", "Учётные записи", "Другое"
];

export function formatDate(iso?: string): string {
    if (!iso) return "Не указан";
    const [y, m, d] = iso.split("-");
    return `${d}.${m}.${y}`;
}