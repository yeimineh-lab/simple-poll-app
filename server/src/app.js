import express from "express";

import pollsRoutes from "./routes/polls.routes.js";
import usersRoutes from "./routes/users.routes.js";
import authRoutes from "./routes/auth.routes.js";

import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

import { PUBLIC_DIR } from "./config/paths.js";

const app = express();

app.use(express.json());
app.use(express.static(PUBLIC_DIR));

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/v1", pollsRoutes);
app.use("/api/v1", usersRoutes);
app.use("/api/v1", authRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;