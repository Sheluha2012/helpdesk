import { useEffect, useState } from "react";
import type { AuthUser } from "./types";
import { getMe, logout, setUnauthorizedHandler } from "./api";
import LoginForm from "./components/LoginForm";
import Helpdesk from "./components/Helpdesk";

export default function App() {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [checking, setChecking] = useState(true);
    const [expired, setExpired] = useState(false);

    useEffect(() => {
        setUnauthorizedHandler(() => {
            setUser(null);
            setExpired(true);
        });

        getMe()
            .then(setUser)
            .catch(() => setUser(null))
            .finally(() => setChecking(false));
    }, []);

    async function handleLogout() {
        try {
            await logout();
        } finally {
            setUser(null);
            setExpired(false);
        }
    }

    if (checking) return <p className="empty">Загрузка...</p>;

    if (!user) {
        return (
            <LoginForm
                notice={expired ? "Сессия истекла. Войдите снова." : undefined}
                onLogin={u => {
                    setUser(u);
                    setExpired(false);
                }}
            />
        );
    }

    return <Helpdesk user={user} onLogout={handleLogout} />;
}