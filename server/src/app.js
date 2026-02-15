const express = require("express");

const pollsRoutes = require("./routes/polls.routes.js");
const usersRoutes = require("./routes/users.routes.js");
const authRoutes = require("./routes/auth.routes.js");

const notFound = require("./middleware/notFound.js");
const errorHandler = require("./middleware/errorHandler.js");

const { PUBLIC_DIR } = require("./config/paths.js");

const app = express();

app.use(express.json());
app.use(express.static(PUBLIC_DIR));

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/v1", pollsRoutes);
app.use("/api/v1", usersRoutes);
app.use("/api/v1", authRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
