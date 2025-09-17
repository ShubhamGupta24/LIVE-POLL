// socket.js
const { Server } = require("socket.io");
const { handlePollEvents } = require("./controllers/pollController");

let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: { origin: "*" },
    });

    io.on("connection", (socket) => {
        const { userName, role } = socket.handshake.query;

        console.log(
            `🔌 New connection: ${socket.id} | userName: ${userName || "N/A"} | role: ${role || "N/A"}`
        );

        // Example: separate logic for teacher vs student
        if (role === "teacher") {
            socket.join("teachers");
            console.log(`🧑‍🏫 Teacher joined (ID: ${socket.id})`);
        } else {
            socket.join("students");
            console.log(`🎓 Student joined: ${userName || "Anonymous"} (${socket.id})`);
        }

        // Handle poll-related events
        handlePollEvents(io, socket);
    });
};

const getIO = () => {
    if (!io) throw new Error("Socket.io not initialized!");
    return io;
};

module.exports = { initSocket, getIO };
