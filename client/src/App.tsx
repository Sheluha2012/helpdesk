import { useCallback, useEffect, useState } from "react";
import type { Ticket, TicketStatus } from "./types";
import { getTickets, createTicket, updateTicket, deleteTicket } from "./api";
import type { Filters } from "./api";
import TicketForm from "./components/TicketForm";
import FilterBar from "./components/FilterBar";
import TicketCard from "./components/TicketCard";

export default function App() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [filters, setFilters] = useState<Filters>({ status: "", priority: "" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        try {
            setTickets(await getTickets(filters));
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка загрузки");
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        load();
    }, [load]);

    async function run(action: () => Promise<unknown>) {
        try {
            await action();
            await load();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка");
        }
    }

    return (
        <>
            <header>
                <h1>Helpdesk</h1>
                <p>Система заявок в техническую поддержку</p>
            </header>

            <main>
                {error && <div className="error">{error}</div>}

                <section className="card">
                    <h2>Создать заявку</h2>
                    <TicketForm
                        onCreate={async data => {
                            await createTicket(data);
                            await load();
                        }}
                    />
                </section>

                <section className="card">
                    <h2>Фильтрация заявок</h2>
                    <FilterBar filters={filters} onChange={setFilters} />
                </section>

                <section className="card">
                    <h2>Заявки ({tickets.length})</h2>
                    {loading && <p>Загрузка...</p>}
                    {!loading && tickets.length === 0 && (
                        <p className="empty">Заявок по выбранным фильтрам нет.</p>
                    )}
                    <div className="tickets">
                        {tickets.map(ticket => (
                            <TicketCard
                                key={ticket.id}
                                ticket={ticket}
                                onStatusChange={(status: TicketStatus) =>
                                    run(() => updateTicket(ticket.id, { status }))
                                }
                                onDelete={() => run(() => deleteTicket(ticket.id))}
                            />
                        ))}
                    </div>
                </section>
            </main>
        </>
    );
}