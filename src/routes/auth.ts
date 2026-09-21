import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { users } from "../users";
import { requireAuth, COOKIE_NAME, JWT_SECRET, TOKEN_TTL_SECONDS } from "../middleware/auth";

const router = Router();

const cookieOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.COOKIE_SECURE === "true"
};

router.post("/login", (req: Request, res: Response) => {
    const { login, password } = req.body ?? {};

    if (typeof login !== "string" || typeof password !== "string") {
        res.status(400).json({ error: "Укажите логин и пароль" });
        return;
    }

    const user = users.find(u => u.login === login);
    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
        res.status(401).json({ error: "Неверный логин или пароль" });
        return;
    }

    const token = jwt.sign({ login: user.login }, JWT_SECRET, {
        subject: String(user.id),
        expiresIn: TOKEN_TTL_SECONDS,
        algorithm: "HS256"
    });

    res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: TOKEN_TTL_SECONDS * 1000 });
    res.status(200).json({ id: user.id, login: user.login });
});

router.post("/logout", (_req: Request, res: Response) => {
    res.clearCookie(COOKIE_NAME, cookieOptions);
    res.status(204).send();
});

router.get("/me", requireAuth, (req: Request, res: Response) => {
    res.status(200).json(req.user);
});

export default router;