import express from "express";
import { router } from "./routes";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(router);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use(errorMiddleware);

export { app };
