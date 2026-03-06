// app.mjs
// Sets up the Express app, middleware, static files, API routes, and error handling.

import express from "express";

// API route modules
import pollsRoutes from "./routes/polls.routes.mjs";
import usersRoutes from "./routes/users.routes.mjs";
import authRoutes from "./routes/auth.routes.mjs";
import votesRoutes from "./routes/votes.routes.mjs";

// App middleware
import requireJson from "./middleware/requireJson.mjs";
import notFound from "./middleware/notFound.mjs";
import errorHandler from "./middleware/errorHandler.mjs";

// App config
import { PUBLIC_DIR } from "./config/paths.mjs";

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Require application/json for non-GET API requests
app.use(requireJson);

// Serve static frontend files from /public
app.use(express.static(PUBLIC_DIR));

// Simple health check endpoint
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// API routes
app.use("/api/v1", pollsRoutes);
app.use("/api/v1", usersRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", votesRoutes);

// Handle unknown routes
app.use(notFound);

// Handle application errors
app.use(errorHandler);

export default app;