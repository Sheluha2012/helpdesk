import type { Filters } from "../api";
import type { TicketStatus, TicketPriority } from "../types";
import { STATUS_LABELS, PRIORITY_LABELS } from "../labels";

interface Props {
    filters: Filters;
    onChange: (filters: Filters) => void;
}

export default function FilterBar({ filters, onChange }: Props) {
    return (
        <div className="filter-form">
            <div className="form-group">
                <label htmlFor="status-filter">Статус</label>
                <select
                    id="status-filter"
                    value={filters.status}
                    onChange={e =>
                        onChange({ ...filters, status: e.target.value as TicketStatus | "" })
                    }
                >
                    <option value="">Все статусы</option>
                    {Object.entries(STATUS_LABELS).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="priority-filter">Приоритет</label>
                <select
                    id="priority-filter"
                    value={filters.priority}
                    onChange={e =>
                        onChange({ ...filters, priority: e.target.value as TicketPriority | "" })
                    }
                >
                    <option value="">Все приоритеты</option>
                    {Object.entries(PRIORITY_LABELS).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}