import express, { Request, Response } from "express";
import path from "path";
import multer from "multer";
import { Ticket, TicketStatus, TicketPriority } from "./types";

const app = express();
const PORT = 3000;

const STATUSES: TicketStatus[] = ["new", "in-progress", "resolved", "closed"];
const PRIORITIES: TicketPriority[] = ["low", "medium", "high", "critical"];
const CATEGORIES = [
    "Компьютеры", "Принтеры", "Сеть",
    "Программное обеспечение", "Учётные записи", "Другое"
];

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const upload = multer({
    storage: multer.diskStorage({
        destination: (_req, _file, cb) =>
            cb(null, path.join(__dirname, "../uploads")),
        filename: (_req, file, cb) => {
            const original = Buffer.from(file.originalname, "latin1").toString("utf8");
            cb(null, Date.now() + "-" + path.basename(original));
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 }
});

let tickets: Ticket[] = [
    { id: 1, title: "Не работает компьютер",
      description: "Компьютер не включается после нажатия кнопки питания.",
      category: "Компьютеры", priority: "high", status: "new",
      createdAt: "2026-09-15", deadline: "2026-09-18" },
    { id: 2, title: "Не печатает принтер",
      description: "Принтер не реагирует на отправку документов.",
      category: "Принтеры", priority: "medium", status: "in-progress",
      createdAt: "2026-09-14", deadline: "2026-09-19" }
];
let nextId = 3;

const findTicket = (req: Request) =>
    tickets.find(t => t.id === Number(req.params.id));

app.get("/api/tickets", (req: Request, res: Response) => {
    const { status, priority } = req.query;

    if (status && !STATUSES.includes(status as TicketStatus)) {
        res.status(400).json({ error: "Неверный статус" });
        return;
    }
    if (priority && !PRIORITIES.includes(priority as TicketPriority)) {
        res.status(400).json({ error: "Неверный приоритет" });
        return;
    }

    let result = tickets;
    if (status) result = result.filter(t => t.status === status);
    if (priority) result = result.filter(t => t.priority === priority);
    res.status(200).json(result);
});

app.get("/api/tickets/:id", (req: Request, res: Response) => {
    const ticket = findTicket(req);
    if (!ticket) {
        res.status(404).json({ error: "Заявка не найдена" });
        return;
    }
    res.status(200).json(ticket);
});

app.post("/api/tickets", upload.single("file"), (req: Request, res: Response) => {
    const { title, description, category, priority, deadline } = req.body;

    if (!title?.trim() || !description?.trim()) {
        res.status(400).json({ error: "Заголовок и описание обязательны" });
        return;
    }
    if (!CATEGORIES.includes(category)) {
        res.status(400).json({ error: "Неверная категория" });
        return;
    }
    if (!PRIORITIES.includes(priority)) {
        res.status(400).json({ error: "Неверный приоритет" });
        return;
    }

    const ticket: Ticket = {
        id: nextId++,
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        status: "new",
        createdAt: new Date().toISOString().slice(0, 10),
        deadline: deadline || undefined,
        file: req.file?.filename
    };
    tickets.push(ticket);
    res.status(201).location(`/api/tickets/${ticket.id}`).json(ticket);
});

app.patch("/api/tickets/:id", (req: Request, res: Response) => {
    const ticket = findTicket(req);
    if (!ticket) {
        res.status(404).json({ error: "Заявка не найдена" });
        return;
    }

    const { status, priority } = req.body;
    if (status !== undefined) {
        if (!STATUSES.includes(status)) {
            res.status(400).json({ error: "Неверный статус" });
            return;
        }
        ticket.status = status;
    }
    if (priority !== undefined) {
        if (!PRIORITIES.includes(priority)) {
            res.status(400).json({ error: "Неверный приоритет" });
            return;
        }
        ticket.priority = priority;
    }
    res.status(200).json(ticket);
});

app.delete("/api/tickets/:id", (req: Request, res: Response) => {
    const ticket = findTicket(req);
    if (!ticket) {
        res.status(404).json({ error: "Заявка не найдена" });
        return;
    }
    tickets = tickets.filter(t => t.id !== ticket.id);
    res.status(204).send();
});

const clientDist = path.join(__dirname, "../client/dist");
app.use(express.static(clientDist));
app.get(/^\/(?!api|uploads).*/, (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
});

app.listen(PORT, () => {
    console.log(`Helpdesk API: http://localhost:${PORT}`);
});