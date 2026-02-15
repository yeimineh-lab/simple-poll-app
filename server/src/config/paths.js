const path = require("path");

// __dirname = server/src/config
const SERVER = path.join(__dirname, "..", "..");

module.exports = {
  SERVER,
  PUBLIC_DIR: path.join(SERVER, "public"),
  DATA_DIR: path.join(SERVER, "data"),
};
