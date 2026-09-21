import bcrypt from "bcryptjs";

export interface User {
    id: number;
    login: string;
    passwordHash: string;
}

export const users: User[] = [
    { id: 1, login: "admin", passwordHash: bcrypt.hashSync(process.env.ADMIN_PASSWORD ?? "admin123", 10) },
    { id: 2, login: "user", passwordHash: bcrypt.hashSync(process.env.USER_PASSWORD ?? "user123", 10) }
];