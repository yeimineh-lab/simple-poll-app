import express from "express";

import pollsRoutes from "./routes/polls.routes.mjs";
import usersRoutes from "./routes/users.routes.mjs";
import authRoutes from "./routes/auth.routes.mjs";

import requireJson from "./middleware/requireJson.mjs";
import notFound from "./middleware/notFound.mjs";
import errorHandler from "./middleware/errorHandler.mjs";
import { PUBLIC_DIR } from "./config/paths.mjs";

const app = express();

// Parse JSON bodies
app.use(express.json());

// Enforce JSON Content-Type for non-GET requests (keeps middleware "connected")
app.use(requireJson);

// Serve frontend
app.use(express.static(PUBLIC_DIR));

app.get("/health", (req, res) => res.json({ ok: true }));

// API routes
app.use("/api/v1", pollsRoutes);
app.use("/api/v1", usersRoutes);
app.use("/api/v1", authRoutes);

// Fallback + errors
app.use(notFound);
app.use(errorHandler);

export default app;