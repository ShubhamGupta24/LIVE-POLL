// server.js
const express = require("express");
const { initSocket } = require("./socket");
const pollRoutes = require("./routes/pollRoutes");
const cors = require("cors");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/polls", require("./routes/pollRoutes"));

// Start server
const PORT = 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Initialize Socket.io
initSocket(server);
