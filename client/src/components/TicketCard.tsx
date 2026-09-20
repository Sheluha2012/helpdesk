import type { Ticket, TicketStatus } from "../types";
import { STATUS_LABELS, PRIORITY_LABELS, formatDate } from "../labels";

interface Props {
    ticket: Ticket;
    onStatusChange: (status: TicketStatus) => void;
    onDelete: () => void;
}

export default function TicketCard({ ticket, onStatusChange, onDelete }: Props) {
    return (
        <article className="ticket">
            <h3>{ticket.title}</h3>

            <div className="ticket-info">
                <div>
                    <strong>Статус: </strong>
                    <span className={`badge status-${ticket.status}`}>
                        {STATUS_LABELS[ticket.status]}
                    </span>
                </div>
                <div>
                    <strong>Приоритет: </strong>
                    <span className={`badge priority-${ticket.priority}`}>
                        {PRIORITY_LABELS[ticket.priority]}
                    </span>
                </div>
                <div><strong>Категория: </strong>{ticket.category}</div>
                <div><strong>Создана: </strong>{formatDate(ticket.createdAt)}</div>
                <div><strong>Срок решения: </strong>{formatDate(ticket.deadline)}</div>
            </div>

            <p className="ticket-description">{ticket.description}</p>

            {ticket.file && (
                <div>
                    <strong>Вложение: </strong>
                    <a href={`/uploads/${encodeURIComponent(ticket.file)}`}
                       target="_blank" rel="noreferrer">
                        Открыть файл
                    </a>
                </div>
            )}

            <div className="actions">
                <label>
                    Изменить статус:{" "}
                    <select
                        value={ticket.status}
                        onChange={e => onStatusChange(e.target.value as TicketStatus)}
                    >
                        {Object.entries(STATUS_LABELS).map(([v, l]) => (
                            <option key={v} value={v}>{l}</option>
                        ))}
                    </select>
                </label>

                <button
                    className="danger"
                    onClick={() => {
                        if (confirm("Удалить эту заявку?")) onDelete();
                    }}
                >
                    Удалить
                </button>
            </div>
        </article>
    );
}