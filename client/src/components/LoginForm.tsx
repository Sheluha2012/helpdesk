import { useState } from "react";
import type { FormEvent } from "react";
import { login } from "../api";
import type { AuthUser } from "../types";

interface Props {
    onLogin: (user: AuthUser) => void;
    notice?: string;
}

export default function LoginForm({ onLogin, notice }: Props) {
    const [loginName, setLoginName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            onLogin(await login(loginName, password));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка входа");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="login-wrapper">
            <form className="card login-card" onSubmit={handleSubmit}>
                <h2>Вход в Helpdesk</h2>

                {notice && <div className="notice">{notice}</div>}
                {error && <div className="error">{error}</div>}

                <div className="form-group">
                    <label htmlFor="login">Логин</label>
                    <input id="login" value={loginName} autoFocus required
                           onChange={e => setLoginName(e.target.value)} />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Пароль</label>
                    <input id="password" type="password" value={password} required
                           onChange={e => setPassword(e.target.value)} />
                </div>

                <button type="submit" disabled={submitting}>
                    {submitting ? "Вход..." : "Войти"}
                </button>
            </form>
        </div>
    );
}