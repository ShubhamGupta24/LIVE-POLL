// server.js
require('dotenv').config();
const express = require("express");
const { initSocket } = require("./socket");
const pollRoutes = require("./routes/pollRoutes");
const cors = require("cors");

const app = express();

const corsOptions = {
    origin: "*",
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// routes
app.use("/api/polls", pollRoutes);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Initialize Socket.io
initSocket(server);
