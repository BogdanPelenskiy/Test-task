import express from "express";
import morgan from "morgan";
import taskRoutes from "./routes/task.routes";
import { errorMiddleware } from "./middlewares/error.middleware";

export const app = express();

app.use(express.json());
app.use(morgan(":method :url :status - :response-time ms"));

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/tasks", taskRoutes);

// 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: { code: "NOT_FOUND", message: "Route not found" } });
});

app.use(errorMiddleware);
