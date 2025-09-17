// src/socket.js
import { io } from "socket.io-client";

let socket;

// connect only when called
export const initSocket = ({ userName, role } = {}) => {
    if (!socket) {
        const query = {};

        if (userName) query.userName = userName;
        if (role) query.role = role;

        socket = io("http://localhost:5000", {
            transports: ["websocket"],
            query, // send only what is provided
        });
    }
    return socket;
};

export const getSocket = () => socket;
