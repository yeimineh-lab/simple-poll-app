const express = require("express");
const pollsRoutes = require("./routes/polls.routes.js");


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// optional: gjør at / ikke er "Cannot GET /"
app.get("/", (req, res) => {
  res.send("Simple Poll API is running");
});

// mount routes
app.use("/api/v1", pollsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
