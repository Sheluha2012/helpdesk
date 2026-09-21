import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const COOKIE_NAME = "token";
export const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-me";
export const TOKEN_TTL_SECONDS = Number(process.env.TOKEN_TTL_SECONDS) || 3600;

if (!process.env.JWT_SECRET) {
    console.warn("JWT_SECRET не задан: используется небезопасный секрет для разработки");
}

export interface AuthUser {
    id: number;
    login: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
    const token = req.cookies?.[COOKIE_NAME];

    if (!token) {
        res.status(401).json({ error: "Требуется аутентификация" });
        return;
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] }) as jwt.JwtPayload;
        req.user = { id: Number(payload.sub), login: payload.login };
        next();
    } catch {
        res.status(401).json({ error: "Недействительный или просроченный токен" });
    }
}