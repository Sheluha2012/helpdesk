import { useState } from "react";
import type { FormEvent } from "react";
import { CATEGORIES, PRIORITY_LABELS } from "../labels";

interface Props {
    onCreate: (data: FormData) => Promise<void>;
}

export default function TicketForm({ onCreate }: Props) {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        setSubmitting(true);
        setError(null);
        try {
            await onCreate(new FormData(form));
            form.reset();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="title">Заголовок проблемы</label>
                <input id="title" name="title" required
                       placeholder="Например: Не работает принтер" />
            </div>

            <div className="form-group">
                <label htmlFor="description">Описание проблемы</label>
                <textarea id="description" name="description" required
                          placeholder="Подробно опишите проблему" />
            </div>

            <div className="form-group">
                <label htmlFor="category">Категория</label>
                <select id="category" name="category" required>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="priority">Приоритет</label>
                <select id="priority" name="priority" defaultValue="medium" required>
                    {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="deadline">Ожидаемая дата решения</label>
                <input id="deadline" name="deadline" type="date" />
            </div>

            <div className="form-group">
                <label htmlFor="file">Прикрепить файл</label>
                <input id="file" name="file" type="file" />
            </div>

            {error && <div className="error">{error}</div>}

            <button type="submit" disabled={submitting}>
                {submitting ? "Создание заявки..." : "Создать заявку"}
            </button>
        </form>
    );
}