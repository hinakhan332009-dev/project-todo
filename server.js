require("dotenv").config();
const app = require("./app");

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

function normalizePort(val) {
  const portNumber = parseInt(val, 10);
  if (Number.isNaN(portNumber)) return val;
  if (portNumber >= 0) return portNumber;
  return false;
}

module.exports = app;
